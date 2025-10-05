export class AudioService {
  private readonly audioContext: AudioContext;
  private readonly audioBuffers: Map<string, AudioBuffer> = new Map();

  public isWavSupported: boolean = true;

  constructor(isWavSupported: boolean) {
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.isWavSupported = isWavSupported;
  }

  // Initialiser le contexte audio avec une interaction utilisateur
  async init(): Promise<void> {
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
      console.log(
        `🎵 AudioContext initialisé, état: ${this.audioContext.state}`
      );
    }
  }

  // Mapping des notes vers les fichiers audio
  private readonly noteToFile: { [key: string]: string } = {
    F2: "/assets/sounds/F2.wav", // Fa Grave
    G2: "/assets/sounds/G2.wav", // Sol Grave
    A2: "/assets/sounds/A2.wav", // La Grave
    B2: "/assets/sounds/B2.wav", // Si Grave
    C3: "/assets/sounds/C3.wav", // Do Grave
    D3: "/assets/sounds/D3.wav", // Ré Grave
    E3: "/assets/sounds/E3.wav", // Mi Grave
    F3: "/assets/sounds/F3.wav", // Fa Grave
    G3: "/assets/sounds/G3.wav", // Sol Grave
    A3: "/assets/sounds/A3.wav", // La Grave
    B3: "/assets/sounds/B3.wav", // Si Grave
    C4: "/assets/sounds/C4.wav", // Do Medium
    D4: "/assets/sounds/D4.wav", // Ré Medium
    E4: "/assets/sounds/E4.wav", // Mi Medium
    F4: "/assets/sounds/F4.wav", // Fa Medium
    G4: "/assets/sounds/G4.wav", // Sol Medium
    A4: "/assets/sounds/A4.wav", // La Medium
    B4: "/assets/sounds/B4.wav", // Si Medium
    C5: "/assets/sounds/C5.wav", // Do Aigu
    D5: "/assets/sounds/D5.wav", // Ré Aigu
    E5: "/assets/sounds/E5.wav", // Mi Aigu
  };

  private readonly noteToFrequency: { [key: string]: number } = {
    F2: 87.31, // Fa Grave
    G2: 98.0, // Sol Grave
    A2: 110.0, // La Grave
    B2: 123.47, // Si Grave
    C3: 130.81, // Do Grave
    D3: 146.83, // Ré Grave
    E3: 164.81, // Mi Grave
    F3: 174.61, // Fa Grave
    G3: 196.0, // Sol Grave
    A3: 220.0, // La Grave
    B3: 246.94, // Si Grave
    C4: 261.63, // Do Medium
    D4: 293.66, // Ré Medium
    E4: 329.63, // Mi Medium
    F4: 349.23, // Fa Medium
    G4: 392.0, // Sol Medium
    A4: 440.0, // La Medium
    B4: 493.88, // Si Medium
    C5: 523.25, // Do Aigu
    D5: 587.33, // Ré Aigu
    E5: 659.25, // Mi Aigu
  };

  // Précharger un fichier audio
  async loadAudioFile(noteName: string): Promise<void> {
    if (this.audioBuffers.has(noteName) || !this.noteToFile[noteName]) {
      return;
    }

    try {
      const response = await fetch(this.noteToFile[noteName]);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(noteName, audioBuffer);
    } catch (error) {
      console.error(
        `Erreur lors du chargement du fichier audio pour ${noteName}:`,
        error
      );
    }
  }

  // Précharger tous les fichiers audio (pas nécessaire pour les fréquences)
  async preloadAllSounds(): Promise<void> {
    if (this.isWavSupported) {
      const loadPromises = Object.keys(this.noteToFile).map((noteName) =>
        this.loadAudioFile(noteName)
      );
      await Promise.all(loadPromises);
    }
  }

  // Jouer une note
  async playNoteWav(noteName: string, volume: number = 0.5): Promise<void> {
    if (!this.audioContext) {
      console.error("AudioContext not initialized");
      return;
    }

    // Charger le fichier s'il n'est pas déjà en mémoire
    if (!this.audioBuffers.has(noteName)) {
      await this.loadAudioFile(noteName);
    }

    const audioBuffer = this.audioBuffers.get(noteName);
    if (!audioBuffer) {
      console.error(`Fichier audio non trouvé pour la note: ${noteName}`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = audioBuffer;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start();
    } catch (error) {
      console.error(`Erreur lors de la lecture de la note ${noteName}:`, error);
    }
  }

  // stop note
  async stopNoteWav(noteName: string): Promise<void> {
    if (!this.audioContext) {
      console.error("AudioContext not initialized");
      return;
    }

    try {
      await this.audioContext.suspend();
    } catch (error) {
      console.error(`Erreur lors de l'arrêt de la note ${noteName}:`, error);
    }
  }

  // Arrêter tous les sons (si nécessaire)
  stopAllWav(): void {
    if (this.audioContext) {
      this.audioContext.suspend();
    }
  }

  // Reprendre les sons
  resume(): void {
    if (this.audioContext) {
      this.audioContext.resume();
    }
  }

  async playNote(noteName: string, volume: number = 0.5): Promise<void> {
    if (this.isWavSupported) {
      await this.playNoteWav(noteName, volume);
    } else {
      await this.startTone(noteName);
    }
  }

  async stopNote(noteName: string): Promise<void> {
    if (this.isWavSupported) {
      await this.stopNoteWav(noteName);
    } else {
      this.stopTone(noteName);
    }
  }

  stopAll(): void {
    if (this.isWavSupported) {
      this.stopAllWav();
    } else {
      this.stopAllTones();
    }
  }

  /******************************************************/
  /*  Oscillator if the wav not present                 */
  /******************************************************/

  // Store active oscillators for each note
  activeOscillators: { [key: string]: OscillatorNode } = {};

  // Start a tone for a specific note
  startTone = async (noteName: string) => {
    console.log(`🎵 Tentative de jouer la note: ${noteName}`);
    const frequency = this.noteToFrequency[noteName];
    console.log(`🎵 Fréquence trouvée: ${frequency} Hz`);

    if (!this.audioContext) {
      console.error("❌ AudioContext non initialisé");
      return;
    }

    console.log(`🎵 État AudioContext: ${this.audioContext.state}`);

    // Reprendre le contexte audio s'il est suspendu
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
      console.log(
        `🎵 AudioContext repris, nouvel état: ${this.audioContext.state}`
      );
    }

    if (this.activeOscillators[noteName]) {
      console.log(`🎵 Arrêt de l'oscillateur existant pour ${noteName}`);
      this.stopTone(noteName);
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime); // Augmenter le volume

      // Store oscillator to be able to stop it later
      this.activeOscillators[noteName] = oscillator;

      // IMPORTANT: Start the oscillator!
      oscillator.start(this.audioContext.currentTime);
      console.log(`✅ Oscillateur démarré pour ${noteName} à ${frequency} Hz`);
    } catch (error) {
      console.error(`❌ Erreur lors de la création de l'oscillateur:`, error);
    }
  };

  stopTone = (noteName: string) => {
    console.log(`🔇 Tentative d'arrêt de la note: ${noteName}`);
    const oscillator = this.activeOscillators[noteName];
    if (oscillator && this.audioContext) {
      try {
        // Stop the oscillator immediately
        oscillator.stop(this.audioContext.currentTime);
        delete this.activeOscillators[noteName];
        console.log(`✅ Note ${noteName} arrêtée`);
      } catch (error) {
        console.log("❌ Erreur lors de l'arrêt de la note:", error);
        delete this.activeOscillators[noteName];
      }
    } else {
      console.log(`⚠️ Aucun oscillateur actif trouvé pour ${noteName}`);
    }
  };
  // Stop all active oscillators
  stopAllTones = () => {
    Object.keys(this.activeOscillators).forEach((noteName) => {
      this.stopTone(noteName);
    });
  };

  // Méthode de test pour vérifier que l'audio fonctionne
  testSound = () => {
    console.log("🧪 Test audio - début");
    if (!this.audioContext) {
      console.error("❌ AudioContext non initialisé pour le test");
      return;
    }

    // Reprendre le contexte si suspendu
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // La 440Hz
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 1); // 1 seconde

    console.log("🧪 Test audio - oscillateur 440Hz lancé pour 1 seconde");
  };
}
