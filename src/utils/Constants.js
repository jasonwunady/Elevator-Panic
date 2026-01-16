// Game Constants
const GAME_WIDTH = 400;
const GAME_HEIGHT = 350; // Shorter, more cramped elevator!

const COLORS = {
    BACKGROUND: 0x1a1a2e,
    ELEVATOR_WALL: 0x4a4a6a,
    ELEVATOR_DOOR: 0x6a6a8a,
    ELEVATOR_FLOOR: 0x2a2a4a,
    PLAYER: 0x00ff88,
    ENEMY_RUSHER: 0xff4444,
    ENEMY_CLINGER: 0x44ff44,
    ENEMY_EXPLODER: 0xffaa00,
    ENEMY_HEAVY: 0x8844ff,
    POWERUP: 0xffff00,
    UI_TEXT: 0xffffff,
    DANGER: 0xff0000,
    WARNING: 0xffaa00
};

const PLAYER_CONFIG = {
    SPEED: 200,
    JUMP_VELOCITY: -280,
    KICK_FORCE: 500,
    KICK_COOLDOWN: 300,
    MAX_HEALTH: 30,
    HP_PER_HEART: 2,
    WIDTH: 16,
    HEIGHT: 24,
    INVINCIBILITY_TIME: 1500
};

const ELEVATOR_CONFIG = {
    INITIAL_WIDTH: 300,
    MIN_WIDTH: 120,
    SHRINK_RATE: 10,
    SHRINK_INTERVAL: 20000,
    DOOR_OPEN_TIME: 3500,
    DOOR_WIDTH: 60,
    WALL_THICKNESS: 20,
    FLOOR_HEIGHT: 20
};

