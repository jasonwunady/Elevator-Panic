class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.audioContext = null;
        this.sounds = {};
        this.musicPlaying = false;
        this.volume = 0.5;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Procedural sound generation
    playSound(type, options = {}) {
        if (!this.audioContext) return;
        this.resumeContext();

        switch (type) {
            case 'kick':
                this.playKickSound();
                break;
            case 'jump':
                this.playJumpSound();
                break;
            case 'ding':
                this.playDingSound();
                break;
            case 'explosion':
                this.playExplosionSound();
                break;
            case 'powerup':
                this.playPowerupSound();
                break;
            case 'hurt':
                this.playHurtSound();
                break;
            case 'death':
                this.playDeathSound();
                break;
            case 'doorOpen':
                this.playDoorSound();
                break;
            case 'enemyEject':
                this.playEjectSound();
                break;
            case 'combo':
                this.playComboSound(options.combo || 1);
                break;
        }
    }

    createOscillator(type, frequency, duration, gainValue = 0.3) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(gainValue * this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);

        return { oscillator, gainNode };
    }

    createNoise(duration, gainValue = 0.3) {
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        noise.buffer = buffer;
        gainNode.gain.setValueAtTime(gainValue * this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        noise.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        noise.start();

        return { noise, gainNode };
    }

    playKickSound() {
        // Crunchy kick - short noise burst + low thump
        this.createNoise(0.08, 0.4);
        this.createOscillator('sine', 80, 0.1, 0.5);

        // Add a "crunch" with square wave
        const crunch = this.createOscillator('square', 200, 0.05, 0.2);
        crunch.oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.05);
    }

    playJumpSound() {
        // Rising tone
        const osc = this.createOscillator('square', 150, 0.15, 0.2);
        osc.oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
    }

    playDingSound() {
        // Classic elevator ding - high pitched bell
        this.createOscillator('sine', 880, 0.3, 0.4);
        this.createOscillator('sine', 1320, 0.2, 0.2);

        // Add harmonics for bell quality
        setTimeout(() => {
            this.createOscillator('sine', 1760, 0.15, 0.1);
        }, 20);
    }

    playExplosionSound() {
        // Low rumble with noise
        this.createNoise(0.4, 0.6);
        this.createOscillator('sine', 60, 0.3, 0.5);
        this.createOscillator('sawtooth', 40, 0.4, 0.3);
    }

    playPowerupSound() {
        // Rising arpeggio
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.createOscillator('square', freq, 0.1, 0.2);
            }, i * 50);
        });
    }

    playHurtSound() {
        // Harsh buzz
        this.createOscillator('sawtooth', 100, 0.2, 0.4);
        this.createNoise(0.1, 0.3);
    }

    playDeathSound() {
        // Descending tones
        const notes = [400, 300, 200, 100];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.createOscillator('square', freq, 0.2, 0.3);
            }, i * 100);
        });
        this.createNoise(0.5, 0.4);
    }

    playDoorSound() {
        // Mechanical sliding sound
        this.createNoise(0.2, 0.2);
        this.createOscillator('sawtooth', 100, 0.3, 0.1);
    }

    playEjectSound() {
        // Whoosh + thud
        const osc = this.createOscillator('sine', 400, 0.15, 0.3);
        osc.oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.15);
        this.createNoise(0.1, 0.2);
    }

    playComboSound(combo) {
        // Higher pitch for higher combos
        const baseFreq = 440 + (combo * 100);
        this.createOscillator('square', baseFreq, 0.1, 0.3);
        this.createOscillator('sine', baseFreq * 1.5, 0.08, 0.2);
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}
