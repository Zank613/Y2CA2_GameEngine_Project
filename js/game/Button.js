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
        // We offset the text slightly to center it within the button box.
        this.uiComponent = new UI(this.text, 10, height / 4, "20px Arial", "white");
        this.addComponent(this.uiComponent);

        // Input Handling: Mouse Click Listener
        this.handleClick = (event) => this.checkClick(event);
        this.handleMove = (event) => this.checkHover(event);

        // Add event listeners to the canvas
        window.addEventListener('mousedown', this.handleClick);
        window.addEventListener('mousemove', this.handleMove);
    }

    checkClick(event) {
        // We need the canvas position to get accurate mouse coordinates
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Simple collision detection between Mouse and Button
        if (mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height) {

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

        if (mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height) {
            this.renderer.color = 'darkgray'; // Hover effect
        } else {
            this.renderer.color = 'gray'; // Normal state
        }
    }
}

export default Button;