const ENEMY_CONFIG = {
    RUSHER: {
        SPEED: 110,
        HEALTH: 1,
        SCORE: 100,
        WIDTH: 14,
        HEIGHT: 14,
        MASS: 1
    },
    CLINGER: {
        SPEED: 100,
        HEALTH: 2,
        SCORE: 150,
        WIDTH: 12,
        HEIGHT: 12,
        MASS: 0.8
    },
    EXPLODER: {
        SPEED: 70,
        HEALTH: 1,
        SCORE: 200,
        WIDTH: 16,
        HEIGHT: 16,
        MASS: 1.2,
        FUSE_TIME: 2500,
        EXPLOSION_RADIUS: 90
    },
    HEAVY: {
        SPEED: 50,
        HEALTH: 4,
        SCORE: 300,
        WIDTH: 20,
        HEIGHT: 20,
        MASS: 3
    },
    // NEW ENEMY TYPES
    SPITTER: {
        SPEED: 60,
        HEALTH: 2,
        SCORE: 175,
        WIDTH: 14,
        HEIGHT: 14,
        MASS: 1,
        SPIT_COOLDOWN: 2000,
        SPIT_SPEED: 200
    },
    BOUNCER: {
        SPEED: 100,
        HEALTH: 1,
        SCORE: 125,
        WIDTH: 12,
        HEIGHT: 12,
        MASS: 0.6,
        BOUNCE_FORCE: 220
    },
    SPLITTER: {
        SPEED: 80,
        HEALTH: 2,
        SCORE: 250,
        WIDTH: 16,
        HEIGHT: 16,
        MASS: 1.5,
        SPLIT_COUNT: 2
    },
    SPLITTER_MINI: {
        SPEED: 100,
        HEALTH: 1,
        SCORE: 75,
        WIDTH: 8,
        HEIGHT: 8,
        MASS: 0.6
    },
    GHOST: {
        SPEED: 50,
        HEALTH: 1,
        SCORE: 200,
        WIDTH: 14,
        HEIGHT: 16,
        MASS: 0.5,
        PHASE_DURATION: 1500
    },
    // Additional enemy types
    CHARGER: {
        SPEED: 50,
        HEALTH: 2,
        SCORE: 225,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 1.5,
        CHARGE_SPEED: 280,
        CHARGE_COOLDOWN: 3000
    },
    BOMBER: {
        SPEED: 55,
        HEALTH: 1,
        SCORE: 250,
        WIDTH: 14,
        HEIGHT: 14,
        MASS: 1,
        BOMB_COOLDOWN: 3000,
        BOMB_FUSE: 1500
    },
    SHIELD: {
        SPEED: 70,
        HEALTH: 3,
        SCORE: 275,
        WIDTH: 18,
        HEIGHT: 16,
        MASS: 2,
        BLOCK_ANGLE: 90
    },
    // 15 MORE ENEMY TYPES
    TELEPORTER: {
        SPEED: 40,
        HEALTH: 1,
        SCORE: 200,
        WIDTH: 12,
        HEIGHT: 14,
        MASS: 0.7,
        TELEPORT_COOLDOWN: 2000
    },
    MIMIC: {
        SPEED: 80,
        HEALTH: 2,
        SCORE: 300,
        WIDTH: 14,
        HEIGHT: 14,
        MASS: 1,
        COPY_DURATION: 3000
    },
    MAGNET: {
        SPEED: 50,
        HEALTH: 2,
        SCORE: 225,
        WIDTH: 14,
        HEIGHT: 14,
        MASS: 1.5,
        PULL_FORCE: 100,
        PULL_RANGE: 80
    },
    FREEZER: {
        SPEED: 45,
        HEALTH: 1,
        SCORE: 250,
        WIDTH: 14,
        HEIGHT: 14,
        MASS: 1,
        FREEZE_DURATION: 1500,
        FREEZE_RANGE: 50
    },
    SPINNER: {
        SPEED: 90,
        HEALTH: 1,
        SCORE: 150,
        WIDTH: 12,
        HEIGHT: 12,
        MASS: 0.8,
        SPIN_DAMAGE_RADIUS: 20
    },
    VAMPIRE: {
        SPEED: 65,
        HEALTH: 2,
        SCORE: 275,
        WIDTH: 14,
        HEIGHT: 16,
        MASS: 1,
        HEAL_AMOUNT: 1
    },
    SUMMONER: {
        SPEED: 30,
        HEALTH: 3,
        SCORE: 400,
        WIDTH: 16,
        HEIGHT: 18,
        MASS: 1.5,
        SUMMON_COOLDOWN: 4000
    },
    NINJA: {
        SPEED: 120,
        HEALTH: 1,
        SCORE: 175,
        WIDTH: 12,
        HEIGHT: 14,
        MASS: 0.6,
        DASH_COOLDOWN: 2000
    },
    TANK: {
        SPEED: 30,
        HEALTH: 6,
        SCORE: 500,
        WIDTH: 24,
        HEIGHT: 22,
        MASS: 4
    },
    LEAPER: {
        SPEED: 70,
        HEALTH: 1,
        SCORE: 175,
        WIDTH: 12,
        HEIGHT: 10,
        MASS: 0.5,
        LEAP_FORCE: 400,
        LEAP_COOLDOWN: 1200
    },
    SWARM: {
        SPEED: 80,
        HEALTH: 1,
        SCORE: 50,
        WIDTH: 8,
        HEIGHT: 8,
        MASS: 0.3
    },
    LASER: {
        SPEED: 40,
        HEALTH: 1,
        SCORE: 225,
        WIDTH: 14,
        HEIGHT: 16,
        MASS: 1,
        LASER_COOLDOWN: 2500,
        LASER_DURATION: 500
    },
    REFLECTOR: {
        SPEED: 55,
        HEALTH: 2,
        SCORE: 250,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 1.2
    },
    BERSERKER: {
        SPEED: 80,
        HEALTH: 3,
        SCORE: 350,
        WIDTH: 16,
        HEIGHT: 16,
        MASS: 1.8,
        RAGE_THRESHOLD: 1
    },
    CRAWLER: {
        SPEED: 60,
        HEALTH: 1,
        SCORE: 125,
        WIDTH: 16,
        HEIGHT: 8,
        MASS: 0.7
    },
    // 14 New enemy types
    SHADOW: {
        SPEED: 90,
        HEALTH: 1,
        SCORE: 200,
        WIDTH: 14,
        HEIGHT: 16,
        MASS: 0.4,
        INVISIBLE_DURATION: 2000
    },
    GRAVITY: {
        SPEED: 45,
        HEALTH: 2,
        SCORE: 275,
        WIDTH: 18,
        HEIGHT: 18,
        MASS: 2,
        PULL_RADIUS: 80,
        GRAVITY_FORCE: 150
    },
    SPLASHER: {
        SPEED: 70,
        HEALTH: 1,
        SCORE: 150,
        WIDTH: 14,
        HEIGHT: 12,
        MASS: 0.8,
        SPLASH_RADIUS: 60
    },
    ANCHOR: {
        SPEED: 25,
        HEALTH: 4,
        SCORE: 300,
        WIDTH: 20,
        HEIGHT: 20,
        MASS: 5
    },
    PORTAL: {
        SPEED: 50,
        HEALTH: 1,
        SCORE: 225,
        WIDTH: 14,
        HEIGHT: 18,
        MASS: 0.6,
        PORTAL_COOLDOWN: 3000
    },
    ELECTRO: {
        SPEED: 85,
        HEALTH: 1,
        SCORE: 175,
        WIDTH: 12,
        HEIGHT: 14,
        MASS: 0.7,
        SHOCK_RANGE: 40,
        SHOCK_COOLDOWN: 1500
    },
    BLOB: {
        SPEED: 40,
        HEALTH: 5,
        SCORE: 350,
        WIDTH: 22,
        HEIGHT: 18,
        MASS: 3,
        SPLIT_COUNT: 2
    },
    HOMING: {
        SPEED: 65,
        HEALTH: 1,
        SCORE: 200,
        WIDTH: 12,
        HEIGHT: 12,
        MASS: 0.5,
        MISSILE_COOLDOWN: 2000
    },
    PHASER: {
        SPEED: 75,
        HEALTH: 2,
        SCORE: 250,
        WIDTH: 14,
        HEIGHT: 16,
        MASS: 0.3,
        PHASE_COOLDOWN: 1500
    },
    PUSHER: {
        SPEED: 100,
        HEALTH: 1,
        SCORE: 175,
        WIDTH: 18,
        HEIGHT: 14,
        MASS: 1.5,
        PUSH_FORCE: 300
    },
    DRAINER: {
        SPEED: 55,
        HEALTH: 2,
        SCORE: 225,
        WIDTH: 14,
        HEIGHT: 14,
        MASS: 1,
        DRAIN_RATE: 2
    },
    CLONER: {
        SPEED: 50,
        HEALTH: 2,
        SCORE: 300,
        WIDTH: 14,
        HEIGHT: 14,
        MASS: 1,
        CLONE_COOLDOWN: 5000
    },
    SHIELDER: {
        SPEED: 35,
        HEALTH: 2,
        SCORE: 275,
        WIDTH: 16,
        HEIGHT: 18,
        MASS: 1.5,
        SHIELD_RADIUS: 50
    },
    BOOMER: {
        SPEED: 60,
        HEALTH: 1,
        SCORE: 200,
        WIDTH: 14,
        HEIGHT: 14,
        MASS: 1,
        BOOM_RADIUS: 70,
        BOOM_DELAY: 1500
    }
};

