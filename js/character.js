// Character Management System
// Handles character attributes and status effects

const CharacterManager = {
    // Apply multiple attribute changes
    applyEffects: function(effects) {
        for (const [attribute, value] of Object.entries(effects)) {
            if (attribute === 'money') {
                GameState.updateAttribute(attribute, value);
            } else {
                GameState.updateAttribute(attribute, value);
            }
        }
    },
    
    // Check if character meets requirements
    meetsRequirements: function(requirements) {
        if (!requirements) return true;
        
        for (const [attribute, minValue] of Object.entries(requirements)) {
            const currentValue = GameState.getAttribute(attribute);
            if (currentValue < minValue) {
                return false;
            }
        }
        return true;
    },
    
    // Get character status (based on attributes)
    getStatus: function() {
        const health = GameState.getAttribute('health');
        const happiness = GameState.getAttribute('happiness');
        const energy = GameState.getAttribute('energy');
        const grades = GameState.getAttribute('grades');
        
        if (health < 20) return 'Critical - Visit hospital!';
        if (energy < 20) return 'Exhausted - Need rest!';
        if (happiness < 30) return 'Depressed - Need fun!';
        if (grades < 40) return 'Failing - Study needed!';
        
        if (health > 80 && happiness > 80 && energy > 80 && grades > 80) {
            return 'Excellent condition!';
        }
        
        return 'Doing okay';
    },
    
    // Calculate grade letter
    getGradeLetter: function() {
        const grades = GameState.getAttribute('grades');
        if (grades >= 90) return 'A';
        if (grades >= 80) return 'B';
        if (grades >= 70) return 'C';
        if (grades >= 60) return 'D';
        return 'F';
    },
    
    // Get attribute description
    getAttributeDescription: function(attribute, value) {
        const descriptions = {
            health: {
                high: 'feeling great',
                medium: 'feeling okay',
                low: 'feeling sick'
            },
            happiness: {
                high: 'very happy',
                medium: 'content',
                low: 'sad'
            },
            energy: {
                high: 'full of energy',
                medium: 'a bit tired',
                low: 'exhausted'
            },
            grades: {
                high: 'excellent student',
                medium: 'average student',
                low: 'struggling student'
            }
        };
        
        if (!descriptions[attribute]) return '';
        
        if (value >= 70) return descriptions[attribute].high;
        if (value >= 40) return descriptions[attribute].medium;
        return descriptions[attribute].low;
    }
};
