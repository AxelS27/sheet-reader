import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LandingPage } from '@/components/LandingPage';
import { PlayArena } from '@/components/PlayArena';
import { GameModeId } from '@/types/game';
import { midiManager, MidiDevice } from '@/utils/midi';

export default function App() {
  // Streamlined 2-screen flow: Landing Page (with Quest Selector) <---> Play Arena
  const [view, setView] = useState<'landing' | 'play'>('landing');
  const [selectedMode, setSelectedMode] = useState<GameModeId>('treble');
  const [midiDevices, setMidiDevices] = useState<MidiDevice[]>([]);
  const [isMidiConnected, setIsMidiConnected] = useState(false);

  useEffect(() => {
    const unsub = midiManager.onDeviceChange((devices) => {
      setMidiDevices(devices);
      setIsMidiConnected(devices.length > 0);
    });
    return unsub;
  }, []);

  const handleConnectMidi = async () => {
    const ok = await midiManager.connect();
    if (ok) {
      setMidiDevices(midiManager.devices);
      setIsMidiConnected(midiManager.devices.length > 0);
    }
  };

  const handleSelectMode = (modeId: GameModeId) => {
    setSelectedMode(modeId);
    setView('play');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-slate-800">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LandingPage
              onStartPlaying={() => handleSelectMode('treble')}
              onSelectDirectMode={handleSelectMode}
              isMidiConnected={isMidiConnected}
              midiDevices={midiDevices}
              onConnectMidi={handleConnectMidi}
            />
          </motion.div>
        )}

        {view === 'play' && (
          <motion.div
            key="play"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <PlayArena
              modeId={selectedMode}
              onBackToMenu={() => setView('landing')}
              isMidiConnected={isMidiConnected}
              midiDevices={midiDevices}
              onConnectMidi={handleConnectMidi}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