const POWERUP_CONFIG = {
    ROCKET_BOOTS: {
        DURATION: 5000,
        JUMP_MULTIPLIER: 2
    },
    STICKY_GLOVES: {
        DURATION: 6000
    },
    FREEZE_FLOOR: {
        DURATION: 4000
    },
    OVERDRIVE: {
        DURATION: 5000,
        SCORE_MULTIPLIER: 2
    }
};

const SPAWN_CONFIG = {
    BASE_INTERVAL: 4000,      // Slower enemy spawns
    MIN_INTERVAL: 2500,       // Keep it relaxed at high levels
    ENEMIES_PER_FLOOR_BASE: 1, // Start with 1 enemy per floor
    ENEMIES_PER_FLOOR_MAX: 2,  // Max 2 enemies per floor
    POWERUP_CHANCE: 0.3        // More powerups to help
};

const SCORE_CONFIG = {
    HEIGHT_MULTIPLIER: 10,
    KICK_BASE: 50,
    COMBO_MULTIPLIER: 1.5,
    STYLE_BONUS: {
        AIR_KICK: 100,
        DOUBLE_KICK: 150,
        TRIPLE_KICK: 300,
        LAST_SECOND: 200
    },
    CROWD_MULTIPLIER_THRESHOLD: 4,
    CROWD_MULTIPLIER: 1.5
};

