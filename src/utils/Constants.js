// Game Constants
const GAME_WIDTH = 400;
const GAME_HEIGHT = 350; // Shorter, more cramped elevator!

// Achievement Ranks
const ACHIEVEMENT_RANKS = {
    BRONZE: { name: 'Bronze', color: '#cd7f32', icon: '🥉' },
    SILVER: { name: 'Silver', color: '#c0c0c0', icon: '🥈' },
    GOLD: { name: 'Gold', color: '#ffd700', icon: '🥇' },
    PLATINUM: { name: 'Platinum', color: '#e5e4e2', icon: '💎' }
};

// Achievements System - 125 Total Achievements
const ACHIEVEMENTS = {
    // ========== BRONZE ACHIEVEMENTS (Easy - 40) ==========
    FIRST_KICK: {
        id: 'first_kick',
        name: 'First Blood',
        description: 'Kick your first enemy out',
        icon: '👊',
        reward: 100,
        rank: 'BRONZE'
    },
    FLOOR_5: {
        id: 'floor_5',
        name: 'Baby Steps',
        description: 'Reach floor 5',
        icon: '👶',
        reward: 50,
        rank: 'BRONZE'
    },
    FLOOR_10: {
        id: 'floor_10',
        name: 'Getting Started',
        description: 'Reach floor 10',
        icon: '🔟',
        reward: 200,
        rank: 'BRONZE'
    },
    FIRST_JUMP: {
        id: 'first_jump',
        name: 'Lift Off',
        description: 'Jump for the first time',
        icon: '🦘',
        reward: 25,
        rank: 'BRONZE'
    },
    SCORE_1K: {
        id: 'score_1k',
        name: 'Pocket Change',
        description: 'Score 1,000 points',
        icon: '💵',
        reward: 100,
        rank: 'BRONZE'
    },
    SCORE_5K: {
        id: 'score_5k',
        name: 'Making Money',
        description: 'Score 5,000 points',
        icon: '💸',
        reward: 250,
        rank: 'BRONZE'
    },
    KICK_10: {
        id: 'kick_10',
        name: 'Warm Up',
        description: 'Kick 10 enemies total',
        icon: '🦶',
        reward: 75,
        rank: 'BRONZE'
    },
    KICK_25: {
        id: 'kick_25',
        name: 'Getting Warmer',
        description: 'Kick 25 enemies total',
        icon: '🦵',
        reward: 150,
        rank: 'BRONZE'
    },
    FIRST_POWERUP: {
        id: 'first_powerup',
        name: 'Power Up!',
        description: 'Collect your first powerup',
        icon: '⚡',
        reward: 50,
        rank: 'BRONZE'
    },
    PLAY_5: {
        id: 'play_5',
        name: 'Regular',
        description: 'Play 5 games',
        icon: '🎮',
        reward: 100,
        rank: 'BRONZE'
    },
    PLAY_10: {
        id: 'play_10',
        name: 'Frequent Flyer',
        description: 'Play 10 games',
        icon: '✈️',
        reward: 200,
        rank: 'BRONZE'
    },
    SURVIVE_30S: {
        id: 'survive_30s',
        name: 'Half Minute',
        description: 'Survive 30 seconds',
        icon: '⏰',
        reward: 50,
        rank: 'BRONZE'
    },
    SURVIVE_1M: {
        id: 'survive_1m',
        name: 'One Minute Man',
        description: 'Survive 1 minute',
        icon: '⏱️',
        reward: 100,
        rank: 'BRONZE'
    },
    COMBO_2: {
        id: 'combo_2',
        name: 'Double Up',
        description: 'Get a 2-kick combo',
        icon: '2️⃣',
        reward: 50,
        rank: 'BRONZE'
    },
    COMBO_3: {
        id: 'combo_3',
        name: 'Triple Play',
        description: 'Get a 3-kick combo',
        icon: '3️⃣',
        reward: 100,
        rank: 'BRONZE'
    },
    DOUBLE_KICK: {
        id: 'double_kick',
        name: 'Double Trouble',
        description: 'Kick 2 enemies at once',
        icon: '✌️',
        reward: 200,
        rank: 'BRONZE'
    },
    AIR_KICK: {
        id: 'air_kick',
        name: 'Air Jordan',
        description: 'Kick an enemy while airborne',
        icon: '🦅',
        reward: 150,
        rank: 'BRONZE'
    },
    MEET_RUSHER: {
        id: 'meet_rusher',
        name: 'Hello Rusher',
        description: 'Encounter a Rusher',
        icon: '👹',
        reward: 25,
        rank: 'BRONZE'
    },
    MEET_BOUNCER: {
        id: 'meet_bouncer',
        name: 'Bouncy Friend',
        description: 'Encounter a Bouncer',
        icon: '🏀',
        reward: 50,
        rank: 'BRONZE'
    },
    MEET_CLINGER: {
        id: 'meet_clinger',
        name: 'Clingy',
        description: 'Encounter a Clinger',
        icon: '🦎',
        reward: 50,
        rank: 'BRONZE'
    },
    ROCKET_BOOTS: {
        id: 'rocket_boots',
        name: 'Rocket Man',
        description: 'Use Rocket Boots powerup',
        icon: '🚀',
        reward: 75,
        rank: 'BRONZE'
    },
    STICKY_GLOVES: {
        id: 'sticky_gloves',
        name: 'Sticky Fingers',
        description: 'Use Sticky Gloves powerup',
        icon: '🧤',
        reward: 75,
        rank: 'BRONZE'
    },
    FREEZE_FLOOR: {
        id: 'freeze_floor',
        name: 'Ice Ice Baby',
        description: 'Use Freeze Floor powerup',
        icon: '❄️',
        reward: 75,
        rank: 'BRONZE'
    },
    OVERDRIVE: {
        id: 'overdrive',
        name: 'Overdrive',
        description: 'Use Overdrive powerup',
        icon: '🔥',
        reward: 75,
        rank: 'BRONZE'
    },
    TAKE_DAMAGE: {
        id: 'take_damage',
        name: 'Ouch!',
        description: 'Take damage for the first time',
        icon: '💥',
        reward: 25,
        rank: 'BRONZE'
    },
    DIE_ONCE: {
        id: 'die_once',
        name: 'First Death',
        description: 'Die for the first time',
        icon: '💀',
        reward: 25,
        rank: 'BRONZE'
    },
    FLOOR_15: {
        id: 'floor_15',
        name: 'Climbing',
        description: 'Reach floor 15',
        icon: '🧗',
        reward: 300,
        rank: 'BRONZE'
    },
    FLOOR_20: {
        id: 'floor_20',
        name: 'Twenty Up',
        description: 'Reach floor 20',
        icon: '🎯',
        reward: 400,
        rank: 'BRONZE'
    },
    MONSTERS_5: {
        id: 'monsters_5',
        name: 'Monster Spotter',
        description: 'Discover 5 monster types',
        icon: '👀',
        reward: 150,
        rank: 'BRONZE'
    },
    MONSTERS_10: {
        id: 'monsters_10',
        name: 'Monster Watcher',
        description: 'Discover 10 monster types',
        icon: '🔍',
        reward: 300,
        rank: 'BRONZE'
    },
    KICK_50: {
        id: 'kick_50',
        name: 'Halfway Kicker',
        description: 'Kick 50 enemies total',
        icon: '👟',
        reward: 300,
        rank: 'BRONZE'
    },
    POWERUPS_5: {
        id: 'powerups_5',
        name: 'Power Collector',
        description: 'Collect 5 powerups total',
        icon: '🎁',
        reward: 150,
        rank: 'BRONZE'
    },
    POWERUPS_10: {
        id: 'powerups_10',
        name: 'Power Hoarder',
        description: 'Collect 10 powerups total',
        icon: '📦',
        reward: 300,
        rank: 'BRONZE'
    },
    WALL_KICK: {
        id: 'wall_kick',
        name: 'Wall Bounce',
        description: 'Kick enemy into a wall',
        icon: '🧱',
        reward: 100,
        rank: 'BRONZE'
    },
    LEFT_DOOR: {
        id: 'left_door',
        name: 'Left Exit',
        description: 'Kick enemy out left door',
        icon: '⬅️',
        reward: 50,
        rank: 'BRONZE'
    },
    RIGHT_DOOR: {
        id: 'right_door',
        name: 'Right Exit',
        description: 'Kick enemy out right door',
        icon: '➡️',
        reward: 50,
        rank: 'BRONZE'
    },
    BOTH_DOORS: {
        id: 'both_doors',
        name: 'Both Ways',
        description: 'Kick enemies out both doors in one floor',
        icon: '↔️',
        reward: 150,
        rank: 'BRONZE'
    },
    PLAY_25: {
        id: 'play_25',
        name: 'Elevator Enthusiast',
        description: 'Play 25 games',
        icon: '🛗',
        reward: 400,
        rank: 'BRONZE'
    },

    // ========== SILVER ACHIEVEMENTS (Medium - 40) ==========
    FLOOR_25: {
        id: 'floor_25',
        name: 'Quarter Way',
        description: 'Reach floor 25',
        icon: '📈',
        reward: 500,
        rank: 'SILVER'
    },
    FLOOR_30: {
        id: 'floor_30',
        name: 'Thirty High',
        description: 'Reach floor 30',
        icon: '🏢',
        reward: 600,
        rank: 'SILVER'
    },
    FLOOR_40: {
        id: 'floor_40',
        name: 'Forty Floors',
        description: 'Reach floor 40',
        icon: '🏬',
        reward: 800,
        rank: 'SILVER'
    },
    FLOOR_50: {
        id: 'floor_50',
        name: 'Halfway There',
        description: 'Reach floor 50',
        icon: '🏔️',
        reward: 1000,
        rank: 'SILVER'
    },
    SCORE_10K: {
        id: 'score_10k',
        name: 'Ten Grand',
        description: 'Score 10,000 points',
        icon: '💰',
        reward: 500,
        rank: 'SILVER'
    },
    SCORE_25K: {
        id: 'score_25k',
        name: 'Quarter Million',
        description: 'Score 25,000 points',
        icon: '💳',
        reward: 800,
        rank: 'SILVER'
    },
    COMBO_5: {
        id: 'combo_5',
        name: 'Combo Starter',
        description: 'Get a 5-kick combo',
        icon: '⚡',
        reward: 300,
        rank: 'SILVER'
    },
    COMBO_10: {
        id: 'combo_10',
        name: 'Combo Master',
        description: 'Get a 10-kick combo',
        icon: '🔥',
        reward: 750,
        rank: 'SILVER'
    },
    KICK_100: {
        id: 'kick_100',
        name: 'Centurion',
        description: 'Kick 100 enemies in one run',
        icon: '🦵',
        reward: 800,
        rank: 'SILVER'
    },
    KICK_250: {
        id: 'kick_250',
        name: 'Kick Expert',
        description: 'Kick 250 enemies total',
        icon: '🥾',
        reward: 1000,
        rank: 'SILVER'
    },
    KICK_500: {
        id: 'kick_500',
        name: 'Kick Master',
        description: 'Kick 500 enemies total',
        icon: '🥋',
        reward: 2000,
        rank: 'SILVER'
    },
    TRIPLE_KICK: {
        id: 'triple_kick',
        name: 'Triple Threat',
        description: 'Kick 3 enemies at once',
        icon: '🔱',
        reward: 500,
        rank: 'SILVER'
    },
    SURVIVOR: {
        id: 'survivor',
        name: 'Survivor',
        description: 'Survive 5 minutes',
        icon: '⏱️',
        reward: 600,
        rank: 'SILVER'
    },
    SURVIVOR_3M: {
        id: 'survivor_3m',
        name: 'Three Minute Hero',
        description: 'Survive 3 minutes',
        icon: '🕐',
        reward: 400,
        rank: 'SILVER'
    },
    PERFECT_FLOOR: {
        id: 'perfect_floor',
        name: 'Flawless',
        description: 'Clear a floor without damage',
        icon: '✨',
        reward: 250,
        rank: 'SILVER'
    },
    PERFECT_5: {
        id: 'perfect_5',
        name: 'Five Flawless',
        description: 'Clear 5 floors without damage in a row',
        icon: '🌟',
        reward: 500,
        rank: 'SILVER'
    },
    MONSTERS_25: {
        id: 'monsters_25',
        name: 'Monster Hunter',
        description: 'Discover 25 monster types',
        icon: '📖',
        reward: 1000,
        rank: 'SILVER'
    },
    MONSTERS_40: {
        id: 'monsters_40',
        name: 'Monster Expert',
        description: 'Discover 40 monster types',
        icon: '📕',
        reward: 1500,
        rank: 'SILVER'
    },
    CLOSE_CALL: {
        id: 'close_call',
        name: 'Close Call',
        description: 'Survive with only 1 HP',
        icon: '💔',
        reward: 300,
        rank: 'SILVER'
    },
    PLAY_50: {
        id: 'play_50',
        name: 'Dedicated Player',
        description: 'Play 50 games',
        icon: '🎯',
        reward: 800,
        rank: 'SILVER'
    },
    DEDICATED: {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Play 100 games total',
        icon: '🎮',
        reward: 1500,
        rank: 'SILVER'
    },
    POWERUPS_25: {
        id: 'powerups_25',
        name: 'Power Addict',
        description: 'Collect 25 powerups total',
        icon: '⚡',
        reward: 500,
        rank: 'SILVER'
    },
    POWERUPS_50: {
        id: 'powerups_50',
        name: 'Power Hungry',
        description: 'Collect 50 powerups total',
        icon: '🎁',
        reward: 800,
        rank: 'SILVER'
    },
    MEET_GHOST: {
        id: 'meet_ghost',
        name: 'Ghost Buster',
        description: 'Defeat a Ghost',
        icon: '👻',
        reward: 200,
        rank: 'SILVER'
    },
    MEET_HEAVY: {
        id: 'meet_heavy',
        name: 'Heavy Lifter',
        description: 'Defeat a Heavy',
        icon: '🏋️',
        reward: 200,
        rank: 'SILVER'
    },
    MEET_EXPLODER: {
        id: 'meet_exploder',
        name: 'Bomb Squad',
        description: 'Defeat an Exploder',
        icon: '💣',
        reward: 200,
        rank: 'SILVER'
    },
    SPEED_DEMON: {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Clear 10 floors in under 2 min',
        icon: '⚡',
        reward: 400,
        rank: 'SILVER'
    },
    MULTI_KILL_4: {
        id: 'multi_kill_4',
        name: 'Quad Kill',
        description: 'Kick 4 enemies in 5 seconds',
        icon: '4️⃣',
        reward: 600,
        rank: 'SILVER'
    },
    CHAIN_REACTION: {
        id: 'chain_reaction',
        name: 'Chain Reaction',
        description: 'Cause enemies to collide',
        icon: '💫',
        reward: 300,
        rank: 'SILVER'
    },
    FULL_HEALTH: {
        id: 'full_health',
        name: 'Healthy',
        description: 'Reach floor 20 with full health',
        icon: '❤️',
        reward: 500,
        rank: 'SILVER'
    },
    NO_POWERUP_20: {
        id: 'no_powerup_20',
        name: 'Purist',
        description: 'Reach floor 20 without powerups',
        icon: '🚫',
        reward: 600,
        rank: 'SILVER'
    },
    KICK_STREAK_10: {
        id: 'kick_streak_10',
        name: 'Hot Foot',
        description: '10 kicks without missing',
        icon: '🔥',
        reward: 400,
        rank: 'SILVER'
    },
    FLOOR_RUSH: {
        id: 'floor_rush',
        name: 'Floor Rush',
        description: 'Clear a floor in under 10 seconds',
        icon: '⏩',
        reward: 350,
        rank: 'SILVER'
    },
    MEET_CHARGER: {
        id: 'meet_charger',
        name: 'Bull Fighter',
        description: 'Defeat a Charger',
        icon: '🐂',
        reward: 250,
        rank: 'SILVER'
    },
    MEET_NINJA: {
        id: 'meet_ninja',
        name: 'Ninja Slayer',
        description: 'Defeat a Ninja',
        icon: '🥷',
        reward: 300,
        rank: 'SILVER'
    },
    MEET_BOMBER: {
        id: 'meet_bomber',
        name: 'Defuser',
        description: 'Defeat a Bomber',
        icon: '💣',
        reward: 300,
        rank: 'SILVER'
    },
    COINS_5K: {
        id: 'coins_5k',
        name: 'Savings',
        description: 'Accumulate 5,000 coins',
        icon: '🪙',
        reward: 500,
        rank: 'SILVER'
    },
    COINS_10K: {
        id: 'coins_10k',
        name: 'Wealthy',
        description: 'Accumulate 10,000 coins',
        icon: '💰',
        reward: 1000,
        rank: 'SILVER'
    },
    HIGH_SCORE_BEAT: {
        id: 'high_score_beat',
        name: 'New Record',
        description: 'Beat your high score',
        icon: '🏆',
        reward: 300,
        rank: 'SILVER'
    },

    // ========== GOLD ACHIEVEMENTS (Hard - 35) ==========
    FLOOR_75: {
        id: 'floor_75',
        name: 'Seventy Five',
        description: 'Reach floor 75',
        icon: '🌆',
        reward: 1500,
        rank: 'GOLD'
    },
    FLOOR_100: {
        id: 'floor_100',
        name: 'Century Club',
        description: 'Reach floor 100',
        icon: '💯',
        reward: 2500,
        rank: 'GOLD'
    },
    FLOOR_125: {
        id: 'floor_125',
        name: 'Sky High',
        description: 'Reach floor 125',
        icon: '☁️',
        reward: 4000,
        rank: 'GOLD'
    },
    FLOOR_150: {
        id: 'floor_150',
        name: 'Stratosphere',
        description: 'Reach floor 150',
        icon: '🌤️',
        reward: 6000,
        rank: 'GOLD'
    },
    SCORE_50K: {
        id: 'score_50k',
        name: 'High Roller',
        description: 'Score 50,000 points',
        icon: '💎',
        reward: 1500,
        rank: 'GOLD'
    },
    SCORE_100K: {
        id: 'score_100k',
        name: 'Score Master',
        description: 'Score 100,000 points',
        icon: '👑',
        reward: 3000,
        rank: 'GOLD'
    },
    SCORE_200K: {
        id: 'score_200k',
        name: 'Score Legend',
        description: 'Score 200,000 points',
        icon: '🏅',
        reward: 5000,
        rank: 'GOLD'
    },
    COMBO_15: {
        id: 'combo_15',
        name: 'Combo Expert',
        description: 'Get a 15-kick combo',
        icon: '💫',
        reward: 1200,
        rank: 'GOLD'
    },
    COMBO_20: {
        id: 'combo_20',
        name: 'Combo Legend',
        description: 'Get a 20-kick combo',
        icon: '💥',
        reward: 2000,
        rank: 'GOLD'
    },
    COMBO_30: {
        id: 'combo_30',
        name: 'Combo God',
        description: 'Get a 30-kick combo',
        icon: '🌠',
        reward: 4000,
        rank: 'GOLD'
    },
    KICK_1000: {
        id: 'kick_1000',
        name: 'Thousand Kicks',
        description: 'Kick 1000 enemies total',
        icon: '🦿',
        reward: 3000,
        rank: 'GOLD'
    },
    KICK_200_RUN: {
        id: 'kick_200_run',
        name: 'Kick Frenzy',
        description: 'Kick 200 enemies in one run',
        icon: '🌪️',
        reward: 2500,
        rank: 'GOLD'
    },
    SURVIVOR_10M: {
        id: 'survivor_10m',
        name: 'Ten Minute Titan',
        description: 'Survive 10 minutes',
        icon: '🕐',
        reward: 2000,
        rank: 'GOLD'
    },
    PERFECT_10: {
        id: 'perfect_10',
        name: 'Perfect Ten',
        description: 'Clear 10 floors without damage',
        icon: '💫',
        reward: 1500,
        rank: 'GOLD'
    },
    MONSTERS_60: {
        id: 'monsters_60',
        name: 'Monster Scholar',
        description: 'Discover 60 monster types',
        icon: '📗',
        reward: 2500,
        rank: 'GOLD'
    },
    MONSTERS_80: {
        id: 'monsters_80',
        name: 'Monster Professor',
        description: 'Discover 80 monster types',
        icon: '📘',
        reward: 4000,
        rank: 'GOLD'
    },
    PLAY_200: {
        id: 'play_200',
        name: 'Veteran',
        description: 'Play 200 games',
        icon: '🎖️',
        reward: 3000,
        rank: 'GOLD'
    },
    PLAY_500: {
        id: 'play_500',
        name: 'Elite',
        description: 'Play 500 games',
        icon: '⭐',
        reward: 5000,
        rank: 'GOLD'
    },
    POWERUPS_100: {
        id: 'powerups_100',
        name: 'Power Master',
        description: 'Collect 100 powerups total',
        icon: '✨',
        reward: 1500,
        rank: 'GOLD'
    },
    MEET_TITAN: {
        id: 'meet_titan',
        name: 'Titan Slayer',
        description: 'Defeat a Titan',
        icon: '🗿',
        reward: 1000,
        rank: 'GOLD'
    },
    MEET_DRAGON: {
        id: 'meet_dragon',
        name: 'Dragon Slayer',
        description: 'Defeat a Dragon',
        icon: '🐉',
        reward: 2000,
        rank: 'GOLD'
    },
    MEET_LICH: {
        id: 'meet_lich',
        name: 'Lich Bane',
        description: 'Defeat a Lich',
        icon: '☠️',
        reward: 1500,
        rank: 'GOLD'
    },
    MULTI_KILL_5: {
        id: 'multi_kill_5',
        name: 'Penta Kill',
        description: 'Kick 5 enemies in 5 seconds',
        icon: '5️⃣',
        reward: 1500,
        rank: 'GOLD'
    },
    NO_DAMAGE_30: {
        id: 'no_damage_30',
        name: 'Untouchable',
        description: 'Reach floor 30 without damage',
        icon: '🛡️',
        reward: 2000,
        rank: 'GOLD'
    },
    SPEED_RUN_50: {
        id: 'speed_run_50',
        name: 'Speed Runner',
        description: 'Reach floor 50 in under 5 min',
        icon: '🏃',
        reward: 2500,
        rank: 'GOLD'
    },
    COINS_50K: {
        id: 'coins_50k',
        name: 'Rich',
        description: 'Accumulate 50,000 coins',
        icon: '💎',
        reward: 3000,
        rank: 'GOLD'
    },
    BOSS_RUSH: {
        id: 'boss_rush',
        name: 'Boss Rush',
        description: 'Defeat 5 boss-type enemies in one run',
        icon: '👹',
        reward: 2000,
        rank: 'GOLD'
    },
    KICK_STREAK_25: {
        id: 'kick_streak_25',
        name: 'Inferno Foot',
        description: '25 kicks without missing',
        icon: '🔥',
        reward: 1500,
        rank: 'GOLD'
    },
    ALL_POWERUPS: {
        id: 'all_powerups',
        name: 'Power Collector',
        description: 'Use all 4 powerup types in one run',
        icon: '🌈',
        reward: 800,
        rank: 'GOLD'
    },
    NEAR_DEATH_WIN: {
        id: 'near_death_win',
        name: 'Phoenix',
        description: 'Win a floor with 1 HP and no damage',
        icon: '🔥',
        reward: 1000,
        rank: 'GOLD'
    },
    FLOOR_CLEAR_3S: {
        id: 'floor_clear_3s',
        name: 'Lightning Fast',
        description: 'Clear a floor in under 3 seconds',
        icon: '⚡',
        reward: 1200,
        rank: 'GOLD'
    },
    MEET_ARCHDEMON: {
        id: 'meet_archdemon',
        name: 'Demon Hunter',
        description: 'Defeat an Archdemon',
        icon: '😈',
        reward: 2500,
        rank: 'GOLD'
    },
    MEET_WORLD_EATER: {
        id: 'meet_world_eater',
        name: 'World Saver',
        description: 'Defeat a World Eater',
        icon: '🌍',
        reward: 5000,
        rank: 'GOLD'
    },
    HIGH_SCORE_50K: {
        id: 'high_score_50k',
        name: 'High Score Hero',
        description: 'Set a high score over 50,000',
        icon: '🏆',
        reward: 2000,
        rank: 'GOLD'
    },

    // ========== PLATINUM ACHIEVEMENTS (Expert - 10) ==========
    FLOOR_175: {
        id: 'floor_175',
        name: 'Top of the World',
        description: 'Reach floor 175',
        icon: '🌟',
        reward: 10000,
        rank: 'PLATINUM'
    },
    SCORE_500K: {
        id: 'score_500k',
        name: 'Half Million',
        description: 'Score 500,000 points',
        icon: '💎',
        reward: 10000,
        rank: 'PLATINUM'
    },
    COMBO_50: {
        id: 'combo_50',
        name: 'Combo Immortal',
        description: 'Get a 50-kick combo',
        icon: '🌟',
        reward: 8000,
        rank: 'PLATINUM'
    },
    KICK_5000: {
        id: 'kick_5000',
        name: 'Legendary Kicker',
        description: 'Kick 5000 enemies total',
        icon: '👑',
        reward: 8000,
        rank: 'PLATINUM'
    },
    MONSTER_MASTER: {
        id: 'monster_master',
        name: 'Monster Master',
        description: 'Discover all monster types',
        icon: '📚',
        reward: 10000,
        rank: 'PLATINUM'
    },
    PLAY_1000: {
        id: 'play_1000',
        name: 'Elevator Legend',
        description: 'Play 1000 games',
        icon: '🏛️',
        reward: 10000,
        rank: 'PLATINUM'
    },
    NO_DAMAGE_50: {
        id: 'no_damage_50',
        name: 'Invincible',
        description: 'Reach floor 50 without any damage',
        icon: '⭐',
        reward: 8000,
        rank: 'PLATINUM'
    },
    SURVIVOR_20M: {
        id: 'survivor_20m',
        name: 'Endurance Master',
        description: 'Survive 20 minutes',
        icon: '🕐',
        reward: 6000,
        rank: 'PLATINUM'
    },
    SCORE_1M: {
        id: 'score_1m',
        name: 'Millionaire',
        description: 'Score 1,000,000 points',
        icon: '💰',
        reward: 15000,
        rank: 'PLATINUM'
    },
    COMPLETIONIST: {
        id: 'completionist',
        name: 'Completionist',
        description: 'Unlock all other achievements',
        icon: '🏆',
        reward: 50000,
        rank: 'PLATINUM'
    }
};

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
    SPEED: 210,
    JUMP_VELOCITY: -300,
    KICK_FORCE: 550,
    KICK_COOLDOWN: 250,
    MAX_HEALTH: 40,
    HP_PER_HEART: 2,
    WIDTH: 16,
    HEIGHT: 24,
    INVINCIBILITY_TIME: 2000
};

