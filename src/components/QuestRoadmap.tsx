import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Flame,
  Star,
  Cable,
  Volume2,
  VolumeX,
  Lock,
  CheckCircle2,
  Play,
  Trophy,
  Sparkles,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { GameModeId } from '@/types/game';
import { PITCH_LEVELS, PitchLevel } from '@/utils/notes';
import { progressStorage } from '@/utils/storage';
import { MidiDevice } from '@/utils/midi';
import { sound } from '@/utils/audio';

interface QuestRoadmapProps {
  initialMode?: GameModeId;
  onBackToHome: () => void;
  onSelectLevelAndPlay: (modeId: GameModeId, startLevel?: number) => void;
  isMidiConnected: boolean;
  midiDevices: MidiDevice[];
  onConnectMidi: () => void;
}

// Exactly 12 Sequential Coordinates climbing the 3-Tier Mountain Island (C to Bb)
const ROADMAP_12_COORDS: Array<{ x: number; y: number }> = [
  { x: 30, y: 80 }, // Level 1: C (Harbor start)
  { x: 44, y: 76 }, // Level 2: D
  { x: 58, y: 72 }, // Level 3: E
  { x: 70, y: 64 }, // Level 4: F (Right bridge)
  { x: 64, y: 53 }, // Level 5: G (Middle courtyard approach)
  { x: 50, y: 46 }, // Level 6: A (Central village)
  { x: 34, y: 40 }, // Level 7: B (Cathedral gate)
  { x: 26, y: 31 }, // Level 8: C# (Cliff trail)
  { x: 38, y: 24 }, // Level 9: D#
  { x: 50, y: 19 }, // Level 10: F# (Castle gate)
  { x: 62, y: 15 }, // Level 11: G#
  { x: 48, y: 9 },  // Level 12: A# / Bb (Summit Grand Crown 👑)
];

