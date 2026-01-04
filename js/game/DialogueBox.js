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

        // 1. Measure Text Width
        ctx.font = this.ui.font;
        const textMetric = ctx.measureText(this.ui.text);
        const textWidth = textMetric.width;

        // 2. Calculate Box Dimensions dynamically
        const padding = 60; // Extra space on sides
        const minWidth = 300; // Minimum box size

        const maxWidth = this.game.canvas.width - 40;
        let boxWidth = Math.max(minWidth, textWidth + padding);
        boxWidth = Math.min(boxWidth, maxWidth);

        const boxHeight = 80;

        // 3. Position the Box
        const camera = this.game.camera;
        const drawX = camera.x + (this.game.canvas.width / 2) - (boxWidth / 2);
        const drawY = camera.y + 50;

        // 4. Draw Background
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(drawX, drawY, boxWidth, boxHeight);

        // 5. Draw Border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(drawX, drawY, boxWidth, boxHeight);

        // 6. Draw Text
        ctx.fillStyle = this.ui.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Position text exactly in the middle of the dynamic box
        ctx.fillText(this.ui.text, drawX + (boxWidth / 2), drawY + (boxHeight / 2));
    }
}

export default DialogueBox;