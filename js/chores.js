// Chores Minigame System
// These minigames are intentionally tedious and unfun to discourage excessive chore usage
// Earning chores: Mow lawn, Wash dishes - pays money
// Punishment chores: Pick weeds, Wash windows, scrub bathroom, sort laundry - no pay, extremely tedious

const Chores = {
    // Constants for chore rewards
    EARNING_CHORE_REWARD: 10,
    EARNING_CHORE_HAPPINESS_COST: -3,

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
            // Punishment chores - tedious, no-pay chores assigned as consequences
            const games = ['pickWeeds', 'washWindows', 'scrubBathroom', 'sortLaundry'];
            const game = games[Math.floor(Math.random() * games.length)];
            this.currentMinigame = game;

            if (game === 'pickWeeds') {
                this.showPickWeedsGame();
            } else if (game === 'washWindows') {
                this.showWashWindowsGame();
            } else if (game === 'scrubBathroom') {
                this.showScrubBathroomGame();
            } else {
                this.showSortLaundryGame();
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

    // ========== PICK WEEDS MINIGAME (PUNISHMENT - EXTREMELY TEDIOUS) ==========
    // Click each weed in a larger grid - approximately 54 weeds on average
    showPickWeedsGame: function() {
        const gridSize = 8; // 8x8 grid = 64 cells
        const WEED_PROBABILITY = 0.85; // 85% of cells are weeds
        let picked = 0;

        // Add random delays/misses to make it more tedious
        let gridHTML = '<div class="weed-grid">';
        for (let i = 0; i < gridSize * gridSize; i++) {
            // Mix of weeds and dirt - need to find the weeds
            const isWeed = Math.random() < WEED_PROBABILITY;
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

    // ========== WASH WINDOWS MINIGAME (PUNISHMENT - EXTREMELY TEDIOUS) ==========
    // Scrub more windows front and back with even more scrubs required
    showWashWindowsGame: function() {
        const windowCount = 8; // 8 windows, but each has front AND back
        const scrubsPerSide = 12; // Far more scrubs than dishes
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
    },

    // ========== SCRUB BATHROOM MINIGAME (PUNISHMENT) ==========
    // Scrub several bathroom fixtures until each is clean
    showScrubBathroomGame: function() {
        const fixtures = ['🚽 Toilet', '🛁 Tub', '🚿 Shower', '🪞 Mirror', '🧼 Sink', '🧻 Shelves', '🧺 Hamper'];
        const scrubsPerFixture = 14;
        let currentFixture = 0;
        let currentScrubs = 0;

        const modal = this.createMinigameModal(
            '🧽 Scrub the Bathroom (Punishment)',
            `Scrub each bathroom fixture ${scrubsPerFixture} times. No shortcuts!`,
            `<div class="bathroom-area">
                <div id="current-fixture" class="dish dirty">${fixtures[currentFixture]}</div>
                <p id="fixture-status">Fixture ${currentFixture + 1}/${fixtures.length} - Click to scrub!</p>
                <div id="scrub-bar">
                    <div id="scrub-progress" style="width: 0%"></div>
                </div>
            </div>`
        );

        const progressDiv = document.getElementById('minigame-progress');
        progressDiv.innerHTML = `<p>Fixtures cleaned: <span id="fixture-count">0</span>/${fixtures.length}</p>`;

        const fixtureEl = document.getElementById('current-fixture');
        const statusEl = document.getElementById('fixture-status');
        const scrubBar = document.getElementById('scrub-progress');

        fixtureEl.addEventListener('click', () => {
            currentScrubs++;
            scrubBar.style.width = ((currentScrubs / scrubsPerFixture) * 100) + '%';
            fixtureEl.classList.add('scrubbing');
            setTimeout(() => fixtureEl.classList.remove('scrubbing'), 100);

            if (currentScrubs >= scrubsPerFixture) {
                currentFixture++;
                document.getElementById('fixture-count').textContent = currentFixture;

                if (currentFixture >= fixtures.length) {
                    setTimeout(() => this.completeMinigame(true), 500);
                } else {
                    currentScrubs = 0;
                    scrubBar.style.width = '0%';
                    fixtureEl.textContent = fixtures[currentFixture];
                    statusEl.textContent = `Fixture ${currentFixture + 1}/${fixtures.length} - Click to scrub!`;
                }
            }
        });

        const buttonsDiv = document.getElementById('minigame-buttons');
        buttonsDiv.innerHTML = '<p class="punishment-warning">⚠️ You cannot skip punishment chores!</p>';
    },

    // ========== SORT LAUNDRY MINIGAME (PUNISHMENT) ==========
    // Sort a large laundry pile one item at a time
    showSortLaundryGame: function() {
        const laundryItems = ['👕', '👖', '🧦', '👚', '🩳', '🧥'];
        const itemCount = 54;
        const foldsPerItem = 2;
        let sorted = 0;

        let pileHTML = '<div class="weed-grid">';
        for (let i = 0; i < itemCount; i++) {
            const item = laundryItems[Math.floor(Math.random() * laundryItems.length)];
            pileHTML += `<div class="weed-patch laundry-item" data-index="${i}">${item}</div>`;
        }
        pileHTML += '</div>';

        const modal = this.createMinigameModal(
            '🧺 Sort Laundry (Punishment)',
            `Click every item in the laundry pile ${foldsPerItem} times to sort, fold, and put it away.`,
            pileHTML
        );

        const progressDiv = document.getElementById('minigame-progress');
        progressDiv.innerHTML = `<p>Laundry sorted: <span id="laundry-count">0</span>/${itemCount}</p>`;

        modal.querySelectorAll('.laundry-item').forEach((item) => {
            let folds = 0;
            const originalItem = item.textContent;

            item.addEventListener('click', () => {
                if (!item.classList.contains('pulled')) {
                    folds++;

                    if (folds < foldsPerItem) {
                        item.textContent = `${originalItem}…`;
                        return;
                    }

                    item.classList.add('pulled');
                    item.textContent = '✓';
                    sorted++;
                    document.getElementById('laundry-count').textContent = sorted;

                    if (sorted >= itemCount) {
                        setTimeout(() => this.completeMinigame(true), 500);
                    }
                }
            });
        });

        const buttonsDiv = document.getElementById('minigame-buttons');
        buttonsDiv.innerHTML = '<p class="punishment-warning">⚠️ You cannot skip punishment chores!</p>';
    }

};
