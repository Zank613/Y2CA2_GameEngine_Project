import GameObject from "../engine/gameobject.js";
import Component from "../engine/component.js";

class NoteRenderer extends Component {
    constructor(direction, color) {
        super();
        this.direction = direction;
        this.color = color;
        this.size = 50;
    }

    draw(ctx) {
        const x = this.gameObject.x;
        const y = this.gameObject.y;
        const s = this.size;
        const half = s / 2;

        ctx.fillStyle = this.color;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;

        ctx.save();
        ctx.translate(x + half, y + half);

        // Rotation
        if (this.direction === "up") ctx.rotate(0);
        if (this.direction === "right") ctx.rotate(Math.PI / 2);
        if (this.direction === "down") ctx.rotate(Math.PI);
        if (this.direction === "left") ctx.rotate(-Math.PI / 2);

        // Arrow Shape
        ctx.beginPath();
        ctx.moveTo(0, -half);
        ctx.lineTo(half, half);
        ctx.lineTo(0, half / 4);
        ctx.lineTo(-half, half);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

class Note extends GameObject {
    constructor(x, y, direction, speed) {
        super(x, y);
        this.direction = direction;
        this.speed = speed;
        this.active = true;

        let color = "gray";
        if (direction === "left") color = "#E91E63";
        if (direction === "down") color = "#2196F3";
        if (direction === "up") color = "#4CAF50";
        if (direction === "right") color = "#FFC107";

        this.renderer = new NoteRenderer(direction, color);
        this.addComponent(this.renderer);
    }

    update(deltaTime) {
        if (!this.active) return;
        this.y += this.speed * deltaTime;
        if (this.y > this.game.canvas.height + 100) {
            this.game.removeGameObject(this);
        }
        super.update(deltaTime);
    }
}

export default Note;