# Teen Life Simulator - Feature Overview

## 🎮 Gameplay Features

### Character Management
- **Age Progression**: Start at 15, play until 18
- **6 Core Stats**: Health, Happiness, Intelligence, Popularity, Fitness, Money
- **Actions System**: 3 actions per day if attending school, 8 if skipping or weekend
- **Character Customization**: Name and gender selection

### Time System
- **4 Time Periods**: Morning, Afternoon, Evening, Night
- **Calendar System**: Full year with months and days
- **Day/Night Cycle**: Different activities available at different times
- **Weekday/Weekend**: School schedule and special weekend activities
- **Birthday Events**: Celebrate birthdays and age progression

### Activity System (20+ Activities)

#### Academic Activities
- Study Math, Science, English
- Improves intelligence and grades
- Each activity costs 1 action

#### Social Activities
- Hang out with friends
- Attend parties (weekend only)
- Browse social media
- Build relationships

#### Physical Activities
- Exercise routines
- Sports practice
- Improve fitness and health

#### Work & Money
- Part-time job (unlocks at age 15)
- Earn money for special purchases
- Balances time vs. money

#### Leisure & Entertainment
- Play video games
- Watch TV
- Read books
- Practice music
- Create art

#### Self-Care
- Rest to recover health
- Sleep to advance day (free, costs 0 actions)
- Health management

### Education System

#### Subject Tracking
- **6 Subjects**: Math, Science, English, History, Art, Physical Education
- **Grade Tracking**: Individual grades per subject (0-100%)
- **GPA Calculation**: Overall grade average with letter grades
- **Attendance**: Track school attendance

#### Academic Activities
- **Studying**: Improve grades through study sessions
- **Exams**: Random exam events with performance based on preparation
- **Assignments**: Complete homework with different effort levels
- **Class Attendance**: Automatic grade improvement from attending school

### Relationship System

#### Relationship Types
- **Family**: Mom, Dad, Sibling (start at different values)
- **Friends**: Best friend and classmates
- **Acquaintances**: Can evolve into friends
- **Dynamic Status**: Relationships change based on interactions

#### Relationship Features
- **Value Range**: 0-100 relationship score
- **Status Levels**: Strangers, Distant, Acquaintances, Friends, Good Friends, Best Friends
- **Interaction Tracking**: Count of interactions with each person
- **Random Events**: Relationship-specific events and choices

### Event System

#### Event Categories
1. **Random Events** (8+ unique events)
   - Found money
   - Weather changes
   - Mood swings
   - New game releases
   - Concert opportunities
   - Daily surprises

2. **School Events** (3+ unique events)
   - Pop quizzes
   - Group projects
   - Club fair
   - Academic challenges

3. **Relationship Events** (Dynamic)
   - Friend invitations
   - Family dinners
   - Conflicts and resolutions
   - Helping with homework

4. **Health Events**
   - Getting sick
   - Stress management
   - Energy exhaustion
   - Mental health

5. **Special Events**
   - Birthday celebrations
   - Seasonal events
   - Achievement milestones

#### Event Features
- **Multiple Choice**: Most events have 2-4 choices
- **Consequences**: Each choice affects stats and relationships
- **Requirements**: Some choices require minimum stats or money
- **Probability System**: Events trigger based on various conditions
- **Context-Aware**: Events change based on current game state

### Save/Load System
- **Auto-Save**: Save anytime during gameplay
- **Persistent Data**: Uses browser localStorage
- **Save Info**: Display player name, age, and play time
- **Multiple Saves**: Can start new game or continue existing

## 🎨 User Interface

### Start Screen
- Name input
- Gender selection
- New game / Load game options

### Main Game Screen

#### Header Section
- Player name and age display
- Current date and day of week
- Time period indicator

#### Stats Panel
- Visual stat bars with colors
- Numeric values for all stats
- Money display
- Grade average with letter grade

#### Three-Column Layout

1. **Activities Panel**
   - List of available activities
   - Energy cost display
   - Effect preview
   - Click to perform
   - Disabled state for insufficient energy

2. **Events Panel**
   - Event log (last 10 events)
   - Current choices
   - Color-coded by importance
   - Auto-scroll to latest

3. **Info Panel** (Tabbed)
   - **Relationships Tab**: All relationships with progress bars
   - **Education Tab**: Subject grades and study time
   - **Inventory Tab**: Items and quantities

#### Control Panel
- Save Game button
- Advance Time button
- Menu button

### Modal Windows
- Event display with choices
- Important notifications
- Confirmation dialogs

## 🎯 Game Mechanics

### Stat Balancing
- **Actions Management**: Activities cost actions, which reset daily (3 or 8 depending on school choice)
- **School Decision**: Choose daily to attend school (3 actions, safer) or skip (8 actions, risky)
- **Happiness Decay**: Must maintain through positive activities
- **Stat Caps**: Most stats capped at 0-100 (money unlimited)

### Time Management
- **Period-Based**: Each action happens in a time period
- **Advance Time**: Manually progress through day
- **Automatic Effects**: Stats change naturally over time
- **School Days**: Automatic attendance on weekdays

### Risk vs. Reward
- **School vs. Skip**: Attend school for safety (3 actions) or skip for more actions (8) with risks
- **Skip Consequences**: 50% safe, 25% Saturday detention, 25% grounded for a week
- **Study vs. Fun**: Balance grades with happiness
- **Work vs. Play**: Money vs. popularity
- **Event Choices**: Multiple paths with different outcomes

### Progression Systems
- **Age Progression**: Automatic birthday system
- **Grade Improvement**: Study to raise grades
- **Relationship Building**: Interact to strengthen bonds
- **Money Accumulation**: Work to afford special events
- **Stat Development**: Build specialized character

## 🔧 Customization Potential

### Easy to Modify
- **JSON-like Structure**: Activity and event definitions
- **Modular Systems**: Independent game systems
- **Clear Comments**: Well-documented code
- **No Dependencies**: Pure vanilla JavaScript

### Expansion Points
- Add new activities in `activities.js`
- Create new events in `events.js`
- Add relationships in `relationships.js`
- Extend education system in `education.js`
- Customize UI in `styles.css` and `ui.js`

## 📊 Statistics

- **Lines of Code**: 2,600+
- **Activities**: 20+
- **Events**: 15+ (expandable to infinite)
- **Stats Tracked**: 7 primary stats
- **Relationships**: 6+ characters
- **Subjects**: 6 academic subjects
- **Time Periods**: 4 per day
- **Age Range**: 15-18 years (4 years of gameplay)

## 🎓 Educational Value

### Life Skills
- Time management
- Balancing responsibilities
- Social relationship management
- Academic performance
- Financial planning
- Health and wellness

### Decision Making
- Consequence awareness
- Risk assessment
- Priority setting
- Long-term planning
- Trade-off evaluation

## 🚀 Performance

- **Lightweight**: No external libraries
- **Fast Loading**: All assets local
- **Smooth UI**: CSS transitions and animations
- **Efficient**: Minimal DOM manipulation
- **Responsive**: Works on desktop and mobile browsers

## 🎮 Replayability

- Different play styles (academic, social, balanced)
- Multiple relationship paths
- Random event variations
- Age-based content unlocks
- Stat-based event triggers
- Personal goal setting

---

**This is a complete, playable beta build with deep customizable systems!**