// Background themes that change every 10 floors
const BACKGROUND_THEMES = {
    LOBBY: {
        name: 'Lobby',
        floorStart: 0,
        bgColor: 0x1a1a2e,
        wallColor: 0x4a4a6a,
        accentColor: 0x6a6a8a,
        particleColor: 0x3a3a5a,
        lineColor: 0x2a2a4a,
        ambientParticles: 'dust'
    },
    OFFICE: {
        name: 'Office District',
        floorStart: 10,
        bgColor: 0x1a2a1a,
        wallColor: 0x3a5a4a,
        accentColor: 0x5a8a6a,
        particleColor: 0x2a4a3a,
        lineColor: 0x1a3a2a,
        ambientParticles: 'paper'
    },
    INDUSTRIAL: {
        name: 'Industrial Zone',
        floorStart: 20,
        bgColor: 0x2a1a1a,
        wallColor: 0x5a3a3a,
        accentColor: 0x8a5a4a,
        particleColor: 0x4a2a2a,
        lineColor: 0x3a1a1a,
        ambientParticles: 'sparks'
    },
    NEON: {
        name: 'Neon District',
        floorStart: 30,
        bgColor: 0x0a0a2a,
        wallColor: 0x2a2a6a,
        accentColor: 0xff00ff,
        particleColor: 0x00ffff,
        lineColor: 0x1a1a4a,
        ambientParticles: 'glow'
    },
    VOID: {
        name: 'The Void',
        floorStart: 40,
        bgColor: 0x050510,
        wallColor: 0x1a1a3a,
        accentColor: 0x4a4a8a,
        particleColor: 0x2a2a5a,
        lineColor: 0x0a0a2a,
        ambientParticles: 'stars'
    },
    INFERNO: {
        name: 'Inferno',
        floorStart: 50,
        bgColor: 0x1a0a00,
        wallColor: 0x4a2a1a,
        accentColor: 0xff4400,
        particleColor: 0xff6600,
        lineColor: 0x2a1a0a,
        ambientParticles: 'embers'
    },
    SKYLINE: {
        name: 'Skyline',
        floorStart: 60,
        bgColor: 0x1a2a3a,
        wallColor: 0x3a5a7a,
        accentColor: 0x88ccff,
        particleColor: 0xaaddff,
        lineColor: 0x2a4a6a,
        ambientParticles: 'dust'
    },
    TOXIC: {
        name: 'Toxic Labs',
        floorStart: 70,
        bgColor: 0x0a1a0a,
        wallColor: 0x2a4a2a,
        accentColor: 0x44ff44,
        particleColor: 0x22aa22,
        lineColor: 0x1a3a1a,
        ambientParticles: 'glow'
    },
    CYBER: {
        name: 'Cyber Core',
        floorStart: 80,
        bgColor: 0x0a0a1a,
        wallColor: 0x2a2a5a,
        accentColor: 0x00ffff,
        particleColor: 0x00aaff,
        lineColor: 0x1a1a3a,
        ambientParticles: 'glow'
    },
    ABYSS: {
        name: 'The Abyss',
        floorStart: 90,
        bgColor: 0x000005,
        wallColor: 0x0a0a1a,
        accentColor: 0x4444aa,
        particleColor: 0x2222aa,
        lineColor: 0x050510,
        ambientParticles: 'stars'
    },
    PARADISE: {
        name: 'Paradise',
        floorStart: 100,
        bgColor: 0x2a1a2a,
        wallColor: 0x5a3a5a,
        accentColor: 0xff88ff,
        particleColor: 0xffaaff,
        lineColor: 0x3a2a3a,
        ambientParticles: 'glow'
    }
};

// Particle effect definitions for player kicks/movement
const PARTICLES = {
    DEFAULT: {
        name: 'Default',
        color: 0xffffff,
        cost: 0,
        description: 'Standard particles'
    },
    FIRE: {
        name: 'Fire',
        color: 0xff4400,
        secondaryColor: 0xffaa00,
        cost: 5000,
        description: 'Blazing trails'
    },
    ICE: {
        name: 'Ice',
        color: 0x00ccff,
        secondaryColor: 0xaaffff,
        cost: 5000,
        description: 'Frozen flakes'
    },
    ELECTRIC: {
        name: 'Electric',
        color: 0xffff00,
        secondaryColor: 0x88ffff,
        cost: 8000,
        description: 'Shocking sparks'
    },
    TOXIC: {
        name: 'Toxic',
        color: 0x44ff44,
        secondaryColor: 0x88ff88,
        cost: 8000,
        description: 'Poisonous clouds'
    },
    GALAXY: {
        name: 'Galaxy',
        color: 0xff00ff,
        secondaryColor: 0x8800ff,
        cost: 12000,
        description: 'Cosmic dust'
    },
    RAINBOW: {
        name: 'Rainbow',
        color: 0xff0000,
        secondaryColor: 0x00ff00,
        cost: 20000,
        description: 'Color spectrum'
    }
};

