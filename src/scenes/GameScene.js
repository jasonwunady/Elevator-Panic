class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Initialize managers
        this.soundManager = new SoundManager(this);
        this.scoreManager = new ScoreManager(this);

        // Create groups
        this.enemies = this.physics.add.group();
        this.powerups = this.physics.add.group();

        // Create elevator
        this.elevator = new Elevator(this);

        // Create player
        this.createPlayer();

        // Setup collisions
        this.setupCollisions();

        // Create UI
        this.createUI();

        // Create background effects
        this.createBackgroundEffects();

        // Pause menu
        this.setupPauseMenu();

        // Start game
        this.isGameOver = false;
        this.isCountingDown = false;

        // Start elevator timers immediately
        if (this.elevator) {
            this.elevator.startTimers();
        }

        // Start music
        try {
            if (this.cache.audio.exists('levelMusic')) {
                this.music = this.sound.add('levelMusic', { loop: true, volume: 0.5 });
                this.music.play();
            }
        } catch (e) {
            console.warn('Could not play level music:', e);
        }

        // Resume audio context on first interaction
        this.input.once('pointerdown', () => {
            this.soundManager.resumeContext();
            // Try to play music if it wasn't playing
            if (this.music && !this.music.isPlaying) {
                this.music.play();
            }
        });
    }

    createPlayer() {
        const bounds = this.elevator.getElevatorBounds();
        const centerX = (bounds.left + bounds.right) / 2;
        const floorY = bounds.bottom - 20;

        this.player = new Player(this, centerX, floorY);

        // Add player to physics
        this.physics.add.collider(this.player, this.elevator.floor);
        this.physics.add.collider(this.player, this.elevator.ceiling);
        this.physics.add.collider(this.player, this.elevator.leftWall);
        this.physics.add.collider(this.player, this.elevator.rightWall);
    }

    setupCollisions() {
        // Enemies collide with elevator
        this.physics.add.collider(this.enemies, this.elevator.floor);
        this.physics.add.collider(this.enemies, this.elevator.ceiling);
        this.physics.add.collider(this.enemies, this.elevator.leftWall);
        this.physics.add.collider(this.enemies, this.elevator.rightWall);

        // Enemies collide with each other
        this.physics.add.collider(this.enemies, this.enemies, this.enemyCollision, null, this);

        // Player collision with enemies
        this.physics.add.overlap(this.player, this.enemies, this.playerEnemyCollision, null, this);

        // Player collision with powerups
        this.physics.add.overlap(this.player, this.powerups, this.playerPowerupCollision, null, this);

        // Powerups collide with elevator
        this.physics.add.collider(this.powerups, this.elevator.floor);
    }

    enemyCollision(enemy1, enemy2) {
        // If one is kicked, transfer momentum
        if (enemy1.isKicked && !enemy2.isKicked) {
            enemy2.isKicked = true;
            enemy2.setVelocity(enemy1.body.velocity.x * 0.5, enemy1.body.velocity.y * 0.5);
        } else if (enemy2.isKicked && !enemy1.isKicked) {
            enemy1.isKicked = true;
            enemy1.setVelocity(enemy2.body.velocity.x * 0.5, enemy2.body.velocity.y * 0.5);
        }

        // Bouncy collision
        this.cameras.main.shake(30, 0.002);
    }

    playerEnemyCollision(player, enemy) {
        if (!player.active || !enemy.active) return;

        // If player is kicking, damage enemy
        if (player.isKicking) {
            enemy.takeDamage(1);
            return;
        }

        // If enemy was just kicked, ignore collision briefly
        if (enemy.isKicked) return;

        // Player takes damage
        enemy.onPlayerCollision(player);
    }

    playerPowerupCollision(player, powerup) {
        if (!player.active || !powerup.active) return;

        powerup.collect(player);
        this.scoreManager.recordPowerup();
    }

    createUI() {
        // Score display
        this.scoreText = this.add.text(10, 10, 'SCORE: 0', {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setDepth(300).setScrollFactor(0);

        // Health display
        this.healthContainer = this.add.container(10, 35).setDepth(300).setScrollFactor(0);
        this.healthIcons = [];
        this.updateHealthUI();

        // Floor display is handled by elevator

        // Combo display
        this.comboText = this.add.text(GAME_WIDTH - 10, 10, '', {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#ffaa00',
            align: 'right'
        }).setOrigin(1, 0).setDepth(300).setScrollFactor(0);

        // Money counter
        this.coinsText = this.add.text(GAME_WIDTH - 10, 25, `💰 ${window.gameState.shop.coins}`, {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#ffdd00'
        }).setOrigin(1, 0).setDepth(300).setScrollFactor(0);

        // Enemy count warning
        this.crowdWarning = this.add.text(GAME_WIDTH / 2, 60, '', {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#ff4444'
        }).setOrigin(0.5).setDepth(300).setScrollFactor(0);
    }

    updateScoreUI() {
        this.scoreText.setText(`SCORE: ${this.scoreManager.getScore()}`);
    }

    updateCoinsUI() {
        if (this.coinsText) {
            this.coinsText.setText(`💰 ${window.gameState.shop.coins}`);
        }
    }

    addCoins(amount) {
        window.gameState.shop.coins += amount;
        this.updateCoinsUI();

        // Save immediately
        try {
            localStorage.setItem('pixelPanicShop', JSON.stringify(window.gameState.shop));
        } catch (e) {}
    }

    updateHealthUI() {
        // Clear existing icons
        this.healthIcons.forEach(icon => icon.destroy());
        this.healthIcons = [];

        // Create heart icons (each heart = 2 HP)
        const totalHearts = PLAYER_CONFIG.MAX_HEALTH / PLAYER_CONFIG.HP_PER_HEART;
        const hpPerHeart = PLAYER_CONFIG.HP_PER_HEART;

        for (let i = 0; i < totalHearts; i++) {
            const x = i * 16;
            const heartHP = Math.max(0, Math.min(hpPerHeart, this.player.health - (i * hpPerHeart)));

            let symbol, color;
            if (heartHP >= hpPerHeart) {
                symbol = '♥';
                color = '#ff4444';
            } else if (heartHP > 0) {
                symbol = '♥';
                color = '#ff8888';
            } else {
                symbol = '♡';
                color = '#444444';
            }

            const heart = this.add.text(x, 0, symbol, {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: color
            });

            this.healthContainer.add(heart);
            this.healthIcons.push(heart);
        }
    }

    createBackgroundEffects() {
        // Get starting area from shop
        const startingArea = window.gameState.shop ? window.gameState.shop.startingArea : 'LOBBY';

        // Current theme tracking - start at selected area
        this.currentTheme = BACKGROUND_THEMES[startingArea] || BACKGROUND_THEMES.LOBBY;
        this.currentThemeKey = startingArea;

        // Main background
        this.bgRect = this.add.rectangle(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            GAME_WIDTH,
            GAME_HEIGHT,
            this.currentTheme.bgColor
        ).setDepth(-10);

        // Vignette effect (dark corners)
        this.createVignette();

        // Scrolling lines effect
        this.bgLines = [];
        for (let i = 0; i < 20; i++) {
            const line = this.add.rectangle(
                Phaser.Math.Between(50, GAME_WIDTH - 50),
                Phaser.Math.Between(0, GAME_HEIGHT),
                Phaser.Math.Between(1, 2),
                Phaser.Math.Between(30, 100),
                this.currentTheme.lineColor,
                0.3
            ).setDepth(-1);
            line.speed = Phaser.Math.FloatBetween(1, 3);
            this.bgLines.push(line);
        }

        // Ambient particles container
        this.ambientParticles = [];
        this.createAmbientParticles();

        // Animated background decorations
        this.bgDecorations = [];
        this.createBackgroundDecorations();

        // Create floor number pillars in background
        this.createBackgroundPillars();

        // Zone name display (hidden initially)
        this.zoneNameText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, '', {
            fontSize: '18px',
            fontFamily: 'monospace',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(250).setAlpha(0);

        // Screen edge glow for intensity
        this.createEdgeGlow();
    }

    createVignette() {
        // Dark corners using gradients simulated with rectangles
        const vignetteAlpha = 0.4;

        // Top vignette
        this.vignetteTop = this.add.rectangle(GAME_WIDTH / 2, 0, GAME_WIDTH, 60, 0x000000, vignetteAlpha);
        this.vignetteTop.setOrigin(0.5, 0).setDepth(200);

        // Bottom vignette
        this.vignetteBottom = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT, GAME_WIDTH, 40, 0x000000, vignetteAlpha);
        this.vignetteBottom.setOrigin(0.5, 1).setDepth(200);

        // Side vignettes
        this.vignetteLeft = this.add.rectangle(0, GAME_HEIGHT / 2, 30, GAME_HEIGHT, 0x000000, vignetteAlpha * 0.5);
        this.vignetteLeft.setOrigin(0, 0.5).setDepth(200);

        this.vignetteRight = this.add.rectangle(GAME_WIDTH, GAME_HEIGHT / 2, 30, GAME_HEIGHT, 0x000000, vignetteAlpha * 0.5);
        this.vignetteRight.setOrigin(1, 0.5).setDepth(200);
    }

    createBackgroundPillars() {
        this.bgPillars = [];

        // Create distant building silhouettes
        for (let i = 0; i < 8; i++) {
            const pillar = this.add.rectangle(
                Phaser.Math.Between(20, GAME_WIDTH - 20),
                GAME_HEIGHT / 2,
                Phaser.Math.Between(15, 40),
                GAME_HEIGHT,
                0x000000,
                0.15
            );
            pillar.setDepth(-8);
            pillar.scrollSpeed = Phaser.Math.FloatBetween(0.5, 1.5);
            this.bgPillars.push(pillar);
        }
    }

    createEdgeGlow() {
        // Pulsing edge glow for action moments
        this.edgeGlowLeft = this.add.rectangle(0, GAME_HEIGHT / 2, 5, GAME_HEIGHT, 0xff0000, 0);
        this.edgeGlowLeft.setOrigin(0, 0.5).setDepth(199);

        this.edgeGlowRight = this.add.rectangle(GAME_WIDTH, GAME_HEIGHT / 2, 5, GAME_HEIGHT, 0xff0000, 0);
        this.edgeGlowRight.setOrigin(1, 0.5).setDepth(199);
    }

    pulseEdgeGlow(intensity = 0.5, color = 0xff0000) {
        if (!this.edgeGlowLeft || !this.edgeGlowRight) return;

        this.edgeGlowLeft.setFillStyle(color, intensity);
        this.edgeGlowRight.setFillStyle(color, intensity);

        this.tweens.add({
            targets: [this.edgeGlowLeft, this.edgeGlowRight],
            alpha: 0,
            duration: 300,
            onComplete: () => {
                if (this.edgeGlowLeft) this.edgeGlowLeft.setAlpha(1);
                if (this.edgeGlowRight) this.edgeGlowRight.setAlpha(1);
            }
        });
    }

    createAmbientParticles() {
        // Clear existing
        this.ambientParticles.forEach(p => p.destroy());
        this.ambientParticles = [];

        // Create new particles based on theme
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const particle = this.createThemeParticle(i);
            this.ambientParticles.push(particle);
        }
    }

    createThemeParticle(index) {
        const theme = this.currentTheme;
        const x = Phaser.Math.Between(0, GAME_WIDTH);
        const y = Phaser.Math.Between(0, GAME_HEIGHT);

        let particle;
        switch (theme.ambientParticles) {
            case 'dust':
                particle = this.add.rectangle(x, y, 2, 2, theme.particleColor, 0.4);
                particle.particleType = 'dust';
                particle.speedY = Phaser.Math.FloatBetween(0.3, 1);
                particle.drift = Phaser.Math.FloatBetween(-0.2, 0.2);
                break;
            case 'paper':
                particle = this.add.rectangle(x, y, 4, 6, 0xffffff, 0.3);
                particle.particleType = 'paper';
                particle.speedY = Phaser.Math.FloatBetween(0.5, 1.5);
                particle.wobble = Phaser.Math.FloatBetween(0, Math.PI * 2);
                break;
            case 'sparks':
                particle = this.add.rectangle(x, y, 2, 4, 0xffaa00, 0.6);
                particle.particleType = 'sparks';
                particle.speedY = Phaser.Math.FloatBetween(-2, -0.5);
                particle.life = Phaser.Math.Between(30, 90);
                particle.maxLife = particle.life;
                break;
            case 'glow':
                particle = this.add.circle(x, y, Phaser.Math.Between(2, 5), theme.particleColor, 0.4);
                particle.particleType = 'glow';
                particle.speedY = Phaser.Math.FloatBetween(-0.5, 0.5);
                particle.pulse = Phaser.Math.FloatBetween(0, Math.PI * 2);
                break;
            case 'stars':
                particle = this.add.circle(x, y, 1, 0xffffff, Phaser.Math.FloatBetween(0.2, 0.8));
                particle.particleType = 'stars';
                particle.twinkle = Phaser.Math.FloatBetween(0, Math.PI * 2);
                particle.twinkleSpeed = Phaser.Math.FloatBetween(0.02, 0.08);
                break;
            case 'embers':
                particle = this.add.circle(x, y, Phaser.Math.Between(1, 3), theme.particleColor, 0.7);
                particle.particleType = 'embers';
                particle.speedY = Phaser.Math.FloatBetween(-1.5, -0.5);
                particle.wobble = Phaser.Math.FloatBetween(0, Math.PI * 2);
                particle.wobbleSpeed = Phaser.Math.FloatBetween(0.05, 0.15);
                break;
            default:
                particle = this.add.rectangle(x, y, 2, 2, theme.particleColor, 0.3);
                particle.particleType = 'dust';
                particle.speedY = 0.5;
        }
        particle.setDepth(-5);
        return particle;
    }

    createBackgroundDecorations() {
        // Clear existing
        this.bgDecorations.forEach(d => d.destroy());
        this.bgDecorations = [];

        const theme = this.currentTheme;

        // Create pulsing accent lights on sides
        for (let i = 0; i < 4; i++) {
            const leftLight = this.add.circle(10, 50 + i * 80, 4, theme.accentColor, 0.3);
            leftLight.pulseOffset = i * 0.5;
            leftLight.setDepth(-2);
            this.bgDecorations.push(leftLight);

            const rightLight = this.add.circle(GAME_WIDTH - 10, 50 + i * 80, 4, theme.accentColor, 0.3);
            rightLight.pulseOffset = i * 0.5 + 0.25;
            rightLight.setDepth(-2);
            this.bgDecorations.push(rightLight);
        }

        // Create horizontal scan lines
        for (let i = 0; i < 3; i++) {
            const scanLine = this.add.rectangle(
                GAME_WIDTH / 2,
                i * 120,
                GAME_WIDTH,
                1,
                theme.accentColor,
                0.1
            );
            scanLine.scanOffset = i * 100;
            scanLine.setDepth(-3);
            this.bgDecorations.push(scanLine);
        }
    }

    getThemeForFloor(floor) {
        const themes = Object.keys(BACKGROUND_THEMES);
        let selectedTheme = 'LOBBY';

        for (const key of themes) {
            if (floor >= BACKGROUND_THEMES[key].floorStart) {
                selectedTheme = key;
            }
        }
        return selectedTheme;
    }

    changeTheme(newThemeKey) {
        if (newThemeKey === this.currentThemeKey) return;
        if (this.isGameOver) return;

        const oldTheme = this.currentTheme;
        this.currentTheme = BACKGROUND_THEMES[newThemeKey];
        this.currentThemeKey = newThemeKey;

        // Show zone name
        if (this.zoneNameText && this.zoneNameText.active) {
            this.zoneNameText.setText(this.currentTheme.name.toUpperCase());
            this.zoneNameText.setAlpha(1);
            this.tweens.add({
                targets: this.zoneNameText,
                alpha: 0,
                y: this.zoneNameText.y - 20,
                duration: 2000,
                onComplete: () => {
                    if (this.zoneNameText && this.zoneNameText.active) {
                        this.zoneNameText.y = GAME_HEIGHT / 2 - 30;
                    }
                }
            });
        }

        // Animate background color transition
        if (this.bgRect && this.bgRect.active) {
            const bgColorObj = { r: (oldTheme.bgColor >> 16) & 0xff, g: (oldTheme.bgColor >> 8) & 0xff, b: oldTheme.bgColor & 0xff };
            const newBgColor = { r: (this.currentTheme.bgColor >> 16) & 0xff, g: (this.currentTheme.bgColor >> 8) & 0xff, b: this.currentTheme.bgColor & 0xff };

            this.tweens.add({
                targets: bgColorObj,
                r: newBgColor.r,
                g: newBgColor.g,
                b: newBgColor.b,
                duration: 1000,
                onUpdate: () => {
                    if (this.bgRect && this.bgRect.active) {
                        const color = (Math.floor(bgColorObj.r) << 16) | (Math.floor(bgColorObj.g) << 8) | Math.floor(bgColorObj.b);
                        this.bgRect.setFillStyle(color);
                    }
                }
            });
        }

        // Update line colors - just set directly instead of tweening to reduce overhead
        if (this.bgLines) {
            this.bgLines.forEach(line => {
                if (line && line.active) {
                    line.setFillStyle(this.currentTheme.lineColor, 0.3);
                }
            });
        }

        // Recreate particles for new theme
        this.createAmbientParticles();
        this.createBackgroundDecorations();

        // Update elevator colors for new theme
        if (this.elevator) {
            if (this.elevator.leftWall) this.elevator.leftWall.setFillStyle(this.currentTheme.wallColor);
            if (this.elevator.rightWall) this.elevator.rightWall.setFillStyle(this.currentTheme.wallColor);
        }

        // Screen shake
        if (this.cameras && this.cameras.main) {
            this.cameras.main.shake(200, 0.01);
        }
    }

    setupPauseMenu() {
        this.input.keyboard.on('keydown-ESC', () => {
            if (!this.isGameOver) {
                if (this.scene.isPaused()) {
                    this.scene.resume();
                } else {
                    this.scene.pause();
                }
            }
        });
    }

    update(time, delta) {
        if (this.isGameOver) return;

        // Update player
        if (this.player && this.player.active) {
            this.player.update();
        }

        // Update enemies
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active) {
                enemy.update(time, delta);
            }
        });

        // Update powerups
        this.powerups.getChildren().forEach(powerup => {
            if (powerup.active) {
                powerup.update();
            }
        });

        // Update background
        this.updateBackground();

        // Check crowd damage
        this.checkCrowdDamage();

        // Update combo display
        this.updateComboDisplay();
    }

    updateBackground() {
        // Safety check
        if (!this.elevator || this.isGameOver) return;

        // Check for theme change based on floor
        const newTheme = this.getThemeForFloor(this.elevator.currentFloor);
        if (newTheme !== this.currentThemeKey) {
            this.changeTheme(newTheme);
        }

        // Scroll background lines down with varying speeds
        if (this.bgLines) {
            this.bgLines.forEach(line => {
                if (!line || !line.active) return;
                line.y += line.speed || 2;
                if (line.y > GAME_HEIGHT + 40) {
                    line.y = -40;
                    line.x = Phaser.Math.Between(50, GAME_WIDTH - 50);
                    line.speed = Phaser.Math.FloatBetween(1, 3);
                }
            });
        }

        // Update background pillars
        if (this.bgPillars) {
            this.bgPillars.forEach(pillar => {
                if (!pillar || !pillar.active) return;
                pillar.y += pillar.scrollSpeed;
                if (pillar.y > GAME_HEIGHT + 200) {
                    pillar.y = -200;
                    pillar.x = Phaser.Math.Between(20, GAME_WIDTH - 20);
                }
            });
        }

        // Update ambient particles
        if (this.ambientParticles) {
            this.ambientParticles.forEach(particle => {
                if (!particle || !particle.active) return;
                switch (particle.particleType) {
                    case 'dust':
                        particle.y += particle.speedY;
                        particle.x += particle.drift;
                        if (particle.y > GAME_HEIGHT + 10) {
                            particle.y = -10;
                            particle.x = Phaser.Math.Between(0, GAME_WIDTH);
                        }
                        break;
                    case 'paper':
                        particle.y += particle.speedY;
                        particle.wobble += 0.05;
                        particle.x += Math.sin(particle.wobble) * 0.5;
                        particle.rotation += 0.02;
                        if (particle.y > GAME_HEIGHT + 10) {
                            particle.y = -10;
                            particle.x = Phaser.Math.Between(0, GAME_WIDTH);
                        }
                        break;
                    case 'sparks':
                        particle.y += particle.speedY;
                        particle.x += Phaser.Math.FloatBetween(-0.5, 0.5);
                        particle.life--;
                        particle.setAlpha(Math.max(0.1, particle.life / particle.maxLife));
                        if (particle.life <= 0) {
                            particle.y = GAME_HEIGHT + 10;
                            particle.x = Phaser.Math.Between(20, GAME_WIDTH - 20);
                            particle.life = particle.maxLife;
                        }
                        break;
                    case 'glow':
                        particle.y += particle.speedY;
                        particle.pulse += 0.05;
                        particle.setAlpha(0.2 + Math.sin(particle.pulse) * 0.3);
                        particle.setScale(0.8 + Math.sin(particle.pulse) * 0.4);
                        if (particle.y < -10 || particle.y > GAME_HEIGHT + 10) {
                            particle.speedY *= -1;
                        }
                        break;
                    case 'stars':
                        particle.twinkle += particle.twinkleSpeed;
                        particle.setAlpha(0.2 + Math.abs(Math.sin(particle.twinkle)) * 0.6);
                        break;
                    case 'embers':
                        particle.y += particle.speedY;
                        particle.wobble += particle.wobbleSpeed;
                        particle.x += Math.sin(particle.wobble) * 0.8;
                        particle.setAlpha(0.4 + Math.sin(particle.wobble * 2) * 0.3);
                        if (particle.y < -10) {
                            particle.y = GAME_HEIGHT + 10;
                            particle.x = Phaser.Math.Between(0, GAME_WIDTH);
                        }
                        break;
                }
            });
        }

        // Update background decorations
        if (this.bgDecorations) {
            const time = this.time.now * 0.002;
            this.bgDecorations.forEach(deco => {
                if (!deco || !deco.active) return;
                if (deco.pulseOffset !== undefined) {
                    deco.setAlpha(0.2 + Math.sin(time + deco.pulseOffset) * 0.3);
                    deco.setScale(0.8 + Math.sin(time + deco.pulseOffset) * 0.3);
                }
                if (deco.scanOffset !== undefined) {
                    deco.y = ((time * 50 + deco.scanOffset) % (GAME_HEIGHT + 20)) - 10;
                }
            });
        }
    }

    checkCrowdDamage() {
        const enemyCount = this.enemies.getChildren().filter(e => e.active && e.isInsideElevator).length;

        // Update crowd warning
        if (enemyCount >= 4) {
            this.crowdWarning.setText(`CROWDED! (${enemyCount} enemies)`);
            this.crowdWarning.setAlpha(Math.sin(this.time.now * 0.01) * 0.5 + 0.5);

            // Damage player if too crowded for too long
            if (enemyCount >= 6 && !this.crowdDamageTimer) {
                this.crowdDamageTimer = this.time.addEvent({
                    delay: 2000,
                    callback: () => {
                        if (this.player && this.player.active) {
                            this.player.takeDamage('CROWD');
                        }
                    },
                    loop: true
                });
            }
        } else {
            this.crowdWarning.setText('');
            if (this.crowdDamageTimer) {
                this.crowdDamageTimer.destroy();
                this.crowdDamageTimer = null;
            }
        }
    }

    updateComboDisplay() {
        const combo = this.scoreManager.comboCount;
        if (combo > 1) {
            this.comboText.setText(`${combo}x COMBO`);

            // Pulse effect for high combos
            if (combo >= 3) {
                this.comboText.setScale(1 + Math.sin(this.time.now * 0.01) * 0.1);
                this.comboText.setColor(combo >= 5 ? '#ff00ff' : '#ffaa00');

                // Edge glow on high combos
                if (combo >= 5) {
                    this.pulseEdgeGlow(0.3, 0xff00ff);
                }
            } else {
                this.comboText.setScale(1);
                this.comboText.setColor('#ffaa00');
            }
        } else {
            this.comboText.setText('');
        }
    }

    createScorePopup(x, y, text, color = '#ffff00') {
        const popup = this.add.text(x, y, text, {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: color,
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(250);

        this.tweens.add({
            targets: popup,
            y: y - 40,
            alpha: 0,
            scale: { from: 1, to: 1.5 },
            duration: 800,
            ease: 'Power2',
            onComplete: () => { if (popup.active) popup.destroy(); }
        });
    }

    createStylePopup(styleName) {
        const styleColors = {
            'AIR KICK': '#00ffff',
            'DOUBLE KICK': '#ff00ff',
            'TRIPLE KICK': '#ffff00',
            'LAST SECOND': '#ff6600'
        };

        const popup = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, styleName + '!', {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: styleColors[styleName] || '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(260);

        // Dramatic entrance
        popup.setScale(0);
        this.tweens.add({
            targets: popup,
            scale: 1.5,
            duration: 200,
            ease: 'Back.out',
            onComplete: () => {
                this.tweens.add({
                    targets: popup,
                    alpha: 0,
                    y: popup.y - 30,
                    duration: 500,
                    delay: 300,
                    onComplete: () => { if (popup.active) popup.destroy(); }
                });
            }
        });
    }

    spawnEnemy(x, y, type) {
        const enemy = new Enemy(this, x, y, type);
        this.enemies.add(enemy);

        // Entry animation
        enemy.setAlpha(0);
        enemy.setScale(0.5);
        this.tweens.add({
            targets: enemy,
            alpha: 1,
            scale: 1,
            duration: 200
        });

        // Initial velocity into elevator
        const direction = x < GAME_WIDTH / 2 ? 1 : -1;
        enemy.setVelocityX(direction * enemy.config.SPEED * 2);

        return enemy;
    }

    spawnPowerup(x, y) {
        const powerup = createRandomPowerup(this, x, y);
        this.powerups.add(powerup);

        // Initial velocity into elevator
        const direction = x < GAME_WIDTH / 2 ? 1 : -1;
        powerup.setVelocityX(direction * 100);

        return powerup;
    }

    applyFreezeFloor() {
        // Make floor slippery
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active) {
                enemy.setDrag(0);
                enemy.setBounce(0.9);
            }
        });

        // Visual effect
        this.elevator.floor.setFillStyle(0x66ccff);

        // Add ice particles
        this.freezeParticles = this.time.addEvent({
            delay: 100,
            callback: () => {
                const bounds = this.elevator.getElevatorBounds();
                const x = Phaser.Math.Between(bounds.left, bounds.right);
                const particle = this.add.sprite(x, bounds.bottom - 10, 'spark');
                particle.setTint(0x66ccff);
                particle.setScale(0.5);
                this.tweens.add({
                    targets: particle,
                    y: particle.y - 30,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => particle.destroy()
                });
            },
            loop: true
        });
    }

    removeFreezeFloor() {
        // Restore floor
        this.elevator.floor.setFillStyle(COLORS.ELEVATOR_FLOOR);

        // Stop particles
        if (this.freezeParticles) {
            this.freezeParticles.destroy();
            this.freezeParticles = null;
        }

        // Restore enemy physics
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active) {
                enemy.setBounce(0.5);
                if (enemy.enemyType === 'HEAVY') {
                    enemy.setDrag(200);
                }
            }
        });
    }

    gameOver(cause) {
        if (this.isGameOver) return;
        this.isGameOver = true;

        // Stop music
        if (this.music) {
            this.music.stop();
        }

        // Stop elevator
        this.elevator.destroy();

        // Clear crowd damage timer
        if (this.crowdDamageTimer) {
            this.crowdDamageTimer.destroy();
        }

        // Save score
        const finalScore = this.scoreManager.getScore();
        const finalFloor = this.elevator.currentFloor;

        window.gameState.lastScore = finalScore;
        window.gameState.lastFloor = finalFloor;

        // Check high score
        if (finalScore > window.gameState.highScore) {
            window.gameState.highScore = finalScore;
            localStorage.setItem('pixelPanicHighScore', finalScore.toString());
        }

        // Transition to game over
        this.cameras.main.fade(500, 0, 0, 0);

        this.time.delayedCall(500, () => {
            this.scene.start('GameOverScene', {
                score: finalScore,
                floor: finalFloor,
                cause: cause,
                stats: this.scoreManager.getStats(),
                isNewHighScore: finalScore > 0 && finalScore >= window.gameState.highScore
            });
        });
    }
}
