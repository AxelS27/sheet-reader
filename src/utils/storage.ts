import { GameModeId } from '@/types/game';

export interface ModeProgress {
  level: number;
  hitsInLevel: number;
  isMastered: boolean;
}

export interface UserProgressData {
  totalStars: number;
  bestStreak: number;
  modes: Record<GameModeId, ModeProgress>;
}

export interface PianoSettings {
  keyWidth: number;
  showLabels: boolean;
}

export type NoteSpeed = 'slow' | 'medium' | 'fast';
export type NoteColorMode = 'colorful' | 'black';

export interface PracticeSettings {
  speed: NoteSpeed;
  colorMode: NoteColorMode;
}

const STORAGE_KEY = 'notey_game_progress_v1';
const PIANO_SETTINGS_KEY = 'notey_piano_settings_v1';
const PRACTICE_SETTINGS_KEY = 'notey_practice_settings_v1';

const DEFAULT_PROGRESS: UserProgressData = {
  totalStars: 0,
  bestStreak: 0,
  modes: {
    treble: { level: 1, hitsInLevel: 0, isMastered: false },
    bass: { level: 1, hitsInLevel: 0, isMastered: false },
    grand: { level: 1, hitsInLevel: 0, isMastered: false },
  },
};

const DEFAULT_PIANO_SETTINGS: PianoSettings = {
  keyWidth: 38,
  showLabels: true,
};

const DEFAULT_PRACTICE_SETTINGS: PracticeSettings = {
  speed: 'medium',
  colorMode: 'colorful',
};

export const progressStorage = {
  get(): UserProgressData {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_PROGRESS;
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        modes: {
          ...DEFAULT_PROGRESS.modes,
          ...(parsed.modes || {}),
        },
      };
    } catch (e) {
      console.warn('Failed to read Notey progress from localStorage:', e);
      return DEFAULT_PROGRESS;
    }
  },

  save(data: UserProgressData) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save Notey progress to localStorage:', e);
    }
  },

  getModeProgress(modeId: GameModeId): ModeProgress {
    const data = this.get();
    return data.modes[modeId] || { level: 1, hitsInLevel: 0, isMastered: false };
  },

  saveModeProgress(
    modeId: GameModeId,
    level: number,
    hitsInLevel: number,
    isMastered = false
  ) {
    const data = this.get();
    data.modes[modeId] = {
      level,
      hitsInLevel,
      isMastered,
    };
    this.save(data);
  },

  addStars(starsEarned: number): number {
    const data = this.get();
    data.totalStars = (data.totalStars || 0) + starsEarned;
    this.save(data);
    return data.totalStars;
  },

  recordStreak(currentStreak: number): number {
    const data = this.get();
    if (currentStreak > (data.bestStreak || 0)) {
      data.bestStreak = currentStreak;
      this.save(data);
    }
    return data.bestStreak;
  },

  resetAll(): UserProgressData {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    return DEFAULT_PROGRESS;
  },

  // Piano UI Settings
  getPianoSettings(): PianoSettings {
    if (typeof window === 'undefined') return DEFAULT_PIANO_SETTINGS;
    try {
      const raw = localStorage.getItem(PIANO_SETTINGS_KEY);
      if (!raw) return DEFAULT_PIANO_SETTINGS;
      return {
        ...DEFAULT_PIANO_SETTINGS,
        ...JSON.parse(raw),
      };
    } catch {
      return DEFAULT_PIANO_SETTINGS;
    }
  },

  savePianoSettings(settings: Partial<PianoSettings>) {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getPianoSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(PIANO_SETTINGS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  // Practice Settings (Speed & Note Color Mode)
  getPracticeSettings(): PracticeSettings {
    if (typeof window === 'undefined') return DEFAULT_PRACTICE_SETTINGS;
    try {
      const raw = localStorage.getItem(PRACTICE_SETTINGS_KEY);
      if (!raw) return DEFAULT_PRACTICE_SETTINGS;
      return {
        ...DEFAULT_PRACTICE_SETTINGS,
        ...JSON.parse(raw),
      };
    } catch {
      return DEFAULT_PRACTICE_SETTINGS;
    }
  },

  savePracticeSettings(settings: Partial<PracticeSettings>) {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getPracticeSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(PRACTICE_SETTINGS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  },
};
