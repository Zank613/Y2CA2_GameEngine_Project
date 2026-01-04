import GameObject from "../engine/gameobject.js";
import Renderer from "../engine/renderer.js";
import Component from "../engine/component.js";
import Physics from "../engine/physics.js";
import HousePlayer from "./HousePlayer.js";
import UI from "../engine/ui.js";

class FurnitureRenderer extends Component {
    constructor(width, height, color, name) {
        super();
        this.width = width;
        this.height = height;
        this.color = color;
        this.name = name;

        // Used to generate random colours for books and paintings once per object
        this.randomSeed = Math.random();
    }

    draw(ctx) {
        const x = this.gameObject.x;
        const y = this.gameObject.y;
        const w = this.width;
        const h = this.height;

        ctx.save();


        if (this.name === "Lamp") {
            // --- CEILING LAMP ---
            ctx.translate(x + w/2, y);

            // Check earthquake status via the Level Controller
            let rotation = 0;
            const level = this.gameObject.game.activeLevelController;

            if (level && level.isEarthquakeMode) {
                // Swing back and forth quickly
                const time = performance.now() / 100;
                rotation = Math.sin(time) * 0.5;
            }

            ctx.rotate(rotation);

            // Draw Wire
            ctx.strokeStyle = "#424242";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 40); // Wire length
            ctx.stroke();

            // Draw Shade
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(-15, 40);
            ctx.lineTo(15, 40);
            ctx.lineTo(25, 70);
            ctx.lineTo(-25, 70);
            ctx.closePath();
            ctx.fill();

            // Bulb Glow
            ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
            ctx.beginPath();
            ctx.arc(0, 75, 10, 0, Math.PI*2);
            ctx.fill();

        }
        else if (this.name === "Painting") {
            // --- PAINTING ---
            ctx.fillStyle = "#5D4037"; // Frame
            ctx.fillRect(x, y, w, h);

            // Canvas area
            ctx.fillStyle = "#FFF";
            ctx.fillRect(x+5, y+5, w-10, h-10);

            // Random Abstract Art
            const artColor = this.randomSeed > 0.5 ? "orange" : "cornflowerblue";
            ctx.fillStyle = artColor;
            ctx.beginPath();
            ctx.arc(x + w/2, y + h/2, 10, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = this.randomSeed > 0.3 ? "red" : "green";
            ctx.fillRect(x+10, y+h-20, 20, 10);
        }
        else if (this.name === "Chair") {
            // --- CHAIR ---
            ctx.fillStyle = "#8D6E63"; // Wood

            // Legs
            ctx.fillRect(x + 5, y + h/2, 5, h/2); // Front leg
            ctx.fillRect(x + w - 10, y + h/2, 5, h/2); // Back leg

            // Seat
            ctx.fillRect(x, y + h/2, w, 10);

            // Backrest
            ctx.fillRect(x + w - 10, y, 10, h/2 + 10);
            ctx.fillRect(x + w - 30, y + 10, 20, 5);
        }
        else if (this.name === "Door") {
            // --- DOOR LOGIC ---
            // If closed: Draw solid door
            // If open: Draw door frame "hollow"
            ctx.fillStyle = "#4E342E"; // Dark Frame
            ctx.fillRect(x, y, w, h);

            if (!this.gameObject.isOpen) {
                // Closed Door
                ctx.fillStyle = "#8D6E63"; // Wood
                ctx.fillRect(x + 5, y + 5, w - 10, h - 5);
                ctx.fillStyle = "gold"; // Knob
                ctx.beginPath();
                ctx.arc(x + w - 15, y + h/2, 5, 0, Math.PI*2);
                ctx.fill();
            } else {
                // Open Door
                ctx.fillStyle = "rgba(0,0,0,0.5)";
                ctx.fillRect(x + 5, y + 5, w - 10, h - 5);
            }
        }
        else if (this.name === "Fridge") {
            // --- FRIDGE ---
            ctx.fillStyle = "#E0E0E0";
            ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = "#9E9E9E";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);

            // Freezer Split
            ctx.beginPath();
            ctx.moveTo(x, y + h/3); ctx.lineTo(x+w, y + h/3);
            ctx.stroke();

            // Handles
            ctx.fillStyle = "#757575";
            ctx.fillRect(x + 10, y + h/3 - 40, 10, 30); // Top handle
            ctx.fillRect(x + 10, y + h/3 + 20, 10, 40); // Bottom handle

            // Magnets/Notes
            ctx.fillStyle = "yellow";
            ctx.fillRect(x + w - 30, y + 50, 15, 15);
        }
        else if (this.name === "Oven") {
            // --- OVEN ---
            ctx.fillStyle = "#212121";
            ctx.fillRect(x, y, w, h);

            // Stove Top
            ctx.fillStyle = "#424242";
            ctx.fillRect(x, y, w, 10);

            // Glass Window
            ctx.fillStyle = "#616161";
            ctx.fillRect(x + 20, y + 40, w - 40, h - 60);

            // Reflection
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.beginPath();
            ctx.moveTo(x+20, y+h-20); ctx.lineTo(x+w-20, y+40); ctx.lineTo(x+w-10, y+40); ctx.closePath();
            ctx.fill();

            // Knobs
            ctx.fillStyle = "silver";
            for(let i=0; i<4; i++) {
                ctx.beginPath();
                ctx.arc(x + 25 + (i*25), y + 25, 6, 0, Math.PI*2);
                ctx.fill();
            }
        }
        else if (this.name === "Counter") {
            // --- KITCHEN COUNTER ---
            ctx.fillStyle = "#D7CCC8";
            ctx.fillRect(x, y, w, h);

            // Countertop
            ctx.fillStyle = "#424242";
            ctx.fillRect(x - 5, y, w + 10, 15);

            // Drawers/Doors
            ctx.strokeStyle = "#A1887F";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + w/2, y + 15); ctx.lineTo(x + w/2, y + h);
            ctx.stroke();

