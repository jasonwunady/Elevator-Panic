class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
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
            // 50 MORE ENEMIES
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

        super(scene, x, y, textureMap[type] || 'enemy_rusher');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.enemyType = type;
        this.config = ENEMY_CONFIG[type] || ENEMY_CONFIG.RUSHER;

        // Physics - add safety checks
        if (this.body) {
            this.setBounce(0.5);
            this.setCollideWorldBounds(false);
            this.setSize(this.config.WIDTH - 2, this.config.HEIGHT - 2);
        }
        this.mass = this.config.MASS;

        // State
        this.health = this.config.HEALTH;
        this.isKicked = false;
        this.kickedBy = null;
        this.isInsideElevator = true;
        this.hasEnteredElevator = false;

        // Type-specific setup
        this.setupByType();
    }

    setupByType() {
        switch (this.enemyType) {
            case 'RUSHER':
                this.setTint(0xff4444);
                break;

            case 'CLINGER':
                this.setTint(0x44ff44);
                // Clingers float slightly - reduced gravity
                if (this.body) this.setGravityY(-150);
                break;

            case 'EXPLODER':
                this.setTint(0xffaa00);
                this.fuseTimer = this.config.FUSE_TIME;
                this.isExploding = false;
                this.startFuse();
                break;

            case 'HEAVY':
                this.setTint(0x8844ff);
                if (this.body) this.setDrag(200);
                break;

            case 'SPITTER':
                this.setTint(0x00cccc);
                this.spitCooldown = 0;
                break;

            case 'BOUNCER':
                this.setTint(0xff66aa);
                if (this.body) {
                    this.setBounce(1.2);
                    this.setVelocityY(-200); // Start bouncing
                }
                break;

            case 'SPLITTER':
                this.setTint(0xcccc00);
                this.hasSplit = false;
                break;

            case 'SPLITTER_MINI':
                this.setTint(0xcccc00);
                this.setScale(0.8);
                break;

            case 'GHOST':
                this.setTint(0xddddff);
                this.isPhasing = false;
                this.phaseTimer = 0;
                this.setAlpha(0.9);
                break;

            case 'CHARGER':
                this.setTint(0xff8800);
                this.isCharging = false;
                this.chargeCooldown = this.config.CHARGE_COOLDOWN;
                break;

            case 'BOMBER':
                this.setTint(0x884400);
                this.bombCooldown = this.config.BOMB_COOLDOWN;
                break;

            case 'SHIELD':
                this.setTint(0x4488ff);
                this.facingDirection = 1;
                this.isBlocking = true;
                break;

            case 'TELEPORTER':
                this.setTint(0x9944ff);
                this.teleportCooldown = this.config.TELEPORT_COOLDOWN;
                break;

            case 'MIMIC':
                this.setTint(0x888888);
                this.mimicTimer = 0;
                this.isMimicking = false;
                break;

            case 'MAGNET':
                this.setTint(0xcc3333);
                break;

            case 'FREEZER':
                this.setTint(0x66ccff);
                this.freezeCooldown = 0;
                break;

            case 'SPINNER':
                this.setTint(0xcccccc);
                this.spinAngle = 0;
                break;

            case 'VAMPIRE':
                this.setTint(0x660022);
                break;

            case 'SUMMONER':
                this.setTint(0x442266);
                this.summonCooldown = this.config.SUMMON_COOLDOWN;
                break;

            case 'NINJA':
                this.setTint(0x222222);
                this.dashCooldown = this.config.DASH_COOLDOWN;
                this.isDashing = false;
                break;

            case 'TANK':
                this.setTint(0x446644);
                if (this.body) this.setDrag(300);
                break;

            case 'LEAPER':
                this.setTint(0x66aa44);
                this.leapCooldown = this.config.LEAP_COOLDOWN;
                break;

            case 'SWARM':
                this.setTint(0x886600);
                this.swarmOffset = Math.random() * Math.PI * 2;
                break;

            case 'LASER':
                this.setTint(0x444466);
                this.laserCooldown = this.config.LASER_COOLDOWN;
                this.isCharging = false;
                break;

            case 'REFLECTOR':
                this.setTint(0xaaaacc);
                break;

            case 'BERSERKER':
                this.setTint(0xcc2222);
                this.isEnraged = false;
                this.originalSpeed = this.config.SPEED;
                break;

            case 'CRAWLER':
                this.setTint(0x664422);
                this.onCeiling = false;
                break;

            // 14 New enemy types
            case 'SHADOW':
                this.setTint(0x222244);
                this.isInvisible = false;
                this.invisibleTimer = this.config.INVISIBLE_DURATION;
                this.setAlpha(0.8);
                break;

            case 'GRAVITY':
                this.setTint(0x5500aa);
                break;

            case 'SPLASHER':
                this.setTint(0x00aaff);
                break;

            case 'ANCHOR':
                this.setTint(0x555555);
                if (this.body) this.setDrag(500);
                break;

            case 'PORTAL':
                this.setTint(0xff00aa);
                this.portalCooldown = this.config.PORTAL_COOLDOWN;
                break;

            case 'ELECTRO':
                this.setTint(0xffff00);
                this.shockCooldown = this.config.SHOCK_COOLDOWN;
                break;

            case 'BLOB':
                this.setTint(0x44aa44);
                this.splitCount = this.config.SPLIT_COUNT;
                break;

            case 'HOMING':
                this.setTint(0xff6600);
                this.missileCooldown = this.config.MISSILE_COOLDOWN;
                break;

            case 'PHASER':
                this.setTint(0x8888ff);
                this.phaseCooldown = this.config.PHASE_COOLDOWN;
                this.isPhased = false;
                break;

            case 'PUSHER':
                this.setTint(0xaa8800);
                break;

            case 'DRAINER':
                this.setTint(0x880088);
                this.drainTimer = 0;
                break;

            case 'CLONER':
                this.setTint(0x00ff88);
                this.cloneCooldown = this.config.CLONE_COOLDOWN;
                break;

            case 'SHIELDER':
                this.setTint(0x4488ff);
                this.shieldActive = true;
                break;

            case 'BOOMER':
                this.setTint(0xff4400);
                this.boomTimer = this.config.BOOM_DELAY;
                this.isBooming = false;
                break;

            // ========== 10 NEW ENEMY TYPES ==========

            case 'WRAITH':
                this.setTint(0x4466aa);
                this.fadeTimer = 0;
                this.isFaded = false;
                this.setAlpha(0.85);
                if (this.body) this.setGravityY(-100); // Floats
                break;

            case 'SCORPION':
                this.setTint(0x884422);
                this.stingCooldown = 0;
                this.isPoisoned = false;
                break;

            case 'PRISM':
                this.setTint(0xaaddff);
                this.reflectCount = 2; // Can reflect 2 kicks
                break;

            case 'INFERNO':
                this.setTint(0xff6600);
                this.burnRadius = this.config.BURN_RADIUS || 30;
                this.burnDamage = true;
                break;

            case 'GOLEM':
                this.setTint(0x666666);
                if (this.body) this.setDrag(400);
                this.stunResistance = 3; // Takes 3 hits to move
                break;

            case 'JESTER':
                this.setTint(0xaa22aa);
                this.chaosTimer = 0;
                this.movementPattern = 0;
                break;

            case 'HYDRA':
                this.setTint(0x228844);
                this.headCount = 3;
                this.biteCooldown = 0;
                break;

            case 'MIRAGE_NEW':
                this.setTint(0x8888cc);
                this.illusionCooldown = 0;
                this.illusionCount = 0;
                break;

            case 'TITAN':
                this.setTint(0x884444);
                if (this.body) this.setDrag(350);
                this.slamCooldown = 0;
                break;

            case 'SPARK':
                this.setTint(0xffff00);
                this.setScale(0.8);
                this.zigzagTimer = 0;
                this.zigzagDir = 1;
                if (this.body) this.setBounce(1.5);
                break;

            // ========== 50 MORE ENEMY SETUPS ==========
            case 'VIPER':
                this.setTint(0x44aa44);
                this.strikeReady = true;
                break;
            case 'CYCLOPS':
                this.setTint(0x8866aa);
                this.eyeBeamCooldown = 0;
                break;
            case 'WASP':
                this.setTint(0xffcc00);
                if (this.body) this.setGravityY(-200);
                this.diveCooldown = 0;
                break;
            case 'MUMMY':
                this.setTint(0xccbb99);
                this.curseCooldown = 0;
                break;
            case 'DJINN':
                this.setTint(0x4488ff);
                this.wishCooldown = 0;
                if (this.body) this.setGravityY(-100);
                break;
            case 'GARGOYLE':
                this.setTint(0x555566);
                if (this.body) this.setGravityY(-150);
                this.divebombReady = true;
                break;
            case 'BASILISK':
                this.setTint(0x448844);
                this.gazeCooldown = 0;
                break;
            case 'BANSHEE':
                this.setTint(0xddddff);
                this.screamCooldown = 0;
                break;
            case 'PHOENIX':
                this.setTint(0xff6600);
                this.hasRevived = false;
                if (this.body) this.setGravityY(-100);
                break;
            case 'LICH':
                this.setTint(0x2222aa);
                this.summonCooldown = 0;
                break;
            case 'WENDIGO':
                this.setTint(0xaaddff);
                this.freezeAuraCooldown = 0;
                break;
            case 'CERBERUS':
                this.setTint(0x442222);
                this.biteCooldown = 0;
                break;
            case 'WYVERN':
                this.setTint(0x664488);
                if (this.body) this.setGravityY(-120);
                this.tailStrikeCooldown = 0;
                break;
            case 'MINOTAUR':
                this.setTint(0x884422);
                this.isCharging = false;
                this.chargeCooldown = 0;
                break;
            case 'SPECTER':
                this.setTint(0x6688aa);
                this.setAlpha(0.6);
                this.fadeTimer = 0;
                break;
            case 'CHIMERA':
                this.setTint(0xaa6644);
                this.attackMode = 0;
                this.modeSwitchTimer = 0;
                break;
            case 'REAPER':
                this.setTint(0x111111);
                this.deathTouchActive = true;
                break;
            case 'OGRE':
                this.setTint(0x66aa66);
                this.smashCooldown = 0;
                break;
            case 'HARPY':
                this.setTint(0xddaa88);
                if (this.body) this.setGravityY(-180);
                this.swoopCooldown = 0;
                break;
            case 'TROLL':
                this.setTint(0x557755);
                this.regenTimer = 0;
                this.maxHealth = this.health;
                break;
            case 'KRAKEN':
                this.setTint(0x446688);
                this.tentacleCooldown = 0;
                break;
            case 'DEMON':
                this.setTint(0xaa2222);
                this.fireballCooldown = 0;
                break;
            case 'ELEMENTAL':
                this.setTint(0x44ddff);
                this.elementType = 0;
                this.elementSwitchTimer = 0;
                break;
            case 'WYRM':
                this.setTint(0x668844);
                this.constrictCooldown = 0;
                break;
            case 'SHADE':
                this.setTint(0x222233);
                this.setAlpha(0.5);
                break;
            case 'FUNGOID':
                this.setTint(0xcc8866);
                this.sporeCooldown = 0;
                break;
            case 'SENTINEL':
                this.setTint(0x888899);
                this.shieldUp = true;
                break;
            case 'SLIME_KING':
                this.setTint(0x44dd44);
                this.hasSplit = false;
                break;
            case 'BEETLE':
                this.setTint(0x224466);
                this.shellUp = false;
                break;
            case 'WRECKER':
                this.setTint(0xcc6600);
                this.smashCooldown = 0;
                break;
            case 'ORACLE':
                this.setTint(0x8844aa);
                this.predictTimer = 0;
                break;
            case 'GOLIATH':
                this.setTint(0x556677);
                this.stompCooldown = 0;
                break;
            case 'ASSASSIN':
                this.setTint(0x333344);
                this.isHidden = true;
                this.setAlpha(0.2);
                break;
            case 'PLAGUE':
                this.setTint(0x557722);
                this.poisonCooldown = 0;
                break;
            case 'PHANTOM':
                this.setTint(0x4455aa);
                this.setAlpha(0.3);
                this.visibilityTimer = 0;
                break;
            case 'BRUTE':
                this.setTint(0x994444);
                this.punchCooldown = 0;
                break;
            case 'SIREN':
                this.setTint(0x44aaaa);
                this.songCooldown = 0;
                break;
            case 'COLOSSUS':
                this.setTint(0x777788);
                this.stompCooldown = 0;
                break;
            case 'REVENANT':
                this.setTint(0x445544);
                this.hasRevived = false;
                break;
            case 'GOLEM_FIRE':
                this.setTint(0xff6600);
                this.burnCooldown = 0;
                break;
            case 'GOLEM_ICE':
                this.setTint(0x88ccff);
                this.freezeCooldown = 0;
                break;
            case 'VAMPIRE_LORD':
                this.setTint(0x440033);
                this.drainCooldown = 0;
                this.batFormCooldown = 0;
                break;
            case 'NECROMANCER':
                this.setTint(0x222244);
                this.raiseCooldown = 0;
                break;
            case 'SKELETON_KING':
                this.setTint(0xccccbb);
                this.commandCooldown = 0;
                break;
            case 'DRAGON':
                this.setTint(0xcc4422);
                this.breathCooldown = 0;
                if (this.body) this.setGravityY(-50);
                break;
            case 'ARCHDEMON':
                this.setTint(0x880000);
                this.infernoCooldown = 0;
                break;
            case 'VOID_WALKER':
                this.setTint(0x220044);
                this.blinkCooldown = 0;
                break;
            case 'COSMIC_HORROR':
                this.setTint(0x442266);
                this.madnessCooldown = 0;
                break;
            case 'WORLD_EATER':
                this.setTint(0x111122);
                this.devourCooldown = 0;
                this.isEnraged = false;
                break;
        }
    }

    update(time, delta) {
        if (!this.active || !this.body) return;

        // Update animation timer
        if (!this.animTime) this.animTime = Math.random() * Math.PI * 2;
        this.animTime += 0.1;

        // Check if inside elevator bounds
        this.checkElevatorBounds();

        // Type-specific behavior
        if (!this.isKicked) {
            this.behaviorUpdate();
            this.updateAnimation();
        } else {
            // When kicked, check if ejected
            this.checkEjected();
            // Reset CLINGER state when kicked
            if (this.enemyType === 'CLINGER' && this.body) {
                this.setGravityY(300); // Normal gravity when kicked
            }
            // Re-enable Ghost body when kicked (so physics works properly)
            if (this.enemyType === 'GHOST' && this.body && !this.body.enable) {
                this.body.enable = true;
                this.isPhasing = false;
                this.setAlpha(0.9);
                this.setTexture('enemy_ghost');
            }

            // Track kick time for floating enemies
            this.kickedTime = (this.kickedTime || 0) + 16;

            // Spin when kicked - cap rotation to prevent infinite spinning
            if (this.body && this.body.velocity) {
                const spinDirection = Math.sign(this.body.velocity.x || 1);
                this.rotation += 0.2 * spinDirection;
                // Cap rotation to prevent crazy spinning
                if (Math.abs(this.rotation) > Math.PI * 4) {
                    this.rotation = Math.PI * 4 * spinDirection;
                }

                // Reset kicked state when velocity slows down and on ground
                // OR for floating enemies (Ghost, Clinger, Swarm) after a timeout
                const speed = Math.abs(this.body.velocity.x) + Math.abs(this.body.velocity.y);
                const isFloater = this.enemyType === 'GHOST' || this.enemyType === 'CLINGER' || this.enemyType === 'SWARM';
                const shouldRecover = (speed < 50 && this.body.blocked.down) ||
                                     (isFloater && speed < 80 && this.kickedTime > 500);

                if (shouldRecover) {
                    this.isKicked = false;
                    this.rotation = 0;
                    this.kickedTime = 0;
                    // Restore CLINGER floating gravity
                    if (this.enemyType === 'CLINGER') {
                        this.setGravityY(-150);
                    }
                }
            } else {
                // Body not available - just increment kicked time and recover after timeout
                this.rotation += 0.2;
                if (Math.abs(this.rotation) > Math.PI * 4) {
                    this.rotation = Math.PI * 4;
                }
                if (this.kickedTime > 800) {
                    this.isKicked = false;
                    this.rotation = 0;
                    this.kickedTime = 0;
                }
            }
        }

        // Exploder countdown
        if (this.enemyType === 'EXPLODER' && !this.isExploding) {
            this.updateFuse(delta);
        }
    }

    updateAnimation() {
        // Simple animations per enemy type
        switch (this.enemyType) {
            case 'RUSHER':
                // Aggressive bobbing
                this.setScale(1 + Math.sin(this.animTime * 3) * 0.1, 1 - Math.sin(this.animTime * 3) * 0.1);
                this.rotation = Math.sin(this.animTime * 4) * 0.1;
                break;

            case 'CLINGER':
                // Pulsing effect
                const pulse = 1 + Math.sin(this.animTime * 2) * 0.15;
                this.setScale(pulse, pulse);
                break;

            case 'EXPLODER':
                // Shake more as fuse runs out
                const shakeIntensity = 1 - (this.fuseTimer / this.config.FUSE_TIME);
                this.x += Math.sin(this.animTime * 10) * shakeIntensity * 3;
                break;

            case 'HEAVY':
                // Slow, heavy movement with ground pound feel
                this.setScale(1, 1 + Math.abs(Math.sin(this.animTime * 0.5)) * 0.08);
                break;

            case 'BOUNCER':
                // Squash when on ground, stretch when in air
                if (this.body && this.body.blocked.down) {
                    this.setScale(1.2, 0.8);
                } else {
                    this.setScale(0.8, 1.2);
                }
                break;

            case 'GHOST':
                // Ethereal floating - only if not kicked
                if (!this.isKicked) {
                    this.y += Math.sin(this.animTime) * 0.5;
                }
                this.setAlpha(this.isPhasing ? 0.3 + Math.sin(this.animTime * 2) * 0.1 : 0.8 + Math.sin(this.animTime) * 0.1);
                break;

            case 'SPITTER':
                // Idle breathing with cheek puff
                const breathe = Math.sin(this.animTime);
                this.setScale(1 + breathe * 0.08, 1 - breathe * 0.05);
                break;

            case 'SPLITTER':
            case 'SPLITTER_MINI':
                // Wobbly jelly movement
                this.rotation = Math.sin(this.animTime * 3) * 0.15;
                const wobble = Math.sin(this.animTime * 4);
                this.setScale(1 + wobble * 0.05, 1 - wobble * 0.05);
                break;

            case 'CHARGER':
                // Lean forward when charging
                if (this.isCharging) {
                    this.rotation = this.chargeDirection * 0.3;
                    this.setScale(1.3, 0.8);
                } else {
                    this.rotation = Math.sin(this.animTime * 2) * 0.05;
                    this.setScale(1, 1);
                }
                break;

            case 'BOMBER':
                // Subtle bobbing with occasional arm raise
                this.setScale(1 + Math.sin(this.animTime * 2) * 0.05, 1);
                break;

            case 'SHIELD':
                // Sturdy stance with slight sway
                this.setScale(1 + Math.abs(Math.sin(this.animTime * 0.5)) * 0.05, 1);
                break;

            case 'TELEPORTER':
                // Glitchy flickering
                this.setAlpha(0.7 + Math.sin(this.animTime * 8) * 0.3);
                this.x += Math.sin(this.animTime * 10) * 0.5;
                break;

            case 'MIMIC':
                // Morphing blob effect
                this.setScale(1 + Math.sin(this.animTime * 2) * 0.1, 1 - Math.sin(this.animTime * 2) * 0.1);
                break;

            case 'MAGNET':
                // Pulsing magnetic field
                this.setScale(1 + Math.sin(this.animTime * 3) * 0.05, 1);
                break;

            case 'FREEZER':
                // Cold shimmer
                this.setAlpha(0.85 + Math.sin(this.animTime * 4) * 0.15);
                break;

            case 'SPINNER':
                // Constant spinning
                this.rotation += 0.3;
                break;

            case 'VAMPIRE':
                // Wing flap
                this.setScale(1 + Math.sin(this.animTime * 6) * 0.1, 1);
                break;

            case 'SUMMONER':
                // Mystical hovering
                this.y += Math.sin(this.animTime * 2) * 0.5;
                this.setScale(1, 1 + Math.sin(this.animTime) * 0.03);
                break;

            case 'NINJA':
                // Quick, twitchy movements
                if (!this.isDashing) {
                    this.setScale(1, 1);
                } else {
                    this.setScale(1.3, 0.7);
                }
                break;

            case 'TANK':
                // Heavy rumble
                this.y += Math.sin(this.animTime * 8) * 0.3;
                break;

            case 'LEAPER':
                // Crouch before leap
                if (this.body && this.body.blocked.down) {
                    this.setScale(1.1, 0.9);
                } else {
                    this.setScale(0.9, 1.1);
                }
                break;

            case 'SWARM':
                // Erratic flight
                this.y += Math.sin(this.animTime * 10 + this.swarmOffset) * 1;
                this.x += Math.cos(this.animTime * 8 + this.swarmOffset) * 0.5;
                break;

            case 'LASER':
                // Eye tracking with pulse when charging
                if (this.isCharging) {
                    this.setTint(0xff0000);
                    this.setScale(1.1, 1.1);
                } else {
                    this.setTint(0x444466);
                    this.setScale(1 + Math.sin(this.animTime * 2) * 0.05, 1);
                }
                break;

            case 'REFLECTOR':
                // Shimmering reflection
                this.setAlpha(0.8 + Math.sin(this.animTime * 5) * 0.2);
                break;

            case 'BERSERKER':
                // Rage shake when enraged
                if (this.isEnraged) {
                    this.x += Math.sin(this.animTime * 15) * 1;
                    this.setTint(0xff0000);
                } else {
                    this.setScale(1 + Math.sin(this.animTime * 2) * 0.05, 1);
                }
                break;

            case 'CRAWLER':
                // Crawling motion
                this.setScale(1 + Math.sin(this.animTime * 4) * 0.05, 1);
                break;

            // 14 New enemy animations
            case 'SHADOW':
                // Fade in and out
                if (this.isInvisible) {
                    this.setAlpha(0.1 + Math.sin(this.animTime * 3) * 0.05);
                } else {
                    this.setAlpha(0.6 + Math.sin(this.animTime * 2) * 0.2);
                }
                break;

            case 'GRAVITY':
                // Heavy pulsing
                this.setScale(1 + Math.sin(this.animTime * 1.5) * 0.08, 1);
                this.rotation = Math.sin(this.animTime * 0.5) * 0.05;
                break;

            case 'SPLASHER':
                // Liquid wobble
                const splashWobble = Math.sin(this.animTime * 5);
                this.setScale(1 + splashWobble * 0.1, 1 - splashWobble * 0.1);
                break;

            case 'ANCHOR':
                // Heavy minimal movement
                this.y += Math.sin(this.animTime * 2) * 0.2;
                break;

            case 'PORTAL':
                // Swirling effect
                this.rotation += 0.05;
                this.setScale(1 + Math.sin(this.animTime * 3) * 0.1, 1);
                break;

            case 'ELECTRO':
                // Electric flicker
                this.setAlpha(0.7 + Math.random() * 0.3);
                this.x += Math.sin(this.animTime * 15) * 0.5;
                break;

            case 'BLOB':
                // Goopy wobble
                const blobWobble = Math.sin(this.animTime * 2);
                this.setScale(1 + blobWobble * 0.15, 1 - blobWobble * 0.1);
                break;

            case 'HOMING':
                // Tracking idle
                this.rotation = Math.sin(this.animTime * 4) * 0.1;
                this.setScale(1 + Math.sin(this.animTime * 3) * 0.05, 1);
                break;

            case 'PHASER':
                // Phase shimmer
                if (this.isPhased) {
                    this.setAlpha(0.2 + Math.sin(this.animTime * 8) * 0.1);
                } else {
                    this.setAlpha(0.9);
                    this.setScale(1 + Math.sin(this.animTime * 3) * 0.05, 1);
                }
                break;

            case 'PUSHER':
                // Ready to charge stance
                this.setScale(1 + Math.abs(Math.sin(this.animTime * 2)) * 0.1, 1);
                break;

            case 'DRAINER':
                // Vampiric pulse
                this.setScale(1 + Math.sin(this.animTime * 2) * 0.08, 1);
                this.setAlpha(0.8 + Math.sin(this.animTime * 3) * 0.2);
                break;

            case 'CLONER':
                // Mitosis wobble
                const cloneWobble = Math.sin(this.animTime * 4);
                this.setScale(1 + cloneWobble * 0.08, 1 - cloneWobble * 0.08);
                break;

            case 'SHIELDER':
                // Shield pulse
                if (this.shieldActive) {
                    this.setScale(1.1 + Math.sin(this.animTime * 2) * 0.05, 1.1);
                } else {
                    this.setScale(1, 1);
                }
                break;

            case 'BOOMER':
                // Pre-explosion tension
                if (this.isBooming) {
                    this.x += Math.sin(this.animTime * 20) * 2;
                    this.setTint(0xff0000);
                } else {
                    this.setScale(1 + Math.sin(this.animTime * 2) * 0.05, 1);
                }
                break;
        }
    }

    checkElevatorBounds() {
        const elevator = this.scene.elevator;
        if (!elevator) return;

        const leftBound = elevator.leftWall.x + ELEVATOR_CONFIG.WALL_THICKNESS / 2;
        const rightBound = elevator.rightWall.x - ELEVATOR_CONFIG.WALL_THICKNESS / 2;
        const bottomBound = elevator.floor.y - ELEVATOR_CONFIG.FLOOR_HEIGHT / 2;

        // Check if enemy is inside elevator
        const wasInside = this.isInsideElevator;
        this.isInsideElevator = (
            this.x > leftBound &&
            this.x < rightBound &&
            this.y < bottomBound + 20
        );

        // Track first entry
        if (this.isInsideElevator && !this.hasEnteredElevator) {
            this.hasEnteredElevator = true;
        }
    }

    checkEjected() {
        const elevator = this.scene.elevator;
        if (!elevator) return;

        const leftBound = elevator.leftWall.x;
        const rightBound = elevator.rightWall.x;

        // Check if ejected through door
        if (this.hasEnteredElevator && !this.isInsideElevator) {
            // Ejected!
            if (this.x < leftBound || this.x > rightBound || this.y > GAME_HEIGHT) {
                this.onEjected();
            }
        }

        // Also check if fallen off screen
        if (this.y > GAME_HEIGHT + 50 || this.x < -50 || this.x > GAME_WIDTH + 50) {
            this.onEjected();
        }
    }

    onEjected() {
        if (!this.active || !this.scene) return;

        // Store position before any operations
        const ejectX = this.x;
        const ejectY = this.y;

        if (this.scene.soundManager) {
            this.scene.soundManager.playSound('enemyEject');
        }

        // Award score
        if (this.scene.scoreManager) {
            this.scene.scoreManager.addKickScore(this);
        }

        // Track encountered monster for dictionary unlock
        if (window.gameState && window.gameState.shop) {
            if (!window.gameState.shop.encounteredMonsters) {
                window.gameState.shop.encounteredMonsters = [];
            }
            if (!window.gameState.shop.encounteredMonsters.includes(this.enemyType)) {
                window.gameState.shop.encounteredMonsters.push(this.enemyType);
                // Save to localStorage
                try {
                    localStorage.setItem('pixelPanicShop', JSON.stringify(window.gameState.shop));
                } catch (e) {}
            }
        }

        // Create score popup
        this.createScorePopup(ejectX, ejectY);

        this.destroy();
    }

    createScorePopup(x, y) {
        const score = this.config.SCORE;
        const popup = this.scene.add.text(x, y, `+${score}`, {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(200);

        this.scene.tweens.add({
            targets: popup,
            y: y - 30,
            alpha: 0,
            scale: 1.5,
            duration: 600,
            ease: 'Power2',
            onComplete: () => { if (popup.active) popup.destroy(); }
        });
    }

    behaviorUpdate() {
        const player = this.scene.player;
        if (!player || !player.active) return;

        switch (this.enemyType) {
            case 'RUSHER':
                this.rusherBehavior(player);
                break;
            case 'CLINGER':
                this.clingerBehavior(player);
                break;
            case 'EXPLODER':
                this.exploderBehavior(player);
                break;
            case 'HEAVY':
                this.heavyBehavior(player);
                break;
            case 'SPITTER':
                this.spitterBehavior(player);
                break;
            case 'BOUNCER':
                this.bouncerBehavior(player);
                break;
            case 'SPLITTER':
            case 'SPLITTER_MINI':
                this.splitterBehavior(player);
                break;
            case 'GHOST':
                this.ghostBehavior(player);
                break;
            case 'CHARGER':
                this.chargerBehavior(player);
                break;
            case 'BOMBER':
                this.bomberBehavior(player);
                break;
            case 'SHIELD':
                this.shieldBehavior(player);
                break;
            case 'TELEPORTER':
                this.teleporterBehavior(player);
                break;
            case 'MIMIC':
                this.mimicBehavior(player);
                break;
            case 'MAGNET':
                this.magnetBehavior(player);
                break;
            case 'FREEZER':
                this.freezerBehavior(player);
                break;
            case 'SPINNER':
                this.spinnerBehavior(player);
                break;
            case 'VAMPIRE':
                this.vampireBehavior(player);
                break;
            case 'SUMMONER':
                this.summonerBehavior(player);
                break;
            case 'NINJA':
                this.ninjaBehavior(player);
                break;
            case 'TANK':
                this.tankBehavior(player);
                break;
            case 'LEAPER':
                this.leaperBehavior(player);
                break;
            case 'SWARM':
                this.swarmBehavior(player);
                break;
            case 'LASER':
                this.laserBehavior(player);
                break;
            case 'REFLECTOR':
                this.reflectorBehavior(player);
                break;
            case 'BERSERKER':
                this.berserkerBehavior(player);
                break;
            case 'CRAWLER':
                this.crawlerBehavior(player);
                break;

            // 14 New enemy behaviors
            case 'SHADOW':
                this.shadowBehavior(player);
                break;
            case 'GRAVITY':
                this.gravityBehavior(player);
                break;
            case 'SPLASHER':
                this.splasherBehavior(player);
                break;
            case 'ANCHOR':
                this.anchorBehavior(player);
                break;
            case 'PORTAL':
                this.portalBehavior(player);
                break;
            case 'ELECTRO':
                this.electroBehavior(player);
                break;
            case 'BLOB':
                this.blobBehavior(player);
                break;
            case 'HOMING':
                this.homingBehavior(player);
                break;
            case 'PHASER':
                this.phaserBehavior(player);
                break;
            case 'PUSHER':
                this.pusherBehavior(player);
                break;
            case 'DRAINER':
                this.drainerBehavior(player);
                break;
            case 'CLONER':
                this.clonerBehavior(player);
                break;
            case 'SHIELDER':
                this.shielderBehavior(player);
                break;
            case 'BOOMER':
                this.boomerBehavior(player);
                break;

            // ========== 10 NEW ENEMY BEHAVIORS ==========
            case 'WRAITH':
                this.wraithBehavior(player);
                break;
            case 'SCORPION':
                this.scorpionBehavior(player);
                break;
            case 'PRISM':
                this.prismBehavior(player);
                break;
            case 'INFERNO':
                this.infernoBehavior(player);
                break;
            case 'GOLEM':
                this.golemBehavior(player);
                break;
            case 'JESTER':
                this.jesterBehavior(player);
                break;
            case 'HYDRA':
                this.hydraBehavior(player);
                break;
            case 'MIRAGE_NEW':
                this.mirageNewBehavior(player);
                break;
            case 'TITAN':
                this.titanBehavior(player);
                break;
            case 'SPARK':
                this.sparkBehavior(player);
                break;

            // ========== 50 MORE ENEMY BEHAVIORS ==========
            case 'VIPER':
            case 'CYCLOPS':
            case 'WASP':
            case 'MUMMY':
            case 'DJINN':
            case 'GARGOYLE':
            case 'BASILISK':
            case 'BANSHEE':
            case 'PHOENIX':
            case 'LICH':
            case 'WENDIGO':
            case 'CERBERUS':
            case 'WYVERN':
            case 'MINOTAUR':
            case 'SPECTER':
            case 'CHIMERA':
            case 'REAPER':
            case 'OGRE':
            case 'HARPY':
            case 'TROLL':
            case 'KRAKEN':
            case 'DEMON':
            case 'ELEMENTAL':
            case 'WYRM':
            case 'SHADE':
            case 'FUNGOID':
            case 'SENTINEL':
            case 'SLIME_KING':
            case 'BEETLE':
            case 'WRECKER':
            case 'ORACLE':
            case 'GOLIATH':
            case 'ASSASSIN':
            case 'PLAGUE':
            case 'PHANTOM':
            case 'BRUTE':
            case 'SIREN':
            case 'COLOSSUS':
            case 'REVENANT':
            case 'GOLEM_FIRE':
            case 'GOLEM_ICE':
            case 'VAMPIRE_LORD':
            case 'NECROMANCER':
            case 'SKELETON_KING':
            case 'DRAGON':
            case 'ARCHDEMON':
            case 'VOID_WALKER':
            case 'COSMIC_HORROR':
            case 'WORLD_EATER':
                this.advancedEnemyBehavior(player);
                break;
        }
    }

    rusherBehavior(player) {
        // Rush directly at player - now more aggressive!
        const direction = player.x > this.x ? 1 : -1;
        this.setVelocityX(direction * this.config.SPEED);
        this.setFlipX(direction < 0);

        // Jump more often if player is above
        if (player.y < this.y - 20 && this.body.blocked.down && Math.random() < 0.04) {
            this.setVelocityY(-280);
        }
    }

    clingerBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;

        // Clingers float and chase the player - they're sticky and persistent
        this.setVelocityX(direction * this.config.SPEED * 0.7);
        this.setFlipX(direction < 0);

        // Jump towards player if they're above
        if (player.y < this.y - 30 && this.body.blocked.down && Math.random() < 0.03) {
            this.setVelocityY(-200);
        }

        // Keep rotation normal
        this.rotation *= 0.9;
    }

    exploderBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setVelocityX(direction * this.config.SPEED);
        this.setFlipX(direction < 0);
    }

    heavyBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setVelocityX(direction * this.config.SPEED);
        this.setFlipX(direction < 0);
    }

    spitterBehavior(player) {
        // Keep distance and spit projectiles
        const dist = Math.abs(player.x - this.x);
        const direction = player.x > this.x ? 1 : -1;

        // Try to maintain distance
        if (dist < 60) {
            this.setVelocityX(-direction * this.config.SPEED);
        } else if (dist > 120) {
            this.setVelocityX(direction * this.config.SPEED * 0.5);
        } else {
            this.setVelocityX(0);
        }

        this.setFlipX(direction < 0);

        // Spit at player
        this.spitCooldown -= 16;
        if (this.spitCooldown <= 0 && dist < 200) {
            this.spitAtPlayer(player);
            this.spitCooldown = this.config.SPIT_COOLDOWN;
        }
    }

    spitAtPlayer(player) {
        // Create spit projectile
        const spit = this.scene.add.sprite(this.x, this.y, 'spit');
        this.scene.physics.add.existing(spit);

        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        spit.body.setVelocity(
            Math.cos(angle) * this.config.SPIT_SPEED,
            Math.sin(angle) * this.config.SPIT_SPEED
        );

        // Spit damages player on contact
        this.scene.physics.add.overlap(spit, player, () => {
            if (player.active && !player.isInvincible) {
                player.takeDamage('SPITTER');
                spit.destroy();
            }
        });

        // Destroy after time
        this.scene.time.delayedCall(2000, () => {
            if (spit.active) spit.destroy();
        });
    }

    bouncerBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setVelocityX(direction * this.config.SPEED);
        this.setFlipX(direction < 0);

        // Constantly bouncing
        if (this.body.blocked.down) {
            this.setVelocityY(-this.config.BOUNCE_FORCE);
        }
    }

    splitterBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setVelocityX(direction * this.config.SPEED);
        this.setFlipX(direction < 0);
    }

    ghostBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;

        // Update phase timer
        this.phaseTimer -= 16;
        if (this.phaseTimer <= 0) {
            this.isPhasing = !this.isPhasing;
            this.phaseTimer = this.config.PHASE_DURATION;

            if (this.isPhasing) {
                this.setTexture('enemy_ghost_phase');
                this.setAlpha(0.4);
                if (this.body) this.body.enable = false;
            } else {
                this.setTexture('enemy_ghost');
                this.setAlpha(0.9);
                if (this.body) this.body.enable = true;
            }
        }

        // Only move if body is enabled
        if (this.body && this.body.enable) {
            this.setVelocityX(direction * this.config.SPEED);

            // Float up and down
            const floatY = Math.sin(this.scene.time.now * 0.003) * 50;
            if (!this.body.blocked.up && !this.body.blocked.down) {
                this.setVelocityY(floatY);
            }
        }

        this.setFlipX(direction < 0);
    }

    chargerBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.facingDirection = direction;
        this.setFlipX(direction < 0);

        // Update charge cooldown
        this.chargeCooldown -= 16;

        if (this.isCharging) {
            // Continue charging
            this.setVelocityX(this.chargeDirection * this.config.CHARGE_SPEED);

            // Stop charging after hitting wall or going too far
            if (this.body.blocked.left || this.body.blocked.right) {
                this.isCharging = false;
                this.chargeCooldown = this.config.CHARGE_COOLDOWN;
                // Stunned briefly
                this.setVelocityX(0);
            }
        } else {
            // Move slowly towards player
            this.setVelocityX(direction * this.config.SPEED);

            // Start charge when cooldown is ready and player is in range
            const dist = Math.abs(player.x - this.x);
            if (this.chargeCooldown <= 0 && dist < 150 && dist > 30) {
                this.isCharging = true;
                this.chargeDirection = direction;
                // Visual warning
                this.setTint(0xffff00);
                this.scene.time.delayedCall(200, () => {
                    if (this.active) this.setTint(0xff8800);
                });
            }
        }
    }

    bomberBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        // Keep some distance from player
        const dist = Math.abs(player.x - this.x);
        if (dist < 50) {
            this.setVelocityX(-direction * this.config.SPEED);
        } else if (dist > 100) {
            this.setVelocityX(direction * this.config.SPEED * 0.5);
        } else {
            this.setVelocityX(0);
        }

        // Drop bombs periodically
        this.bombCooldown -= 16;
        if (this.bombCooldown <= 0) {
            this.dropBomb();
            this.bombCooldown = this.config.BOMB_COOLDOWN;
        }
    }

    dropBomb() {
        if (!this.scene || !this.active) return;

        // Create bomb
        const bomb = this.scene.add.circle(this.x, this.y + 10, 6, 0x333333);
        this.scene.physics.add.existing(bomb);
        bomb.body.setBounce(0.3);
        bomb.body.setGravityY(300);

        // Bomb blinks faster as fuse runs out
        let blinkRate = 500;
        const blinkEvent = this.scene.time.addEvent({
            delay: blinkRate,
            callback: () => {
                if (bomb.active) {
                    bomb.setFillStyle(bomb.fillColor === 0x333333 ? 0xff0000 : 0x333333);
                    blinkRate = Math.max(100, blinkRate - 100);
                    blinkEvent.delay = blinkRate;
                }
            },
            loop: true
        });

        // Explode after fuse time
        this.scene.time.delayedCall(this.config.BOMB_FUSE, () => {
            if (!bomb.active) return;
            blinkEvent.destroy();

            // Explosion effect
            const explosionRadius = 60;
            const explosion = this.scene.add.circle(bomb.x, bomb.y, explosionRadius, 0xff4400, 0.5);
            this.scene.tweens.add({
                targets: explosion,
                alpha: 0,
                scale: 1.5,
                duration: 200,
                onComplete: () => explosion.destroy()
            });

            // Damage player
            const player = this.scene.player;
            if (player && player.active) {
                const dist = Phaser.Math.Distance.Between(bomb.x, bomb.y, player.x, player.y);
                if (dist < explosionRadius) {
                    player.takeDamage('BOMBER');
                }
            }

            bomb.destroy();
        });
    }

    shieldBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.facingDirection = direction;
        this.setFlipX(direction < 0);

        // Move towards player
        this.setVelocityX(direction * this.config.SPEED);

        // Shield is always facing player
        this.isBlocking = true;
    }

    teleporterBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED);

        // Teleport randomly
        this.teleportCooldown -= 16;
        if (this.teleportCooldown <= 0) {
            this.teleport();
            this.teleportCooldown = this.config.TELEPORT_COOLDOWN;
        }
    }

    teleport() {
        if (!this.scene || !this.active) return;

        // Visual effect at old position
        for (let i = 0; i < 8; i++) {
            const p = this.scene.add.circle(this.x, this.y, 3, 0x9944ff, 0.8);
            this.scene.tweens.add({
                targets: p,
                x: this.x + Phaser.Math.Between(-30, 30),
                y: this.y + Phaser.Math.Between(-30, 30),
                alpha: 0,
                duration: 300,
                onComplete: () => { if (p.active) p.destroy(); }
            });
        }

        // Teleport to new position within elevator
        const elevator = this.scene.elevator;
        if (elevator) {
            const bounds = elevator.getElevatorBounds();
            this.x = Phaser.Math.Between(bounds.left + 20, bounds.right - 20);
            this.y = Phaser.Math.Between(bounds.top + 40, bounds.bottom - 20);
        }
    }

    mimicBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        // Mimic moves like player - chases aggressively
        this.setVelocityX(direction * this.config.SPEED);

        // Jump when player jumps (approximate)
        if (this.body && this.body.blocked.down && Math.random() < 0.02) {
            this.setVelocityY(-250);
        }
    }

    magnetBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED);

        // Pull player towards magnet
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist < this.config.PULL_RANGE && player.body) {
            const pullDirection = this.x > player.x ? 1 : -1;
            player.body.velocity.x += pullDirection * this.config.PULL_FORCE * 0.1;
        }
    }

    freezerBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED);

        // Freeze player on contact (handled in collision)
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist < this.config.FREEZE_RANGE && !player.isFrozen) {
            this.freezePlayer(player);
        }
    }

    freezePlayer(player) {
        if (!player || player.isFrozen || player.isInvincible) return;

        player.isFrozen = true;
        player.setTint(0x66ccff);
        player.body.velocity.x *= 0.2;

        // Freeze effect
        for (let i = 0; i < 6; i++) {
            const ice = this.scene.add.rectangle(
                player.x + Phaser.Math.Between(-10, 10),
                player.y + Phaser.Math.Between(-10, 10),
                4, 4, 0xaaeeff, 0.8
            );
            this.scene.tweens.add({
                targets: ice,
                y: ice.y - 20,
                alpha: 0,
                duration: 500,
                onComplete: () => { if (ice.active) ice.destroy(); }
            });
        }

        this.scene.time.delayedCall(this.config.FREEZE_DURATION, () => {
            if (player && player.active) {
                player.isFrozen = false;
                player.clearTint();
            }
        });
    }

    spinnerBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setVelocityX(direction * this.config.SPEED);

        // Damage player if close (spinning blades)
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist < this.config.SPIN_DAMAGE_RADIUS && !player.isInvincible) {
            player.takeDamage('SPINNER');
        }
    }

    vampireBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED);

        // Swoop down at player
        if (player.y > this.y + 30 && this.body) {
            this.setVelocityY(100);
        } else if (player.y < this.y - 30 && this.body) {
            this.setVelocityY(-100);
        }
    }

    summonerBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        // Keep distance from player
        const dist = Math.abs(player.x - this.x);
        if (dist < 80) {
            this.setVelocityX(-direction * this.config.SPEED);
        } else if (dist > 150) {
            this.setVelocityX(direction * this.config.SPEED * 0.5);
        } else {
            this.setVelocityX(0);
        }

        // Summon minions
        this.summonCooldown -= 16;
        if (this.summonCooldown <= 0) {
            this.summonMinion();
            this.summonCooldown = this.config.SUMMON_COOLDOWN;
        }
    }

    summonMinion() {
        if (!this.scene || !this.active) return;

        // Summon effect
        const summonX = this.x + Phaser.Math.Between(-30, 30);
        const summonY = this.y;

        // Magic circle effect
        const circle = this.scene.add.circle(summonX, summonY, 15, 0x00ff00, 0.5);
        this.scene.tweens.add({
            targets: circle,
            scale: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => { if (circle.active) circle.destroy(); }
        });

        // Spawn a weak enemy (SWARM)
        this.scene.time.delayedCall(300, () => {
            if (this.scene && this.active) {
                const minion = new Enemy(this.scene, summonX, summonY, 'SWARM');
                if (this.scene.enemies) {
                    this.scene.enemies.add(minion);
                }
                minion.hasEnteredElevator = true;
            }
        });
    }

    ninjaBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        this.dashCooldown -= 16;

        if (this.isDashing) {
            // Continue dash
            return;
        }

        // Normal movement
        this.setVelocityX(direction * this.config.SPEED);

        // Dash attack
        const dist = Math.abs(player.x - this.x);
        if (this.dashCooldown <= 0 && dist < 100 && dist > 30) {
            this.isDashing = true;
            this.setVelocityX(direction * 400);

            this.scene.time.delayedCall(200, () => {
                this.isDashing = false;
                this.dashCooldown = this.config.DASH_COOLDOWN;
            });
        }
    }

    tankBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        // Very slow but unstoppable
        this.setVelocityX(direction * this.config.SPEED);
    }

    leaperBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        this.leapCooldown -= 16;

        // Move slowly on ground
        if (this.body && this.body.blocked.down) {
            this.setVelocityX(direction * this.config.SPEED * 0.3);

            // Leap at player
            if (this.leapCooldown <= 0) {
                this.setVelocityY(-this.config.LEAP_FORCE);
                this.setVelocityX(direction * 200);
                this.leapCooldown = this.config.LEAP_COOLDOWN;
            }
        }
    }

    swarmBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;

        // Erratic movement towards player
        this.setVelocityX(direction * this.config.SPEED + Math.sin(this.animTime * 5) * 50);

        // Float towards player's height
        if (player.y < this.y - 10) {
            this.setVelocityY(-80);
        } else if (player.y > this.y + 10) {
            this.setVelocityY(80);
        }
    }

    laserBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        // Keep distance
        const dist = Math.abs(player.x - this.x);
        if (dist < 60) {
            this.setVelocityX(-direction * this.config.SPEED);
        } else if (dist > 120) {
            this.setVelocityX(direction * this.config.SPEED * 0.5);
        } else {
            this.setVelocityX(0);
        }

        // Fire laser
        this.laserCooldown -= 16;
        if (this.laserCooldown <= 0 && !this.isCharging) {
            this.chargeLaser(player);
        }
    }

    chargeLaser(player) {
        this.isCharging = true;

        // Charge warning
        this.scene.time.delayedCall(500, () => {
            if (!this.active || !this.scene) return;

            // Fire laser
            const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
            const laserLength = 200;

            const laser = this.scene.add.rectangle(
                this.x + Math.cos(angle) * laserLength / 2,
                this.y + Math.sin(angle) * laserLength / 2,
                laserLength, 4, 0xff0000, 0.8
            );
            laser.setRotation(angle);
            laser.setDepth(100);

            // Check if player is hit
            const playerDist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (playerDist < laserLength && !player.isInvincible) {
                // Check angle tolerance
                const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
                if (Math.abs(angle - angleToPlayer) < 0.3) {
                    player.takeDamage('LASER');
                }
            }

            // Fade laser
            this.scene.tweens.add({
                targets: laser,
                alpha: 0,
                duration: 200,
                onComplete: () => { if (laser.active) laser.destroy(); }
            });

            this.isCharging = false;
            this.laserCooldown = this.config.LASER_COOLDOWN;
        });
    }

    reflectorBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED);
    }

    berserkerBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        // Check for rage
        if (this.health <= this.config.RAGE_THRESHOLD && !this.isEnraged) {
            this.isEnraged = true;
            // Increase speed when enraged
            this.config.SPEED = this.originalSpeed * 2;
        }

        const speed = this.isEnraged ? this.config.SPEED * 1.5 : this.config.SPEED;
        this.setVelocityX(direction * speed);

        // Jump more when enraged
        if (this.isEnraged && this.body && this.body.blocked.down && Math.random() < 0.05) {
            this.setVelocityY(-300);
        }
    }

    crawlerBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        // Crawl along floor or ceiling
        this.setVelocityX(direction * this.config.SPEED);

        // Can climb walls and ceiling
        if (this.body) {
            if (this.body.blocked.left || this.body.blocked.right) {
                this.setVelocityY(-100);
            }
            if (this.body.blocked.up) {
                this.onCeiling = true;
                this.setGravityY(-300);
                this.setFlipY(true);
            } else if (this.body.blocked.down) {
                this.onCeiling = false;
                this.setGravityY(0);
                this.setFlipY(false);
            }
        }
    }

    // 14 New enemy behavior methods - Each with unique special attack!

    // SHADOW - Becomes invisible and does a surprise dash attack
    shadowBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        // Toggle visibility
        this.invisibleTimer -= 16;
        if (this.invisibleTimer <= 0) {
            this.isInvisible = !this.isInvisible;
            this.invisibleTimer = this.config.INVISIBLE_DURATION;

            if (this.isInvisible) {
                // Fade out effect
                this.setTexture('enemy_shadow_fade');
                for (let i = 0; i < 6; i++) {
                    const smoke = this.scene.add.circle(
                        this.x + Phaser.Math.Between(-10, 10),
                        this.y + Phaser.Math.Between(-10, 10),
                        Phaser.Math.Between(3, 6), 0x222244, 0.6
                    );
                    this.scene.tweens.add({
                        targets: smoke,
                        alpha: 0, scale: 2,
                        duration: 400,
                        onComplete: () => { if (smoke.active) smoke.destroy(); }
                    });
                }
            } else {
                // SURPRISE ATTACK when becoming visible!
                this.setTexture('enemy_shadow');
                const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
                if (dist < 80) {
                    // Dash towards player
                    this.setVelocityX(direction * 350);
                    this.setVelocityY(-100);
                    // Shadow slash effect
                    const slash = this.scene.add.rectangle(this.x + direction * 20, this.y, 40, 8, 0xff00ff, 0.8);
                    slash.setRotation(direction > 0 ? -0.3 : 0.3);
                    this.scene.tweens.add({
                        targets: slash,
                        x: slash.x + direction * 40, alpha: 0, scaleX: 2,
                        duration: 200,
                        onComplete: () => { if (slash.active) slash.destroy(); }
                    });
                }
            }
        }

        // Move faster when invisible
        const speed = this.isInvisible ? this.config.SPEED * 1.8 : this.config.SPEED * 0.5;
        this.setVelocityX(direction * speed);
    }

    // GRAVITY - Creates gravity wells that suck player in and damage them
    gravityBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED);

        // Create gravity well attack
        if (!this.gravityWellCooldown) this.gravityWellCooldown = 3000;
        this.gravityWellCooldown -= 16;

        if (this.gravityWellCooldown <= 0) {
            this.createGravityWell(player);
            this.gravityWellCooldown = 3000;
        }

        // Constant pull towards this enemy
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist < this.config.PULL_RADIUS && player.body) {
            const pullX = (this.x - player.x) / dist * this.config.GRAVITY_FORCE * 0.08;
            const pullY = (this.y - player.y) / dist * this.config.GRAVITY_FORCE * 0.05;
            player.body.velocity.x += pullX;
            player.body.velocity.y += pullY;

            // Gravity particles towards enemy
            if (Math.random() < 0.1) {
                const p = this.scene.add.circle(player.x, player.y, 2, 0xaa66ff, 0.8);
                this.scene.tweens.add({
                    targets: p,
                    x: this.x, y: this.y, alpha: 0,
                    duration: 300,
                    onComplete: () => { if (p.active) p.destroy(); }
                });
            }
        }
    }

    createGravityWell(player) {
        // Create a gravity well at current position
        const wellX = this.x;
        const wellY = this.y;
        const well = this.scene.add.circle(wellX, wellY, 5, 0x6622aa, 0.8);
        well.setDepth(98);

        // Expand the well
        this.scene.tweens.add({
            targets: well,
            scale: 8,
            duration: 500,
            onComplete: () => {
                // Well is active for 2 seconds
                let wellTime = 0;
                const wellTimer = this.scene.time.addEvent({
                    delay: 16,
                    callback: () => {
                        wellTime += 16;
                        if (!well.active) { wellTimer.destroy(); return; }

                        // Pull player towards well
                        const dist = Phaser.Math.Distance.Between(wellX, wellY, player.x, player.y);
                        if (dist < 70 && dist > 5 && player.body) {
                            const pullX = (wellX - player.x) / dist * 8;
                            const pullY = (wellY - player.y) / dist * 6;
                            player.body.velocity.x += pullX;
                            player.body.velocity.y += pullY;
                        }
                        // Damage if too close
                        if (dist < 20 && !player.isInvincible) {
                            player.takeDamage('GRAVITY');
                            wellTimer.destroy();
                            well.destroy();
                        }

                        if (wellTime > 2000) {
                            wellTimer.destroy();
                            this.scene.tweens.add({
                                targets: well,
                                scale: 0, alpha: 0,
                                duration: 300,
                                onComplete: () => { if (well.active) well.destroy(); }
                            });
                        }
                    },
                    loop: true
                });
            }
        });
    }

    // SPLASHER - Jumps and creates damaging water splashes on landing
    splasherBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED);

        // Track if was in air
        if (!this.wasInAir) this.wasInAir = false;
        const isGrounded = this.body && this.body.blocked.down;

        // Landing creates splash attack!
        if (isGrounded && this.wasInAir) {
            this.createSplashAttack(player);
        }

        this.wasInAir = !isGrounded;

        // Jump towards player frequently
        if (isGrounded && Math.random() < 0.03) {
            this.setVelocityY(-250);
            this.setVelocityX(direction * 150);
        }
    }

    createSplashAttack(player) {
        // Create splash waves on landing
        const splashRadius = this.config.SPLASH_RADIUS;

        // Visual splash effect
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const drop = this.scene.add.circle(this.x, this.y + 5, 4, 0x3399ee, 0.8);
            this.scene.tweens.add({
                targets: drop,
                x: this.x + Math.cos(angle) * splashRadius,
                y: this.y + 5 + Math.sin(angle) * 20,
                alpha: 0, scale: 0.5,
                duration: 400,
                onComplete: () => { if (drop.active) drop.destroy(); }
            });
        }

        // Splash wave ring
        const wave = this.scene.add.circle(this.x, this.y + 8, 10, 0x66ccff, 0.5);
        this.scene.tweens.add({
            targets: wave,
            scaleX: 5, scaleY: 1, alpha: 0,
            duration: 300,
            onComplete: () => { if (wave.active) wave.destroy(); }
        });

        // Damage player if in splash range
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist < splashRadius && !player.isInvincible) {
            player.takeDamage('SPLASHER');
            // Knock player back
            const knockDir = player.x > this.x ? 1 : -1;
            player.setVelocityX(knockDir * 200);
        }
    }

    // ANCHOR - Creates heavy chains that slow and pull the player
    anchorBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED);

        // Chain attack cooldown
        if (!this.chainCooldown) this.chainCooldown = 2500;
        this.chainCooldown -= 16;

        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        // Throw chain to grab player
        if (this.chainCooldown <= 0 && dist < 100 && dist > 20) {
            this.throwChain(player);
            this.chainCooldown = 2500;
        }

        // Slow player down when near anchor
        if (dist < 60 && player.body) {
            player.body.velocity.x *= 0.92;
            player.body.velocity.y *= 0.95;
            // Weight visual
            if (Math.random() < 0.05) {
                const weight = this.scene.add.rectangle(player.x, player.y + 15, 8, 4, 0x555555, 0.5);
                this.scene.tweens.add({
                    targets: weight,
                    y: weight.y + 20, alpha: 0,
                    duration: 300,
                    onComplete: () => { if (weight.active) weight.destroy(); }
                });
            }
        }
    }

    throwChain(player) {
        // Chain visual
        const chain = this.scene.add.line(0, 0, this.x, this.y, player.x, player.y, 0x888888, 1);
        chain.setLineWidth(3);
        chain.setDepth(99);

        // Pull player towards anchor
        if (player.body) {
            const pullDir = this.x > player.x ? 1 : -1;
            player.body.velocity.x = pullDir * 150;
            player.body.velocity.y = -50;
        }

        // Chain particles
        for (let i = 0; i < 5; i++) {
            const link = this.scene.add.rectangle(
                Phaser.Math.Linear(this.x, player.x, i / 5),
                Phaser.Math.Linear(this.y, player.y, i / 5),
                6, 6, 0x666666, 0.8
            );
            this.scene.tweens.add({
                targets: link,
                alpha: 0, rotation: Math.PI,
                duration: 400,
                delay: i * 50,
                onComplete: () => { if (link.active) link.destroy(); }
            });
        }

        this.scene.tweens.add({
            targets: chain,
            alpha: 0,
            duration: 400,
            onComplete: () => { if (chain.active) chain.destroy(); }
        });
    }

    // PORTAL - Opens rifts that teleport player to dangerous positions
    portalBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED);

        this.portalCooldown -= 16;
        if (this.portalCooldown <= 0) {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (dist < 120 && dist > 30) {
                this.openPortalRift(player);
                this.portalCooldown = this.config.PORTAL_COOLDOWN;
            }
        }
    }

    openPortalRift(player) {
        // Create entry portal at player position
        const entryX = player.x;
        const entryY = player.y;

        // Create exit portal near a wall (dangerous position!)
        const elevator = this.scene.elevator;
        const exitSide = Math.random() < 0.5 ? 'left' : 'right';
        const exitX = exitSide === 'left' ? elevator.leftWall.x + 30 : elevator.rightWall.x - 30;
        const exitY = player.y;

        // Entry portal effect
        const entryPortal = this.scene.add.circle(entryX, entryY, 5, 0xaa44ff, 0.9);
        this.scene.tweens.add({
            targets: entryPortal,
            scale: 4, rotation: Math.PI * 2,
            duration: 400,
            onComplete: () => {
                // Teleport player!
                player.x = exitX;
                player.y = exitY;

                // Exit portal effect
                for (let i = 0; i < 10; i++) {
                    const p = this.scene.add.circle(exitX, exitY, 3, 0xff66ff, 0.8);
                    const angle = (i / 10) * Math.PI * 2;
                    this.scene.tweens.add({
                        targets: p,
                        x: exitX + Math.cos(angle) * 40,
                        y: exitY + Math.sin(angle) * 40,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => { if (p.active) p.destroy(); }
                    });
                }

                this.scene.tweens.add({
                    targets: entryPortal,
                    scale: 0, alpha: 0,
                    duration: 200,
                    onComplete: () => { if (entryPortal.active) entryPortal.destroy(); }
                });
            }
        });
    }

    // ELECTRO - Creates electric arcs that chain between player and enemies
    electroBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED);

        this.shockCooldown -= 16;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (dist < this.config.SHOCK_RANGE && this.shockCooldown <= 0) {
            this.createElectricArc(player);
            this.shockCooldown = this.config.SHOCK_COOLDOWN;
        }

        // Ambient sparks
        if (Math.random() < 0.05) {
            const spark = this.scene.add.rectangle(
                this.x + Phaser.Math.Between(-8, 8),
                this.y + Phaser.Math.Between(-8, 8),
                2, 6, 0xffff00, 0.9
            );
            spark.setRotation(Math.random() * Math.PI);
            this.scene.tweens.add({
                targets: spark,
                alpha: 0, scale: 0,
                duration: 100,
                onComplete: () => { if (spark.active) spark.destroy(); }
            });
        }
    }

    createElectricArc(player) {
        if (player.isInvincible) return;

        // Create lightning bolt to player
        const segments = 5;
        let lastX = this.x;
        let lastY = this.y;

        for (let i = 0; i < segments; i++) {
            const progress = (i + 1) / segments;
            const targetX = Phaser.Math.Linear(this.x, player.x, progress);
            const targetY = Phaser.Math.Linear(this.y, player.y, progress);
            const jitterX = i < segments - 1 ? Phaser.Math.Between(-15, 15) : 0;
            const jitterY = i < segments - 1 ? Phaser.Math.Between(-10, 10) : 0;

            const bolt = this.scene.add.line(0, 0, lastX, lastY, targetX + jitterX, targetY + jitterY, 0xffff00, 1);
            bolt.setLineWidth(3);
            bolt.setDepth(100);

            this.scene.tweens.add({
                targets: bolt,
                alpha: 0,
                duration: 150,
                delay: i * 20,
                onComplete: () => { if (bolt.active) bolt.destroy(); }
            });

            lastX = targetX + jitterX;
            lastY = targetY + jitterY;
        }

        // Shock effect on player
        player.takeDamage('ELECTRO');
        player.setTint(0xffff00);
        this.scene.time.delayedCall(100, () => {
            if (player.active) player.clearTint();
        });
    }

    // BLOB - Leaves slime trails that slow player and splits when killed
    blobBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED);

        // Leave slime trail
        if (!this.slimeTimer) this.slimeTimer = 0;
        this.slimeTimer -= 16;

        if (this.slimeTimer <= 0 && this.body && this.body.blocked.down) {
            this.createSlimePuddle(player);
            this.slimeTimer = 500;
        }
    }

    createSlimePuddle(player) {
        const puddle = this.scene.add.ellipse(this.x, this.y + 10, 20, 6, 0x44cc66, 0.6);
        puddle.setDepth(5);

        // Puddle slows player
        let puddleLife = 3000;
        const puddleTimer = this.scene.time.addEvent({
            delay: 16,
            callback: () => {
                puddleLife -= 16;
                if (!puddle.active) { puddleTimer.destroy(); return; }

                // Check if player is on puddle
                const dist = Phaser.Math.Distance.Between(puddle.x, puddle.y, player.x, player.y + 10);
                if (dist < 15 && player.body) {
                    player.body.velocity.x *= 0.85;
                }

                if (puddleLife <= 0) {
                    puddleTimer.destroy();
                    this.scene.tweens.add({
                        targets: puddle,
                        alpha: 0, scaleX: 0.5,
                        duration: 300,
                        onComplete: () => { if (puddle.active) puddle.destroy(); }
                    });
                }
            },
            loop: true
        });
    }

    // HOMING - Fires heat-seeking missiles that track the player
    homingBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        // Keep distance like a turret
        const dist = Math.abs(player.x - this.x);
        if (dist < 60) {
            this.setVelocityX(-direction * this.config.SPEED);
        } else if (dist > 120) {
            this.setVelocityX(direction * this.config.SPEED * 0.5);
        } else {
            this.setVelocityX(0);
        }

        // Fire homing missiles
        this.missileCooldown -= 16;
        if (this.missileCooldown <= 0) {
            this.fireHomingMissile(player);
            this.missileCooldown = this.config.MISSILE_COOLDOWN;
        }
    }

    fireHomingMissile(player) {
        if (!this.scene || !this.active) return;

        // Launch warning
        const warning = this.scene.add.circle(this.x, this.y - 10, 4, 0xff0000, 0.8);
        this.scene.tweens.add({
            targets: warning,
            scale: 2, alpha: 0,
            duration: 200,
            onComplete: () => { if (warning.active) warning.destroy(); }
        });

        // Create missile sprite
        const missile = this.scene.add.sprite(this.x, this.y - 5, 'homing_missile');
        missile.setDepth(99);
        missile.setScale(1.5);

        // Missile exhaust trail
        let trackTime = 0;
        const trackInterval = this.scene.time.addEvent({
            delay: 16,
            callback: () => {
                if (!missile.active || !player.active || !this.scene) {
                    trackInterval.destroy();
                    if (missile.active) missile.destroy();
                    return;
                }

                trackTime += 16;
                const angle = Phaser.Math.Angle.Between(missile.x, missile.y, player.x, player.y);
                missile.x += Math.cos(angle) * 4;
                missile.y += Math.sin(angle) * 3;
                missile.setRotation(angle);

                // Exhaust trail
                if (trackTime % 50 < 20) {
                    const exhaust = this.scene.add.circle(missile.x - Math.cos(angle) * 5, missile.y - Math.sin(angle) * 5, 2, 0xff6600, 0.7);
                    this.scene.tweens.add({
                        targets: exhaust,
                        alpha: 0, scale: 0.5,
                        duration: 150,
                        onComplete: () => { if (exhaust.active) exhaust.destroy(); }
                    });
                }

                // Check hit
                const dist = Phaser.Math.Distance.Between(missile.x, missile.y, player.x, player.y);
                if (dist < 18 && !player.isInvincible) {
                    // Explosion!
                    for (let i = 0; i < 8; i++) {
                        const exp = this.scene.add.circle(missile.x, missile.y, 3, 0xff4400, 0.9);
                        const expAngle = (i / 8) * Math.PI * 2;
                        this.scene.tweens.add({
                            targets: exp,
                            x: missile.x + Math.cos(expAngle) * 25,
                            y: missile.y + Math.sin(expAngle) * 25,
                            alpha: 0,
                            duration: 200,
                            onComplete: () => { if (exp.active) exp.destroy(); }
                        });
                    }
                    player.takeDamage('HOMING');
                    trackInterval.destroy();
                    missile.destroy();
                    return;
                }

                // Expire after 2.5 seconds
                if (trackTime > 2500) {
                    trackInterval.destroy();
                    // Fizzle out
                    this.scene.tweens.add({
                        targets: missile,
                        alpha: 0, rotation: missile.rotation + 2,
                        duration: 200,
                        onComplete: () => { if (missile.active) missile.destroy(); }
                    });
                }
            },
            loop: true
        });
    }

    // PHASER - Phases through attacks and does surprise phase-strikes
    phaserBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        this.phaseCooldown -= 16;

        if (this.isPhased) {
            // Move faster when phased, towards player
            this.setVelocityX(direction * this.config.SPEED * 2);
            this.setTexture('enemy_phaser_fade');
        } else {
            this.setVelocityX(direction * this.config.SPEED);
            this.setTexture('enemy_phaser');
        }

        // Phase attack pattern
        if (this.phaseCooldown <= 0 && !this.isPhased) {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (dist < 100) {
                // Start phase
                this.isPhased = true;
                if (this.body) this.body.checkCollision.none = true;

                // Glitch effect
                for (let i = 0; i < 6; i++) {
                    const glitch = this.scene.add.rectangle(
                        this.x + Phaser.Math.Between(-15, 15),
                        this.y + Phaser.Math.Between(-15, 15),
                        Phaser.Math.Between(5, 15), 3, 0x88aaff, 0.7
                    );
                    this.scene.tweens.add({
                        targets: glitch,
                        x: glitch.x + Phaser.Math.Between(-20, 20),
                        alpha: 0,
                        duration: 200,
                        onComplete: () => { if (glitch.active) glitch.destroy(); }
                    });
                }

                // End phase and strike!
                this.scene.time.delayedCall(600, () => {
                    if (!this.active) return;
                    this.isPhased = false;
                    if (this.body) this.body.checkCollision.none = false;

                    // Phase strike!
                    const strikeRange = 30;
                    const strikeDist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
                    if (strikeDist < strikeRange && !player.isInvincible) {
                        player.takeDamage('PHASER');
                        // Glitch damage effect
                        this.scene.cameras.main.shake(100, 0.01);
                    }
                });

                this.phaseCooldown = this.config.PHASE_COOLDOWN;
            }
        }
    }

    // PUSHER - Charges and rams player with tremendous knockback
    pusherBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        if (!this.isCharging) this.isCharging = false;
        if (!this.chargeCooldown) this.chargeCooldown = 2000;

        this.chargeCooldown -= 16;

        if (this.isCharging) {
            // Charging at high speed!
            this.setVelocityX(this.chargeDir * 280);

            // Dust trail
            if (Math.random() < 0.3) {
                const dust = this.scene.add.circle(this.x - this.chargeDir * 10, this.y + 5, 3, 0xdd8844, 0.6);
                this.scene.tweens.add({
                    targets: dust,
                    y: dust.y - 10, alpha: 0, scale: 1.5,
                    duration: 200,
                    onComplete: () => { if (dust.active) dust.destroy(); }
                });
            }

            // Hit wall = stop charge
            if ((this.body.blocked.left && this.chargeDir < 0) || (this.body.blocked.right && this.chargeDir > 0)) {
                this.isCharging = false;
                this.chargeCooldown = 2000;
                // Stun effect
                const stars = this.scene.add.text(this.x, this.y - 15, '★★', { fontSize: '10px', color: '#ffff00' }).setOrigin(0.5);
                this.scene.tweens.add({
                    targets: stars,
                    y: stars.y - 10, alpha: 0,
                    duration: 500,
                    onComplete: () => { if (stars.active) stars.destroy(); }
                });
            }

            // Hit player = big knockback
            const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (dist < 25 && player.body) {
                const pushDir = player.x > this.x ? 1 : -1;
                player.body.velocity.x = pushDir * this.config.PUSH_FORCE * 1.5;
                player.body.velocity.y = -150;
                if (!player.isInvincible) {
                    player.takeDamage('PUSHER');
                }
                this.isCharging = false;
                this.chargeCooldown = 2000;
            }
        } else {
            // Normal movement
            this.setVelocityX(direction * this.config.SPEED * 0.6);

            // Start charge when ready
            const dist = Math.abs(player.x - this.x);
            if (this.chargeCooldown <= 0 && dist < 120 && dist > 40) {
                // Wind up
                this.setTint(0xff4400);
                this.scene.time.delayedCall(400, () => {
                    if (!this.active) return;
                    this.clearTint();
                    this.isCharging = true;
                    this.chargeDir = direction;
                });
                this.chargeCooldown = 2500; // Prevent immediate re-trigger
            }
        }
    }

    // DRAINER - Latches onto player and continuously drains health
    drainerBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        if (!this.isLatched) this.isLatched = false;

        if (this.isLatched) {
            // Stay attached to player!
            this.x = player.x + (this.latchSide * 15);
            this.y = player.y;
            this.setVelocity(0, 0);

            // Drain effect
            this.drainTimer += 16;
            if (this.drainTimer >= 800 && !player.isInvincible) {
                player.takeDamage('DRAINER');
                this.drainTimer = 0;

                // Life drain visual
                for (let i = 0; i < 4; i++) {
                    const blood = this.scene.add.circle(player.x, player.y, 2, 0xff0000, 0.8);
                    this.scene.tweens.add({
                        targets: blood,
                        x: this.x, y: this.y, alpha: 0,
                        duration: 200,
                        onComplete: () => { if (blood.active) blood.destroy(); }
                    });
                }
            }

            // Can be shaken off by moving fast
            if (player.body && Math.abs(player.body.velocity.x) > 180) {
                this.isLatched = false;
                this.setVelocity((player.body.velocity.x > 0 ? -1 : 1) * 150, -100);
            }
        } else {
            // Chase player
            this.setVelocityX(direction * this.config.SPEED);

            // Float towards player height
            if (player.y < this.y - 20) {
                this.setVelocityY(-60);
            } else if (player.y > this.y + 20) {
                this.setVelocityY(60);
            }

            // Latch onto player when close
            const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (dist < 20) {
                this.isLatched = true;
                this.latchSide = this.x < player.x ? -1 : 1;
                this.drainTimer = 0;
            }
        }
    }

    // CLONER - Creates copies of random enemies in the elevator
    clonerBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED * 0.7);

        this.cloneCooldown -= 16;
        if (this.cloneCooldown <= 0) {
            this.createClone();
            this.cloneCooldown = this.config.CLONE_COOLDOWN;
        }

        // Mitosis animation when about to clone
        if (this.cloneCooldown < 500) {
            this.setScale(1.2 + Math.sin(this.animTime * 10) * 0.1, 1);
        }
    }

    createClone() {
        // Pick a random simple enemy type to clone
        const cloneTypes = ['RUSHER', 'BOUNCER', 'SWARM', 'LEAPER'];
        const cloneType = Phaser.Utils.Array.GetRandom(cloneTypes);

        const clone = new Enemy(this.scene, this.x + Phaser.Math.Between(-25, 25), this.y, cloneType);
        if (this.scene.enemies) {
            this.scene.enemies.add(clone);
        }
        clone.hasEnteredElevator = true;

        // Clone birth effect
        for (let i = 0; i < 10; i++) {
            const p = this.scene.add.circle(this.x, this.y, 3, 0x66aa88, 0.9);
            const angle = (i / 10) * Math.PI * 2;
            this.scene.tweens.add({
                targets: p,
                x: clone.x + Math.cos(angle) * 20,
                y: clone.y + Math.sin(angle) * 20,
                alpha: 0,
                duration: 300,
                onComplete: () => { if (p.active) p.destroy(); }
            });
        }

        // Division line effect
        const divLine = this.scene.add.line(0, 0, this.x, this.y - 10, this.x, this.y + 10, 0x338855, 1);
        divLine.setLineWidth(2);
        this.scene.tweens.add({
            targets: divLine,
            scaleX: 3, alpha: 0,
            duration: 300,
            onComplete: () => { if (divLine.active) divLine.destroy(); }
        });
    }

    // SHIELDER - Projects force fields that protect nearby enemies
    shielderBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * this.config.SPEED);

        // Shield pulse effect
        if (!this.shieldPulseTimer) this.shieldPulseTimer = 0;
        this.shieldPulseTimer -= 16;

        if (this.shieldPulseTimer <= 0) {
            // Create visible shield bubble
            const shield = this.scene.add.circle(this.x, this.y, this.config.SHIELD_RADIUS, 0x4488ff, 0.2);
            shield.setStrokeStyle(2, 0x88ccff, 0.6);
            this.scene.tweens.add({
                targets: shield,
                scale: 1.2, alpha: 0,
                duration: 500,
                onComplete: () => { if (shield.active) shield.destroy(); }
            });
            this.shieldPulseTimer = 1000;
        }

        // Protect nearby enemies
        if (this.scene.enemies) {
            this.scene.enemies.getChildren().forEach(enemy => {
                if (enemy !== this && enemy.active) {
                    const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
                    if (dist < this.config.SHIELD_RADIUS) {
                        enemy.isShielded = true;
                        // Shield glow on protected enemy
                        if (Math.random() < 0.02) {
                            const glow = this.scene.add.circle(enemy.x, enemy.y, 10, 0x4488ff, 0.3);
                            this.scene.tweens.add({
                                targets: glow,
                                scale: 1.5, alpha: 0,
                                duration: 300,
                                onComplete: () => { if (glow.active) glow.destroy(); }
                            });
                        }
                    } else {
                        enemy.isShielded = false;
                    }
                }
            });
        }

        // Shield can also deflect player when too close
        const playerDist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (playerDist < 30 && player.body) {
            const pushDir = player.x > this.x ? 1 : -1;
            player.body.velocity.x += pushDir * 50;
        }
    }

    // BOOMER - Explosive enemy that detonates when player gets close
    boomerBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (!this.isBooming) {
            // Normal movement - approach player
            this.setVelocityX(direction * this.config.SPEED);

            // Start boom countdown when close
            if (dist < this.config.BOOM_RADIUS) {
                this.isBooming = true;
                this.boomTimer = this.config.BOOM_DELAY;
                this.setTexture('enemy_boomer_warn');
            }
        } else {
            // Stop moving during countdown
            this.setVelocityX(0);

            this.boomTimer -= 16;

            // Frantic shaking as countdown progresses
            const shakeIntensity = 1 - (this.boomTimer / this.config.BOOM_DELAY);
            this.x += Math.sin(this.animTime * 30) * shakeIntensity * 3;

            // Warning beeps
            if (this.boomTimer < 1000 && Math.floor(this.boomTimer / 200) !== Math.floor((this.boomTimer + 16) / 200)) {
                const beep = this.scene.add.circle(this.x, this.y - 15, 5, 0xff0000, 0.9);
                this.scene.tweens.add({
                    targets: beep,
                    scale: 2, alpha: 0,
                    duration: 150,
                    onComplete: () => { if (beep.active) beep.destroy(); }
                });
            }

            // Can defuse if player moves away
            if (dist > this.config.BOOM_RADIUS * 1.5) {
                this.isBooming = false;
                this.setTexture('enemy_boomer');
            }

            if (this.boomTimer <= 0) {
                // KABOOM!
                this.explodeBoom(player);
            }
        }
    }

    explodeBoom(player) {
        const boomX = this.x;
        const boomY = this.y;
        const boomRadius = this.config.BOOM_RADIUS;

        // Check damage to player
        const dist = Phaser.Math.Distance.Between(boomX, boomY, player.x, player.y);
        if (dist < boomRadius && !player.isInvincible) {
            player.takeDamage('BOOMER');
            // Knockback
            const angle = Phaser.Math.Angle.Between(boomX, boomY, player.x, player.y);
            player.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300 - 150);
        }

        // Epic explosion effect!
        this.scene.cameras.main.shake(200, 0.02);

        // Explosion ring
        const ring = this.scene.add.circle(boomX, boomY, 10, 0xff4400, 0.8);
        this.scene.tweens.add({
            targets: ring,
            scale: boomRadius / 10 * 2, alpha: 0,
            duration: 300,
            onComplete: () => { if (ring.active) ring.destroy(); }
        });

        // Fire particles
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const p = this.scene.add.circle(
                boomX, boomY,
                Phaser.Math.Between(4, 10),
                Phaser.Utils.Array.GetRandom([0xff4400, 0xffaa00, 0xffff00]),
                0.9
            );
            const dist = Phaser.Math.Between(40, boomRadius);
            this.scene.tweens.add({
                targets: p,
                x: boomX + Math.cos(angle) * dist,
                y: boomY + Math.sin(angle) * dist - 20,
                alpha: 0, scale: 0.3,
                duration: 400,
                onComplete: () => { if (p.active) p.destroy(); }
            });
        }

        // Smoke clouds
        for (let i = 0; i < 6; i++) {
            const smoke = this.scene.add.circle(
                boomX + Phaser.Math.Between(-20, 20),
                boomY + Phaser.Math.Between(-20, 20),
                Phaser.Math.Between(8, 15),
                0x333333, 0.6
            );
            this.scene.tweens.add({
                targets: smoke,
                y: smoke.y - 40, scale: 2, alpha: 0,
                duration: 600,
                delay: i * 50,
                onComplete: () => { if (smoke.active) smoke.destroy(); }
            });
        }

        this.destroy();
    }

    startFuse() {
        // Visual countdown
        this.blinkTimer = this.scene.time.addEvent({
            delay: 500,
            callback: this.toggleBlink,
            callbackScope: this,
            loop: true
        });
    }

    toggleBlink() {
        if (this.texture.key === 'enemy_exploder') {
            this.setTexture('enemy_exploder_warn');
        } else {
            this.setTexture('enemy_exploder');
        }
    }

    updateFuse(delta) {
        this.fuseTimer -= delta;

        // Speed up blinking as fuse runs out
        if (this.fuseTimer < 1000 && this.blinkTimer) {
            this.blinkTimer.delay = 100;
        }

        if (this.fuseTimer <= 0) {
            this.explode();
        }
    }

    explode() {
        if (!this.active || this.isExploding) return;
        this.isExploding = true;

        // Store position before any destruction
        const explodeX = this.x;
        const explodeY = this.y;
        const radius = this.config.EXPLOSION_RADIUS;

        // Clean up blink timer first
        if (this.blinkTimer) {
            this.blinkTimer.destroy();
            this.blinkTimer = null;
        }

        // Play sound
        if (this.scene && this.scene.soundManager) {
            this.scene.soundManager.playSound('explosion');
        }

        // Damage player
        const player = this.scene.player;
        if (player && player.active) {
            const playerDist = Phaser.Math.Distance.Between(explodeX, explodeY, player.x, player.y);
            if (playerDist < radius) {
                player.takeDamage('EXPLOSION');
                const angle = Phaser.Math.Angle.Between(explodeX, explodeY, player.x, player.y);
                player.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300 - 200);
            }
        }

        // Knockback other enemies
        if (this.scene.enemies) {
            const enemies = this.scene.enemies.getChildren().slice(); // Copy array
            enemies.forEach(enemy => {
                if (enemy === this || !enemy.active) return;

                const dist = Phaser.Math.Distance.Between(explodeX, explodeY, enemy.x, enemy.y);
                if (dist < radius) {
                    const angle = Phaser.Math.Angle.Between(explodeX, explodeY, enemy.x, enemy.y);
                    enemy.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400 - 200);
                    enemy.isKicked = true;
                }
            });
        }

        // Destroy this enemy
        this.destroy();
    }

    takeDamage(amount = 1, fromDirection = 0) {
        if (!this.active) return;

        // Shield blocks attacks from the front
        if (this.enemyType === 'SHIELD' && this.isBlocking) {
            // Check if attack is from the direction shield is facing
            const attackFromFront = (fromDirection > 0 && this.facingDirection > 0) ||
                                   (fromDirection < 0 && this.facingDirection < 0) ||
                                   fromDirection === 0;
            if (attackFromFront) {
                // Blocked! Push back slightly
                this.setVelocityX(-this.facingDirection * 100);
                // Block effect
                if (this.scene) {
                    const blockSpark = this.scene.add.circle(this.x + this.facingDirection * 10, this.y, 8, 0x4488ff, 0.8);
                    this.scene.tweens.add({
                        targets: blockSpark,
                        alpha: 0,
                        scale: 2,
                        duration: 200,
                        onComplete: () => blockSpark.destroy()
                    });
                }
                return; // Damage blocked
            }
        }

        this.health -= amount;

        // Flash white
        this.setTintFill(0xffffff);
        this.scene.time.delayedCall(50, () => {
            if (this.active) {
                this.clearTint();
                this.setupByType();
            }
        });

        if (this.health <= 0) {
            if (this.enemyType === 'EXPLODER') {
                this.explode();
            } else if (this.enemyType === 'SPLITTER' && !this.hasSplit) {
                this.split();
            } else if (this.enemyType === 'BLOB' && !this.hasSplit) {
                this.splitBlob();
            } else {
                this.onEjected();
            }
        }
    }

    destroy() {
        // Clean up timers before destroying
        if (this.blinkTimer) {
            this.blinkTimer.destroy();
            this.blinkTimer = null;
        }
        super.destroy();
    }

    split() {
        if (!this.active || !this.scene) return;

        this.hasSplit = true;

        // Store position before destroying
        const splitX = this.x;
        const splitY = this.y;

        // Create mini splitters
        for (let i = 0; i < this.config.SPLIT_COUNT; i++) {
            const offsetX = (i === 0) ? -20 : 20;
            const mini = new Enemy(this.scene, splitX + offsetX, splitY, 'SPLITTER_MINI');
            if (this.scene.enemies) {
                this.scene.enemies.add(mini);
            }
            mini.setVelocity(offsetX * 5, -150);
            mini.hasEnteredElevator = true;
        }

        // Particles
        for (let i = 0; i < 8; i++) {
            const p = this.scene.add.sprite(splitX, splitY, 'spark');
            p.setTint(0xcccc00);
            this.scene.tweens.add({
                targets: p,
                x: splitX + Phaser.Math.Between(-30, 30),
                y: splitY + Phaser.Math.Between(-30, 30),
                alpha: 0,
                duration: 300,
                onComplete: () => { if (p.active) p.destroy(); }
            });
        }

        this.destroy();
    }

    splitBlob() {
        if (!this.active || !this.scene) return;

        this.hasSplit = true;

        const splitX = this.x;
        const splitY = this.y;

        // Create smaller blobs (using SPLITTER_MINI as base)
        for (let i = 0; i < this.config.SPLIT_COUNT; i++) {
            const offsetX = (i === 0) ? -25 : 25;
            const mini = new Enemy(this.scene, splitX + offsetX, splitY, 'SPLITTER_MINI');
            mini.setTint(0x44cc66); // Green like blob
            if (this.scene.enemies) {
                this.scene.enemies.add(mini);
            }
            mini.setVelocity(offsetX * 4, -120);
            mini.hasEnteredElevator = true;
        }

        // Gooey splat particles
        for (let i = 0; i < 12; i++) {
            const goo = this.scene.add.circle(
                splitX + Phaser.Math.Between(-15, 15),
                splitY + Phaser.Math.Between(-10, 10),
                Phaser.Math.Between(4, 10),
                0x44cc66, 0.8
            );
            const angle = (i / 12) * Math.PI * 2;
            this.scene.tweens.add({
                targets: goo,
                x: splitX + Math.cos(angle) * Phaser.Math.Between(30, 50),
                y: splitY + Math.sin(angle) * Phaser.Math.Between(20, 40),
                alpha: 0,
                scale: 0.3,
                duration: 400,
                onComplete: () => { if (goo.active) goo.destroy(); }
            });
        }

        // Splat sound effect visual
        const splat = this.scene.add.text(splitX, splitY - 20, 'SPLAT!', {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#44cc66'
        }).setOrigin(0.5);
        this.scene.tweens.add({
            targets: splat,
            y: splat.y - 30, alpha: 0, scale: 1.5,
            duration: 500,
            onComplete: () => { if (splat.active) splat.destroy(); }
        });

        this.destroy();
    }

    // Called when enemy collides with player
    onPlayerCollision(player) {
        if (this.isKicked) return; // Don't damage if being kicked away

        player.takeDamage(this.enemyType);
    }

    // ========== 10 NEW ENEMY BEHAVIOR METHODS ==========

    wraithBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        // Update fade timer
        this.fadeTimer -= 16;
        if (this.fadeTimer <= 0) {
            this.isFaded = !this.isFaded;
            this.fadeTimer = 2000;

            if (this.isFaded) {
                this.setTexture('enemy_wraith_fade');
                this.setAlpha(0.3);
                if (this.body) this.body.enable = false;
            } else {
                this.setTexture('enemy_wraith');
                this.setAlpha(0.85);
                if (this.body) this.body.enable = true;
            }
        }

        // Float toward player even while faded
        if (this.body && this.body.enable) {
            this.setVelocityX(direction * (this.config.SPEED || 40));
        }

        // Eerie floating motion
        const floatY = Math.sin(this.scene.time.now * 0.002) * 30;
        if (this.body && !this.body.blocked.up && !this.body.blocked.down) {
            this.setVelocityY(floatY);
        }
    }

    scorpionBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * (this.config.SPEED || 50));

        // Sting attack when close
        this.stingCooldown -= 16;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (this.stingCooldown <= 0 && dist < 40) {
            this.stingAttack(player);
            this.stingCooldown = 2000;
        }
    }

    stingAttack(player) {
        if (!player || !player.active || player.isInvincible) return;

        // Visual sting effect
        const stinger = this.scene.add.circle(this.x, this.y - 10, 4, 0xff4400);
        const targetX = player.x;
        const targetY = player.y;
        this.scene.tweens.add({
            targets: stinger,
            x: targetX, y: targetY,
            duration: 100,
            onComplete: () => {
                if (stinger.active) stinger.destroy();
                // Poison effect - slow player using speedMultiplier
                if (player.active && !player.isPoisoned) {
                    player.isPoisoned = true;
                    player.setTint(0x88ff88);
                    player.speedMultiplier = 0.5;
                    this.scene.time.delayedCall(3000, () => {
                        if (player.active) {
                            player.isPoisoned = false;
                            player.speedMultiplier = 1;
                            player.clearTint();
                        }
                    });
                }
            }
        });
    }

    prismBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * (this.config.SPEED || 35));

        // Sparkle effect
        if (Math.random() < 0.05) {
            const colors = [0xff6666, 0xffff66, 0x66ff66, 0x66ffff, 0x6666ff, 0xff66ff];
            const sparkle = this.scene.add.circle(
                this.x + Phaser.Math.Between(-8, 8),
                this.y + Phaser.Math.Between(-8, 8),
                2, Phaser.Utils.Array.GetRandom(colors), 0.8
            );
            this.scene.tweens.add({
                targets: sparkle,
                alpha: 0, scale: 2,
                duration: 300,
                onComplete: () => { if (sparkle.active) sparkle.destroy(); }
            });
        }
    }

    infernoBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * (this.config.SPEED || 55));

        // Leave fire trail
        if (Math.random() < 0.15) {
            const fire = this.scene.add.circle(this.x, this.y + 8, 4, 0xff6600, 0.7);
            this.scene.tweens.add({
                targets: fire,
                y: fire.y + 5, alpha: 0, scale: 0.5,
                duration: 400,
                onComplete: () => { if (fire.active) fire.destroy(); }
            });
        }

        // Burn player if too close
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist < 30 && !player.isInvincible && Math.random() < 0.02) {
            player.takeDamage('INFERNO');
        }
    }

    golemBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        // Very slow but steady
        this.setVelocityX(direction * (this.config.SPEED || 20));

        // Ground pound when player is close
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (this.body && this.body.blocked.down && dist < 50 && Math.random() < 0.01) {
            // Stomp effect
            this.scene.cameras.main.shake(100, 0.01);
            for (let i = 0; i < 6; i++) {
                const debris = this.scene.add.rectangle(
                    this.x + Phaser.Math.Between(-20, 20),
                    this.y + 10,
                    4, 4, 0x666666
                );
                this.scene.tweens.add({
                    targets: debris,
                    y: debris.y + Phaser.Math.Between(10, 30),
                    alpha: 0,
                    duration: 300,
                    onComplete: () => { if (debris.active) debris.destroy(); }
                });
            }
        }
    }

    jesterBehavior(player) {
        // Chaotic unpredictable movement
        this.chaosTimer -= 16;
        if (this.chaosTimer <= 0) {
            this.movementPattern = Math.floor(Math.random() * 4);
            this.chaosTimer = Phaser.Math.Between(500, 1500);
        }

        const speed = this.config.SPEED || 80;
        switch (this.movementPattern) {
            case 0: // Chase player
                const direction = player.x > this.x ? 1 : -1;
                this.setVelocityX(direction * speed);
                this.setFlipX(direction < 0);
                break;
            case 1: // Run away
                const awayDir = player.x > this.x ? -1 : 1;
                this.setVelocityX(awayDir * speed);
                this.setFlipX(awayDir < 0);
                break;
            case 2: // Random hop
                if (this.body && this.body.blocked.down) {
                    this.setVelocity(Phaser.Math.Between(-100, 100), -200);
                }
                break;
            case 3: // Stop and laugh
                this.setVelocityX(0);
                break;
        }
    }

    hydraBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * (this.config.SPEED || 40));

        // Triple bite attack
        this.biteCooldown -= 16;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (this.biteCooldown <= 0 && dist < 60) {
            this.hydraBite(player);
            this.biteCooldown = 1500;
        }
    }

    hydraBite(player) {
        // Three snap attacks from each head
        for (let i = 0; i < 3; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                if (!this.active) return;
                const offsetX = (i - 1) * 15;
                const snap = this.scene.add.text(this.x + offsetX, this.y - 10, '!', {
                    fontSize: '16px',
                    color: '#ff0000'
                }).setOrigin(0.5);
                this.scene.tweens.add({
                    targets: snap,
                    y: snap.y - 15, alpha: 0,
                    duration: 200,
                    onComplete: () => { if (snap.active) snap.destroy(); }
                });
            });
        }
    }

    mirageNewBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);
        this.setVelocityX(direction * (this.config.SPEED || 45));

        // Create illusions periodically
        this.illusionCooldown -= 16;
        if (this.illusionCooldown <= 0 && this.illusionCount < 2) {
            this.createIllusion();
            this.illusionCooldown = 3000;
            this.illusionCount++;
        }

        // Shimmer effect
        this.setAlpha(0.7 + Math.sin(this.scene.time.now * 0.01) * 0.2);
    }

    createIllusion() {
        if (!this.scene || !this.active) return;

        // Create a fake mirage that looks like this enemy but fades
        const illusion = this.scene.add.sprite(this.x, this.y, 'enemy_mirage');
        illusion.setAlpha(0.5);
        illusion.setTint(0xaaaaff);

        // Move in random direction
        const angle = Math.random() * Math.PI * 2;
        this.scene.tweens.add({
            targets: illusion,
            x: this.x + Math.cos(angle) * 50,
            y: this.y + Math.sin(angle) * 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                if (illusion.active) illusion.destroy();
                this.illusionCount = Math.max(0, this.illusionCount - 1);
            }
        });
    }

    titanBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        // Very slow but powerful
        this.setVelocityX(direction * (this.config.SPEED || 15));

        // Ground slam attack
        this.slamCooldown -= 16;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (this.slamCooldown <= 0 && dist < 80) {
            this.titanSlam(player);
            this.slamCooldown = 3000;
        }
    }

    titanSlam(player) {
        if (!this.scene || !this.active) return;

        // Warning
        this.setTint(0xffff00);
        this.scene.time.delayedCall(300, () => {
            if (!this.active) return;
            this.setTint(0x884444);

            // Slam effect
            this.scene.cameras.main.shake(200, 0.02);

            // Shockwave
            const shockwave = this.scene.add.circle(this.x, this.y + 10, 10, 0xffaa00, 0.6);
            this.scene.tweens.add({
                targets: shockwave,
                scale: 8, alpha: 0,
                duration: 400,
                onComplete: () => { if (shockwave.active) shockwave.destroy(); }
            });

            // Knockback player if close
            const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (dist < 80 && player.body) {
                const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
                player.setVelocity(Math.cos(angle) * 200, -200);
            }
        });
    }

    sparkBehavior(player) {
        // Erratic zigzag movement
        this.zigzagTimer -= 16;
        if (this.zigzagTimer <= 0) {
            this.zigzagDir *= -1;
            this.zigzagTimer = Phaser.Math.Between(100, 300);
        }

        // Fast and erratic
        const baseDirection = player.x > this.x ? 1 : -1;
        this.setVelocityX(baseDirection * (this.config.SPEED || 100));
        this.setVelocityY(this.zigzagDir * 80);

        // Electric sparks
        if (Math.random() < 0.1) {
            const spark = this.scene.add.circle(
                this.x + Phaser.Math.Between(-5, 5),
                this.y + Phaser.Math.Between(-5, 5),
                2, 0xffff00, 0.9
            );
            this.scene.tweens.add({
                targets: spark,
                alpha: 0,
                duration: 100,
                onComplete: () => { if (spark.active) spark.destroy(); }
            });
        }
    }

    // ========== ADVANCED ENEMY BEHAVIORS (50 NEW TYPES) ==========
    advancedEnemyBehavior(player) {
        const direction = player.x > this.x ? 1 : -1;
        this.setFlipX(direction < 0);

        switch (this.enemyType) {
            case 'VIPER':
                // Quick strike when close
                const distToPlayer = Math.abs(player.x - this.x);
                if (distToPlayer < 50 && this.strikeReady) {
                    this.setVelocityX(direction * this.config.SPEED * 3);
                    this.strikeReady = false;
                    this.scene.time.delayedCall(1000, () => { this.strikeReady = true; });
                } else {
                    this.setVelocityX(direction * this.config.SPEED * 0.5);
                }
                break;

            case 'CYCLOPS':
                // Slow but powerful, occasional eye beam effect
                this.setVelocityX(direction * this.config.SPEED);
                this.eyeBeamCooldown -= 16;
                if (this.eyeBeamCooldown <= 0) {
                    this.eyeBeamCooldown = 3000;
                    this.createEyeBeamEffect(direction);
                }
                break;

            case 'WASP':
                // Flying stinger
                this.setVelocityX(direction * this.config.SPEED);
                const floatY = Math.sin(this.scene.time.now * 0.005) * 60;
                if (this.body && !this.body.blocked.up && !this.body.blocked.down) {
                    this.setVelocityY(floatY);
                }
                break;

            case 'MUMMY':
                // Slow shamble
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'DJINN':
                // Floats and moves unpredictably
                this.setVelocityX(direction * this.config.SPEED);
                const djinnFloat = Math.sin(this.scene.time.now * 0.004) * 40;
                if (this.body) this.setVelocityY(djinnFloat);
                break;

            case 'GARGOYLE':
                // Flies and divebombs
                const gargoyleFloat = Math.sin(this.scene.time.now * 0.003) * 30;
                this.setVelocityX(direction * this.config.SPEED);
                if (this.body && !this.body.blocked.down) {
                    this.setVelocityY(gargoyleFloat);
                }
                break;

            case 'BASILISK':
                // Slithers toward player
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'BANSHEE':
                // Floats eerily
                this.setVelocityX(direction * this.config.SPEED);
                this.setAlpha(0.5 + Math.sin(this.scene.time.now * 0.005) * 0.3);
                break;

            case 'PHOENIX':
                // Flies with fire trail
                this.setVelocityX(direction * this.config.SPEED);
                const phoenixFloat = Math.sin(this.scene.time.now * 0.004) * 35;
                if (this.body) this.setVelocityY(phoenixFloat);
                break;

            case 'LICH':
                // Slow moving mage
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'WENDIGO':
                // Stalks player
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'CERBERUS':
                // Aggressive triple-threat
                this.setVelocityX(direction * this.config.SPEED * 1.2);
                break;

            case 'WYVERN':
                // Flying beast
                this.setVelocityX(direction * this.config.SPEED);
                const wyvernFloat = Math.sin(this.scene.time.now * 0.003) * 40;
                if (this.body) this.setVelocityY(wyvernFloat);
                break;

            case 'MINOTAUR':
                // Charges like CHARGER
                if (!this.isCharging) {
                    this.chargeCooldown -= 16;
                    if (this.chargeCooldown <= 0) {
                        this.isCharging = true;
                        this.chargeDirection = direction;
                        this.scene.time.delayedCall(1500, () => {
                            this.isCharging = false;
                            this.chargeCooldown = 2000;
                        });
                    }
                    this.setVelocityX(direction * this.config.SPEED * 0.5);
                } else {
                    this.setVelocityX(this.chargeDirection * this.config.SPEED * 2.5);
                }
                break;

            case 'SPECTER':
                // Fades in and out
                this.fadeTimer += 16;
                this.setAlpha(0.3 + Math.sin(this.fadeTimer * 0.003) * 0.4);
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'CHIMERA':
                // Switches attack modes
                this.modeSwitchTimer += 16;
                if (this.modeSwitchTimer > 3000) {
                    this.attackMode = (this.attackMode + 1) % 3;
                    this.modeSwitchTimer = 0;
                }
                this.setVelocityX(direction * this.config.SPEED * (1 + this.attackMode * 0.3));
                break;

            case 'REAPER':
                // Glides slowly but deadly
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'OGRE':
                // Lumbers toward player
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'HARPY':
                // Swoops from above
                this.setVelocityX(direction * this.config.SPEED);
                const harpyFloat = Math.sin(this.scene.time.now * 0.006) * 50;
                if (this.body) this.setVelocityY(harpyFloat);
                break;

            case 'TROLL':
                // Regenerates health slowly
                this.regenTimer += 16;
                if (this.regenTimer > 2000 && this.health < this.maxHealth) {
                    this.health++;
                    this.regenTimer = 0;
                }
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'KRAKEN':
                // Tentacle movements
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'DEMON':
                // Aggressive fire creature
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'ELEMENTAL':
                // Shifts through elements
                this.elementSwitchTimer += 16;
                if (this.elementSwitchTimer > 2000) {
                    this.elementType = (this.elementType + 1) % 4;
                    const colors = [0x44ddff, 0xff6600, 0x44ff44, 0x884400];
                    this.setTint(colors[this.elementType]);
                    this.elementSwitchTimer = 0;
                }
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'WYRM':
                // Serpentine movement
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'SHADE':
                // Mimics player direction
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'FUNGOID':
                // Slow spore spreader
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'SENTINEL':
                // Guarded approach
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'SLIME_KING':
                // Bouncy movement
                this.setVelocityX(direction * this.config.SPEED);
                if (this.body && this.body.blocked.down) {
                    this.setVelocityY(-150);
                }
                break;

            case 'BEETLE':
                // Scurries quickly
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'WRECKER':
                // Destructive robot
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'ORACLE':
                // Predicts and dodges
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'GOLIATH':
                // Massive and slow
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'ASSASSIN':
                // Fast and sneaky
                if (this.isHidden) {
                    const distToTarget = Math.abs(player.x - this.x);
                    if (distToTarget < 60) {
                        this.isHidden = false;
                        this.setAlpha(1);
                        this.setVelocityX(direction * this.config.SPEED * 2);
                    } else {
                        this.setVelocityX(direction * this.config.SPEED * 0.5);
                    }
                } else {
                    this.setVelocityX(direction * this.config.SPEED);
                }
                break;

            case 'PLAGUE':
                // Poison spreader
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'PHANTOM':
                // Nearly invisible
                this.visibilityTimer += 16;
                this.setAlpha(0.15 + Math.sin(this.visibilityTimer * 0.002) * 0.15);
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'BRUTE':
                // Heavy hitter
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'SIREN':
                // Hypnotic movement
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'COLOSSUS':
                // Slow giant
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'REVENANT':
                // Undead warrior
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'GOLEM_FIRE':
                // Burning golem
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'GOLEM_ICE':
                // Freezing golem
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'VAMPIRE_LORD':
                // Master vampire
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'NECROMANCER':
                // Death mage
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'SKELETON_KING':
                // Undead ruler
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'DRAGON':
                // Flying flame beast
                this.setVelocityX(direction * this.config.SPEED);
                const dragonFloat = Math.sin(this.scene.time.now * 0.002) * 30;
                if (this.body) this.setVelocityY(dragonFloat);
                break;

            case 'ARCHDEMON':
                // Greater demon
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'VOID_WALKER':
                // Teleports randomly
                this.blinkCooldown -= 16;
                if (this.blinkCooldown <= 0) {
                    this.blinkCooldown = 2000;
                    const elevator = this.scene.elevator;
                    if (elevator) {
                        const bounds = elevator.getElevatorBounds();
                        this.x = Phaser.Math.Between(bounds.left + 20, bounds.right - 20);
                    }
                }
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'COSMIC_HORROR':
                // Eldritch tentacle movements
                this.setVelocityX(direction * this.config.SPEED);
                break;

            case 'WORLD_EATER':
                // Ultimate boss - enrages at low health
                if (!this.isEnraged && this.health < 5) {
                    this.isEnraged = true;
                    this.setTint(0xff0000);
                    this.config.SPEED *= 2;
                }
                this.setVelocityX(direction * this.config.SPEED);
                break;

            default:
                this.setVelocityX(direction * this.config.SPEED);
        }
    }

    createEyeBeamEffect(direction) {
        if (!this.scene || !this.active) return;
        const beam = this.scene.add.rectangle(
            this.x + direction * 30,
            this.y,
            60,
            4,
            0xff0000,
            0.8
        );
        beam.setDepth(95);
        this.scene.tweens.add({
            targets: beam,
            scaleX: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => { if (beam.active) beam.destroy(); }
        });
    }
}

// Factory function to create enemies
function createEnemy(scene, x, y, type) {
    return new Enemy(scene, x, y, type);
}
