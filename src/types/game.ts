export type ClefType = 'treble' | 'bass';

export type GameModeId = 'treble' | 'bass' | 'grand';

export interface NoteItem {
  midi: number;
  name: string; // 'C4', 'G3', etc.
  solfege: string; // 'Do', 'Re', 'Mi', etc.
  color: string;
  clef: ClefType;
  hasLedgerLine?: boolean;
}

export interface GameModeConfig {
  id: GameModeId;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  color: string;
  borderColor: string;
  shadowColor: string;
  noteCount: string;
  description: string;
  clefs: ClefType[];
}
