import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Flame,
  Cable,
  Sparkles,
  ArrowRight,
  Piano,
  Trophy,
  HelpCircle,
  Play,
  Star,
} from 'lucide-react';
import { TrainerDemo } from './TrainerDemo';
import { MidiDevice } from '@/utils/midi';
import { GameModeId } from '@/types/game';
import { progressStorage } from '@/utils/storage';

interface LandingPageProps {
  onStartPlaying: () => void;
  onSelectDirectMode?: (modeId: GameModeId) => void;
  isMidiConnected: boolean;
  midiDevices: MidiDevice[];
  onConnectMidi: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlaying,
  onSelectDirectMode,
  isMidiConnected,
  midiDevices,
  onConnectMidi,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'learn' | 'challenge'>('all');
  const [savedStars] = useState(() => progressStorage.get().totalStars);

  // 8 Cards with the exact original card design, updated with clean names & categories
  const questCards = [
    {
      id: 'treble',
      modeId: 'treble' as GameModeId,
      category: 'learn',
      title: 'Treble Clef',
      bg: 'bg-[#0055A5]',
      icon: '🎼',
      textColor: 'text-white',
    },
    {
      id: 'bass',
      modeId: 'bass' as GameModeId,
      category: 'learn',
      title: 'Bass Clef',
      bg: 'bg-[#008A44]',
      icon: '🎹',
      textColor: 'text-white',
    },
    {
      id: 'grand',
      modeId: 'grand' as GameModeId,
      category: 'learn',
      title: 'Grand Staff',
      bg: 'bg-[#7B2CBF]',
      icon: '🌟',
      textColor: 'text-white',
    },
    {
      id: 'starter',
      modeId: 'treble' as GameModeId,
      category: 'learn',
      title: 'Middle-C Starter',
      bg: 'bg-[#F28C28]',
      icon: '🧸',
      textColor: 'text-white',
    },
    {
      id: 'streak',
      modeId: 'treble' as GameModeId,
      category: 'challenge',
      title: 'Daily Streak',
      bg: 'bg-[#D32F2F]',
      icon: '🔥',
      textColor: 'text-white',
    },
    {
      id: 'speed',
      modeId: 'bass' as GameModeId,
      category: 'challenge',
      title: 'Speed Rush',
      bg: 'bg-[#00B4D8]',
      icon: '⚡',
      textColor: 'text-white',
    },
    {
      id: 'ledger',
      modeId: 'treble' as GameModeId,
      category: 'learn',
      title: 'Ledger Lines',
      bg: 'bg-[#0077B6]',
      icon: '📐',
      textColor: 'text-white',
    },
    {
      id: 'songs',
      modeId: 'grand' as GameModeId,
      category: 'challenge',
      title: 'Mini Melodies',
      bg: 'bg-[#1E293B]',
      icon: '🎶',
      textColor: 'text-white',
    },
  ];

  const filteredCards = questCards.filter((card) => {
    if (activeTab === 'learn') return card.category === 'learn';
    if (activeTab === 'challenge') return card.category === 'challenge';
    return true;
  });

