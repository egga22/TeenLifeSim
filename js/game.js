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
        
        // Actions system (replaces energy)
        actions: {
            current: 8,
            max: 8
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
            schoolYear: 1,
            semester: 1
        },
        
        // School status
        school: {
            wentToSchool: false,
            skippedToday: false,
            saturdayDetention: false,
            grounded: false,
            groundedDaysLeft: 0,
            noAllowanceDaysLeft: 0,
            didMandatoryChores: false
        },
        
        // Inventory
        inventory: []
    },
    
    // Constants
    STATS_MIN: 0,
    STATS_MAX: 100,
    MAX_AGE: 18,
    ACTIONS_SCHOOL: 3,
    ACTIONS_FREE: 8,
    
    // Initialize game
    init: function(playerName, playerGender) {
        this.state.player.name = playerName;
        this.state.player.gender = playerGender;
        this.state.player.age = 15;
        this.resetStats();
        this.resetSchoolStatus();
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
            current: this.ACTIONS_FREE,
            max: this.ACTIONS_FREE
        };
    },
    
    // Reset school status
    resetSchoolStatus: function() {
        this.state.school = {
            wentToSchool: false,
            skippedToday: false,
            saturdayDetention: false,
            grounded: false,
            groundedDaysLeft: 0,
            noAllowanceDaysLeft: 0,
            didMandatoryChores: false
        };
    },
    
    // Use an action
    useAction: function(cost = 1) {
        if (this.state.actions.current >= cost) {
            this.state.actions.current -= cost;
            return true;
        }
        return false;
    },
    
    // Check if player has enough actions
    hasActions: function(cost = 1) {
        return this.state.actions.current >= cost;
    },
    
    // Set actions for the day based on school attendance
    setDailyActions: function(wentToSchool) {
        if (wentToSchool) {
            this.state.actions.current = this.ACTIONS_SCHOOL;
            this.state.actions.max = this.ACTIONS_SCHOOL;
        } else {
            this.state.actions.current = this.ACTIONS_FREE;
            this.state.actions.max = this.ACTIONS_FREE;
        }
    },
    
    // Handle skipping school consequences
    handleSkipSchool: function() {
        const roll = Math.random();
        
        if (roll < 0.50) {
            // 50% chance: Got away with it
            return {
                result: 'success',
                message: 'You successfully skipped school without getting caught!'
            };
        } else if (roll < 0.75) {
            // 25% chance: Saturday detention
            this.state.school.saturdayDetention = true;
            return {
                result: 'detention',
                message: 'You got caught! You have Saturday detention this week.'
            };
        } else {
            // 25% chance: Grounded by parents
            this.state.school.grounded = true;
            this.state.school.groundedDaysLeft = 7;
            this.state.school.noAllowanceDaysLeft = 7;
            return {
                result: 'grounded',
                message: 'Your parents found out! You\'re grounded for a week - no allowance and mandatory chores each day.'
            };
        }
    },
    
    // Check if player is grounded
    isGrounded: function() {
        return this.state.school.grounded && this.state.school.groundedDaysLeft > 0;
    },
    
    // Get weekly allowance (if not grounded)
    getWeeklyAllowance: function() {
        if (this.state.school.noAllowanceDaysLeft > 0) {
            return 0;
        }
        return 20; // Base weekly allowance
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
        
        // Reset school status for new day
        this.state.school.wentToSchool = false;
        this.state.school.skippedToday = false;
        this.state.school.didMandatoryChores = false;
        
        // Decrement grounded days
        if (this.state.school.groundedDaysLeft > 0) {
            this.state.school.groundedDaysLeft--;
            if (this.state.school.groundedDaysLeft === 0) {
                this.state.school.grounded = false;
            }
        }
        
        // Decrement no allowance days
        if (this.state.school.noAllowanceDaysLeft > 0) {
            this.state.school.noAllowanceDaysLeft--;
        }
        
        // Clear Saturday detention after Saturday
        if (this.state.time.dayOfWeek === 7) { // Sunday
            this.state.school.saturdayDetention = false;
        }
        
        // Give weekly allowance on Sunday (if not grounded)
        if (this.state.time.dayOfWeek === 7 && this.state.school.noAllowanceDaysLeft === 0) {
            this.modifyStat('money', this.getWeeklyAllowance());
        }
        
        // Set default actions for the day (will be adjusted if school day)
        if (this.isWeekend()) {
            this.setDailyActions(false); // 8 actions on weekends
        }
        // Note: School day actions are set after player chooses to go or skip
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
    
    // Get day name (dayOfWeek: 1=Monday, 2=Tuesday, ..., 6=Saturday, 7=Sunday)
    getDayName: function() {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const index = Math.max(0, Math.min(6, (this.state.time.dayOfWeek - 1)));
        return days[index];
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
    
    // Check if it's weekend (Saturday = 6, Sunday = 7)
    isWeekend: function() {
        return this.state.time.dayOfWeek === 6 || this.state.time.dayOfWeek === 7;
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
