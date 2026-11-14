import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LandingPage } from '@/components/LandingPage';
import { QuestRoadmap } from '@/components/QuestRoadmap';
import { PlayArena } from '@/components/PlayArena';
import { GameModeId } from '@/types/game';
import { midiManager, MidiDevice } from '@/utils/midi';
import { progressStorage } from '@/utils/storage';

export default function App() {
  // Navigation views: Landing Page <---> 3D Quest Roadmap <---> Play Arena
  const [view, setView] = useState<'landing' | 'roadmap' | 'play'>('landing');
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

  const handleOpenRoadmap = () => {
    setView('roadmap');
  };

  const handleSelectLevelAndPlay = (modeId: GameModeId, startLevel?: number) => {
    setSelectedMode(modeId);
    if (startLevel) {
      // If player specifically clicked a level on the roadmap
      const current = progressStorage.getModeProgress(modeId);
      // Ensure level doesn't exceed current unlocked level
      if (startLevel <= current.level) {
        progressStorage.saveModeProgress(modeId, startLevel, current.hitsInLevel, current.isMastered);
      }
    }
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
              onStartPlaying={handleOpenRoadmap}
              onSelectDirectMode={(modeId) => {
                setSelectedMode(modeId);
                setView('roadmap');
              }}
              isMidiConnected={isMidiConnected}
              midiDevices={midiDevices}
              onConnectMidi={handleConnectMidi}
            />
          </motion.div>
        )}

        {view === 'roadmap' && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <QuestRoadmap
              onBackToHome={() => setView('landing')}
              onSelectLevelAndPlay={handleSelectLevelAndPlay}
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
              onBackToMenu={() => setView('roadmap')}
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
