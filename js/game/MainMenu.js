import GameObject from "../engine/gameobject.js";
import UI from "../engine/ui.js";
import Button from "./Button.js";

class MainMenu extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.hasSpawnedButtons = false;

        // Title Text
        const titleOffset = 150;
        this.title = new UI("Earthquake Safety Helper", -100, -titleOffset, "40px Arial", "white");
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
        const startX = this.x - 100;
        const startY = this.y - 50;
        const spacing = 70;

        // Button 1: Safe House
        const btn1 = new Button(startX, startY, 200, 50, "1. Safe Spots", () => {
            this.game.loadGame1();
        });
        this.game.addGameObject(btn1);

        // Button 2: Evacuation Line
        const btn2 = new Button(startX, startY + spacing, 200, 50, "2. Evacuation", () => {
            this.game.loadGame2();
        });
        this.game.addGameObject(btn2);

        // Button 3: Drop & Cover
        const btn3 = new Button(startX, startY + (spacing * 2), 200, 50, "3. Drop & Cover", () => {
            this.game.loadGame3();
        });
        this.game.addGameObject(btn3);
    }
}

export default MainMenu;