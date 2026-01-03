import GameObject from "../engine/gameobject.js";
import UI from "../engine/ui.js";
import Renderer from "../engine/renderer.js";

// Button is a GameObject that contains a Text UI and a Rectangle Renderer
// It listens for mouse clicks to trigger an action.
class Button extends GameObject {
    constructor(x, y, width, height, text, onClickCallback) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.text = text;
        this.onClick = onClickCallback;

        // Visuals: Background Rectangle
        this.renderer = new Renderer('gray', width, height);
        this.addComponent(this.renderer);

        // Visuals: Text Label
        this.uiComponent = new UI(this.text, 0, 0, "20px Arial", "white", "center", "middle");
        this.addComponent(this.uiComponent);

        // Input Handling: Mouse Click Listener
        this.handleClick = (event) => this.checkClick(event);
        this.handleMove = (event) => this.checkHover(event);

        // Add event listeners to the canvas
        window.addEventListener('mousedown', this.handleClick);
        window.addEventListener('mousemove', this.handleMove);
    }

    update(deltaTime) {
        const camera = this.game.camera;
        this.uiComponent.x = (this.x - camera.x) + (this.width / 2);
        this.uiComponent.y = (this.y - camera.y) + (this.height / 2);

        super.update(deltaTime);
    }

    checkClick(event) {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const camera = this.game.camera;
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (mouseX >= screenX && mouseX <= screenX + this.width &&
            mouseY >= screenY && mouseY <= screenY + this.height) {

            if (this.onClick) {
                this.onClick();
            }
        }
    }

    checkHover(event) {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const camera = this.game.camera;
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (mouseX >= screenX && mouseX <= screenX + this.width &&
            mouseY >= screenY && mouseY <= screenY + this.height) {
            this.renderer.color = 'darkgray'; // Hover effect
        } else {
            this.renderer.color = 'gray'; // Normal state
        }
    }
}

export default Button;