// Monster dictionary - descriptions for each enemy type
const MONSTER_DICTIONARY = {
    RUSHER: {
        name: 'Rusher',
        color: 0xff4444,
        unlockFloor: 1,
        description: 'Fast and aggressive. Charges straight at you!'
    },
    BOUNCER: {
        name: 'Bouncer',
        color: 0xff66aa,
        unlockFloor: 3,
        description: 'Bounces around unpredictably. Hard to hit!'
    },
    CLINGER: {
        name: 'Clinger',
        color: 0x44ff44,
        unlockFloor: 5,
        description: 'Floats and follows you. Takes 2 hits to kick out.'
    },
    SPITTER: {
        name: 'Spitter',
        color: 0x00cccc,
        unlockFloor: 8,
        description: 'Keeps distance and shoots projectiles at you.'
    },
    EXPLODER: {
        name: 'Exploder',
        color: 0xffaa00,
        unlockFloor: 10,
        description: 'Ticking time bomb! Explodes after a few seconds.'
    },
    SPLITTER: {
        name: 'Splitter',
        color: 0xcccc00,
        unlockFloor: 15,
        description: 'Splits into two mini versions when defeated!'
    },
    HEAVY: {
        name: 'Heavy',
        color: 0x8844ff,
        unlockFloor: 20,
        description: 'Tough and slow. Takes 4 kicks to eject!'
    },
    GHOST: {
        name: 'Ghost',
        color: 0xddddff,
        unlockFloor: 25,
        description: 'Phases in and out. Can only be kicked when solid.'
    },
    CHARGER: {
        name: 'Charger',
        color: 0xff8800,
        unlockFloor: 30,
        description: 'Charges at high speed! Dodge or get trampled.'
    },
    BOMBER: {
        name: 'Bomber',
        color: 0x884400,
        unlockFloor: 35,
        description: 'Drops bombs that explode after a short delay.'
    },
    SHIELD: {
        name: 'Shield',
        color: 0x4488ff,
        unlockFloor: 40,
        description: 'Blocks kicks from the front. Attack from behind!'
    },
    TELEPORTER: {
        name: 'Teleporter',
        color: 0x9944ff,
        unlockFloor: 43,
        description: 'Blinks around the elevator. Hard to predict!'
    },
    MAGNET: {
        name: 'Magnet',
        color: 0xcc3333,
        unlockFloor: 45,
        description: 'Pulls you towards it with magnetic force.'
    },
    VAMPIRE: {
        name: 'Vampire',
        color: 0x660022,
        unlockFloor: 48,
        description: 'Bat-like creature that swoops down to attack.'
    },
    LASER: {
        name: 'Laser',
        color: 0x444466,
        unlockFloor: 50,
        description: 'Fires deadly laser beams. Watch for the charge!'
    },
    REFLECTOR: {
        name: 'Reflector',
        color: 0xaaaacc,
        unlockFloor: 55,
        description: 'Mirrored surface reflects some attacks.'
    },
    MIMIC: {
        name: 'Mimic',
        color: 0x888888,
        unlockFloor: 60,
        description: 'Shapeshifter that copies your movements.'
    },
    BERSERKER: {
        name: 'Berserker',
        color: 0xcc2222,
        unlockFloor: 65,
        description: 'Gets faster and angrier when damaged!'
    },
    SUMMONER: {
        name: 'Summoner',
        color: 0x442266,
        unlockFloor: 70,
        description: 'Dark wizard that summons minions to fight.'
    },
    TANK: {
        name: 'Tank',
        color: 0x446644,
        unlockFloor: 75,
        description: 'Heavily armored. Takes 6 hits to defeat!'
    },
    SWARM: {
        name: 'Swarm',
        color: 0x886600,
        unlockFloor: 12,
        description: 'Tiny but fast. They come in groups!'
    },
    LEAPER: {
        name: 'Leaper',
        color: 0x66aa44,
        unlockFloor: 18,
        description: 'Frog-like creature that jumps high at you.'
    },
    SPINNER: {
        name: 'Spinner',
        color: 0xcccccc,
        unlockFloor: 22,
        description: 'Spinning blades hurt on contact!'
    },
    CRAWLER: {
        name: 'Crawler',
        color: 0x664422,
        unlockFloor: 28,
        description: 'Crawls on floors and ceilings. Creepy!'
    },
    NINJA: {
        name: 'Ninja',
        color: 0x222222,
        unlockFloor: 33,
        description: 'Fast assassin with deadly dash attacks.'
    },
    FREEZER: {
        name: 'Freezer',
        color: 0x66ccff,
        unlockFloor: 38,
        description: 'Icy creature that can freeze you in place!'
    },
    // 14 New enemies
    SHADOW: {
        name: 'Shadow',
        color: 0x222244,
        unlockFloor: 42,
        description: 'Fades into darkness, moves faster when invisible!'
    },
    GRAVITY: {
        name: 'Gravity',
        color: 0x6644aa,
        unlockFloor: 47,
        description: 'Creates gravity wells that pull you in!'
    },
    SPLASHER: {
        name: 'Splasher',
        color: 0x4488dd,
        unlockFloor: 14,
        description: 'Liquid creature that wobbles and splashes.'
    },
    ANCHOR: {
        name: 'Anchor',
        color: 0x556677,
        unlockFloor: 52,
        description: 'Extremely heavy! Slows you down when nearby.'
    },
    PORTAL: {
        name: 'Portal',
        color: 0xaa44ff,
        unlockFloor: 57,
        description: 'Opens rifts that swap your position!'
    },
    ELECTRO: {
        name: 'Electro',
        color: 0xffff44,
        unlockFloor: 24,
        description: 'Shocking! Zaps you when too close.'
    },
    BLOB: {
        name: 'Blob',
        color: 0x44cc66,
        unlockFloor: 62,
        description: 'Massive slime. Takes 5 hits and splits when killed!'
    },
    HOMING: {
        name: 'Homing',
        color: 0xff4466,
        unlockFloor: 46,
        description: 'Launches heat-seeking missiles at you!'
    },
    PHASER: {
        name: 'Phaser',
        color: 0x88aaff,
        unlockFloor: 54,
        description: 'Shifts between dimensions to avoid attacks.'
    },
    PUSHER: {
        name: 'Pusher',
        color: 0xdd8844,
        unlockFloor: 16,
        description: 'Rams into you with tremendous force!'
    },
    DRAINER: {
        name: 'Drainer',
        color: 0x882288,
        unlockFloor: 44,
        description: 'Leech-like creature that saps your health!'
    },
    CLONER: {
        name: 'Cloner',
        color: 0x66aa88,
        unlockFloor: 67,
        description: 'Creates copies of enemies to overwhelm you!'
    },
    SHIELDER: {
        name: 'Shielder',
        color: 0x4466aa,
        unlockFloor: 58,
        description: 'Protects nearby enemies with a force field!'
    },
    BOOMER: {
        name: 'Boomer',
        color: 0xff6622,
        unlockFloor: 36,
        description: 'Explodes when you get close. Keep your distance!'
    }
};

