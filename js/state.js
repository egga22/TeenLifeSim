// State Management System
// Centralized game state with observer pattern for reactive updates

const GameState = {
    // Game metadata
    initialized: false,
    currentScreen: 'start',
    
    // Time tracking
    time: {
        day: 1,
        period: 'morning', // morning, afternoon, evening, night
        periodsPerDay: 4
    },
    
    // Character data
    character: {
        name: '',
        attributes: {
            health: 100,
            happiness: 100,
            energy: 100,
            grades: 75,
            money: 50
        }
    },
    
    // Relationships
    relationships: {},
    
    // Inventory
    inventory: {},
    
    // Activity log
    log: [],
    
    // Observers for reactive updates
    observers: [],
    
    // Initialize game state
    init: function(characterName) {
        this.character.name = characterName;
        this.initialized = true;
        this.notify('init');
    },
    
    // Observer pattern for reactive UI updates
    subscribe: function(observer) {
        this.observers.push(observer);
    },
    
    notify: function(event, data) {
        this.observers.forEach(observer => {
            if (typeof observer === 'function') {
                observer(event, data);
            }
        });
    },
    
    // Update character attributes
    updateAttribute: function(attribute, value) {
        if (this.character.attributes.hasOwnProperty(attribute)) {
            this.character.attributes[attribute] += value;
            
            // Clamp values
            if (attribute === 'money') {
                this.character.attributes[attribute] = Math.max(0, this.character.attributes[attribute]);
            } else {
                this.character.attributes[attribute] = Math.max(0, Math.min(100, this.character.attributes[attribute]));
            }
            
            this.notify('attributeUpdate', { attribute, value: this.character.attributes[attribute] });
        }
    },
    
    // Get attribute value
    getAttribute: function(attribute) {
        return this.character.attributes[attribute] || 0;
    },
    
    // Advance time
    advanceTime: function() {
        const periods = ['morning', 'afternoon', 'evening', 'night'];
        const currentIndex = periods.indexOf(this.time.period);
        
        if (currentIndex < periods.length - 1) {
            this.time.period = periods[currentIndex + 1];
        } else {
            this.time.period = 'morning';
            this.time.day++;
        }
        
        // Daily stat changes
        if (this.time.period === 'morning') {
            this.updateAttribute('health', -2);
            this.updateAttribute('grades', -1);
        }
        
        this.notify('timeUpdate', { day: this.time.day, period: this.time.period });
    },
    
    // Add to activity log
    addLog: function(message) {
        const logEntry = {
            day: this.time.day,
            period: this.time.period,
            message: message
        };
        this.log.unshift(logEntry);
        
        // Keep only last 20 entries
        if (this.log.length > 20) {
            this.log.pop();
        }
        
        this.notify('logUpdate', logEntry);
    },
    
    // Screen management
    setScreen: function(screenName) {
        this.currentScreen = screenName;
        this.notify('screenChange', screenName);
    },
    
    // Save game state to localStorage
    save: function() {
        try {
            const saveData = {
                time: this.time,
                character: this.character,
                relationships: this.relationships,
                inventory: this.inventory,
                log: this.log
            };
            localStorage.setItem('teenLifeSimSave', JSON.stringify(saveData));
            this.addLog('Game saved successfully!');
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    },
    
    // Load game state from localStorage
    load: function() {
        try {
            const saveData = localStorage.getItem('teenLifeSimSave');
            if (saveData) {
                const data = JSON.parse(saveData);
                this.time = data.time || this.time;
                this.character = data.character || this.character;
                this.relationships = data.relationships || {};
                this.inventory = data.inventory || {};
                this.log = data.log || [];
                this.initialized = true;
                this.notify('load');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to load game:', error);
            return false;
        }
    }
};
