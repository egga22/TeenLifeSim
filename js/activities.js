// Activities System
const Activities = {
    // Activity definitions
    definitions: {
        // Study Activities
        study_math: {
            name: 'Study Math',
            description: 'Work on math homework and problems',
            energyCost: 15,
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
            energyCost: 15,
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
            energyCost: 12,
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
            energyCost: 10,
            effects: {
                social: 5,
                happiness: 5,
                intelligence: -1
            },
            availableWhen: ['afternoon', 'evening']
        },
        party: {
            name: 'Go to a Party',
            description: 'Attend a party (weekend only)',
            energyCost: 20,
            effects: {
                social: 10,
                happiness: 10,
                health: -5
            },
            availableWhen: ['evening', 'night'],
            weekendOnly: true
        },
        social_media: {
            name: 'Check Social Media',
            description: 'Browse social media and chat online',
            energyCost: 5,
            effects: {
                social: 2,
                happiness: 2
            },
            availableWhen: ['morning', 'afternoon', 'evening', 'night']
        },
        
        // Physical Activities
        exercise: {
            name: 'Exercise',
            description: 'Go for a run or work out',
            energyCost: 20,
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
            energyCost: 25,
            effects: {
                fitness: 7,
                health: 2,
                social: 3,
                happiness: 5
            },
            availableWhen: ['afternoon', 'evening']
        },
        
        // Work Activities
        part_time_job: {
            name: 'Part-Time Job',
            description: 'Work for money',
            energyCost: 30,
            effects: {
                money: 50,
                happiness: -5,
                social: 1
            },
            availableWhen: ['afternoon', 'evening'],
            minimumAge: 15
        },
        
        // Leisure Activities
        play_games: {
            name: 'Play Video Games',
            description: 'Relax and play games',
            energyCost: 8,
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
            energyCost: 5,
            effects: {
                happiness: 5,
                fitness: -1
            },
            availableWhen: ['evening', 'night']
        },
        read_book: {
            name: 'Read a Book',
            description: 'Read for pleasure',
            energyCost: 8,
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
            energyCost: -20,
            effects: {
                health: 5,
                happiness: 2
            },
            availableWhen: ['afternoon', 'evening']
        },
        sleep: {
            name: 'Sleep',
            description: 'Get a good night\'s sleep',
            energyCost: -50,
            effects: {
                health: 10,
                energy: 60
            },
            availableWhen: ['night'],
            advancesTime: true
        },
        
        // Special Activities
        volunteer: {
            name: 'Volunteer Work',
            description: 'Help out in the community',
            energyCost: 20,
            effects: {
                happiness: 8,
                social: 4,
                intelligence: 1
            },
            availableWhen: ['afternoon'],
            weekendOnly: true
        },
        music_practice: {
            name: 'Practice Music',
            description: 'Play an instrument or sing',
            energyCost: 12,
            effects: {
                intelligence: 2,
                happiness: 6,
                social: 1
            },
            availableWhen: ['afternoon', 'evening']
        },
        art_project: {
            name: 'Work on Art',
            description: 'Draw, paint, or create',
            energyCost: 15,
            effects: {
                intelligence: 2,
                happiness: 7,
                social: 1
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
            
            // Check if player has enough energy
            const canAfford = Game.state.stats.energy >= activity.energyCost;
            
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
        
        // Check energy requirement
        if (Game.state.stats.energy < activity.energyCost) {
            return { success: false, message: 'Not enough energy!' };
        }
        
        // Apply energy cost
        Game.modifyStat('energy', -activity.energyCost);
        
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
