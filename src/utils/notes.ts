import { NoteItem, GameModeConfig } from '@/types/game';

export interface PitchLevel {
  levelNumber: number; // 1 to 12
  pitchClass: string; // 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C#', 'D#', 'F#', 'G#', 'A#'
  displayName: string;
  solfege: string;
  color: string;
  isAccidental: boolean;
  semitone: number; // 0=C, 1=C#, 2=D, 3=D#, 4=E, 5=F, 6=F#, 7=G, 8=G#, 9=A, 10=A#, 11=B
}

// 12 Pitch-Class Levels: 7 Naturals first, then 5 Accidentals/Black keys
export const PITCH_LEVELS: PitchLevel[] = [
  { levelNumber: 1, pitchClass: 'C', displayName: 'C', solfege: 'Do', color: '#EF4444', isAccidental: false, semitone: 0 },
  { levelNumber: 2, pitchClass: 'D', displayName: 'D', solfege: 'Re', color: '#F97316', isAccidental: false, semitone: 2 },
  { levelNumber: 3, pitchClass: 'E', displayName: 'E', solfege: 'Mi', color: '#FACC15', isAccidental: false, semitone: 4 },
  { levelNumber: 4, pitchClass: 'F', displayName: 'F', solfege: 'Fa', color: '#10B981', isAccidental: false, semitone: 5 },
  { levelNumber: 5, pitchClass: 'G', displayName: 'G', solfege: 'Sol', color: '#06B6D4', isAccidental: false, semitone: 7 },
  { levelNumber: 6, pitchClass: 'A', displayName: 'A', solfege: 'La', color: '#3B82F6', isAccidental: false, semitone: 9 },
  { levelNumber: 7, pitchClass: 'B', displayName: 'B', solfege: 'Ti', color: '#8B5CF6', isAccidental: false, semitone: 11 },
  // Accidentals (Black Keys)
  { levelNumber: 8, pitchClass: 'C#', displayName: 'C♯', solfege: 'Do♯', color: '#EC4899', isAccidental: true, semitone: 1 },
  { levelNumber: 9, pitchClass: 'D#', displayName: 'D♯', solfege: 'Re♯', color: '#FB923C', isAccidental: true, semitone: 3 },
  { levelNumber: 10, pitchClass: 'F#', displayName: 'F♯', solfege: 'Fa♯', color: '#34D399', isAccidental: true, semitone: 6 },
  { levelNumber: 11, pitchClass: 'G#', displayName: 'G♯', solfege: 'Sol♯', color: '#38BDF8', isAccidental: true, semitone: 8 },
  { levelNumber: 12, pitchClass: 'A#', displayName: 'A♯ / B♭', solfege: 'La♯', color: '#A78BFA', isAccidental: true, semitone: 10 },
];

export interface NoteInstance extends NoteItem {
  pitchClass: string;
  hasSharp?: boolean;
}

// Complete Diatonic & Chromatic Note Instances from C3 up to C6:
// Treble Clef Range: C4 (60) up to C6 (84)
// Bass Clef Range: C3 (48) up to C4 (60)
// Grand Staff Range: C3 (48) up to C6 (84)