// Building definitions - sets of areas that can be purchased
// Each building has unique elevator colors
const BUILDINGS = {
    STARTER: {
        name: 'Starter Tower',
        areas: ['LOBBY', 'OFFICE', 'INDUSTRIAL'],
        cost: 0,
        description: 'The basics',
        elevator: {
            wallColor: 0x4a4a6a,
            floorColor: 0x2a2a4a,
            accentColor: 0x6a6a8a,
            lightColor: 0xffffcc
        }
    },
    DOWNTOWN: {
        name: 'Downtown Complex',
        areas: ['NEON', 'VOID', 'INFERNO'],
        cost: 20000,
        description: 'Urban warfare',
        elevator: {
            wallColor: 0x3a2a4a,
            floorColor: 0x1a1a2a,
            accentColor: 0xff00ff,
            lightColor: 0xff88ff
        }
    },
    HIGHRISE: {
        name: 'Highrise Spire',
        areas: ['SKYLINE', 'TOXIC', 'CYBER'],
        cost: 50000,
        description: 'Sky-high chaos',
        elevator: {
            wallColor: 0x2a4a5a,
            floorColor: 0x1a2a3a,
            accentColor: 0x00ffff,
            lightColor: 0x88ffff
        }
    },
    ULTIMATE: {
        name: 'Ultimate Tower',
        areas: ['ABYSS', 'PARADISE'],
        cost: 100000,
        description: 'The final frontier',
        elevator: {
            wallColor: 0x2a1a3a,
            floorColor: 0x0a0a1a,
            accentColor: 0xffaa00,
            lightColor: 0xffdd88
        }
    }
};
