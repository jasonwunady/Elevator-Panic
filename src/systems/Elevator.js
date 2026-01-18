class Elevator {
    constructor(scene) {
        this.scene = scene;
        this.currentWidth = ELEVATOR_CONFIG.INITIAL_WIDTH;

        // Set starting floor based on selected area
        const startingArea = window.gameState.shop ? window.gameState.shop.startingArea : 'LOBBY';
        const areaFloors = {
            'LOBBY': 0,
            'OFFICE': 10,
            'INDUSTRIAL': 20,
            'NEON': 30,
            'VOID': 40,
            'INFERNO': 50,
            'SKYLINE': 60,
            'TOXIC': 70,
            'CYBER': 80,
            'ABYSS': 90,
            'PARADISE': 100
        };
        this.currentFloor = areaFloors[startingArea] || 0;
        this.speed = 1 + (this.currentFloor / 100); // Higher floors = faster start

        // Get elevator style from building
        this.elevatorStyle = this.getElevatorStyleForArea(startingArea);

        // Door states
        this.leftDoorOpen = false;
        this.rightDoorOpen = false;

        // Create elevator structure
        this.createStructure();

        // Floor and shrink timers will be started after countdown
        this.timersStarted = false;
    }

    startTimers() {
        if (this.timersStarted) return;
        this.timersStarted = true;

        // Start floor timer
        this.startFloorTimer();

        // Start shrinking timer
        this.startShrinkTimer();
    }

    getElevatorStyleForArea(areaId) {
        // Find which building this area belongs to
        for (const buildingKey in BUILDINGS) {
            const building = BUILDINGS[buildingKey];
            if (building.areas.includes(areaId)) {
                return building.elevator;
            }
        }
        // Default style
        return BUILDINGS.STARTER.elevator;
    }

    createStructure() {
        const centerX = GAME_WIDTH / 2;
        const floorY = GAME_HEIGHT - 50;

        // Calculate wall positions
        const halfWidth = this.currentWidth / 2;
        const leftX = centerX - halfWidth;
        const rightX = centerX + halfWidth;

        // Use elevator style colors
        const wallColor = this.elevatorStyle.wallColor;
        const floorColor = this.elevatorStyle.floorColor;
        const accentColor = this.elevatorStyle.accentColor;

        // Create walls (static bodies)
        this.leftWall = this.scene.add.rectangle(
            leftX,
            GAME_HEIGHT / 2,
            ELEVATOR_CONFIG.WALL_THICKNESS,
            GAME_HEIGHT,
            wallColor
        );
        this.scene.physics.add.existing(this.leftWall, true);

        this.rightWall = this.scene.add.rectangle(
            rightX,
            GAME_HEIGHT / 2,
            ELEVATOR_CONFIG.WALL_THICKNESS,
            GAME_HEIGHT,
            wallColor
        );
        this.scene.physics.add.existing(this.rightWall, true);

        // Create floor
        this.floor = this.scene.add.rectangle(
            centerX,
            floorY,
            this.currentWidth + ELEVATOR_CONFIG.WALL_THICKNESS * 2,
            ELEVATOR_CONFIG.FLOOR_HEIGHT,
            floorColor
        );
        this.scene.physics.add.existing(this.floor, true);

        // Create ceiling
        this.ceiling = this.scene.add.rectangle(
            centerX,
            30,
            this.currentWidth + ELEVATOR_CONFIG.WALL_THICKNESS * 2,
            ELEVATOR_CONFIG.FLOOR_HEIGHT,
            floorColor
        );
        this.scene.physics.add.existing(this.ceiling, true);

        // Create doors (visual only, hidden behind walls normally)
        this.leftDoor = this.scene.add.rectangle(
            leftX - 30,
            floorY - 60,
            ELEVATOR_CONFIG.DOOR_WIDTH,
            100,
            accentColor
        );
        this.leftDoor.setVisible(false);

        this.rightDoor = this.scene.add.rectangle(
            rightX + 30,
            floorY - 60,
            ELEVATOR_CONFIG.DOOR_WIDTH,
            100,
            accentColor
        );
        this.rightDoor.setVisible(false);

        // Door opening zones (for enemy spawning)
        this.leftDoorZone = { x: leftX - 40, y: floorY - 50 };
        this.rightDoorZone = { x: rightX + 40, y: floorY - 50 };

        // Visual decorations
        this.createDecorations();

        // Depth sorting
        this.leftWall.setDepth(10);
        this.rightWall.setDepth(10);
        this.floor.setDepth(10);
        this.ceiling.setDepth(10);
    }

    createDecorations() {
        const centerX = GAME_WIDTH / 2;
        const halfWidth = this.currentWidth / 2;

        // Use elevator style colors
        const accentColor = this.elevatorStyle.accentColor;
        const lightColor = this.elevatorStyle.lightColor;

        // Wall patterns - vertical rails with rivets
        const patternCount = Math.floor(GAME_HEIGHT / 40);
        this.decorations = [];
        this.leftDecorations = [];  // Track left side decorations for shrinking
        this.rightDecorations = []; // Track right side decorations for shrinking

        for (let i = 0; i < patternCount; i++) {
            // Left wall details - main rail
            const leftDetail = this.scene.add.rectangle(
                centerX - halfWidth + 5,
                i * 40 + 20,
                4,
                30,
                this.elevatorStyle.floorColor
            );
            leftDetail.offsetFromWall = 5;
            this.decorations.push(leftDetail);
            this.leftDecorations.push(leftDetail);

            // Left rail rivets
            const leftRivetTop = this.scene.add.circle(centerX - halfWidth + 5, i * 40 + 8, 1.5, accentColor);
            const leftRivetBot = this.scene.add.circle(centerX - halfWidth + 5, i * 40 + 32, 1.5, accentColor);
            leftRivetTop.offsetFromWall = 5;
            leftRivetBot.offsetFromWall = 5;
            this.decorations.push(leftRivetTop, leftRivetBot);
            this.leftDecorations.push(leftRivetTop, leftRivetBot);

            // Right wall details - main rail
            const rightDetail = this.scene.add.rectangle(
                centerX + halfWidth - 5,
                i * 40 + 20,
                4,
                30,
                this.elevatorStyle.floorColor
            );
            rightDetail.offsetFromWall = 5;
            this.decorations.push(rightDetail);
            this.rightDecorations.push(rightDetail);

            // Right rail rivets
            const rightRivetTop = this.scene.add.circle(centerX + halfWidth - 5, i * 40 + 8, 1.5, accentColor);
            const rightRivetBot = this.scene.add.circle(centerX + halfWidth - 5, i * 40 + 32, 1.5, accentColor);
            rightRivetTop.offsetFromWall = 5;
            rightRivetBot.offsetFromWall = 5;
            this.decorations.push(rightRivetTop, rightRivetBot);
            this.rightDecorations.push(rightRivetTop, rightRivetBot);
        }

        // Add horizontal panel lines on walls with screws
        for (let i = 0; i < 4; i++) {
            const y = 70 + i * 70;
            const leftPanel = this.scene.add.rectangle(centerX - halfWidth + 10, y, 10, 3, accentColor);
            const rightPanel = this.scene.add.rectangle(centerX + halfWidth - 10, y, 10, 3, accentColor);
            leftPanel.offsetFromWall = 10;
            rightPanel.offsetFromWall = 10;
            this.decorations.push(leftPanel, rightPanel);
            this.leftDecorations.push(leftPanel);
            this.rightDecorations.push(rightPanel);
        }

        // Elevator cables at top (visible through gaps)
        this.cables = [];
        for (let i = 0; i < 4; i++) {
            const cable = this.scene.add.rectangle(
                centerX - 30 + i * 20,
                -20,
                2,
                60,
                0x333333
            );
            cable.setDepth(5);
            cable.cableOffset = i * 0.5;
            this.cables.push(cable);
            this.decorations.push(cable);
        }

        // Floor indicator panel (background) with more detail
        this.floorPanelBg = this.scene.add.rectangle(centerX, 20, 90, 22, this.elevatorStyle.floorColor, 0.9);
        this.floorPanelBg.setDepth(18);
        this.floorPanel = this.scene.add.rectangle(centerX, 20, 80, 18, this.elevatorStyle.wallColor, 0.8);
        this.floorPanel.setDepth(19);
        this.floorPanel.setStrokeStyle(2, accentColor);

        // LED dots around floor display
        this.floorLEDs = [];
        for (let i = 0; i < 6; i++) {
            const led = this.scene.add.circle(centerX - 35 + i * 14, 20, 2, 0x00ff00, 0.5);
            led.setDepth(20);
            led.ledIndex = i;
            this.floorLEDs.push(led);
        }

        // Floor indicator (shows current floor)
        this.floorDisplay = this.scene.add.text(
            centerX,
            20,
            `FLOOR ${this.currentFloor}`,
            {
                fontSize: '10px',
                fontFamily: 'monospace',
                color: '#ffcc00'
            }
        ).setOrigin(0.5).setDepth(20);

        // Warning lights with glow effect
        this.leftWarningLight = this.scene.add.sprite(
            centerX - halfWidth + 15,
            60,
            'warning_light'
        ).setDepth(20).setAlpha(0.3);

        this.rightWarningLight = this.scene.add.sprite(
            centerX + halfWidth - 15,
            60,
            'warning_light'
        ).setDepth(20).setAlpha(0.3);

        // Add glow circles behind warning lights
        this.leftGlow = this.scene.add.circle(centerX - halfWidth + 15, 60, 12, 0xff0000, 0);
        this.leftGlow.setDepth(19);
        this.rightGlow = this.scene.add.circle(centerX + halfWidth - 15, 60, 12, 0xff0000, 0);
        this.rightGlow.setDepth(19);

        // Add floor reflection/shine with gradient effect
        this.floorShine = this.scene.add.rectangle(
            centerX,
            this.floor.y - 5,
            this.currentWidth * 0.6,
            3,
            0xffffff,
            0.1
        );
        this.floorShine.setDepth(11);

        // Secondary floor highlights
        this.floorHighlight1 = this.scene.add.rectangle(centerX - 40, this.floor.y - 3, 30, 1, 0xffffff, 0.15);
        this.floorHighlight1.setDepth(11);
        this.floorHighlight2 = this.scene.add.rectangle(centerX + 40, this.floor.y - 3, 30, 1, 0xffffff, 0.15);
        this.floorHighlight2.setDepth(11);

        // Ceiling light strip (main)
        this.ceilingLight = this.scene.add.rectangle(
            centerX,
            this.ceiling.y + 12,
            this.currentWidth * 0.4,
            4,
            lightColor,
            0.3
        );
        this.ceilingLight.setDepth(11);

        // Secondary ceiling lights
        this.ceilingLight2 = this.scene.add.rectangle(centerX - 50, this.ceiling.y + 12, 20, 3, lightColor, 0.2);
        this.ceilingLight2.setDepth(11);
        this.ceilingLight3 = this.scene.add.rectangle(centerX + 50, this.ceiling.y + 12, 20, 3, lightColor, 0.2);
        this.ceilingLight3.setDepth(11);

        // Corner brackets
        this.createCornerBrackets(centerX, halfWidth);

        // Control panel on wall
        this.createControlPanel(centerX, halfWidth);

        // Ventilation grate
        this.createVentGrate(centerX);

        // Start ambient animation
        this.startAmbientAnimations();
    }

    createCornerBrackets(centerX, halfWidth) {
        // Top left corner
        const tlH = this.scene.add.rectangle(centerX - halfWidth + 15, this.ceiling.y + 25, 20, 3, 0x555577);
        const tlV = this.scene.add.rectangle(centerX - halfWidth + 8, this.ceiling.y + 35, 3, 20, 0x555577);
        this.decorations.push(tlH, tlV);

        // Top right corner
        const trH = this.scene.add.rectangle(centerX + halfWidth - 15, this.ceiling.y + 25, 20, 3, 0x555577);
        const trV = this.scene.add.rectangle(centerX + halfWidth - 8, this.ceiling.y + 35, 3, 20, 0x555577);
        this.decorations.push(trH, trV);

        // Bottom left corner
        const blH = this.scene.add.rectangle(centerX - halfWidth + 15, this.floor.y - 25, 20, 3, 0x555577);
        const blV = this.scene.add.rectangle(centerX - halfWidth + 8, this.floor.y - 35, 3, 20, 0x555577);
        this.decorations.push(blH, blV);

        // Bottom right corner
        const brH = this.scene.add.rectangle(centerX + halfWidth - 15, this.floor.y - 25, 20, 3, 0x555577);
        const brV = this.scene.add.rectangle(centerX + halfWidth - 8, this.floor.y - 35, 3, 20, 0x555577);
        this.decorations.push(brH, brV);
    }

    createControlPanel(centerX, halfWidth) {
        // Panel background
        const panelBg = this.scene.add.rectangle(centerX - halfWidth + 15, 140, 16, 50, 0x222233);
        panelBg.setDepth(15);
        this.decorations.push(panelBg);

        // Buttons
        for (let i = 0; i < 4; i++) {
            const btn = this.scene.add.circle(centerX - halfWidth + 15, 120 + i * 12, 3, 0x444455);
            btn.setDepth(16);
            this.decorations.push(btn);
        }

        // Active button indicator
        this.activeButton = this.scene.add.circle(centerX - halfWidth + 15, 120, 3, 0x00ff00, 0.8);
        this.activeButton.setDepth(17);
    }

    createVentGrate(centerX) {
        // Vent frame
        const ventFrame = this.scene.add.rectangle(centerX, this.ceiling.y + 8, 40, 8, 0x333344);
        ventFrame.setDepth(12);
        this.decorations.push(ventFrame);

        // Vent slats
        for (let i = 0; i < 5; i++) {
            const slat = this.scene.add.rectangle(centerX - 15 + i * 8, this.ceiling.y + 8, 5, 2, 0x222233);
            slat.setDepth(13);
            this.decorations.push(slat);
        }
    }

    startAmbientAnimations() {
        // Ceiling light flicker
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                if (this.ceilingLight && this.ceilingLight.active) {
                    this.ceilingLight.setAlpha(0.2 + Math.random() * 0.2);
                }
                if (this.ceilingLight2 && this.ceilingLight2.active) {
                    this.ceilingLight2.setAlpha(0.15 + Math.random() * 0.15);
                }
                if (this.ceilingLight3 && this.ceilingLight3.active) {
                    this.ceilingLight3.setAlpha(0.15 + Math.random() * 0.15);
                }
            },
            loop: true
        });

        // Cable movement
        this.scene.time.addEvent({
            delay: 50,
            callback: () => {
                if (this.cables) {
                    this.cables.forEach(cable => {
                        if (cable && cable.active) {
                            const sway = Math.sin(this.scene.time.now * 0.003 + cable.cableOffset) * 2;
                            cable.x = (GAME_WIDTH / 2 - 30 + this.cables.indexOf(cable) * 20) + sway;
                        }
                    });
                }
            },
            loop: true
        });

        // LED sequence animation
        this.scene.time.addEvent({
            delay: 200,
            callback: () => {
                if (this.floorLEDs) {
                    const activeIndex = Math.floor((this.scene.time.now / 200) % 6);
                    this.floorLEDs.forEach((led, i) => {
                        if (led && led.active) {
                            led.setAlpha(i === activeIndex ? 1 : 0.3);
                            led.setFillStyle(i === activeIndex ? 0x00ff00 : 0x004400);
                        }
                    });
                }
            },
            loop: true
        });

        // Active button blink
        this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                if (this.activeButton && this.activeButton.active) {
                    this.activeButton.setAlpha(this.activeButton.alpha > 0.5 ? 0.3 : 0.8);
                }
            },
            loop: true
        });

        // Elevator rumble effect
        this.rumbleTimer = this.scene.time.addEvent({
            delay: 50,
            callback: () => {
                if (this.scene && !this.scene.isGameOver) {
                    // Subtle screen movement to simulate elevator motion
                    const rumble = Math.sin(this.scene.time.now * 0.01) * 0.3;
                    if (this.scene.cameras && this.scene.cameras.main) {
                        this.scene.cameras.main.setScroll(rumble, 0);
                    }
                }
            },
            loop: true
        });

        // Occasional spark from cables
        this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.scene && !this.scene.isGameOver && Math.random() < 0.4) {
                    this.createCableSpark();
                }
            },
            loop: true
        });
    }

    createCableSpark() {
        const cableIndex = Phaser.Math.Between(0, 3);
        const x = GAME_WIDTH / 2 - 30 + cableIndex * 20;

        for (let i = 0; i < 5; i++) {
            const spark = this.scene.add.circle(
                x,
                Phaser.Math.Between(-10, 20),
                Phaser.Math.Between(1, 2),
                0xffff00,
                0.8
            );
            spark.setDepth(10);

            this.scene.tweens.add({
                targets: spark,
                x: spark.x + Phaser.Math.Between(-15, 15),
                y: spark.y + Phaser.Math.Between(10, 30),
                alpha: 0,
                duration: 300,
                onComplete: () => { if (spark.active) spark.destroy(); }
            });
        }
    }

    startFloorTimer() {
        // New floor every few seconds
        const baseInterval = SPAWN_CONFIG.BASE_INTERVAL;

        this.floorEvent = this.scene.time.addEvent({
            delay: baseInterval,
            callback: this.newFloor,
            callbackScope: this,
            loop: true
        });
    }

    startShrinkTimer() {
        this.shrinkEvent = this.scene.time.addEvent({
            delay: ELEVATOR_CONFIG.SHRINK_INTERVAL,
            callback: this.shrinkElevator,
            callbackScope: this,
            loop: true
        });
    }

    newFloor() {
        this.currentFloor++;
        this.floorDisplay.setText(`FLOOR ${this.currentFloor}`);

        // Reset door exit tracking for both_doors achievement
        if (this.scene.scoreManager) {
            this.scene.scoreManager.resetFloorDoorTracking();
        }

        // Play ding
        this.scene.soundManager.playSound('ding');

        // Flash floor display
        this.scene.tweens.add({
            targets: this.floorDisplay,
            scale: { from: 1.5, to: 1 },
            duration: 200
        });

        // Decide which door(s) to open - always open at least one door
        const doorChoice = Math.random();
        let openLeft = false;
        let openRight = false;

        if (doorChoice < 0.35) {
            openLeft = true;
        } else if (doorChoice < 0.7) {
            openRight = true;
        } else {
            openLeft = true;
            openRight = true;
        }

        // Failsafe - ensure at least one door opens
        if (!openLeft && !openRight) {
            openLeft = true;
        }

        // Open doors
        if (openLeft) this.openDoor('left');
        if (openRight) this.openDoor('right');

        // Spawn enemies after short delay
        this.scene.time.delayedCall(200, () => {
            this.spawnFloorContents(openLeft, openRight);
        });

        // Close doors after duration OR when enemies enter
        const doorOpenTime = Math.max(
            ELEVATOR_CONFIG.DOOR_OPEN_TIME - (this.currentFloor * 15),
            2000  // Minimum 2 seconds for enemies to enter
        );

        // Check for enemies and close doors faster if enemies are inside
        // But wait at least 1 second before checking
        this.scene.time.delayedCall(1000, () => {
            this.doorCheckTimer = this.scene.time.addEvent({
                delay: 500,
                callback: () => {
                    const enemyCount = this.scene.enemies.getChildren().filter(e => e.active && e.isInsideElevator).length;
                    if (enemyCount >= 3) {
                        // Close doors when enough enemies are inside
                        if (openLeft && this.leftDoorOpen) this.closeDoor('left');
                        if (openRight && this.rightDoorOpen) this.closeDoor('right');
                        if (this.doorCheckTimer) {
                            this.doorCheckTimer.destroy();
                            this.doorCheckTimer = null;
                        }
                    }
                },
                loop: true
            });
        });

        this.scene.time.delayedCall(doorOpenTime, () => {
            if (openLeft && this.leftDoorOpen) this.closeDoor('left');
            if (openRight && this.rightDoorOpen) this.closeDoor('right');
            if (this.doorCheckTimer) {
                this.doorCheckTimer.destroy();
                this.doorCheckTimer = null;
            }
        });

        // Speed up game every 10 floors
        if (this.currentFloor % 10 === 0) {
            this.increaseSpeed();
        }

        // Add height score
        this.scene.scoreManager.addHeightScore(this.currentFloor);
    }

    openDoor(side) {
        this.scene.soundManager.playSound('doorOpen');

        // Create door opening particles
        this.createDoorParticles(side);

        if (side === 'left') {
            this.leftDoorOpen = true;
            this.leftDoor.setVisible(true);

            // Animate wall sliding away (create gap)
            this.leftWall.body.enable = false;
            this.leftWall.setAlpha(0.5);

            // Warning light on with glow
            this.scene.tweens.add({
                targets: this.leftWarningLight,
                alpha: 1,
                duration: 100,
                yoyo: true,
                repeat: 5
            });
            if (this.leftGlow) {
                this.scene.tweens.add({
                    targets: this.leftGlow,
                    alpha: { from: 0.5, to: 0 },
                    scale: { from: 1, to: 2 },
                    duration: 300,
                    repeat: 3
                });
            }
        } else {
            this.rightDoorOpen = true;
            this.rightDoor.setVisible(true);

            this.rightWall.body.enable = false;
            this.rightWall.setAlpha(0.5);

            this.scene.tweens.add({
                targets: this.rightWarningLight,
                alpha: 1,
                duration: 100,
                yoyo: true,
                repeat: 5
            });
            if (this.rightGlow) {
                this.scene.tweens.add({
                    targets: this.rightGlow,
                    alpha: { from: 0.5, to: 0 },
                    scale: { from: 1, to: 2 },
                    duration: 300,
                    repeat: 3
                });
            }
        }

        // Screen shake when door opens
        this.scene.cameras.main.shake(100, 0.003);
    }

    createDoorParticles(side) {
        const centerX = GAME_WIDTH / 2;
        const halfWidth = this.currentWidth / 2;
        const x = side === 'left' ? centerX - halfWidth : centerX + halfWidth;

        // Create sparks/dust when door opens
        for (let i = 0; i < 8; i++) {
            const particle = this.scene.add.circle(
                x,
                Phaser.Math.Between(80, GAME_HEIGHT - 50),
                Phaser.Math.Between(1, 3),
                0xffaa00,
                0.8
            );
            particle.setDepth(25);

            const direction = side === 'left' ? 1 : -1;
            this.scene.tweens.add({
                targets: particle,
                x: particle.x + direction * Phaser.Math.Between(20, 50),
                y: particle.y + Phaser.Math.Between(-20, 20),
                alpha: 0,
                scale: 0,
                duration: 400,
                ease: 'Power2',
                onComplete: () => { if (particle.active) particle.destroy(); }
            });
        }

        // Wind gust effect
        const windLine = this.scene.add.rectangle(x, GAME_HEIGHT / 2, 3, GAME_HEIGHT * 0.6, 0xffffff, 0.3);
        windLine.setDepth(24);
        const direction = side === 'left' ? 1 : -1;
        this.scene.tweens.add({
            targets: windLine,
            x: windLine.x + direction * 60,
            alpha: 0,
            scaleX: 0.1,
            duration: 300,
            onComplete: () => { if (windLine.active) windLine.destroy(); }
        });
    }

    closeDoor(side) {
        this.scene.soundManager.playSound('doorOpen');

        // Create closing particles
        this.createDoorCloseParticles(side);

        if (side === 'left') {
            this.leftDoorOpen = false;
            this.leftDoor.setVisible(false);
            this.leftWall.body.enable = true;
            this.leftWall.setAlpha(1);
            this.leftWarningLight.setAlpha(0.3);
        } else {
            this.rightDoorOpen = false;
            this.rightDoor.setVisible(false);
            this.rightWall.body.enable = true;
            this.rightWall.setAlpha(1);
            this.rightWarningLight.setAlpha(0.3);
        }

        // Screen shake when door closes
        this.scene.cameras.main.shake(100, 0.005);
    }

    createDoorCloseParticles(side) {
        const centerX = GAME_WIDTH / 2;
        const halfWidth = this.currentWidth / 2;
        const x = side === 'left' ? centerX - halfWidth : centerX + halfWidth;

        // Metal clang effect - impact ring
        const ring = this.scene.add.circle(x, GAME_HEIGHT / 2, 10, 0xffffff, 0.4);
        ring.setDepth(25);
        this.scene.tweens.add({
            targets: ring,
            scaleX: 3,
            scaleY: 0.5,
            alpha: 0,
            duration: 200,
            onComplete: () => { if (ring.active) ring.destroy(); }
        });

        // Small dust puffs
        for (let i = 0; i < 4; i++) {
            const dust = this.scene.add.circle(
                x,
                GAME_HEIGHT - 40 + i * 10,
                Phaser.Math.Between(2, 4),
                0x888888,
                0.5
            );
            dust.setDepth(25);

            this.scene.tweens.add({
                targets: dust,
                x: dust.x + Phaser.Math.Between(-15, 15),
                y: dust.y - 10,
                alpha: 0,
                duration: 300,
                onComplete: () => { if (dust.active) dust.destroy(); }
            });
        }
    }

    spawnFloorContents(leftOpen, rightOpen) {
        // Failsafe - ensure at least one door is considered open for spawning
        if (!leftOpen && !rightOpen) {
            leftOpen = true;
        }

        // Calculate number of enemies
        // Base chance for 2 enemies is 30%, increases by 1% per floor
        const chanceFor2 = Math.min(0.30 + (this.currentFloor * 0.01), 0.90); // Cap at 90%

        // At floor 67+, there's a chance for 3 enemies
        let enemyCount;
        if (this.currentFloor >= 67) {
            // Chance for 3 enemies starts at 10% at floor 67, increases 1% per floor after
            const chanceFor3 = Math.min(0.10 + ((this.currentFloor - 67) * 0.01), 0.40); // Cap at 40%
            const roll = Math.random();
            if (roll < chanceFor3) {
                enemyCount = 3;
            } else if (roll < chanceFor3 + chanceFor2) {
                enemyCount = 2;
            } else {
                enemyCount = 1;
            }
        } else {
            enemyCount = Math.random() < chanceFor2 ? 2 : 1;
        }

        // Decide enemy types based on floor progression
        const enemyTypes = this.getAvailableEnemyTypes();

        // Spawn enemies - use current wall positions for accurate spawn points
        for (let i = 0; i < enemyCount; i++) {
            const spawnLeft = leftOpen && (!rightOpen || Math.random() < 0.5);
            // Spawn inside the elevator, not outside the walls
            const spawnX = spawnLeft ?
                this.leftWall.x + 40 :
                this.rightWall.x - 40;
            const spawnY = GAME_HEIGHT - 100 + Phaser.Math.Between(-20, 20);

            const type = Phaser.Utils.Array.GetRandom(enemyTypes);

            this.scene.time.delayedCall(i * 150, () => {
                // Spawn enemy regardless of door state - they're already "entering"
                this.scene.spawnEnemy(spawnX, spawnY, type);
            });
        }

        // Maybe spawn powerup
        if (Math.random() < SPAWN_CONFIG.POWERUP_CHANCE) {
            const spawnLeft = leftOpen && (!rightOpen || Math.random() < 0.5);
            const spawnX = spawnLeft ?
                this.leftWall.x + 50 :
                this.rightWall.x - 50;
            const spawnY = GAME_HEIGHT - 100;

            this.scene.time.delayedCall(300, () => {
                if ((spawnLeft && this.leftDoorOpen) || (!spawnLeft && this.rightDoorOpen)) {
                    this.scene.spawnPowerup(spawnX, spawnY);
                }
            });
        }
    }

    getAvailableEnemyTypes() {
        const types = ['RUSHER', 'RUSHER']; // Rushers are common

        // Unlock enemies progressively
        if (this.currentFloor >= 3) types.push('BOUNCER');
        if (this.currentFloor >= 5) types.push('CLINGER');
        if (this.currentFloor >= 8) types.push('SPITTER');
        if (this.currentFloor >= 10) types.push('EXPLODER');
        if (this.currentFloor >= 12) types.push('SWARM', 'SWARM'); // Small enemies come in groups
        if (this.currentFloor >= 14) types.push('SPLASHER');
        if (this.currentFloor >= 15) types.push('SPLITTER');
        if (this.currentFloor >= 16) types.push('PUSHER');
        if (this.currentFloor >= 18) types.push('LEAPER');
        if (this.currentFloor >= 20) types.push('HEAVY');
        if (this.currentFloor >= 22) types.push('SPINNER');
        if (this.currentFloor >= 24) types.push('ELECTRO');
        if (this.currentFloor >= 25) types.push('GHOST');
        if (this.currentFloor >= 28) types.push('CRAWLER');
        if (this.currentFloor >= 30) types.push('CHARGER');
        if (this.currentFloor >= 33) types.push('NINJA');
        if (this.currentFloor >= 35) types.push('BOMBER');
        if (this.currentFloor >= 36) types.push('BOOMER');
        if (this.currentFloor >= 38) types.push('FREEZER');
        if (this.currentFloor >= 40) types.push('SHIELD');
        if (this.currentFloor >= 42) types.push('SHADOW');
        if (this.currentFloor >= 43) types.push('TELEPORTER');
        if (this.currentFloor >= 44) types.push('DRAINER');
        if (this.currentFloor >= 45) types.push('MAGNET');
        if (this.currentFloor >= 46) types.push('HOMING');
        if (this.currentFloor >= 47) types.push('GRAVITY');
        if (this.currentFloor >= 48) types.push('VAMPIRE');
        if (this.currentFloor >= 50) types.push('LASER');
        if (this.currentFloor >= 52) types.push('ANCHOR');
        if (this.currentFloor >= 54) types.push('PHASER');
        if (this.currentFloor >= 55) types.push('REFLECTOR');
        if (this.currentFloor >= 57) types.push('PORTAL');
        if (this.currentFloor >= 58) types.push('SHIELDER');
        if (this.currentFloor >= 60) types.push('MIMIC');
        if (this.currentFloor >= 62) types.push('BLOB');
        if (this.currentFloor >= 65) types.push('BERSERKER');
        if (this.currentFloor >= 67) types.push('CLONER');
        if (this.currentFloor >= 70) types.push('SUMMONER');
        if (this.currentFloor >= 75) types.push('TANK');

        // 10 NEW ENEMY TYPES (floors 77+)
        if (this.currentFloor >= 77) types.push('SPARK');
        if (this.currentFloor >= 78) types.push('WRAITH');
        if (this.currentFloor >= 80) types.push('SCORPION');
        if (this.currentFloor >= 82) types.push('PRISM');
        if (this.currentFloor >= 84) types.push('INFERNO');
        if (this.currentFloor >= 86) types.push('GOLEM');
        if (this.currentFloor >= 88) types.push('JESTER');
        if (this.currentFloor >= 90) types.push('HYDRA');
        if (this.currentFloor >= 92) types.push('MIRAGE_NEW');
        if (this.currentFloor >= 95) types.push('TITAN');

        // 50 MORE ENEMY TYPES (floors 97-175)
        if (this.currentFloor >= 97) types.push('VIPER');
        if (this.currentFloor >= 99) types.push('CYCLOPS');
        if (this.currentFloor >= 100) types.push('WASP');
        if (this.currentFloor >= 102) types.push('MUMMY');
        if (this.currentFloor >= 104) types.push('DJINN');
        if (this.currentFloor >= 106) types.push('GARGOYLE');
        if (this.currentFloor >= 108) types.push('BASILISK');
        if (this.currentFloor >= 110) types.push('BANSHEE');
        if (this.currentFloor >= 112) types.push('PHOENIX');
        if (this.currentFloor >= 114) types.push('LICH');
        if (this.currentFloor >= 116) types.push('WENDIGO');
        if (this.currentFloor >= 118) types.push('CERBERUS');
        if (this.currentFloor >= 120) types.push('WYVERN');
        if (this.currentFloor >= 122) types.push('MINOTAUR');
        if (this.currentFloor >= 124) types.push('SPECTER');
        if (this.currentFloor >= 126) types.push('CHIMERA');
        if (this.currentFloor >= 128) types.push('REAPER');
        if (this.currentFloor >= 130) types.push('OGRE');
        if (this.currentFloor >= 132) types.push('HARPY');
        if (this.currentFloor >= 134) types.push('TROLL');
        if (this.currentFloor >= 136) types.push('KRAKEN');
        if (this.currentFloor >= 138) types.push('DEMON');
        if (this.currentFloor >= 140) types.push('ELEMENTAL');
        if (this.currentFloor >= 142) types.push('WYRM');
        if (this.currentFloor >= 144) types.push('SHADE');
        if (this.currentFloor >= 146) types.push('FUNGOID');
        if (this.currentFloor >= 148) types.push('SENTINEL');
        if (this.currentFloor >= 150) types.push('SLIME_KING');
        if (this.currentFloor >= 151) types.push('BEETLE');
        if (this.currentFloor >= 152) types.push('WRECKER');
        if (this.currentFloor >= 153) types.push('ORACLE');
        if (this.currentFloor >= 155) types.push('GOLIATH');
        if (this.currentFloor >= 156) types.push('ASSASSIN');
        if (this.currentFloor >= 157) types.push('PLAGUE');
        if (this.currentFloor >= 158) types.push('PHANTOM');
        if (this.currentFloor >= 159) types.push('BRUTE');
        if (this.currentFloor >= 160) types.push('SIREN');
        if (this.currentFloor >= 162) types.push('COLOSSUS');
        if (this.currentFloor >= 163) types.push('REVENANT');
        if (this.currentFloor >= 164) types.push('GOLEM_FIRE');
        if (this.currentFloor >= 165) types.push('GOLEM_ICE');
        if (this.currentFloor >= 166) types.push('VAMPIRE_LORD');
        if (this.currentFloor >= 168) types.push('NECROMANCER');
        if (this.currentFloor >= 170) types.push('SKELETON_KING');
        if (this.currentFloor >= 172) types.push('DRAGON');
        if (this.currentFloor >= 173) types.push('ARCHDEMON');
        if (this.currentFloor >= 174) types.push('VOID_WALKER');
        if (this.currentFloor >= 175) types.push('COSMIC_HORROR', 'WORLD_EATER');

        // Weight towards harder enemies at higher floors
        if (this.currentFloor >= 30) {
            types.push('EXPLODER', 'HEAVY', 'SPITTER', 'GHOST', 'CHARGER', 'NINJA', 'ELECTRO', 'PUSHER');
        }
        if (this.currentFloor >= 40) {
            types.push('SPLITTER', 'GHOST', 'HEAVY', 'SHIELD', 'BOMBER', 'FREEZER', 'TELEPORTER', 'SHADOW', 'BOOMER');
        }
        if (this.currentFloor >= 50) {
            types.push('HEAVY', 'HEAVY', 'EXPLODER', 'EXPLODER', 'CHARGER', 'SHIELD', 'LASER', 'VAMPIRE', 'DRAINER', 'HOMING', 'GRAVITY', 'ANCHOR');
        }
        if (this.currentFloor >= 60) {
            types.push('BOMBER', 'BOMBER', 'SHIELD', 'CHARGER', 'GHOST', 'MIMIC', 'REFLECTOR', 'PORTAL', 'SHIELDER', 'PHASER', 'BLOB');
        }
        if (this.currentFloor >= 70) {
            types.push('SUMMONER', 'BERSERKER', 'VAMPIRE', 'LASER', 'CLONER', 'BLOB', 'SHIELDER');
        }
        if (this.currentFloor >= 75) {
            types.push('TANK', 'TANK'); // TANK unlocks at floor 75
        }
        if (this.currentFloor >= 80) {
            types.push('TANK', 'TANK', 'SUMMONER', 'BERSERKER', 'BERSERKER', 'CLONER', 'BLOB', 'PORTAL', 'GRAVITY');
            types.push('SPARK', 'WRAITH', 'SCORPION');
        }
        if (this.currentFloor >= 90) {
            types.push('PRISM', 'INFERNO', 'GOLEM', 'JESTER', 'HYDRA', 'MIRAGE_NEW', 'SPARK', 'SPARK');
        }
        if (this.currentFloor >= 95) {
            types.push('TITAN', 'GOLEM', 'HYDRA', 'INFERNO', 'WRAITH');
        }
        // New high-floor weights
        if (this.currentFloor >= 100) {
            types.push('VIPER', 'CYCLOPS', 'WASP', 'MUMMY', 'DJINN', 'TITAN', 'TITAN');
        }
        if (this.currentFloor >= 120) {
            types.push('GARGOYLE', 'BASILISK', 'BANSHEE', 'PHOENIX', 'LICH', 'WENDIGO', 'CERBERUS', 'WYVERN', 'MINOTAUR');
        }
        if (this.currentFloor >= 140) {
            types.push('SPECTER', 'CHIMERA', 'REAPER', 'OGRE', 'HARPY', 'TROLL', 'KRAKEN', 'DEMON', 'ELEMENTAL', 'WYRM');
        }
        if (this.currentFloor >= 160) {
            types.push('SHADE', 'FUNGOID', 'SENTINEL', 'SLIME_KING', 'BEETLE', 'WRECKER', 'ORACLE', 'GOLIATH', 'ASSASSIN', 'PLAGUE');
            types.push('PHANTOM', 'BRUTE', 'SIREN', 'COLOSSUS', 'REVENANT', 'GOLEM_FIRE', 'GOLEM_ICE');
        }
        if (this.currentFloor >= 170) {
            types.push('VAMPIRE_LORD', 'NECROMANCER', 'SKELETON_KING', 'DRAGON', 'ARCHDEMON', 'VOID_WALKER');
            types.push('DRAGON', 'DRAGON', 'ARCHDEMON', 'ARCHDEMON'); // Extra weight for bosses
        }
        if (this.currentFloor >= 175) {
            types.push('COSMIC_HORROR', 'COSMIC_HORROR', 'WORLD_EATER', 'WORLD_EATER', 'WORLD_EATER');
        }

        return types;
    }

    increaseSpeed() {
        this.speed += 0.1;

        // Decrease floor interval
        if (this.floorEvent) {
            const newInterval = Math.max(
                SPAWN_CONFIG.BASE_INTERVAL / this.speed,
                SPAWN_CONFIG.MIN_INTERVAL
            );
            this.floorEvent.delay = newInterval;
        }

        // Show speed up text
        const text = this.scene.add.text(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            'SPEED UP!',
            {
                fontSize: '24px',
                fontFamily: 'monospace',
                color: '#ff6600',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setDepth(200);

        this.scene.tweens.add({
            targets: text,
            scale: { from: 0.5, to: 1.5 },
            alpha: { from: 1, to: 0 },
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    shrinkElevator() {
        if (this.currentWidth <= ELEVATOR_CONFIG.MIN_WIDTH) return;

        const shrinkAmount = ELEVATOR_CONFIG.SHRINK_RATE;
        this.currentWidth = Math.max(
            this.currentWidth - shrinkAmount,
            ELEVATOR_CONFIG.MIN_WIDTH
        );

        // Update wall positions
        const centerX = GAME_WIDTH / 2;
        const halfWidth = this.currentWidth / 2;
        const newLeftX = centerX - halfWidth;
        const newRightX = centerX + halfWidth;

        // Animate walls moving inward
        this.scene.tweens.add({
            targets: this.leftWall,
            x: newLeftX,
            duration: 500,
            ease: 'Power2',
            onUpdate: () => {
                // Update physics body position during animation
                if (this.leftWall.body) {
                    this.leftWall.body.position.x = this.leftWall.x - ELEVATOR_CONFIG.WALL_THICKNESS / 2;
                }
            }
        });

        this.scene.tweens.add({
            targets: this.rightWall,
            x: newRightX,
            duration: 500,
            ease: 'Power2',
            onUpdate: () => {
                // Update physics body position during animation
                if (this.rightWall.body) {
                    this.rightWall.body.position.x = this.rightWall.x - ELEVATOR_CONFIG.WALL_THICKNESS / 2;
                }
            }
        });

        // Update physics bodies after animation
        this.scene.time.delayedCall(510, () => {
            if (this.leftWall && this.leftWall.body) {
                this.leftWall.body.reset(this.leftWall.x, this.leftWall.y);
            }
            if (this.rightWall && this.rightWall.body) {
                this.rightWall.body.reset(this.rightWall.x, this.rightWall.y);
            }

            // Update door zones
            this.leftDoorZone.x = this.leftWall.x - 40;
            this.rightDoorZone.x = this.rightWall.x + 40;
        });

        // Update floor and ceiling width
        this.scene.tweens.add({
            targets: [this.floor, this.ceiling],
            displayWidth: this.currentWidth + ELEVATOR_CONFIG.WALL_THICKNESS * 2,
            duration: 500
        });

        // Update doors position
        if (this.leftDoor) {
            this.scene.tweens.add({
                targets: this.leftDoor,
                x: newLeftX - 30,
                duration: 500,
                ease: 'Power2'
            });
        }
        if (this.rightDoor) {
            this.scene.tweens.add({
                targets: this.rightDoor,
                x: newRightX + 30,
                duration: 500,
                ease: 'Power2'
            });
        }

        // Update warning lights position
        if (this.leftWarningLight) {
            this.scene.tweens.add({
                targets: this.leftWarningLight,
                x: newLeftX + 15,
                duration: 500,
                ease: 'Power2'
            });
        }
        if (this.rightWarningLight) {
            this.scene.tweens.add({
                targets: this.rightWarningLight,
                x: newRightX - 15,
                duration: 500,
                ease: 'Power2'
            });
        }

        // Update warning light glows
        if (this.leftGlow) {
            this.scene.tweens.add({
                targets: this.leftGlow,
                x: newLeftX + 15,
                duration: 500,
                ease: 'Power2'
            });
        }
        if (this.rightGlow) {
            this.scene.tweens.add({
                targets: this.rightGlow,
                x: newRightX - 15,
                duration: 500,
                ease: 'Power2'
            });
        }

        // Update ceiling light width
        if (this.ceilingLight) {
            this.scene.tweens.add({
                targets: this.ceilingLight,
                displayWidth: this.currentWidth * 0.4,
                duration: 500
            });
        }

        // Update floor highlights
        if (this.floorHighlight) {
            this.scene.tweens.add({
                targets: this.floorHighlight,
                displayWidth: this.currentWidth * 0.6,
                duration: 500
            });
        }
        if (this.floorHighlight2) {
            this.scene.tweens.add({
                targets: this.floorHighlight2,
                displayWidth: this.currentWidth * 0.3,
                duration: 500
            });
        }

        // Decorations stay in place during shrinking (they're cosmetic wall details)

        // Show shrink warning
        const text = this.scene.add.text(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2 - 50,
            'ELEVATOR SHRINKING!',
            {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#ff4444',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5).setDepth(200);

        this.scene.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 1500,
            onComplete: () => text.destroy()
        });
    }

    getElevatorBounds() {
        return {
            left: this.leftWall.x + ELEVATOR_CONFIG.WALL_THICKNESS / 2,
            right: this.rightWall.x - ELEVATOR_CONFIG.WALL_THICKNESS / 2,
            top: this.ceiling.y + ELEVATOR_CONFIG.FLOOR_HEIGHT / 2,
            bottom: this.floor.y - ELEVATOR_CONFIG.FLOOR_HEIGHT / 2
        };
    }

    destroy() {
        if (this.floorEvent) this.floorEvent.destroy();
        if (this.shrinkEvent) this.shrinkEvent.destroy();
        if (this.doorCheckTimer) {
            this.doorCheckTimer.destroy();
            this.doorCheckTimer = null;
        }
        if (this.rumbleTimer) {
            this.rumbleTimer.destroy();
            this.rumbleTimer = null;
        }
    }
}
