# Customization Guide

This guide explains how to customize and extend the Teen Life Simulator game.

## Table of Contents
1. [Adding New Events](#adding-new-events)
2. [Modifying Stats](#modifying-stats)
3. [Creating New Systems](#creating-new-systems)
4. [Customizing UI](#customizing-ui)
5. [Extending AI Integration](#extending-ai-integration)

## Adding New Events

### Event Structure
Events are defined in `js/events.js`. Each event follows this structure:

```javascript
{
    id: 'unique_event_id',
    title: 'Event Title',
    description: 'Event description text that sets the scene',
    emoji: '🎯',
    choices: [
        {
            text: 'Choice button text',
            effects: { 
                happiness: 5,      // -15 to +15
                health: -10,       // Usually negative for energy use
                intelligence: 0,
                social: 0,
                energy: -5
            },
            resultText: 'What happens when player chooses this',
            relationship: {     // Optional
                name: 'Person Name',
                change: 10,     // -20 to +20
                type: 'friend'  // friend, romantic, family, teacher, rival
            }
        }
    ]
}
```

### Categories
Events are organized into categories in the `getEventDatabase()` method:
- **school**: Academic and school-related events (weekdays only)
- **social**: Friends, parties, social interactions
- **family**: Home life, parents, siblings
- **personal**: Self-improvement, hobbies, emotions
- **random**: Unexpected one-off events

### Adding a New Event

1. Open `js/events.js`
2. Find the appropriate category (e.g., `school:`)
3. Add your event to the array:

```javascript
school: [
    // ... existing events ...
    {
        id: 'school_science_fair',
        title: 'Science Fair Project',
        description: 'The science fair is coming up. You need to decide on a project.',
        emoji: '🔬',
        choices: [
            {
                text: 'Build a robot',
                effects: { intelligence: 10, energy: -20, happiness: 5 },
                resultText: 'Your robot works! You win third place.',
                relationship: { name: 'Science Teacher', change: 15, type: 'teacher' }
            },
            {
                text: 'Do a biology experiment',
                effects: { intelligence: 8, energy: -15, health: 5 },
                resultText: 'Your plant growth experiment is well-received.'
            },
            {
                text: 'Partner with a friend',
                effects: { intelligence: 7, social: 10, energy: -15, happiness: 8 },
                resultText: 'Working together makes it more fun!',
                relationship: { name: 'Lab Partner', change: 20 }
            }
        ]
    }
]
```

## Modifying Stats

### Changing Initial Values
Edit `js/config.js`:

```javascript
initialStats: {
    happiness: 70,      // Start happier/sadder
    health: 80,         // Start healthier/less healthy
    intelligence: 60,   // Start smarter/less educated
    social: 65,         // Start more/less popular
    energy: 75          // Start more/less energetic
}
```

### Adding New Stats

1. Add to `config.js`:
```javascript
initialStats: {
    // ... existing stats ...
    creativity: 50,     // New stat
    athletic: 60        // New stat
}
```

2. Update `index.html` to add UI elements:
```html
<div class="stat-item">
    <label>Creativity</label>
    <div class="stat-bar">
        <div class="stat-fill creativity" id="creativityStat" style="width: 50%"></div>
    </div>
    <span class="stat-value" id="creativityValue">50</span>
</div>
```

3. Add CSS for new stat color in `styles.css`:
```css
.stat-fill.creativity {
    background: linear-gradient(90deg, #fb923c, #f97316);
}
```

4. Update `js/ui.js` to render new stat:
```javascript
renderStats() {
    const stats = this.stateManager.getState().character.stats;
    // ... existing stats ...
    this.updateStat('creativity', stats.creativity);
}
```

### Stat Balance Tips
- Keep effects between -15 and +15 for major events
- Daily activities should be -5 to +5
- Energy costs should reflect activity intensity
- Negative consequences should feel fair, not punishing
- Positive outcomes should feel earned

## Creating New Systems

### Example: Achievement System

1. Create `js/achievements.js`:
```javascript
class AchievementSystem {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.achievements = this.getAchievementDatabase();
    }
    
    getAchievementDatabase() {
        return {
            'social_butterfly': {
                name: 'Social Butterfly',
                description: 'Form 10 relationships',
                check: (state) => state.relationships.length >= 10
            },
            'bookworm': {
                name: 'Bookworm',
                description: 'Reach 90+ Intelligence',
                check: (state) => state.character.stats.intelligence >= 90
            }
        };
    }
    
    checkAchievements() {
        const state = this.stateManager.getState();
        const unlocked = [];
        
        Object.entries(this.achievements).forEach(([id, achievement]) => {
            if (achievement.check(state) && !state.unlockedAchievements?.includes(id)) {
                unlocked.push(achievement);
            }
        });
        
        return unlocked;
    }
}
```

2. Add to `index.html`:
```html
<script src="js/achievements.js"></script>
```

3. Initialize in `js/game.js`:
```javascript
const achievementSystem = new AchievementSystem(stateManager);
```

4. Check achievements in `js/gameEngine.js`:
```javascript
async nextDay() {
    // ... existing code ...
    
    // Check achievements
    const newAchievements = achievementSystem.checkAchievements();
    if (newAchievements.length > 0) {
        // Show achievement notification
    }
}
```

## Customizing UI

### Changing Colors
Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;      /* Main purple */
    --primary-dark: #4f46e5;       /* Dark purple */
    --secondary-color: #8b5cf6;    /* Light purple */
    --success-color: #10b981;      /* Green */
    --warning-color: #f59e0b;      /* Orange */
    --danger-color: #ef4444;       /* Red */
    --bg-color: #f8fafc;           /* Light gray background */
    --surface-color: #ffffff;      /* White cards */
    --text-primary: #1e293b;       /* Dark text */
    --text-secondary: #64748b;     /* Gray text */
    --border-color: #e2e8f0;       /* Light borders */
}
```

### Adding New UI Sections

1. Add HTML in `index.html`:
```html
<div class="inventory-container">
    <h3>Inventory</h3>
    <div id="inventoryList"></div>
</div>
```

2. Add CSS in `styles.css`:
```css
.inventory-container {
    background: var(--surface-color);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: var(--shadow);
}
```

3. Add UI logic in `js/ui.js`:
```javascript
renderInventory() {
    const inventory = this.stateManager.getState().inventory || [];
    // Render inventory items
}
```

### Custom Animations
Add to `styles.css`:

```css
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.event-container {
    animation: slideIn 0.5s ease;
}
```

## Extending AI Integration

### Custom AI Prompts
Modify `js/geminiAPI.js` `buildEventPrompt()` method:

```javascript
buildEventPrompt(context) {
    return `You are a creative writer for a teenage life simulation game.

Character: ${context.character.name}, Age ${context.character.age}
Stats: Happiness ${context.character.stats.happiness}/100

IMPORTANT RULES:
- Keep events age-appropriate (PG-13)
- Focus on realistic teenage scenarios
- Include exactly 3 choices
- Make choices meaningfully different
- Effects should range -15 to +15
- Consider character's current emotional state

Generate a ${context.moodPrompt} event.

[Include your custom instructions here]

Respond with JSON: { "title": "...", "description": "...", ... }`;
}
```

### Add Context Awareness

In `js/gameEngine.js`, enhance `buildContext()`:

```javascript
buildContext() {
    const state = this.stateManager.getState();
    const stats = state.character.stats;
    
    // Determine mood/theme based on stats
    let moodPrompt = 'balanced';
    if (stats.happiness < 40) {
        moodPrompt = 'mood-lifting';
    } else if (stats.energy < 40) {
        moodPrompt = 'low-energy, relaxing';
    } else if (stats.social < 40) {
        moodPrompt = 'social opportunity';
    }
    
    return {
        character: state.character,
        time: state.time,
        relationships: state.relationships,
        recentHistory: state.history.slice(0, 5),
        moodPrompt  // Add this
    };
}
```

### Alternative AI Providers

To use a different AI service, modify `js/geminiAPI.js`:

```javascript
async generateEvent(context) {
    const prompt = this.buildEventPrompt(context);
    
    // Example: OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.9
        })
    });
    
    // Parse response accordingly
}
```

## Advanced Customization

### Save File Format
Save files are stored in localStorage as JSON:

```javascript
{
    character: {
        name: "Alex",
        age: 14,
        grade: 9,
        stats: { happiness: 75, ... }
    },
    time: {
        day: 15,
        week: 2,
        totalDays: 15,
        ...
    },
    relationships: [...],
    history: [...],
    currentEvent: {...}
}
```

You can import/export saves:

```javascript
// Export
const saveData = localStorage.getItem('teenLifeSim_gameState');
console.log(saveData);  // Copy this

