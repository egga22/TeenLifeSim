// Chores Minigame System
// These minigames are intentionally tedious and unfun to discourage excessive chore usage
// Earning chores: Mow lawn, Wash dishes - pays $10
// Punishment chores: Pick weeds, Wash windows - no pay, twice as tedious

const Chores = {
    currentMinigame: null,
    callback: null,
    
    // Start a chore minigame
    startMinigame: function(choreType, onComplete) {
        this.callback = onComplete;
        
        if (choreType === 'earning') {
            // Randomly pick between mow lawn or wash dishes
            const games = ['mowLawn', 'washDishes'];
            const game = games[Math.floor(Math.random() * games.length)];
            this.currentMinigame = game;
            
            if (game === 'mowLawn') {
                this.showMowLawnGame();
            } else {
                this.showWashDishesGame();
            }
        } else {
            // Punishment chores - pick weeds or wash windows (twice as tedious)
            const games = ['pickWeeds', 'washWindows'];
            const game = games[Math.floor(Math.random() * games.length)];
            this.currentMinigame = game;
            
            if (game === 'pickWeeds') {
                this.showPickWeedsGame();
            } else {
                this.showWashWindowsGame();
            }
        }
    },
    
    // Create the minigame modal
    createMinigameModal: function(title, instructions, content) {
        // Remove any existing minigame modal
        const existing = document.getElementById('minigame-modal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.id = 'minigame-modal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content minigame-content">
                <h3>${title}</h3>
                <p class="minigame-instructions">${instructions}</p>
                <div id="minigame-area">${content}</div>
                <div id="minigame-progress"></div>
                <div id="minigame-buttons"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    },
    
    // Complete the minigame
    completeMinigame: function(success) {
        const modal = document.getElementById('minigame-modal');
        if (modal) modal.remove();
        
        if (this.callback) {
            this.callback(success);
        }
        
        this.currentMinigame = null;
        this.callback = null;
    },
    
    // ========== MOW LAWN MINIGAME ==========
    // Click each grass patch in sequence - tedious clicking
    showMowLawnGame: function() {
        const gridSize = 5; // 5x5 grid = 25 clicks required
        let mowed = 0;
        const total = gridSize * gridSize;
        
        let gridHTML = '<div class="lawn-grid">';
        for (let i = 0; i < total; i++) {
            gridHTML += `<div class="grass-patch" data-index="${i}">🌿</div>`;
        }
        gridHTML += '</div>';
        
        const modal = this.createMinigameModal(
            '🌿 Mow the Lawn',
            'Click each grass patch to mow it. You must mow all patches to complete the chore.',
            gridHTML
        );
        
        const progressDiv = document.getElementById('minigame-progress');
        progressDiv.innerHTML = `<p>Progress: <span id="mow-count">0</span>/${total} patches mowed</p>`;
        
        // Add click handlers to each grass patch
        const patches = modal.querySelectorAll('.grass-patch');
        patches.forEach((patch, index) => {
            patch.addEventListener('click', () => {
                if (!patch.classList.contains('mowed')) {
                    patch.classList.add('mowed');
                    patch.textContent = '🟫';
                    mowed++;
                    document.getElementById('mow-count').textContent = mowed;
                    
                    if (mowed >= total) {
                        setTimeout(() => {
                            this.completeMinigame(true);
                        }, 500);
                    }
                }
            });
        });
        
        // Add give up button
        const buttonsDiv = document.getElementById('minigame-buttons');
        buttonsDiv.innerHTML = '<button id="giveup-btn" class="choice-btn">Give Up</button>';
        document.getElementById('giveup-btn').addEventListener('click', () => {
            this.completeMinigame(false);
        });
    },
    
    // ========== WASH DISHES MINIGAME ==========
    // Click each dish multiple times to scrub it clean
    showWashDishesGame: function() {
        const dishCount = 8;
        const scrubsPerDish = 5;
        let dishesWashed = 0;
        let currentScrubs = 0;
        let currentDish = 0;
        
        const modal = this.createMinigameModal(
            '🍽️ Wash the Dishes',
            `Scrub each dish ${scrubsPerDish} times by clicking it. There are ${dishCount} dishes to wash.`,
            `<div class="dish-area">
                <div id="current-dish" class="dish dirty">🍽️</div>
                <p id="dish-status">Dish ${currentDish + 1}/${dishCount} - Click to scrub!</p>
                <div id="scrub-bar">
                    <div id="scrub-progress" style="width: 0%"></div>
                </div>
            </div>`
        );
        
        const progressDiv = document.getElementById('minigame-progress');
        progressDiv.innerHTML = `<p>Dishes washed: <span id="dish-count">0</span>/${dishCount}</p>`;
        
        const dishEl = document.getElementById('current-dish');
        const statusEl = document.getElementById('dish-status');
        const scrubBar = document.getElementById('scrub-progress');
        
        dishEl.addEventListener('click', () => {
            currentScrubs++;
            const percentage = (currentScrubs / scrubsPerDish) * 100;
            scrubBar.style.width = percentage + '%';
            
            // Visual feedback
            dishEl.classList.add('scrubbing');
            setTimeout(() => dishEl.classList.remove('scrubbing'), 100);
            
            if (currentScrubs >= scrubsPerDish) {
                dishesWashed++;
                document.getElementById('dish-count').textContent = dishesWashed;
                
                if (dishesWashed >= dishCount) {
                    setTimeout(() => {
                        this.completeMinigame(true);
                    }, 500);
                } else {
                    // Next dish
                    currentDish++;
                    currentScrubs = 0;
                    scrubBar.style.width = '0%';
                    statusEl.textContent = `Dish ${currentDish + 1}/${dishCount} - Click to scrub!`;
                }
            }
        });
        
        // Add give up button
        const buttonsDiv = document.getElementById('minigame-buttons');
        buttonsDiv.innerHTML = '<button id="giveup-btn" class="choice-btn">Give Up</button>';
        document.getElementById('giveup-btn').addEventListener('click', () => {
            this.completeMinigame(false);
        });
    },
    
    // ========== PICK WEEDS MINIGAME (PUNISHMENT - TWICE AS BAD) ==========
    // Click each weed in a larger grid
    showPickWeedsGame: function() {
        const gridSize = 7; // 7x7 grid = 49 clicks (almost twice as many as lawn)
        let picked = 0;
        const total = gridSize * gridSize;
        
        // Add random delays/misses to make it more tedious
        let gridHTML = '<div class="weed-grid">';
        for (let i = 0; i < total; i++) {
            // Mix of weeds and dirt - need to find the weeds
            const isWeed = Math.random() > 0.3; // 70% weeds
            if (isWeed) {
                gridHTML += `<div class="weed-patch weed" data-index="${i}">🌱</div>`;
            } else {
                gridHTML += `<div class="weed-patch dirt" data-index="${i}">🟫</div>`;
            }
        }
        gridHTML += '</div>';
        
        const modal = this.createMinigameModal(
            '🌱 Pick the Weeds (Punishment)',
            'Click each weed to pull it out. Find and remove ALL weeds from the garden. Be thorough!',
            gridHTML
        );
        
        const weedPatches = modal.querySelectorAll('.weed-patch.weed');
        const totalWeeds = weedPatches.length;
        
        const progressDiv = document.getElementById('minigame-progress');
        progressDiv.innerHTML = `<p>Weeds pulled: <span id="weed-count">0</span>/${totalWeeds}</p>`;
        
        // Add click handlers to weeds
        weedPatches.forEach((patch) => {
            patch.addEventListener('click', () => {
                if (!patch.classList.contains('pulled')) {
                    patch.classList.remove('weed');
                    patch.classList.add('pulled');
                    patch.textContent = '✓';
                    picked++;
                    document.getElementById('weed-count').textContent = picked;
                    
                    if (picked >= totalWeeds) {
                        setTimeout(() => {
                            this.completeMinigame(true);
                        }, 500);
                    }
                }
            });
        });
        
        // NO give up button for punishment chores - you MUST complete them
        const buttonsDiv = document.getElementById('minigame-buttons');
        buttonsDiv.innerHTML = '<p class="punishment-warning">⚠️ You cannot skip punishment chores!</p>';
    },
    
    // ========== WASH WINDOWS MINIGAME (PUNISHMENT - TWICE AS BAD) ==========
    // Scrub windows front and back - way more scrubs required
    showWashWindowsGame: function() {
        const windowCount = 6; // 6 windows, but each has front AND back
        const scrubsPerSide = 8; // More scrubs than dishes
        let windowsWashed = 0;
        let currentScrubs = 0;
        let currentWindow = 0;
        let currentSide = 'front';
        const totalSides = windowCount * 2; // Front and back
        
        const modal = this.createMinigameModal(
            '🪟 Wash the Windows (Punishment)',
            `Scrub each window ${scrubsPerSide} times on BOTH sides (front AND back). There are ${windowCount} windows to wash.`,
            `<div class="window-area">
                <div id="current-window" class="window dirty">🪟</div>
                <p id="window-status">Window ${currentWindow + 1}/${windowCount} (${currentSide}) - Click to scrub!</p>
                <div id="scrub-bar">
                    <div id="scrub-progress" style="width: 0%"></div>
                </div>
            </div>`
        );
        
        const progressDiv = document.getElementById('minigame-progress');
        progressDiv.innerHTML = `<p>Window sides washed: <span id="window-count">0</span>/${totalSides}</p>`;
        
        const windowEl = document.getElementById('current-window');
        const statusEl = document.getElementById('window-status');
        const scrubBar = document.getElementById('scrub-progress');
        
        windowEl.addEventListener('click', () => {
            currentScrubs++;
            const percentage = (currentScrubs / scrubsPerSide) * 100;
            scrubBar.style.width = percentage + '%';
            
            // Visual feedback
            windowEl.classList.add('scrubbing');
            setTimeout(() => windowEl.classList.remove('scrubbing'), 100);
            
            if (currentScrubs >= scrubsPerSide) {
                windowsWashed++;
                document.getElementById('window-count').textContent = windowsWashed;
                
                if (windowsWashed >= totalSides) {
                    setTimeout(() => {
                        this.completeMinigame(true);
                    }, 500);
                } else {
                    // Next side or window
                    currentScrubs = 0;
                    scrubBar.style.width = '0%';
                    
                    if (currentSide === 'front') {
                        currentSide = 'back';
                    } else {
                        currentSide = 'front';
                        currentWindow++;
                    }
                    
                    statusEl.textContent = `Window ${currentWindow + 1}/${windowCount} (${currentSide}) - Click to scrub!`;
                }
            }
        });
        
        // NO give up button for punishment chores
        const buttonsDiv = document.getElementById('minigame-buttons');
        buttonsDiv.innerHTML = '<p class="punishment-warning">⚠️ You cannot skip punishment chores!</p>';
    }
};
