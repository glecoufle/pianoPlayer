import type { Note } from "./Note";

export interface AnimatedNote {
  id: number;
  x: number;
  y: number;
  isHighlighted: boolean;
  note: Note;
  error: boolean;
}
