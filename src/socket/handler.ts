import { Server, Socket } from "socket.io";
import { createRoom, getWaitingPlayer, setWaitingPlayer } from "../game/roomStore";
import { Symbol } from "../types/rooms";

export const socketHandler = (io: Server, socket: Socket) => {
    const waiting = getWaitingPlayer();

    if (!waiting) {
        setWaitingPlayer(socket.id)
    } else {
        const { roomId, room } = createRoom(waiting, socket.id);

        io.to(waiting).socketsJoin(roomId);
        socket.join(roomId);

        //player X;
        io.to(waiting).emit("start_game", {
            roomId,
            board: [...room.board],
            currentTurn: [...room.currentTurn],
            mySymbol: "X" as Symbol
        })
        //player O
        io.to(socket.id).emit("start_game", {
            roomId,
            board: [...room.board],
            currentTurn: [...room.currentTurn],
            mySymbol: "O" as Symbol
        })
        //clearing waiting player
        setWaitingPlayer(null);
    }
}