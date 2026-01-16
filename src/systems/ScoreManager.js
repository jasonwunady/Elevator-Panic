class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.multiplier = 1;
        this.comboCount = 0;
        this.comboTimer = null;
        this.lastKickTime = 0;
        this.kicksInCombo = [];

        // Stats for end screen
        this.stats = {
            enemiesKicked: 0,
            maxCombo: 0,
            powerupsCollected: 0,
            floorsCleared: 0,
            styleBonuses: 0
        };
    }

    addScore(points, showFloatingText = true, x = null, y = null) {
        const actualPoints = Math.floor(points * this.multiplier);
        this.score += actualPoints;

        // Update UI
        this.scene.updateScoreUI();

        // Floating score text
        if (showFloatingText && x !== null && y !== null) {
            this.showFloatingScore(actualPoints, x, y);
        }

        return actualPoints;
    }

    addHeightScore(floor) {
        const points = floor * SCORE_CONFIG.HEIGHT_MULTIPLIER;
        this.addScore(points, false);
        this.stats.floorsCleared = floor;
    }

    registerKick(enemy) {
        const now = this.scene.time.now;

        // Check for combo timing (kicks within 500ms)
        if (now - this.lastKickTime < 500) {
            this.comboCount++;
            this.kicksInCombo.push(enemy);

            // Play combo sound
            this.scene.soundManager.playSound('combo', { combo: this.comboCount });

            // Update max combo stat
            if (this.comboCount > this.stats.maxCombo) {
                this.stats.maxCombo = this.comboCount;
            }

            // Show combo text
            this.showComboText();
        } else {
            // Reset combo
            this.comboCount = 1;
            this.kicksInCombo = [enemy];
        }

        this.lastKickTime = now;

        // Reset combo timer
        if (this.comboTimer) {
            this.comboTimer.destroy();
        }
        this.comboTimer = this.scene.time.delayedCall(1000, () => {
            this.endCombo();
        });
    }

    addKickScore(enemy) {
        const baseScore = enemy.config.SCORE;
        let finalScore = baseScore;

        // Combo multiplier
        if (this.comboCount > 1) {
            const comboMultiplier = Math.pow(SCORE_CONFIG.COMBO_MULTIPLIER, this.comboCount - 1);
            finalScore = Math.floor(baseScore * comboMultiplier);
        }

        // Crowd multiplier (more enemies in elevator = more points)
        const enemyCount = this.scene.enemies.getChildren().length;
        if (enemyCount >= SCORE_CONFIG.CROWD_MULTIPLIER_THRESHOLD) {
            finalScore = Math.floor(finalScore * SCORE_CONFIG.CROWD_MULTIPLIER);
        }

        this.stats.enemiesKicked++;

        return this.addScore(finalScore, true, enemy.x, enemy.y);
    }

    addStyleBonus(type) {
        const bonus = SCORE_CONFIG.STYLE_BONUS[type] || 0;
        if (bonus === 0) return;

        this.stats.styleBonuses++;

        const player = this.scene.player;
        const added = this.addScore(bonus, true, player.x, player.y - 30);

        // Show style text
        const styleNames = {
            'AIR_KICK': 'AIR KICK!',
            'DOUBLE_KICK': 'DOUBLE!',
            'TRIPLE_KICK': 'TRIPLE!!',
            'LAST_SECOND': 'CLUTCH!'
        };

        const text = this.scene.add.text(player.x, player.y - 50, styleNames[type], {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(150);

        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            scale: 1.5,
            duration: 800,
            onComplete: () => text.destroy()
        });
    }

    showFloatingScore(points, x, y) {
        const color = this.comboCount > 1 ? '#ffaa00' : '#ffffff';

        const text = this.scene.add.text(x, y, `+${points}`, {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: color,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(150);

        this.scene.tweens.add({
            targets: text,
            y: y - 40,
            alpha: 0,
            duration: 600,
            onComplete: () => text.destroy()
        });
    }

    showComboText() {
        const comboNames = ['', '', 'DOUBLE', 'TRIPLE', 'QUAD', 'PENTA', 'HEXA', 'MEGA', 'ULTRA', 'INSANE'];
        const name = comboNames[Math.min(this.comboCount, comboNames.length - 1)] || `${this.comboCount}x`;

        if (this.comboCount < 2) return;

        const text = this.scene.add.text(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            `${name} COMBO!`,
            {
                fontSize: '20px',
                fontFamily: 'monospace',
                color: '#ffaa00',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setDepth(200);

        this.scene.tweens.add({
            targets: text,
            scale: { from: 0.5, to: 1.3 },
            alpha: { from: 1, to: 0 },
            duration: 500,
            onComplete: () => text.destroy()
        });

        // Screen shake for big combos
        if (this.comboCount >= 3) {
            this.scene.cameras.main.shake(100, 0.01);
        }
    }

    endCombo() {
        // Award bonus for sustained combos
        if (this.comboCount >= 3) {
            const bonus = this.comboCount * 100;
            const player = this.scene.player;
            if (player && player.active) {
                this.addScore(bonus, true, player.x, player.y);
            }
        }

        this.comboCount = 0;
        this.kicksInCombo = [];
    }

    setMultiplier(mult) {
        this.multiplier = mult;

        // Show multiplier change
        if (mult > 1) {
            const text = this.scene.add.text(
                GAME_WIDTH / 2,
                100,
                `SCORE x${mult}`,
                {
                    fontSize: '16px',
                    fontFamily: 'monospace',
                    color: '#ff00ff',
                    stroke: '#000000',
                    strokeThickness: 3
                }
            ).setOrigin(0.5).setDepth(200);

            this.scene.tweens.add({
                targets: text,
                alpha: { from: 1, to: 0 },
                duration: 2000,
                onComplete: () => text.destroy()
            });
        }
    }

    getScore() {
        return this.score;
    }

    getStats() {
        return this.stats;
    }

    recordPowerup() {
        this.stats.powerupsCollected++;
    }
}
