import { Room } from "../types/rooms";

const rooms: Record<string, Room> = {};

let waitingPlayer: string | null = null;

export const getWaitingPlayer = () => waitingPlayer;

//setting waitingPlayer
export const setWaitingPlayer = (socketId: string | null) => {
    waitingPlayer = socketId;
};

//creating the room
export const createRoom = (p1: string, p2: string) => {
    const roomId = `room-${p1}-${p2}`
    const room: Room = {
        player: [p1, p2],
        board: Array(9).fill(null),
        currentTurn: "X",
    }

    //Save the room
    rooms[roomId] = room

    return { roomId, room }
}

//get room by id
export const getRoom = (roomId: string) => {
    return rooms[roomId] ?? null;
}