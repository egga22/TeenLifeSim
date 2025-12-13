// Activities System
// Defines available activities and their effects

const ActivitiesManager = {
    // Activity definitions
    activityDefinitions: [
        {
            id: 'study',
            name: 'Study',
            description: 'Hit the books and improve your grades',
            requirements: { energy: 15 },
            effects: { grades: 10, energy: -15, happiness: -5 },
            timeAdvance: true
        },
        {
            id: 'sleep',
            name: 'Take a Nap',
            description: 'Rest and restore your energy',
            effects: { energy: 30, health: 5 },
            timeAdvance: true
        },
        {
            id: 'hangout',
            name: 'Hang Out with Friends',
            description: 'Spend time with friends and have fun',
            requirements: { energy: 10 },
            effects: { happiness: 15, energy: -10 },
            relationshipEffects: { 'bestfriend': 5 },
            timeAdvance: true
        },
        {
            id: 'exercise',
            name: 'Exercise',
            description: 'Work out and stay healthy',
            requirements: { energy: 20 },
            effects: { health: 15, energy: -20, happiness: 5 },
            timeAdvance: true
        },
        {
            id: 'video_games',
            name: 'Play Video Games',
            description: 'Relax and have fun with games',
            requirements: { energy: 10 },
            effects: { happiness: 10, energy: -10, grades: -3 },
            timeAdvance: true
        },
        {
            id: 'part_time_job',
            name: 'Work Part-Time Job',
            description: 'Earn some money',
            requirements: { energy: 25 },
            effects: { money: 30, energy: -25, happiness: -5 },
            timeAdvance: true
        },
        {
            id: 'talk_parents',
            name: 'Talk to Parents',
            description: 'Have a conversation with your parents',
            effects: { happiness: 5 },
            relationshipEffects: { 'mom': 5, 'dad': 5 },
            timeAdvance: true
        },
        {
            id: 'date',
            name: 'Go on a Date',
            description: 'Spend quality time with your crush',
            requirements: { energy: 15, money: 20 },
            effects: { happiness: 20, energy: -15, money: -20 },
            relationshipEffects: { 'crush': 15 },
            timeAdvance: true
        },
        {
            id: 'club_activity',
            name: 'School Club Activity',
            description: 'Participate in extracurricular activities',
            requirements: { energy: 15 },
            effects: { happiness: 10, energy: -15, grades: 5 },
            timeAdvance: true
        },
        {
            id: 'social_media',
            name: 'Browse Social Media',
            description: 'Check your phone and scroll through feeds',
            effects: { happiness: 5, energy: -5 },
            timeAdvance: true
        },
        {
            id: 'eat_healthy',
            name: 'Eat Healthy Meal',
            description: 'Have a nutritious meal',
            requirements: { money: 10 },
            effects: { health: 10, happiness: 5, money: -10 },
            timeAdvance: false
        },
        {
            id: 'eat_junk',
            name: 'Eat Junk Food',
            description: 'Quick and tasty, but not healthy',
            requirements: { money: 5 },
            effects: { health: -5, happiness: 8, money: -5 },
            timeAdvance: false
        },
        {
            id: 'shopping',
            name: 'Go Shopping',
            description: 'Buy some items',
            requirements: { money: 20, energy: 10 },
            effects: { happiness: 10, money: -20, energy: -10 },
            timeAdvance: true,
            special: 'shopping'
        },
        {
            id: 'practice_hobby',
            name: 'Practice Hobby',
            description: 'Develop your skills and interests',
            requirements: { energy: 10 },
            effects: { happiness: 12, energy: -10, grades: 3 },
            timeAdvance: true
        },
        {
            id: 'volunteer',
            name: 'Volunteer Work',
            description: 'Help others in the community',
            requirements: { energy: 20 },
            effects: { happiness: 15, energy: -20 },
            relationshipEffects: { 'mom': 10, 'dad': 10 },
            timeAdvance: true
        }
    ],
    
    // Get all available activities
    getAvailableActivities: function() {
        return this.activityDefinitions.map(activity => {
            const meetsReqs = !activity.requirements || CharacterManager.meetsRequirements(activity.requirements);
            return {
                ...activity,
                available: meetsReqs
            };
        });
    },
    
    // Execute an activity
    executeActivity: function(activityId) {
        const activity = this.activityDefinitions.find(a => a.id === activityId);
        
        if (!activity) {
            return { success: false, message: 'Activity not found' };
        }
        
        // Check requirements
        if (activity.requirements && !CharacterManager.meetsRequirements(activity.requirements)) {
            return { success: false, message: 'You don\'t meet the requirements for this activity' };
        }
        
        // Apply effects
        if (activity.effects) {
            CharacterManager.applyEffects(activity.effects);
        }
        
        // Apply relationship effects
        if (activity.relationshipEffects) {
            for (const [relId, value] of Object.entries(activity.relationshipEffects)) {
                if (RelationshipsManager.hasRelationship(relId)) {
                    RelationshipsManager.updateRelationship(relId, value);
                }
            }
        }
        
        // Advance time if needed
        if (activity.timeAdvance) {
            GameState.advanceTime();
        }
        
        // Log activity
        GameState.addLog(`${activity.name}`);
        
        // Check for special activities
        if (activity.special === 'shopping') {
            return { success: true, special: 'shopping', message: `You went ${activity.name}` };
        }
        
        return { success: true, message: `You completed: ${activity.name}` };
    },
    
    // Get activity by ID
    getActivity: function(activityId) {
        return this.activityDefinitions.find(a => a.id === activityId);
    },
    
    // Format requirements for display
    formatRequirements: function(requirements) {
        if (!requirements) return '';
        
        const reqStrings = [];
        for (const [attr, value] of Object.entries(requirements)) {
            reqStrings.push(`${attr}: ${value}`);
        }
        return 'Requires: ' + reqStrings.join(', ');
    },
    
    // Format effects for display
    formatEffects: function(effects) {
        if (!effects) return [];
        
        const effectsList = [];
        for (const [attr, value] of Object.entries(effects)) {
            if (value !== 0) {
                effectsList.push({
                    attribute: attr,
                    value: value,
                    positive: value > 0
                });
            }
        }
        return effectsList;
    }
};
