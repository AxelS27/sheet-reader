import React, { useState, useRef, useEffect } from 'react';
import { sound } from '@/utils/audio';
import { ZoomIn, ZoomOut, Eye, EyeOff } from 'lucide-react';
import { progressStorage } from '@/utils/storage';

export interface PianoKeyItem {
  midi: number;
  name: string;
  noteLetter: string;
  octave: number;
  isBlack: boolean;
  whiteIndex: number; // 0 to 51
  color?: string;
}

// Full 88 Keys: A0 (MIDI 21) to C8 (MIDI 108)
// 52 White keys, 36 Black keys = exactly 88 keys!
export function build88Keys(): {
  allKeys: PianoKeyItem[];
  whiteKeys: PianoKeyItem[];
  blackKeys: PianoKeyItem[];
} {
  const noteTemplate = [
    { letter: 'C', isBlack: false, color: '#EF4444' },
    { letter: 'C#', isBlack: true },
    { letter: 'D', isBlack: false, color: '#F97316' },
    { letter: 'D#', isBlack: true },
    { letter: 'E', isBlack: false, color: '#FACC15' },
    { letter: 'F', isBlack: false, color: '#10B981' },
    { letter: 'F#', isBlack: true },
    { letter: 'G', isBlack: false, color: '#06B6D4' },
    { letter: 'G#', isBlack: true },
    { letter: 'A', isBlack: false, color: '#3B82F6' },
    { letter: 'A#', isBlack: true },
    { letter: 'B', isBlack: false, color: '#8B5CF6' },
  ];

  const allKeys: PianoKeyItem[] = [];
  const whiteKeys: PianoKeyItem[] = [];
  const blackKeys: PianoKeyItem[] = [];

  let whiteCounter = 0;

  for (let midi = 21; midi <= 108; midi++) {
    const semitone = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    const tmpl = noteTemplate[semitone];

    const keyItem: PianoKeyItem = {
      midi,
      name: `${tmpl.letter}${octave}`,
      noteLetter: tmpl.letter,
      octave,
      isBlack: tmpl.isBlack,
      whiteIndex: tmpl.isBlack ? whiteCounter - 1 : whiteCounter,
      color: tmpl.color,
    };

    allKeys.push(keyItem);

    if (tmpl.isBlack) {
      blackKeys.push(keyItem);
    } else {
      whiteKeys.push(keyItem);
      whiteCounter++;
    }
  }

  return { allKeys, whiteKeys, blackKeys };
}

const { whiteKeys: GLOBAL_WHITE_KEYS, blackKeys: GLOBAL_BLACK_KEYS } = build88Keys();
const TOTAL_WHITE_KEYS = GLOBAL_WHITE_KEYS.length; // Exactly 52

interface InteractivePianoProps {
  activeMidiNotes?: number[];
  onKeyPress?: (midi: number) => void;
  targetMidi?: number;
  highlightTarget?: boolean;
}

