# Teen Life Simulator

A complete teenage life simulation video game built with HTML, CSS, and Vanilla JavaScript.

## 🎮 About

Experience the challenges and joys of teenage life! Manage your health, happiness, grades, and relationships while navigating through school, family, and social situations. Make choices that shape your character's journey through adolescence.

## ✨ Features

- **Complete Character System**: Manage 5 core attributes (Health, Happiness, Energy, Grades, Money)
- **Dynamic Relationships**: Build relationships with family, friends, crush, and rivals
- **Rich Inventory System**: Collect and use items that affect your character
- **15+ Activities**: Study, exercise, work, socialize, and more
- **8 Random Events**: Face unexpected situations with meaningful choices
- **Time Management**: Progress through days with morning, afternoon, evening, and night periods
- **Auto-Save**: Your progress is automatically saved
- **Extensible Architecture**: Easy to add new content and features

## 🚀 How to Play

### Quick Start

1. **Download or Clone** this repository
2. **Open** `index.html` in your web browser
3. **Enter your name** and start playing!

No installation or build process required - just open and play!

### Alternative: Local Server

For the best experience, you can run a local server:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Python 2
python -m SimpleHTTPServer 8080

# Using Node.js (if you have http-server installed)
npx http-server -p 8080
```

Then open `http://localhost:8080` in your browser.

## 🎯 Gameplay

1. **Start**: Create your character
2. **Choose Activities**: Select from various daily activities
3. **Manage Stats**: Keep your attributes balanced
4. **Build Relationships**: Interact with different characters
5. **Face Events**: Make choices in random events
6. **Progress**: Advance through days and watch your story unfold

## 📁 Project Structure

```
GeminiTeenLifeSim/
├── index.html              # Main game interface
├── styles.css              # Complete styling
├── js/
│   ├── state.js           # State management & save system
│   ├── character.js       # Character attributes system
│   ├── relationships.js   # Relationships system
│   ├── inventory.js       # Inventory & items system
│   ├── events.js          # Random events system
│   ├── activities.js      # Daily activities system
│   ├── ui.js              # UI management
│   └── game.js            # Game loop & initialization
├── README.md              # This file
└── GAME_FEATURES.md       # Detailed feature documentation
```

## 🛠️ Technical Details

- **Pure Vanilla JavaScript**: No frameworks or libraries required
- **Modular Architecture**: Clean separation of concerns
- **Observer Pattern**: Reactive UI updates
- **LocalStorage**: Automatic game saving
- **Responsive Design**: Works on desktop and mobile

## 📖 For Developers

### Adding New Content

The game is designed for easy content expansion:

**Add a New Activity:**
```javascript
// In js/activities.js
{
    id: 'your_activity',
    name: 'Activity Name',
    description: 'Description',
    requirements: { energy: 10 },
    effects: { happiness: 5, energy: -10 },
    timeAdvance: true
}
```

**Add a New Event:**
```javascript
// In js/events.js
{
    id: 'your_event',
    title: 'Event Title',
    description: 'Event description',
    choices: [
        {
            text: 'Choice text',
            effects: { happiness: 10 }
        }
    ]
}
```

**Add a New Item:**
```javascript
// In js/inventory.js
'item_id': {
    name: 'Item Name',
    description: 'Item description',
    effects: { health: 5 },
    value: 10
}
```

See `GAME_FEATURES.md` for complete documentation.

## 🎨 Customization

- Modify `styles.css` to change the visual theme
- Edit stat values in `js/state.js` for difficulty tuning
- Adjust time system in state management
- Add new relationship types in `js/relationships.js`

## 🐛 Debug Mode

To enable debug mode, open the browser console and set:
```javascript
GameConfig.debug = true;
```

Then reload the page. Debug helpers will be available via `window.GameDebug`.

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

This is a beta build. Suggestions and improvements are welcome!

## 🎓 Educational Value

This project demonstrates:
- Game state management
- Event-driven programming
- Observer pattern implementation
- Modular JavaScript architecture
- Browser storage APIs
- Responsive web design

Perfect for learning game development fundamentals!

---

**Version**: 1.0.0-beta  
**Built with**: HTML, CSS, Vanilla JavaScript  
**No dependencies**: Just open and play!