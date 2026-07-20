import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  PIECE_SHAPES,
  TECH_KEYS,
} from "./stack-builder.constants";
import type {
  BoardCell,
  DisplayCell,
  GameState,
  GameStatus,
  Piece,
  Shape,
} from "./stack-builder.types";

const LINE_SCORES = [0, 100, 300, 500, 800];

export function createEmptyBoard(): BoardCell[][] {
  return Array.from({ length: BOARD_HEIGHT }, () => Array<BoardCell>(BOARD_WIDTH).fill(null));
}

function cloneShape(shape: Shape) {
  return shape.map((row) => [...row]);
}

export function createRandomPiece(): Piece {
  const shape = cloneShape(PIECE_SHAPES[Math.floor(Math.random() * PIECE_SHAPES.length)]);
  const tech = TECH_KEYS[Math.floor(Math.random() * TECH_KEYS.length)];

  return {
    col: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
    row: 0,
    shape,
    tech,
  };
}

export function createGame(status: GameStatus = "ready"): GameState {
  return {
    board: createEmptyBoard(),
    level: 1,
    lines: 0,
    nextPiece: createRandomPiece(),
    piece: createRandomPiece(),
    score: 0,
    status,
  };
}

function canPlace(board: BoardCell[][], piece: Piece, row: number, col: number, shape = piece.shape) {
  for (let y = 0; y < shape.length; y += 1) {
    for (let x = 0; x < shape[y].length; x += 1) {
      if (!shape[y][x]) continue;

      const boardRow = row + y;
      const boardCol = col + x;

      if (
        boardCol < 0 ||
        boardCol >= BOARD_WIDTH ||
        boardRow >= BOARD_HEIGHT ||
        (boardRow >= 0 && board[boardRow][boardCol])
      ) {
        return false;
      }
    }
  }

  return true;
}

function rotateShape(shape: Shape): Shape {
  return shape[0].map((_, column) => shape.map((row) => row[column]).reverse());
}

function clearCompletedLines(board: BoardCell[][]) {
  const remainingRows = board.filter((row) => row.some((cell) => cell === null));
  const cleared = BOARD_HEIGHT - remainingRows.length;
  const emptyRows = Array.from({ length: cleared }, () => Array<BoardCell>(BOARD_WIDTH).fill(null));

  return { board: [...emptyRows, ...remainingRows], cleared };
}

function lockPiece(state: GameState): GameState {
  const board = state.board.map((row) => [...row]);

  for (let y = 0; y < state.piece.shape.length; y += 1) {
    for (let x = 0; x < state.piece.shape[y].length; x += 1) {
      if (!state.piece.shape[y][x]) continue;

      const boardRow = state.piece.row + y;
      const boardCol = state.piece.col + x;
      if (boardRow < 0) return { ...state, status: "gameover" };
      board[boardRow][boardCol] = { tech: state.piece.tech };
    }
  }

  const result = clearCompletedLines(board);
  const totalLines = state.lines + result.cleared;
  const level = Math.floor(totalLines / 10) + 1;
  const piece = {
    ...state.nextPiece,
    col: Math.floor((BOARD_WIDTH - state.nextPiece.shape[0].length) / 2),
    row: 0,
  };
  const nextState: GameState = {
    ...state,
    board: result.board,
    level,
    lines: totalLines,
    nextPiece: createRandomPiece(),
    piece,
    score: state.score + LINE_SCORES[result.cleared] * state.level,
  };

  return canPlace(nextState.board, piece, piece.row, piece.col)
    ? nextState
    : { ...nextState, status: "gameover" };
}

export function moveHorizontally(state: GameState, direction: -1 | 1): GameState {
  if (state.status !== "playing") return state;
  const nextCol = state.piece.col + direction;

  return canPlace(state.board, state.piece, state.piece.row, nextCol)
    ? { ...state, piece: { ...state.piece, col: nextCol } }
    : state;
}

export function rotateCurrentPiece(state: GameState): GameState {
  if (state.status !== "playing") return state;
  const shape = rotateShape(state.piece.shape);

  for (const offset of [0, -1, 1, -2, 2]) {
    const nextCol = state.piece.col + offset;
    if (canPlace(state.board, state.piece, state.piece.row, nextCol, shape)) {
      return { ...state, piece: { ...state.piece, col: nextCol, shape } };
    }
  }

  return state;
}

export function dropPiece(state: GameState, softDrop = false): GameState {
  if (state.status !== "playing") return state;
  const nextRow = state.piece.row + 1;

  if (canPlace(state.board, state.piece, nextRow, state.piece.col)) {
    return {
      ...state,
      piece: { ...state.piece, row: nextRow },
      score: state.score + (softDrop ? 1 : 0),
    };
  }

  return lockPiece(state);
}

export function hardDropPiece(state: GameState): GameState {
  if (state.status !== "playing") return state;
  let row = state.piece.row;

  while (canPlace(state.board, state.piece, row + 1, state.piece.col)) row += 1;

  const distance = row - state.piece.row;
  return lockPiece({
    ...state,
    piece: { ...state.piece, row },
    score: state.score + distance * 2,
  });
}

export function togglePause(state: GameState): GameState {
  if (state.status === "playing") return { ...state, status: "paused" };
  if (state.status === "paused") return { ...state, status: "playing" };
  return state;
}

export function getDisplayBoard(state: GameState): DisplayCell[][] {
  const board: DisplayCell[][] = state.board.map((row) =>
    row.map((cell) => (cell ? { ...cell, active: false } : null)),
  );

  if (state.status === "gameover") return board;

  for (let y = 0; y < state.piece.shape.length; y += 1) {
    for (let x = 0; x < state.piece.shape[y].length; x += 1) {
      if (!state.piece.shape[y][x]) continue;
      const boardRow = state.piece.row + y;
      const boardCol = state.piece.col + x;
      if (boardRow >= 0 && boardRow < BOARD_HEIGHT) {
        board[boardRow][boardCol] = { active: true, tech: state.piece.tech };
      }
    }
  }

  return board;
}
