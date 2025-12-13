// UI Management System
// Handles all UI updates and interactions

const UIManager = {
    // Initialize UI
    init: function() {
        // Subscribe to state changes
        GameState.subscribe(this.handleStateChange.bind(this));
        
        // Set up event listeners
        this.setupEventListeners();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Start game button
        const startBtn = document.getElementById('start-game-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }
        
        // Message continue button
        const messageContinueBtn = document.getElementById('message-continue-btn');
        if (messageContinueBtn) {
            messageContinueBtn.addEventListener('click', () => this.continueFromMessage());
        }
    },
    
    // Start game
    startGame: function() {
        const nameInput = document.getElementById('character-name-input');
        const name = nameInput.value.trim() || 'Player';
        
        GameState.init(name);
        RelationshipsManager.initializeDefaults();
        InventoryManager.addItem('snack', 2);
        
        this.updateCharacterName();
        this.updateAllStats();
        this.updateRelationships();
        this.updateInventory();
        this.switchScreen('activities');
        this.renderActivities();
        
        GameState.addLog('Started your teenage life adventure!');
    },
    
    // Handle state changes
    handleStateChange: function(event, data) {
        switch (event) {
            case 'attributeUpdate':
                this.updateStat(data.attribute, data.value);
                break;
            case 'relationshipUpdate':
                this.updateRelationships();
                break;
            case 'inventoryUpdate':
                this.updateInventory();
                break;
            case 'timeUpdate':
                this.updateTime();
                break;
            case 'logUpdate':
                this.addLogEntry(data);
                break;
            case 'screenChange':
                this.switchScreen(data);
                break;
        }
    },
    
    // Update character name display
    updateCharacterName: function() {
        const nameEl = document.getElementById('character-name');
        if (nameEl) {
            nameEl.textContent = GameState.character.name;
        }
    },
    
    // Update single stat
    updateStat: function(attribute, value) {
        const valueEl = document.getElementById(`${attribute}-value`);
        const barEl = document.getElementById(`${attribute}-bar`);
        
        if (valueEl) {
            if (attribute === 'money') {
                valueEl.textContent = `$${value}`;
            } else {
                valueEl.textContent = Math.round(value);
            }
        }
        
        if (barEl) {
            barEl.style.width = `${Math.max(0, Math.min(100, value))}%`;
        }
    },
    
    // Update all stats
    updateAllStats: function() {
        for (const [attribute, value] of Object.entries(GameState.character.attributes)) {
            this.updateStat(attribute, value);
        }
    },
    
    // Update relationships display
    updateRelationships: function() {
        const container = document.getElementById('relationships-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        const relationships = RelationshipsManager.getAllRelationships();
        relationships.forEach(rel => {
            const relEl = document.createElement('div');
            relEl.className = 'relationship-item';
            relEl.innerHTML = `
                <span class="relationship-name">${rel.name}</span>
                <span class="relationship-level">${rel.level} - ${rel.status}</span>
            `;
            container.appendChild(relEl);
        });
    },
    
    // Update inventory display
    updateInventory: function() {
        const container = document.getElementById('inventory-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        const items = InventoryManager.getAllItems();
        
        if (items.length === 0) {
            container.innerHTML = '<div style="color: #999; font-size: 0.9em;">No items</div>';
            return;
        }
        
        items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'inventory-item';
            itemEl.innerHTML = `
                <span class="item-name">${item.name}</span>
                <span class="item-quantity">x${item.quantity}</span>
            `;
            itemEl.addEventListener('click', () => this.useItem(item.id));
            itemEl.style.cursor = 'pointer';
            itemEl.title = `Click to use ${item.name}`;
            container.appendChild(itemEl);
        });
    },
    
    // Use item
    useItem: function(itemId) {
        if (InventoryManager.useItem(itemId)) {
            const item = InventoryManager.getItemDefinition(itemId);
            this.showMessage(`Used ${item.name}!\n\n${item.description}`);
        }
    },
    
    // Update time display
    updateTime: function() {
        const dayEl = document.getElementById('day-display');
        const timeEl = document.getElementById('time-display');
        
        if (dayEl) {
            dayEl.textContent = `Day ${GameState.time.day}`;
        }
        
        if (timeEl) {
            timeEl.textContent = GameState.time.period.charAt(0).toUpperCase() + GameState.time.period.slice(1);
        }
    },
    
    // Add log entry
    addLogEntry: function(entry) {
        const logContent = document.getElementById('log-content');
        if (!logContent) return;
        
        const logEl = document.createElement('div');
        logEl.className = 'log-entry';
        logEl.innerHTML = `
            <span class="time">Day ${entry.day} ${entry.period}</span>
            <span>${entry.message}</span>
        `;
        logContent.insertBefore(logEl, logContent.firstChild);
    },
    
    // Switch screen
    switchScreen: function(screenName) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    },
    
    // Render activities
    renderActivities: function() {
        const container = document.getElementById('activities-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        const activities = ActivitiesManager.getAvailableActivities();
        
        activities.forEach(activity => {
            const activityEl = document.createElement('div');
            activityEl.className = `activity-card ${activity.available ? '' : 'disabled'}`;
            
            // Format requirements
            const reqText = activity.requirements ? ActivitiesManager.formatRequirements(activity.requirements) : '';
            
            // Format effects
            const effects = ActivitiesManager.formatEffects(activity.effects);
            const effectsHTML = effects.map(eff => {
                const sign = eff.positive ? '+' : '';
                const className = eff.positive ? 'effect-positive' : 'effect-negative';
                return `<span class="effect-badge ${className}">${eff.attribute} ${sign}${eff.value}</span>`;
            }).join('');
            
            activityEl.innerHTML = `
                <div class="activity-name">${activity.name}</div>
                <div class="activity-description">${activity.description}</div>
                ${reqText ? `<div class="activity-requirements">${reqText}</div>` : ''}
                <div class="activity-effects">${effectsHTML}</div>
            `;
            
            if (activity.available) {
                activityEl.addEventListener('click', () => this.executeActivity(activity.id));
            }
            
            container.appendChild(activityEl);
        });
    },
    
    // Execute activity
    executeActivity: function(activityId) {
        const result = ActivitiesManager.executeActivity(activityId);
        
        if (!result.success) {
            this.showMessage(result.message);
            return;
        }
        
        if (result.special === 'shopping') {
            this.showShop();
            return;
        }
        
        // Check for random event
        if (EventsManager.shouldTriggerEvent()) {
            const event = EventsManager.getRandomEvent();
            if (event) {
                this.showEvent(event);
                return;
            }
        }
        
        // Return to activities
        this.renderActivities();
    },
    
    // Show event
    showEvent: function(event) {
        const titleEl = document.getElementById('event-title');
        const descEl = document.getElementById('event-description');
        const choicesEl = document.getElementById('event-choices');
        
        if (titleEl) titleEl.textContent = event.title;
        if (descEl) descEl.textContent = event.description;
        
        if (choicesEl) {
            choicesEl.innerHTML = '';
            
            event.choices.forEach((choice, index) => {
                const choiceEl = document.createElement('div');
                choiceEl.className = 'choice-card';
                choiceEl.innerHTML = `
                    <div class="choice-text">${choice.text}</div>
                    ${choice.hint ? `<div class="choice-hint">${choice.hint}</div>` : ''}
                `;
                choiceEl.addEventListener('click', () => this.executeEventChoice(event, index));
                choicesEl.appendChild(choiceEl);
            });
        }
        
        this.switchScreen('event');
    },
    
    // Execute event choice
    executeEventChoice: function(event, choiceIndex) {
        const message = EventsManager.executeChoice(event, choiceIndex);
        this.showMessage(message);
    },
    
    // Show message
    showMessage: function(message) {
        const messageContent = document.getElementById('message-content');
        if (messageContent) {
            messageContent.textContent = message;
        }
        this.switchScreen('message');
    },
    
    // Continue from message
    continueFromMessage: function() {
        this.switchScreen('activities');
        this.renderActivities();
    },
    
    // Show shop
    showShop: function() {
        const items = [
            'snack', 'energy_drink', 'textbook', 'game', 
            'phone', 'skateboard', 'guitar'
        ];
        
        let shopHTML = '<h3>Shop</h3><div class="activities-list">';
        
        items.forEach(itemId => {
            const item = InventoryManager.getItemDefinition(itemId);
            const money = GameState.getAttribute('money');
            const canAfford = money >= item.value;
            
            shopHTML += `
                <div class="activity-card ${canAfford ? '' : 'disabled'}" onclick="UIManager.buyItem('${itemId}')">
                    <div class="activity-name">${item.name}</div>
                    <div class="activity-description">${item.description}</div>
                    <div class="activity-requirements">Price: $${item.value}</div>
                </div>
            `;
        });
        
        shopHTML += '</div>';
        
        this.showMessage('Welcome to the shop! Click an item to buy it.');
        const messageContent = document.getElementById('message-content');
        if (messageContent) {
            messageContent.innerHTML = shopHTML;
        }
    },
    
    // Buy item
    buyItem: function(itemId) {
        if (InventoryManager.buyItem(itemId)) {
            this.showShop();
        }
    }
};
