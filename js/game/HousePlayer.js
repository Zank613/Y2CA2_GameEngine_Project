import GameObject from "../engine/gameobject.js";
import Physics from "../engine/physics.js";
import Input from "../engine/input.js";
import Furniture from "./Furniture.js";
import { Images } from "../engine/resources.js";
import Animator from "../engine/Animator.js";
import Animation from "../engine/Animation.js";

class HousePlayer extends GameObject {
    constructor(x, y) {
        super(x, y);

        // --- VISUAL SIZE ---
        const pW = 85;
        const pH = 110;

        // 1. Setup Animator
        this.animator = new Animator('white', pW, pH);
        this.addComponent(this.animator);

        // 2. Create Animations

        // Idle: 4 FPS
        this.animator.addAnimation("Idle", new Animation(null, pW, pH, Images.playerIdle, 4));

        // Walk: 12 FPS
        this.animator.addAnimation("Walk", new Animation(null, pW, pH, Images.playerWalk, 12));

        // Protect: 6 FPS
        this.animator.addAnimation("Protect", new Animation(null, pW, pH, Images.playerProtect, 6));

        // Start Default
        this.animator.setAnimation("Idle");

        // Physics Box
        this.addComponent(new Physics({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }));
        this.getComponent(Physics).gravity = { x: 0, y: 1000 };

        this.addComponent(new Input());

        this.speed = 250;
        this.nearbyFurniture = null;
        this.interactionCooldown = 0;

        this.isProtecting = false;
        this.direction = 1;
    }

    setNearbyFurniture(furniture) {
        this.nearbyFurniture = furniture;
    }

    setProtectionMode(active) {
        this.isProtecting = active;
    }

    update(deltaTime) {
        const input = this.getComponent(Input);
        const physics = this.getComponent(Physics);

        // 1. Movement Logic
        let velocityX = 0;

        // Cannot move if currently taking cover
        if (!this.isProtecting) {
            if (input.isKeyDown("ArrowLeft") || input.isKeyDown("KeyA")) {
                velocityX = -this.speed;
                this.direction = -1; // Faces Left
            } else if (input.isKeyDown("ArrowRight") || input.isKeyDown("KeyD")) {
                velocityX = this.speed;
                this.direction = 1;  // Faces Right
            }
        }

        // Door Collision Logic
        const nextX = this.x + (velocityX * deltaTime);
        let canMove = true;
        for (const obj of this.game.gameObjects) {
            if (obj.name === "Door" && !obj.isOpen) {
                const pLeft = nextX;
                const pRight = nextX + 40; // Collision width
                const dLeft = obj.x;
                const dRight = obj.x + obj.renderer.width;
                if (pRight > dLeft && pLeft < dRight) { canMove = false; break; }
            }
        }

        if (canMove) {
            physics.velocity.x = velocityX;
        } else {
            physics.velocity.x = 0;
        }

        // 2. Floor Collision
        const floorY = this.game.canvas.height - 80 - this.animator.height;
        if (this.y > floorY) {
            this.y = floorY;
            physics.velocity.y = 0;
        }

        // 3. Animation State Machine
        if (this.isProtecting) {
            this.animator.setAnimation("Protect");
        } else if (Math.abs(velocityX) > 10) {
            this.animator.setAnimation("Walk");
        } else {
            this.animator.setAnimation("Idle");
        }

        // 4. Interaction
        if (this.interactionCooldown > 0) this.interactionCooldown -= deltaTime;

        this.nearbyFurniture = null;
        let closestDist = 150;
        let closestObj = null;
        for(const obj of this.game.gameObjects) {
            if(obj instanceof Furniture) {
                const playerCenterX = this.x + (this.animator.width / 2);
                const objCenterX = obj.x + (obj.renderer.width / 2);
                const dist = Math.abs(objCenterX - playerCenterX);
                if (dist < closestDist) { closestDist = dist; closestObj = obj; }
            }
        }
        this.nearbyFurniture = closestObj;

        if ((input.isKeyDown("KeyE") || input.isKeyDown("Space")) && this.interactionCooldown <= 0) {
            if (this.nearbyFurniture) {
                if (this.game.activeLevelController) {
                    this.game.activeLevelController.handleInteraction(this.nearbyFurniture);
                }
                this.interactionCooldown = 0.5;
            }
        }

        super.update(deltaTime);
    }
}

export default HousePlayer;