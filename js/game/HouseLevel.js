import HousePlayer from "./HousePlayer.js";
import Furniture from "./Furniture.js";
import DialogueBox from "./DialogueBox.js";
import Confiner from "../engine/confiner.js";
import ShakeableCamera from "../engine/ShakeableCamera.js";
import Background from "./bg.js";
import { Images, AudioFiles } from "../engine/resources.js";
import GameObject from "../engine/gameobject.js";
import Renderer from "../engine/renderer.js";
import UI from "../engine/ui.js";
import Button from "./Button.js";
import MobileControls from "./MobileControls.js";

class HouseLevel {
    constructor(game) {
        this.game = game;
        this.isEarthquakeMode = false;
        this.inspectedCount = 0;
        this.requiredInspections = 3;
        this.occupiedSpaces = [];

        // Environment
        this.game.addGameObject(new Background(0, 0, 2480, this.game.canvas.height));

        const floorHeight = 80;
        const startY = this.game.canvas.height - floorHeight - 110;

        // Player
        this.player = new HousePlayer(150, startY);
        this.game.camera = new ShakeableCamera(this.player, this.game.canvas.width, this.game.canvas.height);
        this.game.camera.confiner = new Confiner(0, 0, 2480, this.game.canvas.height);

        // 1. Spawn Doors FIRST
        this.spawnDoors();

        // 2. Spawn Random Furniture
        this.spawnFurniture();

        // 3. Spawn Decorations (Lamps, Paintings)
        this.spawnDecorations();

        this.game.addGameObject(this.player);

        // UI
        this.dialogueBox = new DialogueBox(this.game.canvas.width / 2, 100);
        this.game.addGameObject(this.dialogueBox);
        this.game.addGameObject(new MobileControls());

        this.dialogueBox.showMessage("I need to inspect the house. (WASD/Arrow Keys to Move, E to Interact)");

        this.winSequenceActive = false;
        this.jesus = null;
    }

    spawnDoors() {
        const floorHeight = 80;
        const doorH = 220;
        const doorY = this.game.canvas.height - floorHeight - doorH;

        // Door 1
        const d1X = 700; const d1W = 40;
        this.game.addGameObject(new Furniture(d1X, doorY, d1W, doorH, "brown", "Door", false, "Hiding in a doorway is NOT safe!"));
        this.occupiedSpaces.push({ start: d1X - 10, end: d1X + d1W + 10 });

        // Door 2
        const d2X = 1640; const d2W = 40;
        this.game.addGameObject(new Furniture(d2X, doorY, d2W, doorH, "brown", "Door", false, "Doorways are not strong enough!"));
        this.occupiedSpaces.push({ start: d2X - 10, end: d2X + d2W + 10 });
    }

    isSpaceOccupied(x, w) {
        const myStart = x;
        const myEnd = x + w;

        for (const space of this.occupiedSpaces) {
            // Check overlap
            if (myStart < space.end && myEnd > space.start) {
                return true;
            }
        }
        return false;
    }

    spawnFurniture() {
        const floorH = 80;
        const bedItems = [
            { name: "Wardrobe", w: 140, h: 250, safe: true, msg: "Nailed to the wall. Safe!" },
            { name: "Bed", w: 220, h: 100, safe: false, msg: "Too soft, debris could crush me." },
            { name: "Window", w: 120, h: 120, safe: false, msg: "Glass is dangerous!" },
            { name: "Chair", w: 60, h: 90, safe: true, msg: "Sturdy chair. Good cover if holding tight." }
        ];
        const liveItems = [
            { name: "Bookshelf", w: 130, h: 220, safe: false, msg: "Not bolted down! Dangerous." },
            { name: "DiningTable", w: 200, h: 90, safe: true, msg: "Strong table. Perfect for Drop, Cover, Hold." },
            { name: "Window", w: 120, h: 120, safe: false, msg: "Stay away from windows." },
            { name: "Chair", w: 60, h: 90, safe: true, msg: "Good for cover under sturdy desks/chairs." }
        ];
        const kitItems = [
            { name: "Fridge", w: 100, h: 210, safe: false, msg: "Heavy, could tip over!" },
            { name: "Oven", w: 100, h: 110, safe: false, msg: "Gas lines could rupture. Unsafe." },
            { name: "Counter", w: 180, h: 110, safe: true, msg: "Sturdy counter, good cover." }
        ];

        const spawnInRoom = (items, startX, width) => {
            // Shuffle items
            items.sort(() => Math.random() - 0.5);

            // Try to place each item
            items.forEach(item => {
                let attempts = 0;
                let placed = false;

                while(!placed && attempts < 10) {
                    // Random X within room bounds
                    const randX = startX + Math.random() * (width - item.w);

                    if (!this.isSpaceOccupied(randX, item.w)) {
                        let y = this.game.canvas.height - floorH - item.h;
                        if(item.name === "Window") y -= 150;

                        this.game.addGameObject(new Furniture(randX, y, item.w, item.h, "white", item.name, item.safe, item.msg));
                        this.occupiedSpaces.push({ start: randX - 10, end: randX + item.w + 10 });
                        placed = true;
                    }
                    attempts++;
                }
            });
        };

        spawnInRoom(bedItems, 0, 700);
        spawnInRoom(liveItems, 740, 900);
        spawnInRoom(kitItems, 1680, 800);
    }