// Import
localStorage.setItem('teenLifeSim_gameState', importedData);
```

### Event Probability Weights
Modify `EVENT_CATEGORIES` in `js/config.js`:

```javascript
const EVENT_CATEGORIES = {
    school: { weight: 0.4 },    // 40% of events
    social: { weight: 0.3 },    // 30% of events
    family: { weight: 0.1 },    // 10% of events
    personal: { weight: 0.15 }, // 15% of events
    random: { weight: 0.05 }    // 5% of events
};
```

### Custom Ending Conditions
Modify `js/stateManager.js` `isGameOver()`:

```javascript
isGameOver() {
    const stats = this.state.character.stats;
    const time = this.state.time;
    
    // Original conditions
    if (stats.happiness <= 0 || stats.health <= 0) {
        return true;
    }
    
    // Victory condition: Graduate with high stats
    if (this.state.character.grade === 12 && time.totalDays > 365 * 4) {
        if (stats.happiness > 80 && stats.intelligence > 80) {
            return 'victory';
        }
    }
    
    return false;
}
```

## Testing Your Changes

1. Always test in a browser (not just syntax check)
2. Check browser console for errors (F12)
3. Test with AI enabled and disabled
4. Verify save/load still works
5. Test extreme stat values (0, 100)
6. Try different event paths
7. Check mobile responsiveness

## Best Practices

1. **Keep backups** before major changes
2. **Test incrementally** - change one thing at a time
3. **Comment your code** for future reference
4. **Balance gameplay** - test if changes are fun
5. **Consider edge cases** - what if stats hit limits?
6. **Maintain style consistency** - match existing patterns
7. **Document your changes** - update README if needed

## Community Sharing

To share your customizations:
1. Fork the repository
2. Make your changes
3. Document what you changed
4. Share with others!

## Need Help?

- Check browser console for error messages
- Review existing code for patterns
- Test changes in isolation
- Start small and build up

Happy customizing! 🎮
