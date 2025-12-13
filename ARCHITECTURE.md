# Architecture Documentation

This document provides a deep dive into the game's architecture, designed for developers who want to understand or extend the system.

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                   Game.js (Main)                    │
│              Initializes all systems                │
└─────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ StateManager │  │  GameEngine  │  │ UIController │
│   (State)    │←→│   (Logic)    │←→│    (View)    │
└──────────────┘  └──────────────┘  └──────────────┘
        ↑                 ↑
        │                 │
    ┌───┴──────┬──────────┴───┬──────────┐
    ↓          ↓              ↓          ↓
┌─────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐
│Character│ │ Events │ │ Gemini  │ │ Config   │
│ System  │ │ System │ │   API   │ │          │
└─────────┘ └────────┘ └─────────┘ └──────────┘
```

## Core Components

### 1. StateManager (js/stateManager.js)

**Purpose**: Centralized state management with observer pattern

**Key Responsibilities**:
- Maintain single source of truth for game state
- Notify observers when state changes
- Handle persistence (save/load)
- Manage time progression
- Handle stat updates with bounds checking

**State Structure**:
```javascript
{
    character: {
        name: string,
        age: number,
        grade: number,
        stats: {
            happiness: 0-100,
            health: 0-100,
            intelligence: 0-100,
            social: 0-100,
            energy: 0-100
        }
    },
    time: {
        day: number,
        week: number,
        month: number,
        year: number,
        totalDays: number,
        season: string,
        dayOfWeek: 1-7
    },
    relationships: Array<{
        name: string,
        value: 0-100,
        type: string
    }>,
    history: Array<Event>,
    currentEvent: Event|null,
    settings: {
        useAI: boolean,
        apiKey: string
    }
}
```

**Key Methods**:
- `getState()`: Returns current state
- `setState(updates)`: Updates state and notifies observers
- `updateStats(changes)`: Updates stats with bounds checking
- `updateRelationship()`: Adds or updates relationships
- `advanceDay()`: Progress time by one day
- `saveGame()`/`loadGame()`: Persistence
- `isGameOver()`: Check end conditions

**Design Patterns**:
- **Observer Pattern**: Components subscribe to state changes
- **Singleton Pattern**: One instance manages all state
- **Immutability**: State updates create new objects

### 2. GameEngine (js/gameEngine.js)

**Purpose**: Core game logic and flow control

**Key Responsibilities**:
- Coordinate between all systems
- Handle game loop
- Process player choices
- Generate events (with or without AI)
- Manage game lifecycle

**Key Methods**:
- `init()`: Initialize game (new or load)
- `startNewGame()`: Reset to initial state
- `generateNewEvent()`: Get next event
- `handleChoice(index)`: Process player decision
- `nextDay()`: Advance to next day
- `updateSettings()`: Change configuration

**Event Generation Flow**:
```
1. Check if AI is enabled and configured
   ├─ Yes → Try Gemini API
   │         ├─ Success → Use AI event
   │         └─ Fail → Fallback to preset
   └─ No → Use preset events

2. Update state with new event
3. Render to UI
```

**Choice Processing Flow**:
```
1. Validate choice
2. Apply stat effects
3. Apply relationship changes
4. (Optional) Generate AI outcome text
5. Add to history
6. Check game over conditions
7. Update UI
```

### 3. Character System (js/character.js)

**Purpose**: Character-specific logic and calculations

**Key Responsibilities**:
- Calculate derived stats
- Provide character information
- Validate actions

**Key Methods**:
- `getStats()`: Current stat values
- `getStatLevel(stat)`: Descriptive level
- `canPerformAction()`: Check if has energy
- `getWellbeingScore()`: Overall happiness/health/energy
- `getAcademicScore()`: Intelligence + energy weighted
- `getSocialScore()`: Social + relationships weighted

**Derived Scores**:
```javascript
wellbeing = (happiness + health + energy) / 3
academic = (intelligence * 0.7 + energy * 0.3)
social = (social_stat * 0.6 + avg_relationship * 0.4)
```

### 4. EventSystem (js/events.js)

**Purpose**: Event database and selection logic

**Key Responsibilities**:
- Store event templates
- Select appropriate events
- Filter by context (day type, stats)
- Provide fallback events

**Event Categories**:
- **School** (30%): Academic, teachers, studying
- **Social** (25%): Friends, parties, drama
- **Family** (15%): Home, parents, chores
- **Personal** (20%): Hobbies, self-care, growth
- **Random** (10%): Unexpected occurrences

**Selection Algorithm**:
```
1. Filter by day type (school day vs weekend)
2. Apply category weights
3. Random weighted selection
4. Return event with choices
```

**Event Template**:
```javascript
{
    id: string,           // Unique identifier
    title: string,        // Display title
    description: string,  // Event narrative
    emoji: string,        // Visual icon
    category: string,     // Event type
    choices: Array<{
        text: string,           // Button text
        effects: Object,        // Stat changes
        resultText: string,     // Outcome
        relationship?: Object   // Optional relationship
    }>
}
```

### 5. GeminiAPI (js/geminiAPI.js)

**Purpose**: AI integration for dynamic content

**Key Responsibilities**:
- Communicate with Gemini API
- Build context-aware prompts
- Parse and validate responses
- Handle errors gracefully

**API Flow**:
```
1. Build prompt with context
   ↓
