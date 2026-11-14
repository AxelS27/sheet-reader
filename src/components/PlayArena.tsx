import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Flame,
  Star,
  Cable,
  Volume2,
  VolumeX,
  Trophy,
  Sparkles,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { StaffViewer } from './StaffViewer';
import { InteractivePiano } from './InteractivePiano';
import { GameModeId, NoteItem } from '@/types/game';
import { TREBLE_PROGRESSION, BASS_PROGRESSION, C3_TO_C5_NOTES, GAME_MODES } from '@/utils/notes';
import { midiManager, MidiDevice } from '@/utils/midi';
import { sound } from '@/utils/audio';
import { progressStorage, NoteSpeed, NoteColorMode } from '@/utils/storage';
import { Gauge, Palette, Settings, X } from 'lucide-react';

interface PlayArenaProps {
  modeId: GameModeId;
  onBackToMenu: () => void;
  isMidiConnected: boolean;
  midiDevices: MidiDevice[];
  onConnectMidi: () => void;
}

const REQUIRED_HITS_PER_NOTE = 5;

export const PlayArena: React.FC<PlayArenaProps> = ({
  modeId,
  onBackToMenu,
  isMidiConnected,
  midiDevices,
  onConnectMidi,
}) => {
  const currentMode = GAME_MODES.find((m) => m.id === modeId) || GAME_MODES[0];

  // Full progression ladder: Treble (C4-C5), Bass (C3-C4), Grand (C3-C5)
  const fullProgression: NoteItem[] = useMemo(() => {
    if (modeId === 'bass') return BASS_PROGRESSION;
    if (modeId === 'grand') return C3_TO_C5_NOTES;
    return TREBLE_PROGRESSION;
  }, [modeId]);

  // Load saved progress from localStorage for this mode
  const initialModeProgress = useMemo(() => {
    return progressStorage.getModeProgress(modeId);
  }, [modeId]);

  // Current unlocked level (1-indexed) restored from localStorage
  const [level, setLevel] = useState(initialModeProgress.level);
  const [hitsInLevel, setHitsInLevel] = useState(initialModeProgress.hitsInLevel);

  // Active pool of unlocked notes
  const activePool: NoteItem[] = useMemo(() => {
    return fullProgression.slice(0, Math.min(level, fullProgression.length));
  }, [fullProgression, level]);

  const currentLevelNote = fullProgression[level - 1] || fullProgression[0];

  // Practice settings (Speed & Note Color Mode) with LocalStorage persistence
  const [practiceSpeed, setPracticeSpeed] = useState<NoteSpeed>(
    () => progressStorage.getPracticeSettings().speed
  );
  const [noteColorMode, setNoteColorMode] = useState<NoteColorMode>(
    () => progressStorage.getPracticeSettings().colorMode
  );

  const SPEED_DELAY_MS: Record<NoteSpeed, number> = {
    fast: 180,
    medium: 450,
    slow: 850,
  };

  const handleSpeedChange = (speed: NoteSpeed) => {
    setPracticeSpeed(speed);
    progressStorage.savePracticeSettings({ speed });
  };

  const handleColorModeChange = (colorMode: NoteColorMode) => {
    setNoteColorMode(colorMode);
    progressStorage.savePracticeSettings({ colorMode });
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [streak, setStreak] = useState(0);
  const [totalStars, setTotalStars] = useState(() => progressStorage.get().totalStars);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeMidiKeys, setActiveMidiKeys] = useState<number[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Modal celebration state for new unlocked note
  const [unlockedNoteModal, setUnlockedNoteModal] = useState<NoteItem | null>(null);
  const [isClefMastered, setIsClefMastered] = useState(initialModeProgress.isMastered);

  const currentTargetNote = activePool[currentIndex] || activePool[0];

  const pickNextNote = useCallback(() => {
    let nextIdx = Math.floor(Math.random() * activePool.length);
    if (nextIdx === currentIndex && activePool.length > 1) {
      nextIdx = (nextIdx + 1) % activePool.length;
    }
    setCurrentIndex(nextIdx);
    setFeedback('idle');
  }, [currentIndex, activePool.length]);

  const handleNoteInput = useCallback(
    (inputMidi: number) => {
      if (unlockedNoteModal || isClefMastered) return;

      setActiveMidiKeys([inputMidi]);
      setTimeout(() => setActiveMidiKeys([]), 250);

      const targetMidi = currentTargetNote.midi;

      if (inputMidi === targetMidi) {
        // Correct hit: subtle green visual color only
        setFeedback('correct');
        const newStreak = streak + 1;
        setStreak(newStreak);
        progressStorage.recordStreak(newStreak);

        // Persist stars to localStorage
        const updatedStars = progressStorage.addStars(10);
        setTotalStars(updatedStars);

        const newHits = hitsInLevel + 1;
        setHitsInLevel(newHits);

        // Check if level completed / new note unlocked!
        if (newHits >= REQUIRED_HITS_PER_NOTE) {
          if (level < fullProgression.length) {
            const nextLevel = level + 1;
            const nextNote = fullProgression[level];
            setLevel(nextLevel);
            setHitsInLevel(0);
            setUnlockedNoteModal(nextNote);

            // Persist new level to localStorage
            progressStorage.saveModeProgress(modeId, nextLevel, 0, false);

            if (soundEnabled) sound.playSuccessChime();
            confetti({
              particleCount: 80,
              spread: 100,
              origin: { y: 0.5 },
            });
            return;
          } else {
            // Mastered all notes in this Clef!
            setIsClefMastered(true);
            progressStorage.saveModeProgress(modeId, level, newHits, true);

            if (soundEnabled) sound.playSuccessChime();
            confetti({
              particleCount: 120,
              spread: 120,
              origin: { y: 0.4 },
            });
            return;
          }
        }

        // Persist current hits in level
        progressStorage.saveModeProgress(modeId, level, newHits, false);

        setTimeout(() => {
          pickNextNote();
        }, SPEED_DELAY_MS[practiceSpeed]);
      } else {
        // Wrong hit: subtle red visual color + PUNISHMENT (-1 hit, streak resets)
        setFeedback('wrong');
        setStreak(0);
        const reducedHits = Math.max(0, hitsInLevel - 1);
        setHitsInLevel(reducedHits);
        // Persist punishment to localStorage
        progressStorage.saveModeProgress(modeId, level, reducedHits, false);

        setTimeout(() => {
          setFeedback('idle');
        }, Math.min(SPEED_DELAY_MS[practiceSpeed] + 150, 750));
      }
    },
    [
      currentTargetNote,
      pickNextNote,
      soundEnabled,
      hitsInLevel,
      level,
      fullProgression,
      unlockedNoteModal,
      isClefMastered,
    ]
  );

  // Subscribe to real MIDI inputs
  useEffect(() => {
    const unsub = midiManager.onNote((note, velocity, isNoteOn) => {
      if (isNoteOn && velocity > 0) {
        handleNoteInput(note);
      }
    });
    return unsub;
  }, [handleNoteInput]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-slate-800 flex flex-col justify-between font-sans">
      {/* 1. CONSISTENT WARM CORAL TOP NAVBAR */}
      <header className="w-full bg-[#FF5A36] border-b-2 border-[#E04825] sticky top-0 z-50 shadow-md">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-16 py-2.5 flex items-center justify-between gap-4">
          {/* Left: Brand Logo + Back Button */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={onBackToMenu}
            >
              <div className="w-11 h-11 bg-white rounded-xl flex flex-col items-center justify-center shadow-md border-2 border-orange-200 transform hover:scale-105 transition-transform">
                <span className="text-[#FF5A36] font-display font-black text-xs tracking-widest leading-none">
                  NOTEY
                </span>
                <span className="text-amber-500 font-extrabold text-[9px] tracking-tight leading-none mt-0.5">
                  MUSIC
                </span>
              </div>
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={onBackToMenu}
              className="btn-bouncy flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/20 hover:bg-black/35 text-white font-extrabold text-xs sm:text-sm border border-white/30 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quests</span>
            </button>

            {/* Current Quest Badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-black text-xs">
              <span>{currentMode.icon}</span>
              <span>{currentMode.title}</span>
              <span className="opacity-70">•</span>
              <span className="text-amber-200">Level {currentLevelNote.name}</span>
            </span>
          </div>

          {/* Right: Sound Toggle + Connect MIDI Button */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full text-white hover:bg-white/20 border border-white/30 cursor-pointer transition-colors"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onConnectMidi}
              type="button"
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer border ${
                isMidiConnected
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                  : 'bg-white hover:bg-orange-50 text-slate-800 border-orange-200 shadow-sm'
              }`}
            >
              <Cable className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span className="hidden md:inline">
                {isMidiConnected
                  ? `${midiDevices[0]?.name || 'MIDI Ready'}`
                  : 'Connect MIDI'}
              </span>
              <span className="md:hidden">{isMidiConnected ? 'MIDI OK' : 'MIDI'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. PURE PROGRESS BAR & STREAK / STARS ROW (EXPANDED & THICKER) */}
      <div className="max-w-2xl w-full mx-auto mt-4 px-4 space-y-2.5">
        <div className="flex items-center justify-between text-sm sm:text-base font-extrabold px-1">
          {/* Level by Note Name */}
          <div className="flex items-center gap-2.5 text-slate-600">
            <span className="font-display font-black text-slate-900 text-base sm:text-lg">
              Level {currentLevelNote.name}
            </span>
            <span className="text-xs sm:text-sm bg-amber-100 text-amber-950 px-3 py-0.5 rounded-full font-black border border-amber-300 shadow-2xs">
              {hitsInLevel} / {REQUIRED_HITS_PER_NOTE} Hits
            </span>
          </div>

          {/* Streak 🔥 & Stars ⭐ */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-orange-600 font-black text-xs sm:text-sm bg-orange-50 px-3 py-1 rounded-full border border-orange-200 shadow-xs">
              <Flame className="w-4 h-4 fill-orange-500 animate-bounce" />
              <span>{streak} Streak</span>
            </div>

            <div className="flex items-center gap-1.5 text-amber-600 font-black text-xs sm:text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shadow-xs">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{totalStars} Stars</span>
            </div>
          </div>
        </div>

        {/* Big, Chunky Progress Bar Track */}
        <div className="w-full bg-slate-200/90 h-4 sm:h-5 rounded-full overflow-hidden p-0.5 shadow-inner border border-slate-300/80">
          <motion.div
            className={`h-full rounded-full transition-colors duration-200 shadow-sm ${
              feedback === 'wrong'
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${(hitsInLevel / REQUIRED_HITS_PER_NOTE) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        </div>

        {/* Unlocked Note Buttons (C3 to C5) */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-1.5">
          {fullProgression.map((n, idx) => {
            const isUnlocked = idx < level;
            return (
              <button
                key={`${n.clef}-${n.name}-${idx}`}
                type="button"
                onClick={() => {
                  if (isUnlocked) sound.playMidiNote(n.midi);
                }}
                disabled={!isUnlocked}
                title={isUnlocked ? `Click to hear ${n.name}` : `Locked (Reach Level ${idx + 1})`}
                className={`text-xs sm:text-sm font-extrabold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  isUnlocked
                    ? 'bg-white hover:bg-amber-50 text-slate-800 border-amber-300 shadow-xs cursor-pointer active:scale-95'
                    : 'bg-slate-200/60 text-slate-400 border-slate-300 cursor-not-allowed opacity-50'
                }`}
              >
                {isUnlocked ? (
                  <>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: n.color }}
                    />
                    <span>{n.name}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{n.name}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CENTER STAGE: NOTATION BOARD (CENTERED & CLEAN) */}
      <div className="w-full max-w-3xl mx-auto my-auto px-4 py-2 flex items-center justify-center relative">
        <StaffViewer
          note={currentTargetNote}
          feedback={feedback}
          showLabel={false}
          colorMode={noteColorMode}
          headerAction={
            <div className="relative">
              {/* Gear Settings Button on Card Header */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                  isSettingsOpen
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
                }`}
                title="Practice Settings"
              >
                <Settings className={`w-4 h-4 transition-transform duration-300 ${isSettingsOpen ? 'rotate-90' : ''}`} />
              </button>

              {/* Popover Settings Menu (Opens ONLY when gear is clicked!) */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <>
                    {/* Backdrop to close when clicking outside */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSettingsOpen(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-9 z-50 w-72 bg-white rounded-3xl p-4 border-3 border-amber-300 shadow-2xl space-y-3.5 select-none"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                        <span className="font-display font-black text-sm text-slate-800 flex items-center gap-1.5">
                          <Settings className="w-4 h-4 text-amber-500" />
                          <span>Practice Settings</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsSettingsOpen(false)}
                          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Setting 1: Note Speed */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-extrabold text-slate-600">
                          <span className="flex items-center gap-1">
                            <Gauge className="w-3.5 h-3.5 text-slate-400" />
                            Note Speed:
                          </span>
                          <span className="text-[10px] text-amber-800 uppercase font-black bg-amber-100 px-2 py-0.5 rounded-full">
                            {practiceSpeed}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-black">
                          {(['slow', 'medium', 'fast'] as NoteSpeed[]).map((spd) => (
                            <button
                              key={spd}
                              type="button"
                              onClick={() => handleSpeedChange(spd)}
                              className={`py-1 rounded-xl capitalize transition-all cursor-pointer ${
                                practiceSpeed === spd
                                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {spd}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Setting 2: Note Color Style */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs font-extrabold text-slate-600">
                          <span className="flex items-center gap-1">
                            <Palette className="w-3.5 h-3.5 text-slate-400" />
                            Note Style:
                          </span>
                          <span className="text-[10px] text-amber-800 uppercase font-black bg-amber-100 px-2 py-0.5 rounded-full">
                            {noteColorMode === 'colorful' ? 'Rainbow' : 'Black'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-black">
                          <button
                            type="button"
                            onClick={() => handleColorModeChange('colorful')}
                            className={`py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              noteColorMode === 'colorful'
                                ? 'bg-amber-400 text-slate-950 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <span>🌈 Rainbow</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleColorModeChange('black')}
                            className={`py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              noteColorMode === 'black'
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <span>⚫ Black</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          }
        />
      </div>

      {/* 4. BOTTOM PIANO: 100% FULL-WIDTH PAGE SPAN */}
      <div className="w-full max-w-[1720px] mx-auto px-1 sm:px-4 pt-1 pb-2">
        <InteractivePiano
          activeMidiNotes={activeMidiKeys}
          onKeyPress={handleNoteInput}
          targetMidi={currentTargetNote.midi}
          highlightTarget={false}
        />
      </div>

      {/* 5. LEVEL UNLOCK CELEBRATION MODAL */}
      <AnimatePresence>
        {unlockedNoteModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 border-4 border-amber-400 shadow-2xl relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-3xl shadow-fun-yellow border-2 border-amber-300 animate-bounce">
                🎉
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                  Level {unlockedNoteModal.name} Unlocked!
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-2">
                  New Note Unlocked!
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm font-semibold mt-1">
                  You mastered the previous notes. Now welcome:
                </p>
              </div>

              {/* Big Note Badge */}
              <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 flex items-center justify-center gap-3">
                <span
                  className="w-5 h-5 rounded-full border-2 border-slate-700"
                  style={{ backgroundColor: unlockedNoteModal.color }}
                />
                <span className="font-display font-black text-3xl text-slate-900">
                  {unlockedNoteModal.name}
                </span>
                <span className="text-sm font-bold text-amber-700">
                  ({unlockedNoteModal.solfege})
                </span>
              </div>

              <p className="text-[11px] font-bold text-slate-500">
                This note will now be added to your random practice pool!
              </p>

              <button
                type="button"
                onClick={() => {
                  setUnlockedNoteModal(null);
                  pickNextNote();
                }}
                className="w-full btn-bouncy py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-display font-black text-base border-2 border-amber-500 shadow-fun-yellow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue Quest 🚀</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. CLEF MASTERED CELEBRATION MODAL */}
      <AnimatePresence>
        {isClefMastered && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 border-4 border-amber-400 shadow-2xl relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 mx-auto flex items-center justify-center shadow-fun-yellow border-2 border-amber-500 animate-pulse">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  All Notes Mastered!
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-2">
                  Clef Master! 👑
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm font-semibold mt-1">
                  Incredible! You unlocked every single note in this Clef quest with a total of{' '}
                  <span className="text-amber-600 font-extrabold">{totalStars} Stars</span>!
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsClefMastered(false);
                    setLevel(1);
                    setHitsInLevel(0);
                    progressStorage.saveModeProgress(modeId, 1, 0, false);
                    pickNextNote();
                  }}
                  className="w-full btn-bouncy py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-display font-black text-sm border-2 border-amber-500 shadow-fun-yellow cursor-pointer"
                >
                  Play Again From Start
                </button>

                <button
                  type="button"
                  onClick={onBackToMenu}
                  className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-300"
                >
                  Back to Quest Menu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
