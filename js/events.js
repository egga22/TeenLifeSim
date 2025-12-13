// Events System
// Manages random events and player choices

const EventsManager = {
    // Event definitions
    eventDefinitions: [
        {
            id: 'pop_quiz',
            title: 'Pop Quiz!',
            description: 'Your teacher announces a surprise quiz! How do you handle it?',
            weight: 10,
            choices: [
                {
                    text: 'Try your best',
                    hint: 'Moderate risk',
                    effects: { grades: 5, energy: -10 },
                    relationshipEffects: { 'bestfriend': -5 }
                },
                {
                    text: 'Ask friend for help',
                    hint: 'Easy way out',
                    effects: { grades: 10, happiness: 5 },
                    relationshipEffects: { 'bestfriend': 5 }
                },
                {
                    text: 'Wing it',
                    hint: 'High risk',
                    effects: { grades: -10, energy: -5 },
                    message: 'That did not go well...'
                }
            ]
        },
        {
            id: 'birthday_party',
            title: 'Birthday Party Invitation',
            description: 'Your friend invites you to their birthday party this weekend!',
            weight: 8,
            choices: [
                {
                    text: 'Go to the party',
                    hint: 'Have fun!',
                    effects: { happiness: 15, energy: -15, money: -20 },
                    relationshipEffects: { 'bestfriend': 10 }
                },
                {
                    text: 'Make an excuse',
                    hint: 'Save energy',
                    effects: { happiness: -5 },
                    relationshipEffects: { 'bestfriend': -10 }
                },
                {
                    text: 'Suggest alternative plans',
                    hint: 'Compromise',
                    effects: { happiness: 5, money: -10 },
                    relationshipEffects: { 'bestfriend': 3 }
                }
            ]
        },
        {
            id: 'found_money',
            title: 'Found Money!',
            description: 'You found $20 on the ground near the lockers!',
            weight: 5,
            choices: [
                {
                    text: 'Keep it',
                    hint: 'Easy money',
                    effects: { money: 20, happiness: 10 }
                },
                {
                    text: 'Turn it in to lost and found',
                    hint: 'Do the right thing',
                    effects: { happiness: 15 },
                    message: 'You feel good about doing the right thing.'
                }
            ]
        },
        {
            id: 'sports_tryout',
            title: 'Sports Team Tryouts',
            description: 'Tryouts for the school sports team are happening today!',
            weight: 7,
            requirements: { energy: 30, health: 50 },
            choices: [
                {
                    text: 'Try out',
                    hint: 'Need energy and health',
                    effects: { health: 10, happiness: 10, energy: -20 },
                    message: 'Great workout! You made the team!'
                },
                {
                    text: 'Watch instead',
                    hint: 'No commitment',
                    effects: { happiness: 3 }
                }
            ]
        },
        {
            id: 'crush_encounter',
            title: 'Unexpected Encounter',
            description: 'You run into your crush in the hallway!',
            weight: 6,
            choices: [
                {
                    text: 'Strike up a conversation',
                    hint: 'Be brave!',
                    effects: { happiness: 10, energy: -5 },
                    relationshipEffects: { 'crush': 10 }
                },
                {
                    text: 'Wave and keep walking',
                    hint: 'Play it cool',
                    effects: { happiness: 3 },
                    relationshipEffects: { 'crush': 3 }
                },
                {
                    text: 'Avoid them awkwardly',
                    hint: 'Safe but awkward',
                    effects: { happiness: -5 },
                    relationshipEffects: { 'crush': -5 }
                }
            ]
        },
        {
            id: 'rival_challenge',
            title: 'Rival Challenge',
            description: 'Your rival challenges you to a competition!',
            weight: 5,
            choices: [
                {
                    text: 'Accept the challenge',
                    hint: 'Risky but exciting',
                    effects: { grades: 10, energy: -15, happiness: 10 },
                    relationshipEffects: { 'rival': 5 }
                },
                {
                    text: 'Decline politely',
                    hint: 'Avoid confrontation',
                    effects: { happiness: -5 },
                    relationshipEffects: { 'rival': -3 }
                },
                {
                    text: 'Suggest working together instead',
                    hint: 'Make peace',
                    effects: { happiness: 5, grades: 5 },
                    relationshipEffects: { 'rival': 15 }
                }
            ]
        },
        {
            id: 'parent_talk',
            title: 'Parent Check-in',
            description: 'Your parents want to talk about your grades and social life.',
            weight: 8,
            choices: [
                {
                    text: 'Have an honest conversation',
                    hint: 'Build trust',
                    effects: { happiness: 5 },
                    relationshipEffects: { 'mom': 10, 'dad': 10 }
                },
                {
                    text: 'Make excuses',
                    hint: 'Avoid conflict',
                    effects: { happiness: -3 },
                    relationshipEffects: { 'mom': -5, 'dad': -5 }
                },
                {
                    text: 'Promise to do better',
                    hint: 'Compromise',
                    effects: { grades: 5 },
                    relationshipEffects: { 'mom': 5, 'dad': 5 }
                }
            ]
        },
        {
            id: 'weekend_plans',
            title: 'Weekend Decision',
            description: 'It\'s Friday! What are your plans for the weekend?',
            weight: 10,
            choices: [
                {
                    text: 'Study all weekend',
                    hint: 'Boost grades',
                    effects: { grades: 15, happiness: -10, energy: -15 }
                },
                {
                    text: 'Hang out with friends',
                    hint: 'Have fun',
                    effects: { happiness: 20, energy: -10 },
                    relationshipEffects: { 'bestfriend': 10 }
                },
                {
                    text: 'Rest and relax',
                    hint: 'Recharge',
                    effects: { energy: 30, health: 10, happiness: 10 }
                },
                {
                    text: 'Part-time job',
                    hint: 'Earn money',
                    effects: { money: 50, energy: -20, happiness: -5 }
                }
            ]
        }
    ],
    
    // Get random event
    getRandomEvent: function() {
        // Filter events by requirements
        const availableEvents = this.eventDefinitions.filter(event => {
            if (event.requirements) {
                return CharacterManager.meetsRequirements(event.requirements);
            }
            return true;
        });
        
        if (availableEvents.length === 0) {
            return null;
        }
        
        // Weighted random selection
        const totalWeight = availableEvents.reduce((sum, event) => sum + (event.weight || 1), 0);
        let random = Math.random() * totalWeight;
        
        for (const event of availableEvents) {
            random -= (event.weight || 1);
            if (random <= 0) {
                return event;
            }
        }
        
        return availableEvents[0];
    },
    
    // Execute choice from event
    executeChoice: function(event, choiceIndex) {
        if (!event || !event.choices || !event.choices[choiceIndex]) {
            return null;
        }
        
        const choice = event.choices[choiceIndex];
        let message = choice.message || `You chose: ${choice.text}`;
        
        // Apply effects
        if (choice.effects) {
            CharacterManager.applyEffects(choice.effects);
            
            // Build effects message
            const effectMessages = [];
            for (const [attr, value] of Object.entries(choice.effects)) {
                if (value !== 0) {
                    const sign = value > 0 ? '+' : '';
                    effectMessages.push(`${attr} ${sign}${value}`);
                }
            }
            if (effectMessages.length > 0) {
                message += '\n\nEffects: ' + effectMessages.join(', ');
            }
        }
        
        // Apply relationship effects
        if (choice.relationshipEffects) {
            for (const [relId, value] of Object.entries(choice.relationshipEffects)) {
                if (RelationshipsManager.hasRelationship(relId)) {
                    RelationshipsManager.updateRelationship(relId, value);
                }
            }
        }
        
        // Log the event
        GameState.addLog(`Event: ${event.title} - ${choice.text}`);
        
        return message;
    },
    
    // Check if random event should trigger (30% chance after activities)
    shouldTriggerEvent: function() {
        return Math.random() < 0.3;
    }
};
