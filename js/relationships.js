// Relationships System
// Manages character relationships and interactions

const RelationshipsManager = {
    // Initialize default relationships
    initializeDefaults: function() {
        const defaultRelationships = [
            { id: 'mom', name: 'Mom', level: 70 },
            { id: 'dad', name: 'Dad', level: 70 },
            { id: 'bestfriend', name: 'Best Friend', level: 80 },
            { id: 'crush', name: 'Crush', level: 30 },
            { id: 'rival', name: 'Rival', level: 20 }
        ];
        
        defaultRelationships.forEach(rel => {
            this.addRelationship(rel.id, rel.name, rel.level);
        });
    },
    
    // Add a new relationship
    addRelationship: function(id, name, level = 50) {
        GameState.relationships[id] = {
            name: name,
            level: Math.max(0, Math.min(100, level))
        };
        GameState.notify('relationshipUpdate', { id, name, level: GameState.relationships[id].level });
    },
    
    // Update relationship level
    updateRelationship: function(id, change) {
        if (GameState.relationships[id]) {
            GameState.relationships[id].level += change;
            GameState.relationships[id].level = Math.max(0, Math.min(100, GameState.relationships[id].level));
            
            GameState.notify('relationshipUpdate', {
                id,
                name: GameState.relationships[id].name,
                level: GameState.relationships[id].level
            });
            
            return GameState.relationships[id].level;
        }
        return null;
    },
    
    // Get relationship level
    getRelationshipLevel: function(id) {
        return GameState.relationships[id] ? GameState.relationships[id].level : 0;
    },
    
    // Get relationship status description
    getRelationshipStatus: function(level) {
        if (level >= 90) return 'Best Friends';
        if (level >= 70) return 'Close';
        if (level >= 50) return 'Friendly';
        if (level >= 30) return 'Acquaintance';
        if (level >= 10) return 'Distant';
        return 'Hostile';
    },
    
    // Get all relationships
    getAllRelationships: function() {
        return Object.entries(GameState.relationships).map(([id, data]) => ({
            id,
            name: data.name,
            level: data.level,
            status: this.getRelationshipStatus(data.level)
        }));
    },
    
    // Check if relationship exists
    hasRelationship: function(id) {
        return GameState.relationships.hasOwnProperty(id);
    }
};
