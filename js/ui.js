// UI Controller

class UIController {
    constructor(gameEngine, stateManager) {
        this.gameEngine = gameEngine;
        this.stateManager = stateManager;
        this.elements = {};
        this.modals = {};
    }

    // Initialize UI
    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.subscribeToStateChanges();
        this.render();
    }

    // Cache DOM elements
    cacheElements() {
        // Character elements
        this.elements.characterName = document.getElementById('characterName');
        this.elements.characterAge = document.getElementById('characterAge');
        this.elements.characterGrade = document.getElementById('characterGrade');

        // Stat elements
        this.elements.happinessStat = document.getElementById('happinessStat');
        this.elements.happinessValue = document.getElementById('happinessValue');
        this.elements.healthStat = document.getElementById('healthStat');
        this.elements.healthValue = document.getElementById('healthValue');
        this.elements.intelligenceStat = document.getElementById('intelligenceStat');
        this.elements.intelligenceValue = document.getElementById('intelligenceValue');
        this.elements.socialStat = document.getElementById('socialStat');
        this.elements.socialValue = document.getElementById('socialValue');
        this.elements.energyStat = document.getElementById('energyStat');
        this.elements.energyValue = document.getElementById('energyValue');

        // Relationships
        this.elements.relationshipsList = document.getElementById('relationshipsList');

        // Timeline
        this.elements.currentDate = document.getElementById('currentDate');
        this.elements.currentSeason = document.getElementById('currentSeason');
        this.elements.nextDayBtn = document.getElementById('nextDayBtn');

        // Event
        this.elements.eventTitle = document.getElementById('eventTitle');
        this.elements.eventDescription = document.getElementById('eventDescription');
        this.elements.eventImage = document.getElementById('eventImage');
        this.elements.choicesGrid = document.getElementById('choicesGrid');

        // Activity log
        this.elements.logEntries = document.getElementById('logEntries');

        // Buttons
        this.elements.settingsBtn = document.getElementById('settingsBtn');
        this.elements.saveBtn = document.getElementById('saveBtn');
        this.elements.loadBtn = document.getElementById('loadBtn');

        // Modals
        this.modals.settings = document.getElementById('settingsModal');
        this.modals.gameOver = document.getElementById('gameOverModal');
        
        // Settings form
        this.elements.apiKeyInput = document.getElementById('apiKeyInput');
        this.elements.characterNameInput = document.getElementById('characterNameInput');
        this.elements.aiEventsToggle = document.getElementById('aiEventsToggle');
        this.elements.saveSettingsBtn = document.getElementById('saveSettingsBtn');

        // Game over
        this.elements.gameOverContent = document.getElementById('gameOverContent');
        this.elements.restartBtn = document.getElementById('restartBtn');

        // Loading
        this.elements.loadingIndicator = document.getElementById('loadingIndicator');
    }

    // Attach event listeners
    attachEventListeners() {
        // Next day button
        this.elements.nextDayBtn.addEventListener('click', () => this.handleNextDay());

        // Settings button
        this.elements.settingsBtn.addEventListener('click', () => this.showSettings());

        // Save button
        this.elements.saveBtn.addEventListener('click', () => this.handleSave());

        // Load button
        this.elements.loadBtn.addEventListener('click', () => this.handleLoad());

        // Save settings button
        this.elements.saveSettingsBtn.addEventListener('click', () => this.handleSaveSettings());

        // Restart button
        this.elements.restartBtn.addEventListener('click', () => this.handleRestart());

        // Close modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('show');
            });
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
    }

    // Subscribe to state changes
    subscribeToStateChanges() {
        this.stateManager.subscribe((state) => {
            this.render();
        });
    }

    // Render all UI elements
    render() {
        this.renderCharacterInfo();
        this.renderStats();
        this.renderRelationships();
        this.renderTimeline();
        this.renderEvent();
        this.renderActivityLog();
    }

    // Render character info
    renderCharacterInfo() {
        const state = this.stateManager.getState();
        const character = state.character;

        this.elements.characterName.textContent = character.name;
        this.elements.characterAge.textContent = character.age;
        this.elements.characterGrade.textContent = GRADE_NAMES[character.grade] || `${character.grade}th`;
    }

    // Render stats
    renderStats() {
        const stats = this.stateManager.getState().character.stats;

        this.updateStat('happiness', stats.happiness);
        this.updateStat('health', stats.health);
        this.updateStat('intelligence', stats.intelligence);
        this.updateStat('social', stats.social);
        this.updateStat('energy', stats.energy);
    }

    // Update individual stat
    updateStat(statName, value) {
        const statBar = this.elements[`${statName}Stat`];
        const statValue = this.elements[`${statName}Value`];

        if (statBar && statValue) {
            statBar.style.width = `${value}%`;
            statValue.textContent = Math.round(value);
        }
    }

    // Render relationships
    renderRelationships() {
        const relationships = this.stateManager.getState().relationships;

        if (relationships.length === 0) {
            this.elements.relationshipsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 1rem;">No relationships yet</p>';
            return;
        }

        this.elements.relationshipsList.innerHTML = relationships
            .sort((a, b) => b.value - a.value)
            .slice(0, 5) // Show top 5 relationships
            .map(rel => `
                <div class="relationship-item">
                    <span class="relationship-name">${rel.name}</span>
                    <span class="relationship-value">${Math.round(rel.value)}</span>
                </div>
            `).join('');
    }

    // Render timeline
    renderTimeline() {
        const time = this.stateManager.getState().time;
        const dayName = DAYS_OF_WEEK[time.dayOfWeek - 1];

        this.elements.currentDate.textContent = `${dayName}, Day ${time.day}, Week ${time.week}, Year ${time.year}`;
        this.elements.currentSeason.textContent = time.season;
    }

    // Render event
    renderEvent() {
        const event = this.gameEngine.getCurrentEvent();

        if (!event) {
            return;
        }

        this.elements.eventTitle.textContent = event.title;
        this.elements.eventDescription.innerHTML = `<p>${event.description}</p>`;
        this.elements.eventImage.textContent = event.emoji || '📅';

        // Render choices
        this.renderChoices(event.choices);
    }

    // Render choices
    renderChoices(choices) {
        this.elements.choicesGrid.innerHTML = choices.map((choice, index) => `
            <button class="choice-btn" data-choice-index="${index}">
                ${choice.text}
            </button>
        `).join('');

        // Attach click handlers to choice buttons
        this.elements.choicesGrid.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.choiceIndex);
                this.handleChoice(index);
            });
        });
    }

    // Render activity log
    renderActivityLog() {
        const history = this.stateManager.getState().history;

        if (history.length === 0) {
            this.elements.logEntries.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No events yet</p>';
            return;
        }

        this.elements.logEntries.innerHTML = history.slice(0, 10).map(entry => `
            <div class="log-entry ${entry.type || ''}">
                <strong>${entry.eventTitle}:</strong> ${entry.choiceText} - ${entry.resultText}
            </div>
        `).join('');
    }

    // Handle choice selection
    async handleChoice(choiceIndex) {
        this.showLoading();
        this.disableChoices();

        try {
            const resultText = await this.gameEngine.handleChoice(choiceIndex);
            
            // Show result
            await this.showChoiceResult(resultText);
            
            // Check for game over
            if (this.stateManager.isGameOver()) {
                this.showGameOver();
            }
        } catch (error) {
            console.error('Error handling choice:', error);
            this.showError('Failed to process choice');
        } finally {
            this.hideLoading();
            this.enableChoices();
        }
    }

    // Show choice result
    async showChoiceResult(resultText) {
        return new Promise(resolve => {
            // Update event description with result
            this.elements.eventDescription.innerHTML = `
                <p style="background: var(--bg-color); padding: 1rem; border-radius: 0.5rem; border-left: 3px solid var(--primary-color);">
                    ${resultText}
                </p>
            `;

            // Enable next day button
            this.elements.nextDayBtn.disabled = false;
            this.elements.nextDayBtn.textContent = 'Next Day ⏩';

            setTimeout(resolve, 1000);
        });
    }

    // Handle next day
    async handleNextDay() {
        this.showLoading();
        this.elements.nextDayBtn.disabled = true;

        try {
            const result = await this.gameEngine.nextDay();

            if (result.gameOver) {
                this.showGameOver();
            } else {
                this.render();
            }
        } catch (error) {
            console.error('Error advancing day:', error);
            this.showError('Failed to advance to next day');
        } finally {
            this.hideLoading();
            this.elements.nextDayBtn.disabled = false;
        }
    }

    // Disable choice buttons
    disableChoices() {
        this.elements.choicesGrid.querySelectorAll('.choice-btn').forEach(btn => {
            btn.disabled = true;
        });
    }

    // Enable choice buttons
    enableChoices() {
        this.elements.choicesGrid.querySelectorAll('.choice-btn').forEach(btn => {
            btn.disabled = false;
        });
    }

    // Show settings modal
    showSettings() {
        const state = this.stateManager.getState();
        
        this.elements.characterNameInput.value = state.character.name;
        this.elements.aiEventsToggle.checked = state.settings.useAI;
        this.elements.apiKeyInput.value = state.settings.apiKey || '';

        this.modals.settings.classList.add('show');
    }

    // Handle save settings
    handleSaveSettings() {
        const settings = {
            characterName: this.elements.characterNameInput.value.trim(),
            useAI: this.elements.aiEventsToggle.checked,
            apiKey: this.elements.apiKeyInput.value.trim()
        };

        this.gameEngine.updateSettings(settings);
        this.modals.settings.classList.remove('show');
        this.render();

        this.showNotification('Settings saved!');
    }

    // Handle save game
    handleSave() {
        const success = this.gameEngine.saveGame();
        if (success) {
            this.showNotification('Game saved successfully!');
        } else {
            this.showError('Failed to save game');
        }
    }

    // Handle load game
    handleLoad() {
        if (confirm('Load saved game? Current progress will be lost if not saved.')) {
            const success = this.gameEngine.loadGame();
            if (success) {
                this.render();
                this.showNotification('Game loaded successfully!');
            } else {
                this.showError('No saved game found');
            }
        }
    }

    // Handle restart
    handleRestart() {
        this.gameEngine.startNewGame();
        this.modals.gameOver.classList.remove('show');
        this.render();
    }

    // Show game over modal
    showGameOver() {
        const message = this.stateManager.getGameOverMessage();
        const stats = this.gameEngine.getStatistics();

        this.elements.gameOverContent.innerHTML = `
            <p style="margin-bottom: 1rem; font-size: 1.1rem;">${message}</p>
            <div style="background: var(--bg-color); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                <h3 style="margin-bottom: 0.5rem;">Final Statistics</h3>
                <p><strong>Days Played:</strong> ${stats.daysPlayed}</p>
                <p><strong>Final Age:</strong> ${stats.currentAge}</p>
                <p><strong>Final Grade:</strong> ${GRADE_NAMES[stats.currentGrade]}</p>
                <p><strong>Events Experienced:</strong> ${stats.eventsExperienced}</p>
                <p><strong>Relationships Formed:</strong> ${stats.relationships}</p>
                <p><strong>Wellbeing Score:</strong> ${stats.wellbeingScore}/100</p>
                <p><strong>Academic Score:</strong> ${stats.academicScore}/100</p>
                <p><strong>Social Score:</strong> ${stats.socialScore}/100</p>
            </div>
        `;

        this.modals.gameOver.classList.add('show');
    }

    // Show loading indicator
    showLoading() {
        this.elements.loadingIndicator.style.display = 'block';
    }

    // Hide loading indicator
    hideLoading() {
        this.elements.loadingIndicator.style.display = 'none';
    }

    // Show notification
    showNotification(message) {
        // Simple notification - could be enhanced
        alert(message);
    }

    // Show error
    showError(message) {
        alert('Error: ' + message);
    }
}
