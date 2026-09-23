import { Room } from "../types/rooms";

const rooms: Record<string, Room> = {};

let waitingPlayer: string | null = null;

export const getWaitingPlayer = () => waitingPlayer;

export const setWaitingPlayer = (socketId: string | null) => {
    waitingPlayer = socketId;
};

export const createRoom = (p1: string, p2: string) => {
    const roomId = `room-${p1}-${p2}`
    const room: Room = {
        player: [p1, p2],
        board: Array(9).fill(null),
        currentTurn: "X",
    }
}