// All Notes for Treble (C4 up to C6)
export const ALL_TREBLE_NOTES: NoteInstance[] = [
  // Octave 4
  { midi: 60, name: 'C4', pitchClass: 'C', solfege: 'Do', color: '#EF4444', clef: 'treble', hasLedgerLine: true },
  { midi: 61, name: 'C#4', pitchClass: 'C#', solfege: 'Do♯', color: '#EC4899', clef: 'treble', hasLedgerLine: true, hasSharp: true },
  { midi: 62, name: 'D4', pitchClass: 'D', solfege: 'Re', color: '#F97316', clef: 'treble' },
  { midi: 63, name: 'D#4', pitchClass: 'D#', solfege: 'Re♯', color: '#FB923C', clef: 'treble', hasSharp: true },
  { midi: 64, name: 'E4', pitchClass: 'E', solfege: 'Mi', color: '#FACC15', clef: 'treble' },
  { midi: 65, name: 'F4', pitchClass: 'F', solfege: 'Fa', color: '#10B981', clef: 'treble' },
  { midi: 66, name: 'F#4', pitchClass: 'F#', solfege: 'Fa♯', color: '#34D399', clef: 'treble', hasSharp: true },
  { midi: 67, name: 'G4', pitchClass: 'G', solfege: 'Sol', color: '#06B6D4', clef: 'treble' },
  { midi: 68, name: 'G#4', pitchClass: 'G#', solfege: 'Sol♯', color: '#38BDF8', clef: 'treble', hasSharp: true },
  { midi: 69, name: 'A4', pitchClass: 'A', solfege: 'La', color: '#3B82F6', clef: 'treble' },
  { midi: 70, name: 'A#4', pitchClass: 'A#', solfege: 'La♯', color: '#A78BFA', clef: 'treble', hasSharp: true },
  { midi: 71, name: 'B4', pitchClass: 'B', solfege: 'Ti', color: '#8B5CF6', clef: 'treble' },

  // Octave 5
  { midi: 72, name: 'C5', pitchClass: 'C', solfege: 'Do', color: '#EF4444', clef: 'treble' },
  { midi: 73, name: 'C#5', pitchClass: 'C#', solfege: 'Do♯', color: '#EC4899', clef: 'treble', hasSharp: true },
  { midi: 74, name: 'D5', pitchClass: 'D', solfege: 'Re', color: '#F97316', clef: 'treble' },
  { midi: 75, name: 'D#5', pitchClass: 'D#', solfege: 'Re♯', color: '#FB923C', clef: 'treble', hasSharp: true },
  { midi: 76, name: 'E5', pitchClass: 'E', solfege: 'Mi', color: '#FACC15', clef: 'treble' },
  { midi: 77, name: 'F5', pitchClass: 'F', solfege: 'Fa', color: '#10B981', clef: 'treble' },
  { midi: 78, name: 'F#5', pitchClass: 'F#', solfege: 'Fa♯', color: '#34D399', clef: 'treble', hasSharp: true },
  { midi: 79, name: 'G5', pitchClass: 'G', solfege: 'Sol', color: '#06B6D4', clef: 'treble' },
  { midi: 80, name: 'G#5', pitchClass: 'G#', solfege: 'Sol♯', color: '#38BDF8', clef: 'treble', hasSharp: true },
  { midi: 81, name: 'A5', pitchClass: 'A', solfege: 'La', color: '#3B82F6', clef: 'treble', hasLedgerLine: true },
  { midi: 82, name: 'A#5', pitchClass: 'A#', solfege: 'La♯', color: '#A78BFA', clef: 'treble', hasLedgerLine: true, hasSharp: true },
  { midi: 83, name: 'B5', pitchClass: 'B', solfege: 'Ti', color: '#8B5CF6', clef: 'treble', hasLedgerLine: true },

  // Octave 6 Summit
  { midi: 84, name: 'C6', pitchClass: 'C', solfege: 'High C', color: '#EF4444', clef: 'treble', hasLedgerLine: true },
];

// All Notes for Bass (C3 up to C4)
export const ALL_BASS_NOTES: NoteInstance[] = [
  // Octave 3
  { midi: 48, name: 'C3', pitchClass: 'C', solfege: 'Low Do', color: '#EF4444', clef: 'bass' },
  { midi: 49, name: 'C#3', pitchClass: 'C#', solfege: 'Low Do♯', color: '#EC4899', clef: 'bass', hasSharp: true },
  { midi: 50, name: 'D3', pitchClass: 'D', solfege: 'Low Re', color: '#F97316', clef: 'bass' },
  { midi: 51, name: 'D#3', pitchClass: 'D#', solfege: 'Low Re♯', color: '#FB923C', clef: 'bass', hasSharp: true },
  { midi: 52, name: 'E3', pitchClass: 'E', solfege: 'Low Mi', color: '#FACC15', clef: 'bass' },
  { midi: 53, name: 'F3', pitchClass: 'F', solfege: 'Low Fa', color: '#10B981', clef: 'bass' },
  { midi: 54, name: 'F#3', pitchClass: 'F#', solfege: 'Low Fa♯', color: '#34D399', clef: 'bass', hasSharp: true },
  { midi: 55, name: 'G3', pitchClass: 'G', solfege: 'Low Sol', color: '#06B6D4', clef: 'bass' },
  { midi: 56, name: 'G#3', pitchClass: 'G#', solfege: 'Low Sol♯', color: '#38BDF8', clef: 'bass', hasSharp: true },
  { midi: 57, name: 'A3', pitchClass: 'A', solfege: 'Low La', color: '#3B82F6', clef: 'bass' },
  { midi: 58, name: 'A#3', pitchClass: 'A#', solfege: 'Low La♯', color: '#A78BFA', clef: 'bass', hasSharp: true },
  { midi: 59, name: 'B3', pitchClass: 'B', solfege: 'Low Ti', color: '#8B5CF6', clef: 'bass' },

  // Octave 4 Middle C anchor in Bass
  { midi: 60, name: 'C4', pitchClass: 'C', solfege: 'Middle Do', color: '#EF4444', clef: 'bass', hasLedgerLine: true },
];

