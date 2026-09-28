import { Server, Socket } from "socket.io";
import { createRoom, getRoom, getWaitingPlayer, setWaitingPlayer } from "../game/roomStore";
import { Symbol } from "../types/rooms";
import { checkWinner, isDraw } from "../game/logic";

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

    interface MakeMoveData {
        roomId: string;
        index: number;
        symbol: Symbol;
    }

    socket.on("make_move", ({ roomId, index, symbol }: MakeMoveData) => {
        const room = getRoom(roomId);
        if (!room) return;

        //validate move
        if (room.board[index] || room.currentTurn !== symbol) return;

        //if its valid move, update here
        room.board[index] = symbol;
        room.currentTurn = symbol === "X" ? "O" : "X";

        const winner = checkWinner(room.board);
        const draw = !winner && isDraw(room.board);

        if (winner || draw) {
            io.to(roomId).emit("game_over", {
                board: [...room.board],
                winner,
                draw
            })
        } else {
            io.to(roomId).emit("game_state", {
                board: [...room.board],
                currentTurn: room.currentTurn,
            })
        }

    })
};

