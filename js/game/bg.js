import GameObject from "../engine/gameobject.js";
import Component from "../engine/component.js";

class HouseBackgroundRenderer extends Component {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        // DEFINING ROOM ZONES (Global constants for the level to use)
        const wallThickness = 40;

        const bedroomW = 700;
        const livingW = 900;
        const kitchenW = 800;

        const room1_X = 0;
        const wall1_X = bedroomW;
        const room2_X = bedroomW + wallThickness;
        const wall2_X = bedroomW + wallThickness + livingW;
        const room3_X = bedroomW + livingW + (wallThickness * 2);

        const floorH = 80;
        const wallH = this.height - floorH;

        // --- 1. BEDROOM (Pink Striped) ---
        ctx.fillStyle = "#FFC0CB";
        ctx.fillRect(room1_X, 0, bedroomW, wallH);
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        for(let i = 0; i < bedroomW; i+=50) ctx.fillRect(i, 0, 25, wallH);

        // --- 2. LIVING ROOM (Green with Rail) ---
        ctx.fillStyle = "#C1E1C1";
        ctx.fillRect(room2_X, 0, livingW, wallH);
        ctx.fillStyle = "#A0C1A0"; // Rail
        ctx.fillRect(room2_X, wallH / 2, livingW, 10);
        ctx.fillStyle = "#E8F5E9"; // Lighter bottom half
        ctx.fillRect(room2_X, (wallH/2) + 10, livingW, (wallH/2) - 10);

        // --- 3. KITCHEN (Yellow/Tiled) ---
        ctx.fillStyle = "#FFF9C4";
        ctx.fillRect(room3_X, 0, kitchenW, wallH);
        // Draw Tiling grid
        ctx.strokeStyle = "rgba(0,0,0,0.05)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(let x = room3_X; x < room3_X + kitchenW; x+=40) {
            ctx.moveTo(x, 0); ctx.lineTo(x, wallH);
        }
        for(let y = 0; y < wallH; y+=40) {
            ctx.moveTo(room3_X, y); ctx.lineTo(room3_X + kitchenW, y);
        }
        ctx.stroke();

        // --- 4. FLOORS ---
        ctx.fillStyle = "#5D4037";
        ctx.fillRect(0, wallH, this.width, floorH);
        // Floorboards
        ctx.strokeStyle = "#3E2723";
        ctx.beginPath();
        for(let i = 0; i < this.width; i+=80) {
            ctx.moveTo(i, wallH); ctx.lineTo(i, this.height);
        }
        ctx.stroke();

        // --- 5. THICK WALLS ---
        ctx.fillStyle = "#424242";
        ctx.fillRect(wall1_X, 0, wallThickness, wallH);
        ctx.fillRect(wall2_X, 0, wallThickness, wallH);
    }
}

class Background extends GameObject
{
    constructor(x, y, w, h)
    {
        super(x,y);
        this.renderer = new HouseBackgroundRenderer(w, h);
        this.addComponent(this.renderer);
    }
}

export default Background;