export const QuestRoadmap: React.FC<QuestRoadmapProps> = ({
  initialMode = 'treble',
  onBackToHome,
  onSelectLevelAndPlay,
  isMidiConnected,
  midiDevices,
  onConnectMidi,
}) => {
  const [activeTab, setActiveTab] = useState<GameModeId>(initialMode);

  // Sync tab if initialMode changes
  React.useEffect(() => {
    if (initialMode) {
      setActiveTab(initialMode);
    }
  }, [initialMode]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Read saved progress from localStorage for this mode
  const savedProgress = progressStorage.get();
  const currentModeProgress = progressStorage.getModeProgress(activeTab);
  const unlockedLevel = Math.max(1, Math.min(12, currentModeProgress.level || 1));

  const totalLevels = PITCH_LEVELS.length; // Exactly 12
  const progressPercent = Math.min(100, Math.round(((unlockedLevel - 1) / (totalLevels - 1)) * 100));

  const nextLockedPitch = unlockedLevel < totalLevels ? PITCH_LEVELS[unlockedLevel] : null;

  return (
    <div className="min-h-screen bg-[#009EDB] text-slate-800 flex flex-col font-sans selection:bg-amber-300 overflow-x-hidden">
      {/* 1. TOP NAVBAR */}
      <header className="w-full bg-[#FF5A36] border-b-2 border-[#E04825] sticky top-0 z-50 shadow-md">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-16 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={onBackToHome}
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

            <button
              type="button"
              onClick={onBackToHome}
              className="btn-bouncy flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/20 hover:bg-black/35 text-white font-extrabold text-xs sm:text-sm border border-white/30 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-black text-xs">
              <Compass className="w-3.5 h-3.5" />
              <span>Quest Roadmap</span>
            </span>
          </div>

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

      {/* 2. SUB-HEADER: 3 CLEF TABS */}
      <div className="w-full bg-[#0089BE] border-b-2 border-[#007AA8] py-2.5 px-4 shadow-sm z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2.5 sm:gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('treble')}
            className={`btn-bouncy flex items-center gap-2 px-4 sm:px-5 py-2 rounded-2xl font-display font-black text-xs sm:text-sm transition-all cursor-pointer border-2 ${
              activeTab === 'treble'
                ? 'bg-[#FED400] text-slate-950 border-amber-500 shadow-fun-yellow'
                : 'bg-white/15 hover:bg-white/25 text-white border-white/30'
            }`}
          >
            <span>🎼</span>
            <span>Treble Path (C4 - C6)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bass')}
            className={`btn-bouncy flex items-center gap-2 px-4 sm:px-5 py-2 rounded-2xl font-display font-black text-xs sm:text-sm transition-all cursor-pointer border-2 ${
              activeTab === 'bass'
                ? 'bg-[#FED400] text-slate-950 border-amber-500 shadow-fun-yellow'
                : 'bg-white/15 hover:bg-white/25 text-white border-white/30'
            }`}
          >
            <span>🎹</span>
            <span>Bass Path (C3 - C4)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('grand')}
            className={`btn-bouncy flex items-center gap-2 px-4 sm:px-5 py-2 rounded-2xl font-display font-black text-xs sm:text-sm transition-all cursor-pointer border-2 ${
              activeTab === 'grand'
                ? 'bg-[#FED400] text-slate-950 border-amber-500 shadow-fun-yellow'
                : 'bg-white/15 hover:bg-white/25 text-white border-white/30'
            }`}
          >
            <span>🌟</span>
            <span>Grand Path (C3 - C6)</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN ROADWAY MAP CONTAINER */}
      <div className="relative flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col justify-between">
        {/* Top Widgets (HUD Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 z-20 mb-4">
          <div className="md:col-span-3 bg-white/95 backdrop-blur-md rounded-2xl p-4 border-3 border-amber-300 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm">
                ⭐
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Total Stars</p>
                <p className="font-display font-black text-xl text-slate-900 leading-none">
                  {savedProgress.totalStars} Stars
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-orange-600 font-black text-xs bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              <Flame className="w-4 h-4 fill-orange-500 animate-bounce" />
              <span>Best: {savedProgress.bestStreak}</span>
            </div>
          </div>

          <div className="md:col-span-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 border-3 border-sky-300 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <span className="bg-[#FED400] text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Active Path
              </span>
              <div>
                <h4 className="font-display font-black text-sm sm:text-base text-slate-900 leading-tight">
                  {activeTab === 'bass'
                    ? 'Bass Valley: 12 Pitch Levels (C3 - C4)'
                    : activeTab === 'grand'
                    ? 'Grand Summit: 12 Pitch Levels (C3 - C6)'
                    : 'Treble Kingdom: 12 Pitch Levels (C4 - C6)'}
                </h4>
                <p className="text-xs text-slate-500 font-bold">
                  {unlockedLevel} of 12 Musical Keys Mastered
                </p>
              </div>
            </div>

            <div className="w-full sm:w-44 flex flex-col gap-1 text-right">
              <span className="text-[10px] font-black text-slate-500">
                {progressPercent}% Complete
              </span>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-3 bg-white/95 backdrop-blur-md rounded-2xl p-4 border-3 border-purple-300 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-lg shadow-sm border border-purple-200">
                🎯
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-purple-700">Next Unlock</p>
                <p className="font-display font-black text-sm text-slate-900 leading-tight">
                  {nextLockedPitch ? `Key ${nextLockedPitch.displayName} (${nextLockedPitch.solfege})` : 'All Keys Mastered! 👑'}
                </p>
              </div>
            </div>

            {nextLockedPitch && (
              <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                {currentModeProgress.hitsInLevel}/5 Hits
              </span>
            )}
          </div>
        </div>

        {/* 4. ISOMETRIC 3D FLOATING MOUNTAIN ISLAND & ROADWAY */}
        <div className="relative w-full max-w-5xl mx-auto min-h-[680px] sm:min-h-[760px] md:min-h-[820px] flex items-center justify-center my-auto">
          {/* Animated Ocean Vehicles */}
          <div className="absolute -left-4 sm:left-4 top-1/4 text-3xl animate-float select-none">
            ⛵
          </div>
          <div className="absolute -right-4 sm:right-6 top-1/3 text-4xl animate-float-delayed select-none">
            🚢
          </div>
          <div className="absolute left-8 bottom-1/4 text-3xl animate-float-delayed select-none">
            🚤
          </div>
          <div className="absolute right-12 bottom-16 text-3xl animate-float select-none">
            ⛵
          </div>

          {/* Isometric Floating Island Multi-tier Cliff SVG */}
          <svg
            viewBox="0 0 1000 800"
            className="w-full h-full filter drop-shadow-2xl select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9BD871" />
                <stop offset="100%" stopColor="#7EBA55" />
              </linearGradient>
              <linearGradient id="cliffGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3E4C59" />
                <stop offset="100%" stopColor="#252F38" />
              </linearGradient>
              <linearGradient id="cliffSide" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#323D47" />
                <stop offset="100%" stopColor="#1E262E" />
              </linearGradient>
              <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            {/* Ocean Ripple Water Rings */}
            <ellipse cx="500" cy="550" rx="420" ry="210" fill="#008EC4" opacity="0.6" />
            <ellipse cx="500" cy="550" rx="460" ry="230" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.3" strokeDasharray="12 12" />

            {/* TIER 1: BOTTOM ISLAND */}
            <g>
              <polygon points="260,660 500,770 500,670 260,560" fill="url(#cliffSide)" />
              <polygon points="500,770 740,660 740,560 500,670" fill="url(#cliffGrad)" />
              <polygon points="500,530 740,560 500,670 260,560" fill="url(#grassGrad)" stroke="#689E41" strokeWidth="4" />
            </g>

            {/* TIER 2: MIDDLE ISLAND */}
            <g>
              <polygon points="200,420 480,510 480,410 200,320" fill="url(#cliffSide)" />
              <polygon points="480,510 780,390 780,290 480,410" fill="url(#cliffGrad)" />
              <polygon points="480,270 780,290 480,410 200,320" fill="url(#grassGrad)" stroke="#689E41" strokeWidth="4" />
            </g>

            {/* TIER 3: TOP ISLAND (Summit Castle) */}
            <g>
              <polygon points="320,240 500,300 500,220 320,160" fill="url(#cliffSide)" />
              <polygon points="500,300 680,230 680,150 500,220" fill="url(#cliffGrad)" />
              <polygon points="500,120 680,150 500,220 320,160" fill="url(#grassGrad)" stroke="#689E41" strokeWidth="4" />
            </g>

            {/* 3D ISOMETRIC ROADWAY (Connecting all 12 Levels) */}
            <path
              d="M300,640 L440,610 L580,580 L700,510 L640,420 L500,370 L340,320 L260,250 L380,190 L500,150 L620,120 L480,70"
              fill="none"
              stroke="#B45309"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M300,640 L440,610 L580,580 L700,510 L640,420 L500,370 L340,320 L260,250 L380,190 L500,150 L620,120 L480,70"
              fill="none"
              stroke="url(#roadGrad)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M300,640 L440,610 L580,580 L700,510 L640,420 L500,370 L340,320 L260,250 L380,190 L500,150 L620,120 L480,70"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 8"
              opacity="0.9"
            />

            {/* Landmarks */}
            <g transform="translate(200, 520) scale(0.65)">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#FFFFFF" strokeWidth="4" />
              <circle cx="50" cy="50" r="4" fill="#F59E0B" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="#FFFFFF" strokeWidth="3" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="#FFFFFF" strokeWidth="3" />
            </g>

            <g transform="translate(580, 480) scale(0.7)">
              <rect x="0" y="0" width="20" height="60" fill="#E2E8F0" rx="3" />
              <rect x="50" y="0" width="20" height="60" fill="#E2E8F0" rx="3" />
              <path d="M0,20 L70,20" stroke="#3B82F6" strokeWidth="4" />
              <polygon points="10,-10 0,0 20,0" fill="#3B82F6" />
              <polygon points="60,-10 50,0 70,0" fill="#3B82F6" />
            </g>

            <g transform="translate(180, 290) scale(0.6)">
              <polygon points="30,0 0,30 60,30" fill="#EF4444" />
              <rect x="5" y="30" width="50" height="40" fill="#FEF3C7" />
              <rect x="22" y="45" width="16" height="25" fill="#78350F" />
            </g>

            <g transform="translate(720, 220) scale(0.8)">
              <rect x="10" y="30" width="26" height="90" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
              <circle cx="23" cy="50" r="7" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
              <polygon points="23,0 5,30 41,30" fill="#D97706" />
            </g>

            <g transform="translate(460, 20) scale(0.9)">
              <rect x="0" y="20" width="24" height="50" fill="#CBD5E1" rx="2" />
              <rect x="56" y="20" width="24" height="50" fill="#CBD5E1" rx="2" />
              <rect x="20" y="35" width="40" height="35" fill="#94A3B8" />
              <polygon points="12,-5 0,20 24,20" fill="#8B5CF6" />
              <polygon points="68,-5 56,20 80,20" fill="#8B5CF6" />
              <text x="40" y="22" fontSize="24" textAnchor="middle">👑</text>
            </g>
          </svg>

          {/* 5. INTERACTIVE 3D LEVEL CHECKPOINT NODES (12 LEVELS: C TO Bb) */}
          {PITCH_LEVELS.map((pitchItem, index) => {
            const isUnlocked = index < unlockedLevel;
            const isCurrentActive = index === unlockedLevel - 1;
            const isCompleted = index < unlockedLevel - 1;
            const coords = ROADMAP_12_COORDS[index];

            if (!coords) return null;

            return (
              <div
                key={pitchItem.pitchClass}
                style={{
                  position: 'absolute',
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="z-30"
              >
                {/* Floating Ring Pad */}
                <div
                  className={`w-12 sm:w-16 h-6 sm:h-8 rounded-full absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-lg transition-all ${
                    isCurrentActive
                      ? 'bg-amber-400/80 ring-4 ring-amber-300 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-400/80'
                      : 'bg-black/30'
                  }`}
                />

                {/* Level Node Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (isUnlocked) {
                      sound.playMidiNote(60 + pitchItem.semitone);
                      onSelectLevelAndPlay(activeTab, index + 1);
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`group relative flex flex-col items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-2xl sm:rounded-3xl border-3 sm:border-4 font-display font-black transition-all cursor-pointer select-none ${
                    isCurrentActive
                      ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 border-white shadow-fun-yellow scale-110 animate-bounce'
                      : isCompleted
                      ? 'bg-gradient-to-b from-emerald-400 to-teal-500 text-white border-white shadow-fun-green hover:scale-105'
                      : 'bg-slate-800/85 backdrop-blur-sm text-slate-400 border-slate-600/60 cursor-not-allowed opacity-75'
                  }`}
                >
                  {isCompleted ? (
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] sm:text-sm font-black leading-none drop-shadow-sm">
                        {pitchItem.displayName}
                      </span>
                      <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white mt-0.5 fill-white/20" />
                    </div>
                  ) : isCurrentActive ? (
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] sm:text-sm font-black leading-none">
                        {pitchItem.displayName}
                      </span>
                      <Play className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-slate-950 text-slate-950 mt-0.5 animate-pulse" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Lock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400 mb-0.5" />
                      <span className="text-[9px] sm:text-xs font-black text-slate-400">
                        {pitchItem.displayName}
                      </span>
                    </div>
                  )}

                  {isCurrentActive && (
                    <span className="absolute -top-3 bg-red-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider animate-pulse">
                      PLAY!
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar: Action prompt */}
        <div className="mt-4 text-center z-20">
          <p className="text-xs sm:text-sm font-black text-white/90 bg-black/30 backdrop-blur-md inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 shadow-md">
            <span>💡 12 Musical Keys: Master each key across octaves (C3 to C6) to conquer the island!</span>
          </p>
        </div>
      </div>
    </div>
  );
};
