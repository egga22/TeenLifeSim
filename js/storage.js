// Save/Load System using localStorage
const Storage = {
    SAVE_KEY: 'teenLifeSim_save',
    
    // Save game state
    save: function() {
        try {
            const saveData = {
                game: Game.getState(),
                education: Education.getState(),
                relationships: Relationships.getState(),
                timestamp: Date.now(),
                version: 2 // Version for new actions system
            };
            
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('Failed to save game:', e);
            return false;
        }
    },
    
    // Load game state
    load: function() {
        try {
            const saveData = localStorage.getItem(this.SAVE_KEY);
            
            if (!saveData) {
                return null;
            }
            
            const data = JSON.parse(saveData);
            
            // Check for old save format and migrate if needed
            if (!data.version || data.version < 2) {
                // Old save - clear it and return null
                this.deleteSave();
                return null;
            }
            
            // Restore game state
            Game.loadState(data.game);
            Education.loadState(data.education);
            Relationships.loadState(data.relationships);
            
            return data;
        } catch (e) {
            console.error('Failed to load game:', e);
            return null;
        }
    },
    
    // Check if save exists
    hasSave: function() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },
    
    // Delete save
    deleteSave: function() {
        localStorage.removeItem(this.SAVE_KEY);
    },
    
    // Get save info without loading
    getSaveInfo: function() {
        try {
            const saveData = localStorage.getItem(this.SAVE_KEY);
            if (!saveData) return null;
            
            const data = JSON.parse(saveData);
            return {
                playerName: data.game.player.name,
                age: data.game.player.age,
                daysPlayed: data.game.progress.daysPlayed,
                timestamp: data.timestamp
            };
        } catch (e) {
            return null;
        }
    }
};
