// Event System

class EventSystem {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.events = this.getEventDatabase();
    }

    // Get event database
    getEventDatabase() {
        return {
            school: [
                {
                    id: 'school_test',
                    title: 'Pop Quiz Alert!',
                    description: 'Your teacher announces a surprise quiz in math class. You feel...',
                    emoji: '📝',
                    choices: [
                        {
                            text: 'Study hard and focus',
                            effects: { intelligence: 5, energy: -10, happiness: -5 },
                            resultText: 'You ace the quiz! Your teacher is impressed.'
                        },
                        {
                            text: 'Wing it and hope for the best',
                            effects: { energy: -5, happiness: -2, intelligence: 1 },
                            resultText: 'You get a decent score, nothing special.'
                        },
                        {
                            text: 'Ask a friend for help',
                            effects: { intelligence: 3, social: 5, energy: -5 },
                            resultText: 'Your friend helps you out. Teamwork!',
                            relationship: { name: 'Study Buddy', change: 10 }
                        }
                    ]
                },
                {
                    id: 'school_presentation',
                    title: 'Class Presentation',
                    description: 'You have to give a presentation in front of the class. How do you handle it?',
                    emoji: '🎤',
                    choices: [
                        {
                            text: 'Prepare thoroughly',
                            effects: { intelligence: 5, social: 5, energy: -15, happiness: 5 },
                            resultText: 'Your presentation goes great! Everyone is impressed.'
                        },
                        {
                            text: 'Keep it casual',
                            effects: { social: 3, energy: -5 },
                            resultText: 'You do okay. Nothing memorable, but you survived.'
                        },
                        {
                            text: 'Try to get out of it',
                            effects: { happiness: -10, social: -5 },
                            resultText: 'You feel guilty about avoiding responsibility.'
                        }
                    ]
                },
                {
                    id: 'school_club',
                    title: 'Join a Club?',
                    description: 'Club fair day! There are so many interesting clubs to join.',
                    emoji: '🏆',
                    choices: [
                        {
                            text: 'Join the debate team',
                            effects: { intelligence: 8, social: 5, energy: -10 },
                            resultText: 'Great choice! You meet smart, interesting people.',
                            relationship: { name: 'Debate Partner', change: 15 }
                        },
                        {
                            text: 'Join the sports team',
                            effects: { health: 8, social: 7, energy: -15, happiness: 5 },
                            resultText: 'Athletics feels great! You bond with teammates.',
                            relationship: { name: 'Teammate', change: 15 }
                        },
                        {
                            text: 'Skip clubs for now',
                            effects: { energy: 5 },
                            resultText: 'You have more free time, but miss out on activities.'
                        }
                    ]
                }
            ],
            social: [
                {
                    id: 'social_party',
                    title: 'Party Invitation',
                    description: 'You\'re invited to a party this weekend. What do you do?',
                    emoji: '🎉',
                    choices: [
                        {
                            text: 'Go and have fun!',
                            effects: { happiness: 10, social: 10, energy: -15, health: -5 },
                            resultText: 'You have an amazing time! So many new friends.',
                            relationship: { name: 'Party Friend', change: 15 }
                        },
                        {
                            text: 'Go but leave early',
                            effects: { happiness: 5, social: 5, energy: -5 },
                            resultText: 'You make an appearance and head home early.'
                        },
                        {
                            text: 'Stay home and rest',
                            effects: { energy: 15, happiness: -5, social: -3 },
                            resultText: 'You recharge, but feel a bit left out.'
                        }
                    ]
                },
                {
                    id: 'social_drama',
                    title: 'Friend Drama',
                    description: 'Two of your friends are fighting and both want you to take their side.',
                    emoji: '😰',
                    choices: [
                        {
                            text: 'Try to mediate',
                            effects: { social: 10, intelligence: 5, energy: -10, happiness: -5 },
                            resultText: 'You help them work it out. They appreciate your wisdom.'
                        },
                        {
                            text: 'Stay neutral',
                            effects: { social: -5, happiness: -5 },
                            resultText: 'You avoid conflict, but both friends are annoyed.'
                        },
                        {
                            text: 'Distance yourself',
                            effects: { social: -10, happiness: -10, energy: 5 },
                            resultText: 'You avoid the drama, but lose some friendships.'
                        }
                    ]
                },
                {
                    id: 'social_crush',
                    title: 'Crush at School',
                    description: 'You notice someone cute keeps looking at you in class.',
                    emoji: '💕',
                    choices: [
                        {
                            text: 'Make a move',
                            effects: { happiness: 10, social: 5, energy: -5 },
                            resultText: 'They smile back! Something might be starting here.',
                            relationship: { name: 'Crush', change: 20, type: 'romantic' }
                        },
                        {
                            text: 'Talk to them casually',
                            effects: { social: 5, happiness: 5 },
                            resultText: 'You have a nice conversation. Friendship building!',
                            relationship: { name: 'New Friend', change: 10 }
                        },
                        {
                            text: 'Play it cool',
                            effects: { happiness: -2 },
                            resultText: 'You wait for the right moment... maybe next time.'
                        }
                    ]
                }
            ],
            family: [
                {
                    id: 'family_dinner',
                    title: 'Family Dinner',
                    description: 'Your parents want to have a family dinner. Everyone seems tense.',
                    emoji: '🍽️',
                    choices: [
                        {
                            text: 'Be present and engaged',
                            effects: { happiness: 5, social: 5, health: 5 },
                            resultText: 'Quality family time helps everyone feel better.',
                            relationship: { name: 'Family', change: 10, type: 'family' }
                        },
                        {
                            text: 'Eat quickly and leave',
                            effects: { social: -5, happiness: -3 },
                            resultText: 'You avoid tension but miss bonding time.'
                        },
                        {
                            text: 'Start a conversation',
                            effects: { social: 8, happiness: 8, intelligence: 3 },
                            resultText: 'You break the ice and everyone relaxes.',
                            relationship: { name: 'Family', change: 15, type: 'family' }
                        }
                    ]
                },
                {
                    id: 'family_chores',
                    title: 'Chore Time',
                    description: 'Your parents ask you to help with chores around the house.',
                    emoji: '🧹',
                    choices: [
                        {
                            text: 'Do them willingly',
                            effects: { happiness: 3, energy: -10, health: 5 },
                            resultText: 'Your parents appreciate your help.',
                            relationship: { name: 'Family', change: 8, type: 'family' }
                        },
                        {
                            text: 'Do them but complain',
                            effects: { happiness: -5, energy: -10 },
                            resultText: 'Chores are done but everyone\'s grumpy.'
                        },
                        {
                            text: 'Procrastinate',
                            effects: { happiness: -10, social: -10 },
                            resultText: 'This causes conflict and stress at home.',
                            relationship: { name: 'Family', change: -10, type: 'family' }
                        }
                    ]
                }
            ],
            personal: [
                {
                    id: 'personal_hobby',
                    title: 'New Hobby',
                    description: 'You have some free time. What hobby do you want to explore?',
                    emoji: '🎨',
                    choices: [
                        {
                            text: 'Learn an instrument',
                            effects: { intelligence: 8, happiness: 10, energy: -10 },
                            resultText: 'Music is therapeutic and fun!'
                        },
                        {
                            text: 'Start exercising',
                            effects: { health: 10, energy: -15, happiness: 8 },
                            resultText: 'You feel stronger and more energetic!'
                        },
                        {
                            text: 'Read books',
                            effects: { intelligence: 10, happiness: 5, energy: 5 },
                            resultText: 'You lose yourself in amazing stories.'
                        }
                    ]
                },
                {
                    id: 'personal_stress',
                    title: 'Feeling Overwhelmed',
                    description: 'Everything feels like too much. How do you cope?',
                    emoji: '😓',
                    choices: [
                        {
                            text: 'Take a mental health day',
                            effects: { happiness: 15, energy: 20, health: 10 },
                            resultText: 'Rest and self-care work wonders!'
                        },
                        {
                            text: 'Talk to someone',
                            effects: { happiness: 10, social: 5 },
                            resultText: 'Sharing your feelings helps a lot.',
                            relationship: { name: 'Confidant', change: 15 }
                        },
                        {
                            text: 'Push through it',
                            effects: { happiness: -10, health: -10, energy: -15 },
                            resultText: 'You manage, but you\'re exhausted.'
                        }
                    ]
                },
                {
                    id: 'personal_goal',
                    title: 'Set a Goal',
                    description: 'You want to improve yourself. What goal do you set?',
                    emoji: '🎯',
                    choices: [
                        {
                            text: 'Get better grades',
                            effects: { intelligence: 12, energy: -15, happiness: 5 },
                            resultText: 'Your academic performance improves!'
                        },
                        {
                            text: 'Make more friends',
                            effects: { social: 12, happiness: 8, energy: -10 },
                            resultText: 'Your social circle expands!',
                            relationship: { name: 'New Friend', change: 12 }
                        },
                        {
                            text: 'Focus on health',
                            effects: { health: 15, energy: -10, happiness: 8 },
                            resultText: 'You feel healthier and more vibrant!'
                        }
                    ]
                }
            ],
            random: [
                {
                    id: 'random_money',
                    title: 'Found Money',
                    description: 'You find $20 on the ground. What do you do?',
                    emoji: '💵',
                    choices: [
                        {
                            text: 'Keep it',
                            effects: { happiness: 5, social: -2 },
                            resultText: 'Free money! But you feel a bit guilty.'
                        },
                        {
                            text: 'Turn it in',
                            effects: { happiness: 8, social: 5 },
                            resultText: 'You feel good about doing the right thing.'
                        },
                        {
                            text: 'Donate it',
                            effects: { happiness: 10, social: 8 },
                            resultText: 'Helping others makes you feel great!'
                        }
                    ]
                },
                {
                    id: 'random_talent',
                    title: 'Hidden Talent',
                    description: 'You discover you\'re really good at something unexpected!',
                    emoji: '⭐',
                    choices: [
                        {
                            text: 'Pursue it seriously',
                            effects: { intelligence: 10, happiness: 12, energy: -15 },
                            resultText: 'You dedicate time to developing this talent!'
                        },
                        {
                            text: 'Keep it as a hobby',
                            effects: { happiness: 8, energy: -5 },
                            resultText: 'It\'s fun without the pressure!'
                        },
                        {
                            text: 'Share it with others',
                            effects: { social: 12, happiness: 10, energy: -10 },
                            resultText: 'People are impressed and want to learn from you!',
                            relationship: { name: 'Admirer', change: 15 }
                        }
                    ]
                }
            ]
        };
    }

    // Get random event
    getRandomEvent() {
        const state = this.stateManager.getState();
        const isSchoolDay = state.time.dayOfWeek >= 1 && state.time.dayOfWeek <= 5;
        
        // Filter categories based on day
        const availableCategories = Object.keys(EVENT_CATEGORIES).filter(category => {
            const categoryInfo = EVENT_CATEGORIES[category];
            if (categoryInfo.requiresSchoolDay && !isSchoolDay) {
                return false;
            }
            return true;
        });

        // Pick random category
        const category = this.pickWeightedCategory(availableCategories);
        
        // Pick random event from category
        const events = this.events[category];
        if (events && events.length > 0) {
            const event = events[Math.floor(Math.random() * events.length)];
            return {
                ...event,
                category
            };
        }

        return this.getDefaultEvent();
    }

    // Pick category based on weights
    pickWeightedCategory(categories) {
        const totalWeight = categories.reduce((sum, cat) => 
            sum + EVENT_CATEGORIES[cat].weight, 0);
        
        let random = Math.random() * totalWeight;
        
        for (const category of categories) {
            random -= EVENT_CATEGORIES[category].weight;
            if (random <= 0) {
                return category;
            }
        }
        
        return categories[0];
    }

    // Get default event if nothing else works
    getDefaultEvent() {
        return {
            id: 'default_day',
            title: 'A Regular Day',
            description: 'Nothing particularly exciting happens today. Just a normal day in your teenage life.',
            emoji: '📅',
            category: 'personal',
            choices: [
                {
                    text: 'Study',
                    effects: { intelligence: 5, energy: -10 },
                    resultText: 'You spend time studying and learning.'
                },
                {
                    text: 'Relax',
                    effects: { energy: 10, happiness: 5 },
                    resultText: 'You take it easy and recharge.'
                },
                {
                    text: 'Socialize',
                    effects: { social: 5, happiness: 5, energy: -5 },
                    resultText: 'You hang out with friends.'
                }
            ]
        };
    }

    // Get event that matches character's current state
    getContextualEvent() {
        const stats = this.stateManager.getState().character.stats;
        
        // If happiness is low, prioritize happiness-boosting events
        if (stats.happiness < CONFIG.statThresholds.low) {
            return this.getRandomEvent(); // Could be improved with mood-specific events
        }
        
        // If energy is low, suggest rest
        if (stats.energy < CONFIG.statThresholds.low) {
            return this.getRandomEvent();
        }
        
        return this.getRandomEvent();
    }
}
