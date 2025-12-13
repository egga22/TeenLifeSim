# Teen Life Simulator - Beta Build

A comprehensive teenage life simulation video game built with HTML, CSS, and vanilla JavaScript. Navigate the challenges and opportunities of teenage years from age 15 to 18.

## Features

### Core Systems

- **Character Stats Management**: Track health, happiness, intelligence, popularity, fitness, and money
- **Actions System**: Each day you have actions to spend - 3 if you attend school, 8 if you skip or it's the weekend
- **Time Management System**: Progress through morning, afternoon, evening, and night periods with realistic day/week cycles
- **School Decision System**: Choose daily whether to attend school (3 actions) or skip (8 actions with risks)
- **Save/Load System**: Persistent game saves using localStorage
- **Dynamic Event System**: Random events, school events, relationship events, and health events
- **Activity System**: 20+ unique activities including studying, socializing, sports, work, and leisure

### Gameplay Systems

#### Education System
- Track grades in 6 subjects (Math, Science, English, History, Art, Physical Education)
- Study to improve grades
- Take exams and complete assignments
- Attend school on weekdays
- Grade average calculation and letter grades

#### Relationships System
- Manage relationships with family, friends, and acquaintances
- Relationship values from 0-100
- Dynamic relationship events and interactions
- Relationship status changes based on interactions

#### Activities
- **Study Activities**: Math, Science, English
- **Social Activities**: Hang out with friends, parties, social media
- **Physical Activities**: Exercise, sports practice
- **Work**: Part-time job (available at age 15+)
- **Leisure**: Video games, TV, reading, music, art
- **Self-Care**: Rest and sleep

### Event System
- Random events with multiple choice outcomes
- School events (pop quizzes, projects, club fair)
- Relationship events (friend invitations, family dinners)
- Health events (getting sick, stress management)
- Stat-based triggered events

## How to Play

### Starting the Game
1. Open `index.html` in a web browser
2. Enter your character's name
3. Choose your gender
4. Click "Start New Game"

### Gameplay
1. **Make School Decisions**: Each school day, choose to attend (3 actions) or skip (8 actions, but risky!)
2. **Check Your Stats**: Monitor health, happiness, intelligence, popularity, fitness, money, and grades
3. **Choose Activities**: Click on available activities to perform them (costs actions)
4. **Advance Time**: Click "Advance Time" to progress to the next period
5. **Handle Events**: Make choices during random events that affect your stats and relationships
6. **Save Progress**: Click "Save Game" to save your progress
7. **Manage Resources**: Balance your actions wisely between school, fun, and responsibilities

### Tips for Success
- **Attending school** is safer and improves grades, but gives fewer actions (3 per day)
- **Skipping school** gives more actions (8) but has consequences: 50% safe, 25% Saturday detention, 25% grounded
- Being **grounded** lasts 7 days - no allowance and must do mandatory chores daily
- Study regularly to maintain good grades
- Build **popularity** to unlock social opportunities
- Maintain relationships through positive interactions
- Balance fun activities with responsibilities
- Save money for special opportunities

## File Structure

```
GeminiTeenLifeSim/
├── index.html              # Main HTML structure
├── styles.css             # All styling and UI design
├── js/
│   ├── main.js           # Initialization and entry point
│   ├── game.js           # Core game state and mechanics
│   ├── storage.js        # Save/load system
│   ├── activities.js     # Activity definitions and logic
│   ├── relationships.js  # Relationship management
│   ├── education.js      # Education system
│   ├── events.js         # Event generation and handling
│   └── ui.js             # UI updates and interactions
└── README.md             # This file
```

## Customization Guide

### Adding New Activities
Edit `js/activities.js` and add to the `definitions` object:

```javascript
your_activity: {
    name: 'Activity Name',
    description: 'Description',
    actionCost: 1,
    effects: {
        stat_name: value_change
    },
    availableWhen: ['morning', 'afternoon', 'evening', 'night']
}
```

### Adding New Events
Edit `js/events.js` and add to the appropriate event array:

```javascript
{
    id: 'event_id',
    text: 'Event description',
    category: 'category_name',
    probability: 0.05,
    choices: [
        {
            text: 'Choice text',
            effects: { stat: value }
        }
    ]
}
```

### Adding New Relationships
Edit `js/relationships.js` in the `init()` function:

```javascript
this.addRelationship('character_id', 'Character Name', this.types.FRIEND, 50);
```

### Modifying Subjects
Edit `js/education.js` and update the `subjectList` array and `getSubjectDisplayName()` function.

## Technical Details

### Browser Compatibility
- Modern browsers with ES6 support
- localStorage support required for save/load functionality

### Dependencies
- None! Pure vanilla JavaScript, HTML5, and CSS3

### Performance
- Lightweight and fast
- No external API calls
- All data stored locally

## Future Expansion Ideas

The game is designed with extensibility in mind. Potential additions include:

- **Achievement System**: Track milestones and unlock rewards
- **Inventory System**: Expand with usable items and collectibles
- **Romance System**: Dating mechanics and romantic relationships
- **Career Paths**: Choose specializations and unlock unique opportunities
- **Mini-Games**: Interactive skill-based challenges
- **Character Customization**: Appearance and personality traits
- **Multiplayer**: Compare progress with friends
- **Modding Support**: JSON-based content packs

## Development

### Testing
Simply open `index.html` in a web browser. No build process required.

### Local Server (Optional)
```bash
python3 -m http.server 8080
# Then visit http://localhost:8080
```

## License

Open source - feel free to modify and customize!

## Credits

Created as a comprehensive beta build for a teenage life simulation game.

---

**Note**: This is a beta build focused on providing deep, customizable backend systems while remaining fully playable. All core mechanics are implemented and functional.