export type TechKey = "FE" | "API" | "DB" | "AI";

export type Shape = number[][];

export type BoardCell = {
  tech: TechKey;
} | null;

export type DisplayCell = {
  active: boolean;
  ghost: boolean;
  tech: TechKey;
} | null;

export type Piece = {
  col: number;
  row: number;
  shape: Shape;
  tech: TechKey;
};

export type GameStatus = "ready" | "playing" | "paused" | "gameover";

export type GameState = {
  board: BoardCell[][];
  level: number;
  lines: number;
  nextPiece: Piece;
  piece: Piece;
  score: number;
  status: GameStatus;
};
