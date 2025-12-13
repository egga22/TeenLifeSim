// Game Engine - Core game loop and logic

class GameEngine {
    constructor(stateManager, character, eventSystem, geminiAPI) {
        this.stateManager = stateManager;
        this.character = character;
        this.eventSystem = eventSystem;
        this.geminiAPI = geminiAPI;
        this.currentEvent = null;
    }

    // Initialize game
    init() {
        // Load settings
        this.stateManager.loadSettings();
        
        // Try to load saved game
        const loaded = this.stateManager.loadGame();
        
        if (!loaded) {
            // Start new game
            this.startNewGame();
        } else {
            // Resume game with current event
            this.loadCurrentEvent();
        }
    }

    // Start new game
    startNewGame() {
        this.stateManager.resetGame();
        this.generateNewEvent();
    }

    // Generate new event
    async generateNewEvent() {
        const state = this.stateManager.getState();
        
        // Check if using AI and API is configured
        if (state.settings.useAI && this.geminiAPI.isConfigured()) {
            try {
                const context = this.buildContext();
                const event = await this.geminiAPI.generateEvent(context);
                this.currentEvent = event;
            } catch (error) {
                console.error('AI generation failed, using fallback:', error);
                // Fallback to regular events
                this.currentEvent = this.eventSystem.getRandomEvent();
            }
        } else {
            // Use pre-defined events
            this.currentEvent = this.eventSystem.getRandomEvent();
        }

        // Update state with current event
        this.stateManager.setState({
            currentEvent: this.currentEvent
        });
    }

    // Load current event from state
    loadCurrentEvent() {
        const state = this.stateManager.getState();
        if (state.currentEvent) {
            this.currentEvent = state.currentEvent;
        } else {
            this.generateNewEvent();
        }
    }

    // Build context for AI
    buildContext() {
        const state = this.stateManager.getState();
        return {
            character: state.character,
            time: state.time,
            relationships: state.relationships,
            recentHistory: state.history.slice(0, 5)
        };
    }

    // Handle player choice
    async handleChoice(choiceIndex) {
        if (!this.currentEvent || !this.currentEvent.choices[choiceIndex]) {
            console.error('Invalid choice');
            return;
        }

        const choice = this.currentEvent.choices[choiceIndex];
        
        // Apply stat changes
        if (choice.effects) {
            this.stateManager.updateStats(choice.effects);
        }

        // Apply relationship changes
        if (choice.relationship) {
            this.stateManager.updateRelationship(
                choice.relationship.name,
                choice.relationship.change,
                choice.relationship.type || 'friend'
            );
        }

        // Get result text (potentially enhanced by AI)
        let resultText = choice.resultText;
        if (this.stateManager.getState().settings.useAI && this.geminiAPI.isConfigured()) {
            try {
                const context = this.buildContext();
                resultText = await this.geminiAPI.generateChoiceOutcome(
                    this.currentEvent,
                    choice,
                    context
                );
            } catch (error) {
                console.error('Failed to enhance result:', error);
            }
        }

        // Add to history
        this.stateManager.addToHistory({
            eventTitle: this.currentEvent.title,
            choiceText: choice.text,
            resultText: resultText,
            effects: choice.effects,
            type: this.determineLogType(choice.effects)
        });

        return resultText;
    }

    // Determine log entry type based on effects
    determineLogType(effects) {
        if (!effects) return 'neutral';
        
        const total = Object.values(effects).reduce((sum, val) => sum + val, 0);
        
        if (total > 5) return 'positive';
        if (total < -5) return 'negative';
        return 'neutral';
    }

    // Advance to next day
    async nextDay() {
        // Check if game is over before advancing
        if (this.stateManager.isGameOver()) {
            return { gameOver: true };
        }

        // Advance time
        this.stateManager.advanceDay();

        // Save game state
        this.stateManager.saveGame();

        // Generate new event
        await this.generateNewEvent();

        // Check if game is over after advancing
        if (this.stateManager.isGameOver()) {
            return { gameOver: true };
        }

        return { gameOver: false };
    }

    // Get current event
    getCurrentEvent() {
        return this.currentEvent;
    }

    // Save game
    saveGame() {
        return this.stateManager.saveGame();
    }

    // Load game
    loadGame() {
        const success = this.stateManager.loadGame();
        if (success) {
            this.loadCurrentEvent();
        }
        return success;
    }

    // Update settings
    updateSettings(settings) {
        // Update API key if provided
        if (settings.apiKey !== undefined) {
            this.geminiAPI.setApiKey(settings.apiKey);
        }

        // Update character name if provided
        if (settings.characterName) {
            this.character.setName(settings.characterName);
        }

        // Save settings
        this.stateManager.saveSettings({
            useAI: settings.useAI !== undefined ? settings.useAI : this.stateManager.getState().settings.useAI,
            apiKey: settings.apiKey !== undefined ? settings.apiKey : this.stateManager.getState().settings.apiKey
        });
    }

    // Get game statistics
    getStatistics() {
        const state = this.stateManager.getState();
        return {
            daysPlayed: state.time.totalDays,
            currentAge: state.character.age,
            currentGrade: state.character.grade,
            eventsExperienced: state.history.length,
            relationships: state.relationships.length,
            wellbeingScore: this.character.getWellbeingScore(),
            academicScore: this.character.getAcademicScore(),
            socialScore: this.character.getSocialScore()
        };
    }
}
