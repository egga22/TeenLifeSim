// Inventory System
// Manages items and their effects

const InventoryManager = {
    // Item definitions
    itemDefinitions: {
        'snack': {
            name: 'Snack',
            description: 'A tasty snack',
            effects: { health: 5, happiness: 3 },
            value: 5
        },
        'energy_drink': {
            name: 'Energy Drink',
            description: 'Boosts energy temporarily',
            effects: { energy: 20, health: -5 },
            value: 10
        },
        'textbook': {
            name: 'Textbook',
            description: 'Helps with studying',
            effects: { grades: 10 },
            value: 30
        },
        'game': {
            name: 'Video Game',
            description: 'Fun entertainment',
            effects: { happiness: 15, energy: -10 },
            value: 40
        },
        'phone': {
            name: 'Smartphone',
            description: 'Stay connected',
            effects: { happiness: 10 },
            value: 200
        },
        'skateboard': {
            name: 'Skateboard',
            description: 'Cool way to get around',
            effects: { happiness: 10, health: 5 },
            value: 80
        },
        'guitar': {
            name: 'Guitar',
            description: 'Make music',
            effects: { happiness: 15 },
            value: 150
        }
    },
    
    // Add item to inventory
    addItem: function(itemId, quantity = 1) {
        if (!this.itemDefinitions[itemId]) {
            console.error('Item not found:', itemId);
            return false;
        }
        
        if (!GameState.inventory[itemId]) {
            GameState.inventory[itemId] = 0;
        }
        
        GameState.inventory[itemId] += quantity;
        GameState.notify('inventoryUpdate', {
            itemId,
            quantity: GameState.inventory[itemId],
            name: this.itemDefinitions[itemId].name
        });
        
        return true;
    },
    
    // Remove item from inventory
    removeItem: function(itemId, quantity = 1) {
        if (!GameState.inventory[itemId] || GameState.inventory[itemId] < quantity) {
            return false;
        }
        
        GameState.inventory[itemId] -= quantity;
        
        if (GameState.inventory[itemId] === 0) {
            delete GameState.inventory[itemId];
        }
        
        GameState.notify('inventoryUpdate', {
            itemId,
            quantity: GameState.inventory[itemId] || 0,
            name: this.itemDefinitions[itemId].name
        });
        
        return true;
    },
    
    // Use an item
    useItem: function(itemId) {
        if (!this.hasItem(itemId)) {
            return false;
        }
        
        const item = this.itemDefinitions[itemId];
        
        // Apply item effects
        if (item.effects) {
            CharacterManager.applyEffects(item.effects);
        }
        
        // Remove item from inventory
        this.removeItem(itemId, 1);
        
        GameState.addLog(`Used ${item.name}`);
        
        return true;
    },
    
    // Check if player has item
    hasItem: function(itemId) {
        return GameState.inventory[itemId] && GameState.inventory[itemId] > 0;
    },
    
    // Get item quantity
    getItemQuantity: function(itemId) {
        return GameState.inventory[itemId] || 0;
    },
    
    // Get all items in inventory
    getAllItems: function() {
        return Object.entries(GameState.inventory).map(([itemId, quantity]) => ({
            id: itemId,
            name: this.itemDefinitions[itemId].name,
            quantity: quantity,
            description: this.itemDefinitions[itemId].description
        }));
    },
    
    // Get item definition
    getItemDefinition: function(itemId) {
        return this.itemDefinitions[itemId];
    },
    
    // Buy item from shop
    buyItem: function(itemId) {
        const item = this.itemDefinitions[itemId];
        if (!item) return false;
        
        const money = GameState.getAttribute('money');
        if (money < item.value) {
            return false;
        }
        
        GameState.updateAttribute('money', -item.value);
        this.addItem(itemId, 1);
        GameState.addLog(`Bought ${item.name} for $${item.value}`);
        
        return true;
    },
    
    // Sell item
    sellItem: function(itemId) {
        if (!this.hasItem(itemId)) return false;
        
        const item = this.itemDefinitions[itemId];
        const sellPrice = Math.floor(item.value * 0.5);
        
        this.removeItem(itemId, 1);
        GameState.updateAttribute('money', sellPrice);
        GameState.addLog(`Sold ${item.name} for $${sellPrice}`);
        
        return true;
    }
};