            // Knobs
            ctx.fillStyle = "silver";
            ctx.beginPath();
            ctx.arc(x + w/4, y + 50, 4, 0, Math.PI*2);
            ctx.arc(x + (w*0.75), y + 50, 4, 0, Math.PI*2);
            ctx.fill();
        }
        else if (this.name === "DiningTable") {
            // -- DINING TABLE --
            // Legs
            ctx.fillStyle = "#3E2723";
            ctx.fillRect(x + 20, y + 20, 15, h - 20);
            ctx.fillRect(x + w - 35, y + 20, 15, h - 20);

            // Top
            ctx.fillStyle = "#5D4037";
            ctx.fillRect(x, y, w, 20);

            // Bowl
            ctx.fillStyle = "orange";
            ctx.beginPath(); ctx.arc(x + w/2, y - 5, 10, 0, Math.PI, false); ctx.fill();
        }
        else if (this.name === "Wardrobe") {
            ctx.fillStyle = "#8D6E63"; ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = "#5D4037"; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
            ctx.beginPath(); ctx.moveTo(x + w/2, y + 10); ctx.lineTo(x + w/2, y + h - 10); ctx.stroke();
            ctx.fillStyle = "gold";
            ctx.beginPath(); ctx.arc(x + w/2 - 10, y + h/2, 4, 0, Math.PI*2); ctx.arc(x + w/2 + 10, y + h/2, 4, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = "#6D4C41"; ctx.fillRect(x - 5, y, w + 10, 10);
        }
        else if (this.name === "Bed") {
            ctx.fillStyle = "black"; ctx.fillRect(x + 5, y + h - 10, 10, 10); ctx.fillRect(x + w - 15, y + h - 10, 10, 10);
            ctx.fillStyle = "#5D4037"; ctx.beginPath(); ctx.roundRect(x, y - 20, 20, h + 20, [10, 10, 0, 0]); ctx.fill();
            ctx.fillStyle = "white"; ctx.fillRect(x, y + 20, w, h - 30);
            ctx.fillStyle = "#C62828"; ctx.fillRect(x + 30, y + 20, w - 30, h - 30);
            ctx.fillStyle = "white"; ctx.beginPath(); ctx.ellipse(x + 25, y + 35, 15, 10, 0, 0, Math.PI*2); ctx.fill();
        }
        else if (this.name === "Window") {
            ctx.fillStyle = "#81D4FA"; ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = "white"; ctx.lineWidth = 5; ctx.strokeRect(x, y, w, h);
            ctx.beginPath(); ctx.moveTo(x + w/2, y); ctx.lineTo(x + w/2, y + h); ctx.moveTo(x, y + h/2); ctx.lineTo(x + w, y + h/2); ctx.stroke();
            // Curtains
            ctx.fillStyle = "#EF9A9A"; ctx.fillRect(x-10, y, 20, h); ctx.fillRect(x+w-10, y, 20, h);
        }
        else if (this.name === "Bookshelf") {
            ctx.fillStyle = "#5D4037"; ctx.fillRect(x, y, w, h);
            ctx.fillStyle = "#3E2723";

            const shelves = 4;
            const shelfGap = h / shelves;

            // Draw shelves and books
            for(let i=0; i<shelves; i++) {
                const shelfY = y + (i*shelfGap);
                // Shelf plank
                ctx.fillStyle = "#3E2723";
                ctx.fillRect(x, shelfY + shelfGap - 5, w, 5);

                // Random Books on this shelf
                let currentBookX = x + 5;
                let bookSeed = (this.gameObject.x + i * 13) % 100;

                while(currentBookX < x + w - 15) {
                    const bookW = 5 + (bookSeed % 10); // Random width 5-15
                    const bookH = 15 + (bookSeed % 15); // Random height
                    const colors = ["#C62828", "#1565C0", "#2E7D32", "#F9A825", "#6A1B9A"];
                    const color = colors[Math.floor(bookSeed % colors.length)];

                    ctx.fillStyle = color;
                    ctx.fillRect(currentBookX, shelfY + shelfGap - 5 - bookH, bookW, bookH);

                    currentBookX += bookW + 1; // 1px gap
                    bookSeed = (bookSeed * 7 + 3) % 100;

                    if(bookSeed < 20) currentBookX += 10; // Random gap between books
                }
            }
        }
        else {
            ctx.fillStyle = this.color; ctx.fillRect(x, y, w, h);
        }

        ctx.restore();

        // --- PROMPT UI ---
        if (this.gameObject.showPrompt) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 4;
            ctx.strokeRect(x - 5, y - 5, w + 10, h + 10);

            this.gameObject.prompt.x = x + w/2;
            this.gameObject.prompt.y = y - 30;
            this.gameObject.prompt.textAlign = "center";
            this.gameObject.prompt.draw(ctx);
        }
    }
}

