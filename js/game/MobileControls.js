import GameObject from "../engine/gameobject.js";
import Input from "../engine/input.js";

class MobileControls extends GameObject {
    constructor() {
        super(0, 0);
        // Detect if the device supports touch
        this.isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        // Define virtual buttons
        // Coordinates will be calculated dynamically in draw() to fit screen size
        this.buttons = {
            left:   { x: 0, y: 0, w: 60, h: 60, key: "ArrowLeft", active: false, label: "←" },
            right:  { x: 0, y: 0, w: 60, h: 60, key: "ArrowRight", active: false, label: "→" },
            up:     { x: 0, y: 0, w: 60, h: 60, key: "ArrowUp", active: false, label: "↑" },
            down:   { x: 0, y: 0, w: 60, h: 60, key: "ArrowDown", active: false, label: "↓" },
            action: { x: 0, y: 0, r: 40, key: "KeyE", active: false, label: "E" }
        };

        if (this.isMobile) {
            this.setupTouchListeners();
        }
    }

    setupTouchListeners() {
        const handleTouch = (e) => {
            // Prevent default zooming/scrolling behavior
            if(e.cancelable) e.preventDefault();
            this.processTouches(e);
        };

        window.addEventListener('touchstart', handleTouch, {passive: false});
        window.addEventListener('touchmove', handleTouch, {passive: false});
        window.addEventListener('touchend', handleTouch, {passive: false});
    }

    processTouches(e) {
        if (!this.game) return;

        // Find the Input Component in the game scene
        // We need to inject fake key presses into it
        let inputComp = null;
        for(const obj of this.game.gameObjects) {
            const comp = obj.getComponent(Input);
            if(comp) {
                inputComp = comp;
                break;
            }
        }
        if (!inputComp) return;

        // Reset all our virtual buttons to OFF
        for(let k in this.buttons) this.buttons[k].active = false;

        // Reset the actual Game Input keys so the input stops
        inputComp.keys["ArrowLeft"] = false;
        inputComp.keys["ArrowRight"] = false;
        inputComp.keys["ArrowUp"] = false;
        inputComp.keys["ArrowDown"] = false;
        inputComp.keys["KeyE"] = false;

        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();

        // Scale factor in case canvas is displayed at a different size than its internal resolution
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Loop through all active fingers on screen
        for (let i = 0; i < e.touches.length; i++) {
            const t = e.touches[i];
            // Calculate touch position relative to Canvas
            const tx = (t.clientX - rect.left) * scaleX;
            const ty = (t.clientY - rect.top) * scaleY;

            // Check Collision with D-Pad
            this.checkRect(tx, ty, this.buttons.left);
            this.checkRect(tx, ty, this.buttons.right);
            this.checkRect(tx, ty, this.buttons.up);
            this.checkRect(tx, ty, this.buttons.down);

            // Check Collision with Action Button
            const btn = this.buttons.action;
            const dx = tx - btn.x;
            const dy = ty - btn.y;
            if (Math.sqrt(dx*dx + dy*dy) < btn.r * 1.5) {
                btn.active = true;
            }
        }

        // Apply ON states to the Game Engine
        if (this.buttons.left.active) inputComp.keys["ArrowLeft"] = true;
        if (this.buttons.right.active) inputComp.keys["ArrowRight"] = true;
        if (this.buttons.up.active) inputComp.keys["ArrowUp"] = true;
        if (this.buttons.down.active) inputComp.keys["ArrowDown"] = true;
        if (this.buttons.action.active) inputComp.keys["KeyE"] = true;
    }

    // Collision helper
    checkRect(tx, ty, btn) {
        if (tx >= btn.x && tx <= btn.x + btn.w && ty >= btn.y && ty <= btn.y + btn.h) {
            btn.active = true;
        }
    }

    draw(ctx) {
        if (!this.isMobile) return;

        const w = this.game.canvas.width;
        const h = this.game.canvas.height;
        const btnSize = 70; // Size of D-Pad buttons
        const padding = 30;

        // --- POSITIONING ---
        // D-Pad Bottom Left
        const startX = padding;
        const startY = h - (btnSize * 3) - padding;

        // Layout:
        //    [U]
        // [L][D][R]
        this.buttons.up.x = startX + btnSize;       this.buttons.up.y = startY;
        this.buttons.left.x = startX;               this.buttons.left.y = startY + btnSize;
        this.buttons.down.x = startX + btnSize;     this.buttons.down.y = startY + btnSize;
        this.buttons.right.x = startX + (btnSize*2);this.buttons.right.y = startY + btnSize;

        // Action Button Bottom Right
        this.buttons.action.x = w - 80;
        this.buttons.action.y = h - 100;

        // --- DRAWING ---
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 0.6; // Semi-transparent

        // Draw Rect Buttons
        const drawRectBtn = (btn) => {
            ctx.fillStyle = btn.active ? "white" : "#424242";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = btn.active ? "black" : "white";
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(btn.label, btn.x + btn.w/2, btn.y + btn.h/2);
        };

        drawRectBtn(this.buttons.left);
        drawRectBtn(this.buttons.right);
        drawRectBtn(this.buttons.up);
        drawRectBtn(this.buttons.down);

        // Draw Circle Action Button
        const act = this.buttons.action;
        ctx.beginPath();
        ctx.fillStyle = act.active ? "#FFEB3B" : "#D32F2F"; // Yellow press, Red idle
        ctx.arc(act.x, act.y, act.r, 0, Math.PI*2);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.fillText(act.label, act.x, act.y);

        ctx.restore();
    }
}

export default MobileControls;