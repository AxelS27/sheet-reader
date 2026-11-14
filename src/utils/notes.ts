import { NoteItem, GameModeConfig } from '@/types/game';

// Treble Clef: Ascending from C4 to C5 (8 notes)
export const TREBLE_PROGRESSION: NoteItem[] = [
  { midi: 60, name: 'C4', solfege: 'Do', color: '#EF4444', clef: 'treble', hasLedgerLine: true },
  { midi: 62, name: 'D4', solfege: 'Re', color: '#F97316', clef: 'treble' },
  { midi: 64, name: 'E4', solfege: 'Mi', color: '#FACC15', clef: 'treble' },
  { midi: 65, name: 'F4', solfege: 'Fa', color: '#10B981', clef: 'treble' },
  { midi: 67, name: 'G4', solfege: 'Sol', color: '#06B6D4', clef: 'treble' },
  { midi: 69, name: 'A4', solfege: 'La', color: '#3B82F6', clef: 'treble' },
  { midi: 71, name: 'B4', solfege: 'Ti', color: '#8B5CF6', clef: 'treble' },
  { midi: 72, name: 'C5', solfege: 'High Do', color: '#EC4899', clef: 'treble' },
];

// Bass Clef: Ascending from C3 to C4 (8 notes)
export const BASS_PROGRESSION: NoteItem[] = [
  { midi: 48, name: 'C3', solfege: 'Low Do', color: '#EC4899', clef: 'bass' },
  { midi: 50, name: 'D3', solfege: 'Low Re', color: '#8B5CF6', clef: 'bass' },
  { midi: 52, name: 'E3', solfege: 'Low Mi', color: '#3B82F6', clef: 'bass' },
  { midi: 53, name: 'F3', solfege: 'Low Fa', color: '#06B6D4', clef: 'bass' },
  { midi: 55, name: 'G3', solfege: 'Low Sol', color: '#10B981', clef: 'bass' },
  { midi: 57, name: 'A3', solfege: 'Low La', color: '#FACC15', clef: 'bass' },
  { midi: 59, name: 'B3', solfege: 'Low Ti', color: '#F97316', clef: 'bass' },
  { midi: 60, name: 'C4', solfege: 'Middle Do', color: '#EF4444', clef: 'bass', hasLedgerLine: true },
];

// Grand Staff: Full 15-note climb from C3 to C5 (Bass C3-B3 -> Middle C4 -> Treble D4-C5)
export const C3_TO_C5_NOTES: NoteItem[] = [
  { midi: 48, name: 'C3', solfege: 'Low Do', color: '#EC4899', clef: 'bass' },
  { midi: 50, name: 'D3', solfege: 'Low Re', color: '#8B5CF6', clef: 'bass' },
  { midi: 52, name: 'E3', solfege: 'Low Mi', color: '#3B82F6', clef: 'bass' },
  { midi: 53, name: 'F3', solfege: 'Low Fa', color: '#06B6D4', clef: 'bass' },
  { midi: 55, name: 'G3', solfege: 'Low Sol', color: '#10B981', clef: 'bass' },
  { midi: 57, name: 'A3', solfege: 'Low La', color: '#FACC15', clef: 'bass' },
  { midi: 59, name: 'B3', solfege: 'Low Ti', color: '#F97316', clef: 'bass' },
  { midi: 60, name: 'C4', solfege: 'Middle Do', color: '#EF4444', clef: 'treble', hasLedgerLine: true },
  { midi: 62, name: 'D4', solfege: 'Re', color: '#F97316', clef: 'treble' },
  { midi: 64, name: 'E4', solfege: 'Mi', color: '#FACC15', clef: 'treble' },
  { midi: 65, name: 'F4', solfege: 'Fa', color: '#10B981', clef: 'treble' },
  { midi: 67, name: 'G4', solfege: 'Sol', color: '#06B6D4', clef: 'treble' },
  { midi: 69, name: 'A4', solfege: 'La', color: '#3B82F6', clef: 'treble' },
  { midi: 71, name: 'B4', solfege: 'Ti', color: '#8B5CF6', clef: 'treble' },
  { midi: 72, name: 'C5', solfege: 'High Do', color: '#EC4899', clef: 'treble' },
];

export const TREBLE_NOTES = TREBLE_PROGRESSION;
export const BASS_NOTES = BASS_PROGRESSION;

export const GAME_MODES: GameModeConfig[] = [
  {
    id: 'treble',
    title: 'Treble Clef',
    subtitle: 'Right Hand Path',
    badge: 'C4 to C5',
    icon: '🎼',
    color: 'from-amber-400 to-amber-500',
    borderColor: 'border-amber-400',
    shadowColor: 'shadow-fun-yellow',
    noteCount: '8 Notes (C4 to C5)',
    description: 'Climb the Treble Kingdom from Middle C (C4) to High C (C5).',
    clefs: ['treble'],
  },
  {
    id: 'bass',
    title: 'Bass Clef',
    subtitle: 'Left Hand Path',
    badge: 'C3 to C4',
    icon: '🎹',
    color: 'from-sky-400 to-sky-500',
    borderColor: 'border-sky-400',
    shadowColor: 'shadow-fun-blue',
    noteCount: '8 Notes (C3 to C4)',
    description: 'Climb the Bass Valley from low C3 up to Middle C (C4).',
    clefs: ['bass'],
  },
  {
    id: 'grand',
    title: 'Grand Staff',
    subtitle: 'Full Mountain Pilgrimage',
    badge: 'C3 to C5',
    icon: '🌟',
    color: 'from-purple-400 to-purple-500',
    borderColor: 'border-purple-400',
    shadowColor: 'shadow-fun-purple',
    noteCount: '15 Notes (C3 to C5)',
    description: 'The master quest! 15 notes connecting low C3 through Middle C4 to high C5.',
    clefs: ['treble', 'bass'],
  },
];
