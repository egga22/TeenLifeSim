// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI
    UI.init();
    
    // Check if save exists and enable/disable load button
    const loadButton = document.getElementById('load-game');
    if (!Storage.hasSave()) {
        loadButton.disabled = true;
        loadButton.textContent = 'No Save Found';
    } else {
        const saveInfo = Storage.getSaveInfo();
        if (saveInfo) {
            loadButton.textContent = `Load Game (${saveInfo.playerName}, Age ${saveInfo.age})`;
        }
    }
    
    // Log that game is ready
    console.log('Teen Life Simulator initialized and ready to play!');
});
