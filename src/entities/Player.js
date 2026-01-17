class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;

        // Physics setup
        this.setCollideWorldBounds(false);
        this.setBounce(0.1);
        this.setSize(PLAYER_CONFIG.WIDTH - 4, PLAYER_CONFIG.HEIGHT - 2);
        this.setOffset(2, 2);
        this.setDepth(100);

        // Apply selected skin
        this.applySkin();

        // Player state
        this.health = PLAYER_CONFIG.MAX_HEALTH;
        this.isKicking = false;
        this.kickCooldown = false;
        this.isInvincible = false;
        this.facingRight = true;
        this.isGrounded = false;
        this.wasGrounded = false;
        this.speedMultiplier = 1;
        this.isPoisoned = false;

        // Animation state
        this.animTime = 0;
        this.runDustTimer = 0;
        this.squashStretch = { x: 1, y: 1 };
        this.targetSquash = { x: 1, y: 1 };
        this.bobOffset = 0;
        this.breathTimer = 0;

        // Powerup states
        this.powerups = {
            rocketBoots: false,
            stickyGloves: false,
            freezeFloor: false,
            overdrive: false
        };
        this.grabbedEnemy = null;

        // Aura container for powerup effects
        this.auraParticles = [];

        // Input
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.kickKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // WASD controls
        this.wasd = {
            W: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };

        // Touch controls
        this.setupTouchControls();
    }

    applySkin() {
        const skinId = window.gameState.shop ? window.gameState.shop.selectedSkin : 'default';

        const skinColors = {
            'default': 0x00ff88,
            'fire': 0xff4400,
            'ice': 0x00ccff,
            'gold': 0xffdd00,
            'shadow': 0x333366,
            'neon': 0xff00ff,
            'rainbow': 0xffffff
        };

        this.skinColor = skinColors[skinId] || skinColors['default'];
        this.setTint(this.skinColor);

        // Rainbow skin has special animation
        if (skinId === 'rainbow') {
            this.isRainbow = true;
        }
    }

    setupTouchControls() {
        this.touchControls = {
            left: false,
            right: false,
            jump: false,
            kick: false
        };

        // Virtual buttons for mobile
        if (this.scene.sys.game.device.input.touch) {
            this.scene.input.on('pointerdown', (pointer) => {
                const x = pointer.x;
                const y = pointer.y;

                if (y > GAME_HEIGHT * 0.7) {
                    // Bottom area - movement
                    if (x < GAME_WIDTH * 0.3) {
                        this.touchControls.left = true;
                    } else if (x > GAME_WIDTH * 0.7) {
                        this.touchControls.right = true;
                    } else {
                        this.touchControls.kick = true;
                    }
                } else {
                    // Upper area - jump
                    this.touchControls.jump = true;
                }
            });

            this.scene.input.on('pointerup', () => {
                this.touchControls.left = false;
                this.touchControls.right = false;
                this.touchControls.jump = false;
                this.touchControls.kick = false;
            });
        }
    }

    update() {
        if (!this.active) return;

        this.wasGrounded = this.isGrounded;
        this.isGrounded = this.body.blocked.down || this.body.touching.down;

        // Detect landing
        if (this.isGrounded && !this.wasGrounded && this.body.velocity.y >= 0) {
            this.onLanding();
        }

        this.handleMovement();
        this.handleJump();
        this.handleKick();
        this.updateAnimations();
        this.updateVisuals();
        this.checkBounds();
    }

    handleMovement() {
        const baseSpeed = PLAYER_CONFIG.SPEED;
        const speed = baseSpeed * (this.speedMultiplier || 1);
        const leftPressed = this.cursors.left.isDown || this.wasd.A.isDown || this.touchControls.left;
        const rightPressed = this.cursors.right.isDown || this.wasd.D.isDown || this.touchControls.right;

        if (leftPressed) {
            this.setVelocityX(-speed);
            this.facingRight = false;
        } else if (rightPressed) {
            this.setVelocityX(speed);
            this.facingRight = true;
        } else {
            this.setVelocityX(0);
        }

        // Flip sprite based on direction
        this.setFlipX(!this.facingRight);

        // Create walk particles when moving on ground
        if ((leftPressed || rightPressed) && this.isGrounded) {
            this.createWalkParticles();
        }
    }

    createWalkParticles() {
        // Throttle particle creation
        this.walkParticleTimer = this.walkParticleTimer || 0;
        this.walkParticleTimer -= 16; // Approximate frame time
        if (this.walkParticleTimer > 0) return;
        this.walkParticleTimer = 80; // Spawn every 80ms

        // Get selected particle type
        const particleType = window.gameState.shop ? window.gameState.shop.selectedParticle : 'DEFAULT';
        const particleConfig = PARTICLES[particleType] || PARTICLES.DEFAULT;

        // Create 2-3 particles per step
        const count = Phaser.Math.Between(2, 3);
        for (let i = 0; i < count; i++) {
            // Determine color based on particle type
            let color = particleConfig.color;
            if (particleConfig.secondaryColor && Math.random() > 0.5) {
                color = particleConfig.secondaryColor;
            }
            // Rainbow special case - cycle through colors
            if (particleType === 'RAINBOW') {
                const hue = (this.scene.time.now * 0.002 + i * 0.3) % 1;
                const rgb = this.hsvToRgb(hue, 1, 1);
                color = (rgb.r << 16) | (rgb.g << 8) | rgb.b;
            }

            // Create particle behind player (opposite of facing direction)
            const offsetX = this.facingRight ? -8 : 8;
            const particle = this.scene.add.circle(
                this.x + offsetX + Phaser.Math.Between(-4, 4),
                this.y + 10 + Phaser.Math.Between(-2, 2),
                Phaser.Math.Between(2, 4),
                color,
                0.8
            );
            particle.setDepth(95);

            // Animate particle - float up and fade out
            const driftX = this.facingRight ? -1 : 1;
            this.scene.tweens.add({
                targets: particle,
                x: particle.x + driftX * Phaser.Math.Between(8, 15),
                y: particle.y - Phaser.Math.Between(10, 20),
                alpha: 0,
                scale: Phaser.Math.FloatBetween(0.3, 0.8),
                duration: Phaser.Math.Between(200, 350),
                ease: 'Power2',
                onComplete: () => { if (particle.active) particle.destroy(); }
            });
        }
    }

    handleJump() {
        const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.W) || this.touchControls.jump;

        if (jumpPressed && this.isGrounded) {
            let jumpVelocity = PLAYER_CONFIG.JUMP_VELOCITY;

            // Rocket boots powerup
            if (this.powerups.rocketBoots) {
                jumpVelocity *= POWERUP_CONFIG.ROCKET_BOOTS.JUMP_MULTIPLIER;
                this.createJumpParticles();
            }

            this.setVelocityY(jumpVelocity);
            this.scene.soundManager.playSound('jump');

            // Track jump achievement
            if (this.scene.scoreManager) {
                this.scene.scoreManager.recordJump();
            }

            // Reset touch jump to prevent holding
            this.touchControls.jump = false;
        }
    }

    handleKick() {
        const kickPressed = Phaser.Input.Keyboard.JustDown(this.kickKey) || Phaser.Input.Keyboard.JustDown(this.wasd.S) || this.touchControls.kick;

        if (kickPressed && !this.kickCooldown) {
            this.performKick();
        }

        // Reset touch kick
        if (this.touchControls.kick) {
            this.touchControls.kick = false;
        }
    }

    performKick() {
        this.isKicking = true;
        this.kickCooldown = true;
        this.setTexture('player_kick');

        this.scene.soundManager.playSound('kick');

        // Create kick hitbox
        const kickDirection = this.facingRight ? 1 : -1;
        const kickX = this.x + (kickDirection * 20);
        const kickY = this.y;

        // Find enemies in kick range
        const enemies = this.scene.enemies.getChildren();
        let kickedCount = 0;

        enemies.forEach(enemy => {
            if (!enemy.active) return;

            const dist = Phaser.Math.Distance.Between(kickX, kickY, enemy.x, enemy.y);
            if (dist < 35) {
                this.kickEnemy(enemy, kickDirection);
                kickedCount++;
            }
        });

        // Style bonus for air kick
        if (!this.isGrounded && kickedCount > 0) {
            this.scene.scoreManager.addStyleBonus('AIR_KICK');
        }

        // Multi-kick bonus
        if (kickedCount >= 2) {
            this.scene.scoreManager.addStyleBonus('DOUBLE_KICK');
        }
        if (kickedCount >= 3) {
            this.scene.scoreManager.addStyleBonus('TRIPLE_KICK');
        }

        // Kick particles
        this.createKickParticles(kickX, kickY);

        // End kick after short duration
        this.scene.time.delayedCall(150, () => {
            this.isKicking = false;
            this.setTexture('player');
        });

        // Cooldown
        this.scene.time.delayedCall(PLAYER_CONFIG.KICK_COOLDOWN, () => {
            this.kickCooldown = false;
        });
    }

    kickEnemy(enemy, direction) {
        const force = PLAYER_CONFIG.KICK_FORCE / enemy.mass;

        // Apply force to enemy
        enemy.setVelocity(direction * force, -150);
        enemy.isKicked = true;
        enemy.kickedBy = this;

        // Track kick for combos
        this.scene.scoreManager.registerKick(enemy);
    }

    createKickParticles(x, y) {
        // Main burst particles
        for (let i = 0; i < 12; i++) {
            const particle = this.scene.add.sprite(x, y, 'spark');
            particle.setTint(i % 2 === 0 ? 0xffff00 : 0xffaa00);
            particle.setScale(Phaser.Math.FloatBetween(0.5, 1.2));

            const angle = (i / 12) * Math.PI * 2;
            const dist = Phaser.Math.Between(25, 50);

            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                alpha: 0,
                scale: 0,
                rotation: Phaser.Math.FloatBetween(-3, 3),
                duration: 300,
                ease: 'Power2',
                onComplete: () => { if (particle.active) particle.destroy(); }
            });
        }

        // Speed lines in kick direction
        const kickDir = this.facingRight ? 1 : -1;
        for (let i = 0; i < 5; i++) {
            const line = this.scene.add.rectangle(
                x + kickDir * 10,
                y + Phaser.Math.Between(-15, 15),
                Phaser.Math.Between(15, 30),
                2,
                0xffffff,
                0.7
            );
            line.setDepth(99);

            this.scene.tweens.add({
                targets: line,
                x: line.x + kickDir * 40,
                scaleX: 0,
                alpha: 0,
                duration: 150,
                delay: i * 20,
                onComplete: () => { if (line.active) line.destroy(); }
            });
        }

        // Add multiple impact rings
        for (let i = 0; i < 3; i++) {
            const ring = this.scene.add.circle(x, y, 5 + i * 3, 0xffff00, 0.6 - i * 0.15);
            ring.setDepth(99);
            this.scene.tweens.add({
                targets: ring,
                scaleX: 3 + i,
                scaleY: 3 + i,
                alpha: 0,
                duration: 200 + i * 50,
                delay: i * 30,
                onComplete: () => { if (ring.active) ring.destroy(); }
            });
        }

    }

    createJumpParticles() {
        for (let i = 0; i < 10; i++) {
            const particle = this.scene.add.sprite(this.x, this.y + 10, 'spark');
            particle.setTint(0xff6600);
            particle.setScale(Phaser.Math.FloatBetween(0.3, 0.8));

            const spreadX = Phaser.Math.Between(-25, 25);
            this.scene.tweens.add({
                targets: particle,
                x: this.x + spreadX,
                y: this.y + Phaser.Math.Between(20, 40),
                alpha: 0,
                scale: 0,
                duration: 400,
                ease: 'Power2',
                onComplete: () => { if (particle.active) particle.destroy(); }
            });
        }

        // Jump stretch effect
        this.targetSquash = { x: 0.7, y: 1.4 };
    }

    onLanding() {
        // Landing squash effect
        this.targetSquash = { x: 1.3, y: 0.7 };

        // Create landing dust clouds
        for (let i = 0; i < 10; i++) {
            const dust = this.scene.add.circle(
                this.x + Phaser.Math.Between(-12, 12),
                this.y + 10,
                Phaser.Math.Between(3, 7),
                0x888888,
                0.5
            );
            dust.setDepth(99);

            const direction = i < 5 ? -1 : 1;
            this.scene.tweens.add({
                targets: dust,
                x: dust.x + direction * Phaser.Math.Between(20, 40),
                y: dust.y - Phaser.Math.Between(8, 20),
                alpha: 0,
                scale: 1.5,
                duration: 400,
                ease: 'Power2',
                onComplete: () => { if (dust.active) dust.destroy(); }
            });
        }

        // Ground impact ripple
        const ripple = this.scene.add.ellipse(this.x, this.y + 12, 20, 6, 0xffffff, 0.3);
        ripple.setDepth(98);
        this.scene.tweens.add({
            targets: ripple,
            scaleX: 3,
            scaleY: 1.5,
            alpha: 0,
            duration: 250,
            onComplete: () => { if (ripple.active) ripple.destroy(); }
        });

        // Small debris pieces
        for (let i = 0; i < 4; i++) {
            const debris = this.scene.add.rectangle(
                this.x + Phaser.Math.Between(-8, 8),
                this.y + 10,
                Phaser.Math.Between(2, 4),
                Phaser.Math.Between(2, 4),
                0x666666,
                0.7
            );
            debris.setDepth(99);

            this.scene.tweens.add({
                targets: debris,
                x: debris.x + Phaser.Math.Between(-25, 25),
                y: debris.y - Phaser.Math.Between(15, 35),
                rotation: Phaser.Math.FloatBetween(-2, 2),
                alpha: 0,
                duration: 500,
                ease: 'Power1',
                onComplete: () => { if (debris.active) debris.destroy(); }
            });
        }

    }

    updateAnimations() {
        this.animTime += 0.15;
        this.breathTimer += 0.03;

        // Running animation - bob up and down
        const isMoving = Math.abs(this.body.velocity.x) > 10;
        if (isMoving && this.isGrounded) {
            this.bobOffset = Math.sin(this.animTime * 2) * 2;
        } else {
            this.bobOffset *= 0.8; // Ease back to 0
        }

        // In-air animation
        if (!this.isGrounded) {
            // Lean in direction of movement
            const leanAngle = this.body.velocity.x * 0.0005;
            this.setRotation(leanAngle);
        } else {
            // Reset rotation when grounded
            this.rotation *= 0.8;
        }

        // Breathing animation (subtle)
        const breathScale = 1 + Math.sin(this.breathTimer) * 0.02;

        // Squash and stretch interpolation
        this.squashStretch.x += (this.targetSquash.x - this.squashStretch.x) * 0.2;
        this.squashStretch.y += (this.targetSquash.y - this.squashStretch.y) * 0.2;

        // Slowly return to normal
        this.targetSquash.x += (1 - this.targetSquash.x) * 0.1;
        this.targetSquash.y += (1 - this.targetSquash.y) * 0.1;

        // Apply squash/stretch with breathing
        this.setScale(this.squashStretch.x * breathScale, this.squashStretch.y);
    }

    updateVisuals() {
        // Flash when invincible
        if (this.isInvincible) {
            this.setAlpha(Math.sin(this.scene.time.now * 0.02) * 0.5 + 0.5);
        } else {
            this.setAlpha(1);
        }

        // Powerup visual effects override skin
        if (this.powerups.rocketBoots) {
            this.setTint(0xff6600);
        } else if (this.powerups.stickyGloves) {
            this.setTint(0x00ffff);
        } else if (this.powerups.overdrive) {
            this.setTint(0xff00ff);
        } else if (this.isRainbow) {
            // Rainbow cycling effect
            const hue = (this.scene.time.now * 0.001) % 1;
            const rgb = this.hsvToRgb(hue, 1, 1);
            this.setTint((rgb.r << 16) | (rgb.g << 8) | rgb.b);
        } else {
            // Apply skin color
            this.setTint(this.skinColor || 0x00ff88);
        }
    }

    hsvToRgb(h, s, v) {
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    checkBounds() {
        // Check if player fell out of elevator (death)
        const elevator = this.scene.elevator;
        if (elevator) {
            const leftBound = elevator.leftWall.x + ELEVATOR_CONFIG.WALL_THICKNESS / 2;
            const rightBound = elevator.rightWall.x - ELEVATOR_CONFIG.WALL_THICKNESS / 2;

            // Only die if fallen out through an open door
            if (this.y > GAME_HEIGHT + 50) {
                this.die('FELL OUT');
            }

            // Also check if pushed out sides when doors are open
            if (this.x < leftBound - 30 || this.x > rightBound + 30) {
                if (elevator.leftDoorOpen || elevator.rightDoorOpen) {
                    this.die('FELL OUT');
                }
            }
        }
    }

    takeDamage(source = 'ENEMY') {
        if (this.isInvincible) return;

        this.health--;
        this.scene.soundManager.playSound('hurt');

        // Track damage achievement
        if (this.scene.scoreManager) {
            this.scene.scoreManager.recordDamage();
        }

        // Damage particles
        for (let i = 0; i < 10; i++) {
            const particle = this.scene.add.sprite(this.x, this.y, 'damage_particle');
            this.scene.tweens.add({
                targets: particle,
                x: this.x + Phaser.Math.Between(-40, 40),
                y: this.y + Phaser.Math.Between(-40, 40),
                alpha: 0,
                duration: 400,
                onComplete: () => particle.destroy()
            });
        }

        // Update UI
        this.scene.updateHealthUI();

        if (this.health <= 0) {
            this.die(source);
        } else {
            // Invincibility frames
            this.isInvincible = true;
            this.scene.time.delayedCall(PLAYER_CONFIG.INVINCIBILITY_TIME, () => {
                this.isInvincible = false;
            });
        }
    }

    die(cause) {
        if (!this.active) return;

        this.active = false;
        this.scene.soundManager.playSound('death');

        // Death animation
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            y: this.y + 50,
            angle: 180,
            duration: 500
        });

        // Delay then game over
        this.scene.time.delayedCall(1000, () => {
            this.scene.gameOver(cause);
        });
    }

    applyPowerup(type) {
        this.scene.soundManager.playSound('powerup');

        switch (type) {
            case 'ROCKET_BOOTS':
                this.powerups.rocketBoots = true;
                this.scene.time.delayedCall(POWERUP_CONFIG.ROCKET_BOOTS.DURATION, () => {
                    this.powerups.rocketBoots = false;
                });
                break;

            case 'STICKY_GLOVES':
                this.powerups.stickyGloves = true;
                this.scene.time.delayedCall(POWERUP_CONFIG.STICKY_GLOVES.DURATION, () => {
                    this.powerups.stickyGloves = false;
                });
                break;

            case 'FREEZE_FLOOR':
                this.powerups.freezeFloor = true;
                this.scene.applyFreezeFloor();
                this.scene.time.delayedCall(POWERUP_CONFIG.FREEZE_FLOOR.DURATION, () => {
                    this.powerups.freezeFloor = false;
                    this.scene.removeFreezeFloor();
                });
                break;

            case 'OVERDRIVE':
                this.powerups.overdrive = true;
                this.scene.scoreManager.setMultiplier(POWERUP_CONFIG.OVERDRIVE.SCORE_MULTIPLIER);
                this.scene.time.delayedCall(POWERUP_CONFIG.OVERDRIVE.DURATION, () => {
                    this.powerups.overdrive = false;
                    this.scene.scoreManager.setMultiplier(1);
                });
                break;
        }
    }
}
