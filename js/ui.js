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
            this.showNotification('Error', 'Please enter your name!');
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
        
        // Check if starting on a school day
        if (Game.isSchoolDay() && Game.state.time.period === 'morning') {
            this.showSchoolChoice();
        } else {
            // Weekend - set 8 actions
            Game.setDailyActions(false);
            this.checkAndShowEvents();
        }
    },
    
    // Load game
    loadGame: function() {
        const saveData = Storage.load();
        
        if (!saveData) {
            this.showNotification('Error', 'No save file found!');
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
        const actions = Game.state.actions;
        
        // Update stat bars
        this.updateStatBar('health', stats.health);
        this.updateStatBar('actions', (actions.current / actions.max) * 100);
        this.updateStatBar('happiness', stats.happiness);
        this.updateStatBar('intelligence', stats.intelligence);
        this.updateStatBar('popularity', stats.popularity);
        this.updateStatBar('fitness', stats.fitness);
        
        // Update values
        document.getElementById('health-value').textContent = Math.round(stats.health);
        document.getElementById('actions-value').textContent = `${actions.current}/${actions.max}`;
        document.getElementById('happiness-value').textContent = Math.round(stats.happiness);
        document.getElementById('intelligence-value').textContent = Math.round(stats.intelligence);
        document.getElementById('popularity-value').textContent = Math.round(stats.popularity);
        document.getElementById('fitness-value').textContent = Math.round(stats.fitness);
        document.getElementById('money-value').textContent = `$${Math.round(stats.money)}`;
        
        // Update grade
        const gradeAverage = Education.state.gradeAverage;
        const letterGrade = Education.getLetterGrade(gradeAverage);
        document.getElementById('grade-value').textContent = `${letterGrade} (${Math.round(gradeAverage)}%)`;
        
        // Update grounded status if displayed
        const groundedStatus = document.getElementById('grounded-status');
        if (groundedStatus) {
            if (Game.isGrounded()) {
                groundedStatus.textContent = `Grounded: ${Game.state.school.groundedDaysLeft} days left`;
                groundedStatus.style.display = 'block';
            } else {
                groundedStatus.style.display = 'none';
            }
        }
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
                <span class="activity-cost">Actions: ${activity.actionCost}</span>
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
            
            // Check for tier change notification
            if (result.tierChange) {
                this.showTierChangeNotification(result.tierChange);
            }
            
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
        
        // Check if grounded and trying to end the day without doing chores
        if (Game.isGrounded() && oldPeriod === 'night' && !Game.state.school.didMandatoryChores) {
            this.showNotification('Chores Required!', 'You\'re grounded and must do your chores before going to sleep!');
            return;
        }
        
        Game.advanceTime();
        const newPeriod = Game.state.time.period;
        
        // Check if it's a new day and a school day - show school choice
        if (newPeriod === 'morning' && oldPeriod === 'night') {
            if (Game.isSchoolDay()) {
                this.showSchoolChoice();
                return; // Don't proceed until player makes choice
            } else {
                // Weekend - set 8 actions
                Game.setDailyActions(false);
                this.addEventLog('It\'s the weekend! You have 8 actions today.', 'success');
            }
        }
        
        // Check for Saturday detention
        if (Game.state.school.saturdayDetention && Game.state.time.dayOfWeek === 6 && newPeriod === 'morning') {
            this.showSaturdayDetention();
            return;
        }
        
        // Check for mandatory chores when grounded
        if (Game.isGrounded() && newPeriod === 'morning') {
            this.addEventLog(`You're grounded! ${Game.state.school.groundedDaysLeft} days left. You must do chores before bed.`, 'warning');
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
    
    // Show school choice modal
    showSchoolChoice: function() {
        const modal = document.getElementById('event-modal');
        const title = document.getElementById('modal-title');
        const text = document.getElementById('modal-text');
        const choicesDiv = document.getElementById('modal-choices');
        
        title.textContent = 'School Day';
        text.textContent = 'It\'s a school day! What do you want to do?';
        
        choicesDiv.innerHTML = '';
        
        // Go to school button
        const goBtn = document.createElement('button');
        goBtn.className = 'choice-btn';
        const actionsAfterSchool = Education.getActionsForGradeTier();
        goBtn.textContent = `Go to School (${actionsAfterSchool} actions)`;
        goBtn.addEventListener('click', () => this.handleSchoolChoice(true));
        choicesDiv.appendChild(goBtn);
        
        // Skip school button
        const skipBtn = document.createElement('button');
        skipBtn.className = 'choice-btn';
        skipBtn.textContent = 'Skip School (8 actions, risky!)';
        skipBtn.addEventListener('click', () => this.handleSchoolChoice(false));
        choicesDiv.appendChild(skipBtn);
        
        modal.classList.add('active');
    },
    
    // Handle school choice
    handleSchoolChoice: function(wentToSchool) {
        this.closeEventModal();
        
        Game.state.school.wentToSchool = wentToSchool;
        Game.setDailyActions(wentToSchool);
        
        let tierChange = null;
        
        if (wentToSchool) {
            tierChange = Education.attendSchool();
            const actions = Game.state.actions.current;
            this.addEventLog(`You went to school. You have ${actions} actions for the rest of the day.`, 'success');
        } else {
            Game.state.school.skippedToday = true;
            tierChange = Education.missSchool();
            
            // Check consequences
            const result = Game.handleSkipSchool();
            
            if (result.result === 'success') {
                this.addEventLog(result.message, 'success');
                this.addEventLog('You have 8 actions today!', 'success');
            } else if (result.result === 'detention') {
                this.addEventLog(result.message, 'warning');
                this.addEventLog('You have 8 actions today, but Saturday detention awaits...', 'warning');
            } else {
                this.addEventLog(result.message, 'danger');
                this.addEventLog('You have 8 actions today, but you\'re grounded!', 'danger');
            }
        }
        
        // Check for tier change notification
        if (tierChange) {
            this.showTierChangeNotification(tierChange);
        }
        
        this.updateUI();
        this.updateActivities();
        this.checkAndShowEvents();
    },
    
    // Show Saturday detention
    showSaturdayDetention: function() {
        Game.state.school.saturdayDetention = false;
        Game.setDailyActions(true);
        
        const actionsForDetention = Education.getActionsForGradeTier();
        this.addEventLog(`You have Saturday detention today. Only ${actionsForDetention} actions available.`, 'warning');
        
        this.updateUI();
        this.updateActivities();
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
                
                // Check for tier change notification
                if (result.tierChange) {
                    this.showTierChangeNotification(result.tierChange);
                }
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
        
        // Add grade tier information at the top
        const currentTier = Education.getCurrentTier();
        const lowestGrade = Education.getLowestGrade();
        const actionsForTier = Education.getActionsForGradeTier();
        const allowanceForTier = Education.getAllowanceForGradeTier();
        
        const tierInfoDiv = document.createElement('div');
        tierInfoDiv.className = 'tier-info';
        tierInfoDiv.innerHTML = `
            <h4>Current Grade Tier: ${currentTier}</h4>
            <p>Lowest Subject Grade: ${Math.round(lowestGrade)}%</p>
            <p>Actions after School: ${actionsForTier}</p>
            <p>Weekly Allowance: $${allowanceForTier}</p>
            <hr>
            <h5>Grade Tier System:</h5>
            <table class="tier-table">
                <tr>
                    <th>Tier</th>
                    <th>Actions</th>
                    <th>Allowance</th>
                </tr>
                <tr ${currentTier === 'A' ? 'class="current-tier"' : ''}>
                    <td>A</td>
                    <td>7</td>
                    <td>$25</td>
                </tr>
                <tr ${currentTier === 'B' ? 'class="current-tier"' : ''}>
                    <td>B</td>
                    <td>6</td>
                    <td>$20</td>
                </tr>
                <tr ${currentTier === 'C' ? 'class="current-tier"' : ''}>
                    <td>C</td>
                    <td>5</td>
                    <td>$15</td>
                </tr>
                <tr ${currentTier === 'D' ? 'class="current-tier"' : ''}>
                    <td>D</td>
                    <td>4</td>
                    <td>$10</td>
                </tr>
                <tr ${currentTier === 'F' ? 'class="current-tier"' : ''}>
                    <td>F</td>
                    <td>3</td>
                    <td>$5</td>
                </tr>
            </table>
            <p><small>Tier based on lowest subject grade. Actions apply on school days if not skipped.</small></p>
            <hr>
        `;
        educationDiv.appendChild(tierInfoDiv);
        
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
        this.showConfirmation(
            'Return to Menu?',
            'Are you sure you want to return to the main menu? Make sure to save first!',
            () => {
                this.showScreen('start-screen');
            }
        );
    },
    
    // Show game over
    showGameOver: function() {
        this.showNotification(
            '🎉 Congratulations!',
            'You\'ve reached adulthood! Your teenage years are complete. Thanks for playing!',
            () => {
                this.showScreen('start-screen');
            }
        );
    },
    
    // Capitalize first letter
    capitalizeFirst: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    // Show notification modal
    showNotification: function(title, message, callback) {
        const modal = document.getElementById('general-modal');
        const titleEl = document.getElementById('general-modal-title');
        const textEl = document.getElementById('general-modal-text');
        const buttonsEl = document.getElementById('general-modal-buttons');
        
        titleEl.textContent = title;
        textEl.textContent = message;
        buttonsEl.innerHTML = '';
        
        const okBtn = document.createElement('button');
        okBtn.className = 'choice-btn';
        okBtn.textContent = 'OK';
        okBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            if (callback) callback();
        });
        
        buttonsEl.appendChild(okBtn);
        modal.classList.add('active');
    },
    
    // Show confirmation modal
    showConfirmation: function(title, message, onConfirm, onCancel) {
        const modal = document.getElementById('general-modal');
        const titleEl = document.getElementById('general-modal-title');
        const textEl = document.getElementById('general-modal-text');
        const buttonsEl = document.getElementById('general-modal-buttons');
        
        titleEl.textContent = title;
        textEl.textContent = message;
        buttonsEl.innerHTML = '';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'choice-btn';
        confirmBtn.textContent = 'Confirm';
        confirmBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            if (onConfirm) onConfirm();
        });
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'choice-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            if (onCancel) onCancel();
        });
        
        buttonsEl.appendChild(confirmBtn);
        buttonsEl.appendChild(cancelBtn);
        modal.classList.add('active');
    },
    
    // Show tier change notification (pushed to top of event log)
    showTierChangeNotification: function(tierChange) {
        if (!tierChange) return;
        
        let message = '';
        
        if (tierChange.improved) {
            message = `📚 Your grade tier improved to ${tierChange.tier}! (Lowest grade: ${tierChange.lowestGrade}%) ` +
                     `You now get ${tierChange.actions} actions after school and $${tierChange.allowance} weekly allowance.`;
            this.addEventLog(message, 'success');
        } else {
            message = `📉 Your grade tier dropped to ${tierChange.tier}. (Lowest grade: ${tierChange.lowestGrade}%) ` +
                     `You now get ${tierChange.actions} actions after school and $${tierChange.allowance} weekly allowance.`;
            this.addEventLog(message, 'warning');
        }
    }
};
