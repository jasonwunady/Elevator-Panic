class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        this.soundManager = new SoundManager(this);

        // Initialize shop data
        this.initShopData();

        // Current menu state
        this.currentMenu = 'main'; // 'main', 'shop', 'skins', 'areas'
        this.selectedIndex = 0;

        // Animated background
        this.createBackground();

        // Title
        this.createTitle();

        // Menu options
        this.createMenuOptions();

        // High score display
        this.createHighScoreDisplay();

        // Controls info
        this.createControlsInfo();

        // Create shop (hidden initially)
        this.createShopUI();

        // Input handlers
        this.setupInput();

        // Play menu music
        this.playMenuMusic();

        // Play elevator ambiance
        this.dingTimer = this.time.addEvent({
            delay: 6000,
            callback: () => this.soundManager.playSound('ding'),
            loop: true
        });
    }

    initShopData() {
        // Load saved shop data or create defaults
        if (!window.gameState.shop) {
            window.gameState.shop = {
                coins: 0,
                unlockedSkins: ['default'],
                unlockedAreas: ['LOBBY'],
                unlockedParticles: ['DEFAULT'],
                selectedSkin: 'default',
                selectedParticle: 'DEFAULT',
                startingArea: 'LOBBY'
            };
        }

        // Ensure particles exist in shop data (for existing saves)
        if (!window.gameState.shop.unlockedParticles) {
            window.gameState.shop.unlockedParticles = ['DEFAULT'];
        }
        if (!window.gameState.shop.selectedParticle) {
            window.gameState.shop.selectedParticle = 'DEFAULT';
        }

        // Available items (10x prices)
        this.skins = [
            { id: 'default', name: 'DEFAULT', color: 0x00ff88, cost: 0, owned: true },
            { id: 'fire', name: 'FLAME', color: 0xff4400, cost: 5000 },
            { id: 'ice', name: 'FROST', color: 0x00ccff, cost: 5000 },
            { id: 'gold', name: 'GOLDEN', color: 0xffdd00, cost: 10000 },
            { id: 'shadow', name: 'SHADOW', color: 0x333366, cost: 10000 },
            { id: 'neon', name: 'NEON', color: 0xff00ff, cost: 15000 },
            { id: 'rainbow', name: 'PRISM', color: 0xffffff, cost: 25000 }
        ];

        this.particles = [
            { id: 'DEFAULT', name: 'DEFAULT', color: 0xffffff, cost: 0, owned: true },
            { id: 'FIRE', name: 'FIRE', color: 0xff4400, cost: 5000 },
            { id: 'ICE', name: 'ICE', color: 0x00ccff, cost: 5000 },
            { id: 'ELECTRIC', name: 'ELECTRIC', color: 0xffff00, cost: 8000 },
            { id: 'TOXIC', name: 'TOXIC', color: 0x44ff44, cost: 8000 },
            { id: 'GALAXY', name: 'GALAXY', color: 0xff00ff, cost: 12000 },
            { id: 'RAINBOW', name: 'RAINBOW', color: 0xff0000, cost: 20000 }
        ];

        this.areas = [
            { id: 'LOBBY', name: 'LOBBY', floorStart: 0, cost: 0, owned: true },
            { id: 'OFFICE', name: 'OFFICE', floorStart: 10, cost: 3000 },
            { id: 'INDUSTRIAL', name: 'INDUSTRIAL', floorStart: 20, cost: 6000 },
            { id: 'NEON', name: 'NEON DISTRICT', floorStart: 30, cost: 10000 },
            { id: 'VOID', name: 'THE VOID', floorStart: 40, cost: 15000 },
            { id: 'INFERNO', name: 'INFERNO', floorStart: 50, cost: 20000 },
            { id: 'SKYLINE', name: 'SKYLINE', floorStart: 60, cost: 25000 },
            { id: 'TOXIC', name: 'TOXIC LABS', floorStart: 70, cost: 30000 },
            { id: 'CYBER', name: 'CYBER CORE', floorStart: 80, cost: 35000 },
            { id: 'ABYSS', name: 'THE ABYSS', floorStart: 90, cost: 40000 },
            { id: 'PARADISE', name: 'PARADISE', floorStart: 100, cost: 50000 }
        ];

        // Buildings (bundles of areas) - 10x prices
        this.buildings = [
            { id: 'STARTER', name: 'STARTER TOWER', areas: ['LOBBY', 'OFFICE', 'INDUSTRIAL'], cost: 0, owned: true, description: 'The basics' },
            { id: 'DOWNTOWN', name: 'DOWNTOWN', areas: ['NEON', 'VOID', 'INFERNO'], cost: 20000, description: 'Urban warfare' },
            { id: 'HIGHRISE', name: 'HIGHRISE', areas: ['SKYLINE', 'TOXIC', 'CYBER'], cost: 50000, description: 'Sky-high chaos' },
            { id: 'ULTIMATE', name: 'ULTIMATE', areas: ['ABYSS', 'PARADISE'], cost: 100000, description: 'Final frontier' }
        ];

        // Initialize building ownership
        if (!window.gameState.shop.unlockedBuildings) {
            window.gameState.shop.unlockedBuildings = ['STARTER'];
        }

        this.buildings.forEach(building => {
            building.owned = window.gameState.shop.unlockedBuildings.includes(building.id);
        });

        // Update ownership from saved data
        this.skins.forEach(skin => {
            skin.owned = window.gameState.shop.unlockedSkins.includes(skin.id);
        });
        this.areas.forEach(area => {
            area.owned = window.gameState.shop.unlockedAreas.includes(area.id);
        });
        this.particles.forEach(particle => {
            particle.owned = window.gameState.shop.unlockedParticles.includes(particle.id);
        });
    }

    playMenuMusic() {
        if (this.menuMusic) return;

        try {
            // Check if the sound was loaded
            if (this.cache.audio.exists('menuMusic')) {
                this.menuMusic = this.sound.add('menuMusic', {
                    loop: true,
                    volume: 0.4
                });

                // Try to play - may be blocked by browser autoplay policy
                const playPromise = this.menuMusic.play();

                // If play was blocked, set up click-to-play
                if (this.sound.locked) {
                    this.sound.once('unlocked', () => {
                        if (this.menuMusic && !this.menuMusic.isPlaying) {
                            this.menuMusic.play();
                        }
                    });
                }
            } else {
                console.warn('Menu music not loaded - check if file exists at assets/sounds/boss-mode-baby.mp3');
            }
        } catch (e) {
            console.warn('Could not play menu music:', e);
        }
    }

    stopMenuMusic() {
        if (this.menuMusic) {
            this.menuMusic.stop();
            this.menuMusic = null;
        }
    }

    createBackground() {
        // Dark elevator shaft effect
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0a0a1a);

        // Animated grid pattern
        this.gridLines = [];
        for (let i = 0; i < 10; i++) {
            const hLine = this.add.rectangle(GAME_WIDTH / 2, i * 40, GAME_WIDTH, 1, 0x1a1a3a, 0.3);
            hLine.baseY = i * 40;
            this.gridLines.push(hLine);
        }

        // Scrolling lines for motion effect
        this.lines = [];
        for (let i = 0; i < 25; i++) {
            const line = this.add.rectangle(
                Phaser.Math.Between(20, GAME_WIDTH - 20),
                Phaser.Math.Between(0, GAME_HEIGHT),
                Phaser.Math.Between(1, 3),
                Phaser.Math.Between(20, 80),
                0x2a2a4a,
                0.5
            );
            line.speed = Phaser.Math.FloatBetween(1, 4);
            this.lines.push(line);
        }

        // Animate lines scrolling down
        this.time.addEvent({
            delay: 16,
            callback: this.updateLines,
            callbackScope: this,
            loop: true
        });

        // Floating particles (background effect)
        this.bgParticles = [];
        for (let i = 0; i < 15; i++) {
            const p = this.add.circle(
                Phaser.Math.Between(0, GAME_WIDTH),
                Phaser.Math.Between(0, GAME_HEIGHT),
                Phaser.Math.Between(1, 3),
                0x4444aa,
                0.4
            );
            p.vx = Phaser.Math.FloatBetween(-0.3, 0.3);
            p.vy = Phaser.Math.FloatBetween(-0.5, 0.5);
            this.bgParticles.push(p);
        }

        // Warning lights
        this.warningLight1 = this.add.sprite(50, 80, 'warning_light').setAlpha(0.5);
        this.warningLight2 = this.add.sprite(GAME_WIDTH - 50, 80, 'warning_light').setAlpha(0.5);

        this.tweens.add({
            targets: [this.warningLight1, this.warningLight2],
            alpha: { from: 0.3, to: 1 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Edge glow
        this.leftGlow = this.add.rectangle(0, GAME_HEIGHT / 2, 3, GAME_HEIGHT, 0xff4444, 0.3);
        this.leftGlow.setOrigin(0, 0.5);
        this.rightGlow = this.add.rectangle(GAME_WIDTH, GAME_HEIGHT / 2, 3, GAME_HEIGHT, 0xff4444, 0.3);
        this.rightGlow.setOrigin(1, 0.5);

        this.tweens.add({
            targets: [this.leftGlow, this.rightGlow],
            alpha: { from: 0.1, to: 0.4 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    updateLines() {
        this.lines.forEach(line => {
            line.y += line.speed;
            if (line.y > GAME_HEIGHT + 40) {
                line.y = -40;
                line.x = Phaser.Math.Between(20, GAME_WIDTH - 20);
                line.speed = Phaser.Math.FloatBetween(1, 4);
            }
        });

        // Update grid
        this.gridLines.forEach(line => {
            line.y = ((line.baseY + this.time.now * 0.02) % (GAME_HEIGHT + 40)) - 20;
        });

        // Update background particles
        this.bgParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > GAME_WIDTH) p.vx *= -1;
            if (p.y < 0 || p.y > GAME_HEIGHT) p.vy *= -1;
        });
    }

    createTitle() {
        // Glow behind title
        this.titleGlow = this.add.rectangle(GAME_WIDTH / 2, 75, 200, 80, 0xff4444, 0.1);

        // Main title with glitch effect
        this.titleText = this.add.text(GAME_WIDTH / 2, 55, 'ELEVATOR', {
            fontSize: '32px',
            fontFamily: 'monospace',
            color: '#ff4444',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.titleText2 = this.add.text(GAME_WIDTH / 2, 95, 'PANIC', {
            fontSize: '42px',
            fontFamily: 'monospace',
            color: '#ffaa00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        // Decorative line under title
        this.titleLine = this.add.rectangle(GAME_WIDTH / 2, 125, 150, 3, 0x00ff88);
        this.tweens.add({
            targets: this.titleLine,
            scaleX: { from: 0, to: 1 },
            duration: 500,
            ease: 'Power2'
        });

        // We'll use a dummy for the glitch array compatibility
        this.titleText3 = this.titleLine;

        // Glitch effect
        this.time.addEvent({
            delay: 2000,
            callback: this.glitchTitle,
            callbackScope: this,
            loop: true
        });

        // Subtitle with typing effect
        this.subtitle = this.add.text(GAME_WIDTH / 2, 140, '', {
            fontSize: '9px',
            fontFamily: 'monospace',
            color: '#666666'
        }).setOrigin(0.5);

        this.typeText('GOING UP... FOREVER', this.subtitle);
    }

    typeText(text, textObject) {
        let i = 0;
        this.time.addEvent({
            delay: 50,
            callback: () => {
                textObject.setText(text.substring(0, i));
                i++;
            },
            repeat: text.length
        });
    }

    glitchTitle() {
        const titles = [this.titleText, this.titleText2];
        const randomTitle = Phaser.Utils.Array.GetRandom(titles);
        const originalX = GAME_WIDTH / 2;

        // RGB split effect
        const glitchR = this.add.text(randomTitle.x + 2, randomTitle.y, randomTitle.text, {
            fontSize: randomTitle.style.fontSize,
            fontFamily: 'monospace',
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.5);

        const glitchB = this.add.text(randomTitle.x - 2, randomTitle.y, randomTitle.text, {
            fontSize: randomTitle.style.fontSize,
            fontFamily: 'monospace',
            color: '#0000ff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.5);

        this.time.delayedCall(100, () => {
            glitchR.destroy();
            glitchB.destroy();
        });

        // Quick offset
        this.tweens.add({
            targets: randomTitle,
            x: originalX + Phaser.Math.Between(-5, 5),
            duration: 50,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                randomTitle.x = originalX;
            }
        });
    }

    createMenuOptions() {
        this.menuContainer = this.add.container(0, 0);

        // Menu buttons
        this.menuButtons = [];

        const buttons = [
            { text: '▶ START GAME', action: 'start' },
            { text: '👾 MONSTERS', action: 'monsters' },
            { text: '🏆 ACHIEVEMENTS', action: 'achievements' },
            { text: '🎨 SKINS', action: 'skins' },
            { text: '✨ PARTICLES', action: 'particles' },
            { text: '🗑 DELETE SAVE', action: 'delete' }
        ];

        buttons.forEach((btn, i) => {
            const y = 165 + i * 18;
            const button = this.add.text(GAME_WIDTH / 2, y, btn.text, {
                fontSize: '10px',
                fontFamily: 'monospace',
                color: i === 0 ? '#ffffff' : '#888888'
            }).setOrigin(0.5);
            button.action = btn.action;
            button.baseY = y;
            this.menuButtons.push(button);
            this.menuContainer.add(button);
        });

        // Selection indicator
        this.selector = this.add.text(GAME_WIDTH / 2 - 65, 165, '►', {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#ffff00'
        }).setOrigin(0.5);
        this.menuContainer.add(this.selector);

        // Animate selector
        this.tweens.add({
            targets: this.selector,
            x: this.selector.x + 3,
            duration: 300,
            yoyo: true,
            repeat: -1
        });
    }

    createHighScoreDisplay() {
        this.scoreContainer = this.add.container(0, 0);

        const highScore = window.gameState.highScore;
        const coins = window.gameState.shop ? window.gameState.shop.coins : 0;

        // Coins display
        this.coinsText = this.add.text(GAME_WIDTH - 10, 10, `💰 ${coins}`, {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#ffdd00'
        }).setOrigin(1, 0);
        this.scoreContainer.add(this.coinsText);

        // High score
        this.add.text(GAME_WIDTH / 2, 270, 'HIGH SCORE', {
            fontSize: '9px',
            fontFamily: 'monospace',
            color: '#ffcc00'
        }).setOrigin(0.5);

        this.highScoreText = this.add.text(GAME_WIDTH / 2, 285, highScore.toString().padStart(8, '0'), {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Last score
        if (window.gameState.lastScore > 0) {
            this.add.text(GAME_WIDTH / 2, 305, `LAST: ${window.gameState.lastScore} (FLOOR ${window.gameState.lastFloor})`, {
                fontSize: '8px',
                fontFamily: 'monospace',
                color: '#666666'
            }).setOrigin(0.5);

            // Add coins from last run
            const earnedCoins = Math.floor(window.gameState.lastScore / 10);
            if (earnedCoins > 0 && !window.gameState.coinsCollected) {
                window.gameState.shop.coins += earnedCoins;
                window.gameState.coinsCollected = true;
                this.saveShopData();

                // Show earned coins
                const earnedText = this.add.text(GAME_WIDTH / 2, 320, `+${earnedCoins} 💰`, {
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    color: '#ffdd00'
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: earnedText,
                    y: earnedText.y - 20,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => earnedText.destroy()
                });

                this.coinsText.setText(`💰 ${window.gameState.shop.coins}`);
            }
        }
    }

    createControlsInfo() {
        this.add.text(GAME_WIDTH / 2, 332, '← → MOVE   ↑ JUMP   ↓ KICK', {
            fontSize: '8px',
            fontFamily: 'monospace',
            color: '#555555'
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 10, 'KICK EVERYTHING. SURVIVE.', {
            fontSize: '7px',
            fontFamily: 'monospace',
            color: '#333333'
        }).setOrigin(0.5);
    }

    createShopUI() {
        // Shop container (hidden initially)
        this.shopContainer = this.add.container(0, 0).setVisible(false);

        // Shop background
        const shopBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 40, GAME_HEIGHT - 60, 0x111122, 0.95);
        shopBg.setStrokeStyle(2, 0x4444aa);
        this.shopContainer.add(shopBg);

        // Shop title
        this.shopTitle = this.add.text(GAME_WIDTH / 2, 45, 'SHOP', {
            fontSize: '18px',
            fontFamily: 'monospace',
            color: '#ffdd00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.shopContainer.add(this.shopTitle);

        // Coins in shop
        this.shopCoins = this.add.text(GAME_WIDTH / 2, 65, '', {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#ffdd00'
        }).setOrigin(0.5);
        this.shopContainer.add(this.shopCoins);

        // Item list container
        this.shopItems = [];

        // Back button
        this.backButton = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 35, '[ ESC - BACK ]', {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#888888'
        }).setOrigin(0.5);
        this.shopContainer.add(this.backButton);
    }

    showShop(type) {
        this.currentMenu = type;
        this.selectedIndex = 0;
        this.menuContainer.setVisible(false);
        this.shopContainer.setVisible(true);

        // Clear old items
        this.shopItems.forEach(item => item.destroy());
        this.shopItems = [];

        let items;
        if (type === 'skins') {
            items = this.skins;
            this.shopTitle.setText('🎨 SKINS');
        } else if (type === 'particles') {
            items = this.particles;
            this.shopTitle.setText('✨ PARTICLES');
        } else {
            items = this.buildings;
            this.shopTitle.setText('🏢 BUILDINGS');
        }
        this.shopCoins.setText(`💰 ${window.gameState.shop.coins}`);

        items.forEach((item, i) => {
            const y = 95 + i * 28;
            const isOwned = item.owned;
            const isSelected = (type === 'skins' && window.gameState.shop.selectedSkin === item.id) ||
                               (type === 'particles' && window.gameState.shop.selectedParticle === item.id);

            // Item background
            const bg = this.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH - 60, 24,
                isSelected ? 0x224422 : 0x1a1a2a, 0.8);
            bg.setStrokeStyle(1, isSelected ? 0x44ff44 : 0x333366);
            this.shopContainer.add(bg);
            this.shopItems.push(bg);

            // Color preview for skins and particles
            if (type === 'skins' || type === 'particles') {
                const preview = this.add.rectangle(35, y, 16, 16, item.color);
                this.shopContainer.add(preview);
                this.shopItems.push(preview);
            }

            // Item name
            const nameText = this.add.text((type === 'skins' || type === 'particles') ? 55 : 35, y, item.name, {
                fontSize: '10px',
                fontFamily: 'monospace',
                color: isOwned ? '#ffffff' : '#888888'
            }).setOrigin(0, 0.5);
            this.shopContainer.add(nameText);
            this.shopItems.push(nameText);

            // Status/Price
            let statusText;
            if (isOwned) {
                statusText = isSelected ? '✓ EQUIPPED' : 'OWNED';
            } else {
                statusText = `💰 ${item.cost}`;
            }

            const status = this.add.text(GAME_WIDTH - 45, y, statusText, {
                fontSize: '9px',
                fontFamily: 'monospace',
                color: isOwned ? (isSelected ? '#44ff44' : '#aaaaaa') : '#ffdd00'
            }).setOrigin(1, 0.5);
            this.shopContainer.add(status);
            this.shopItems.push(status);

            // Store reference
            bg.itemData = item;
            bg.itemIndex = i;
        });

        this.updateShopSelection();
    }

    updateShopSelection() {
        let items;
        if (this.currentMenu === 'skins') {
            items = this.skins;
        } else if (this.currentMenu === 'particles') {
            items = this.particles;
        } else {
            items = this.buildings;
        }

        this.shopItems.forEach(item => {
            if (item.itemData) {
                const isSelected = item.itemIndex === this.selectedIndex;
                const isEquipped = (this.currentMenu === 'skins' && window.gameState.shop.selectedSkin === item.itemData.id) ||
                                   (this.currentMenu === 'particles' && window.gameState.shop.selectedParticle === item.itemData.id);

                item.setStrokeStyle(isSelected ? 2 : 1, isSelected ? 0xffff00 : (isEquipped ? 0x44ff44 : 0x333366));
                item.setFillStyle(isSelected ? 0x2a2a4a : (isEquipped ? 0x224422 : 0x1a1a2a), 0.8);
            }
        });
    }

    hideShop() {
        this.currentMenu = 'main';
        this.selectedIndex = 0;
        this.shopContainer.setVisible(false);
        if (this.monsterContainer) {
            this.monsterContainer.setVisible(false);
        }
        this.menuContainer.setVisible(true);
        this.updateMenuSelection();
    }

    hideAchievements() {
        this.currentMenu = 'main';
        this.selectedIndex = 0;
        if (this.achievementContainer) {
            this.achievementContainer.setVisible(false);
        }
        this.menuContainer.setVisible(true);
        this.updateMenuSelection();
    }

    showMonsterDictionary() {
        this.currentMenu = 'monsters';
        this.monsterIndex = 0;
        this.menuContainer.setVisible(false);

        // Get monster list
        this.monsterKeys = Object.keys(MONSTER_DICTIONARY);

        // Create monster dictionary container if it doesn't exist
        if (!this.monsterContainer) {
            this.monsterContainer = this.add.container(0, 0);

            // Background
            const bg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 20, GAME_HEIGHT - 40, 0x111122, 0.95);
            bg.setStrokeStyle(2, 0xff4444);
            this.monsterContainer.add(bg);

            // Title
            const title = this.add.text(GAME_WIDTH / 2, 30, '👾 MONSTER DICTIONARY', {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#ff4444',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
            this.monsterContainer.add(title);

            // Navigation hints
            const navHint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 45, '← → NAVIGATE', {
                fontSize: '10px',
                fontFamily: 'monospace',
                color: '#ffcc00'
            }).setOrigin(0.5);
            this.monsterContainer.add(navHint);

            // Back button
            const backBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 25, '[ ESC - BACK ]', {
                fontSize: '10px',
                fontFamily: 'monospace',
                color: '#888888'
            }).setOrigin(0.5);
            this.monsterContainer.add(backBtn);
        }

        this.updateMonsterDisplay();
        this.monsterContainer.setVisible(true);
    }

    updateMonsterDisplay() {
        // Clear old monster items
        if (this.monsterItems) {
            this.monsterItems.forEach(item => item.destroy());
        }
        this.monsterItems = [];

        // Texture mapping for each monster type
        const textureMap = {
            'RUSHER': 'enemy_rusher',
            'CLINGER': 'enemy_clinger',
            'EXPLODER': 'enemy_exploder',
            'HEAVY': 'enemy_heavy',
            'SPITTER': 'enemy_spitter',
            'BOUNCER': 'enemy_bouncer',
            'SPLITTER': 'enemy_splitter',
            'SPLITTER_MINI': 'enemy_splitter_mini',
            'GHOST': 'enemy_ghost',
            'CHARGER': 'enemy_charger',
            'BOMBER': 'enemy_bomber',
            'SHIELD': 'enemy_shield',
            'TELEPORTER': 'enemy_teleporter',
            'MIMIC': 'enemy_mimic',
            'MAGNET': 'enemy_magnet',
            'FREEZER': 'enemy_freezer',
            'SPINNER': 'enemy_spinner',
            'VAMPIRE': 'enemy_vampire',
            'SUMMONER': 'enemy_summoner',
            'NINJA': 'enemy_ninja',
            'TANK': 'enemy_tank',
            'LEAPER': 'enemy_leaper',
            'SWARM': 'enemy_swarm',
            'LASER': 'enemy_laser',
            'REFLECTOR': 'enemy_reflector',
            'BERSERKER': 'enemy_berserker',
            'CRAWLER': 'enemy_crawler',
            // 14 New enemies
            'SHADOW': 'enemy_shadow',
            'GRAVITY': 'enemy_gravity',
            'SPLASHER': 'enemy_splasher',
            'ANCHOR': 'enemy_anchor',
            'PORTAL': 'enemy_portal',
            'ELECTRO': 'enemy_electro',
            'BLOB': 'enemy_blob',
            'HOMING': 'enemy_homing',
            'PHASER': 'enemy_phaser',
            'PUSHER': 'enemy_pusher',
            'DRAINER': 'enemy_drainer',
            'CLONER': 'enemy_cloner',
            'SHIELDER': 'enemy_shielder',
            'BOOMER': 'enemy_boomer',
            // 10 more enemies
            'WRAITH': 'enemy_wraith',
            'SCORPION': 'enemy_scorpion',
            'PRISM': 'enemy_prism',
            'INFERNO': 'enemy_inferno',
            'GOLEM': 'enemy_golem',
            'JESTER': 'enemy_jester',
            'HYDRA': 'enemy_hydra',
            'MIRAGE_NEW': 'enemy_mirage',
            'TITAN': 'enemy_titan',
            'SPARK': 'enemy_spark',
            // 50 more enemies
            'VIPER': 'enemy_viper',
            'CYCLOPS': 'enemy_cyclops',
            'WASP': 'enemy_wasp',
            'MUMMY': 'enemy_mummy',
            'DJINN': 'enemy_djinn',
            'GARGOYLE': 'enemy_gargoyle',
            'BASILISK': 'enemy_basilisk',
            'BANSHEE': 'enemy_banshee',
            'PHOENIX': 'enemy_phoenix',
            'LICH': 'enemy_lich',
            'WENDIGO': 'enemy_wendigo',
            'CERBERUS': 'enemy_cerberus',
            'WYVERN': 'enemy_wyvern',
            'MINOTAUR': 'enemy_minotaur',
            'SPECTER': 'enemy_specter',
            'CHIMERA': 'enemy_chimera',
            'REAPER': 'enemy_reaper',
            'OGRE': 'enemy_ogre',
            'HARPY': 'enemy_harpy',
            'TROLL': 'enemy_troll',
            'KRAKEN': 'enemy_kraken',
            'DEMON': 'enemy_demon',
            'ELEMENTAL': 'enemy_elemental',
            'WYRM': 'enemy_wyrm',
            'SHADE': 'enemy_shade',
            'FUNGOID': 'enemy_fungoid',
            'SENTINEL': 'enemy_sentinel',
            'SLIME_KING': 'enemy_slime_king',
            'BEETLE': 'enemy_beetle',
            'WRECKER': 'enemy_wrecker',
            'ORACLE': 'enemy_oracle',
            'GOLIATH': 'enemy_goliath',
            'ASSASSIN': 'enemy_assassin',
            'PLAGUE': 'enemy_plague',
            'PHANTOM': 'enemy_phantom',
            'BRUTE': 'enemy_brute',
            'SIREN': 'enemy_siren',
            'COLOSSUS': 'enemy_colossus',
            'REVENANT': 'enemy_revenant',
            'GOLEM_FIRE': 'enemy_golem_fire',
            'GOLEM_ICE': 'enemy_golem_ice',
            'VAMPIRE_LORD': 'enemy_vampire_lord',
            'NECROMANCER': 'enemy_necromancer',
            'SKELETON_KING': 'enemy_skeleton_king',
            'DRAGON': 'enemy_dragon',
            'ARCHDEMON': 'enemy_archdemon',
            'VOID_WALKER': 'enemy_void_walker',
            'COSMIC_HORROR': 'enemy_cosmic_horror',
            'WORLD_EATER': 'enemy_world_eater'
        };

        const key = this.monsterKeys[this.monsterIndex];
        const monster = MONSTER_DICTIONARY[key];

        // Check if monster has been encountered (kicked/killed)
        const encounteredMonsters = window.gameState.shop.encounteredMonsters || [];
        const isUnlocked = encounteredMonsters.includes(key);

        const centerX = GAME_WIDTH / 2;
        const centerY = GAME_HEIGHT / 2 - 10;

        // Count unlocked monsters
        const unlockedCount = encounteredMonsters.filter(m => this.monsterKeys.includes(m)).length;

        // Page indicator with unlock count
        const pageText = this.add.text(centerX, 50, `${this.monsterIndex + 1} / ${this.monsterKeys.length} (${unlockedCount} unlocked)`, {
            fontSize: '9px',
            fontFamily: 'monospace',
            color: '#888888'
        }).setOrigin(0.5);
        this.monsterContainer.add(pageText);
        this.monsterItems.push(pageText);

        // Left arrow
        const leftArrow = this.add.text(30, centerY, '◄', {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: this.monsterIndex > 0 ? '#ffcc00' : '#333333'
        }).setOrigin(0.5);
        this.monsterContainer.add(leftArrow);
        this.monsterItems.push(leftArrow);

        // Right arrow
        const rightArrow = this.add.text(GAME_WIDTH - 30, centerY, '►', {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: this.monsterIndex < this.monsterKeys.length - 1 ? '#ffcc00' : '#333333'
        }).setOrigin(0.5);
        this.monsterContainer.add(rightArrow);
        this.monsterItems.push(rightArrow);

        if (isUnlocked) {
            // Background for monster preview
            const previewBg = this.add.rectangle(centerX, centerY - 40, 70, 70, 0x1a1a2a);
            previewBg.setStrokeStyle(3, monster.color);
            this.monsterContainer.add(previewBg);
            this.monsterItems.push(previewBg);

            // Monster sprite preview - use actual texture
            const textureKey = textureMap[key] || 'enemy_rusher';
            const preview = this.add.sprite(centerX, centerY - 40, textureKey);
            preview.setScale(3); // Scale up for visibility
            this.monsterContainer.add(preview);
            this.monsterItems.push(preview);

            // Add animation to the preview sprite
            this.tweens.add({
                targets: preview,
                scaleX: { from: 3, to: 3.2 },
                scaleY: { from: 3, to: 2.8 },
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Monster name - large
            const name = this.add.text(centerX, centerY + 20, monster.name.toUpperCase(), {
                fontSize: '18px',
                fontFamily: 'monospace',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
            this.monsterContainer.add(name);
            this.monsterItems.push(name);

            // Floor unlocked
            const floorText = this.add.text(centerX, centerY + 45, `Appears on Floor ${monster.unlockFloor}+`, {
                fontSize: '10px',
                fontFamily: 'monospace',
                color: '#888888'
            }).setOrigin(0.5);
            this.monsterContainer.add(floorText);
            this.monsterItems.push(floorText);

            // Description - centered
            const desc = this.add.text(centerX, centerY + 70, monster.description, {
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#aaaaaa',
                wordWrap: { width: 280 },
                align: 'center'
            }).setOrigin(0.5);
            this.monsterContainer.add(desc);
            this.monsterItems.push(desc);

            // Status badge - defeated
            const badge = this.add.text(centerX, centerY + 100, '✓ DEFEATED', {
                fontSize: '10px',
                fontFamily: 'monospace',
                color: '#44ff44'
            }).setOrigin(0.5);
            this.monsterContainer.add(badge);
            this.monsterItems.push(badge);
        } else {
            // LOCKED - show silhouette
            const previewBg = this.add.rectangle(centerX, centerY - 40, 70, 70, 0x111111);
            previewBg.setStrokeStyle(3, 0x333333);
            this.monsterContainer.add(previewBg);
            this.monsterItems.push(previewBg);

            // Question mark
            const questionMark = this.add.text(centerX, centerY - 40, '?', {
                fontSize: '36px',
                fontFamily: 'monospace',
                color: '#333333'
            }).setOrigin(0.5);
            this.monsterContainer.add(questionMark);
            this.monsterItems.push(questionMark);

            // Locked name
            const name = this.add.text(centerX, centerY + 20, '???', {
                fontSize: '18px',
                fontFamily: 'monospace',
                color: '#444444',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
            this.monsterContainer.add(name);
            this.monsterItems.push(name);

            // Hint about floor
            const hint = this.add.text(centerX, centerY + 50, `Appears on Floor ${monster.unlockFloor}+`, {
                fontSize: '10px',
                fontFamily: 'monospace',
                color: '#555555'
            }).setOrigin(0.5);
            this.monsterContainer.add(hint);
            this.monsterItems.push(hint);

            // Unlock hint
            const unlockHint = this.add.text(centerX, centerY + 75, 'Defeat this enemy to unlock!', {
                fontSize: '9px',
                fontFamily: 'monospace',
                color: '#666666'
            }).setOrigin(0.5);
            this.monsterContainer.add(unlockHint);
            this.monsterItems.push(unlockHint);

            // Status badge - locked
            const badge = this.add.text(centerX, centerY + 100, '🔒 LOCKED', {
                fontSize: '10px',
                fontFamily: 'monospace',
                color: '#ff4444'
            }).setOrigin(0.5);
            this.monsterContainer.add(badge);
            this.monsterItems.push(badge);
        }
    }

    navigateMonster(direction) {
        const newIndex = this.monsterIndex + direction;
        if (newIndex >= 0 && newIndex < this.monsterKeys.length) {
            this.monsterIndex = newIndex;
            this.soundManager.playSound('kick');
            this.updateMonsterDisplay();
        }
    }

    showAchievements() {
        this.currentMenu = 'achievements';
        this.achievementPage = 0;
        this.achievementRankTab = 0;  // Start at Bronze tab
        this.menuContainer.setVisible(false);

        // Initialize achievements if not exists
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

        // Create achievements container if it doesn't exist
        if (!this.achievementContainer) {
            this.achievementContainer = this.add.container(0, 0);

            // Background
            const bg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 20, GAME_HEIGHT - 40, 0x111122, 0.95);
            bg.setStrokeStyle(2, 0xffcc00);
            this.achievementContainer.add(bg);

            // Title
            const title = this.add.text(GAME_WIDTH / 2, 30, '🏆 ACHIEVEMENTS', {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#ffcc00',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
            this.achievementContainer.add(title);

            // Navigation hints
            const navHint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 45, '← → PAGES  |  ↑ ↓ SCROLL', {
                fontSize: '8px',
                fontFamily: 'monospace',
                color: '#ffcc00'
            }).setOrigin(0.5);
            this.achievementContainer.add(navHint);

            // Back button
            const backBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 25, '[ ESC - BACK ]', {
                fontSize: '10px',
                fontFamily: 'monospace',
                color: '#888888'
            }).setOrigin(0.5);
            this.achievementContainer.add(backBtn);
        }

        this.updateAchievementDisplay();
        this.achievementContainer.setVisible(true);
    }

    updateAchievementDisplay() {
        // Clear old achievement items
        if (this.achievementItems) {
            this.achievementItems.forEach(item => item.destroy());
        }
        this.achievementItems = [];

        // Get rank colors
        const rankColors = {
            'BRONZE': '#cd7f32',
            'SILVER': '#c0c0c0',
            'GOLD': '#ffd700',
            'PLATINUM': '#e5e4e2'
        };
        const rankBgColors = {
            'BRONZE': 0x3d2f1f,
            'SILVER': 0x404040,
            'GOLD': 0x4d4d00,
            'PLATINUM': 0x2a2a3a
        };

        // Filter achievements by current rank tab
        const ranks = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
        const currentRank = ranks[this.achievementRankTab || 0];
        const achievementKeys = Object.keys(ACHIEVEMENTS).filter(key =>
            ACHIEVEMENTS[key].rank === currentRank
        );

        const achievementsPerPage = 4;
        const totalPages = Math.ceil(achievementKeys.length / achievementsPerPage);
        const startIdx = this.achievementPage * achievementsPerPage;
        const endIdx = Math.min(startIdx + achievementsPerPage, achievementKeys.length);

        const unlockedAchievements = window.gameState.achievements?.unlocked || [];
        const totalAchievements = Object.keys(ACHIEVEMENTS).length;
        const unlockedCount = unlockedAchievements.length;

        // Count by rank
        const bronzeCount = Object.values(ACHIEVEMENTS).filter(a => a.rank === 'BRONZE' && unlockedAchievements.includes(a.id)).length;
        const silverCount = Object.values(ACHIEVEMENTS).filter(a => a.rank === 'SILVER' && unlockedAchievements.includes(a.id)).length;
        const goldCount = Object.values(ACHIEVEMENTS).filter(a => a.rank === 'GOLD' && unlockedAchievements.includes(a.id)).length;
        const platinumCount = Object.values(ACHIEVEMENTS).filter(a => a.rank === 'PLATINUM' && unlockedAchievements.includes(a.id)).length;
        const bronzeTotal = Object.values(ACHIEVEMENTS).filter(a => a.rank === 'BRONZE').length;
        const silverTotal = Object.values(ACHIEVEMENTS).filter(a => a.rank === 'SILVER').length;
        const goldTotal = Object.values(ACHIEVEMENTS).filter(a => a.rank === 'GOLD').length;
        const platinumTotal = Object.values(ACHIEVEMENTS).filter(a => a.rank === 'PLATINUM').length;

        // Overall progress
        const progressText = this.add.text(GAME_WIDTH / 2, 48, `Total: ${unlockedCount}/${totalAchievements}`, {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        this.achievementContainer.add(progressText);
        this.achievementItems.push(progressText);

        // Rank tabs
        const tabY = 64;
        const tabWidth = 90;
        const tabStartX = 50;
        ranks.forEach((rank, idx) => {
            const isSelected = idx === (this.achievementRankTab || 0);
            const counts = [bronzeCount, silverCount, goldCount, platinumCount];
            const totals = [bronzeTotal, silverTotal, goldTotal, platinumTotal];

            const tabBg = this.add.rectangle(
                tabStartX + idx * tabWidth, tabY, tabWidth - 6, 18,
                isSelected ? rankBgColors[rank] : 0x222222, 0.9
            );
            tabBg.setStrokeStyle(2, isSelected ? Phaser.Display.Color.HexStringToColor(rankColors[rank]).color : 0x444444);
            this.achievementContainer.add(tabBg);
            this.achievementItems.push(tabBg);

            const tabText = this.add.text(tabStartX + idx * tabWidth, tabY,
                `${rank.substring(0, 4)} ${counts[idx]}/${totals[idx]}`, {
                fontSize: '9px',
                fontFamily: 'monospace',
                color: isSelected ? rankColors[rank] : '#777777'
            }).setOrigin(0.5);
            this.achievementContainer.add(tabText);
            this.achievementItems.push(tabText);
        });

        // Page indicator
        if (totalPages > 1) {
            const pageText = this.add.text(GAME_WIDTH / 2, 82, `Page ${this.achievementPage + 1}/${totalPages}`, {
                fontSize: '9px',
                fontFamily: 'monospace',
                color: '#888888'
            }).setOrigin(0.5);
            this.achievementContainer.add(pageText);
            this.achievementItems.push(pageText);
        }

        // Left/Right arrows for pages
        const arrowY = GAME_HEIGHT / 2 + 20;
        const leftArrow = this.add.text(25, arrowY, '◄', {
            fontSize: '18px',
            fontFamily: 'monospace',
            color: this.achievementPage > 0 ? '#ffcc00' : '#333333'
        }).setOrigin(0.5);
        this.achievementContainer.add(leftArrow);
        this.achievementItems.push(leftArrow);

        const rightArrow = this.add.text(GAME_WIDTH - 25, arrowY, '►', {
            fontSize: '18px',
            fontFamily: 'monospace',
            color: this.achievementPage < totalPages - 1 ? '#ffcc00' : '#333333'
        }).setOrigin(0.5);
        this.achievementContainer.add(rightArrow);
        this.achievementItems.push(rightArrow);

        // Display achievements for this page
        for (let i = startIdx; i < endIdx; i++) {
            const key = achievementKeys[i];
            const achievement = ACHIEVEMENTS[key];
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const yPos = 90 + (i - startIdx) * 52;
            const rankColor = rankColors[achievement.rank];
            const bgColor = isUnlocked ? rankBgColors[achievement.rank] : 0x1a1a1a;

            // Achievement box background with rank-colored border
            const boxBg = this.add.rectangle(GAME_WIDTH / 2, yPos + 18, GAME_WIDTH - 70, 46, bgColor, 0.9);
            const borderColor = isUnlocked ? Phaser.Display.Color.HexStringToColor(rankColor).color : 0x333333;
            boxBg.setStrokeStyle(2, borderColor);
            this.achievementContainer.add(boxBg);
            this.achievementItems.push(boxBg);

            // Rank badge
            const rankBadge = this.add.text(50, yPos + 5, ACHIEVEMENT_RANKS[achievement.rank].icon, {
                fontSize: '12px',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            this.achievementContainer.add(rankBadge);
            this.achievementItems.push(rankBadge);

            // Icon
            const icon = this.add.text(50, yPos + 25, isUnlocked ? achievement.icon : '🔒', {
                fontSize: '16px',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            this.achievementContainer.add(icon);
            this.achievementItems.push(icon);

            // Name with rank color
            const nameColor = isUnlocked ? rankColor : '#555555';
            const name = this.add.text(72, yPos + 6, achievement.name, {
                fontSize: '11px',
                fontFamily: 'monospace',
                color: nameColor
            }).setOrigin(0, 0.5);
            this.achievementContainer.add(name);
            this.achievementItems.push(name);

            // Description
            const desc = this.add.text(72, yPos + 22, achievement.description, {
                fontSize: '8px',
                fontFamily: 'monospace',
                color: isUnlocked ? '#aaaaaa' : '#444444'
            }).setOrigin(0, 0.5);
            this.achievementContainer.add(desc);
            this.achievementItems.push(desc);

            // Reward
            const rewardColor = isUnlocked ? '#ffcc00' : '#444444';
            const reward = this.add.text(GAME_WIDTH - 50, yPos + 10, `+${achievement.reward}`, {
                fontSize: '10px',
                fontFamily: 'monospace',
                color: rewardColor
            }).setOrigin(0.5);
            this.achievementContainer.add(reward);
            this.achievementItems.push(reward);

            // Status indicator
            const statusText = isUnlocked ? '✓' : '○';
            const statusColor = isUnlocked ? rankColor : '#333333';
            const status = this.add.text(GAME_WIDTH - 50, yPos + 28, statusText, {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: statusColor
            }).setOrigin(0.5);
            this.achievementContainer.add(status);
            this.achievementItems.push(status);
        }

        // If no achievements in this category
        if (achievementKeys.length === 0) {
            const emptyText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'No achievements in this category', {
                fontSize: '8px',
                fontFamily: 'monospace',
                color: '#666666'
            }).setOrigin(0.5);
            this.achievementContainer.add(emptyText);
            this.achievementItems.push(emptyText);
        }
    }

    changeAchievementRank(direction) {
        const ranks = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
        this.achievementRankTab = this.achievementRankTab || 0;
        const newTab = this.achievementRankTab + direction;
        if (newTab >= 0 && newTab < ranks.length) {
            this.achievementRankTab = newTab;
            this.achievementPage = 0; // Reset to first page when changing ranks
            this.soundManager.playSound('ding');
            this.updateAchievementDisplay();
        }
    }

    navigateAchievement(direction) {
        // Filter by current rank tab
        const ranks = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
        const currentRank = ranks[this.achievementRankTab || 0];
        const achievementKeys = Object.keys(ACHIEVEMENTS).filter(key =>
            ACHIEVEMENTS[key].rank === currentRank
        );
        const achievementsPerPage = 4;
        const totalPages = Math.ceil(achievementKeys.length / achievementsPerPage);

        const newPage = this.achievementPage + direction;
        if (newPage >= 0 && newPage < totalPages) {
            this.achievementPage = newPage;
            this.soundManager.playSound('kick');
            this.updateAchievementDisplay();
        }
    }

    setupInput() {
        // Keyboard
        this.input.keyboard.on('keydown-UP', () => this.navigate(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.navigate(1));
        this.input.keyboard.on('keydown-LEFT', () => {
            if (this.currentMenu === 'monsters') {
                this.navigateMonster(-1);
            } else if (this.currentMenu === 'achievements') {
                this.navigateAchievement(-1);
            }
        });
        this.input.keyboard.on('keydown-RIGHT', () => {
            if (this.currentMenu === 'monsters') {
                this.navigateMonster(1);
            } else if (this.currentMenu === 'achievements') {
                this.navigateAchievement(1);
            }
        });
        this.input.keyboard.on('keydown-SPACE', () => this.selectOption());
        this.input.keyboard.on('keydown-ENTER', () => this.selectOption());
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.currentMenu === 'monsters') {
                this.hideShop();
                this.soundManager.playSound('kick');
            } else if (this.currentMenu === 'achievements') {
                this.hideAchievements();
                this.soundManager.playSound('kick');
            } else if (this.currentMenu !== 'main') {
                this.hideShop();
                this.soundManager.playSound('kick');
            }
        });

        // Mouse/Touch
        this.input.on('pointerdown', (pointer) => {
            if (this.currentMenu === 'main') {
                // Check if clicking a menu button
                this.menuButtons.forEach((btn, i) => {
                    if (pointer.y > btn.y - 10 && pointer.y < btn.y + 10) {
                        this.selectedIndex = i;
                        this.updateMenuSelection();
                        this.selectOption();
                    }
                });
            } else {
                // Shop item selection
                this.shopItems.forEach(item => {
                    if (item.itemData && pointer.y > item.y - 12 && pointer.y < item.y + 12) {
                        this.selectedIndex = item.itemIndex;
                        this.updateShopSelection();
                        this.selectOption();
                    }
                });
            }
        });
    }

    navigate(direction) {
        this.soundManager.playSound('kick');

        if (this.currentMenu === 'main') {
            this.selectedIndex = (this.selectedIndex + direction + this.menuButtons.length) % this.menuButtons.length;
            this.updateMenuSelection();
        } else if (this.currentMenu === 'monsters') {
            // Monster dictionary is view-only, no navigation needed
            return;
        } else if (this.currentMenu === 'achievements') {
            // Up/Down changes rank tabs in achievements
            this.changeAchievementRank(direction);
            return;
        } else {
            let items;
            if (this.currentMenu === 'skins') {
                items = this.skins;
            } else if (this.currentMenu === 'particles') {
                items = this.particles;
            } else {
                items = this.areas;
            }
            this.selectedIndex = (this.selectedIndex + direction + items.length) % items.length;
            this.updateShopSelection();
        }
    }

    updateMenuSelection() {
        this.menuButtons.forEach((btn, i) => {
            btn.setColor(i === this.selectedIndex ? '#ffffff' : '#888888');
            btn.setScale(i === this.selectedIndex ? 1.1 : 1);
        });
        this.selector.y = this.menuButtons[this.selectedIndex].baseY;
    }

    selectOption() {
        this.soundManager.playSound('ding');

        if (this.currentMenu === 'main') {
            const action = this.menuButtons[this.selectedIndex].action;
            switch (action) {
                case 'start':
                    this.startGame();
                    break;
                case 'monsters':
                    this.showMonsterDictionary();
                    break;
                case 'achievements':
                    this.showAchievements();
                    break;
                case 'skins':
                    this.showShop('skins');
                    break;
                case 'particles':
                    this.showShop('particles');
                    break;
                case 'delete':
                    this.confirmDelete();
                    break;
            }
        } else {
            // Shop selection
            let items;
            if (this.currentMenu === 'skins') {
                items = this.skins;
            } else if (this.currentMenu === 'particles') {
                items = this.particles;
            } else {
                items = this.buildings;
            }
            const item = items[this.selectedIndex];

            if (!item) return; // Safety check for undefined item

            if (item.owned) {
                // Equip (skins and particles can be equipped)
                if (this.currentMenu === 'skins') {
                    window.gameState.shop.selectedSkin = item.id;
                } else if (this.currentMenu === 'particles') {
                    window.gameState.shop.selectedParticle = item.id;
                }
                // Buildings don't need equipping, they just unlock areas
                this.saveShopData();
                this.showShop(this.currentMenu); // Refresh
            } else {
                // Try to buy
                if (window.gameState.shop.coins >= item.cost) {
                    window.gameState.shop.coins -= item.cost;
                    item.owned = true;

                    if (this.currentMenu === 'skins') {
                        window.gameState.shop.unlockedSkins.push(item.id);
                        window.gameState.shop.selectedSkin = item.id;
                    } else if (this.currentMenu === 'particles') {
                        window.gameState.shop.unlockedParticles.push(item.id);
                        window.gameState.shop.selectedParticle = item.id;
                    } else if (this.currentMenu === 'buildings') {
                        // Unlock building and all its areas
                        if (!window.gameState.shop.unlockedBuildings) {
                            window.gameState.shop.unlockedBuildings = ['STARTER'];
                        }
                        window.gameState.shop.unlockedBuildings.push(item.id);

                        // Unlock all areas in this building
                        item.areas.forEach(areaId => {
                            if (!window.gameState.shop.unlockedAreas.includes(areaId)) {
                                window.gameState.shop.unlockedAreas.push(areaId);
                                // Update the areas list too
                                const areaItem = this.areas.find(a => a.id === areaId);
                                if (areaItem) areaItem.owned = true;
                            }
                        });
                    }

                    this.saveShopData();
                    this.showShop(this.currentMenu); // Refresh

                    // Update coins display
                    this.coinsText.setText(`💰 ${window.gameState.shop.coins}`);

                    // Purchase effect
                    this.cameras.main.flash(200, 100, 255, 100);

                    const purchaseText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'PURCHASED!', {
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        color: '#44ff44',
                        stroke: '#000000',
                        strokeThickness: 3
                    }).setOrigin(0.5).setDepth(100);

                    this.tweens.add({
                        targets: purchaseText,
                        scale: 1.5,
                        alpha: 0,
                        y: purchaseText.y - 30,
                        duration: 800,
                        onComplete: () => purchaseText.destroy()
                    });
                } else {
                    // Not enough coins

                    const errorText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'NOT ENOUGH COINS!', {
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        color: '#ff4444',
                        stroke: '#000000',
                        strokeThickness: 2
                    }).setOrigin(0.5).setDepth(100);

                    this.tweens.add({
                        targets: errorText,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => errorText.destroy()
                    });
                }
            }
        }
    }

    confirmDelete() {
        // Create confirmation dialog - store elements separately for proper cleanup
        this.deleteElements = [];

        // Dark overlay
        const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8);
        overlay.setDepth(500);
        overlay.setInteractive(); // Block clicks through overlay
        this.deleteElements.push(overlay);

        // Dialog box
        const dialog = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 200, 120, 0x222233, 0.95);
        dialog.setStrokeStyle(2, 0xff4444);
        dialog.setDepth(501);
        this.deleteElements.push(dialog);

        // Warning text
        const warning = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 35, '⚠ DELETE SAVE?', {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#ff4444'
        }).setOrigin(0.5).setDepth(502);
        this.deleteElements.push(warning);

        const info = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, 'This will reset\nALL progress!', {
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#aaaaaa',
            align: 'center'
        }).setOrigin(0.5).setDepth(502);
        this.deleteElements.push(info);

        // Buttons - create with proper hit areas
        const yesBtn = this.add.text(GAME_WIDTH / 2 - 40, GAME_HEIGHT / 2 + 30, '[ YES ]', {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#ff4444',
            backgroundColor: '#331111',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
        this.deleteElements.push(yesBtn);

        const noBtn = this.add.text(GAME_WIDTH / 2 + 40, GAME_HEIGHT / 2 + 30, '[ NO ]', {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#44ff44',
            backgroundColor: '#113311',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setDepth(503).setInteractive({ useHandCursor: true });
        this.deleteElements.push(noBtn);

        // Hover effects
        yesBtn.on('pointerover', () => yesBtn.setColor('#ff6666'));
        yesBtn.on('pointerout', () => yesBtn.setColor('#ff4444'));
        noBtn.on('pointerover', () => noBtn.setColor('#66ff66'));
        noBtn.on('pointerout', () => noBtn.setColor('#44ff44'));

        yesBtn.on('pointerdown', () => {
            this.closeDeleteDialog();
            this.deleteAllData();
        });

        noBtn.on('pointerdown', () => {
            this.closeDeleteDialog();
        });

        // ESC to cancel
        this.deleteEscHandler = this.input.keyboard.once('keydown-ESC', () => {
            this.closeDeleteDialog();
        });
    }

    closeDeleteDialog() {
        if (this.deleteElements) {
            this.deleteElements.forEach(el => {
                if (el && el.active) el.destroy();
            });
            this.deleteElements = null;
        }
    }

    deleteAllData() {
        // Clear all saved data
        localStorage.removeItem('pixelPanicHighScore');
        localStorage.removeItem('pixelPanicShop');

        // Reset game state
        window.gameState = {
            highScore: 0,
            soundEnabled: true,
            lastScore: 0,
            lastFloor: 0,
            coinsCollected: false,
            shop: {
                coins: 0,
                unlockedSkins: ['default'],
                unlockedAreas: ['LOBBY'],
                unlockedBuildings: ['STARTER'],
                unlockedParticles: ['DEFAULT'],
                selectedSkin: 'default',
                selectedParticle: 'DEFAULT',
                startingArea: 'LOBBY'
            }
        };

        // Show confirmation
        const deleted = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'DATA DELETED!', {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#ff4444',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(600);

        this.tweens.add({
            targets: deleted,
            scale: 1.5,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                deleted.destroy();
                // Restart scene
                this.scene.restart();
            }
        });

        if (this.deleteContainer) {
            this.deleteContainer.destroy();
            this.deleteContainer = null;
        }
    }

    saveShopData() {
        try {
            localStorage.setItem('pixelPanicShop', JSON.stringify(window.gameState.shop));
        } catch (e) {
            console.log('Could not save shop data');
        }
    }

    startGame() {
        // Stop menu music
        this.stopMenuMusic();

        // Reset coins collected flag for next game
        window.gameState.coinsCollected = false;

        // Screen flash
        this.cameras.main.flash(200, 255, 255, 255);

        this.time.delayedCall(200, () => {
            this.scene.start('GameScene');
        });
    }
}
