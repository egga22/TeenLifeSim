// Core Game State Management
const Game = {
    state: {
        // Player data
        player: {
            name: '',
            gender: 'male',
            age: 13,
            birthday: { month: 9, day: 1 }
        },
        
        // Stats (0-100)
        stats: {
            health: 100,
            energy: 100,
            happiness: 100,
            intelligence: 50,
            social: 50,
            fitness: 50,
            money: 0
        },
        
        // Time management
        time: {
            year: 2024,
            month: 9, // September (start of school year)
            day: 1,
            dayOfWeek: 1, // Monday
            period: 'morning', // morning, afternoon, evening, night
            periodsInDay: 0
        },
        
        // Progress tracking
        progress: {
            daysPlayed: 0,
            schoolYear: 1, // 1-6 (13-18 years old)
            semester: 1
        },
        
        // Inventory
        inventory: []
    },
    
    // Constants
    STATS_MIN: 0,
    STATS_MAX: 100,
    MAX_AGE: 18,
    
    // Initialize game
    init: function(playerName, playerGender) {
        this.state.player.name = playerName;
        this.state.player.gender = playerGender;
        this.resetStats();
    },
    
    // Reset stats to starting values
    resetStats: function() {
        this.state.stats = {
            health: 100,
            energy: 100,
            happiness: 100,
            intelligence: 50,
            social: 50,
            fitness: 50,
            money: 0
        };
    },
    
    // Modify stat with bounds checking
    modifyStat: function(stat, amount) {
        if (this.state.stats.hasOwnProperty(stat)) {
            this.state.stats[stat] += amount;
            
            // Clamp values (except money which can be negative)
            if (stat !== 'money') {
                this.state.stats[stat] = Math.max(
                    this.STATS_MIN,
                    Math.min(this.STATS_MAX, this.state.stats[stat])
                );
            }
            
            return true;
        }
        return false;
    },
    
    // Get stat value
    getStat: function(stat) {
        return this.state.stats[stat] || 0;
    },
    
    // Add item to inventory
    addItem: function(item, quantity = 1) {
        const existingItem = this.state.inventory.find(i => i.name === item);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.state.inventory.push({ name: item, quantity: quantity });
        }
    },
    
    // Remove item from inventory
    removeItem: function(item, quantity = 1) {
        const existingItem = this.state.inventory.find(i => i.name === item);
        if (existingItem) {
            existingItem.quantity -= quantity;
            if (existingItem.quantity <= 0) {
                this.state.inventory = this.state.inventory.filter(i => i.name !== item);
            }
            return true;
        }
        return false;
    },
    
    // Time advancement
    advanceTime: function() {
        const periods = ['morning', 'afternoon', 'evening', 'night'];
        const currentPeriodIndex = periods.indexOf(this.state.time.period);
        
        // Move to next period
        if (currentPeriodIndex < periods.length - 1) {
            this.state.time.period = periods[currentPeriodIndex + 1];
            this.state.time.periodsInDay++;
        } else {
            // Advance to next day
            this.advanceDay();
        }
        
        // Natural stat changes over time
        this.applyTimeEffects();
        
        return this.state.time.period;
    },
    
    // Advance to next day
    advanceDay: function() {
        this.state.time.period = 'morning';
        this.state.time.periodsInDay = 0;
        this.state.progress.daysPlayed++;
        
        // Advance day of week
        this.state.time.dayOfWeek = (this.state.time.dayOfWeek % 7) + 1;
        
        // Advance calendar day
        this.state.time.day++;
        
        // Get days in current month
        const daysInMonth = this.getDaysInMonth(this.state.time.month, this.state.time.year);
        
        if (this.state.time.day > daysInMonth) {
            this.state.time.day = 1;
            this.state.time.month++;
            
            if (this.state.time.month > 12) {
                this.state.time.month = 1;
                this.state.time.year++;
            }
        }
        
        // Check for birthday
        if (this.state.time.month === this.state.player.birthday.month && 
            this.state.time.day === this.state.player.birthday.day) {
            this.celebrateBirthday();
        }
        
        // Reset daily stats
        this.state.stats.energy = 100;
    },
    
    // Apply time-based effects
    applyTimeEffects: function() {
        // Energy decreases throughout the day
        this.modifyStat('energy', -5);
        
        // Happiness slowly decreases if not maintained
        if (this.state.stats.happiness > 60) {
            this.modifyStat('happiness', -1);
        }
        
        // Health management
        if (this.state.stats.health < 100) {
            this.modifyStat('health', 1); // Slow regeneration
        }
        
        // Low energy affects health
        if (this.state.stats.energy < 20) {
            this.modifyStat('health', -2);
        }
    },
    
    // Birthday celebration
    celebrateBirthday: function() {
        this.state.player.age++;
        this.modifyStat('happiness', 10);
        
        if (this.state.player.age > this.MAX_AGE) {
            // Game ends at 18
            return 'game_over';
        }
        
        return 'birthday';
    },
    
    // Get days in month
    getDaysInMonth: function(month, year) {
        return new Date(year, month, 0).getDate();
    },
    
    // Get day name
    getDayName: function() {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[this.state.time.dayOfWeek % 7];
    },
    
    // Get month name
    getMonthName: function() {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[this.state.time.month - 1];
    },
    
    // Check if it's a school day
    isSchoolDay: function() {
        return this.state.time.dayOfWeek >= 1 && this.state.time.dayOfWeek <= 5;
    },
    
    // Check if it's weekend
    isWeekend: function() {
        return this.state.time.dayOfWeek === 0 || this.state.time.dayOfWeek === 6;
    },
    
    // Get current state for saving
    getState: function() {
        return JSON.parse(JSON.stringify(this.state));
    },
    
    // Load state
    loadState: function(savedState) {
        this.state = JSON.parse(JSON.stringify(savedState));
    }
};
