// Shop System
const Shop = {
    // Shop item definitions
    items: {
        snacks: {
            name: 'Snacks',
            description: 'Some delicious treats to boost your mood',
            price: 5,
            effects: {
                happiness: 5
            }
        },
        energy_drink: {
            name: 'Energy Drink',
            description: 'Stay alert and energized',
            price: 8,
            effects: {
                happiness: 3
            }
        },
        book: {
            name: 'Book',
            description: 'An interesting book to expand your knowledge',
            price: 15,
            effects: {
                intelligence: 5,
                happiness: 3
            }
        },
        video_game: {
            name: 'Video Game',
            description: 'A new game to add to your collection',
            price: 60,
            effects: {
                happiness: 15,
                popularity: 2
            },
            addToInventory: true
        },
        fitness_equipment: {
            name: 'Fitness Equipment',
            description: 'Workout gear to help improve your fitness',
            price: 80,
            effects: {
                fitness: 10,
                happiness: 5
            },
            addToInventory: true
        },
        concert_ticket: {
            name: 'Concert Ticket',
            description: 'Go see your favorite band perform live!',
            price: 50,
            effects: {
                happiness: 20,
                popularity: 5
            }
        },
        phone_upgrade: {
            name: 'Phone Upgrade',
            description: 'Latest smartphone to boost your social status',
            price: 200,
            effects: {
                popularity: 15,
                happiness: 10
            },
            addToInventory: true
        },
        clothing: {
            name: 'Trendy Clothes',
            description: 'New outfit to look your best',
            price: 45,
            effects: {
                popularity: 8,
                happiness: 8
            },
            addToInventory: true
        },
        bicycle: {
            name: 'Bicycle',
            description: 'Get around town and stay fit',
            price: 150,
            effects: {
                fitness: 15,
                happiness: 12
            },
            addToInventory: true
        },
        music_instrument: {
            name: 'Musical Instrument',
            description: 'Learn to play and express yourself',
            price: 120,
            effects: {
                intelligence: 8,
                happiness: 10,
                popularity: 3
            },
            addToInventory: true
        },
        study_guide: {
            name: 'Study Guide',
            description: 'Comprehensive study materials for all subjects',
            price: 25,
            effects: {
                intelligence: 8
            }
        },
        movie_ticket: {
            name: 'Movie Ticket',
            description: 'Watch the latest blockbuster',
            price: 12,
            effects: {
                happiness: 8,
                popularity: 2
            }
        }
    },
    
    // Buy an item from the shop
    buyItem: function(itemId) {
        const item = this.items[itemId];
        
        if (!item) {
            return { success: false, message: 'Item not found!' };
        }
        
        // Check if player has enough money
        if (Game.state.stats.money < item.price) {
            return { success: false, message: 'Not enough money!' };
        }
        
        // Deduct money
        Game.modifyStat('money', -item.price);
        
        // Apply effects
        for (const [stat, value] of Object.entries(item.effects)) {
            Game.modifyStat(stat, value);
        }
        
        // Add to inventory if specified
        if (item.addToInventory) {
            Game.addItem(item.name, 1);
        }
        
        // Build result message
        const effectMessages = [];
        for (const [stat, value] of Object.entries(item.effects)) {
            if (value > 0) {
                effectMessages.push(`+${value} ${stat}`);
            } else if (value < 0) {
                effectMessages.push(`${value} ${stat}`);
            }
        }
        
        let message = `You bought ${item.name} for $${item.price}.`;
        if (effectMessages.length > 0) {
            message += ' ' + effectMessages.join(', ');
        }
        
        return {
            success: true,
            message: message,
            item: item
        };
    },
    
    // Get all available items
    getAllItems: function() {
        return Object.entries(this.items).map(([id, item]) => ({
            id: id,
            ...item,
            canAfford: Game.state.stats.money >= item.price
        }));
    }
};
