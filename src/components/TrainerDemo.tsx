import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Star, Cable } from 'lucide-react';
import { StaffViewer } from './StaffViewer';
import { InteractivePiano } from './InteractivePiano';
import { TREBLE_NOTES } from '@/utils/notes';
import { midiManager, MidiDevice } from '@/utils/midi';
import { sound } from '@/utils/audio';

export const TrainerDemo: React.FC = () => {
  const practiceNotes = TREBLE_NOTES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [streak, setStreak] = useState(0);
  const [stars, setStars] = useState(0);
  const [activeMidiKeys, setActiveMidiKeys] = useState<number[]>([]);
  const [midiDevices, setMidiDevices] = useState<MidiDevice[]>([]);
  const [isMidiConnected, setIsMidiConnected] = useState(false);

  const currentTargetNote = practiceNotes[currentIndex];

  const pickNextNote = useCallback(() => {
    let nextIdx = Math.floor(Math.random() * practiceNotes.length);
    if (nextIdx === currentIndex && practiceNotes.length > 1) {
      nextIdx = (nextIdx + 1) % practiceNotes.length;
    }
    setCurrentIndex(nextIdx);
    setFeedback('idle');
  }, [currentIndex, practiceNotes.length]);

  const handleNoteInput = useCallback(
    (inputMidi: number) => {
      setActiveMidiKeys([inputMidi]);
      setTimeout(() => setActiveMidiKeys([]), 250);

      const targetMidi = currentTargetNote.midi;

      if (inputMidi === targetMidi) {
        setFeedback('correct');
        setStreak((prev) => prev + 1);
        setStars((prev) => prev + 10);

        setTimeout(() => {
          pickNextNote();
        }, 500);
      } else {
        setFeedback('wrong');
        setStreak(0);

        setTimeout(() => {
          setFeedback('idle');
        }, 650);
      }
    },
    [currentTargetNote, pickNextNote]
  );

  useEffect(() => {
    const unsubNote = midiManager.onNote((note, velocity, isNoteOn) => {
      if (isNoteOn && velocity > 0) {
        handleNoteInput(note);
      }
    });

    const unsubDevice = midiManager.onDeviceChange((devices) => {
      setMidiDevices(devices);
      setIsMidiConnected(devices.length > 0);
    });

    return () => {
      unsubNote();
      unsubDevice();
    };
  }, [handleNoteInput]);

  const requestMidiAccess = async () => {
    const success = await midiManager.connect();
    setIsMidiConnected(success && midiManager.devices.length > 0);
    setMidiDevices(midiManager.devices);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-gradient-to-b from-amber-100/90 to-amber-200/80 p-4 sm:p-7 rounded-[2.5rem] border-4 border-amber-300 shadow-card-fun relative">
      {/* Top Game Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl border-2 border-amber-200">
        <div className="flex items-center gap-1.5 text-orange-600 font-extrabold text-sm sm:text-base">
          <Flame className="w-5 h-5 fill-orange-500 animate-bounce" />
          <span>{streak} Streak</span>
        </div>

        <div className="flex items-center gap-1.5 text-amber-600 font-extrabold text-sm sm:text-base">
          <Star className="w-5 h-5 fill-amber-400" />
          <span>{stars} Stars</span>
        </div>

        <button
          onClick={requestMidiAccess}
          type="button"
          title={isMidiConnected ? 'MIDI Piano Connected!' : 'Click to connect your MIDI Piano'}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            isMidiConnected
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300'
          }`}
        >
          <Cable className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {isMidiConnected ? `${midiDevices[0]?.name || 'MIDI Ready'}` : 'Connect Piano'}
          </span>
          <span className="sm:hidden">{isMidiConnected ? 'ON' : 'MIDI'}</span>
        </button>
      </div>

      {/* Main Stave Board */}
      <div className="relative">
        <StaffViewer
          note={currentTargetNote}
          feedback={feedback}
          showLabel={false}
        />
      </div>

      {/* Instruction pill */}
      <div className="text-center my-3">
        <p className="text-xs sm:text-sm font-bold text-amber-900/80 bg-amber-200/50 inline-block px-4 py-1.5 rounded-full">
          💡 Tap a piano key below or play your USB MIDI keyboard!
        </p>
      </div>

      {/* Interactive Piano (Full 66 Keys) */}
      <InteractivePiano
        activeMidiNotes={activeMidiKeys}
        onKeyPress={handleNoteInput}
        targetMidi={currentTargetNote.midi}
        highlightTarget={false}
      />
    </div>
  );
};
