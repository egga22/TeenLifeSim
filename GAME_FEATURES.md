# Teen Life Simulator - Game Features

## Overview
A complete teenage life simulation game built with HTML, CSS, and Vanilla JavaScript. This beta build includes all core systems and is fully playable.

## Core Systems

### 1. State Management (`js/state.js`)
- Centralized game state with observer pattern for reactive updates
- Automatic save/load functionality using localStorage
- Time tracking system (days and periods: morning, afternoon, evening, night)
- Activity logging system
- Screen management

### 2. Character System (`js/character.js`)
- **Attributes tracked:**
  - Health (0-100)
  - Happiness (0-100)
  - Energy (0-100)
  - Grades (0-100)
  - Money (unlimited)
- Attribute validation and clamping
- Status calculation based on attribute levels
- Grade letter calculation (A-F)

### 3. Relationships System (`js/relationships.js`)
- **Default relationships:**
  - Mom
  - Dad
  - Best Friend
  - Crush
  - Rival
- Dynamic relationship levels (0-100)
- Status descriptions (Hostile, Distant, Acquaintance, Friendly, Close, Best Friends)
- Relationship modifications based on activities and events

### 4. Inventory System (`js/inventory.js`)
- **Items available:**
  - Snack (Health +5, Happiness +3)
  - Energy Drink (Energy +20, Health -5)
  - Textbook (Grades +10)
  - Video Game (Happiness +15, Energy -10)
  - Smartphone (Happiness +10)
  - Skateboard (Happiness +10, Health +5)
  - Guitar (Happiness +15)
- Item usage with effects
- Buy/sell functionality
- Quantity tracking

### 5. Activities System (`js/activities.js`)
- **15 Different Activities:**
  1. Study - Improve grades
  2. Take a Nap - Restore energy
  3. Hang Out with Friends - Build relationships and happiness
  4. Exercise - Improve health
  5. Play Video Games - Increase happiness
  6. Work Part-Time Job - Earn money
  7. Talk to Parents - Improve family relationships
  8. Go on a Date - Build romantic relationships
  9. School Club Activity - Balance grades and happiness
  10. Browse Social Media - Quick happiness boost
  11. Eat Healthy Meal - Improve health
  12. Eat Junk Food - Quick happiness, health cost
  13. Go Shopping - Access the shop
  14. Practice Hobby - Skill development
  15. Volunteer Work - Happiness and family relationships

- Requirements system (some activities need minimum energy, money, etc.)
- Time advancement (most activities advance the game clock)
- Multiple attribute effects per activity

### 6. Events System (`js/events.js`)
- **8 Random Events:**
  1. Pop Quiz - Test your academic skills
  2. Birthday Party Invitation - Social choices
  3. Found Money - Moral decisions
  4. Sports Team Tryouts - Physical challenge
  5. Unexpected Encounter - Romantic interactions
  6. Rival Challenge - Competition choices
  7. Parent Check-in - Family dynamics
  8. Weekend Decision - Life balance

- Weighted random event triggering (30% chance after activities)
- Multiple choice outcomes for each event
- Requirements system for some events
- Relationship and attribute effects

### 7. UI System (`js/ui.js`)
- Real-time stat bars with color coding
- Dynamic activity list with availability checking
- Event system with choices
- Message display system
- Activity log with timestamps
- Inventory display with click-to-use
- Relationship status display
- Shop interface

### 8. Game Loop (`js/game.js`)
- Auto-save every 60 seconds
- Save on page unload
- Load game on startup
- Debug mode (set `GameConfig.debug = true`)

## How to Play

1. **Start the Game:**
   - Enter your character name
   - Click "Start Game"

2. **Manage Your Stats:**
   - Keep all attributes balanced
   - Low stats can affect available activities
   - Money is earned through part-time work

3. **Build Relationships:**
   - Activities and events affect relationship levels
   - Higher relationships unlock better outcomes

4. **Progress Through Days:**
   - Each activity advances time
   - Four periods per day: morning, afternoon, evening, night
   - Stats naturally decay over time

5. **Make Choices:**
   - Random events present moral and strategic choices
   - Each choice has consequences
   - Build your unique story

## Technical Architecture

### Extensibility Features

1. **Easy to Add Content:**
   - Activities: Add to `activityDefinitions` array
   - Events: Add to `eventDefinitions` array
   - Items: Add to `itemDefinitions` object
   - Relationships: Use `RelationshipsManager.addRelationship()`

2. **Modular Design:**
   - Each system is independent
   - Observer pattern for reactive UI updates
   - No external dependencies

3. **State Management:**
   - Centralized state in `GameState`
   - Easy to save/load
   - Observable for UI synchronization

## File Structure
```
/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling
└── js/
    ├── state.js        # State management system
    ├── character.js    # Character attributes
    ├── relationships.js # Relationships system
    ├── inventory.js    # Inventory system
    ├── events.js       # Random events
    ├── activities.js   # Daily activities
    ├── ui.js           # UI management
    └── game.js         # Game loop and initialization
```

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- No external dependencies
- LocalStorage for save games
- Responsive design for mobile devices

## Future Enhancement Opportunities

1. **More Content:**
   - Additional events and activities
   - More items and shop categories
   - New relationship types
   - Season/holiday special events

2. **New Systems:**
   - Achievement system
   - Skill tree
   - Career paths
   - School subjects breakdown
   - Multiple save slots

3. **Gameplay:**
   - Difficulty levels
   - Goal-oriented gameplay
   - Ending conditions
   - Character customization options

4. **Technical:**
   - Sound effects and music
   - Animations
   - Visual novel style scenes
   - Mini-games

## Version
**1.0.0-beta** - Complete playable build with all core systems
