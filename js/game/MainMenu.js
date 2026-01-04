import GameObject from "../engine/gameobject.js";
import UI from "../engine/ui.js";
import Button from "./Button.js";

class MainMenu extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.hasSpawnedButtons = false;

        const titleOffset = 150;
        this.title = new UI("Earthquake Safety Helper", x, y - titleOffset, "40px Arial", "white", "center");
        this.addComponent(this.title);
    }

    update(deltaTime) {
        if (!this.hasSpawnedButtons && this.game) {
            this.createMenuButtons();
            this.hasSpawnedButtons = true;
        }
        super.update(deltaTime);
    }

    createMenuButtons() {
        const startX = -100;
        const startY = -50;
        const spacing = 70;

        // 1. Safe Spots
        const btn1 = new Button(startX, startY, 200, 50, "1. Safe Spots", () => {
            this.game.loadGame1();
        });
        this.game.addGameObject(btn1);

        // 2. Drop & Cover
        const btn2 = new Button(startX, startY + spacing, 200, 50, "2. Drop & Cover", () => {
            this.game.loadGame3();
        });
        this.game.addGameObject(btn2);
    }
}

export default MainMenu;