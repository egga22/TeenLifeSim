// Main Game Loop and Initialization
// Entry point for the game

// Game configuration
const GameConfig = {
    version: '1.0.0-beta',
    debug: false
};

// Game loop state
const GameLoop = {
    running: false,
    lastUpdate: 0,
    
    // Start game loop
    start: function() {
        if (this.running) return;
        
        this.running = true;
        this.lastUpdate = Date.now();
        this.update();
    },
    
    // Main update loop
    update: function() {
        if (!this.running) return;
        
        const now = Date.now();
        const delta = now - this.lastUpdate;
        
        // Game tick logic (if needed for animations, etc.)
        // Currently we use an event-driven model
        
        this.lastUpdate = now;
        
        // Continue loop
        requestAnimationFrame(() => this.update());
    },
    
    // Stop game loop
    stop: function() {
        this.running = false;
    }
};

// Auto-save functionality
const AutoSave = {
    interval: 60000, // 60 seconds
    timer: null,
    
    start: function() {
        this.timer = setInterval(() => {
            if (GameState.initialized) {
                GameState.save();
            }
        }, this.interval);
    },
    
    stop: function() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
};

// Game initialization
function initGame() {
    console.log(`Teen Life Simulator v${GameConfig.version}`);
    console.log('Initializing game...');
    
    // Initialize UI
    UIManager.init();
    
    // Try to load saved game
    const loaded = GameState.load();
    if (loaded) {
        console.log('Save game loaded!');
        UIManager.updateCharacterName();
        UIManager.updateAllStats();
        UIManager.updateRelationships();
        UIManager.updateInventory();
        UIManager.updateTime();
        UIManager.switchScreen('activities');
        UIManager.renderActivities();
        
        // Restore log
        GameState.log.forEach(entry => {
            UIManager.addLogEntry(entry);
        });
    } else {
        console.log('No save game found. Starting fresh.');
        UIManager.switchScreen('start');
    }
    
    // Start game loop
    GameLoop.start();
    
    // Start auto-save
    AutoSave.start();
    
    // Save on page unload
    window.addEventListener('beforeunload', () => {
        if (GameState.initialized) {
            GameState.save();
        }
    });
    
    console.log('Game initialized successfully!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

// Debug helpers (accessible from console)
if (GameConfig.debug) {
    window.GameDebug = {
        state: GameState,
        character: CharacterManager,
        relationships: RelationshipsManager,
        inventory: InventoryManager,
        events: EventsManager,
        activities: ActivitiesManager,
        ui: UIManager,
        
        // Cheat functions
        addMoney: (amount) => {
            GameState.updateAttribute('money', amount);
            console.log(`Added $${amount}`);
        },
        
        maxStats: () => {
            GameState.updateAttribute('health', 100);
            GameState.updateAttribute('happiness', 100);
            GameState.updateAttribute('energy', 100);
            GameState.updateAttribute('grades', 100);
            console.log('All stats maxed!');
        },
        
        triggerEvent: (eventId) => {
            const event = EventsManager.eventDefinitions.find(e => e.id === eventId);
            if (event) {
                UIManager.showEvent(event);
                console.log(`Triggered event: ${event.title}`);
            } else {
                console.log('Event not found');
            }
        },
        
        listEvents: () => {
            console.log('Available events:');
            EventsManager.eventDefinitions.forEach(e => {
                console.log(`- ${e.id}: ${e.title}`);
            });
        },
        
        clearSave: () => {
            localStorage.removeItem('teenLifeSimSave');
            console.log('Save cleared! Reload page to start fresh.');
        }
    };
    
    console.log('Debug mode enabled! Access via window.GameDebug');
}
