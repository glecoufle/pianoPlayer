import type { Note } from "../types/Note";

// Notes for the first range
export const firstRangeNotes: { [key: string]: Note } = {
  C4: {
    name: "C4",
    noteType: "Do",
    position: 5,
    shiftLinePosition: 0,
  },
  B3: {
    name: "B3",
    noteType: "Si",
    position: 10,
    shiftLinePosition: 0,
  },
  A3: {
    name: "A3",
    noteType: "La",
    position: 15,
    shiftLinePosition: 0,
  },
  G3: {
    name: "G3",
    noteType: "Sol",
    position: 20,
    shiftLinePosition: 0,
  },
  F3: {
    name: "F3",
    noteType: "Fa",
    position: 25,
    shiftLinePosition: 0,
  },
  E3: {
    name: "E3",
    noteType: "Mi",
    position: 30,
    shiftLinePosition: 0,
  },
  D3: {
    name: "D3",
    noteType: "Re",
    position: 35,
    shiftLinePosition: 0,
  },
  C3: {
    name: "C3",
    noteType: "Do",
    position: 40,
    shiftLinePosition: 0,
    lines: { below1: true },
  },
};

// Notes for the 2 first ranges
export const secondRangeNotes: { [key: string]: Note } = {
  C5: {
    name: "C5",
    noteType: "Do",
    position: -30,
    shiftLinePosition: 20,
    lines: { above1: true, above2: true },
  },
  B4: {
    name: "B4",
    noteType: "Si",
    position: -25,
    shiftLinePosition: 30,
    lines: { above1: true },
  },
  A4: {
    name: "A4",
    noteType: "La",
    position: -20,
    shiftLinePosition: 40,
    lines: { above1: true },
  },
  G4: {
    name: "G4",
    noteType: "Sol",
    position: -15,
    shiftLinePosition: 0,
  },
  F4: {
    name: "F4",
    noteType: "Fa",
    position: -11,
    shiftLinePosition: 0,
  },
  E4: {
    name: "E4",
    noteType: "Mi",
    position: -5,
    shiftLinePosition: 0,
  },
  D4: {
    name: "D4",
    noteType: "Re",
    position: 0.1,
    shiftLinePosition: 0,
  },
  ...firstRangeNotes,
};

// Notes for the 3 ranges
export const thirdRangeNotes: { [key: string]: Note } = {
  E5: {
    name: "E5",
    noteType: "Mi",
    position: -40,
    shiftLinePosition: 0,
    lines: { above1: true, above2: true, above3: true },
  },
  D5: {
    name: "D5",
    noteType: "Re",
    position: -35,
    shiftLinePosition: 10,
    lines: { above1: true, above2: true, above3: false },
  },
  ...secondRangeNotes,
  Si2: {
    name: "B2",
    noteType: "Si",
    position: 45,
    shiftLinePosition: 10,
    lines: { below1: true },
  },
  La2: {
    name: "A2",
    noteType: "La",
    position: 50,
    shiftLinePosition: 20,
    lines: { below1: true, below2: true },
  },
  Sol2: {
    name: "G2",
    noteType: "Sol",
    position: 55,
    shiftLinePosition: 30,
    lines: { below1: true, below2: true },
  },
  Fa2: {
    name: "F2",
    noteType: "Fa",
    position: 60,
    shiftLinePosition: 40,
    lines: { below1: true, below2: true, below3: true },
  },
};

export const getRangeNotes = (nbRange: number): { [key: string]: Note } => {
  switch (nbRange) {
    case 1:
      return firstRangeNotes;
    case 2:
      return secondRangeNotes;
    case 3:
      return thirdRangeNotes;
    default:
      return thirdRangeNotes;
  }
};

// Get a random note from allNotes
export const getRandomNote = (nbRange: number): Note => {
  switch (nbRange) {
    case 1:
      return getRandomFromSet(firstRangeNotes);
    case 2:
      return getRandomFromSet(secondRangeNotes);
    case 3:
      return getRandomFromSet(thirdRangeNotes);
    default:
      return getRandomFromSet(thirdRangeNotes);
  }
};

const getRandomFromSet = (allNotes: { [key: string]: Note }): Note => {
  const noteNames = Object.keys(allNotes);
  const randomName = noteNames[Math.floor(Math.random() * noteNames.length)];
  return allNotes[randomName];
};

export const getColorNote = (noteName: string): string => {
  switch (noteName) {
    case "Do":
      return "#FF0000"; // Red
    case "Re":
      return "#FF7F00"; // Orange
    case "Mi":
      return "#FFFF00"; // Yellow
    case "Fa":
      return "#00FF00"; // Green
    case "Sol":
      return "#0000FF"; // Blue
    case "La":
      return "#4B0082"; // Indigo
    case "Si":
      return "#8B00FF"; // Purple
    default:
      break;
  }
  return "#333"; // Default color black
};
