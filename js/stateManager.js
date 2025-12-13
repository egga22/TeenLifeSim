// State Management System

class StateManager {
    constructor() {
        this.state = this.getInitialState();
        this.observers = [];
    }

    getInitialState() {
        return {
            character: {
                name: 'Alex',
                age: CONFIG.startingAge,
                grade: CONFIG.startingGrade,
                stats: { ...CONFIG.initialStats }
            },
            time: {
                day: 1,
                week: 1,
                month: 1,
                year: 1,
                totalDays: 0,
                season: 'Fall',
                dayOfWeek: 1 // 1 = Monday
            },
            relationships: [],
            history: [],
            currentEvent: null,
            settings: {
                useAI: false,
                apiKey: ''
            }
        };
    }

    // Subscribe to state changes
    subscribe(observer) {
        this.observers.push(observer);
    }

    // Notify all observers of state changes
    notify() {
        this.observers.forEach(observer => observer(this.state));
    }

    // Get current state
    getState() {
        return this.state;
    }

    // Update state
    setState(updates) {
        this.state = {
            ...this.state,
            ...updates
        };
        this.notify();
    }

    // Update character stats
    updateStats(changes) {
        const newStats = { ...this.state.character.stats };
        
        Object.keys(changes).forEach(stat => {
            if (newStats[stat] !== undefined) {
                newStats[stat] += changes[stat];
                // Clamp values between min and max
                newStats[stat] = Math.max(
                    CONFIG.statLimits.min,
                    Math.min(CONFIG.statLimits.max, newStats[stat])
                );
            }
        });

        this.setState({
            character: {
                ...this.state.character,
                stats: newStats
            }
        });
    }

    // Add or update relationship
    updateRelationship(name, change, type = 'friend') {
        const relationships = [...this.state.relationships];
        const existingIndex = relationships.findIndex(r => r.name === name);

        if (existingIndex >= 0) {
            relationships[existingIndex].value = Math.max(0, Math.min(100, 
                relationships[existingIndex].value + change));
        } else {
            relationships.push({
                name,
                value: Math.max(0, Math.min(100, 50 + change)),
                type
            });
        }

        this.setState({ relationships });
    }

    // Add event to history
    addToHistory(event) {
        const history = [...this.state.history];
        history.unshift({
            ...event,
            day: this.state.time.totalDays,
            timestamp: Date.now()
        });

        // Keep last 50 events
        if (history.length > 50) {
            history.pop();
        }

        this.setState({ history });
    }

    // Progress time
    advanceDay() {
        const time = { ...this.state.time };
        time.day++;
        time.totalDays++;
        time.dayOfWeek = (time.dayOfWeek % 7) + 1;

        // Week progression
        if (time.day > CONFIG.daysInWeek) {
            time.day = 1;
            time.week++;
        }

        // Month progression
        if (time.week > CONFIG.weeksInMonth) {
            time.week = 1;
            time.month++;
        }

        // Year progression
        if (time.month > CONFIG.monthsInYear) {
            time.month = 1;
            time.year++;
            
            // Age and grade progression
            const character = { ...this.state.character };
            character.age++;
            if (character.grade < 12) {
                character.grade++;
            }
            
            this.setState({ character });
        }

        // Season calculation
        const seasonIndex = Math.floor(((time.month - 1) / 3)) % 4;
        time.season = CONFIG.seasons[seasonIndex];

        this.setState({ time });

        // Daily stat changes (energy recovery, etc.)
        this.applyDailyStatChanges();
    }

    // Apply daily stat changes
    applyDailyStatChanges() {
        const time = this.state.time;
        
        // Energy recovers slightly each day
        const energyRecovery = time.dayOfWeek === 6 || time.dayOfWeek === 7 ? 15 : 5;
        
        // Health slowly recovers
        const healthRecovery = this.state.character.stats.health < 70 ? 2 : 1;

        this.updateStats({
            energy: energyRecovery,
            health: healthRecovery
        });
    }

    // Save game state to localStorage
    saveGame() {
        try {
            localStorage.setItem(
                CONFIG.storageKeys.gameState,
                JSON.stringify(this.state)
            );
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    // Load game state from localStorage
    loadGame() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKeys.gameState);
            if (saved) {
                this.state = JSON.parse(saved);
                this.notify();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to load game:', error);
            return false;
        }
    }

    // Save settings
    saveSettings(settings) {
        this.setState({
            settings: {
                ...this.state.settings,
                ...settings
            }
        });

        try {
            localStorage.setItem(
                CONFIG.storageKeys.settings,
                JSON.stringify(this.state.settings)
            );
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }

    // Load settings
    loadSettings() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKeys.settings);
            if (saved) {
                const settings = JSON.parse(saved);
                this.setState({ settings });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to load settings:', error);
            return false;
        }
    }

    // Reset game state
    resetGame() {
        this.state = this.getInitialState();
        this.notify();
        localStorage.removeItem(CONFIG.storageKeys.gameState);
    }

    // Check if game is over
    isGameOver() {
        const stats = this.state.character.stats;
        // Game over if any critical stat reaches 0
        return stats.happiness <= 0 || stats.health <= 0;
    }

    // Get game over message
    getGameOverMessage() {
        const stats = this.state.character.stats;
        if (stats.health <= 0) {
            return 'Your health has deteriorated too much. Take better care of yourself!';
        }
        if (stats.happiness <= 0) {
            return 'Your happiness has reached rock bottom. Remember to take care of your mental health!';
        }
        return 'Game Over';
    }
}
