// Web MIDI API helper with listener callbacks and device discovery

export interface MidiDevice {
  id: string;
  name: string;
  manufacturer: string;
  state: string;
}

export type MidiNoteCallback = (note: number, velocity: number, isNoteOn: boolean) => void;

class MidiManager {
  private access: any = null;
  private listeners: Set<MidiNoteCallback> = new Set();
  private deviceListeners: Set<(devices: MidiDevice[]) => void> = new Set();
  public isSupported: boolean = typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator;
  public isConnected: boolean = false;
  public devices: MidiDevice[] = [];

  public async connect(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Web MIDI API is not supported in this browser.');
      return false;
    }

    try {
      this.access = await (navigator as any).requestMIDIAccess();
      this.isConnected = true;
      this.updateDeviceList();

      this.access.onstatechange = () => {
        this.updateDeviceList();
      };

      this.attachInputListeners();
      return true;
    } catch (err) {
      console.error('Failed to get MIDI access:', err);
      this.isConnected = false;
      return false;
    }
  }

  private updateDeviceList() {
    if (!this.access) return;
    const inputs = Array.from(this.access.inputs.values()) as any[];
    this.devices = inputs.map((input) => ({
      id: input.id,
      name: input.name || 'MIDI Keyboard',
      manufacturer: input.manufacturer || 'Unknown',
      state: input.state,
    }));

    this.deviceListeners.forEach((cb) => cb(this.devices));
    this.attachInputListeners();
  }

  private attachInputListeners() {
    if (!this.access) return;
    for (const input of this.access.inputs.values()) {
      input.onmidimessage = (event: any) => {
        const [status, noteNumber, velocity] = event.data;
        const command = status >> 4;
        // 9 = Note On, 8 = Note Off
        if (command === 9) {
          const isNoteOn = velocity > 0;
          this.notifyNote(noteNumber, velocity, isNoteOn);
        } else if (command === 8) {
          this.notifyNote(noteNumber, 0, false);
        }
      };
    }
  }

  private notifyNote(note: number, velocity: number, isNoteOn: boolean) {
    this.listeners.forEach((cb) => cb(note, velocity, isNoteOn));
  }

  public onNote(callback: MidiNoteCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public onDeviceChange(callback: (devices: MidiDevice[]) => void) {
    this.deviceListeners.add(callback);
    return () => {
      this.deviceListeners.delete(callback);
    };
  }
}

export const midiManager = new MidiManager();

// Music notes mapping
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function midiToNoteName(midi: number): { note: string; octave: number; fullName: string } {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  const note = NOTE_NAMES[noteIndex];
  return {
    note,
    octave,
    fullName: `${note}${octave}`,
  };
}