export const InteractivePiano: React.FC<InteractivePianoProps> = ({
  activeMidiNotes = [],
  onKeyPress,
  targetMidi,
  highlightTarget = false,
}) => {
  // Restore saved zoom keyWidth & showLabels from localStorage
  const [keyWidth, setKeyWidth] = useState(() => progressStorage.getPianoSettings().keyWidth);
  const [showLabels, setShowLabels] = useState(() => progressStorage.getPianoSettings().showLabels);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const middleCRef = useRef<HTMLButtonElement>(null);

  // Center on Middle C ONLY ONCE on initial mount.
  // Never shifts or auto-scrolls on level up or target note changes!
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current && middleCRef.current) {
        const container = scrollContainerRef.current;
        const middleC = middleCRef.current;
        const scrollPos = middleC.offsetLeft - container.clientWidth / 2 + middleC.clientWidth / 2;
        container.scrollLeft = scrollPos;
      }
    }, 40);

    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = () => {
    const newWidth = Math.min(64, keyWidth + 6);
    setKeyWidth(newWidth);
    progressStorage.savePianoSettings({ keyWidth: newWidth });
  };

  const handleZoomOut = () => {
    const newWidth = Math.max(20, keyWidth - 6);
    setKeyWidth(newWidth);
    progressStorage.savePianoSettings({ keyWidth: newWidth });
  };

  const handleToggleLabels = () => {
    const nextVal = !showLabels;
    setShowLabels(nextVal);
    progressStorage.savePianoSettings({ showLabels: nextVal });
  };

  const handleKeyClick = (midi: number) => {
    sound.playMidiNote(midi);
    if (onKeyPress) {
      onKeyPress(midi);
    }
  };

  const blackKeyWidth = Math.max(12, Math.round(keyWidth * 0.63));
  const totalBedWidth = TOTAL_WHITE_KEYS * keyWidth;

  return (
    <div className="w-full select-none">
      <div className="relative w-full bg-[#141414] p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-slate-700 shadow-2xl overflow-hidden">
        {/* Top Header Bar: Title + Settings (Zoom In/Out & Note Labels Toggle) */}
        <div className="flex items-center justify-between pb-2 px-1 text-slate-300 text-xs font-bold border-b border-red-950/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm" />
            <span className="font-black text-amber-300 text-xs sm:text-sm tracking-wide">
              88-KEY GRAND PIANO
            </span>
          </div>

          {/* Controls: Labels Toggle + Zoom (- / +) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleLabels}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold transition-colors cursor-pointer border ${
                showLabels
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-600'
              }`}
              title={showLabels ? 'Hide note labels (Pure keys)' : 'Show note labels'}
            >
              {showLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showLabels ? 'Labels: ON' : 'Pure Keys'}</span>
            </button>

            <div className="flex items-center bg-slate-800 rounded-full border border-slate-600 p-0.5">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={keyWidth <= 20}
                className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Zoom Out Keys"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="text-[10px] font-black px-1.5 text-slate-400 min-w-[28px] text-center">
                {keyWidth}px
              </span>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={keyWidth >= 64}
                className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Zoom In Keys"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Red Felt Strip along the fallboard */}
        <div className="w-full h-1.5 bg-gradient-to-r from-red-800 via-red-600 to-red-800 rounded-xs mb-1 mt-1" />

        {/* Scrollable Piano Bed (Stays 100% Still while playing!) */}
        <div
          ref={scrollContainerRef}
          className="relative w-full overflow-x-auto pb-1.5 pt-0.5 rounded-xl scrollbar-thin scrollbar-thumb-amber-500/50 scrollbar-track-slate-900"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div
            className="relative h-44 sm:h-52 md:h-56 bg-slate-950 rounded-b-xl overflow-hidden"
            style={{ width: `${totalBedWidth}px` }}
          >
            {/* 52 White Keys */}
            <div className="absolute inset-0 flex h-full">
              {GLOBAL_WHITE_KEYS.map((key) => {
                const isPressed = activeMidiNotes.includes(key.midi);
                const isTarget = highlightTarget && targetMidi === key.midi;
                const isMiddleC = key.midi === 60;
                const isCKey = key.noteLetter === 'C';

                return (
                  <button
                    key={key.midi}
                    ref={isMiddleC ? middleCRef : undefined}
                    data-midi={key.midi}
                    type="button"
                    onClick={() => handleKeyClick(key.midi)}
                    title={`${key.name}${isMiddleC ? ' (Middle C)' : ''}`}
                    style={{ width: `${keyWidth}px` }}
                    className={`h-full border-r border-slate-300/80 rounded-b-lg border-b-[6px] transition-all duration-75 flex flex-col justify-end items-center pb-2 relative outline-none cursor-pointer select-none shrink-0 ${
                      isPressed
                        ? 'bg-amber-300 border-b-amber-500 translate-y-1 shadow-inner'
                        : isTarget
                        ? 'bg-amber-100 border-b-amber-400 ring-2 ring-amber-400'
                        : isMiddleC
                        ? 'bg-amber-50/90 hover:bg-amber-100 border-b-slate-400'
                        : 'bg-white hover:bg-slate-100 border-b-slate-300 active:translate-y-1'
                    }`}
                  >
                    {/* Render notations only if showLabels is true */}
                    {showLabels && (
                      <>
                        {isMiddleC && (
                          <span className="absolute top-1.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[8px] sm:text-[9px] font-black px-1 rounded-xs shadow-xs border border-amber-500 leading-none">
                            C4
                          </span>
                        )}

                        {isCKey && !isMiddleC && (
                          <span className="text-[7px] sm:text-[8px] font-black text-slate-500 leading-none mb-1">
                            C{key.octave}
                          </span>
                        )}

                        {key.color && (
                          <span
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mb-0.5 opacity-80"
                            style={{ backgroundColor: key.color }}
                          />
                        )}

                        <span className="font-extrabold text-[10px] sm:text-xs text-slate-800 leading-none">
                          {key.noteLetter}
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 36 Black Keys */}
            {GLOBAL_BLACK_KEYS.map((key) => {
              const isPressed = activeMidiNotes.includes(key.midi);
              const isTarget = highlightTarget && targetMidi === key.midi;

              const leftPos = (key.whiteIndex + 1) * keyWidth - blackKeyWidth / 2;

              return (
                <button
                  key={key.midi}
                  data-midi={key.midi}
                  type="button"
                  onClick={() => handleKeyClick(key.midi)}
                  title={key.name}
                  style={{
                    left: `${leftPos}px`,
                    width: `${blackKeyWidth}px`,
                  }}
                  className={`absolute top-0 z-10 h-[62%] rounded-b-md border-b-[5px] transition-all duration-75 cursor-pointer outline-none select-none ${
                    isPressed
                      ? 'bg-amber-400 border-b-amber-600 translate-y-1'
                      : isTarget
                      ? 'bg-amber-300 border-b-amber-500'
                      : 'bg-gradient-to-b from-slate-900 to-slate-950 hover:from-slate-800 hover:to-slate-900 border-b-black shadow-md active:translate-y-1'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
