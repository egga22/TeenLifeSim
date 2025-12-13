// Core Game State Management
const Game = {
    state: {
        // Player data
        player: {
            name: '',
            gender: 'male',
            age: 15,
            birthday: { month: 9, day: 1 }
        },
        
        // Stats (0-100)
        stats: {
            health: 100,
            happiness: 100,
            intelligence: 50,
            popularity: 50,
            fitness: 50,
            money: 0
        },
        
        // Actions system
        actions: {
            available: 8,
            max: 8,
            attendedSchool: false,
            skippedSchool: false
        },
        
        // Grounding system
        grounding: {
            isGrounded: false,
            daysRemaining: 0,
            mandatoryChoresDone: false
        },
        
        // Saturday detention tracking
        saturdayDetention: {
            hasDetention: false
        },
        
        // Time management
        time: {
            year: 2024,
            month: 9, // September (start of school year)
            day: 1,
            dayOfWeek: 1, // 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
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
            happiness: 100,
            intelligence: 50,
            popularity: 50,
            fitness: 50,
            money: 0
        };
        this.state.actions = {
            available: 8,
            max: 8,
            attendedSchool: false,
            skippedSchool: false
        };
        this.state.grounding = {
            isGrounded: false,
            daysRemaining: 0,
            mandatoryChoresDone: false
        };
        this.state.saturdayDetention = {
            hasDetention: false
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
        
        // Advance day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
        this.state.time.dayOfWeek = (this.state.time.dayOfWeek + 1) % 7;
        
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
        
        // Reset daily actions
        this.state.actions.available = 8; // Default for weekends/skip
        this.state.actions.attendedSchool = false;
        this.state.actions.skippedSchool = false;
        
        // Handle grounding countdown
        if (this.state.grounding.isGrounded) {
            this.state.grounding.daysRemaining--;
            this.state.grounding.mandatoryChoresDone = false;
            if (this.state.grounding.daysRemaining <= 0) {
                this.state.grounding.isGrounded = false;
            }
        }
        
        // Handle Saturday detention
        if (this.state.saturdayDetention.hasDetention && this.state.time.dayOfWeek === 6) {
            this.state.actions.available = 0; // No actions on detention day
        }
    },
    
    // Apply time-based effects
    applyTimeEffects: function() {
        // Happiness slowly decreases if not maintained
        if (this.state.stats.happiness > 60) {
            this.modifyStat('happiness', -1);
        }
        
        // Health management
        if (this.state.stats.health < 100) {
            this.modifyStat('health', 1); // Slow regeneration
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
    
    // Make school decision - attend school
    attendSchool: function() {
        this.state.actions.attendedSchool = true;
        this.state.actions.skippedSchool = false;
        this.state.actions.available = 3;
        this.state.actions.max = 3;
        return { success: true, message: 'You attended school today. You have 3 actions available.' };
    },
    
    // Make school decision - skip school
    skipSchool: function() {
        this.state.actions.skippedSchool = true;
        this.state.actions.attendedSchool = false;
        this.state.actions.available = 8;
        this.state.actions.max = 8;
        
        // Determine consequence (50% safe, 25% detention, 25% grounded)
        const roll = Math.random();
        let consequence = null;
        
        if (roll < 0.5) {
            // Got away with it!
            consequence = { type: 'safe', message: 'You got away with skipping school! 8 actions available.' };
        } else if (roll < 0.75) {
            // Saturday detention
            this.state.saturdayDetention.hasDetention = true;
            consequence = { 
                type: 'detention', 
                message: 'You got caught skipping! You have Saturday detention. 8 actions today, but you\'ll lose your Saturday.' 
            };
        } else {
            // Grounded
            this.state.grounding.isGrounded = true;
            this.state.grounding.daysRemaining = 7;
            this.state.grounding.mandatoryChoresDone = false;
            consequence = { 
                type: 'grounded', 
                message: 'Your parents found out you skipped school! You\'re grounded for a week (no allowance + mandatory chores each day). 8 actions today.' 
            };
        }
        
        return { success: true, consequence: consequence };
    },
    
    // Use an action
    useAction: function() {
        if (this.state.actions.available > 0) {
            this.state.actions.available--;
            return true;
        }
        return false;
    },
    
    // Check if actions are available
    hasActionsAvailable: function() {
        return this.state.actions.available > 0;
    },
    
    // Complete mandatory chores (when grounded)
    completeMandatoryChores: function() {
        if (this.state.grounding.isGrounded && !this.state.grounding.mandatoryChoresDone) {
            this.state.grounding.mandatoryChoresDone = true;
            return { success: true, message: 'You completed your mandatory chores for today.' };
        }
        return { success: false, message: 'No mandatory chores to complete.' };
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
