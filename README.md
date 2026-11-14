# 🎹 Notey - Interactive MIDI Sheet Music Trainer

> A gamified, kid-friendly web application to learn reading sheet music with real-time USB MIDI piano integration.

![Notey Hero Preview](/public/hero-banner.png)

## ✨ Features

- 🔌 **Native Web MIDI API Integration**: Plug and play your digital piano or USB keyboard with zero drivers needed.
- 🎼 **Diadactic Range: C3 to C5**: Complete two-octave curriculum covering Bass Clef (C3-C4), Treble Clef (C4-C5), and Grand Staff.
- 🪜 **Incremental Note Progression**: Start on single note `C4`, earn 5 correct hits to unlock `D4`, then `E4`, progressively building muscle memory!
- ⚡ **Punishment System**: Misidentifying a note reduces level hits (-1) and resets your streak, keeping the challenge engaging.
- 🎹 **Full 88-Key Virtual Piano**:
  - Zoom controls (`+` / `-`) for adjustable key widths.
  - Notation toggle (`Pure Keys` vs `Labels: ON`) to practice realistic classical blank keys.
  - Zero camera shifting while playing - stays completely still.
- 💾 **Local Storage Persistence**: Automatically saves your unlocked levels, hits, total stars, combo streaks, and piano preferences.
- ⚙️ **Practice Customization**:
  - **Note Speed**: Slow, Medium, or Fast note spawn delay.
  - **Note Style**: Rainbow Solfege colors vs Classical Pure Black notes.

---

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animation**: Motion (`motion/react`)
- **Icons**: Lucide React
- **Audio & Celebration**: Web Audio API Sound Synthesizer + Canvas Confetti
- **Hardware Protocol**: Native Browser Web MIDI API (`navigator.requestMIDIAccess`)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A browser supporting Web MIDI (Google Chrome, Microsoft Edge, Opera, Brave)
- *(Optional)* Any USB MIDI digital piano or keyboard

### Installation

```bash
# Clone the repository
git clone https://github.com/AxelS27/sheet-reader.git

# Enter the directory
cd sheet-reader

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗺️ System Architecture & Flowcharts

Interactive Mermaid flowcharts for the user journeys and core gameplay loops are documented in:
- [`FLOWCHART.md`](./FLOWCHART.md)
- [`docs/flowchart-preview.html`](./docs/flowchart-preview.html) (Open in browser for visual view)

---

## 📄 License

MIT © [Axel](https://github.com/AxelS27)
