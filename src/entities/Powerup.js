class Powerup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        const textureMap = {
            'ROCKET_BOOTS': 'powerup_rocket',
            'STICKY_GLOVES': 'powerup_sticky',
            'FREEZE_FLOOR': 'powerup_freeze',
            'OVERDRIVE': 'powerup_overdrive'
        };

        super(scene, x, y, textureMap[type] || 'powerup_rocket');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.powerupType = type;

        // Physics
        this.setBounce(0.8);
        this.setCollideWorldBounds(false);
        this.setGravityY(-200); // Floaty

        // Visual effects
        this.setDepth(50);
        this.startGlowEffect();

        // Lifetime - powerups don't last forever
        this.lifetime = 8000;
        this.scene.time.delayedCall(this.lifetime, () => {
            if (this.active) {
                this.fadeOut();
            }
        });

        // Start blinking warning before despawn
        this.scene.time.delayedCall(this.lifetime - 2000, () => {
            if (this.active) {
                this.startBlinking();
            }
        });
    }

    startGlowEffect() {
        // Pulsing glow
        this.scene.tweens.add({
            targets: this,
            scale: { from: 1, to: 1.2 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Floating motion
        this.scene.tweens.add({
            targets: this,
            y: this.y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    startBlinking() {
        this.blinkTween = this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0.3 },
            duration: 150,
            yoyo: true,
            repeat: -1
        });
    }

    fadeOut() {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 0,
            duration: 300,
            onComplete: () => this.destroy()
        });
    }

    collect(player) {
        if (!this.active) return;

        // Apply powerup effect
        player.applyPowerup(this.powerupType);

        // Visual feedback
        this.showCollectEffect();

        // Show powerup name
        this.showPowerupText();

        this.destroy();
    }

    showCollectEffect() {
        // Burst of particles
        for (let i = 0; i < 12; i++) {
            const particle = this.scene.add.sprite(this.x, this.y, 'spark');
            const color = this.getPowerupColor();
            particle.setTint(color);

            const angle = (i / 12) * Math.PI * 2;
            const distance = 40;

            this.scene.tweens.add({
                targets: particle,
                x: this.x + Math.cos(angle) * distance,
                y: this.y + Math.sin(angle) * distance,
                alpha: 0,
                scale: { from: 1.5, to: 0 },
                duration: 300,
                onComplete: () => particle.destroy()
            });
        }

        // Flash screen with powerup color
        const color = this.getPowerupColor();
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;
        this.scene.cameras.main.flash(150, r, g, b);
    }

    showPowerupText() {
        const names = {
            'ROCKET_BOOTS': 'ROCKET BOOTS!',
            'STICKY_GLOVES': 'STICKY GLOVES!',
            'FREEZE_FLOOR': 'FREEZE FLOOR!',
            'OVERDRIVE': 'OVERDRIVE x2!'
        };

        const text = this.scene.add.text(this.x, this.y - 20, names[this.powerupType], {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    getPowerupColor() {
        const colors = {
            'ROCKET_BOOTS': 0xff6600,
            'STICKY_GLOVES': 0x00ffff,
            'FREEZE_FLOOR': 0x66ccff,
            'OVERDRIVE': 0xff00ff
        };
        return colors[this.powerupType] || 0xffffff;
    }

    update() {
        // Check if fell out of elevator
        if (this.y > GAME_HEIGHT + 50 || this.x < -50 || this.x > GAME_WIDTH + 50) {
            this.destroy();
        }
    }
}

// Powerup types for spawning
const POWERUP_TYPES = [
    'ROCKET_BOOTS',
    'STICKY_GLOVES',
    'FREEZE_FLOOR',
    'OVERDRIVE'
];

function createRandomPowerup(scene, x, y) {
    const type = Phaser.Utils.Array.GetRandom(POWERUP_TYPES);
    return new Powerup(scene, x, y, type);
}
