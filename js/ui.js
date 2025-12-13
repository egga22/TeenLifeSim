// UI Management
const UI = {
    // Initialize UI
    init: function() {
        this.setupEventListeners();
        this.showScreen('start-screen');
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Start screen
        document.getElementById('start-game').addEventListener('click', () => this.startNewGame());
        document.getElementById('load-game').addEventListener('click', () => this.loadGame());
        
        // Game controls
        document.getElementById('save-game-btn').addEventListener('click', () => this.saveGame());
        document.getElementById('advance-time-btn').addEventListener('click', () => this.advanceTime());
        document.getElementById('menu-btn').addEventListener('click', () => this.showMenu());
        
        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
    },
    
    // Show specific screen
    showScreen: function(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    },
    
    // Start new game
    startNewGame: function() {
        const playerName = document.getElementById('player-name').value.trim();
        const playerGender = document.getElementById('player-gender').value;
        
        if (!playerName) {
            alert('Please enter your name!');
            return;
        }
        
        // Initialize game systems
        Game.init(playerName, playerGender);
        Education.init();
        Relationships.init();
        
        // Show game screen
        this.showScreen('game-screen');
        
        // Initial update
        this.updateUI();
        this.addEventLog('Welcome to your teenage years! Make the most of it!', 'success');
        this.updateActivities();
        
        // Check for initial events
        this.checkAndShowEvents();
    },
    
    // Load game
    loadGame: function() {
        const saveData = Storage.load();
        
        if (!saveData) {
            alert('No save file found!');
            return;
        }
        
        // Show game screen
        this.showScreen('game-screen');
        
        // Update UI
        this.updateUI();
        this.addEventLog('Game loaded successfully!', 'success');
        this.updateActivities();
    },
    
    // Save game
    saveGame: function() {
        if (Storage.save()) {
            this.addEventLog('Game saved successfully!', 'success');
        } else {
            this.addEventLog('Failed to save game!', 'danger');
        }
    },
    
    // Update all UI elements
    updateUI: function() {
        this.updateHeader();
        this.updateStats();
        this.updateRelationships();
        this.updateEducation();
        this.updateInventory();
    },
    
    // Update header
    updateHeader: function() {
        document.getElementById('player-display-name').textContent = Game.state.player.name;
        document.getElementById('age-display').textContent = `Age: ${Game.state.player.age}`;
        document.getElementById('date-display').textContent = 
            `${Game.getDayName()}, ${Game.getMonthName()} ${Game.state.time.day}`;
        document.getElementById('time-display').textContent = 
            this.capitalizeFirst(Game.state.time.period);
    },
    
    // Update stats display
    updateStats: function() {
        const stats = Game.state.stats;
        
        // Update stat bars
        this.updateStatBar('health', stats.health);
        this.updateStatBar('energy', stats.energy);
        this.updateStatBar('happiness', stats.happiness);
        this.updateStatBar('intelligence', stats.intelligence);
        this.updateStatBar('social', stats.social);
        this.updateStatBar('fitness', stats.fitness);
        
        // Update values
        document.getElementById('health-value').textContent = Math.round(stats.health);
        document.getElementById('energy-value').textContent = Math.round(stats.energy);
        document.getElementById('happiness-value').textContent = Math.round(stats.happiness);
        document.getElementById('intelligence-value').textContent = Math.round(stats.intelligence);
        document.getElementById('social-value').textContent = Math.round(stats.social);
        document.getElementById('fitness-value').textContent = Math.round(stats.fitness);
        document.getElementById('money-value').textContent = `$${Math.round(stats.money)}`;
        
        // Update grade
        const gradeAverage = Education.state.gradeAverage;
        const letterGrade = Education.getLetterGrade(gradeAverage);
        document.getElementById('grade-value').textContent = `${letterGrade} (${Math.round(gradeAverage)}%)`;
    },
    
    // Update stat bar
    updateStatBar: function(statName, value) {
        const bar = document.getElementById(`${statName}-bar`);
        if (bar) {
            bar.style.width = `${Math.max(0, Math.min(100, value))}%`;
        }
    },
    
    // Update activities list
    updateActivities: function() {
        const activitiesList = document.getElementById('activities-list');
        const activities = Activities.getAvailableActivities();
        
        activitiesList.innerHTML = '';
        
        activities.forEach(activity => {
            const activityDiv = document.createElement('div');
            activityDiv.className = 'activity-item';
            if (!activity.canAfford) {
                activityDiv.style.opacity = '0.5';
            }
            
            activityDiv.innerHTML = `
                <h4>${activity.name}</h4>
                <p>${activity.description}</p>
                <span class="activity-cost">Energy: ${activity.energyCost}</span>
                ${this.getActivityEffectsHTML(activity.effects)}
            `;
            
            if (activity.canAfford) {
                activityDiv.addEventListener('click', () => this.performActivity(activity.id));
            }
            
            activitiesList.appendChild(activityDiv);
        });
    },
    
    // Get activity effects HTML
    getActivityEffectsHTML: function(effects) {
        const effectsArray = [];
        for (const [stat, value] of Object.entries(effects)) {
            if (value > 0) {
                effectsArray.push(`+${value} ${stat}`);
            } else if (value < 0) {
                effectsArray.push(`${value} ${stat}`);
            }
        }
        return effectsArray.length > 0 ? 
            `<span class="activity-effects">${effectsArray.join(', ')}</span>` : '';
    },
    
    // Perform activity
    performActivity: function(activityId) {
        const result = Activities.performActivity(activityId);
        
        if (result.success) {
            this.addEventLog(result.message, 'success');
            this.updateUI();
            this.updateActivities();
            this.checkAndShowEvents();
        } else {
            this.addEventLog(result.message, 'warning');
        }
    },
    
    // Advance time
    advanceTime: function() {
        const oldPeriod = Game.state.time.period;
        Game.advanceTime();
        const newPeriod = Game.state.time.period;
        
        // Attend school if it's a school day during school hours
        if (Game.isSchoolDay() && (newPeriod === 'morning' || newPeriod === 'afternoon')) {
            Education.attendSchool();
            this.addEventLog('You attended school.', 'success');
        }
        
        this.addEventLog(`Time advanced to ${this.capitalizeFirst(newPeriod)}.`, 'success');
        
        this.updateUI();
        this.updateActivities();
        this.checkAndShowEvents();
        
        // Check for game over
        if (Game.state.player.age > Game.MAX_AGE) {
            this.showGameOver();
        }
    },
    
    // Check and show events
    checkAndShowEvents: function() {
        Events.checkForEvents();
        
        if (Events.hasEvents()) {
            const event = Events.getNextEvent();
            this.showEventModal(event);
        }
    },
    
    // Show event modal
    showEventModal: function(event) {
        const modal = document.getElementById('event-modal');
        const title = document.getElementById('modal-title');
        const text = document.getElementById('modal-text');
        const choicesDiv = document.getElementById('modal-choices');
        
        title.textContent = event.category ? this.capitalizeFirst(event.category) : 'Event';
        text.textContent = event.text;
        
        choicesDiv.innerHTML = '';
        
        event.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', () => this.handleEventChoice(event, index));
            choicesDiv.appendChild(btn);
        });
        
        modal.classList.add('active');
    },
    
    // Handle event choice
    handleEventChoice: function(event, choiceIndex) {
        const result = Events.processChoice(event, choiceIndex);
        
        if (result) {
            if (result.success) {
                this.addEventLog(result.message, 'success');
            } else {
                this.addEventLog(result.message, 'warning');
            }
        }
        
        this.closeEventModal();
        this.updateUI();
        
        // Check for more events
        if (Events.hasEvents()) {
            setTimeout(() => {
                const nextEvent = Events.getNextEvent();
                this.showEventModal(nextEvent);
            }, 500);
        }
    },
    
    // Close event modal
    closeEventModal: function() {
        document.getElementById('event-modal').classList.remove('active');
    },
    
    // Add event log entry
    addEventLog: function(message, type = 'info') {
        const eventLog = document.getElementById('event-log');
        const entry = document.createElement('div');
        entry.className = `event-entry ${type}`;
        entry.innerHTML = `<p>${message}</p>`;
        
        eventLog.insertBefore(entry, eventLog.firstChild);
        
        // Keep only last 10 entries
        while (eventLog.children.length > 10) {
            eventLog.removeChild(eventLog.lastChild);
        }
    },
    
    // Update relationships tab
    updateRelationships: function() {
        const relationshipsDiv = document.getElementById('relationships-list');
        const relationships = Relationships.getAllRelationships();
        
        relationshipsDiv.innerHTML = '';
        
        relationships.forEach(rel => {
            const relDiv = document.createElement('div');
            relDiv.className = 'relationship-item';
            
            const status = Relationships.getRelationshipStatus(rel.value);
            
            relDiv.innerHTML = `
                <h4>${rel.name}</h4>
                <p>${this.capitalizeFirst(rel.type)} - ${status}</p>
                <div class="relationship-bar">
                    <div class="relationship-fill" style="width: ${rel.value}%"></div>
                </div>
            `;
            
            relationshipsDiv.appendChild(relDiv);
        });
    },
    
    // Update education tab
    updateEducation: function() {
        const educationDiv = document.getElementById('education-info');
        const subjects = Education.getAllSubjects();
        
        educationDiv.innerHTML = '';
        
        subjects.forEach(subject => {
            const subjectDiv = document.createElement('div');
            subjectDiv.className = 'subject-item';
            
            const letterGrade = Education.getLetterGrade(subject.grade);
            
            subjectDiv.innerHTML = `
                <h4>${subject.name}</h4>
                <p>Grade: ${letterGrade} (${Math.round(subject.grade)}%)</p>
                <p>Study Time: ${subject.studyTime} sessions</p>
            `;
            
            educationDiv.appendChild(subjectDiv);
        });
    },
    
    // Update inventory tab
    updateInventory: function() {
        const inventoryDiv = document.getElementById('inventory-list');
        const inventory = Game.state.inventory;
        
        inventoryDiv.innerHTML = '';
        
        if (inventory.length === 0) {
            inventoryDiv.innerHTML = '<p>Your inventory is empty.</p>';
            return;
        }
        
        inventory.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.innerHTML = `
                <h4>${item.name}</h4>
                <span class="quantity">x${item.quantity}</span>
            `;
            inventoryDiv.appendChild(itemDiv);
        });
    },
    
    // Switch tab
    switchTab: function(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    },
    
    // Show menu
    showMenu: function() {
        const shouldQuit = confirm('Return to main menu? (Make sure to save first!)');
        if (shouldQuit) {
            this.showScreen('start-screen');
        }
    },
    
    // Show game over
    showGameOver: function() {
        alert('You\'ve reached adulthood! The game ends here. Thanks for playing!');
        this.showScreen('start-screen');
    },
    
    // Capitalize first letter
    capitalizeFirst: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};
