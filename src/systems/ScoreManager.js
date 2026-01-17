class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.multiplier = 1;
        this.comboCount = 0;
        this.comboTimer = null;
        this.lastKickTime = 0;
        this.kicksInCombo = [];
        this.gameStartTime = Date.now();
        this.hasJumped = false;
        this.hasTakenDamage = false;
        this.simultaneousKicks = 0;

        // Stats for end screen
        this.stats = {
            enemiesKicked: 0,
            maxCombo: 0,
            powerupsCollected: 0,
            floorsCleared: 0,
            styleBonuses: 0
        };

        // Initialize achievements if needed
        if (!window.gameState.achievements) {
            window.gameState.achievements = {
                unlocked: [],
                stats: {
                    totalKicks: 0,
                    totalGames: 0,
                    totalPowerups: 0,
                    maxCombo: 0,
                    maxFloor: 0,
                    maxScore: 0
                }
            };
        }

        // Achievement popup queue
        this.achievementQueue = [];
        this.isShowingAchievement = false;

        // Increment total games played
        window.gameState.achievements.stats.totalGames++;
        this.saveAchievements();
    }

    // ========== ACHIEVEMENT SYSTEM ==========
    checkAchievement(id) {
        if (!window.gameState.achievements.unlocked.includes(id)) {
            const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === id);
            if (achievement) {
                this.unlockAchievement(achievement);
            }
        }
    }

    unlockAchievement(achievement) {
        if (window.gameState.achievements.unlocked.includes(achievement.id)) return;

        window.gameState.achievements.unlocked.push(achievement.id);

        // Award coins
        if (window.gameState.shop) {
            window.gameState.shop.coins += achievement.reward;
        }

        this.saveAchievements();
        this.showAchievementPopup(achievement);
    }

    showAchievementPopup(achievement) {
        // Add to queue if already showing an achievement
        if (this.isShowingAchievement) {
            this.achievementQueue.push(achievement);
            return;
        }

        this.isShowingAchievement = true;
        this.displayAchievement(achievement);
    }

    displayAchievement(achievement) {
        // Create achievement popup
        const rankColors = {
            'BRONZE': '#cd7f32',
            'SILVER': '#c0c0c0',
            'GOLD': '#ffd700',
            'PLATINUM': '#e5e4e2'
        };

        const bg = this.scene.add.rectangle(GAME_WIDTH / 2, 50, 200, 50, 0x222233, 0.9);
        bg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(rankColors[achievement.rank]).color);
        bg.setDepth(500);

        const icon = this.scene.add.text(GAME_WIDTH / 2 - 80, 50, achievement.icon, {
            fontSize: '20px'
        }).setOrigin(0.5).setDepth(501);

        const title = this.scene.add.text(GAME_WIDTH / 2, 42, 'ACHIEVEMENT!', {
            fontSize: '8px',
            fontFamily: 'monospace',
            color: rankColors[achievement.rank]
        }).setOrigin(0.5).setDepth(501);

        const name = this.scene.add.text(GAME_WIDTH / 2, 55, achievement.name, {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(501);

        const reward = this.scene.add.text(GAME_WIDTH / 2 + 75, 50, `+${achievement.reward}`, {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#ffdd00'
        }).setOrigin(0.5).setDepth(501);

        // Play sound
        this.scene.soundManager.playSound('ding');

        // Animate in
        const elements = [bg, icon, title, name, reward];
        elements.forEach(el => {
            el.setAlpha(0);
            el.y -= 30;
        });

        this.scene.tweens.add({
            targets: elements,
            alpha: 1,
            y: '+=30',
            duration: 300,
            ease: 'Back.easeOut'
        });

        // Animate out after delay
        this.scene.time.delayedCall(2000, () => {
            this.scene.tweens.add({
                targets: elements,
                alpha: 0,
                y: '-=30',
                duration: 300,
                onComplete: () => {
                    elements.forEach(el => { if (el.active) el.destroy(); });
                    this.processNextAchievement();
                }
            });
        });
    }

    processNextAchievement() {
        if (this.achievementQueue.length > 0) {
            const nextAchievement = this.achievementQueue.shift();
            // Small delay between achievements
            this.scene.time.delayedCall(200, () => {
                this.displayAchievement(nextAchievement);
            });
        } else {
            this.isShowingAchievement = false;
        }
    }

    saveAchievements() {
        try {
            localStorage.setItem('pixelPanicAchievements', JSON.stringify(window.gameState.achievements));
            localStorage.setItem('pixelPanicShop', JSON.stringify(window.gameState.shop));
        } catch (e) {
            console.log('Could not save achievements');
        }
    }

    // Check achievements based on current game state
    checkGameAchievements() {
        const stats = window.gameState.achievements.stats;
        const floor = this.stats.floorsCleared;
        const score = this.score;

        // Floor achievements
        if (floor >= 5) this.checkAchievement('floor_5');
        if (floor >= 10) this.checkAchievement('floor_10');
        if (floor >= 15) this.checkAchievement('floor_15');
        if (floor >= 20) this.checkAchievement('floor_20');
        if (floor >= 25) this.checkAchievement('floor_25');
        if (floor >= 30) this.checkAchievement('floor_30');
        if (floor >= 40) this.checkAchievement('floor_40');
        if (floor >= 50) this.checkAchievement('floor_50');
        if (floor >= 60) this.checkAchievement('floor_60');
        if (floor >= 75) this.checkAchievement('floor_75');
        if (floor >= 100) this.checkAchievement('floor_100');
        if (floor >= 150) this.checkAchievement('floor_150');
        if (floor >= 200) this.checkAchievement('floor_200');

        // Score achievements
        if (score >= 1000) this.checkAchievement('score_1k');
        if (score >= 5000) this.checkAchievement('score_5k');
        if (score >= 10000) this.checkAchievement('score_10k');
        if (score >= 25000) this.checkAchievement('score_25k');
        if (score >= 50000) this.checkAchievement('score_50k');
        if (score >= 100000) this.checkAchievement('score_100k');
        if (score >= 250000) this.checkAchievement('score_250k');
        if (score >= 500000) this.checkAchievement('score_500k');
        if (score >= 1000000) this.checkAchievement('score_1m');

        // Kick achievements (total)
        if (stats.totalKicks >= 10) this.checkAchievement('kick_10');
        if (stats.totalKicks >= 25) this.checkAchievement('kick_25');
        if (stats.totalKicks >= 50) this.checkAchievement('kick_50');
        if (stats.totalKicks >= 100) this.checkAchievement('kick_100');
        if (stats.totalKicks >= 250) this.checkAchievement('kick_250');
        if (stats.totalKicks >= 500) this.checkAchievement('kick_500');
        if (stats.totalKicks >= 1000) this.checkAchievement('kick_1000');
        if (stats.totalKicks >= 5000) this.checkAchievement('kick_5000');
        if (stats.totalKicks >= 10000) this.checkAchievement('kick_10000');

        // Games played achievements
        if (stats.totalGames >= 5) this.checkAchievement('play_5');
        if (stats.totalGames >= 10) this.checkAchievement('play_10');
        if (stats.totalGames >= 25) this.checkAchievement('play_25');
        if (stats.totalGames >= 50) this.checkAchievement('play_50');
        if (stats.totalGames >= 100) this.checkAchievement('play_100');
        if (stats.totalGames >= 500) this.checkAchievement('play_500');

        // Survival time
        const survivalTime = (Date.now() - this.gameStartTime) / 1000;
        if (survivalTime >= 30) this.checkAchievement('survive_30s');
        if (survivalTime >= 60) this.checkAchievement('survive_1m');
        if (survivalTime >= 120) this.checkAchievement('survive_2m');
        if (survivalTime >= 180) this.checkAchievement('survive_3m');
        if (survivalTime >= 300) this.checkAchievement('survive_5m');
        if (survivalTime >= 600) this.checkAchievement('survive_10m');

        // Powerup achievements
        if (stats.totalPowerups >= 10) this.checkAchievement('powerups_10');
        if (stats.totalPowerups >= 50) this.checkAchievement('powerups_50');
        if (stats.totalPowerups >= 100) this.checkAchievement('powerups_100');
    }

    checkComboAchievements(combo) {
        if (combo >= 2) this.checkAchievement('combo_2');
        if (combo >= 3) this.checkAchievement('combo_3');
        if (combo >= 5) this.checkAchievement('combo_5');
        if (combo >= 7) this.checkAchievement('combo_7');
        if (combo >= 10) this.checkAchievement('combo_10');
        if (combo >= 15) this.checkAchievement('combo_15');
        if (combo >= 20) this.checkAchievement('combo_20');

        // Update max combo stat
        if (combo > window.gameState.achievements.stats.maxCombo) {
            window.gameState.achievements.stats.maxCombo = combo;
        }
    }

    checkEnemyAchievement(enemyType) {
        const enemyAchievementMap = {
            'RUSHER': 'meet_rusher',
            'BOUNCER': 'meet_bouncer',
            'CLINGER': 'meet_clinger',
            'EXPLODER': 'meet_exploder',
            'HEAVY': 'meet_heavy',
            'GHOST': 'meet_ghost',
            'TANK': 'meet_tank',
            'DRAGON': 'meet_dragon',
            'LICH': 'meet_lich',
            'ARCHDEMON': 'meet_archdemon',
            'WORLD_EATER': 'meet_world_eater'
        };

        if (enemyAchievementMap[enemyType]) {
            this.checkAchievement(enemyAchievementMap[enemyType]);
        }
    }

    checkPowerupAchievement(powerupType) {
        this.checkAchievement('first_powerup');
        window.gameState.achievements.stats.totalPowerups++;

        const powerupAchievementMap = {
            'rocketBoots': 'rocket_boots',
            'stickyGloves': 'sticky_gloves',
            'freezeFloor': 'freeze_floor',
            'overdrive': 'overdrive',
            'shield': 'shield_powerup',
            'magnet': 'magnet_powerup',
            'timeWarp': 'time_warp'
        };

        if (powerupAchievementMap[powerupType]) {
            this.checkAchievement(powerupAchievementMap[powerupType]);
        }
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

        // Track first kick achievement
        this.checkAchievement('first_kick');

        // Track enemy type achievement
        this.checkEnemyAchievement(enemy.enemyType);

        // Update total kicks stat
        window.gameState.achievements.stats.totalKicks++;

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

            // Check combo achievements
            this.checkComboAchievements(this.comboCount);

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

        // Check game achievements periodically
        this.checkGameAchievements();
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

        // Check style-related achievements
        if (type === 'AIR_KICK') this.checkAchievement('air_kick');
        if (type === 'DOUBLE_KICK') this.checkAchievement('double_kick');
        if (type === 'TRIPLE_KICK') this.checkAchievement('triple_kick');

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

    recordPowerup(powerupType) {
        this.stats.powerupsCollected++;
        this.checkPowerupAchievement(powerupType || 'generic');
    }

    recordJump() {
        if (!this.hasJumped) {
            this.hasJumped = true;
            this.checkAchievement('first_jump');
        }
    }

    recordDamage() {
        if (!this.hasTakenDamage) {
            this.hasTakenDamage = true;
            this.checkAchievement('take_damage');
        }
    }

    // Called when game ends to update persistent stats
    finalizeStats() {
        const stats = window.gameState.achievements.stats;

        // Update max records
        if (this.stats.floorsCleared > stats.maxFloor) {
            stats.maxFloor = this.stats.floorsCleared;
        }
        if (this.score > stats.maxScore) {
            stats.maxScore = this.score;
        }
        if (this.stats.maxCombo > stats.maxCombo) {
            stats.maxCombo = this.stats.maxCombo;
        }

        // Final achievement check
        this.checkGameAchievements();
        this.saveAchievements();
    }
}
