import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NoteItem } from '@/types/game';

// Stave lines: y = 30, 50, 70, 90, 110
const TREBLE_Y_COORDS: Record<number, number> = {
  60: 130, // C4 (Ledger line below staff)
  62: 120, // D4
  64: 110, // E4 (Line 1)
  65: 100, // F4 (Space 1)
  67: 90,  // G4 (Line 2)
  69: 80,  // A4 (Space 2)
  71: 70,  // B4 (Line 3)
  72: 60,  // C5 (Space 3)
  74: 50,  // D5 (Line 4)
  76: 40,  // E5 (Space 4)
  77: 30,  // F5 (Line 5)
};

const BASS_Y_COORDS: Record<number, number> = {
  48: 80,  // C3 (Space 2)
  50: 70,  // D3 (Line 3)
  52: 60,  // E3 (Space 3)
  53: 50,  // F3 (Line 4 - between the two dots)
  55: 40,  // G3 (Space 4)
  57: 30,  // A3 (Line 5)
  59: 20,  // B3 (Space above staff)
  60: 10,  // C4 (Middle C ledger line above bass staff)
};

interface StaffViewerProps {
  note: NoteItem;
  feedback?: 'idle' | 'correct' | 'wrong';
  showLabel?: boolean;
  colorMode?: 'colorful' | 'black';
  headerAction?: React.ReactNode;
}

export const StaffViewer: React.FC<StaffViewerProps> = ({
  note,
  feedback = 'idle',
  showLabel = false,
  colorMode = 'colorful',
  headerAction,
}) => {
  const isTreble = note.clef === 'treble';
  const yPos = isTreble
    ? TREBLE_Y_COORDS[note.midi] ?? 90
    : BASS_Y_COORDS[note.midi] ?? 60;

  // Stem direction: notes on or above middle line (y <= 70) stem points DOWN
  const isStemUp = yPos > 70;
  const stemY1 = yPos;
  const stemY2 = isStemUp ? yPos - 60 : yPos + 60;
  const stemX = isStemUp ? 222 : 198;

  // Note idle color: pure classical black or rainbow solfege
  const idleColor = colorMode === 'black' ? '#0F172A' : note.color;

  return (
    <div className="relative flex flex-col items-center justify-center p-2 select-none w-full">
      {/* Big Spacious Card */}
      <div className="w-full max-w-[480px] sm:max-w-[600px] md:max-w-[680px] bg-white rounded-[2.5rem] p-5 sm:p-7 md:p-8 border-4 border-amber-300 shadow-2xl relative overflow-hidden">
        {/* Soft staff glow on feedback */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
            feedback === 'correct'
              ? 'bg-emerald-400/20 opacity-100'
              : feedback === 'wrong'
              ? 'bg-rose-400/20 opacity-100'
              : 'opacity-0'
          }`}
        />

        {/* Clef indicator pill & Header Action */}
        <div className="flex items-center justify-between mb-3 px-1 relative z-20">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
            {isTreble ? '🎼 Treble Clef (G)' : '🎹 Bass Clef (F)'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-slate-400 hidden xs:inline">
              {isTreble ? 'Right Hand' : 'Left Hand'}
            </span>
            {headerAction}
          </div>
        </div>

        {/* Big Stave SVG */}
        <svg
          viewBox="0 0 340 160"
          className="w-full h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Five Stave Lines - Thicker & Crisp */}
          {[30, 50, 70, 90, 110].map((y) => (
            <line
              key={y}
              x1="18"
              y1={y}
              x2="322"
              y2={y}
              stroke="#1E293B"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          ))}

          {/* Bar lines at sides */}
          <line x1="18" y1="30" x2="18" y2="110" stroke="#1E293B" strokeWidth="3.5" />
          <line x1="322" y1="30" x2="322" y2="110" stroke="#1E293B" strokeWidth="3.5" />

          {/* CLEF GRAPHIC */}
          {isTreble ? (
            /* Treble Clef */
            <g transform="translate(30, 14) scale(0.8)">
              <path
                d="M32 95 C32 108 24 116 12 116 C4 116 -4 109 -4 99 C-4 88 5 81 15 81 C25 81 33 87 34 98 C34 94 34 80 34 68 C34 40 43 2 54 -12 C57 -16 60 -18 63 -18 C67 -18 70 -14 70 -8 C70 5 62 25 54 48 C66 40 78 40 85 48 C94 58 92 74 81 84 C72 92 60 95 48 94 C46 112 42 135 34 150 C28 162 18 170 8 170 C-2 170 -10 162 -10 152 C-10 142 -2 135 7 135 C15 135 22 141 23 148 C16 150 14 154 14 158 C14 161 17 163 21 163 C28 163 35 152 40 134 C44 118 46 102 47 92 Z M46 64 C50 48 55 35 58 24 C50 35 47 48 46 64 Z M52 72 C58 72 65 67 65 60 C65 54 60 50 54 50 C48 50 45 54 44 60 C45 68 48 72 52 72 Z"
                fill="#1E293B"
              />
            </g>
          ) : (
            /* Bass Clef */
            <g transform="translate(26, 26) scale(1.1)">
              <circle cx="20" cy="20" r="7.5" fill="#1E293B" />
              <path
                d="M20 13 C35 13 46 22 46 38 C46 55 32 72 16 85"
                stroke="#1E293B"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="58" cy="12" r="5" fill="#1E293B" />
              <circle cx="58" cy="28" r="5" fill="#1E293B" />
            </g>
          )}

          {/* Animated Target Note Balok */}
          <AnimatePresence mode="wait">
            <motion.g
              key={`${note.clef}-${note.midi}`}
              initial={{ scale: 0.6, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {/* Ledger Line for Middle C (C4) */}
              {note.hasLedgerLine && (
                <line
                  x1="188"
                  y1={yPos}
                  x2="232"
                  y2={yPos}
                  stroke="#1E293B"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                />
              )}

              {/* Note Stem */}
              <line
                x1={stemX}
                y1={stemY1}
                x2={stemX}
                y2={stemY2}
                stroke={feedback === 'correct' ? '#10B981' : feedback === 'wrong' ? '#F43F5E' : '#0F172A'}
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Note Head - Big, bold & beautiful */}
              <g transform={`translate(210, ${yPos}) rotate(-18)`}>
                <ellipse
                  cx="0"
                  cy="0"
                  rx="16"
                  ry="11"
                  fill={
                    feedback === 'correct'
                      ? '#10B981'
                      : feedback === 'wrong'
                      ? '#F43F5E'
                      : idleColor
                  }
                  stroke={
                    feedback === 'correct'
                      ? '#047857'
                      : feedback === 'wrong'
                      ? '#BE123C'
                      : '#0F172A'
                  }
                  strokeWidth="3"
                />
                <ellipse cx="-4" cy="-3.5" rx="5" ry="2.5" fill="#FFFFFF" opacity="0.65" />
              </g>
            </motion.g>
          </AnimatePresence>
        </svg>

        {/* Note Helper Tag / Solfege */}
        {showLabel && (
          <div className="mt-2 flex items-center justify-between border-t border-amber-100 pt-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Target Note
            </span>
            <span className="text-sm font-extrabold px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {note.name} ({note.solfege})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