const ELEVATOR_CONFIG = {
    INITIAL_WIDTH: 320,
    MIN_WIDTH: 140,
    SHRINK_RATE: 8,
    SHRINK_INTERVAL: 25000,
    DOOR_OPEN_TIME: 4000,
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
    },
    // ========== 10 NEW ENEMY TYPES ==========
    WRAITH: {
        SPEED: 40,
        HEALTH: 1,
        SCORE: 180,
        WIDTH: 16,
        HEIGHT: 16,
        MASS: 0.5
    },
    SCORPION: {
        SPEED: 50,
        HEALTH: 2,
        SCORE: 160,
        WIDTH: 20,
        HEIGHT: 14,
        MASS: 1.2
    },
    PRISM: {
        SPEED: 35,
        HEALTH: 3,
        SCORE: 200,
        WIDTH: 16,
        HEIGHT: 16,
        MASS: 1
    },
    INFERNO: {
        SPEED: 55,
        HEALTH: 1,
        SCORE: 150,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 0.8,
        BURN_RADIUS: 30
    },
    GOLEM: {
        SPEED: 20,
        HEALTH: 5,
        SCORE: 300,
        WIDTH: 22,
        HEIGHT: 18,
        MASS: 3
    },
    JESTER: {
        SPEED: 80,
        HEALTH: 1,
        SCORE: 175,
        WIDTH: 16,
        HEIGHT: 16,
        MASS: 0.7
    },
    HYDRA: {
        SPEED: 40,
        HEALTH: 3,
        SCORE: 250,
        WIDTH: 20,
        HEIGHT: 16,
        MASS: 1.5
    },
    MIRAGE_NEW: {
        SPEED: 45,
        HEALTH: 1,
        SCORE: 150,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 0.6
    },
    TITAN: {
        SPEED: 15,
        HEALTH: 7,
        SCORE: 400,
        WIDTH: 30,
        HEIGHT: 24,
        MASS: 4
    },
    SPARK: {
        SPEED: 100,
        HEALTH: 1,
        SCORE: 100,
        WIDTH: 8,
        HEIGHT: 8,
        MASS: 0.3
    },
    // ========== 50 MORE ENEMY TYPES ==========
    VIPER: {
        SPEED: 65,
        HEALTH: 1,
        SCORE: 120,
        WIDTH: 18,
        HEIGHT: 12,
        MASS: 0.8
    },
    CYCLOPS: {
        SPEED: 30,
        HEALTH: 4,
        SCORE: 220,
        WIDTH: 20,
        HEIGHT: 18,
        MASS: 2.5
    },
    WASP: {
        SPEED: 85,
        HEALTH: 1,
        SCORE: 130,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 0.5
    },
    MUMMY: {
        SPEED: 25,
        HEALTH: 3,
        SCORE: 180,
        WIDTH: 16,
        HEIGHT: 16,
        MASS: 1.5
    },
    DJINN: {
        SPEED: 50,
        HEALTH: 2,
        SCORE: 200,
        WIDTH: 16,
        HEIGHT: 16,
        MASS: 0.7
    },
    GARGOYLE: {
        SPEED: 40,
        HEALTH: 3,
        SCORE: 190,
        WIDTH: 20,
        HEIGHT: 14,
        MASS: 2
    },
    BASILISK: {
        SPEED: 35,
        HEALTH: 2,
        SCORE: 210,
        WIDTH: 18,
        HEIGHT: 14,
        MASS: 1.3
    },
    BANSHEE: {
        SPEED: 55,
        HEALTH: 1,
        SCORE: 160,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 0.4
    },
    PHOENIX: {
        SPEED: 60,
        HEALTH: 2,
        SCORE: 250,
        WIDTH: 20,
        HEIGHT: 16,
        MASS: 0.8
    },
    LICH: {
        SPEED: 30,
        HEALTH: 3,
        SCORE: 280,
        WIDTH: 16,
        HEIGHT: 16,
        MASS: 1
    },
    WENDIGO: {
        SPEED: 45,
        HEALTH: 4,
        SCORE: 260,
        WIDTH: 20,
        HEIGHT: 18,
        MASS: 2.2
    },
    CERBERUS: {
        SPEED: 55,
        HEALTH: 3,
        SCORE: 270,
        WIDTH: 24,
        HEIGHT: 16,
        MASS: 2
    },
    WYVERN: {
        SPEED: 50,
        HEALTH: 3,
        SCORE: 240,
        WIDTH: 22,
        HEIGHT: 18,
        MASS: 1.5
    },
    MINOTAUR: {
        SPEED: 40,
        HEALTH: 5,
        SCORE: 320,
        WIDTH: 24,
        HEIGHT: 20,
        MASS: 3
    },
    SPECTER: {
        SPEED: 45,
        HEALTH: 1,
        SCORE: 140,
        WIDTH: 16,
        HEIGHT: 16,
        MASS: 0.3
    },
    CHIMERA: {
        SPEED: 50,
        HEALTH: 4,
        SCORE: 300,
        WIDTH: 24,
        HEIGHT: 16,
        MASS: 2.5
    },
    REAPER: {
        SPEED: 35,
        HEALTH: 2,
        SCORE: 350,
        WIDTH: 16,
        HEIGHT: 16,
        MASS: 0.5
    },
    OGRE: {
        SPEED: 30,
        HEALTH: 5,
        SCORE: 280,
        WIDTH: 24,
        HEIGHT: 18,
        MASS: 3
    },
    HARPY: {
        SPEED: 70,
        HEALTH: 1,
        SCORE: 150,
        WIDTH: 18,
        HEIGHT: 14,
        MASS: 0.6
    },
    TROLL: {
        SPEED: 25,
        HEALTH: 6,
        SCORE: 300,
        WIDTH: 20,
        HEIGHT: 18,
        MASS: 2.8
    },
    KRAKEN: {
        SPEED: 30,
        HEALTH: 4,
        SCORE: 290,
        WIDTH: 20,
        HEIGHT: 16,
        MASS: 2
    },
    DEMON: {
        SPEED: 55,
        HEALTH: 3,
        SCORE: 260,
        WIDTH: 18,
        HEIGHT: 16,
        MASS: 1.5
    },
    ELEMENTAL: {
        SPEED: 60,
        HEALTH: 2,
        SCORE: 220,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 0.5
    },
    WYRM: {
        SPEED: 45,
        HEALTH: 3,
        SCORE: 230,
        WIDTH: 22,
        HEIGHT: 14,
        MASS: 1.8
    },
    SHADE: {
        SPEED: 50,
        HEALTH: 1,
        SCORE: 170,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 0.4
    },
    FUNGOID: {
        SPEED: 20,
        HEALTH: 2,
        SCORE: 140,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 1
    },
    SENTINEL: {
        SPEED: 35,
        HEALTH: 4,
        SCORE: 250,
        WIDTH: 18,
        HEIGHT: 16,
        MASS: 2.5
    },
    SLIME_KING: {
        SPEED: 20,
        HEALTH: 6,
        SCORE: 350,
        WIDTH: 20,
        HEIGHT: 16,
        MASS: 3
    },
    BEETLE: {
        SPEED: 40,
        HEALTH: 3,
        SCORE: 180,
        WIDTH: 16,
        HEIGHT: 12,
        MASS: 1.5
    },
    WRECKER: {
        SPEED: 45,
        HEALTH: 4,
        SCORE: 280,
        WIDTH: 20,
        HEIGHT: 16,
        MASS: 2.2
    },
    ORACLE: {
        SPEED: 30,
        HEALTH: 2,
        SCORE: 240,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 0.8
    },
    GOLIATH: {
        SPEED: 15,
        HEALTH: 8,
        SCORE: 450,
        WIDTH: 28,
        HEIGHT: 22,
        MASS: 4.5
    },
    ASSASSIN: {
        SPEED: 90,
        HEALTH: 1,
        SCORE: 200,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 0.6
    },
    PLAGUE: {
        SPEED: 35,
        HEALTH: 2,
        SCORE: 190,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 0.9
    },
    PHANTOM: {
        SPEED: 50,
        HEALTH: 1,
        SCORE: 180,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 0.3
    },
    BRUTE: {
        SPEED: 35,
        HEALTH: 5,
        SCORE: 300,
        WIDTH: 22,
        HEIGHT: 18,
        MASS: 3
    },
    SIREN: {
        SPEED: 40,
        HEALTH: 2,
        SCORE: 220,
        WIDTH: 16,
        HEIGHT: 16,
        MASS: 0.7
    },
    COLOSSUS: {
        SPEED: 12,
        HEALTH: 10,
        SCORE: 500,
        WIDTH: 28,
        HEIGHT: 22,
        MASS: 5
    },
    REVENANT: {
        SPEED: 40,
        HEALTH: 3,
        SCORE: 230,
        WIDTH: 18,
        HEIGHT: 16,
        MASS: 1.5
    },
    GOLEM_FIRE: {
        SPEED: 20,
        HEALTH: 6,
        SCORE: 350,
        WIDTH: 22,
        HEIGHT: 18,
        MASS: 3.5
    },
    GOLEM_ICE: {
        SPEED: 20,
        HEALTH: 6,
        SCORE: 350,
        WIDTH: 22,
        HEIGHT: 18,
        MASS: 3.5
    },
    VAMPIRE_LORD: {
        SPEED: 45,
        HEALTH: 4,
        SCORE: 380,
        WIDTH: 18,
        HEIGHT: 16,
        MASS: 1.2
    },
    NECROMANCER: {
        SPEED: 25,
        HEALTH: 3,
        SCORE: 400,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 0.8
    },
    SKELETON_KING: {
        SPEED: 30,
        HEALTH: 5,
        SCORE: 420,
        WIDTH: 22,
        HEIGHT: 18,
        MASS: 2
    },
    DRAGON: {
        SPEED: 35,
        HEALTH: 8,
        SCORE: 600,
        WIDTH: 26,
        HEIGHT: 22,
        MASS: 4
    },
    ARCHDEMON: {
        SPEED: 40,
        HEALTH: 7,
        SCORE: 550,
        WIDTH: 26,
        HEIGHT: 20,
        MASS: 3.5
    },
    VOID_WALKER: {
        SPEED: 55,
        HEALTH: 2,
        SCORE: 320,
        WIDTH: 16,
        HEIGHT: 14,
        MASS: 0.5
    },
    COSMIC_HORROR: {
        SPEED: 30,
        HEALTH: 6,
        SCORE: 480,
        WIDTH: 20,
        HEIGHT: 18,
        MASS: 2
    },
    WORLD_EATER: {
        SPEED: 10,
        HEALTH: 15,
        SCORE: 1000,
        WIDTH: 32,
        HEIGHT: 24,
        MASS: 6
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
    BASE_INTERVAL: 5000,      // Even slower enemy spawns
    MIN_INTERVAL: 3500,       // Keep it relaxed at high levels
    ENEMIES_PER_FLOOR_BASE: 1, // Start with 1 enemy per floor
    ENEMIES_PER_FLOOR_MAX: 2,  // Max 2 enemies per floor
    POWERUP_CHANCE: 0.45       // More powerups to help
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
    },
    CRYSTAL: {
        name: 'Crystal Caverns',
        floorStart: 110,
        bgColor: 0x0a1a2a,
        wallColor: 0x2a4a6a,
        accentColor: 0x88ddff,
        particleColor: 0xaaeeff,
        lineColor: 0x1a3a5a,
        ambientParticles: 'glow'
    },
    HELL: {
        name: 'Hellscape',
        floorStart: 120,
        bgColor: 0x2a0a0a,
        wallColor: 0x6a1a1a,
        accentColor: 0xff2200,
        particleColor: 0xff4422,
        lineColor: 0x4a0a0a,
        ambientParticles: 'embers'
    },
    ARCTIC: {
        name: 'Arctic Depths',
        floorStart: 130,
        bgColor: 0x1a2a3a,
        wallColor: 0x4a6a8a,
        accentColor: 0xaaffff,
        particleColor: 0xccffff,
        lineColor: 0x2a4a6a,
        ambientParticles: 'dust'
    },
    JUNGLE: {
        name: 'Overgrown',
        floorStart: 140,
        bgColor: 0x0a2a0a,
        wallColor: 0x2a5a2a,
        accentColor: 0x44dd44,
        particleColor: 0x66ff66,
        lineColor: 0x1a4a1a,
        ambientParticles: 'dust'
    },
    STORM: {
        name: 'Storm Zone',
        floorStart: 150,
        bgColor: 0x1a1a2a,
        wallColor: 0x3a3a5a,
        accentColor: 0xffff44,
        particleColor: 0xffffaa,
        lineColor: 0x2a2a4a,
        ambientParticles: 'sparks'
    },
    BLOOD: {
        name: 'Crimson Tower',
        floorStart: 160,
        bgColor: 0x2a0a1a,
        wallColor: 0x5a1a2a,
        accentColor: 0xff4466,
        particleColor: 0xff6688,
        lineColor: 0x3a0a1a,
        ambientParticles: 'glow'
    },
    SHADOW: {
        name: 'Shadow Realm',
        floorStart: 170,
        bgColor: 0x050508,
        wallColor: 0x151520,
        accentColor: 0x6644aa,
        particleColor: 0x8866cc,
        lineColor: 0x0a0a10,
        ambientParticles: 'stars'
    },
    MACHINE: {
        name: 'Machine Heart',
        floorStart: 180,
        bgColor: 0x1a1a1a,
        wallColor: 0x4a4a4a,
        accentColor: 0xff8800,
        particleColor: 0xffaa44,
        lineColor: 0x2a2a2a,
        ambientParticles: 'sparks'
    },
    COSMOS: {
        name: 'Deep Space',
        floorStart: 190,
        bgColor: 0x000010,
        wallColor: 0x101030,
        accentColor: 0xaa88ff,
        particleColor: 0xccaaff,
        lineColor: 0x080820,
        ambientParticles: 'stars'
    },
    OMEGA: {
        name: 'Omega Floor',
        floorStart: 200,
        bgColor: 0x0a0a0a,
        wallColor: 0x2a2a2a,
        accentColor: 0xffffff,
        particleColor: 0xffffff,
        lineColor: 0x1a1a1a,
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
    },
    // ========== 10 NEW MONSTERS ==========
    WRAITH: {
        name: 'Wraith',
        color: 0x4466aa,
        unlockFloor: 78,
        description: 'Ethereal specter that phases in and out. Cannot be hit while faded!'
    },
    SCORPION: {
        name: 'Scorpion',
        color: 0x884422,
        unlockFloor: 80,
        description: 'Venomous arachnid. Its sting poisons and slows you!'
    },
    PRISM: {
        name: 'Prism',
        color: 0xaaddff,
        unlockFloor: 82,
        description: 'Crystalline creature that can reflect your kicks!'
    },
    INFERNO: {
        name: 'Inferno',
        color: 0xff6600,
        unlockFloor: 84,
        description: 'Living flame that burns everything nearby. Stay away!'
    },
    GOLEM: {
        name: 'Golem',
        color: 0x666666,
        unlockFloor: 86,
        description: 'Stone construct. Incredibly slow but extremely tough!'
    },
    JESTER: {
        name: 'Jester',
        color: 0xaa22aa,
        unlockFloor: 88,
        description: 'Chaotic trickster with unpredictable movements!'
    },
    HYDRA: {
        name: 'Hydra',
        color: 0x228844,
        unlockFloor: 90,
        description: 'Three-headed serpent with a vicious triple bite!'
    },
    MIRAGE_NEW: {
        name: 'Mirage',
        color: 0x8888cc,
        unlockFloor: 92,
        description: 'Creates illusory copies to confuse you!'
    },
    TITAN: {
        name: 'Titan',
        color: 0x884444,
        unlockFloor: 95,
        description: 'Massive brute with devastating ground slam attacks!'
    },
    SPARK: {
        name: 'Spark',
        color: 0xffff00,
        unlockFloor: 77,
        description: 'Tiny electric ball that moves erratically. Hard to hit!'
    },
    // ========== 50 MORE MONSTERS ==========
    VIPER: {
        name: 'Viper',
        color: 0x44aa44,
        unlockFloor: 97,
        description: 'Quick-striking snake with venomous fangs!'
    },
    CYCLOPS: {
        name: 'Cyclops',
        color: 0x8866aa,
        unlockFloor: 99,
        description: 'One-eyed giant with powerful eye beam attacks!'
    },
    WASP: {
        name: 'Wasp',
        color: 0xffcc00,
        unlockFloor: 100,
        description: 'Flying stinger that attacks from above!'
    },
    MUMMY: {
        name: 'Mummy',
        color: 0xccbb99,
        unlockFloor: 102,
        description: 'Wrapped undead that curses on contact!'
    },
    DJINN: {
        name: 'Djinn',
        color: 0x4488ff,
        unlockFloor: 104,
        description: 'Magical genie that grants wishes of destruction!'
    },
    GARGOYLE: {
        name: 'Gargoyle',
        color: 0x555566,
        unlockFloor: 106,
        description: 'Stone flyer that divebombs from above!'
    },
    BASILISK: {
        name: 'Basilisk',
        color: 0x448844,
        unlockFloor: 108,
        description: 'Petrifying serpent - avoid its deadly gaze!'
    },
    BANSHEE: {
        name: 'Banshee',
        color: 0xddddff,
        unlockFloor: 110,
        description: 'Screaming spirit whose wail stuns you!'
    },
    PHOENIX: {
        name: 'Phoenix',
        color: 0xff6600,
        unlockFloor: 112,
        description: 'Fire bird that revives after being kicked out!'
    },
    LICH: {
        name: 'Lich',
        color: 0x2222aa,
        unlockFloor: 114,
        description: 'Skeletal mage that summons undead minions!'
    },
    WENDIGO: {
        name: 'Wendigo',
        color: 0xaaddff,
        unlockFloor: 116,
        description: 'Ice beast that freezes everything around it!'
    },
    CERBERUS: {
        name: 'Cerberus',
        color: 0x442222,
        unlockFloor: 118,
        description: 'Three-headed hellhound with triple bite!'
    },
    WYVERN: {
        name: 'Wyvern',
        color: 0x664488,
        unlockFloor: 120,
        description: 'Dragon-like beast with poisonous tail!'
    },
    MINOTAUR: {
        name: 'Minotaur',
        color: 0x884422,
        unlockFloor: 122,
        description: 'Bull-headed brute that charges relentlessly!'
    },
    SPECTER: {
        name: 'Specter',
        color: 0x6688aa,
        unlockFloor: 124,
        description: 'Fading ghost that phases through walls!'
    },
    CHIMERA: {
        name: 'Chimera',
        color: 0xaa6644,
        unlockFloor: 126,
        description: 'Multi-headed beast with various attacks!'
    },
    REAPER: {
        name: 'Reaper',
        color: 0x111111,
        unlockFloor: 128,
        description: 'Death incarnate - one touch is fatal!'
    },
    OGRE: {
        name: 'Ogre',
        color: 0x66aa66,
        unlockFloor: 130,
        description: 'Club-wielding giant with crushing blows!'
    },
    HARPY: {
        name: 'Harpy',
        color: 0xddaa88,
        unlockFloor: 132,
        description: 'Bird woman that swoops and snatches!'
    },
    TROLL: {
        name: 'Troll',
        color: 0x557755,
        unlockFloor: 134,
        description: 'Regenerating brute - keep kicking!'
    },
    KRAKEN: {
        name: 'Kraken',
        color: 0x446688,
        unlockFloor: 136,
        description: 'Tentacle monster that grabs from all sides!'
    },
    DEMON: {
        name: 'Demon',
        color: 0xaa2222,
        unlockFloor: 138,
        description: 'Hellish creature with fire attacks!'
    },
    ELEMENTAL: {
        name: 'Elemental',
        color: 0x44ddff,
        unlockFloor: 140,
        description: 'Pure energy being that shifts elements!'
    },
    WYRM: {
        name: 'Wyrm',
        color: 0x668844,
        unlockFloor: 142,
        description: 'Serpent dragon that constricts victims!'
    },
    SHADE: {
        name: 'Shade',
        color: 0x222233,
        unlockFloor: 144,
        description: 'Your dark clone that mimics your moves!'
    },
    FUNGOID: {
        name: 'Fungoid',
        color: 0xcc8866,
        unlockFloor: 146,
        description: 'Mushroom creature that releases spores!'
    },
    SENTINEL: {
        name: 'Sentinel',
        color: 0x888899,
        unlockFloor: 148,
        description: 'Armored guard with impenetrable defense!'
    },
    SLIME_KING: {
        name: 'Slime King',
        color: 0x44dd44,
        unlockFloor: 150,
        description: 'Giant slime that splits when kicked!'
    },
    BEETLE: {
        name: 'Beetle',
        color: 0x224466,
        unlockFloor: 151,
        description: 'Armored insect with shell protection!'
    },
    WRECKER: {
        name: 'Wrecker',
        color: 0xcc6600,
        unlockFloor: 152,
        description: 'Demolition robot that breaks the elevator!'
    },
    ORACLE: {
        name: 'Oracle',
        color: 0x8844aa,
        unlockFloor: 153,
        description: 'Psychic enemy that predicts your moves!'
    },
    GOLIATH: {
        name: 'Goliath',
        color: 0x556677,
        unlockFloor: 155,
        description: 'Mega tank with massive health pool!'
    },
    ASSASSIN: {
        name: 'Assassin',
        color: 0x333344,
        unlockFloor: 156,
        description: 'Stealth killer that strikes from shadows!'
    },
    PLAGUE: {
        name: 'Plague',
        color: 0x557722,
        unlockFloor: 157,
        description: 'Disease spreader that poisons the floor!'
    },
    PHANTOM: {
        name: 'Phantom',
        color: 0x4455aa,
        unlockFloor: 158,
        description: 'Invisible stalker you can barely see!'
    },
    BRUTE: {
        name: 'Brute',
        color: 0x994444,
        unlockFloor: 159,
        description: 'Heavy hitter with devastating punches!'
    },
    SIREN: {
        name: 'Siren',
        color: 0x44aaaa,
        unlockFloor: 160,
        description: 'Hypnotic attacker that lures you close!'
    },
    COLOSSUS: {
        name: 'Colossus',
        color: 0x777788,
        unlockFloor: 162,
        description: 'Walking statue of immense power!'
    },
    REVENANT: {
        name: 'Revenant',
        color: 0x445544,
        unlockFloor: 163,
        description: 'Undead warrior seeking revenge!'
    },
    GOLEM_FIRE: {
        name: 'Fire Golem',
        color: 0x884422,
        unlockFloor: 164,
        description: 'Burning stone that ignites everything!'
    },
    GOLEM_ICE: {
        name: 'Ice Golem',
        color: 0x6688aa,
        unlockFloor: 165,
        description: 'Frozen stone that chills to the bone!'
    },
    VAMPIRE_LORD: {
        name: 'Vampire Lord',
        color: 0x330022,
        unlockFloor: 166,
        description: 'Master vampire with powerful blood magic!'
    },
    NECROMANCER: {
        name: 'Necromancer',
        color: 0x222244,
        unlockFloor: 168,
        description: 'Undead summoner that raises fallen foes!'
    },
    SKELETON_KING: {
        name: 'Skeleton King',
        color: 0xccccbb,
        unlockFloor: 170,
        description: 'Undead ruler commanding bone armies!'
    },
    DRAGON: {
        name: 'Dragon',
        color: 0xcc4422,
        unlockFloor: 172,
        description: 'Legendary beast with devastating fire breath!'
    },
    ARCHDEMON: {
        name: 'Archdemon',
        color: 0x880000,
        unlockFloor: 173,
        description: 'Greater demon lord of the infernal planes!'
    },
    VOID_WALKER: {
        name: 'Void Walker',
        color: 0x220044,
        unlockFloor: 174,
        description: 'Dimension hopper that teleports constantly!'
    },
    COSMIC_HORROR: {
        name: 'Cosmic Horror',
        color: 0x442266,
        unlockFloor: 175,
        description: 'Eldritch being from beyond the stars!'
    },
    WORLD_EATER: {
        name: 'World Eater',
        color: 0x111122,
        unlockFloor: 175,
        description: 'The ultimate enemy - devourer of worlds!'
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