class Furniture extends GameObject {
    constructor(x, y, w, h, color, name, isSafe, message) {
        super(x, y);
        this.name = name;
        this.isSafe = isSafe;
        this.message = message;

        this.hasBeenInspected = false;

        // Door State
        this.isOpen = false;

        this.renderer = new FurnitureRenderer(w, h, color, name);
        this.addComponent(this.renderer);
        this.addComponent(new Physics({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }));

        this.prompt = new UI("Press E", 0, -20, "20px Arial", "yellow");
        this.prompt.gameObject = this;
        this.showPrompt = false;
    }

    // Toggle for doors
    toggleOpen() {
        this.isOpen = !this.isOpen;
        // Update prompt text based on state
        if(this.name === "Door") {
            this.prompt.setText(this.isOpen ? "E: Check Safe" : "E: Open");
        }
    }

    update(deltaTime) {
        const player = this.game.gameObjects.find(obj => obj instanceof HousePlayer);

        if (player && player.nearbyFurniture === this) {
            this.showPrompt = true;

            // Dynamic prompt text
            if(this.name === "Door") {
                this.prompt.setText(this.isOpen ? "E: Check Safe" : "E: Open");
            }
        } else {
            this.showPrompt = false;
        }

        super.update(deltaTime);
    }
}

export default Furniture;