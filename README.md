# Teen Life Simulator

A teenage life simulation game built with HTML, CSS, and vanilla JavaScript, featuring AI-powered event generation using Google's Gemini API.

## 🎮 Features

### Core Gameplay
- **Character System**: Manage 5 key stats (Happiness, Health, Intelligence, Social, Energy)
- **Time Progression**: Progress through days, weeks, months, and years
- **Dynamic Events**: Experience school, social, family, personal, and random events
- **Relationships**: Build and maintain relationships with friends, family, and romantic interests
- **Decision Making**: Every choice affects your character's stats and relationships
- **Save/Load System**: Save your progress and continue later

### AI Integration (Optional)
- **Gemini API**: Use Google's Gemini 1.5 Pro for dynamic, context-aware event generation
- **Adaptive Storytelling**: Events adapt to your character's current situation
- **Unique Experiences**: Every playthrough can be different with AI-generated content

### Technical Features
- **Modular Architecture**: Separate systems for state management, events, character, and UI
- **Customizable**: Deep configuration system for easy modifications
- **Local Storage**: Game state persists in browser
- **Responsive Design**: Works on desktop and mobile devices
- **No Build Step**: Pure vanilla JavaScript - just open and play

## 🚀 Getting Started

### Quick Start
1. Clone the repository
2. Open `index.html` in a web browser
3. Start playing!

### With AI Features (Optional)
1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click the settings icon (⚙️) in the game
3. Enter your API key
4. Enable "Use AI-Generated Events"
5. Save settings

**Note**: Your API key is stored locally in your browser and is never sent anywhere except to Google's Gemini API.

## 🎯 How to Play

### Starting Out
- You begin as a 13-year-old in 8th grade
- All stats start at moderate levels
- Make choices to influence your character's development

### Stats Explained
- **Happiness**: Mental well-being and mood
- **Health**: Physical condition
- **Intelligence**: Academic performance and knowledge
- **Social**: Relationship skills and popularity
- **Energy**: Available energy for activities

### Making Choices
- Each event presents 2-3 choices
- Choices affect your stats in different ways
- Consider the trade-offs between options
- Some choices create or strengthen relationships

### Time Progression
- Click "Next Day" to advance time
- Different events occur on weekdays vs weekends
- Stats recover slightly each day
- Characters age and progress through grades

### Game Over
- Game ends if Happiness or Health reaches 0
- View your final statistics
- Start a new game to try different choices

## 📁 Project Structure

```
├── index.html              # Main HTML file
├── styles.css              # All styling
├── js/
│   ├── config.js          # Game configuration and constants
│   ├── stateManager.js    # State management system
│   ├── character.js       # Character system
│   ├── events.js          # Event database and selection
│   ├── geminiAPI.js       # Gemini API integration
│   ├── gameEngine.js      # Core game loop and logic
│   ├── ui.js              # UI controller
│   └── game.js            # Main initialization
└── README.md              # This file
```

## 🔧 Customization

### Adding New Events
Edit `js/events.js` and add events to the appropriate category:

```javascript
{
    id: 'unique_event_id',
    title: 'Event Title',
    description: 'Event description',
    emoji: '🎯',
    choices: [
        {
            text: 'Choice text',
            effects: { happiness: 5, energy: -10 },
            resultText: 'What happens',
            relationship: { name: 'Person', change: 10 }
        }
    ]
}
```

### Modifying Stats
Edit `js/config.js` to change:
- Initial stat values
- Stat limits
- Starting age and grade
- Time progression rates
- AI configuration

### Styling
Edit `styles.css` to customize:
- Colors (CSS variables at the top)
- Layout and spacing
- Animations and transitions
- Responsive breakpoints

## 🏗️ Architecture

### State Management
- Centralized state with observer pattern
- All game data in single state object
- State changes trigger UI updates
- Persistent state via localStorage

### Event System
- Category-based event selection
- Weighted random selection
- Context-aware event filtering
- Extensible event database

### AI Integration
- Optional Gemini API integration
- Fallback to pre-defined events
- Context-aware prompt building
- Response parsing and validation

### UI Controller
- Reactive UI updates
- Modal management
- Event handling
- Animation and feedback

## 🛠️ Development

### Adding New Systems
1. Create new class in `js/` directory
2. Initialize in `game.js`
3. Integrate with state manager
4. Update UI as needed

### Testing
- Open browser console for debug logs
- Access `window.game` for direct system access
- Test individual systems independently

### Best Practices
- Keep systems modular and independent
- Use state manager for all data changes
- Document configuration options
- Test with and without AI enabled

## 📝 API Usage

### Gemini API
- Model: gemini-1.5-pro
- Temperature: 0.9 (configurable)
- Max tokens: 500 (configurable)
- Purpose: Event generation

### Rate Limits
- Free tier: 60 requests per minute
- Game generates 1-2 requests per day
- Fallback to local events if API fails

## 🔒 Privacy & Security

- No user data collected
- API key stored locally only
- No external tracking
- All data stays in browser
- Open source and transparent

## 🤝 Contributing

This is a beta build designed for deep customization. Feel free to:
- Add new event categories
- Create new game systems
- Improve AI prompts
- Enhance UI/UX
- Report issues

## 📄 License

MIT License - Feel free to use and modify!

## 🎓 Educational Use

This project demonstrates:
- Modern vanilla JavaScript patterns
- State management without frameworks
- API integration
- Browser storage
- Responsive CSS design
- Modular architecture

## 🔮 Future Enhancements

Potential additions:
- Achievement system
- Multiple save slots
- Character customization
- Mini-games
- Export/import saves
- Multiplayer comparisons
- More relationship types
- Career paths
- College system

## 💡 Tips for Players

- Balance all stats - don't focus on just one
- Build relationships early
- Rest on weekends to recover energy
- Academic success requires consistent effort
- Social activities boost happiness
- Listen to your character's needs

## 🐛 Troubleshooting

**Events not generating?**
- Check browser console for errors
- Verify API key if using AI mode
- Try disabling AI mode

**Game not saving?**
- Ensure browser allows localStorage
- Check available storage space
- Try different browser

**Stats seem wrong?**
- Stats are clamped between 0-100
- Multiple effects can compound
- Check recent history for changes

## 📧 Support

For issues or questions:
- Check console for error messages
- Review configuration in `config.js`
- Test with default settings
- Disable AI mode if having issues

---

**Version**: 0.1.0 Beta
**Built with**: HTML5, CSS3, Vanilla JavaScript, Gemini API
**Status**: Playable Beta Build