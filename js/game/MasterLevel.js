import Game from "../engine/game.js";
import GameObject from "../engine/gameobject.js";
import Renderer from "../engine/renderer.js";
import MainMenu from "./MainMenu.js";
import HouseLevel from "./HouseLevel.js";
import EvacuationLevel from "./EvacuationLevel.js";
import RhythmLevel from "./RhythmLevel.js";

class MasterLevel extends Game {
    constructor(canvasId) {
        super(canvasId);

        this.cameraAnchor = new GameObject(0, 0);
        this.cameraAnchor.addComponent(new Renderer('rgba(0,0,0,0)', 1, 1)); // Invisible 1x1 pixel

        // Track which level logic is currently active
        this.activeLevelController = null;

        // Start directly into the Main Menu
        this.loadMainMenu();
    }

    /**
     * Wipes the slate clean. Removes all objects.
     */
    clearScene() {
        this.gameObjects = [];
        this.gameObjectsToRemove = [];

        this.camera.target = this.cameraAnchor;

        // Reset Camera Position
        this.camera.x = 0;
        this.camera.y = 0;

        if (this.activeLevelController && this.activeLevelController.cleanup) {
            this.activeLevelController.cleanup();
        }
        this.activeLevelController = null;
    }

    /**
     * Loads the Main Menu Screen.
     */
    loadMainMenu() {
        this.clearScene();
        const menu = new MainMenu(this.canvas.width / 2, this.canvas.height / 2);
        this.addGameObject(menu);
    }

    /**
     * Loads Game 1: The Safe House
     */
    loadGame1() {
        this.clearScene();
        console.log("Loading Game 1: Safe House");
        this.activeLevelController = new HouseLevel(this);
    }

    /**
     * Loads Game 2: The Evacuation Line
     */
    loadGame2() {
        this.clearScene();
        console.log("Loading Game 2: Evacuation Line");
        this.activeLevelController = new EvacuationLevel(this);
    }

    /**
     * Loads Game 3: Quake Rhythm
     */
    loadGame3() {
        this.clearScene();
        console.log("Loading Game 3: Quake Rhythm");
        this.activeLevelController = new RhythmLevel(this);
    }

    // Override the update loop to allow the specific level controller
    update() {
        super.update(); // Run the standard engine update

        if (this.activeLevelController && this.activeLevelController.update) {
            this.activeLevelController.update(this.deltaTime);
        }
    }
}

export default MasterLevel;