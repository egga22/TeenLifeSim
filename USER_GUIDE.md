# Teen Life Simulator - User Guide

## Getting Started

### Opening the Game
1. Open `index.html` in any modern web browser
2. You'll see the welcome screen

### Creating Your Character
1. Enter your character's name in the text field
2. Click "Start Game"
3. Your adventure begins!

## Understanding the Interface

### Main Areas

#### Stats Panel (Left Side)
Shows your character's current status:

- **Health** (Red bar): Physical well-being (0-100)
  - Falls below 20: You need medical attention!
  - Keep it high by exercising and eating healthy

- **Happiness** (Yellow bar): Emotional state (0-100)
  - Falls below 30: You're getting depressed
  - Boost it by having fun and socializing

- **Energy** (Green bar): Physical energy (0-100)
  - Falls below 20: You're exhausted
  - Restore by sleeping or resting

- **Grades** (Purple bar): Academic performance (0-100)
  - Below 60: You're failing
  - Improve by studying and attending class

- **Money**: Your available cash
  - Earn by working part-time
  - Spend on items and activities

#### Relationships Section
Shows your relationships with key people:
- **Mom & Dad**: Family relationships
- **Best Friend**: Close friendship
- **Crush**: Romantic interest
- **Rival**: Competitive relationship

Each relationship has a level (0-100) and status.

#### Inventory Section
Shows items you own:
- Click on any item to use it
- Items have various effects on your stats
- Buy more items at the shop

#### Game Area (Center)
This is where you interact with the game:
- Choose activities
- Make event choices
- View messages and results

#### Activity Log (Bottom)
Shows your recent actions with timestamps.

## Playing the Game

### Time System
The game progresses through time:
- **4 Periods per Day**: Morning, Afternoon, Evening, Night
- Most activities advance time by one period
- A new day starts after night
- Stats naturally decay over time

### Activities
Choose from 15+ different activities:

**Academic:**
- Study: Improve grades (costs energy)
- School Club: Balance grades and fun

**Social:**
- Hang Out with Friends: Build friendships and happiness
- Go on a Date: Improve romantic relationship (costs money)
- Talk to Parents: Strengthen family bonds

**Physical:**
- Exercise: Improve health (costs energy)
- Take a Nap: Restore energy

**Entertainment:**
- Play Video Games: Boost happiness
- Practice Hobby: Develop interests
- Browse Social Media: Quick happiness boost

**Work:**
- Part-Time Job: Earn money (costs energy)
- Volunteer Work: Boost happiness and family relationships

**Survival:**
- Eat Healthy Meal: Improve health (costs money)
- Eat Junk Food: Quick happiness (hurts health)

**Shopping:**
- Go Shopping: Access the item shop

### Random Events
After completing activities, you might encounter random events (30% chance):

**Event Types:**
1. **Pop Quiz**: Academic challenges
2. **Birthday Party**: Social decisions
3. **Found Money**: Moral choices
4. **Sports Tryouts**: Physical challenges
5. **Crush Encounter**: Romantic moments
6. **Rival Challenge**: Competitive situations
7. **Parent Check-in**: Family conversations
8. **Weekend Plans**: Life balance decisions

Each event offers multiple choices with different outcomes.

### Making Choices
When events occur:
1. Read the situation carefully
2. Consider each choice's hint
3. Think about your current stats and goals
4. Click your preferred choice
5. See the results

Choices affect:
- Your attributes
- Your relationships
- Your story progression

## Strategy Tips

### Stat Balance
- Don't let any stat get too low
- If health drops below 20, focus on recovery
- If energy is low, rest before other activities
- Balance fun activities with studying

### Money Management
- Work part-time when money is low
- Buy items strategically
- Save money for dates and emergencies
- Some items are worth the investment

### Relationship Building
- Regular interaction improves relationships
- High relationships unlock better event outcomes
- Don't neglect family relationships
- Balance time between different people

### Time Management
- Plan your day wisely
- Some activities don't advance time
- Use time-free activities strategically
- Remember: stats decay overnight

### Long-term Success
- Maintain grades above 70
- Keep happiness above 50
- Always have some emergency money
- Build strong relationships early

## Items Guide

### Available Items

**Snack** ($5)
- Health +5, Happiness +3
- Cheap emergency health boost

**Energy Drink** ($10)
- Energy +20, Health -5
- Quick energy, but hurts health

**Textbook** ($30)
- Grades +10
- One-time study boost

**Video Game** ($40)
- Happiness +15, Energy -10
- Entertainment with slight cost

**Smartphone** ($200)
- Happiness +10
- Expensive but useful

**Skateboard** ($80)
- Happiness +10, Health +5
- Good dual benefit

**Guitar** ($150)
- Happiness +15
- Great for happiness

## Save System

### Automatic Saving
- Game saves every 60 seconds
- Saves when you close the browser
- No manual save needed

### Loading
- Game automatically loads on start
- Continue where you left off
- Multiple browser tabs = separate saves

### Clearing Save
- Open browser console (F12)
- Type: `localStorage.removeItem('teenLifeSimSave')`
- Reload page for fresh start

## Troubleshooting

### Game Not Loading?
- Check browser console for errors (F12)
- Make sure JavaScript is enabled
- Try a different browser
- Clear browser cache

### Stats Not Updating?
- Refresh the page
- Check browser console
- Ensure all JS files loaded

### Can't Click Activities?
- Check if you meet requirements
- Restore energy if needed
- Earn money if needed
- Requirements shown on each card

## Advanced Features

### Debug Mode
For testing or cheating:
1. Open browser console (F12)
2. Type: `GameConfig.debug = true`
3. Reload page
4. Access via `window.GameDebug`

Debug commands:
```javascript
GameDebug.addMoney(100)      // Add money
GameDebug.maxStats()          // Max all stats
GameDebug.triggerEvent('id')  // Trigger specific event
GameDebug.listEvents()        // See all events
GameDebug.clearSave()         // Clear save
```

## Tips for Maximum Enjoyment

1. **Role-play**: Make choices based on your character
2. **Experiment**: Try different strategies
3. **Read carefully**: Event descriptions contain clues
4. **Balance**: Don't min-max, enjoy the journey
5. **Story**: Pay attention to the narrative
6. **Relationships**: They matter more than you think

## Goals to Try

- Maintain all stats above 80 for 7 days
- Max out a relationship to 100
- Earn $500
- Get straight A's (95+ grades)
- Survive 30 days
- Make your parents proud (both 90+ relationship)
- Win over your crush (80+ relationship)
- Convert your rival to a friend (60+ relationship)

## Have Fun!

Remember: This is a simulation of teenage life with all its challenges and joys. There's no single "right" way to play. Make choices that feel authentic to you, learn from consequences, and enjoy the journey!

---

Need help? Check `GAME_FEATURES.md` for technical details.
