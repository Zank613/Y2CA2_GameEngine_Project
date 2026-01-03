import GameObject from "../engine/gameobject.js";
import Renderer from "../engine/renderer.js";
import Physics from "../engine/physics.js";
import Input from "../engine/input.js";
import Furniture from "./Furniture.js";

class HousePlayer extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.addComponent(new Renderer("white", 50, 80));
        this.addComponent(new Physics({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }));
        this.getComponent(Physics).gravity = { x: 0, y: 1000 };
        this.addComponent(new Input());

        this.speed = 250;
        this.nearbyFurniture = null;
        this.interactionCooldown = 0;
    }

    setNearbyFurniture(furniture) {
        this.nearbyFurniture = furniture;
    }

    update(deltaTime) {
        const input = this.getComponent(Input);
        const physics = this.getComponent(Physics);

        // 1. Movement
        let velocityX = 0;
        if (input.isKeyDown("ArrowLeft") || input.isKeyDown("KeyA")) {
            velocityX = -this.speed;
            this.direction = 1;
        } else if (input.isKeyDown("ArrowRight") || input.isKeyDown("KeyD")) {
            velocityX = this.speed;
            this.direction = -1;
        }

        // Door Collision Logic
        const nextX = this.x + (velocityX * deltaTime);
        let canMove = true;
        for (const obj of this.game.gameObjects) {
            if (obj.name === "Door" && !obj.isOpen) {
                const pLeft = nextX;
                const pRight = nextX + 50;
                const dLeft = obj.x;
                const dRight = obj.x + obj.renderer.width;
                if (pRight > dLeft && pLeft < dRight) {
                    canMove = false;
                    break;
                }
            }
        }

        if (canMove) {
            physics.velocity.x = velocityX;
        } else {
            physics.velocity.x = 0;
        }

        // 2. Floor Collision
        const floorY = this.game.canvas.height - 80 - this.getComponent(Renderer).height;
        if (this.y > floorY) {
            this.y = floorY;
            physics.velocity.y = 0;
        }

        // 3. Interaction Selection
        // We reset nearbyFurniture and find the single closest one.
        this.nearbyFurniture = null;
        let closestDist = 100; // Interaction Range
        let closestObj = null;

        for(const obj of this.game.gameObjects) {
            if(obj instanceof Furniture) {
                // Calculate distance from center to center
                const playerCenterX = this.x + 25;
                const objCenterX = obj.x + (obj.renderer.width / 2);
                const dist = Math.abs(objCenterX - playerCenterX);

                if (dist < closestDist) {
                    closestDist = dist;
                    closestObj = obj;
                }
            }
        }
        this.nearbyFurniture = closestObj;


        // 4. Interaction Input
        if (this.interactionCooldown > 0) {
            this.interactionCooldown -= deltaTime;
        }

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