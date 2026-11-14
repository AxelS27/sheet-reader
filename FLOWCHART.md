# 🎼 Notey - System & User Flowcharts

This document outlines the architecture, user journeys, 3D Quest Roadmap, MIDI hardware connectivity, and incremental learning gameplay loop for **Notey**.

---

## 1. High-Level User Journey (3D Quest Roadmap Hub)

```mermaid
flowchart TD
    Start([User Visits Notey]) --> Landing[Landing Page]
    
    subgraph LandingHub [Landing Page Features]
        Landing --> HeroBanner[Pure 3D Cinematic Piano Wonderland]
        Landing --> SelectorBar[Docked Mode Selector Bar]
        Landing --> QuickTrial[Live Interactive Note Trial Board]
    end

    Landing -->|Click 'Play Now' or Quest Cards| Roadmap[🗺️ 3D Quest Roadmap Page]

    subgraph 3DIslandRoadway [3D Floating Island Roadmap]
        Roadmap --> TabTreble[🎼 Treble Clef Path: Level C4 to C5]
        Roadmap --> TabBass[🎹 Bass Clef Path: Level C4 to C3]
        Roadmap --> TabGrand[🌟 Grand Staff Path: Level C3 to C5]
        
        Roadmap --> IslandTiers[3-Tier Mountain Island with Winding Road]
        IslandTiers --> NodeCompleted[Level Checked / Green]
        IslandTiers --> NodeActive[Current Level Pulse / PLAY]
        IslandTiers --> NodeLocked[Upcoming Levels Locked 🔒]
    end

    NodeActive -->|Tap Level Checkpoint| PlayArena[🎮 Enter Play Arena Directly]
    NodeCompleted -->|Replay Level| PlayArena

    subgraph GameplayExperience [Arena Latihan]
        PlayArena --> IncrementalEngine[Incremental Note Progression Engine]
        IncrementalEngine --> Level1[Level C4: Only Note C]
        Level1 -->|5 Correct Hits| UnlockD[Level D4: Unlock D -> Pool [C, D]]
        UnlockD -->|5 Correct Hits| UnlockE[Level E4: Unlock E -> Pool [C, D, E]]
        UnlockE -->|Progressively| ClefMaster[👑 Clef Master: All Notes Unlocked!]
    end

    PlayArena -->|Click 'Quests' Back Button| Roadmap
    Roadmap -->|Click 'Home' Back Button| Landing
```

---

## 2. Core Incremental Gameplay Loop

```mermaid
flowchart TD
    EnterArena([Enter Quest]) --> InitLevel[Init Level with Active Pool]
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
    Compare -->|YES / CORRECT| CorrectEffect[Note Turns Green]
    CorrectEffect --> AddStreak[Streak +1 & Stars +10]
    AddStreak --> AddHit[Hits In Level +1]
    
    AddHit --> CheckLevelUp{Hits >= 5?}
    CheckLevelUp -->|No| DelayNext[Speed Delay] --> RandomTarget
    
    CheckLevelUp -->|Yes: More Notes Remain| LevelUpModal[🎉 Popup: New Note Unlocked Modal!]
    LevelUpModal --> AddNoteToPool[Add Next Note to Active Pool & Save to LocalStorage]
    AddNoteToPool --> RandomTarget

    CheckLevelUp -->|Yes: All Notes Mastered| ClefMasterModal[👑 Popup: Clef Master Trophy!]

    %% WRONG PATH
    Compare -->|NO / WRONG| WrongEffect[Note Turns Red]
    WrongEffect --> ResetStreak[Reset Streak to 0]
    ResetStreak --> Punishment[Hits -1 Saved in LocalStorage]
    Punishment --> AwaitInput
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