  const handleCardClick = (modeId: GameModeId) => {
    if (onSelectDirectMode) {
      onSelectDirectMode(modeId);
    } else {
      onStartPlaying();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-slate-800 flex flex-col font-sans">
      {/* 1. TOP NAVBAR */}
      <header className="w-full bg-[#FF5A36] border-b-2 border-[#E04825] sticky top-0 z-50 shadow-md">
        <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-2.5 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center shadow-md border-2 border-orange-200 transform hover:scale-105 transition-transform">
                <span className="text-[#FF5A36] font-display font-black text-xs tracking-widest leading-none">
                  NOTEY
                </span>
                <span className="text-amber-500 font-extrabold text-[9px] tracking-tight leading-none mt-0.5">
                  MUSIC
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-5 text-sm font-black text-white">
              <button
                type="button"
                onClick={onStartPlaying}
                className="flex items-center gap-1 hover:text-amber-200 transition-colors cursor-pointer"
              >
                <span>Quests</span>
                <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('trial-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1 hover:text-amber-200 transition-colors cursor-pointer"
              >
                <span>Practice</span>
                <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <a
                href="#how-it-works"
                className="flex items-center gap-1 hover:text-amber-200 transition-colors"
              >
                <span>How to Play</span>
                <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
              </a>
            </nav>
          </div>

          {/* Right: Stars, MIDI Connection & Play Now */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Total Saved Stars */}
            {savedStars > 0 && (
              <div className="flex items-center gap-1 bg-black/20 text-amber-200 border border-white/20 px-3 py-1.5 rounded-full text-xs font-black shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>{savedStars}</span>
              </div>
            )}

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
              <span>
                {isMidiConnected
                  ? `${midiDevices[0]?.name || 'MIDI Ready'}`
                  : 'Connect MIDI'}
              </span>
            </button>

            <button
              type="button"
              onClick={onStartPlaying}
              className="bg-white hover:bg-orange-50 text-[#FF5A36] px-4 py-2 rounded-full font-black text-xs sm:text-sm shadow-sm cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span>Play Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. PURE CINEMATIC HERO BANNER */}
      <section className="w-full relative min-h-[460px] sm:min-h-[540px] lg:min-h-[640px] xl:min-h-[700px] flex items-center justify-center overflow-hidden bg-[#2B0E17]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[1.02] contrast-[1.03]"
          style={{ backgroundImage: `url('/hero-banner.png')` }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Golden Filigree Corner Accents */}
        <div className="absolute top-5 left-6 sm:left-10 lg:left-14 xl:left-16 w-16 h-16 pointer-events-none opacity-80 hidden sm:block">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 90 C10 40 40 10 90 10 M15 90 C15 45 45 15 90 15 M25 75 C35 35 65 35 75 25"
              stroke="#FBBF24"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="90" cy="10" r="5" fill="#FBBF24" />
            <circle cx="10" cy="90" r="5" fill="#FBBF24" />
          </svg>
        </div>

        <div className="absolute top-5 right-6 sm:right-10 lg:right-14 xl:right-16 w-16 h-16 pointer-events-none opacity-80 hidden sm:block transform scale-x-[-1]">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 90 C10 40 40 10 90 10 M15 90 C15 45 45 15 90 15 M25 75 C35 35 65 35 75 25"
              stroke="#FBBF24"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="90" cy="10" r="5" fill="#FBBF24" />
            <circle cx="10" cy="90" r="5" fill="#FBBF24" />
          </svg>
        </div>
      </section>

      {/* 3. DOCKED DARK SELECTOR BAR (EXACT ORIGINAL CARD DESIGN RESTORED) */}
      <section className="w-full bg-[#1D1D1D] text-white pt-6 pb-10 border-b-4 border-amber-400">
        <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 space-y-5">
          {/* Tabs row on top (All | Learn | Challenge) */}
          <div className="flex items-center gap-8 border-b border-neutral-700 pb-3 font-extrabold text-sm sm:text-base">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`pb-2 relative cursor-pointer transition-colors ${
                activeTab === 'all'
                  ? 'text-white font-black after:content-[""] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[3px] after:bg-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('learn')}
              className={`pb-2 relative cursor-pointer transition-colors ${
                activeTab === 'learn'
                  ? 'text-white font-black after:content-[""] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[3px] after:bg-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Learn
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('challenge')}
              className={`pb-2 relative cursor-pointer transition-colors ${
                activeTab === 'challenge'
                  ? 'text-white font-black after:content-[""] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[3px] after:bg-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Challenge
            </button>
          </div>

          {/* 8 Cards Grid (EXACT ORIGINAL DESIGN RESTORED) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 pt-1">
            {filteredCards.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCardClick(cat.modeId)}
                className={`${cat.bg} rounded-xl p-3 sm:p-4 h-48 sm:h-56 flex flex-col justify-between text-left relative overflow-hidden group shadow-md hover:scale-[1.03] transition-all cursor-pointer`}
              >
                {/* Title */}
                <div className="z-10">
                  <h3 className={`font-extrabold text-xs sm:text-sm ${cat.textColor} leading-tight drop-shadow-sm`}>
                    {cat.title}
                  </h3>
                </div>

                {/* Big Icon / Figure */}
                <div className="flex items-center justify-center text-4xl sm:text-5xl my-auto transform group-hover:scale-110 transition-transform select-none">
                  {cat.icon}
                </div>

                {/* Bottom subtle strip */}
                <div className="w-full h-1 bg-black/20 rounded-full z-10" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE TRIAL SECTION */}
      <section id="trial-section" className="py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-amber-50/80 via-white to-amber-100/40">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border-2 border-amber-300 text-xs sm:text-sm font-black shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Free Interactive Trial</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-black text-slate-900">
              Try It Live: Read The Note Below! 🎹
            </h2>

            <p className="text-slate-600 font-semibold max-w-xl mx-auto text-sm sm:text-base">
              Spot the note on the staff, then hit the matching key on your USB MIDI piano or click the colorful keys below!
            </p>
          </div>

          <div className="max-w-5xl mx-auto w-full">
            <TrainerDemo />
          </div>

          <div className="bg-amber-100/80 border-2 border-amber-300 rounded-3xl p-6 text-center max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="text-left">
              <h4 className="font-display font-black text-lg text-slate-900">
                Ready for Bass Clef & Grand Staff?
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold">
                Choose your specific clef world and start a full practice quest!
              </p>
            </div>

            <button
              type="button"
              onClick={onStartPlaying}
              className="btn-bouncy px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
            >
              <span>Explore All Clefs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. 3 EASY STEPS */}
      <section id="how-it-works" className="py-16 px-4 sm:px-8 bg-white border-t-2 border-amber-200">
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
          <span className="text-xs font-black tracking-widest text-amber-800 uppercase bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Plug & Play Simplicity
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-900">
            How Notey Works in 3 Easy Steps 🚀
          </h2>
          <p className="text-slate-600 font-semibold max-w-lg mx-auto text-sm sm:text-base">
            Zero setup. Works right inside Google Chrome, Microsoft Edge, and Opera.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6">
          <div className="bg-amber-50/70 rounded-3xl p-6 border-3 border-sky-300 shadow-fun-blue flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-display font-black text-2xl mb-4 border-2 border-sky-200">
              1
            </div>
            <h3 className="font-display font-extrabold text-xl text-slate-900 mb-2">
              Plug In Your Piano
            </h3>
            <p className="text-slate-600 text-sm font-semibold">
              Connect your digital piano or USB keyboard to your computer. The browser recognizes it instantly.
            </p>
          </div>

          <div className="bg-amber-50/70 rounded-3xl p-6 border-3 border-amber-300 shadow-fun-yellow flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-display font-black text-2xl mb-4 border-2 border-amber-200">
              2
            </div>
            <h3 className="font-display font-extrabold text-xl text-slate-900 mb-2">
              Read the Staff Note
            </h3>
            <p className="text-slate-600 text-sm font-semibold">
              Observe whether the note sits on a line or inside a space on Treble or Bass Clef.
            </p>
          </div>

          <div className="bg-amber-50/70 rounded-3xl p-6 border-3 border-emerald-300 shadow-fun-green flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-display font-black text-2xl mb-4 border-2 border-emerald-200">
              3
            </div>
            <h3 className="font-display font-extrabold text-xl text-slate-900 mb-2">
              Press the Key & Score!
            </h3>
            <p className="text-slate-600 text-sm font-semibold">
              Hit the matching key. Instant victory chimes sound when you are right, building muscle memory!
            </p>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-[#121212] text-neutral-400 py-12 px-6 border-t-2 border-neutral-800 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF5A36] rounded-lg flex items-center justify-center font-display font-black text-white text-xs">
              <Piano className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">Notey Music Learning</p>
              <p className="text-neutral-500">The fun way for kids and beginners to learn sheet music</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-400 font-semibold">
            <button onClick={onStartPlaying} className="hover:text-white cursor-pointer">
              Treble Clef
            </button>
            <button onClick={onStartPlaying} className="hover:text-white cursor-pointer">
              Bass Clef
            </button>
            <button onClick={onStartPlaying} className="hover:text-white cursor-pointer">
              Grand Staff
            </button>
            <button onClick={onConnectMidi} className="hover:text-white cursor-pointer">
              MIDI Setup Help
            </button>
          </div>

          <div className="text-neutral-600 font-medium">
            © {new Date().getFullYear()} Notey. Made with ❤️ for future pianists.
          </div>
        </div>
      </footer>
    </div>
  );
};
