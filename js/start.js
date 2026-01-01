import MasterLevel from './game/MasterLevel.js';

// Create the single instance of the game engine.
// This handles the canvas context, the game loop, and the resizing.
const game = new MasterLevel('gameCanvas');

// Begin the main loop.
game.start();

// Handle tab switching (pausing the game when the user looks away).
document.onvisibilitychange = async (evt) => {
    if (document.hidden) {
        game.pause = true;
    } else {
        game.pause = false;
        // Reset the frame timer to prevent a huge deltaTime jump upon returning
        game.lastFrameTime = performance.now();
    }
};