export type Symbol = "X" | "O";

export interface Room {
    player: [string, string];
    board: [Symbol | null][];
    currentTurn: Symbol;
}