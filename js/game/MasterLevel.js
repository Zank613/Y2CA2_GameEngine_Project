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
        this.cameraAnchor.addComponent(new Renderer('rgba(0,0,0,0)', 1, 1));

        this.activeLevelController = null;

        this.loadMainMenu();
    }

    clearScene() {
        this.gameObjects = [];
        this.gameObjectsToRemove = [];

        this.camera.target = this.cameraAnchor;
        this.camera.confiner = null;
        if (this.camera.shaking !== undefined) {
            this.camera.shaking = false;
        }
        this.camera.x = 0;
        this.camera.y = 0;

        if (this.activeLevelController && this.activeLevelController.cleanup) {
            this.activeLevelController.cleanup();
        }
        this.activeLevelController = null;
    }

    loadMainMenu() {
        this.clearScene();
        const menu = new MainMenu(this.canvas.width / 2, this.canvas.height / 2);
        this.addGameObject(menu);
    }

    loadGame1() {
        this.clearScene();
        console.log("Loading Game 1");
        this.activeLevelController = new HouseLevel(this);
    }

    loadGame3() {
        this.clearScene();
        console.log("Loading Game 3");
        this.activeLevelController = new RhythmLevel(this);
    }

    update() {
        super.update();
        if (this.activeLevelController && this.activeLevelController.update) {
            this.activeLevelController.update(this.deltaTime);
        }
    }
}

export default MasterLevel;