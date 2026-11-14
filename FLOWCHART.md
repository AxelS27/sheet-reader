# 🎼 Notey - System & User Flowcharts

This document outlines the architecture, user journeys, MIDI hardware connectivity, and incremental learning gameplay loop for **Notey**.

---

## 1. High-Level User Journey (Streamlined 2-Screen Flow)

Because the mode selector is integrated directly into the landing page, there are no redundant intermediate screens.

```mermaid
flowchart TD
    Start([User Visits Notey]) --> Landing[Landing Page]
    
    subgraph LandingHub [Landing Page Features]
        Landing --> HeroBanner[Pure 3D Cinematic Piano Wonderland]
        Landing --> SelectorBar[Docked Mode Selector Bar]
        Landing --> QuickTrial[Live Interactive Note Trial Board]
    end

    subgraph SelectorModes [Tabs: All | Learn | Challenge]
        SelectorBar --> TabLearn[Learn: Treble Clef, Bass Clef, Grand Staff, Starter]
        SelectorBar --> TabChallenge[Challenge: Daily Streak 60s, Speed Rush, Mini Melodies]
    end

    TabLearn -->|Click Any Quest Card| PlayArena[🎮 Enter Play Arena Directly]
    TabChallenge -->|Click Any Quest Card| PlayArena
    HeroBanner -->|Click 'Play Now'| PlayArena

    subgraph GameplayExperience [Arena Latihan]
        PlayArena --> IncrementalEngine[Incremental Note Progression Engine]
        IncrementalEngine --> Level1[Level 1: Only Note C]
        Level1 -->|5 Correct Hits| UnlockD[Level 2: Unlock D -> Pool [C, D]]
        UnlockD -->|5 Correct Hits| UnlockE[Level 3: Unlock E -> Pool [C, D, E]]
        UnlockE -->|Progressively| ClefMaster[🏆 Clef Master: All Notes Unlocked!]
    end

    PlayArena -->|Click 'Quests' Back Button| Landing
```

---

## 2. Core Incremental Gameplay Loop

```mermaid
flowchart TD
    EnterArena([Enter Quest]) --> InitLevel[Init Level 1: Only Anchor Note C]
    InitLevel --> RandomTarget[Pick Random Target Note from Active Pool]
    
    RandomTarget --> RenderStaff[Draw Musical Staff & Target Note]
    RenderStaff --> AwaitInput[/Wait for Piano Keypress / Touch/]

    AwaitInput --> InputSource{Input Device}
    InputSource -->|USB Piano| MidiMsg[Web MIDI API: Note-On Message]
    InputSource -->|On-screen Keyboard| ClickKey[Click/Tap Piano Key]

    MidiMsg --> ExtractPitch[Extract MIDI Pitch Number: e.g. 60 = C4]
    ClickKey --> ExtractPitch

    ExtractPitch --> Compare{Pitch == Target Note?}

    %% CORRECT PATH
    Compare -->|YES / CORRECT| CorrectEffect[Note Turns Green + Flash]
    CorrectEffect --> SuccessSound[Play Victory Chime]
    SuccessSound --> Confetti[Burst Mini Confetti]
    Confetti --> AddStreak[Streak +1 & Stars +10]
    AddStreak --> AddHit[Hits In Level +1]
    
    AddHit --> CheckLevelUp{Hits >= 5?}
    CheckLevelUp -->|No| DelayNext[Short 0.6s Delay] --> RandomTarget
    
    CheckLevelUp -->|Yes: More Notes Remain| LevelUpModal[🎉 Popup: New Note Unlocked Modal!]
    LevelUpModal --> AddNoteToPool[Add Next Note to Active Pool & Hits = 0]
    AddNoteToPool --> RandomTarget

    CheckLevelUp -->|Yes: All Notes Mastered| ClefMasterModal[👑 Popup: Clef Master Trophy!]

    %% WRONG PATH
    Compare -->|NO / WRONG| WrongEffect[Note Shakes + Turns Red]
    WrongEffect --> BuzzerSound[Play Playful Soft Buzzer]
    BuzzerSound --> ResetStreak[Reset Streak to 0]
    ResetStreak --> OptionalHint[Show Glowing Key Hint]
    OptionalHint --> AwaitInput
```

---

## 3. Web MIDI Hardware Connectivity

```mermaid
flowchart TD
    AppLoad[Notey Loads in Browser] --> CheckSupport{Browser Supports Web MIDI?}
    
    CheckSupport -->|No: Legacy Browser| AlertFallback[Notice: Use Chrome or Edge]
    AlertFallback --> LockVirtual[Use On-Screen Piano Only]

    CheckSupport -->|Yes| RequestAccess[Call navigator.requestMIDIAccess]
    RequestAccess --> Permission{User Grants Permission?}
    
    Permission -->|Denied| LockVirtual
    Permission -->|Granted| ScanInputs[Scan Active MIDI Ports]
    
    ScanInputs --> DeviceFound{Piano Plugged In?}
    DeviceFound -->|Yes| Connected[Status: 🟢 Piano Connected]
    DeviceFound -->|Not Yet| Standby[Status: ⚪ Waiting for Piano]
    
    Standby --> HotplugListener[Listen for USB Cable Hotplug]
    HotplugListener -->|Piano Plugged in Anytime| Connected

    Connected --> BindEvents[Attach onmidimessage Listener]
    BindEvents --> Ready[Real-time Keypress Capture Ready]
```
