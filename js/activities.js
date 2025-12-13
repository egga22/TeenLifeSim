// Activities System
const Activities = {
    // Activity definitions
    definitions: {
        // Study Activities
        study_math: {
            name: 'Study Math',
            description: 'Work on math homework and problems',
            actionCost: 1,
            effects: {
                intelligence: 3,
                happiness: -2
            },
            schoolSubject: 'math',
            availableWhen: ['morning', 'afternoon', 'evening']
        },
        study_science: {
            name: 'Study Science',
            description: 'Read science textbooks and do experiments',
            actionCost: 1,
            effects: {
                intelligence: 3,
                happiness: -1
            },
            schoolSubject: 'science',
            availableWhen: ['morning', 'afternoon', 'evening']
        },
        study_english: {
            name: 'Study English',
            description: 'Read literature and practice writing',
            actionCost: 1,
            effects: {
                intelligence: 2,
                happiness: 0
            },
            schoolSubject: 'english',
            availableWhen: ['morning', 'afternoon', 'evening']
        },
        
        // Social Activities
        hang_out: {
            name: 'Hang Out with Friends',
            description: 'Spend time with your friends',
            actionCost: 1,
            effects: {
                popularity: 5,
                happiness: 5,
                intelligence: -1
            },
            availableWhen: ['afternoon', 'evening']
        },
        party: {
            name: 'Go to a Party',
            description: 'Attend a party (weekend only)',
            actionCost: 1,
            effects: {
                popularity: 10,
                happiness: 10,
                health: -5
            },
            availableWhen: ['evening', 'night'],
            weekendOnly: true
        },
        social_media: {
            name: 'Check Social Media',
            description: 'Browse social media and chat online',
            actionCost: 1,
            effects: {
                popularity: 2,
                happiness: 2
            },
            availableWhen: ['morning', 'afternoon', 'evening', 'night']
        },
        
        // Physical Activities
        exercise: {
            name: 'Exercise',
            description: 'Go for a run or work out',
            actionCost: 1,
            effects: {
                fitness: 5,
                health: 3,
                happiness: 3
            },
            availableWhen: ['morning', 'afternoon', 'evening']
        },
        sports_practice: {
            name: 'Sports Practice',
            description: 'Practice your favorite sport',
            actionCost: 1,
            effects: {
                fitness: 7,
                health: 2,
                popularity: 3,
                happiness: 5
            },
            availableWhen: ['afternoon', 'evening']
        },
        
        // Work Activities
        part_time_job: {
            name: 'Part-Time Job',
            description: 'Work for money',
            actionCost: 1,
            effects: {
                money: 50,
                happiness: -5,
                popularity: 1
            },
            availableWhen: ['afternoon', 'evening'],
            minimumAge: 15
        },
        do_chores: {
            name: 'Do Chores',
            description: 'Help with household chores',
            actionCost: 1,
            effects: {
                money: 20,
                happiness: -3
            },
            availableWhen: ['morning', 'afternoon', 'evening']
        },
        
        // Leisure Activities
        play_games: {
            name: 'Play Video Games',
            description: 'Relax and play games',
            actionCost: 1,
            effects: {
                happiness: 8,
                intelligence: -1,
                fitness: -1
            },
            availableWhen: ['afternoon', 'evening', 'night']
        },
        watch_tv: {
            name: 'Watch TV',
            description: 'Watch shows and movies',
            actionCost: 1,
            effects: {
                happiness: 5,
                fitness: -1
            },
            availableWhen: ['evening', 'night']
        },
        read_book: {
            name: 'Read a Book',
            description: 'Read for pleasure',
            actionCost: 1,
            effects: {
                intelligence: 2,
                happiness: 4
            },
            availableWhen: ['afternoon', 'evening', 'night']
        },
        
        // Self-Care
        rest: {
            name: 'Rest',
            description: 'Take a nap or relax',
            actionCost: 1,
            effects: {
                health: 5,
                happiness: 2
            },
            availableWhen: ['afternoon', 'evening']
        },
        sleep: {
            name: 'Sleep',
            description: 'Get a good night\'s sleep',
            actionCost: 0,
            effects: {
                health: 10
            },
            availableWhen: ['night'],
            advancesTime: true
        },
        
        // Special Activities
        volunteer: {
            name: 'Volunteer Work',
            description: 'Help out in the community',
            actionCost: 1,
            effects: {
                happiness: 8,
                popularity: 4,
                intelligence: 1
            },
            availableWhen: ['afternoon'],
            weekendOnly: true
        },
        music_practice: {
            name: 'Practice Music',
            description: 'Play an instrument or sing',
            actionCost: 1,
            effects: {
                intelligence: 2,
                happiness: 6,
                popularity: 1
            },
            availableWhen: ['afternoon', 'evening']
        },
        art_project: {
            name: 'Work on Art',
            description: 'Draw, paint, or create',
            actionCost: 1,
            effects: {
                intelligence: 2,
                happiness: 7,
                popularity: 1
            },
            availableWhen: ['afternoon', 'evening']
        }
    },
    
    // Get available activities for current time
    getAvailableActivities: function() {
        const available = [];
        const currentPeriod = Game.state.time.period;
        const isWeekend = Game.isWeekend();
        const playerAge = Game.state.player.age;
        const isGrounded = Game.state.grounding.isGrounded;
        
        for (const [id, activity] of Object.entries(this.definitions)) {
            // Check if available in current time period
            if (!activity.availableWhen.includes(currentPeriod)) {
                continue;
            }
            
            // Check weekend requirement
            if (activity.weekendOnly && !isWeekend) {
                continue;
            }
            
            // Check age requirement
            if (activity.minimumAge && playerAge < activity.minimumAge) {
                continue;
            }
            
            // If grounded, only allow chores and mandatory activities
            if (isGrounded && id !== 'do_chores' && id !== 'sleep' && id !== 'study_math' && id !== 'study_science' && id !== 'study_english') {
                continue;
            }
            
            // Check if player has enough actions
            const canAfford = Game.hasActionsAvailable() || activity.actionCost === 0;
            
            available.push({
                id: id,
                ...activity,
                canAfford: canAfford
            });
        }
        
        return available;
    },
    
    // Perform activity
    performActivity: function(activityId) {
        const activity = this.definitions[activityId];
        
        if (!activity) {
            return { success: false, message: 'Activity not found' };
        }
        
        // Check action cost requirement (sleep is free)
        if (activity.actionCost > 0 && !Game.hasActionsAvailable()) {
            return { success: false, message: 'Not enough actions remaining!' };
        }
        
        // If this is chores and player is grounded, mark mandatory chores as done
        if (activityId === 'do_chores' && Game.state.grounding.isGrounded) {
            const choresResult = Game.completeMandatoryChores();
            if (choresResult.success) {
                // Don't give money for mandatory chores when grounded
                const effects = { ...activity.effects };
                effects.money = 0;
                
                // Apply modified effects
                for (const [stat, value] of Object.entries(effects)) {
                    Game.modifyStat(stat, value);
                }
                
                Game.useAction();
                return {
                    success: true,
                    message: 'You completed your mandatory chores (no allowance while grounded).',
                    activity: activity
                };
            }
        }
        
        // Use action (if it costs actions)
        if (activity.actionCost > 0) {
            Game.useAction();
        }
        
        // Apply effects
        for (const [stat, value] of Object.entries(activity.effects)) {
            Game.modifyStat(stat, value);
        }
        
        // Apply to education if it's a study activity
        if (activity.schoolSubject) {
            Education.study(activity.schoolSubject, activity.effects.intelligence || 0);
        }
        
        // Build result message
        let message = `You ${activity.name.toLowerCase()}.`;
        
        const effectMessages = [];
        for (const [stat, value] of Object.entries(activity.effects)) {
            if (value > 0) {
                effectMessages.push(`+${value} ${stat}`);
            } else if (value < 0) {
                effectMessages.push(`${value} ${stat}`);
            }
        }
        
        if (effectMessages.length > 0) {
            message += ' ' + effectMessages.join(', ');
        }
        
        return {
            success: true,
            message: message,
            activity: activity
        };
    }
};
