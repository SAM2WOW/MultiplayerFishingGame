class Fish {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.type = type;
        this.speed = 0.5 + Math.random() * 1.5;
        
        // Different fish colors/types
        let colors = ['red', 'blue', 'yellow', 'green', 'orange'];
        let color = colors[type % colors.length];
        
        // Create the fish sprite
        this.sprite = scene.add.sprite(x, y, 'fish');
        this.sprite.setTint(this.getColorValue(color));
        this.sprite.setScale(0.5 + (type % 3) * 0.2);
        
        // Set random direction
        this.setRandomDirection();
        
        // Random rotation adjustment
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        
        // Add to update list
        scene.fishList.push(this);
    }
    
    getColorValue(colorName) {
        const colors = {
            red: 0xff6666,
            blue: 0x6688ff,
            yellow: 0xffff66,
            green: 0x66ff66,
            orange: 0xffaa66
        };
        return colors[colorName] || 0xffffff;
    }
    
    update() {
        // Move the fish
        this.sprite.x += Math.cos(this.sprite.rotation) * this.speed;
        this.sprite.y += Math.sin(this.sprite.rotation) * this.speed;
        
        // Add some random rotation change for natural movement
        this.sprite.rotation += this.rotationSpeed;
        
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
}

export default Fish;