import GameObject from "../engine/gameobject.js";
import UI from "../engine/ui.js";
import Input from "../engine/input.js";
import Note from "./Note.js";
import Renderer from "../engine/renderer.js";
import RhythmPlayer from "./RhythmPlayer.js";
import ShakeableCamera from "../engine/ShakeableCamera.js";
import MobileControls from "./MobileControls.js";

class RhythmController extends GameObject {
    constructor() {
        super(0, 0);
        this.addComponent(new Input());
    }
}

class RhythmLevel {
    constructor(game) {
        this.game = game;

        // Setup Camera
        this.camTarget = new GameObject(this.game.canvas.width / 2, this.game.canvas.height / 2);
        this.camTarget.addComponent(new Renderer("transparent", 1, 1));
        this.game.addGameObject(this.camTarget);
        this.game.camera = new ShakeableCamera(this.camTarget, this.game.canvas.width, this.game.canvas.height);

        // 1. Background
        this.bg = new GameObject(0, 0);
        this.bg.addComponent(new Renderer("#212121", 2000, 2000));
        this.game.addGameObject(this.bg);

        // 2. The Character
        this.player = new RhythmPlayer(350, this.game.canvas.height / 2 + 100);
        this.game.addGameObject(this.player);

        // 3. Input
        this.inputCtrl = new RhythmController();
        this.game.addGameObject(this.inputCtrl);
        this.input = this.inputCtrl.getComponent(Input);

        // 4. Game Logic
        this.score = 0;
        this.combo = 0;
        this.spawnTimer = 0;
        this.spawnRate = 1.2;
        this.noteSpeed = 300;
        this.difficultyTimer = 0;
        this.isPlaying = true;
        this.isQuakePhase = false;
        this.quakeTimer = 10;

        // 5. UI Elements
        this.scoreText = new UI("Score: 0", 20, 20, "30px Arial", "white");
        this.game.addGameObject(this.createUIObject(this.scoreText));

        this.comboText = new UI("Combo: 0", 20, 60, "20px Arial", "yellow");
        this.game.addGameObject(this.createUIObject(this.comboText));

        this.feedbackText = new UI("", 500, this.game.canvas.height/2, "40px Arial", "white", "center");
        this.game.addGameObject(this.createUIObject(this.feedbackText));

        // --- 6. LANES ---
        const laneStartX = 600;
        const spacing = 60;

        this.lanes = {
            "left":  laneStartX,
            "down":  laneStartX + spacing,
            "up":    laneStartX + (spacing*2),
            "right": laneStartX + (spacing*3)
        };

        // Draw Lane Lines
        for (let i = 0; i < 4; i++) {
            const x = laneStartX + (i * spacing) + (spacing/2);
            const line = new GameObject(x, 0);
            line.addComponent(new Renderer("rgba(255,255,255,0.1)", 2, 2000));
            this.game.addGameObject(line);
        }

        this.targetY = this.game.canvas.height - 100;
        this.lastKeys = { ArrowLeft: false, ArrowDown: false, ArrowUp: false, ArrowRight: false };

        this.game.addGameObject(new MobileControls());

        this.showFeedback("GET READY...", "cyan");
    }

    createUIObject(uiComponent) {
        const obj = new GameObject(0, 0);
        obj.addComponent(uiComponent);
        return obj;
    }

    update(deltaTime) {
        if (!this.isPlaying) return;

        // Difficulty Ramp
        this.difficultyTimer += deltaTime;
        if (this.difficultyTimer > 5) {
            this.difficultyTimer = 0;
            if (this.spawnRate > 0.3) this.spawnRate -= 0.05;
            if (this.noteSpeed < 800) this.noteSpeed += 20;
        }

        // Earthquake Logic
        this.quakeTimer -= deltaTime;
        if (this.quakeTimer <= 0) {
            this.triggerQuake();
            this.quakeTimer = 15 + Math.random() * 10;
        }

        // Spawning
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0) {
            this.spawnNote();
            this.spawnTimer = this.spawnRate;
        }

        // Input
        this.checkInput("ArrowLeft", "left");
        this.checkInput("ArrowDown", "down");
        this.checkInput("ArrowUp", "up");
        this.checkInput("ArrowRight", "right");
    }

    triggerQuake() {
        this.isQuakePhase = true;
        this.game.camera.start(4);
        this.showFeedback("EARTHQUAKE!", "red");
        this.player.startCover();

        setTimeout(() => {
            this.isQuakePhase = false;
            this.player.stopCover();
            this.showFeedback("All Clear!", "lime");
        }, 4000);
    }

    spawnNote() {
        const directions = ["left", "down", "up", "right"];
        const randDir = directions[Math.floor(Math.random() * directions.length)];
        const x = this.lanes[randDir];

        const note = new Note(x + 5, -50, randDir, this.noteSpeed);
        this.game.addGameObject(note);
    }

    checkInput(keyName, direction) {
        const isDown = this.input.isKeyDown(keyName);
        const wasDown = this.lastKeys[keyName];

        if (isDown && !wasDown) {
            this.processHit(direction);
        }
        this.lastKeys[keyName] = isDown;
    }

    processHit(direction) {
        if (!this.isQuakePhase) {
            this.player.doMove(direction);
        }

        const notes = this.game.gameObjects.filter(obj => obj instanceof Note && obj.direction === direction && obj.active);

        let hitNote = null;
        let minDist = 1000;

        for (const note of notes) {
            const dist = Math.abs(note.y - this.targetY);
            if (dist < minDist) {
                minDist = dist;
                hitNote = note;
            }
        }

        if (hitNote && minDist < 80) {
            this.game.removeGameObject(hitNote);
            hitNote.active = false;

            let points = 50;
            let label = "GOOD";
            let color = "lime";

            if (minDist < 25) {
                points = 100;
                label = "PERFECT!";
                color = "cyan";
            }
            if (this.isQuakePhase) {
                points *= 2;
                label = "SAFE! " + label;
                color = "orange";
            }

            this.score += points;
            this.combo++;
            this.showFeedback(label, color);
        } else {
            this.combo = 0;
            this.score -= 10;
        }
        this.updateUI();
    }

    showFeedback(text, color) {
        this.feedbackText.setText(text);
        this.feedbackText.color = color;
        if (text.includes("EARTHQUAKE")) return;
        setTimeout(() => {
            if (this.feedbackText.text === text) this.feedbackText.setText("");
        }, 500);
    }

    updateUI() {
        this.scoreText.setText("Score: " + this.score);
        this.comboText.setText("Combo: " + this.combo);
    }
}

export default RhythmLevel;