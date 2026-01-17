// ELEVATOR PANIC - Main Game Configuration

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: COLORS.BACKGROUND,
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene]
};

// Initialize the game
const game = new Phaser.Game(config);

// Load saved shop data
let savedShop = null;
try {
    savedShop = JSON.parse(localStorage.getItem('pixelPanicShop'));
} catch (e) {
    savedShop = null;
}

// Load saved achievements data
let savedAchievements = null;
try {
    savedAchievements = JSON.parse(localStorage.getItem('pixelPanicAchievements'));
} catch (e) {
    savedAchievements = null;
}

// Global game state
window.gameState = {
    highScore: parseInt(localStorage.getItem('pixelPanicHighScore')) || 0,
    soundEnabled: true,
    lastScore: 0,
    lastFloor: 0,
    coinsCollected: false,
    shop: savedShop || {
        coins: 0,
        unlockedSkins: ['default'],
        unlockedAreas: ['LOBBY'],
        unlockedBuildings: ['STARTER'],
        unlockedParticles: ['DEFAULT'],
        encounteredMonsters: [],
        selectedSkin: 'default',
        selectedParticle: 'DEFAULT',
        startingArea: 'LOBBY'
    }
};

// Ensure unlockedBuildings exists for older saves
if (window.gameState.shop && !window.gameState.shop.unlockedBuildings) {
    window.gameState.shop.unlockedBuildings = ['STARTER'];
}

// Ensure encounteredMonsters exists for older saves
if (window.gameState.shop && !window.gameState.shop.encounteredMonsters) {
    window.gameState.shop.encounteredMonsters = [];
}

// Ensure unlockedParticles exists for older saves
if (window.gameState.shop && !window.gameState.shop.unlockedParticles) {
    window.gameState.shop.unlockedParticles = ['DEFAULT'];
}

// Ensure selectedParticle exists for older saves
if (window.gameState.shop && !window.gameState.shop.selectedParticle) {
    window.gameState.shop.selectedParticle = 'DEFAULT';
}

// Load achievements
window.gameState.achievements = savedAchievements || {
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
