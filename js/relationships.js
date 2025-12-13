// Relationships System
const Relationships = {
    state: {
        relationships: []
    },
    
    // Relationship types
    types: {
        FRIEND: 'friend',
        FAMILY: 'family',
        ROMANTIC: 'romantic',
        RIVAL: 'rival',
        ACQUAINTANCE: 'acquaintance'
    },
    
    // Initialize with starting relationships
    init: function() {
        this.state.relationships = [
            {
                id: 'mom',
                name: 'Mom',
                type: this.types.FAMILY,
                value: 80,
                interactions: 0
            },
            {
                id: 'dad',
                name: 'Dad',
                type: this.types.FAMILY,
                value: 75,
                interactions: 0
            },
            {
                id: 'sibling',
                name: 'Sibling',
                type: this.types.FAMILY,
                value: 60,
                interactions: 0
            }
        ];
        
        // Add some initial friends
        this.addRelationship('best_friend', 'Best Friend', this.types.FRIEND, 70);
        this.addRelationship('classmate1', 'Alex', this.types.ACQUAINTANCE, 40);
        this.addRelationship('classmate2', 'Jordan', this.types.ACQUAINTANCE, 35);
    },
    
    // Add a new relationship
    addRelationship: function(id, name, type, initialValue = 50) {
        const existing = this.state.relationships.find(r => r.id === id);
        if (existing) {
            return false;
        }
        
        this.state.relationships.push({
            id: id,
            name: name,
            type: type,
            value: initialValue,
            interactions: 0
        });
        
        return true;
    },
    
    // Get relationship by ID
    getRelationship: function(id) {
        return this.state.relationships.find(r => r.id === id);
    },
    
    // Get all relationships
    getAllRelationships: function() {
        return [...this.state.relationships];
    },
    
    // Get relationships by type
    getRelationshipsByType: function(type) {
        return this.state.relationships.filter(r => r.type === type);
    },
    
    // Modify relationship value
    modifyRelationship: function(id, amount) {
        const relationship = this.getRelationship(id);
        if (!relationship) {
            return false;
        }
        
        relationship.value += amount;
        relationship.value = Math.max(0, Math.min(100, relationship.value));
        relationship.interactions++;
        
        // Check for relationship status changes
        if (relationship.value >= 80 && relationship.type === this.types.ACQUAINTANCE) {
            relationship.type = this.types.FRIEND;
        } else if (relationship.value <= 20 && relationship.type === this.types.FRIEND) {
            relationship.type = this.types.ACQUAINTANCE;
        }
        
        return true;
    },
    
    // Get relationship status text
    getRelationshipStatus: function(value) {
        if (value >= 90) return 'Best Friends';
        if (value >= 70) return 'Good Friends';
        if (value >= 50) return 'Friends';
        if (value >= 30) return 'Acquaintances';
        if (value >= 10) return 'Distant';
        return 'Strangers';
    },
    
    // Random relationship events
    generateRandomEvent: function() {
        const relationships = this.state.relationships;
        if (relationships.length === 0) return null;
        
        // Pick a random relationship
        const relationship = relationships[Math.floor(Math.random() * relationships.length)];
        
        // Generate event based on relationship type and value
        const events = this.getEventsForRelationship(relationship);
        
        if (events.length === 0) return null;
        
        const event = events[Math.floor(Math.random() * events.length)];
        return {
            ...event,
            relationshipId: relationship.id,
            relationshipName: relationship.name
        };
    },
    
    // Get possible events for a relationship
    getEventsForRelationship: function(relationship) {
        const events = [];
        
        if (relationship.type === this.types.FAMILY) {
            events.push(
                {
                    text: `${relationship.name} wants to have a family dinner together.`,
                    choices: [
                        {
                            text: 'Join them',
                            effects: { relationship: 5, happiness: 5 }
                        },
                        {
                            text: 'Make an excuse',
                            effects: { relationship: -3, happiness: 2 }
                        }
                    ]
                },
                {
                    text: `${relationship.name} is upset about something you did.`,
                    choices: [
                        {
                            text: 'Apologize sincerely',
                            effects: { relationship: 3, happiness: -2 }
                        },
                        {
                            text: 'Argue back',
                            effects: { relationship: -5, happiness: -5 }
                        }
                    ]
                }
            );
        } else if (relationship.type === this.types.FRIEND || relationship.type === this.types.ACQUAINTANCE) {
            if (relationship.value >= 50) {
                events.push(
                    {
                        text: `${relationship.name} invites you to hang out after school.`,
                        choices: [
                            {
                                text: 'Sure, let\'s go!',
                                effects: { relationship: 5, social: 5, happiness: 5, energy: -10 }
                            },
                            {
                                text: 'Sorry, I\'m busy',
                                effects: { relationship: -2, intelligence: 3 }
                            }
                        ]
                    },
                    {
                        text: `${relationship.name} needs help with homework.`,
                        choices: [
                            {
                                text: 'Help them out',
                                effects: { relationship: 7, intelligence: 2, happiness: 3 }
                            },
                            {
                                text: 'Say you don\'t have time',
                                effects: { relationship: -3, energy: 5 }
                            }
                        ]
                    }
                );
            } else {
                events.push(
                    {
                        text: `${relationship.name} seems distant lately.`,
                        choices: [
                            {
                                text: 'Reach out to them',
                                effects: { relationship: 5, social: 3, energy: -5 }
                            },
                            {
                                text: 'Give them space',
                                effects: { relationship: -1 }
                            }
                        ]
                    }
                );
            }
        }
        
        return events;
    },
    
    // Get state for saving
    getState: function() {
        return JSON.parse(JSON.stringify(this.state));
    },
    
    // Load state
    loadState: function(savedState) {
        this.state = JSON.parse(JSON.stringify(savedState));
    }
};
