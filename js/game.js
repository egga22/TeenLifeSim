// Main Game Initialization

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create instances
    const stateManager = new StateManager();
    const character = new Character(stateManager);
    const eventSystem = new EventSystem(stateManager);
    const geminiAPI = new GeminiAPI();
    const gameEngine = new GameEngine(stateManager, character, eventSystem, geminiAPI);
    const uiController = new UIController(gameEngine, stateManager);

    // Initialize game
    gameEngine.init();
    uiController.init();

    // Make game available globally for debugging
    window.game = {
        stateManager,
        character,
        eventSystem,
        geminiAPI,
        gameEngine,
        uiController
    };

    console.log('Teen Life Simulator initialized!');
    console.log('Game version:', CONFIG.version);
});