    spawnDecorations() {
        // Paintings & Lamps
        const decorations = [
            { name: "Lamp", w: 50, h: 80, y: 0 },
            { name: "Painting", w: 60, h: 60, y: 150 },
            { name: "Lamp", w: 50, h: 80, y: 0 },
            { name: "Painting", w: 60, h: 60, y: 150 }
        ];

        const width = 2400;
        decorations.forEach(d => {
            const randX = Math.random() * width;
            this.game.addGameObject(new Furniture(randX, d.y, d.w, d.h, "yellow", d.name, false, ""));
        });
    }

    handleInteraction(obj) {
        if (obj.name === "Door" && !obj.isOpen) {
            obj.toggleOpen();
            return;
        }

        // Cannot interact with decor
        if (obj.name === "Lamp" || obj.name === "Painting") return;

        if (!this.isEarthquakeMode) {
            this.dialogueBox.showMessage(obj.message);
            if (!obj.hasBeenInspected) {
                this.inspectedCount++;
                obj.hasBeenInspected = true;
            }
            if (this.inspectedCount >= this.requiredInspections) {
                setTimeout(() => this.startEarthquake(), 2000);
            }
        } else {
            if (obj.isSafe) {
                this.dialogueBox.showMessage("I'm safe here! Drop, Cover, and Hold On!");
                this.game.camera.shaking = false;

                this.player.setProtectionMode(true);
                this.player.x = obj.x + (obj.renderer.width/2) - (this.player.animator.width/2);

                setTimeout(() => this.triggerWinSequence(), 2000);

            } else {
                this.dialogueBox.showMessage("This isn't safe! I need to move!");
            }
        }
    }

    startEarthquake() {
        if (this.isEarthquakeMode) return;
        this.isEarthquakeMode = true;
        this.dialogueBox.showMessage("EARTHQUAKE! Find a safe spot quickly!");
        this.game.camera.start(100);
    }

    triggerWinSequence() {
        if (this.winSequenceActive) return;
        this.winSequenceActive = true;

        this.dialogueBox.visible = false;

        AudioFiles.holy.loop = true;
        AudioFiles.holy.currentTime = 0;
        AudioFiles.holy.play().catch(e => console.log("Audio play failed:", e));

        const camX = this.game.camera.x;
        const camY = this.game.camera.y;

        this.jesus = new GameObject(camX + (this.game.canvas.width/2) - 50, camY - 200);
        this.jesus.renderer = new Renderer("white", 100, 150, Images.jesusDescend);
        this.jesus.addComponent(this.jesus.renderer);
        this.game.addGameObject(this.jesus);
    }

    update(deltaTime) {
        if (this.winSequenceActive && this.jesus) {
            const targetY = this.game.camera.y + 100;

            if (this.jesus.y < targetY) {
                this.jesus.y += 100 * deltaTime;
            } else {
                if (this.jesus.renderer.image !== Images.jesusWin) {
                    this.jesus.renderer.image = Images.jesusWin;

                    const w = this.game.canvas.width;
                    const h = this.game.canvas.height;
                    const textStr = "You Survived the Earthquake!";
                    const font = "bold 30px Arial";

                    // 1. Left Text
                    const leftUI = new UI(textStr, w * 0.20, h / 2, font, "black", "center");
                    const leftObj = new GameObject(0, 0);
                    leftObj.addComponent(leftUI);
                    this.game.addGameObject(leftObj);

                    // 2. Right Text
                    const rightUI = new UI(textStr, w * 0.80, h / 2, font, "black", "center");
                    const rightObj = new GameObject(0, 0);
                    rightObj.addComponent(rightUI);
                    this.game.addGameObject(rightObj);

                    // Buttons below
                    this.spawnWinButtons(this.jesus.x, this.jesus.y + 200);
                }
            }
        }
    }

    spawnWinButtons(x, y) {
        const stopSoundAndLoad = (callback) => {
            AudioFiles.holy.pause();
            AudioFiles.holy.currentTime = 0;
            callback();
        };

        const btn1 = new Button(x - 100, y, 200, 50, "Play Again", () => {
            stopSoundAndLoad(() => this.game.loadGame1());
        });
        const btn2 = new Button(x - 100, y + 70, 200, 50, "Main Menu", () => {
            stopSoundAndLoad(() => this.game.loadMainMenu());
        });

        this.game.addGameObject(btn1);
        this.game.addGameObject(btn2);
    }
}

export default HouseLevel;