2. Send to Gemini API
   ↓
3. Receive JSON response
   ↓
4. Parse and validate
   ↓
5. Return event OR throw error
```

**Context Building**:
```javascript
- Character name, age, grade
- All current stats
- Time/season/day
- Recent relationships
- Event history (last 5)
```

**Prompt Engineering**:
- Strict JSON format requirement
- Age-appropriate content rules
- Stat effect boundaries
- Choice count requirements
- Realistic scenario guidelines

**Error Handling**:
- API key validation
- Network error catching
- Response parsing validation
- Automatic fallback to presets

### 6. UIController (js/ui.js)

**Purpose**: User interface management

**Key Responsibilities**:
- Render state to DOM
- Handle user interactions
- Manage modals and notifications
- Provide visual feedback

**Render Cycle**:
```
State Change → Observer Notified → UI.render()
    ↓
    ├─ renderCharacterInfo()
    ├─ renderStats()
    ├─ renderRelationships()
    ├─ renderTimeline()
    ├─ renderEvent()
    └─ renderActivityLog()
```

**Key Methods**:
- `init()`: Setup and attach listeners
- `render()`: Full UI update
- `handleChoice()`: Process button click
- `handleNextDay()`: Advance time
- `showSettings()`: Display modal
- `showGameOver()`: End screen

**UI Patterns**:
- **Loading States**: Show spinner during async ops
- **Optimistic Updates**: Instant feedback
- **Error Handling**: User-friendly messages
- **State Sync**: Always reflects current state

### 7. Configuration (js/config.js)

**Purpose**: Centralized configuration

**Contains**:
- Initial stat values
- Game constants (days, weeks, etc.)
- Event category weights
- AI settings
- Storage keys

**Benefits**:
- Single source for tweaking
- Easy balancing
- Clear documentation
- Type safety (via comments)

## Data Flow

### Player Makes Choice
```
User clicks choice button
    ↓
UI captures event → handleChoice()
    ↓
GameEngine processes → handleChoice()
    ↓
StateManager updates stats → updateStats()
    ↓
StateManager notifies observers
    ↓
UI re-renders → render()
```

### Next Day Progression
```
User clicks Next Day
    ↓
UI → handleNextDay()
    ↓
GameEngine → nextDay()
    ↓
StateManager → advanceDay()
    ↓
Daily stat recovery applied
    ↓
New event generated
    ↓
Game over check
    ↓
Save game state
    ↓
UI re-renders
```

### AI Event Generation
```
GameEngine → generateNewEvent()
    ↓
Check AI enabled
    ↓
GeminiAPI → generateEvent()
    ↓
Build context from state
    ↓
Create detailed prompt
    ↓
Fetch from Gemini API
    ↓
Parse JSON response
    ↓
Validate structure
    ↓
Return event to GameEngine
    ↓
Update state with new event
    ↓
UI renders event
```

## Design Patterns Used

### Observer Pattern
- StateManager notifies UIController of changes
- Decouples state from presentation
- Allows multiple observers

### Strategy Pattern
- Event selection algorithm
- AI vs preset content strategy
- Interchangeable implementations

### Facade Pattern
- GameEngine hides system complexity
- UIController simplifies UI operations
- Clean public interfaces

### Factory Pattern
- Event generation
- State initialization
- Object creation centralized

### Singleton Pattern
- StateManager (single source of truth)
- Configuration (global constants)

## Key Algorithms

### Stat Bounds Checking
```javascript
newValue = currentValue + change
clampedValue = Math.max(0, Math.min(100, newValue))
```

### Weighted Random Selection
```javascript
1. Calculate total weight of categories
2. Generate random number [0, totalWeight)
3. Iterate categories, subtracting weight
4. When random <= 0, select that category
```

### Season Calculation
```javascript
seasonIndex = floor((month - 1) / 3) % 4
season = seasons[seasonIndex]
// 1-3 = Fall, 4-6 = Winter, 7-9 = Spring, 10-12 = Summer
```

### Time Progression
```javascript
day++
if (day > 7) { day = 1; week++ }
if (week > 4) { week = 1; month++ }
if (month > 12) { month = 1; year++; age++; grade++ }
```

## State Management

### Why Observer Pattern?
- Unidirectional data flow
- Predictable state updates
- Easy to debug
- Scalable architecture

### State Updates
```javascript
// ❌ Don't mutate directly
this.state.character.stats.happiness += 10;

