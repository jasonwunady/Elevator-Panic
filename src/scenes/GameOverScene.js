class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.finalFloor = data.floor || 0;
        this.deathCause = data.cause || 'UNKNOWN';
        this.stats = data.stats || {};
        this.isNewHighScore = data.isNewHighScore || false;
    }

    create() {
        this.soundManager = new SoundManager(this);

        // Background
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0a0a1a);

        // Animated background effect (must be before music for beat pulse to exist)
        this.createBackgroundEffect();

        // Play menu music with beat sync
        this.playMenuMusic();

        // Game Over text
        this.createGameOverText();

        // Stats display
        this.createStatsDisplay();

        // Restart prompt
        this.createRestartPrompt();

        // Input handlers
        this.input.keyboard.on('keydown-SPACE', this.restartGame, this);
        this.input.keyboard.on('keydown-ENTER', this.restartGame, this);
        this.input.on('pointerdown', this.restartGame, this);

        // Return to menu
        this.input.keyboard.on('keydown-ESC', this.returnToMenu, this);
    }

    playMenuMusic() {
        // Stop any existing music
        this.sound.stopAll();

        // Play beatsync music for game over screen
        if (this.cache.audio.exists('beatsyncMusic')) {
            this.menuMusic = this.sound.add('beatsyncMusic', {
                loop: true,
                volume: 0.5
            });
            this.menuMusic.play();

            // Beat sync - pulse effects to the music beat
            this.beatInterval = 500; // Adjust based on actual BPM of beatsync music
            this.beatTimer = this.time.addEvent({
                delay: this.beatInterval,
                callback: this.onBeat,
                callbackScope: this,
                loop: true
            });
        }
    }

    onBeat() {
        // Pulse the background on beat
        if (this.beatPulse) {
            this.tweens.add({
                targets: this.beatPulse,
                alpha: { from: 0.2, to: 0 },
                scale: { from: 1, to: 1.15 },
                duration: 250,
                ease: 'Power2'
            });
        }

        // Pulse the game over text if it exists
        if (this.gameOverText) {
            this.tweens.add({
                targets: this.gameOverText,
                scale: { from: 1.05, to: 1 },
                duration: 200,
                ease: 'Power2'
            });
        }

        // Flash debris particles
        if (this.debris) {
            this.debris.forEach(d => {
                if (d.sprite && d.sprite.active) {
                    d.sprite.setAlpha(Math.min(d.sprite.alpha + 0.3, 1));
                }
            });
        }
    }

    createBackgroundEffect() {
        // Beat pulse overlay
        this.beatPulse = this.add.rectangle(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            GAME_WIDTH,
            GAME_HEIGHT,
            0xff4444,
            0
        );
        this.beatPulse.setDepth(0);

        // Falling debris
        this.debris = [];
        for (let i = 0; i < 30; i++) {
            const particle = this.add.rectangle(
                Phaser.Math.Between(0, GAME_WIDTH),
                Phaser.Math.Between(-100, GAME_HEIGHT),
                Phaser.Math.Between(2, 6),
                Phaser.Math.Between(2, 6),
                Phaser.Math.Between(0x333333, 0x666666)
            );
            particle.setAlpha(Phaser.Math.FloatBetween(0.3, 0.7));
            particle.setDepth(1);
            this.debris.push({
                sprite: particle,
                speed: Phaser.Math.Between(1, 4),
                rotation: Phaser.Math.FloatBetween(-0.05, 0.05)
            });
        }

        // Animate debris
        this.time.addEvent({
            delay: 16,
            callback: () => {
                this.debris.forEach(d => {
                    d.sprite.y += d.speed;
                    d.sprite.rotation += d.rotation;
                    if (d.sprite.y > GAME_HEIGHT + 20) {
                        d.sprite.y = -20;
                        d.sprite.x = Phaser.Math.Between(0, GAME_WIDTH);
                    }
                });
            },
            loop: true
        });
    }

    createGameOverText() {
        // Main title - store reference for beat sync
        this.gameOverText = this.add.text(GAME_WIDTH / 2, 40, 'GAME OVER', {
            fontSize: '28px',
            fontFamily: 'monospace',
            color: '#ff4444',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Glitch effect
        this.tweens.add({
            targets: this.gameOverText,
            x: { from: GAME_WIDTH / 2 - 3, to: GAME_WIDTH / 2 + 3 },
            duration: 100,
            yoyo: true,
            repeat: -1
        });

        // Death cause
        const causeText = this.add.text(GAME_WIDTH / 2, 70, this.getDeathMessage(), {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#888888'
        }).setOrigin(0.5);
    }

    getDeathMessage() {
        const messages = {
            'FELL OUT': 'You fell out of the elevator!',
            'ENEMY': 'Overwhelmed by enemies!',
            'CROWD': 'Too crowded in there!',
            'EXPLOSION': 'Caught in an explosion!',
            'RUSHER': 'Trampled by a Rusher!',
            'CLINGER': 'Grabbed by a Clinger!',
            'EXPLODER': 'Blasted by an Exploder!',
            'HEAVY': 'Crushed by a Heavy!',
            'UNKNOWN': 'The elevator claimed another victim...'
        };
        return messages[this.deathCause] || messages['UNKNOWN'];
    }

    createStatsDisplay() {
        let currentY = 90;
        const lineHeight = 16;

        // New high score badge (if applicable)
        if (this.isNewHighScore) {
            const highScoreText = this.add.text(GAME_WIDTH / 2, currentY, '★ NEW HIGH SCORE! ★', {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#ffcc00'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: highScoreText,
                scale: { from: 1, to: 1.1 },
                duration: 300,
                yoyo: true,
                repeat: -1
            });

            // Play celebration sound
            this.soundManager.playSound('powerup');
            currentY += 25;
        }

        // Score (big)
        const scoreText = this.add.text(GAME_WIDTH / 2, currentY, '0', {
            fontSize: '32px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Animate score counting up
        this.tweens.addCounter({
            from: 0,
            to: this.finalScore,
            duration: 1500,
            ease: 'Power2',
            onUpdate: (tween) => {
                scoreText.setText(Math.floor(tween.getValue()).toString());
            }
        });

        currentY += 35;

        // Floor reached
        this.add.text(GAME_WIDTH / 2, currentY, `FLOOR REACHED: ${this.finalFloor}`, {
            fontSize: '11px',
            fontFamily: 'monospace',
            color: '#ffcc00'
        }).setOrigin(0.5);

        currentY += 25;

        // Stats grid - compact
        const stats = [
            { label: 'Enemies Kicked', value: this.stats.enemiesKicked || 0 },
            { label: 'Max Combo', value: this.stats.maxCombo || 0 },
            { label: 'Powerups', value: this.stats.powerupsCollected || 0 },
            { label: 'Style Bonuses', value: this.stats.styleBonuses || 0 }
        ];

        stats.forEach((stat, i) => {
            const y = currentY + i * lineHeight;

            this.add.text(GAME_WIDTH / 2 - 65, y, stat.label, {
                fontSize: '9px',
                fontFamily: 'monospace',
                color: '#666666'
            });

            const valueText = this.add.text(GAME_WIDTH / 2 + 65, y, '0', {
                fontSize: '9px',
                fontFamily: 'monospace',
                color: '#ffffff'
            }).setOrigin(1, 0);

            // Animate stat counting
            this.tweens.addCounter({
                from: 0,
                to: stat.value,
                duration: 1000,
                delay: 500 + i * 200,
                ease: 'Power2',
                onUpdate: (tween) => {
                    valueText.setText(Math.floor(tween.getValue()).toString());
                }
            });
        });
    }

    createRestartPrompt() {
        // Restart text
        const restartText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 50, '[ PRESS SPACE TO RETRY ]', {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: restartText,
            alpha: { from: 1, to: 0.3 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Menu option
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 30, 'ESC - Menu | Tap to retry', {
            fontSize: '9px',
            fontFamily: 'monospace',
            color: '#555555'
        }).setOrigin(0.5);
    }

    restartGame() {
        this.soundManager.playSound('ding');
        this.cameras.main.flash(200, 255, 255, 255);

        // Stop music before transitioning
        if (this.menuMusic) {
            this.menuMusic.stop();
        }
        if (this.beatTimer) {
            this.beatTimer.destroy();
        }

        this.time.delayedCall(200, () => {
            this.scene.start('GameScene');
        });
    }

    returnToMenu() {
        this.soundManager.playSound('ding');
        this.cameras.main.fade(300, 0, 0, 0);

        // Stop music - MenuScene will start its own
        if (this.menuMusic) {
            this.menuMusic.stop();
        }
        if (this.beatTimer) {
            this.beatTimer.destroy();
        }

        this.time.delayedCall(300, () => {
            this.scene.start('MenuScene');
        });
    }
}
