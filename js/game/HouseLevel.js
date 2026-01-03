import HousePlayer from "./HousePlayer.js";
import Furniture from "./Furniture.js";
import DialogueBox from "./DialogueBox.js";
import Confiner from "../engine/confiner.js";
import ShakeableCamera from "../engine/ShakeableCamera.js";
import Background from "./bg.js";

class HouseLevel {
    constructor(game) {
        this.game = game;
        this.isEarthquakeMode = false;
        this.inspectedCount = 0;
        this.requiredInspections = 4;

        // 1. Setup Environment
        this.game.addGameObject(new Background(0, 0, 2480, this.game.canvas.height));

        // 2. Setup Camera
        const floorHeight = 80;
        const startY = this.game.canvas.height - floorHeight - 80;

        this.player = new HousePlayer(150, startY);

        this.game.camera = new ShakeableCamera(this.player, this.game.canvas.width, this.game.canvas.height);
        this.game.camera.confiner = new Confiner(0, 0, 2480, this.game.canvas.height);

        // 3. Spawn Content
        this.spawnDoors();
        this.spawnFurniture();

        // 4. Add Player
        this.game.addGameObject(this.player);

        // 5. UI
        this.dialogueBox = new DialogueBox(this.game.canvas.width / 2, 100);
        this.game.addGameObject(this.dialogueBox);

        this.dialogueBox.showMessage("I need to inspect the house. (WASD to Move, E to Interact)");
    }

    spawnDoors() {
        const floorHeight = 80;
        const doorH = 220;
        const doorY = this.game.canvas.height - floorHeight - doorH;

        const door1 = new Furniture(700, doorY, 40, doorH, "brown", "Door", false, "Hiding in a doorway is NOT safe anymore!");
        const door2 = new Furniture(1640, doorY, 40, doorH, "brown", "Door", false, "Doorways are not strong enough. Find a table!");

        this.game.addGameObject(door1);
        this.game.addGameObject(door2);
    }

    spawnFurniture() {
        const floorH = 80;
        const bedItems = [
            { name: "Wardrobe", w: 140, h: 250, safe: true, msg: "Nailed to the wall. Safe!" },
            { name: "Bed", w: 220, h: 100, safe: false, msg: "Too soft, debris could crush me." },
            { name: "Window", w: 120, h: 120, safe: false, msg: "Glass is dangerous!" }
        ];
        const liveItems = [
            { name: "Bookshelf", w: 130, h: 220, safe: false, msg: "Not bolted down! Dangerous." },
            { name: "DiningTable", w: 200, h: 90, safe: true, msg: "Strong table. Perfect for Drop, Cover, Hold." },
            { name: "Window", w: 120, h: 120, safe: false, msg: "Stay away from windows." }
        ];
        const kitItems = [
            { name: "Fridge", w: 100, h: 210, safe: false, msg: "Heavy, could tip over!" },
            { name: "Oven", w: 100, h: 110, safe: false, msg: "Gas lines could rupture. Unsafe." },
            { name: "Counter", w: 180, h: 110, safe: true, msg: "Sturdy counter, good cover." }
        ];

        const spawnInRoom = (items, startX, width) => {
            items.sort(() => Math.random() - 0.5);
            let currentX = startX + 50;
            const gap = width / items.length;

            items.forEach(item => {
                let y = this.game.canvas.height - floorH - item.h;
                if(item.name === "Window") y -= 150;

                const xOffset = Math.random() * (gap - item.w - 20);
                const finalX = currentX + xOffset;

                const furn = new Furniture(finalX, y, item.w, item.h, "white", item.name, item.safe, item.msg);
                this.game.addGameObject(furn);

                currentX += gap;
            });
        };

        spawnInRoom(bedItems, 0, 700);
        spawnInRoom(liveItems, 740, 900);
        spawnInRoom(kitItems, 1680, 800);
    }

    handleInteraction(obj) {
        if (obj.name === "Door") {
            if (!obj.isOpen) {
                // First Click: Open the door
                obj.toggleOpen();
                return;
            }
        }

        if (!this.isEarthquakeMode) {
            this.dialogueBox.showMessage(obj.message);
            if (!obj.hasBeenInspected) {
                this.inspectedCount++;
                obj.hasBeenInspected = true; // Mark as done
            }

            if (this.inspectedCount >= this.requiredInspections) {
                setTimeout(() => this.startEarthquake(), 2000);
            }
        } else {
            if (obj.isSafe) {
                this.dialogueBox.showMessage("I'm safe here! The earthquake is passing...");
                this.game.camera.shaking = false;
                setTimeout(() => this.game.loadMainMenu(), 4000);
            } else {
                this.dialogueBox.showMessage("This isn't safe! I need to move!");
            }
        }
    }

    startEarthquake() {
        if (this.isEarthquakeMode) return;

        this.isEarthquakeMode = true;
        this.dialogueBox.showMessage("EARTHQUAKE! Find a safe spot quickly!");

        if(this.game.camera.start) {
            this.game.camera.start(10);
        }
    }

    update(deltaTime) {
    }
}

export default HouseLevel;