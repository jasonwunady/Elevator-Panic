class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Track when loading started
        this.loadStartTime = Date.now();

        // Generate textures first so we can use them in loading animation
        this.generateTextures();

        // Create animated loading screen
        this.createLoadingAnimation();

        // Log load errors for debugging
        this.load.on('loaderror', (file) => {
            console.error('Failed to load:', file.key, file.url);
        });

        // Load music with error handling - encode URI for special characters
        this.load.audio('levelMusic', ['assets/sounds/last-wave-standing.mp3']);
        this.load.audio('menuMusic', ['assets/sounds/boss-mode-baby.mp3']);
        this.load.audio('beatsyncMusic', ['assets/sounds/BEATSYNC%20Main%20Menu%20(1).mp3']);
    }

    createLoadingAnimation() {
        // Hide HTML loading bar
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }

        // Background
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0a0a1a);

        // Title
        const title = this.add.text(GAME_WIDTH / 2, 40, 'ELEVATOR PANIC', {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#ffcc00'
        }).setOrigin(0.5);

        // Pulse title
        this.tweens.add({
            targets: title,
            scale: { from: 1, to: 1.05 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Create mini elevator scene
        const elevatorY = GAME_HEIGHT / 2 + 20;
        const elevatorWidth = 200;
        const elevatorHeight = 120;

        // Elevator background
        this.add.rectangle(GAME_WIDTH / 2, elevatorY, elevatorWidth, elevatorHeight, 0x2a2a4a);

        // Elevator walls
        this.add.rectangle(GAME_WIDTH / 2 - elevatorWidth / 2 + 5, elevatorY, 10, elevatorHeight, 0x4a4a6a);
        this.add.rectangle(GAME_WIDTH / 2 + elevatorWidth / 2 - 5, elevatorY, 10, elevatorHeight, 0x4a4a6a);

        // Elevator floor
        this.add.rectangle(GAME_WIDTH / 2, elevatorY + elevatorHeight / 2 - 5, elevatorWidth, 10, 0x3a3a5a);

        // Create player sprite in loading scene
        this.loadingPlayer = this.add.sprite(GAME_WIDTH / 2 - 30, elevatorY + 30, 'player');
        this.loadingPlayer.setScale(2);

        // Player idle animation
        this.tweens.add({
            targets: this.loadingPlayer,
            y: elevatorY + 25,
            duration: 300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Create enemies that approach and get kicked
        this.loadingEnemies = [];
        this.spawnLoadingEnemy();

        // Spawn new enemies periodically
        this.time.addEvent({
            delay: 1200,
            callback: this.spawnLoadingEnemy,
            callbackScope: this,
            loop: true
        });

        // Player kick animation
        this.time.addEvent({
            delay: 800,
            callback: this.playerKickAnimation,
            callbackScope: this,
            loop: true
        });

        // Loading text
        this.loadingText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 50, 'LOADING...', {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Dots animation
        let dots = 0;
        this.time.addEvent({
            delay: 400,
            callback: () => {
                dots = (dots + 1) % 4;
                this.loadingText.setText('LOADING' + '.'.repeat(dots));
            },
            loop: true
        });

        // Progress bar
        this.progressBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 25, 200, 10, 0x333333);
        this.progressFill = this.add.rectangle(GAME_WIDTH / 2 - 100, GAME_HEIGHT - 25, 0, 10, 0xffcc00);
        this.progressFill.setOrigin(0, 0.5);

        // Animate progress bar over 5 seconds (matches minimum load time)
        this.tweens.add({
            targets: this.progressFill,
            width: 200,
            duration: 5000,
            ease: 'Linear'
        });
    }

    spawnLoadingEnemy() {
        const enemyTypes = ['enemy_rusher', 'enemy_clinger', 'enemy_exploder', 'enemy_bouncer', 'enemy_heavy'];
        const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

        const elevatorY = GAME_HEIGHT / 2 + 20;
        const enemy = this.add.sprite(GAME_WIDTH / 2 + 80, elevatorY + 30, type);
        enemy.setScale(2);

        // Enemy approach
        this.tweens.add({
            targets: enemy,
            x: GAME_WIDTH / 2,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                // Get kicked!
                this.tweens.add({
                    targets: enemy,
                    x: GAME_WIDTH / 2 + 150,
                    y: elevatorY - 50,
                    alpha: 0,
                    rotation: Math.PI * 2,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        enemy.destroy();
                    }
                });

                // Kick effect
                this.createKickEffect(enemy.x, enemy.y);
            }
        });

        this.loadingEnemies.push(enemy);
    }

    playerKickAnimation() {
        if (!this.loadingPlayer) return;

        // Quick kick motion
        this.tweens.add({
            targets: this.loadingPlayer,
            x: this.loadingPlayer.x + 15,
            scaleX: 2.3,
            duration: 100,
            yoyo: true,
            ease: 'Power2'
        });
    }

    createKickEffect(x, y) {
        // Spark particles
        for (let i = 0; i < 6; i++) {
            const spark = this.add.rectangle(
                x, y,
                4, 4,
                0xffff00
            );

            this.tweens.add({
                targets: spark,
                x: x + Phaser.Math.Between(-30, 30),
                y: y + Phaser.Math.Between(-30, 30),
                alpha: 0,
                duration: 300,
                onComplete: () => spark.destroy()
            });
        }

        // Impact text
        const impacts = ['POW!', 'BAM!', 'KICK!', 'WHAM!'];
        const impactText = this.add.text(x, y - 20, impacts[Math.floor(Math.random() * impacts.length)], {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#ffcc00'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: impactText,
            y: y - 50,
            alpha: 0,
            duration: 400,
            onComplete: () => impactText.destroy()
        });
    }

    generateTextures() {
        // Player sprite
        this.createPlayerTexture();

        // Enemy sprites
        this.createEnemyTextures();

        // Powerup sprites
        this.createPowerupTextures();

        // UI and environment
        this.createEnvironmentTextures();

        // Particles
        this.createParticleTextures();
    }

    createPlayerTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Player body (16x24)
        graphics.fillStyle(0x00ff88);
        graphics.fillRect(2, 0, 12, 20);

        // Head
        graphics.fillStyle(0x00dd66);
        graphics.fillRect(4, 0, 8, 8);

        // Eyes
        graphics.fillStyle(0xffffff);
        graphics.fillRect(5, 2, 2, 2);
        graphics.fillRect(9, 2, 2, 2);

        // Legs
        graphics.fillStyle(0x008844);
        graphics.fillRect(3, 18, 4, 6);
        graphics.fillRect(9, 18, 4, 6);

        graphics.generateTexture('player', 16, 24);
        graphics.destroy();

        // Player kick frame
        const kickGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        kickGraphics.fillStyle(0x00ff88);
        kickGraphics.fillRect(0, 0, 12, 20);
        kickGraphics.fillStyle(0x00dd66);
        kickGraphics.fillRect(2, 0, 8, 8);
        kickGraphics.fillStyle(0xffffff);
        kickGraphics.fillRect(3, 2, 2, 2);
        kickGraphics.fillRect(7, 2, 2, 2);
        // Extended kick leg
        kickGraphics.fillStyle(0x008844);
        kickGraphics.fillRect(1, 18, 4, 6);
        kickGraphics.fillRect(12, 14, 8, 4);
        kickGraphics.generateTexture('player_kick', 20, 24);
        kickGraphics.destroy();
    }

    createEnemyTextures() {
        // RUSHER - angry red demon with horns
        let g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xff4444);
        g.fillRect(1, 4, 12, 10);
        g.fillStyle(0xcc2222);
        g.fillRect(2, 3, 10, 2);
        // Horns
        g.fillStyle(0xaa0000);
        g.fillRect(1, 0, 2, 4);
        g.fillRect(11, 0, 2, 4);
        // Eyes (angry)
        g.fillStyle(0xffffff);
        g.fillRect(3, 5, 3, 3);
        g.fillRect(8, 5, 3, 3);
        g.fillStyle(0x000000);
        g.fillRect(4, 6, 2, 2);
        g.fillRect(9, 6, 2, 2);
        // Angry eyebrows
        g.fillStyle(0x880000);
        g.fillRect(2, 4, 4, 1);
        g.fillRect(8, 4, 4, 1);
        // Teeth
        g.fillStyle(0xffffff);
        g.fillRect(4, 11, 2, 2);
        g.fillRect(8, 11, 2, 2);
        g.generateTexture('enemy_rusher', 14, 14);
        g.destroy();

        // CLINGER - green spider with 8 legs
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x44ff44);
        g.fillRect(3, 3, 6, 6);
        g.fillStyle(0x22cc22);
        // 8 Legs (4 per side)
        g.fillRect(0, 1, 3, 2);
        g.fillRect(9, 1, 3, 2);
        g.fillRect(0, 4, 3, 2);
        g.fillRect(9, 4, 3, 2);
        g.fillRect(0, 7, 3, 2);
        g.fillRect(9, 7, 3, 2);
        g.fillRect(0, 10, 3, 2);
        g.fillRect(9, 10, 3, 2);
        // Multiple eyes (spider-like)
        g.fillStyle(0xff0000);
        g.fillRect(4, 4, 2, 2);
        g.fillRect(6, 4, 2, 2);
        g.fillStyle(0x000000);
        g.fillRect(4, 6, 1, 1);
        g.fillRect(5, 7, 1, 1);
        g.fillRect(6, 6, 1, 1);
        g.fillRect(7, 7, 1, 1);
        g.generateTexture('enemy_clinger', 12, 12);
        g.destroy();

        // EXPLODER - round bomb with lit fuse and scared face
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffaa00);
        g.fillRect(2, 4, 12, 12);
        g.fillRect(4, 2, 8, 4);
        g.fillRect(3, 3, 10, 2);
        g.fillStyle(0xff6600);
        g.fillRect(3, 5, 10, 8);
        // Fuse
        g.fillStyle(0x666666);
        g.fillRect(7, 0, 2, 4);
        // Spark on fuse
        g.fillStyle(0xffff00);
        g.fillRect(6, 0, 1, 2);
        g.fillRect(9, 0, 1, 2);
        g.fillStyle(0xff0000);
        g.fillRect(7, 0, 2, 1);
        // Worried face
        g.fillStyle(0x000000);
        g.fillRect(5, 7, 2, 2);
        g.fillRect(9, 7, 2, 2);
        // O-shaped worried mouth
        g.fillRect(6, 11, 4, 3);
        g.fillStyle(0xff6600);
        g.fillRect(7, 12, 2, 1);
        g.generateTexture('enemy_exploder', 16, 16);
        g.destroy();

        // Exploder warning (blinking red)
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xff0000);
        g.fillRect(2, 4, 12, 12);
        g.fillRect(4, 2, 8, 4);
        g.fillRect(3, 3, 10, 2);
        g.fillStyle(0xcc0000);
        g.fillRect(3, 5, 10, 8);
        g.fillStyle(0x666666);
        g.fillRect(7, 0, 2, 4);
        g.fillStyle(0xffff00);
        g.fillRect(6, 0, 4, 2);
        // Panic eyes
        g.fillStyle(0xffffff);
        g.fillRect(4, 6, 4, 4);
        g.fillRect(8, 6, 4, 4);
        g.fillStyle(0x000000);
        g.fillRect(5, 7, 2, 2);
        g.fillRect(9, 7, 2, 2);
        // Screaming mouth
        g.fillStyle(0x000000);
        g.fillRect(5, 11, 6, 3);
        g.generateTexture('enemy_exploder_warn', 16, 16);
        g.destroy();

        // HEAVY - purple armored brute with shield
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Body
        g.fillStyle(0x8844ff);
        g.fillRect(2, 2, 16, 16);
        // Armor plates
        g.fillStyle(0x6622cc);
        g.fillRect(0, 4, 4, 12);
        g.fillRect(16, 4, 4, 12);
        g.fillRect(4, 0, 12, 3);
        // Helmet
        g.fillStyle(0x5511aa);
        g.fillRect(4, 1, 12, 4);
        // Visor (angry eyes behind)
        g.fillStyle(0x000000);
        g.fillRect(5, 3, 10, 3);
        g.fillStyle(0xff0000);
        g.fillRect(6, 4, 3, 1);
        g.fillRect(11, 4, 3, 1);
        // Body detail
        g.fillStyle(0x7733dd);
        g.fillRect(6, 8, 8, 8);
        // Fists
        g.fillStyle(0x9955ff);
        g.fillRect(0, 14, 4, 4);
        g.fillRect(16, 14, 4, 4);
        g.generateTexture('enemy_heavy', 20, 20);
        g.destroy();

        // SPITTER - cyan blob with big mouth
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x00cccc);
        g.fillRect(1, 2, 12, 10);
        g.fillStyle(0x009999);
        g.fillRect(2, 1, 10, 2);
        // Cheeks (puffed)
        g.fillStyle(0x00aaaa);
        g.fillRect(0, 5, 2, 4);
        g.fillRect(12, 5, 2, 4);
        // Eyes
        g.fillStyle(0xffffff);
        g.fillRect(3, 3, 3, 3);
        g.fillRect(8, 3, 3, 3);
        g.fillStyle(0x000000);
        g.fillRect(4, 4, 2, 2);
        g.fillRect(9, 4, 2, 2);
        // Big open mouth
        g.fillStyle(0x006666);
        g.fillRect(3, 8, 8, 4);
        g.fillStyle(0x00cccc);
        g.fillRect(4, 9, 6, 2);
        g.generateTexture('enemy_spitter', 14, 14);
        g.destroy();

        // Spit projectile
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x00ffff);
        g.fillRect(1, 1, 4, 4);
        g.fillStyle(0xffffff);
        g.fillRect(2, 2, 2, 2);
        g.generateTexture('spit', 6, 6);
        g.destroy();

        // BOUNCER - pink ball with springs
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xff66aa);
        g.fillRect(2, 2, 8, 8);
        g.fillStyle(0xff3388);
        g.fillRect(1, 3, 2, 6);
        g.fillRect(9, 3, 2, 6);
        // Spring feet
        g.fillStyle(0xcccccc);
        g.fillRect(3, 10, 2, 2);
        g.fillRect(7, 10, 2, 2);
        g.fillStyle(0x888888);
        g.fillRect(3, 9, 2, 1);
        g.fillRect(7, 9, 2, 1);
        // Happy face
        g.fillStyle(0xffffff);
        g.fillRect(3, 4, 2, 2);
        g.fillRect(7, 4, 2, 2);
        g.fillStyle(0x000000);
        g.fillRect(4, 4, 1, 1);
        g.fillRect(8, 4, 1, 1);
        // Smile
        g.fillRect(4, 7, 4, 1);
        g.fillRect(3, 6, 1, 1);
        g.fillRect(8, 6, 1, 1);
        g.generateTexture('enemy_bouncer', 12, 12);
        g.destroy();

        // SPLITTER - yellow slime that divides
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xcccc00);
        g.fillRect(2, 4, 12, 10);
        g.fillStyle(0xaaaa00);
        g.fillRect(1, 6, 2, 6);
        g.fillRect(13, 6, 2, 6);
        // Division line hint
        g.fillStyle(0x888800);
        g.fillRect(7, 4, 2, 10);
        // Two sets of eyes (will split!)
        g.fillStyle(0xffffff);
        g.fillRect(3, 6, 2, 2);
        g.fillRect(11, 6, 2, 2);
        g.fillStyle(0x000000);
        g.fillRect(4, 6, 1, 1);
        g.fillRect(12, 6, 1, 1);
        // Blob drips
        g.fillStyle(0xcccc00);
        g.fillRect(4, 14, 2, 2);
        g.fillRect(10, 14, 2, 2);
        g.generateTexture('enemy_splitter', 16, 16);
        g.destroy();

        // Mini splitter (after splitting)
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xcccc00);
        g.fillRect(1, 2, 6, 5);
        g.fillStyle(0xffffff);
        g.fillRect(2, 3, 2, 2);
        g.fillStyle(0x000000);
        g.fillRect(3, 3, 1, 1);
        g.generateTexture('enemy_splitter_mini', 8, 8);
        g.destroy();

        // GHOST - translucent white with creepy face
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xddddff);
        g.fillRect(2, 0, 10, 12);
        g.fillStyle(0xccccee);
        g.fillRect(1, 2, 2, 8);
        g.fillRect(11, 2, 2, 8);
        // Wavy bottom
        g.fillRect(2, 12, 3, 2);
        g.fillRect(6, 13, 2, 2);
        g.fillRect(9, 12, 3, 2);
        // Hollow eyes
        g.fillStyle(0x000000);
        g.fillRect(4, 4, 2, 3);
        g.fillRect(8, 4, 2, 3);
        // Spooky mouth
        g.fillRect(5, 9, 4, 2);
        g.generateTexture('enemy_ghost', 14, 16);
        g.destroy();

        // Ghost phasing (semi-transparent version)
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x8888aa);
        g.fillRect(2, 0, 10, 12);
        g.fillStyle(0x777799);
        g.fillRect(1, 2, 2, 8);
        g.fillRect(11, 2, 2, 8);
        g.fillRect(2, 12, 3, 2);
        g.fillRect(6, 13, 2, 2);
        g.fillRect(9, 12, 3, 2);
        g.fillStyle(0x333344);
        g.fillRect(4, 4, 2, 3);
        g.fillRect(8, 4, 2, 3);
        g.fillRect(5, 9, 4, 2);
        g.generateTexture('enemy_ghost_phase', 14, 16);
        g.destroy();

        // CHARGER - orange bull-like creature with horns
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xff8800);
        g.fillRect(2, 4, 12, 8);
        g.fillStyle(0xcc6600);
        g.fillRect(0, 5, 4, 4);  // Head
        // Horns pointing forward
        g.fillStyle(0xffffcc);
        g.fillRect(0, 3, 2, 3);
        g.fillRect(0, 8, 2, 3);
        // Angry eyes
        g.fillStyle(0xff0000);
        g.fillRect(1, 6, 2, 2);
        // Hooves
        g.fillStyle(0x884400);
        g.fillRect(4, 12, 3, 2);
        g.fillRect(9, 12, 3, 2);
        // Steam from nostrils
        g.fillStyle(0xffffff);
        g.fillRect(0, 7, 1, 1);
        g.generateTexture('enemy_charger', 16, 14);
        g.destroy();

        // BOMBER - brown creature with backpack of bombs
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x884400);
        g.fillRect(2, 2, 10, 10);
        // Bomb backpack
        g.fillStyle(0x333333);
        g.fillRect(10, 3, 4, 8);
        g.fillStyle(0xff0000);
        g.fillRect(11, 4, 2, 2);
        g.fillRect(11, 7, 2, 2);
        // Face
        g.fillStyle(0xffffff);
        g.fillRect(4, 4, 2, 2);
        g.fillRect(7, 4, 2, 2);
        g.fillStyle(0x000000);
        g.fillRect(5, 5, 1, 1);
        g.fillRect(8, 5, 1, 1);
        // Helmet
        g.fillStyle(0x444444);
        g.fillRect(3, 1, 8, 3);
        // Grin
        g.fillStyle(0xffffff);
        g.fillRect(4, 9, 5, 2);
        g.generateTexture('enemy_bomber', 14, 14);
        g.destroy();

        // SHIELD - blue armored creature with shield
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x4488ff);
        g.fillRect(6, 2, 10, 12);
        // Large shield in front
        g.fillStyle(0x2266cc);
        g.fillRect(0, 0, 8, 16);
        g.fillStyle(0x1144aa);
        g.fillRect(1, 1, 6, 14);
        // Shield emblem
        g.fillStyle(0xffcc00);
        g.fillRect(3, 6, 2, 4);
        // Eye peeking over shield
        g.fillStyle(0xffffff);
        g.fillRect(9, 4, 3, 3);
        g.fillStyle(0x000000);
        g.fillRect(10, 5, 2, 2);
        // Feet
        g.fillStyle(0x3366aa);
        g.fillRect(8, 14, 3, 2);
        g.fillRect(12, 14, 3, 2);
        g.generateTexture('enemy_shield', 18, 16);
        g.destroy();

        // TELEPORTER - purple glitchy creature
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x9944ff);
        g.fillRect(2, 2, 8, 10);
        // Glitch effect pixels
        g.fillStyle(0xcc66ff);
        g.fillRect(0, 3, 2, 3);
        g.fillRect(10, 5, 2, 3);
        g.fillRect(4, 0, 4, 2);
        // Eyes
        g.fillStyle(0xffffff);
        g.fillRect(3, 4, 2, 2);
        g.fillRect(7, 4, 2, 2);
        g.fillStyle(0x000000);
        g.fillRect(4, 5, 1, 1);
        g.fillRect(8, 5, 1, 1);
        g.generateTexture('enemy_teleporter', 12, 14);
        g.destroy();

        // MIMIC - shapeshifter blob
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x888888);
        g.fillRect(2, 2, 10, 10);
        g.fillStyle(0xaaaaaa);
        g.fillRect(3, 3, 8, 8);
        // Question mark face
        g.fillStyle(0x000000);
        g.fillRect(5, 4, 4, 1);
        g.fillRect(8, 5, 1, 2);
        g.fillRect(6, 7, 2, 1);
        g.fillRect(6, 9, 2, 1);
        g.generateTexture('enemy_mimic', 14, 14);
        g.destroy();

        // MAGNET - metallic creature with magnetic field
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xcc3333);
        g.fillRect(0, 2, 5, 10);
        g.fillStyle(0x3333cc);
        g.fillRect(9, 2, 5, 10);
        g.fillStyle(0x666666);
        g.fillRect(4, 3, 6, 8);
        // Face
        g.fillStyle(0xffffff);
        g.fillRect(5, 5, 2, 2);
        g.fillRect(8, 5, 2, 2);
        g.fillStyle(0x000000);
        g.fillRect(6, 6, 1, 1);
        g.fillRect(9, 6, 1, 1);
        // Magnetic field lines
        g.fillStyle(0xffff00);
        g.fillRect(0, 0, 2, 2);
        g.fillRect(12, 0, 2, 2);
        g.generateTexture('enemy_magnet', 14, 14);
        g.destroy();

        // FREEZER - icy blue creature
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x66ccff);
        g.fillRect(2, 2, 10, 10);
        g.fillStyle(0xaaeeff);
        g.fillRect(1, 3, 2, 6);
        g.fillRect(11, 3, 2, 6);
        // Ice crystals on head
        g.fillStyle(0xffffff);
        g.fillRect(4, 0, 2, 3);
        g.fillRect(8, 0, 2, 3);
        g.fillRect(6, 0, 2, 2);
        // Face
        g.fillStyle(0x0044aa);
        g.fillRect(4, 5, 2, 2);
        g.fillRect(8, 5, 2, 2);
        g.fillRect(5, 9, 4, 2);
        g.generateTexture('enemy_freezer', 14, 14);
        g.destroy();

        // SPINNER - spinning blade enemy
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xcccccc);
        g.fillRect(4, 4, 4, 4);
        // Blades
        g.fillStyle(0x888888);
        g.fillRect(0, 5, 5, 2);
        g.fillRect(7, 5, 5, 2);
        g.fillRect(5, 0, 2, 5);
        g.fillRect(5, 7, 2, 5);
        // Red center eye
        g.fillStyle(0xff0000);
        g.fillRect(5, 5, 2, 2);
        g.generateTexture('enemy_spinner', 12, 12);
        g.destroy();

        // VAMPIRE - dark red bat-like creature
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x660022);
        g.fillRect(4, 4, 8, 10);
        // Wings
        g.fillStyle(0x440011);
        g.fillRect(0, 5, 5, 8);
        g.fillRect(11, 5, 5, 8);
        // Pointed ears
        g.fillRect(4, 0, 3, 5);
        g.fillRect(9, 0, 3, 5);
        // Glowing red eyes
        g.fillStyle(0xff0000);
        g.fillRect(6, 6, 2, 2);
        g.fillRect(9, 6, 2, 2);
        // Fangs
        g.fillStyle(0xffffff);
        g.fillRect(7, 11, 1, 2);
        g.fillRect(9, 11, 1, 2);
        g.generateTexture('enemy_vampire', 16, 16);
        g.destroy();

        // SUMMONER - robed wizard creature
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x442266);
        g.fillRect(3, 4, 10, 14);
        // Hood
        g.fillStyle(0x331155);
        g.fillRect(4, 0, 8, 8);
        g.fillRect(2, 3, 3, 5);
        g.fillRect(11, 3, 3, 5);
        // Glowing eyes under hood
        g.fillStyle(0x00ff00);
        g.fillRect(5, 4, 2, 2);
        g.fillRect(9, 4, 2, 2);
        // Staff
        g.fillStyle(0x8b4513);
        g.fillRect(13, 2, 2, 16);
        g.fillStyle(0x00ffff);
        g.fillRect(12, 0, 4, 3);
        g.generateTexture('enemy_summoner', 16, 18);
        g.destroy();

        // NINJA - fast dark assassin
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x222222);
        g.fillRect(2, 2, 8, 10);
        g.fillStyle(0x111111);
        g.fillRect(1, 3, 2, 6);
        g.fillRect(9, 3, 2, 6);
        // Headband
        g.fillStyle(0xff0000);
        g.fillRect(2, 3, 8, 2);
        // Eyes only visible
        g.fillStyle(0xffffff);
        g.fillRect(4, 5, 2, 1);
        g.fillRect(7, 5, 2, 1);
        // Sword on back
        g.fillStyle(0xaaaaaa);
        g.fillRect(9, 0, 1, 8);
        g.generateTexture('enemy_ninja', 12, 14);
        g.destroy();

        // TANK - heavily armored slow enemy
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x446644);
        g.fillRect(2, 4, 20, 16);
        // Treads
        g.fillStyle(0x333333);
        g.fillRect(0, 16, 6, 6);
        g.fillRect(18, 16, 6, 6);
        // Turret
        g.fillStyle(0x557755);
        g.fillRect(6, 0, 12, 8);
        // Cannon
        g.fillStyle(0x444444);
        g.fillRect(18, 2, 6, 4);
        // Viewport
        g.fillStyle(0xff6600);
        g.fillRect(8, 2, 4, 3);
        g.generateTexture('enemy_tank', 24, 22);
        g.destroy();

        // LEAPER - frog-like jumping creature
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x66aa44);
        g.fillRect(2, 3, 8, 5);
        // Big back legs
        g.fillStyle(0x448822);
        g.fillRect(0, 6, 3, 4);
        g.fillRect(9, 6, 3, 4);
        // Eyes on top
        g.fillStyle(0xffffff);
        g.fillRect(3, 0, 3, 4);
        g.fillRect(6, 0, 3, 4);
        g.fillStyle(0x000000);
        g.fillRect(4, 1, 2, 2);
        g.fillRect(7, 1, 2, 2);
        g.generateTexture('enemy_leaper', 12, 10);
        g.destroy();

        // SWARM - tiny insect
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x886600);
        g.fillRect(2, 2, 4, 4);
        // Wings
        g.fillStyle(0xcccc88);
        g.fillRect(0, 1, 3, 2);
        g.fillRect(5, 1, 3, 2);
        // Eyes
        g.fillStyle(0xff0000);
        g.fillRect(3, 3, 1, 1);
        g.fillRect(4, 3, 1, 1);
        g.generateTexture('enemy_swarm', 8, 8);
        g.destroy();

        // LASER - eye creature that shoots lasers
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x444466);
        g.fillRect(2, 2, 10, 12);
        // Large eye
        g.fillStyle(0xffffff);
        g.fillRect(4, 4, 6, 6);
        g.fillStyle(0xff0000);
        g.fillRect(5, 5, 4, 4);
        g.fillStyle(0x000000);
        g.fillRect(6, 6, 2, 2);
        // Antenna
        g.fillStyle(0x666688);
        g.fillRect(3, 0, 2, 3);
        g.fillRect(9, 0, 2, 3);
        // Charging indicator
        g.fillStyle(0xff0000);
        g.fillRect(6, 12, 2, 2);
        g.generateTexture('enemy_laser', 14, 16);
        g.destroy();

        // REFLECTOR - mirrored enemy that reflects kicks
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xaaaacc);
        g.fillRect(2, 2, 12, 10);
        // Mirror surface
        g.fillStyle(0xddddff);
        g.fillRect(3, 3, 10, 8);
        g.fillStyle(0xffffff);
        g.fillRect(4, 4, 3, 2);
        g.fillRect(9, 6, 2, 2);
        // Face reflection
        g.fillStyle(0x666688);
        g.fillRect(5, 5, 2, 2);
        g.fillRect(9, 5, 2, 2);
        g.generateTexture('enemy_reflector', 16, 14);
        g.destroy();

        // BERSERKER - angry red creature that gets stronger
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xcc2222);
        g.fillRect(2, 2, 12, 12);
        // Spiky hair
        g.fillStyle(0xff4444);
        g.fillRect(3, 0, 2, 3);
        g.fillRect(7, 0, 2, 4);
        g.fillRect(11, 0, 2, 3);
        // Angry face
        g.fillStyle(0xffffff);
        g.fillRect(4, 5, 3, 3);
        g.fillRect(9, 5, 3, 3);
        g.fillStyle(0x000000);
        g.fillRect(5, 6, 2, 2);
        g.fillRect(10, 6, 2, 2);
        // Angry mouth
        g.fillRect(5, 11, 6, 2);
        // Veins
        g.fillStyle(0xff6666);
        g.fillRect(1, 4, 1, 4);
        g.fillRect(14, 4, 1, 4);
        g.generateTexture('enemy_berserker', 16, 16);
        g.destroy();

        // CRAWLER - low ceiling-walking creature
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x664422);
        g.fillRect(0, 2, 16, 4);
        // Many legs
        g.fillStyle(0x442211);
        for (let i = 0; i < 6; i++) {
            g.fillRect(1 + i * 2.5, 6, 2, 2);
        }
        // Head
        g.fillStyle(0x885533);
        g.fillRect(12, 0, 4, 4);
        // Eyes
        g.fillStyle(0xff0000);
        g.fillRect(13, 1, 1, 1);
        g.fillRect(14, 1, 1, 1);
        g.generateTexture('enemy_crawler', 16, 8);
        g.destroy();

        // ========== 14 NEW ENEMY TEXTURES ==========

        // SHADOW - ghostly hooded figure with wispy tendrils
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Hooded cloak shape
        g.fillStyle(0x1a1a2e);
        g.fillRect(4, 0, 8, 4); // Hood top
        g.fillRect(2, 4, 12, 10); // Body
        g.fillStyle(0x0f0f1a);
        g.fillRect(3, 2, 10, 3); // Hood shadow
        // Wispy tendrils at bottom
        g.fillStyle(0x151525);
        g.fillRect(2, 14, 2, 4);
        g.fillRect(6, 14, 2, 3);
        g.fillRect(10, 14, 2, 4);
        g.fillRect(4, 15, 2, 2);
        g.fillRect(8, 15, 2, 3);
        // Glowing eyes in hood
        g.fillStyle(0xff00ff);
        g.fillRect(5, 5, 2, 2);
        g.fillRect(9, 5, 2, 2);
        // Eye glow
        g.fillStyle(0xff88ff);
        g.fillRect(5, 4, 2, 1);
        g.fillRect(9, 4, 2, 1);
        g.generateTexture('enemy_shadow', 16, 18);
        g.destroy();

        // SHADOW faded (invisible state)
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x0a0a15);
        g.fillRect(4, 0, 8, 4);
        g.fillRect(2, 4, 12, 10);
        g.fillStyle(0x080812);
        g.fillRect(3, 2, 10, 3);
        g.fillStyle(0x0a0a12);
        g.fillRect(2, 14, 2, 4);
        g.fillRect(6, 14, 2, 3);
        g.fillRect(10, 14, 2, 4);
        g.fillStyle(0x880088);
        g.fillRect(5, 5, 2, 2);
        g.fillRect(9, 5, 2, 2);
        g.generateTexture('enemy_shadow_fade', 16, 18);
        g.destroy();

        // GRAVITY - black hole orb with swirling rings
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Outer ring
        g.fillStyle(0x8866dd);
        g.fillRect(2, 6, 2, 6);
        g.fillRect(14, 6, 2, 6);
        g.fillRect(6, 2, 6, 2);
        g.fillRect(6, 14, 6, 2);
        // Main orb body
        g.fillStyle(0x2a1a4a);
        g.fillRect(4, 4, 10, 10);
        g.fillStyle(0x1a0a3a);
        g.fillRect(5, 5, 8, 8);
        // Event horizon (dark center)
        g.fillStyle(0x000011);
        g.fillRect(6, 6, 6, 6);
        // Singularity eye
        g.fillStyle(0xffffff);
        g.fillRect(7, 7, 4, 4);
        g.fillStyle(0xaa66ff);
        g.fillRect(8, 8, 2, 2);
        // Orbiting particles
        g.fillStyle(0xcc99ff);
        g.fillRect(0, 8, 2, 2);
        g.fillRect(16, 8, 2, 2);
        g.fillRect(8, 0, 2, 2);
        g.fillRect(8, 16, 2, 2);
        // Diagonal particles
        g.fillStyle(0xaa77ee);
        g.fillRect(2, 2, 2, 2);
        g.fillRect(14, 14, 2, 2);
        g.generateTexture('enemy_gravity', 18, 18);
        g.destroy();

        // SPLASHER - water droplet creature with splashing effect
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Droplet shape - pointed top, round bottom
        g.fillStyle(0x3399ee);
        g.fillRect(6, 0, 4, 2); // Tip
        g.fillRect(4, 2, 8, 2);
        g.fillRect(2, 4, 12, 8);
        g.fillRect(3, 12, 10, 2);
        // Highlight
        g.fillStyle(0x66ccff);
        g.fillRect(4, 3, 3, 2);
        g.fillRect(3, 5, 2, 3);
        // Splash droplets around
        g.fillStyle(0x3399ee);
        g.fillRect(0, 10, 2, 3);
        g.fillRect(14, 10, 2, 3);
        g.fillRect(1, 14, 2, 2);
        g.fillRect(13, 14, 2, 2);
        // Happy face
        g.fillStyle(0xffffff);
        g.fillRect(4, 6, 3, 3);
        g.fillRect(9, 6, 3, 3);
        g.fillStyle(0x1166aa);
        g.fillRect(5, 7, 2, 2);
        g.fillRect(10, 7, 2, 2);
        // Smile
        g.fillStyle(0x1166aa);
        g.fillRect(5, 11, 6, 1);
        g.fillRect(4, 10, 2, 1);
        g.fillRect(10, 10, 2, 1);
        g.generateTexture('enemy_splasher', 16, 16);
        g.destroy();

        // ANCHOR - ship anchor shape, heavy and metallic
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Ring at top
        g.fillStyle(0x778899);
        g.fillRect(7, 0, 6, 3);
        g.fillRect(6, 1, 8, 4);
        g.fillStyle(0x556677);
        g.fillRect(8, 1, 4, 2); // Ring hole
        // Shaft
        g.fillStyle(0x667788);
        g.fillRect(8, 4, 4, 10);
        // Cross bar
        g.fillStyle(0x778899);
        g.fillRect(4, 7, 12, 3);
        // Anchor hooks (curved bottom)
        g.fillStyle(0x556677);
        g.fillRect(2, 14, 4, 4);
        g.fillRect(14, 14, 4, 4);
        g.fillRect(0, 12, 4, 4);
        g.fillRect(16, 12, 4, 4);
        g.fillRect(1, 10, 3, 3);
        g.fillRect(16, 10, 3, 3);
        // Pointed tips
        g.fillStyle(0x445566);
        g.fillRect(0, 14, 2, 2);
        g.fillRect(18, 14, 2, 2);
        // Face on shaft
        g.fillStyle(0x334455);
        g.fillRect(8, 9, 2, 2);
        g.fillRect(10, 9, 2, 2);
        g.fillStyle(0xaabbcc);
        g.fillRect(9, 12, 2, 1);
        g.generateTexture('enemy_anchor', 20, 18);
        g.destroy();

        // PORTAL - swirling vortex creature
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Outer swirl
        g.fillStyle(0x6622aa);
        g.fillRect(2, 4, 2, 10);
        g.fillRect(14, 4, 2, 10);
        g.fillRect(4, 2, 10, 2);
        g.fillRect(4, 14, 10, 2);
        // Main portal body
        g.fillStyle(0x8844cc);
        g.fillRect(4, 4, 10, 10);
        // Inner vortex rings
        g.fillStyle(0xaa66ee);
        g.fillRect(5, 5, 8, 8);
        g.fillStyle(0xcc88ff);
        g.fillRect(6, 6, 6, 6);
        g.fillStyle(0xee99ff);
        g.fillRect(7, 7, 4, 4);
        // White center (portal opening)
        g.fillStyle(0xffffff);
        g.fillRect(8, 8, 2, 2);
        // Floating particles
        g.fillStyle(0xff66ff);
        g.fillRect(0, 8, 2, 2);
        g.fillRect(16, 8, 2, 2);
        g.fillRect(8, 0, 2, 2);
        g.fillRect(8, 16, 2, 2);
        // Swirl particles
        g.fillStyle(0xddaaff);
        g.fillRect(2, 2, 2, 2);
        g.fillRect(14, 2, 2, 2);
        g.fillRect(2, 14, 2, 2);
        g.fillRect(14, 14, 2, 2);
        g.generateTexture('enemy_portal', 18, 18);
        g.destroy();

        // ELECTRO - lightning bolt shaped creature
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Lightning bolt body
        g.fillStyle(0xffee00);
        g.fillRect(8, 0, 4, 3);
        g.fillRect(6, 2, 6, 3);
        g.fillRect(4, 4, 8, 3);
        g.fillRect(6, 6, 6, 3);
        g.fillRect(4, 8, 8, 3);
        g.fillRect(2, 10, 6, 3);
        g.fillRect(4, 12, 4, 3);
        // Highlight (white glow)
        g.fillStyle(0xffffff);
        g.fillRect(8, 1, 2, 2);
        g.fillRect(6, 4, 2, 2);
        g.fillRect(4, 9, 2, 2);
        // Sparks
        g.fillStyle(0xffff88);
        g.fillRect(0, 6, 2, 2);
        g.fillRect(12, 4, 2, 2);
        g.fillRect(0, 12, 2, 2);
        g.fillRect(10, 10, 2, 2);
        // Face
        g.fillStyle(0x000000);
        g.fillRect(5, 5, 2, 2);
        g.fillRect(9, 5, 2, 2);
        g.generateTexture('enemy_electro', 14, 15);
        g.destroy();

        // BLOB - large amorphous slime creature
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Main blob body - irregular shape
        g.fillStyle(0x33bb55);
        g.fillRect(4, 2, 14, 4);
        g.fillRect(2, 4, 18, 10);
        g.fillRect(4, 14, 14, 3);
        // Bumpy edges
        g.fillStyle(0x44cc66);
        g.fillRect(0, 6, 3, 6);
        g.fillRect(19, 6, 3, 6);
        g.fillRect(6, 0, 4, 3);
        g.fillRect(12, 0, 4, 3);
        // Dripping bottom
        g.fillStyle(0x33bb55);
        g.fillRect(5, 17, 2, 3);
        g.fillRect(10, 17, 3, 2);
        g.fillRect(15, 17, 2, 3);
        // Darker spots
        g.fillStyle(0x22aa44);
        g.fillRect(4, 8, 3, 3);
        g.fillRect(15, 10, 3, 3);
        g.fillRect(8, 12, 2, 2);
        // Eyes
        g.fillStyle(0xffffff);
        g.fillRect(6, 5, 4, 4);
        g.fillRect(12, 5, 4, 4);
        g.fillStyle(0x000000);
        g.fillRect(7, 6, 2, 3);
        g.fillRect(13, 6, 2, 3);
        // Goofy smile
        g.fillStyle(0x118833);
        g.fillRect(8, 11, 6, 2);
        g.generateTexture('enemy_blob', 22, 20);
        g.destroy();

        // HOMING - robotic turret with missile launcher
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Base/body
        g.fillStyle(0x884455);
        g.fillRect(2, 6, 12, 8);
        g.fillStyle(0x663344);
        g.fillRect(1, 8, 2, 4);
        g.fillRect(13, 8, 2, 4);
        // Treads/wheels
        g.fillStyle(0x444444);
        g.fillRect(2, 14, 4, 2);
        g.fillRect(10, 14, 4, 2);
        g.fillStyle(0x333333);
        g.fillRect(3, 14, 2, 2);
        g.fillRect(11, 14, 2, 2);
        // Missile launcher on top
        g.fillStyle(0x555555);
        g.fillRect(4, 0, 8, 6);
        g.fillStyle(0x666666);
        g.fillRect(5, 1, 6, 4);
        // Missile tips
        g.fillStyle(0xff2200);
        g.fillRect(5, 0, 2, 2);
        g.fillRect(9, 0, 2, 2);
        // Targeting sensor
        g.fillStyle(0x000000);
        g.fillRect(4, 8, 8, 3);
        g.fillStyle(0x00ff00);
        g.fillRect(5, 9, 2, 1);
        g.fillRect(9, 9, 2, 1);
        // Lock-on indicator
        g.fillStyle(0xff0000);
        g.fillRect(7, 9, 2, 1);
        g.generateTexture('enemy_homing', 16, 16);
        g.destroy();

        // Homing missile
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xcc0000);
        g.fillRect(2, 1, 6, 3);
        g.fillStyle(0xff2200);
        g.fillRect(6, 0, 3, 5);
        // Fins
        g.fillStyle(0x666666);
        g.fillRect(0, 0, 2, 2);
        g.fillRect(0, 3, 2, 2);
        // Exhaust
        g.fillStyle(0xff8800);
        g.fillRect(0, 1, 2, 3);
        g.generateTexture('homing_missile', 9, 5);
        g.destroy();

        // PHASER - glitchy digital creature
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Main body with glitch effect
        g.fillStyle(0x6688cc);
        g.fillRect(3, 2, 10, 12);
        // Glitch blocks offset
        g.fillStyle(0x88aaee);
        g.fillRect(1, 4, 3, 4);
        g.fillRect(12, 6, 3, 4);
        g.fillRect(5, 0, 4, 3);
        g.fillRect(7, 13, 4, 3);
        // Static/glitch lines
        g.fillStyle(0xaaccff);
        g.fillRect(4, 3, 8, 1);
        g.fillRect(4, 7, 8, 1);
        g.fillRect(4, 11, 8, 1);
        // Digital eyes
        g.fillStyle(0x00ffff);
        g.fillRect(4, 5, 3, 2);
        g.fillRect(9, 5, 3, 2);
        g.fillStyle(0xffffff);
        g.fillRect(5, 5, 1, 2);
        g.fillRect(10, 5, 1, 2);
        // Scanline mouth
        g.fillStyle(0x4466aa);
        g.fillRect(5, 9, 6, 2);
        g.generateTexture('enemy_phaser', 16, 16);
        g.destroy();

        // PHASER faded (phased state)
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x334466);
        g.fillRect(3, 2, 10, 12);
        g.fillStyle(0x445577);
        g.fillRect(1, 4, 3, 4);
        g.fillRect(12, 6, 3, 4);
        g.fillStyle(0x556688);
        g.fillRect(4, 3, 8, 1);
        g.fillRect(4, 7, 8, 1);
        g.fillStyle(0x007788);
        g.fillRect(4, 5, 3, 2);
        g.fillRect(9, 5, 3, 2);
        g.generateTexture('enemy_phaser_fade', 16, 16);
        g.destroy();

        // PUSHER - bull/ram creature with horns
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Horns
        g.fillStyle(0xaa7744);
        g.fillRect(0, 2, 3, 4);
        g.fillRect(17, 2, 3, 4);
        g.fillStyle(0xccaa66);
        g.fillRect(0, 0, 2, 3);
        g.fillRect(18, 0, 2, 3);
        // Main body
        g.fillStyle(0xcc7733);
        g.fillRect(3, 4, 14, 10);
        g.fillStyle(0xdd8844);
        g.fillRect(5, 2, 10, 4);
        // Snout
        g.fillStyle(0xeeaa66);
        g.fillRect(6, 10, 8, 4);
        g.fillStyle(0xcc8844);
        g.fillRect(7, 12, 2, 2);
        g.fillRect(11, 12, 2, 2);
        // Angry eyes
        g.fillStyle(0xffffff);
        g.fillRect(5, 5, 4, 3);
        g.fillRect(11, 5, 4, 3);
        g.fillStyle(0x000000);
        g.fillRect(7, 5, 2, 3);
        g.fillRect(13, 5, 2, 3);
        // Angry eyebrows
        g.fillStyle(0x994422);
        g.fillRect(4, 4, 4, 1);
        g.fillRect(12, 4, 4, 1);
        g.generateTexture('enemy_pusher', 20, 14);
        g.destroy();

        // DRAINER - vampire bat/leech hybrid
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Wings
        g.fillStyle(0x661155);
        g.fillRect(0, 4, 4, 8);
        g.fillRect(14, 4, 4, 8);
        g.fillStyle(0x551144);
        g.fillRect(0, 6, 3, 5);
        g.fillRect(15, 6, 3, 5);
        // Wing membrane lines
        g.fillStyle(0x882277);
        g.fillRect(1, 5, 1, 6);
        g.fillRect(2, 6, 1, 4);
        g.fillRect(15, 5, 1, 6);
        g.fillRect(16, 6, 1, 4);
        // Body
        g.fillStyle(0x772266);
        g.fillRect(4, 2, 10, 12);
        g.fillStyle(0x881177);
        g.fillRect(5, 3, 8, 10);
        // Fanged mouth
        g.fillStyle(0x440033);
        g.fillRect(6, 10, 6, 4);
        g.fillStyle(0xffffff);
        g.fillRect(6, 10, 2, 2);
        g.fillRect(10, 10, 2, 2);
        // Evil red eyes
        g.fillStyle(0xff0000);
        g.fillRect(5, 5, 3, 3);
        g.fillRect(10, 5, 3, 3);
        g.fillStyle(0xffffff);
        g.fillRect(6, 6, 1, 1);
        g.fillRect(11, 6, 1, 1);
        g.generateTexture('enemy_drainer', 18, 14);
        g.destroy();

        // CLONER - cell dividing creature with two halves
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Left half
        g.fillStyle(0x55aa77);
        g.fillRect(1, 2, 7, 12);
        g.fillStyle(0x44996);
        g.fillRect(0, 4, 2, 8);
        // Right half
        g.fillStyle(0x66bb88);
        g.fillRect(10, 2, 7, 12);
        g.fillStyle(0x55aa77);
        g.fillRect(16, 4, 2, 8);
        // Division line (pinching in middle)
        g.fillStyle(0x338855);
        g.fillRect(8, 0, 2, 4);
        g.fillRect(8, 6, 2, 4);
        g.fillRect(8, 12, 2, 4);
        // Nuclei
        g.fillStyle(0x88ddaa);
        g.fillRect(3, 6, 3, 3);
        g.fillRect(12, 6, 3, 3);
        // Eyes - one in each half
        g.fillStyle(0xffffff);
        g.fillRect(3, 4, 2, 2);
        g.fillRect(13, 4, 2, 2);
        g.fillStyle(0x000000);
        g.fillRect(4, 4, 1, 2);
        g.fillRect(14, 4, 1, 2);
        // Small smile in each half
        g.fillStyle(0x227744);
        g.fillRect(3, 10, 3, 1);
        g.fillRect(12, 10, 3, 1);
        g.generateTexture('enemy_cloner', 18, 16);
        g.destroy();

        // SHIELDER - robot with shield projectors
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Shield bubble (outer)
        g.fillStyle(0x4488ff);
        g.fillRect(0, 2, 2, 14);
        g.fillRect(18, 2, 2, 14);
        g.fillRect(2, 0, 16, 2);
        g.fillRect(2, 16, 16, 2);
        // Shield projector arms
        g.fillStyle(0x3366cc);
        g.fillRect(2, 4, 3, 10);
        g.fillRect(15, 4, 3, 10);
        // Main body
        g.fillStyle(0x5577bb);
        g.fillRect(5, 3, 10, 12);
        g.fillStyle(0x6688cc);
        g.fillRect(6, 4, 8, 10);
        // Energy core (glowing center)
        g.fillStyle(0x88ccff);
        g.fillRect(8, 6, 4, 4);
        g.fillStyle(0xffffff);
        g.fillRect(9, 7, 2, 2);
        // Antenna
        g.fillStyle(0x4466aa);
        g.fillRect(9, 0, 2, 4);
        g.fillStyle(0x88ccff);
        g.fillRect(9, 0, 2, 2);
        // Face
        g.fillStyle(0x223355);
        g.fillRect(7, 10, 2, 2);
        g.fillRect(11, 10, 2, 2);
        g.generateTexture('enemy_shielder', 20, 18);
        g.destroy();

        // BOOMER - round bomb creature with fuse
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Bomb body (round)
        g.fillStyle(0x222222);
        g.fillRect(3, 4, 10, 10);
        g.fillRect(2, 5, 12, 8);
        g.fillRect(4, 3, 8, 12);
        // Fuse tube
        g.fillStyle(0x444444);
        g.fillRect(6, 0, 4, 4);
        // Lit fuse (spark)
        g.fillStyle(0xff6600);
        g.fillRect(6, 0, 4, 2);
        g.fillStyle(0xffff00);
        g.fillRect(7, 0, 2, 1);
        // Warning stripes
        g.fillStyle(0xffcc00);
        g.fillRect(3, 6, 2, 6);
        g.fillRect(6, 6, 2, 6);
        g.fillRect(9, 6, 2, 6);
        // Worried face
        g.fillStyle(0xffffff);
        g.fillRect(4, 7, 2, 2);
        g.fillRect(10, 7, 2, 2);
        g.fillStyle(0x000000);
        g.fillRect(5, 7, 1, 2);
        g.fillRect(11, 7, 1, 2);
        // Worried mouth
        g.fillStyle(0xffffff);
        g.fillRect(6, 11, 4, 2);
        g.fillStyle(0x000000);
        g.fillRect(7, 11, 2, 1);
        g.generateTexture('enemy_boomer', 16, 14);
        g.destroy();

        // BOOMER warning state (about to explode)
        g = this.make.graphics({ x: 0, y: 0, add: false });
        // Red bomb body
        g.fillStyle(0xcc0000);
        g.fillRect(3, 4, 10, 10);
        g.fillRect(2, 5, 12, 8);
        g.fillRect(4, 3, 8, 12);
        // Sparking fuse
        g.fillStyle(0xffff00);
        g.fillRect(6, 0, 4, 4);
        g.fillStyle(0xffffff);
        g.fillRect(7, 0, 2, 2);
        // Bright warning stripes
        g.fillStyle(0xffff00);
        g.fillRect(3, 6, 2, 6);
        g.fillRect(6, 6, 2, 6);
        g.fillRect(9, 6, 2, 6);
        // Panic face
        g.fillStyle(0xffffff);
        g.fillRect(4, 6, 3, 3);
        g.fillRect(9, 6, 3, 3);
        g.fillStyle(0x000000);
        g.fillRect(5, 7, 1, 1);
        g.fillRect(10, 7, 1, 1);
        // Screaming mouth
        g.fillStyle(0x000000);
        g.fillRect(6, 11, 4, 2);
        g.generateTexture('enemy_boomer_warn', 16, 14);
        g.destroy();
    }

    createPowerupTextures() {
        const powerups = [
            { name: 'powerup_rocket', color: 0xff6600 },
            { name: 'powerup_sticky', color: 0x00ffff },
            { name: 'powerup_freeze', color: 0x66ccff },
            { name: 'powerup_overdrive', color: 0xff00ff },
            { name: 'powerup_brake', color: 0xffff00 }
        ];

        powerups.forEach(pu => {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            // Glowing box
            g.fillStyle(0xffffff);
            g.fillRect(2, 2, 12, 12);
            g.fillStyle(pu.color);
            g.fillRect(3, 3, 10, 10);
            g.fillStyle(0xffffff);
            g.fillRect(4, 4, 3, 3);
            // Border glow
            g.fillStyle(pu.color, 0.5);
            g.fillRect(0, 0, 16, 2);
            g.fillRect(0, 14, 16, 2);
            g.fillRect(0, 0, 2, 16);
            g.fillRect(14, 0, 2, 16);
            g.generateTexture(pu.name, 16, 16);
            g.destroy();
        });
    }

    createEnvironmentTextures() {
        // Elevator wall tile
        let g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x4a4a6a);
        g.fillRect(0, 0, 20, 20);
        g.fillStyle(0x3a3a5a);
        g.fillRect(0, 0, 20, 2);
        g.fillRect(0, 0, 2, 20);
        g.fillStyle(0x5a5a7a);
        g.fillRect(18, 0, 2, 20);
        g.fillRect(0, 18, 20, 2);
        g.generateTexture('wall', 20, 20);
        g.destroy();

        // Elevator door
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x6a6a8a);
        g.fillRect(0, 0, 30, 80);
        g.fillStyle(0x5a5a7a);
        g.fillRect(14, 0, 2, 80);
        // Handle
        g.fillStyle(0xaaaacc);
        g.fillRect(10, 35, 4, 10);
        g.generateTexture('door', 30, 80);
        g.destroy();

        // Floor tile
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x2a2a4a);
        g.fillRect(0, 0, 20, 20);
        g.fillStyle(0x3a3a5a);
        g.fillRect(0, 0, 20, 4);
        g.generateTexture('floor', 20, 20);
        g.destroy();

        // Warning light
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xff0000);
        g.fillCircle(6, 6, 6);
        g.fillStyle(0xff6666);
        g.fillCircle(4, 4, 2);
        g.generateTexture('warning_light', 12, 12);
        g.destroy();
    }

    createParticleTextures() {
        // Spark particle
        let g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffff00);
        g.fillRect(0, 0, 4, 4);
        g.generateTexture('spark', 4, 4);
        g.destroy();

        // Dust particle
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xaaaaaa);
        g.fillRect(0, 0, 3, 3);
        g.generateTexture('dust', 3, 3);
        g.destroy();

        // Explosion particle
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xff6600);
        g.fillRect(0, 0, 6, 6);
        g.generateTexture('explosion_particle', 6, 6);
        g.destroy();

        // Blood/damage particle
        g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xff0000);
        g.fillRect(0, 0, 3, 3);
        g.generateTexture('damage_particle', 3, 3);
        g.destroy();
    }

    create() {
        // Minimum loading time of 5 seconds for animation to play
        const minLoadTime = 5000;
        const loadStartTime = this.loadStartTime || Date.now();
        const elapsed = Date.now() - loadStartTime;
        const remaining = Math.max(0, minLoadTime - elapsed);

        // Wait for minimum time before proceeding
        this.time.delayedCall(remaining, () => {
            // Hide loading screen
            const loading = document.getElementById('loading');
            if (loading) {
                loading.classList.add('hidden');
            }

            // Proceed to menu
            this.scene.start('MenuScene');
        });
    }
}
