export class ToneService {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;

  playFrequency(frequency: number) {
    this.audioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.oscillator = this.audioCtx.createOscillator();
    this.oscillator.type = "sine";
    this.oscillator.frequency.setValueAtTime(
      frequency,
      this.audioCtx.currentTime
    );
    this.oscillator.connect(this.audioCtx.destination);
    this.oscillator.start();
  }

  stop() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
