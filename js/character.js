// Character System

class Character {
    constructor(stateManager) {
        this.stateManager = stateManager;
    }

    // Get character stats
    getStats() {
        return this.stateManager.getState().character.stats;
    }

    // Get character info
    getInfo() {
        return this.stateManager.getState().character;
    }

    // Update character name
    setName(name) {
        const state = this.stateManager.getState();
        this.stateManager.setState({
            character: {
                ...state.character,
                name
            }
        });
    }

    // Get stat level description
    getStatLevel(stat) {
        const value = this.getStats()[stat];
        if (value >= 80) return 'Excellent';
        if (value >= 60) return 'Good';
        if (value >= 40) return 'Average';
        if (value >= 20) return 'Poor';
        return 'Critical';
    }

    // Check if character can perform action (based on energy)
    canPerformAction(energyCost = 10) {
        return this.getStats().energy >= energyCost;
    }

    // Get character's current grade level
    getGradeName() {
        const grade = this.getInfo().grade;
        return GRADE_NAMES[grade] || `${grade}th`;
    }

    // Get overall wellbeing score
    getWellbeingScore() {
        const stats = this.getStats();
        return Math.round(
            (stats.happiness + stats.health + stats.energy) / 3
        );
    }

    // Get academic performance score
    getAcademicScore() {
        const stats = this.getStats();
        return Math.round(
            (stats.intelligence * 0.7 + stats.energy * 0.3)
        );
    }

    // Get social performance score
    getSocialScore() {
        const stats = this.getStats();
        const relationships = this.stateManager.getState().relationships;
        const avgRelationship = relationships.length > 0
            ? relationships.reduce((sum, r) => sum + r.value, 0) / relationships.length
            : 50;
        
        return Math.round(
            (stats.social * 0.6 + avgRelationship * 0.4)
        );
    }
}
