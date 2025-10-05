import type { LedgerLine } from "./LedgerLine";

export interface Note {
  name: string;
  noteType: string;
  position: number;
  shiftLinePosition: number | undefined;
  lines?: LedgerLine;
}
