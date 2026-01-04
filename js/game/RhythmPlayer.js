import GameObject from "../engine/gameobject.js";
import Component from "../engine/component.js";

// Helper to draw a limb segment with rotation
function drawLimb(ctx, x, y, width, length, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle); // Rotate around the joint
    ctx.fillStyle = color;

    // Draw rounded limb
    ctx.beginPath();
    ctx.roundRect(-width/2, 0, width, length, 5);
    ctx.fill();

    ctx.restore();

    // Calculate the end point of this limb
    return {
        x: x + Math.sin(angle) * length,
        y: y - Math.cos(angle) * length
    };
}

class DetailedRhythmRenderer extends Component {
    constructor() {
        super();
        this.colorSkin = "#FFCCBC"; // Light Skin tone
        this.colorShirt = "#1565C0"; // Blue Shirt
        this.colorPants = "#455A64"; // Grey Pants

        // --- ANIMATION STATE ---
        // We track the current angle and the target angle for every joint.
        this.joints = {
            headY: 0,        // Head bobbing
            leftArm: 0,      // Shoulder
            leftForearm: 0,  // Elbow
            rightArm: 0,
            rightForearm: 0,
            leftThigh: 0,    // Hip
            leftCalf: 0,     // Knee
            rightThigh: 0,
            rightCalf: 0
        };

        this.targets = { ...this.joints }; // Start targets same as current
        this.moveSpeed = 15; // How fast limbs move to target

        // Idle animation timer
        this.timer = 0;
        this.isCovering = false;
    }

    // Define the Poses
    setPose(pose) {
        // Reset to default Standing first
        let t = this.targets;

        if (pose === "IDLE") {
            t.leftArm = 0.2; t.leftForearm = 0.2;
            t.rightArm = -0.2; t.rightForearm = -0.2;
            t.leftThigh = 0.1; t.leftCalf = 0;
            t.rightThigh = -0.1; t.rightCalf = 0;
        }
        else if (pose === "LEFT") {
            // Point Left
            t.leftArm = 1.5; t.leftForearm = 0.2; // Arm straight out left
            t.rightArm = -0.5; t.rightForearm = -1.5; // Right arm tucked
            t.leftThigh = -0.5; t.leftCalf = 0.5; // Step left
            t.rightThigh = 0.2; t.rightCalf = 0;
        }
        else if (pose === "RIGHT") {
            // Point Right
            t.leftArm = 0.5; t.leftForearm = 1.5; // Left arm tucked
            t.rightArm = -1.5; t.rightForearm = -0.2; // Arm straight out right
            t.leftThigh = -0.2; t.leftCalf = 0;
            t.rightThigh = 0.5; t.rightCalf = -0.5; // Step right
        }
        else if (pose === "UP") {
            // Arms Up (Y shape)
            t.leftArm = 2.5; t.leftForearm = 0;
            t.rightArm = -2.5; t.rightForearm = 0;
            t.leftThigh = 0; t.leftCalf = 0;
            t.rightThigh = 0; t.rightCalf = 0;
        }
        else if (pose === "DOWN") {
            // Squat / Low arms
            t.leftArm = 0.5; t.leftForearm = 1.0;
            t.rightArm = -0.5; t.rightForearm = -1.0;
            t.leftThigh = -0.8; t.leftCalf = 1.5; // Deep Knee bend
            t.rightThigh = 0.8; t.rightCalf = -1.5;
        }
        else if (pose === "COVER") {
            // Drop & Cover
            t.leftArm = 2.0; t.leftForearm = 2.0; // Hands over head
            t.rightArm = -2.0; t.rightForearm = -2.0;
            t.leftThigh = -2.0; t.leftCalf = 2.5; // Knees fully bent
            t.rightThigh = 2.0; t.rightCalf = -2.5;
            t.headY = 15; // Lower head physically
        }
    }

    update(deltaTime) {
        this.timer += deltaTime;

        // Animate Breathing
        if (!this.isCovering) {
            this.targets.headY = Math.sin(this.timer * 5) * 2;
        }

        // Move every joint current angle towards target angle
        const keys = Object.keys(this.joints);
        for (let key of keys) {
            const diff = this.targets[key] - this.joints[key];
            this.joints[key] += diff * this.moveSpeed * deltaTime;
        }
    }