// ✅ Use setState
this.setState({
    character: {
        ...this.state.character,
        stats: {
            ...this.state.character.stats,
            happiness: newValue
        }
    }
});
```

### Persistence Strategy
- LocalStorage for browser persistence
- JSON serialization
- Automatic save after each day
- Manual save/load options

## Extension Points

### Adding New Systems
1. Create new class in `js/`
2. Initialize in `game.js`
3. Pass StateManager reference
4. Subscribe to state changes if needed
5. Add public methods to GameEngine if needed

### Custom Event Sources
```javascript
class CustomEventSystem {
    async getEvent(context) {
        // Your logic here
        return event;
    }
}

// In GameEngine
if (useCustomEvents) {
    event = await customEventSystem.getEvent(context);
}
```

### Additional AI Providers
```javascript
class OpenAIProvider {
    async generateEvent(context) {
        // OpenAI implementation
    }
}

// Strategy pattern allows swapping
gameEngine.setAIProvider(new OpenAIProvider());
```

## Performance Considerations

### Optimization Strategies
- Event delegation for choice buttons
- Minimal DOM manipulation
- Efficient re-renders (only changed elements)
- LocalStorage throttling
- Lazy loading for large datasets

### Memory Management
- History limited to 50 events
- Relationship list pruned if needed
- No memory leaks (proper cleanup)

### Browser Compatibility
- Modern ES6+ features
- No transpilation needed
- LocalStorage fallback handling
- Fetch API for network requests

## Security Considerations

### API Key Storage
- LocalStorage (client-side only)
- Never sent to any server except Gemini
- User has full control

### Data Privacy
- No external analytics
- No user tracking
- No data collection
- Fully client-side

### Content Safety
- PG-13 guidelines in prompts
- AI response validation
- Fallback to safe presets
- User control over AI usage

## Testing Strategies

### Manual Testing
1. New game flow
2. Choice selection
3. Stat boundary conditions
4. Time progression
5. Save/load functionality
6. AI event generation
7. Game over conditions

### Browser Console Testing
```javascript
// Access game systems
window.game.stateManager.getState()
window.game.character.getStats()
window.game.eventSystem.getRandomEvent()

// Force stat changes
window.game.stateManager.updateStats({happiness: -100})

// Skip time
for(let i=0; i<10; i++) window.game.stateManager.advanceDay()
```

### Validation Checklist
- [ ] All stats clamp to 0-100
- [ ] Time progression correct
- [ ] Events have valid structure
- [ ] Choices apply effects correctly
- [ ] Relationships track properly
- [ ] Save/load preserves state
- [ ] Game over triggers correctly
- [ ] UI reflects state accurately

## Common Issues & Solutions

### Issue: Stats not updating
**Solution**: Check StateManager observer is attached

### Issue: Events repeat too often
**Solution**: Increase event database size

### Issue: AI events fail
**Solution**: Verify API key, check network, validate response

### Issue: Save not persisting
**Solution**: Check browser localStorage permissions

### Issue: UI not updating
**Solution**: Ensure render() called after state changes

## Future Enhancements

### Scalability Improvements
- Event database split into files
- Lazy load event categories
- IndexedDB for large saves
- Service worker for offline play

### Architecture Enhancements
- TypeScript for type safety
- Reactive framework (Vue/React)
- State management library (Redux)
- Testing framework (Jest)

### Feature Additions
- Achievement system
- Multiplayer leaderboards
- Character customization
- Branching storylines
- Mini-games integration

## Conclusion

This architecture prioritizes:
1. **Modularity**: Each system is independent
2. **Extensibility**: Easy to add features
3. **Maintainability**: Clear structure and patterns
4. **Performance**: Efficient and responsive
5. **Simplicity**: No unnecessary complexity

The design allows deep customization while maintaining a clean, understandable codebase suitable for learning and extension.
