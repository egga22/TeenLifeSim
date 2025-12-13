// Events System
const Events = {
    eventQueue: [],
    
    // Event categories
    categories: {
        RANDOM: 'random',
        SCHOOL: 'school',
        RELATIONSHIP: 'relationship',
        HEALTH: 'health',
        SPECIAL: 'special'
    },
    
    // Random event definitions
    randomEvents: [
        {
            id: 'found_money',
            text: 'You found some money on the ground!',
            category: 'random',
            probability: 0.05,
            choices: [
                {
                    text: 'Keep it',
                    effects: { money: 20, happiness: 5 }
                },
                {
                    text: 'Turn it in to lost and found',
                    effects: { happiness: 3, popularity: 2 }
                }
            ]
        },
        {
            id: 'bad_weather',
            text: 'It\'s raining heavily outside.',
            category: 'random',
            probability: 0.08,
            choices: [
                {
                    text: 'Stay inside',
                    effects: { happiness: -2}
                }
            ]
        },
        {
            id: 'good_mood',
            text: 'You woke up in a great mood today!',
            category: 'random',
            probability: 0.1,
            choices: [
                {
                    text: 'Nice!',
                    effects: { happiness: 10}
                }
            ]
        },
        {
            id: 'stressed_out',
            text: 'You\'re feeling overwhelmed with everything.',
            category: 'random',
            probability: 0.07,
            choices: [
                {
                    text: 'Take a break',
                    effects: { happiness: 5, intelligence: -2 }
                },
                {
                    text: 'Push through',
                    effects: { happiness: -5, intelligence: 3, health: -5 }
                }
            ]
        },
        {
            id: 'new_game',
            text: 'A new game you\'ve been waiting for just came out!',
            category: 'random',
            probability: 0.04,
            choices: [
                {
                    text: 'Buy it ($60)',
                    effects: { money: -60, happiness: 15 },
                    requirement: { money: 60 }
                },
                {
                    text: 'Wait for a sale',
                    effects: { happiness: -5 }
                }
            ]
        },
        {
            id: 'compliment',
            text: 'Someone complimented your outfit today!',
            category: 'random',
            probability: 0.06,
            choices: [
                {
                    text: 'Thank them',
                    effects: { happiness: 5, popularity: 3 }
                }
            ]
        },
        {
            id: 'bad_sleep',
            text: 'You had a terrible night\'s sleep.',
            category: 'random',
            probability: 0.08,
            choices: [
                {
                    text: 'Try to power through',
                    effects: { health: -5 }
                }
            ]
        },
        {
            id: 'concert_invite',
            text: 'Your favorite band is playing a concert nearby!',
            category: 'random',
            probability: 0.03,
            choices: [
                {
                    text: 'Buy tickets ($80)',
                    effects: { money: -80, happiness: 20, popularity: 5 },
                    requirement: { money: 80 }
                },
                {
                    text: 'Skip it',
                    effects: { happiness: -10 }
                }
            ]
        }
    ],
    
    // School events
    schoolEvents: [
        {
            id: 'pop_quiz',
            text: 'Surprise! Pop quiz in class today.',
            category: 'school',
            choices: [
                {
                    text: 'Do your best',
                    effects: { intelligence: 2 }
                }
            ]
        },
        {
            id: 'school_project',
            text: 'You\'ve been assigned a group project.',
            category: 'school',
            choices: [
                {
                    text: 'Take the lead',
                    effects: { intelligence: 5, popularity: 3}
                },
                {
                    text: 'Do your part',
                    effects: { intelligence: 3, popularity: 2}
                },
                {
                    text: 'Let others do it',
                    effects: { popularity: -5, intelligence: -2 }
                }
            ]
        },
        {
            id: 'club_fair',
            text: 'There\'s a club fair at school today!',
            category: 'school',
            choices: [
                {
                    text: 'Join the sports club',
                    effects: { fitness: 5, popularity: 5, happiness: 5 }
                },
                {
                    text: 'Join the debate club',
                    effects: { intelligence: 5, popularity: 5, happiness: 3 }
                },
                {
                    text: 'Join the art club',
                    effects: { intelligence: 3, popularity: 5, happiness: 8 }
                },
                {
                    text: 'Don\'t join anything',
                    effects: { }
                }
            ]
        }
    ],
    
    // Health events
    healthEvents: [
        {
            id: 'caught_cold',
            text: 'You\'re coming down with a cold.',
            category: 'health',
            choices: [
                {
                    text: 'Rest at home',
                    effects: { health: 10, intelligence: -5, popularity: -5 }
                },
                {
                    text: 'Go to school anyway',
                    effects: { health: -10, intelligence: 2, fitness: -5 }
                }
            ]
        },
        {
            id: 'ate_too_much',
            text: 'You ate way too much junk food.',
            category: 'health',
            choices: [
                {
                    text: 'Feel guilty',
                    effects: { health: -5, happiness: -5 }
                }
            ]
        }
    ],
    
    // Check for and generate events
    checkForEvents: function() {
        // Clear old events
        this.eventQueue = [];
        
        // Check for time-based events
        if (Game.isSchoolDay() && Game.state.time.period === 'morning') {
            // Chance for school events
            if (Math.random() < 0.15) {
                const event = this.schoolEvents[Math.floor(Math.random() * this.schoolEvents.length)];
                this.eventQueue.push(event);
            }
            
            // Chance for exam
            if (Math.random() < 0.1) {
                const examEvent = Education.generateExam();
                this.eventQueue.push(examEvent);
            }
            
            // Chance for assignment
            if (Math.random() < 0.15) {
                const assignmentEvent = Education.generateAssignment();
                this.eventQueue.push(assignmentEvent);
            }
        }
        
        // Check for relationship events
        if (Math.random() < 0.2) {
            const relationshipEvent = Relationships.generateRandomEvent();
            if (relationshipEvent) {
                this.eventQueue.push(relationshipEvent);
            }
        }
        
        // Check for random events
        for (const event of this.randomEvents) {
            if (Math.random() < event.probability) {
                this.eventQueue.push(event);
            }
        }
        
        // Check for health events
        if (Game.state.stats.health < 30) {
            if (Math.random() < 0.3) {
                const event = this.healthEvents[Math.floor(Math.random() * this.healthEvents.length)];
                this.eventQueue.push(event);
            }
        }
        
        // Check for stat-based events
        if (Game.state.stats.energy < 20) {
            this.eventQueue.push({
                text: 'You\'re exhausted and can barely keep your eyes open.',
                category: 'health',
                choices: [
                    {
                        text: 'Rest immediately',
                        effects: { health: 5 }
                    }
                ]
            });
        }
        
        if (Game.state.stats.happiness < 20) {
            this.eventQueue.push({
                text: 'You\'re feeling really down lately.',
                category: 'health',
                choices: [
                    {
                        text: 'Talk to someone',
                        effects: { happiness: 10, popularity: 5 }
                    },
                    {
                        text: 'Deal with it alone',
                        effects: { happiness: -5, health: -5 }
                    }
                ]
            });
        }
        
        return this.eventQueue;
    },
    
    // Get next event from queue
    getNextEvent: function() {
        return this.eventQueue.shift();
    },
    
    // Check if event queue has events
    hasEvents: function() {
        return this.eventQueue.length > 0;
    },
    
    // Process event choice
    processChoice: function(event, choiceIndex) {
        if (!event.choices || choiceIndex >= event.choices.length) {
            return null;
        }
        
        const choice = event.choices[choiceIndex];
        
        // Check requirements
        if (choice.requirement) {
            for (const [stat, value] of Object.entries(choice.requirement)) {
                if (Game.state.stats[stat] < value) {
                    return {
                        success: false,
                        message: `Not enough ${stat}!`
                    };
                }
            }
        }
        
        // Apply effects
        if (choice.effects) {
            for (const [stat, value] of Object.entries(choice.effects)) {
                Game.modifyStat(stat, value);
            }
            
            // Apply relationship effects if present
            if (event.relationshipId && choice.effects.relationship) {
                Relationships.modifyRelationship(event.relationshipId, choice.effects.relationship);
            }
        }
        
        // Execute callback if present
        if (choice.callback) {
            const result = choice.callback();
            if (result && result.message) {
                return {
                    success: true,
                    message: result.message
                };
            }
        }
        
        return {
            success: true,
            message: `You chose: ${choice.text}`
        };
    }
};