    draw(ctx) {
        const x = this.gameObject.x;
        const y = this.gameObject.y;
        const scale = 1.5;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        // -- DRAWING SKELETON --
        const j = this.joints;

        // 1. LEGS
        // Left Leg
        ctx.save();
        ctx.translate(-10, 30 + j.headY); // Hip position
        ctx.rotate(j.leftThigh);
        // Thigh
        ctx.fillStyle = this.colorPants;
        ctx.fillRect(-6, 0, 12, 35);
        // Calf
        ctx.translate(0, 35);
        ctx.rotate(j.leftCalf);
        ctx.fillRect(-5, 0, 10, 35);
        // Foot
        ctx.fillStyle = "black";
        ctx.fillRect(-6, 35, 14, 8);
        ctx.restore();

        // Right Leg
        ctx.save();
        ctx.translate(10, 30 + j.headY);
        ctx.rotate(j.rightThigh);
        ctx.fillStyle = this.colorPants;
        ctx.fillRect(-6, 0, 12, 35);
        ctx.translate(0, 35);
        ctx.rotate(j.rightCalf);
        ctx.fillRect(-5, 0, 10, 35);
        ctx.fillStyle = "black";
        ctx.fillRect(-6, 35, 14, 8);
        ctx.restore();

        // 2. TORSO
        ctx.translate(0, j.headY);
        ctx.fillStyle = this.colorShirt;
        // Rounded rect for body
        ctx.beginPath();
        ctx.roundRect(-20, -30, 40, 65, 10);
        ctx.fill();

        // Design on shirt
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(0, -10, 10, 0, Math.PI*2);
        ctx.fill();

        // 3. HEAD
        ctx.fillStyle = this.colorSkin;
        ctx.beginPath();
        ctx.arc(0, -45, 18, 0, Math.PI*2); // Head circle
        ctx.fill();
        // Eyes
        ctx.fillStyle = "black";
        if (this.isCovering) {
            // Closed eyes
            ctx.fillRect(-8, -48, 6, 2);
            ctx.fillRect(2, -48, 6, 2);
        } else {
            ctx.beginPath();
            ctx.arc(-6, -48, 2, 0, Math.PI*2);
            ctx.arc(6, -48, 2, 0, Math.PI*2);
            ctx.fill();
        }

        // 4. ARMS
        // Left Arm
        ctx.save();
        ctx.translate(-22, -25); // Shoulder position
        ctx.rotate(j.leftArm);
        ctx.fillStyle = this.colorShirt;
        ctx.fillRect(-6, 0, 12, 30); // Upper Arm
        ctx.translate(0, 30); // Elbow
        ctx.rotate(j.leftForearm);
        ctx.fillStyle = this.colorSkin; // Forearm is skin
        ctx.fillRect(-5, 0, 10, 30);
        // Hand
        ctx.beginPath(); ctx.arc(0, 32, 6, 0, Math.PI*2); ctx.fill();
        ctx.restore();

        // Right Arm
        ctx.save();
        ctx.translate(22, -25);
        ctx.rotate(j.rightArm);
        ctx.fillStyle = this.colorShirt;
        ctx.fillRect(-6, 0, 12, 30);
        ctx.translate(0, 30);
        ctx.rotate(j.rightForearm);
        ctx.fillStyle = this.colorSkin;
        ctx.fillRect(-5, 0, 10, 30);
        ctx.beginPath(); ctx.arc(0, 32, 6, 0, Math.PI*2); ctx.fill();
        ctx.restore();

        ctx.restore();
    }
}

class RhythmPlayer extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.renderer = new DetailedRhythmRenderer();
        this.addComponent(this.renderer);
        this.renderer.setPose("IDLE");
        this.poseTimer = 0;
    }

    doMove(direction) {
        if (this.renderer.isCovering) return;

        if (direction === "left") this.renderer.setPose("LEFT");
        if (direction === "right") this.renderer.setPose("RIGHT");
        if (direction === "up") this.renderer.setPose("UP");
        if (direction === "down") this.renderer.setPose("DOWN");

        this.poseTimer = 0.3; // Hold pose for 0.3 seconds
    }

    update(deltaTime) {
        if (this.poseTimer > 0) {
            this.poseTimer -= deltaTime;
            if (this.poseTimer <= 0 && !this.renderer.isCovering) {
                this.renderer.setPose("IDLE");
            }
        }
        super.update(deltaTime);
    }

    startCover() {
        this.renderer.isCovering = true;
        this.renderer.setPose("COVER");
    }

    stopCover() {
        this.renderer.isCovering = false;
        this.renderer.setPose("IDLE");
    }
}

export default RhythmPlayer;