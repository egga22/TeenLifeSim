# Quick Start Guide

Get up and running with Teen Life Simulator in 5 minutes!

## 🎯 What You Need

- A modern web browser (Chrome, Firefox, Safari, Edge)
- (Optional) A Google Gemini API key for AI features

## 🚀 Installation

### Option 1: Download and Play
1. Download the repository as a ZIP file
2. Extract it to your computer
3. Double-click `index.html` to open in your browser
4. Start playing!

### Option 2: Clone with Git
```bash
git clone https://github.com/egga22/GeminiTeenLifeSim.git
cd GeminiTeenLifeSim
# Open index.html in your browser
```

### Option 3: Local Server (Recommended)
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# Node.js (if you have http-server installed)
npx http-server -p 8080

# Then visit: http://localhost:8080
```

## 🎮 First Playthrough

### 1. Starting the Game
- Open `index.html` in your browser
- You'll see your character: Alex, age 13, 8th grade
- Your starting stats are balanced

### 2. Understanding Stats
- **Happiness** 😊: Your mood and mental well-being
- **Health** 💪: Your physical condition
- **Intelligence** 🧠: Your knowledge and academic performance
- **Social** 👥: Your relationships and popularity
- **Energy** ⚡: Your available energy for activities

### 3. Making Your First Choice
1. Read the event description
2. Review the 2-3 available choices
3. Click the choice that appeals to you
4. See the immediate result
5. Click "Next Day" to continue

### 4. Managing Your Character
- **Watch your stats**: Don't let any reach 0!
- **Balance activities**: Mix study, social, and rest
- **Build relationships**: They provide support
- **Read the history**: Learn from past choices

### 5. Time Progression
- Click "Next Day" to advance time
- Stats recover slightly each day
- Weekdays have school events
- Weekends are more relaxed
- Seasons change every 3 months

## ⚙️ Optional: AI Setup

Want dynamic, unique events? Enable AI!

### Getting an API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (keep it secret!)

### Enabling AI in Game
1. Click the settings icon (⚙️) in the top right
2. Paste your API key in the "Gemini API Key" field
3. Check "Use AI-Generated Events"
4. Click "Save Settings"

**Note**: Your API key is stored locally in your browser only.

### AI vs Preset Events
- **Without AI**: 50+ hand-crafted events (always available)
- **With AI**: Unlimited unique events based on your situation
- **Fallback**: If AI fails, uses preset events automatically

## 💾 Saving Your Game

### Auto-Save
- Game saves automatically after each day
- Saves to your browser's local storage
- Persists between sessions

### Manual Save
- Click the save icon (💾) anytime
- Confirms with "Game saved successfully!"

### Loading
- Click the load icon (📂)
- Confirms before overwriting current game
- Restores your previous session

## 📊 Game Over Conditions

Your game ends if:
- **Happiness reaches 0**: Too depressed to continue
- **Health reaches 0**: Physical breakdown

When game ends:
- View your final statistics
- See how many days you survived
- Start a new game to try again

## 💡 Tips for Success

### Stat Management
- **Happiness**: Do fun activities, socialize, avoid stress
- **Health**: Rest, exercise, don't overwork
- **Intelligence**: Study consistently, but don't burn out
- **Social**: Make friends, attend events, help others
- **Energy**: Rest on weekends, don't overcommit

### Strategy Tips
1. **Don't min-max**: Balance is key
2. **Build relationships early**: They help later
3. **Weekend recovery**: Use them to recharge
4. **Read carefully**: Choices have trade-offs
5. **Long-term thinking**: Some choices pay off later

### Common Mistakes
❌ Focusing on only one stat
❌ Ignoring energy levels
❌ Avoiding all social activities
❌ Never resting
❌ Rushing through events

### Winning Approach
✅ Balance all five stats
✅ Build diverse relationships
✅ Rest when energy is low
✅ Make consistent choices
✅ Read event descriptions carefully

## 🎯 Sample Play Session

### Day 1
- Event: "Pop Quiz Alert!"
- You choose: "Study hard and focus"
- Result: +5 intelligence, -10 energy, -5 happiness
- Learn: Academic success has costs

### Day 2
- Event: "Party Invitation"
- You choose: "Go but leave early"
- Result: +5 happiness, +5 social, -5 energy
- Learn: Balance fun and responsibility

### Day 3
- Energy is low from two active days
- Event: "Feeling Overwhelmed"
- You choose: "Take a mental health day"
- Result: +15 happiness, +20 energy, +10 health
- Learn: Rest is important!

### Day 4
- Fully recharged, stats balanced
- Ready for more challenges!

## 🔧 Troubleshooting

### Game Won't Load
- Check browser console (F12) for errors
- Try a different browser
- Clear browser cache
- Re-download files

### AI Not Working
- Verify API key is correct
- Check internet connection
- Look for error in console
- Disable AI and use presets

### Can't Save Game
- Check browser allows localStorage
- Try private/incognito mode (won't save)
- Clear some browser storage
- Use different browser

### Stats Look Wrong
- Stats are clamped to 0-100
- Multiple effects can stack
- Check recent history for changes
- This is probably correct!

### Events Seem Repetitive
- 50+ events in database
- Some are more common
- Enable AI for variety
- More events can be added (see CUSTOMIZATION.md)

## 🎨 Customization Preview

Want to customize? It's easy!

### Change Your Name
- Settings → Character Name → Save

### Adjust Starting Stats
- Edit `js/config.js`
- Change `initialStats` values

### Add New Events
- Edit `js/events.js`
- Copy existing event structure
- Add your own scenario

### Modify Colors
- Edit `styles.css`
- Change CSS variables
- Instantly see changes

See `CUSTOMIZATION.md` for detailed guides!

## 📚 Learning Resources

- `README.md`: Full documentation
- `ARCHITECTURE.md`: How it works
- `CUSTOMIZATION.md`: Make it yours
- Browser console: Debugging tool

## 🎮 Gameplay Modes

### Casual Play
- Take your time
- Explore all choices
- No pressure
- Save often

### Challenge Mode
- Try to reach day 100
- Max out all stats
- Form 10+ relationships
- Never let stats drop below 50

### Roleplay Mode
- Create a character backstory
- Make choices "in character"
- Track your story
- Write your journey

## 🌟 Your First Goals

Try to accomplish:
- [ ] Survive 30 days
- [ ] Keep all stats above 50
- [ ] Form 3 relationships
- [ ] Try every event category
- [ ] Save and load successfully
- [ ] (Optional) Generate an AI event

## ⏭️ Next Steps

### After Your First Game
1. Read `CUSTOMIZATION.md` to add events
2. Try different character approaches
3. Enable AI for new experiences
4. Share feedback and ideas
5. Customize to your liking

### Community
- Fork the repo and share
- Add your own events
- Create custom themes
- Share strategies

## 🆘 Need Help?

1. Check browser console (F12)
2. Review this guide
3. Read full README.md
4. Check ARCHITECTURE.md
5. Try different browser
6. Restart fresh game

## 🎉 Have Fun!

Remember:
- It's a game - experiment!
- No wrong choices - just consequences
- Every playthrough is unique
- Customize to your heart's content
- Learn, grow, and enjoy!

**Ready to start your teenage journey? Open `index.html` and begin!** 🚀

---

Made with ❤️ using HTML, CSS, JavaScript, and Gemini AI