// All Notes for Grand Staff (C3 up to C6 combined)
export const ALL_GRAND_NOTES: NoteInstance[] = [
  ...ALL_BASS_NOTES,
  ...ALL_TREBLE_NOTES.filter((n) => n.midi > 60), // C4 is already in Bass, avoid duplicate C4
];

// Helper: Filter note instances by unlocked pitch classes
export function getUnlockedNoteInstances(
  modeId: 'treble' | 'bass' | 'grand',
  unlockedLevelNumber: number // 1 to 12
): NoteInstance[] {
  const allowedPitchClasses = new Set(
    PITCH_LEVELS.slice(0, Math.min(12, Math.max(1, unlockedLevelNumber))).map((p) => p.pitchClass)
  );

  const fullList =
    modeId === 'bass' ? ALL_BASS_NOTES : modeId === 'grand' ? ALL_GRAND_NOTES : ALL_TREBLE_NOTES;

  return fullList.filter((note) => allowedPitchClasses.has(note.pitchClass));
}

// Backward compatibility exports
export const TREBLE_PROGRESSION = ALL_TREBLE_NOTES.filter((n) => !n.hasSharp);
export const BASS_PROGRESSION = ALL_BASS_NOTES.filter((n) => !n.hasSharp);
export const C3_TO_C5_NOTES = ALL_GRAND_NOTES.filter((n) => !n.hasSharp);
export const TREBLE_NOTES = TREBLE_PROGRESSION;
export const BASS_NOTES = BASS_PROGRESSION;

export const GAME_MODES: GameModeConfig[] = [
  {
    id: 'treble',
    title: 'Treble Clef',
    subtitle: 'Right Hand Journey',
    badge: '12 Pitch Levels',
    icon: '🎼',
    color: 'from-amber-400 to-amber-500',
    borderColor: 'border-amber-400',
    shadowColor: 'shadow-fun-yellow',
    noteCount: '12 Levels (C to B♭)',
    description: 'Learn note positions across octaves: from C (C4, C5, C6) through all 12 musical keys!',
    clefs: ['treble'],
  },
  {
    id: 'bass',
    title: 'Bass Clef',
    subtitle: 'Left Hand Journey',
    badge: '12 Pitch Levels',
    icon: '🎹',
    color: 'from-sky-400 to-sky-500',
    borderColor: 'border-sky-400',
    shadowColor: 'shadow-fun-blue',
    noteCount: '12 Levels (C to B♭)',
    description: 'Master low bassline recognition from C (C3, C4) through all 12 musical keys.',
    clefs: ['bass'],
  },
  {
    id: 'grand',
    title: 'Grand Staff',
    subtitle: 'Full Mountain Pilgrimage',
    badge: '12 Pitch Levels',
    icon: '🌟',
    color: 'from-purple-400 to-purple-500',
    borderColor: 'border-purple-400',
    shadowColor: 'shadow-fun-purple',
    noteCount: '12 Levels (C to B♭)',
    description: 'The master quest! Recognize all 12 pitch classes across C3, C4, C5, and C6!',
    clefs: ['treble', 'bass'],
  },
];
