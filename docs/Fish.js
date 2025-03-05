class Fish {
    constructor(scene, x, y, id = 0) {
        this.scene = scene;
        this.speed = 100.0 + Math.random() * 40;
        
        // fish ID (0-8)
        this.id = id;

        // fish rarity
        this.rarities = ['common', 'rare', 'legendary'];
        this.rarity = this.rarities[0];

        // Create the fish sprite
        this.sprite = scene.add.sprite(x, y, `fish_${this.id}`);
        // this.sprite.setScale(0.5 + (type % 3) * 0.2);
        
        // functions
        this.setRandomDirection();
        
        // Random rotation adjustment
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        
        // Add to update list
        scene.fishList.push(this);

        // check state if the fish is being catched or caught
        this.states = ['idle', 'catched', 'caught'];
        this.state = this.states[0];
    }

    update(time, delta) {
        if (this.state != 'idle') {
            return;
        }

        // Move the fish
        const deltaTime = delta / 1000; // Convert delta to seconds
        this.sprite.x += Math.cos(this.sprite.rotation) * this.speed * deltaTime;
        this.sprite.y += Math.sin(this.sprite.rotation) * this.speed * deltaTime;
        
        // Add some random rotation change for natural movement
        this.sprite.rotation += this.rotationSpeed * deltaTime;
        
        // Check if fish is out of bounds
        const padding = 50;
        const width = this.scene.sys.game.config.width;
        const height = this.scene.sys.game.config.height;
        
        let outOfBounds = false;
        
        if (this.sprite.x < -padding || this.sprite.x > width + padding || 
            this.sprite.y < -padding || this.sprite.y > height + padding) {
            outOfBounds = true;
        }
        
        // Change direction randomly or when out of bounds
        if (outOfBounds || Math.random() < 0.005) {
            this.setRandomDirection();
        }
    }
    
    setRandomDirection() {
        // Set a random direction
        const width = this.scene.sys.game.config.width;
        const height = this.scene.sys.game.config.height;
        
        // Target a random point in the pond
        const targetX = width * 0.2 + Math.random() * width * 0.6;
        const targetY = height * 0.2 + Math.random() * height * 0.6;
        
        // Calculate angle to target
        const angle = Math.atan2(targetY - this.sprite.y, targetX - this.sprite.x);
        
        // Set the rotation (angle plus some random variation)
        this.sprite.rotation = angle + (Math.random() - 0.5) * 0.5;
        
        // Flip the sprite depending on direction
        this.sprite.flipY = Math.cos(this.sprite.rotation) < 0;
    }

    startCatchingFish() {
        if (this.state != 'idle') {
            return;
        }

        // start catching fish
        this.state = 'catched';

        // change the tint to red
        this.sprite.setTint(0xff0000);

    }

    endCatchingFish(success) {
        if (this.state != 'catched') {
            return;
        }
        
        // change tint back to normal
        this.sprite.clearTint();

        if (success) {
            // caught fish
            this.state = 'caught';

            // make fish disappear for 5 seconds then reappear
            this.sprite.x = -100;
            this.sprite.y = -100;
            this.scene.time.delayedCall(5000, () => {
                this.state = 'idle';
                this.sprite.x = Math.random() * this.scene.sys.game.config.width;
                this.sprite.y = Math.random() * this.scene.sys.game.config.height;
                this.setRandomDirection();
            });

        }
        else
        {
            // failed to catch fish
            this.state = 'idle';
        }
    }
}

export default Fish;