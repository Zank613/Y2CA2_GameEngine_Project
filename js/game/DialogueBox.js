import GameObject from "../engine/gameobject.js";
import UI from "../engine/ui.js";

class DialogueBox extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.visible = false;
        this.timer = 0;

        // Text Component
        this.ui = new UI("", 0, 0, "24px Arial", "white", "center");
        this.addComponent(this.ui);
    }

    showMessage(text, duration = 3) {
        this.ui.setText(text);
        this.visible = true;
        this.timer = duration;
    }

    update(deltaTime) {

    }

    draw(ctx) {
        if (!this.visible) return;

        // Draw Background Box
        const camera = this.game.camera;
        const boxWidth = 600;
        const boxHeight = 80;
        // Position relative to Camera so it stays on screen
        const drawX = camera.x + (this.game.canvas.width / 2) - (boxWidth / 2);
        const drawY = camera.y + 50;

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(drawX, drawY, boxWidth, boxHeight);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(drawX, drawY, boxWidth, boxHeight);

        this.ui.x = (this.game.canvas.width / 2) - camera.x;
        this.ui.x = (this.game.canvas.width / 2);
        this.ui.y = 80; // Offset inside the box

        ctx.font = this.ui.font;
        ctx.fillStyle = this.ui.color;
        ctx.textAlign = this.ui.textAlign;
        ctx.textBaseline = "middle";
        ctx.fillText(this.ui.text, drawX + boxWidth/2, drawY + boxHeight/2);
    }
}

export default DialogueBox;