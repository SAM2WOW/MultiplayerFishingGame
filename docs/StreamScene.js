import Fish from "./Fish.js";

class StreamScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StreamScene' });
        this.fishList = [];
    }

    preload() {
        // Load assets
        this.load.image('background', '/sprites/pond.webp');
        this.load.image('fish', '/sprites/fish.webp');
        this.load.image('lily', '/api/placeholder/64/64');
        this.load.image('ripple', '/api/placeholder/128/128');
    }
    
    create() {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;
        
        // Add pond background
        const bg = this.add.sprite(width/2, height/2, 'background');
        bg.setDisplaySize(width, height);
        bg.setTint(0x2288cc);
        
        // Add ripples
        // for (let i = 0; i < 8; i++) {
        //     const x = Math.random() * width;
        //     const y = Math.random() * height;
        //     const ripple = this.add.sprite(x, y, 'ripple');
        //     ripple.setAlpha(0.3);
        //     ripple.setScale(0.5 + Math.random() * 0.7);
            
        //     // Animate ripple
        //     this.tweens.add({
        //         targets: ripple,
        //         alpha: 0,
        //         scale: ripple.scale + 0.5,
        //         duration: 2000 + Math.random() * 2000,
        //         repeat: -1,
        //         yoyo: false,
        //         repeatDelay: Math.random() * 3000
        //     });
        // }
        
        // Add lily pads
        // for (let i = 0; i < 6; i++) {
        //     const x = Math.random() * width;
        //     const y = Math.random() * height;
        //     const lily = this.add.sprite(x, y, 'lily');
        //     lily.setScale(0.4 + Math.random() * 0.4);
        //     lily.setTint(0x55aa55);
        //     lily.setAlpha(0.8);
            
        //     // Add slight rotation to lily pads
        //     this.tweens.add({
        //         targets: lily,
        //         angle: lily.angle + (Math.random() - 0.5) * 10,
        //         duration: 3000 + Math.random() * 3000,
        //         repeat: -1,
        //         yoyo: true,
        //         ease: 'Sine.easeInOut'
        //     });
        // }
        
        // Add fish
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            new Fish(this, x, y, i);
        }
        
        // // Add a few more ripples on top
        // for (let i = 0; i < 5; i++) {
        //     const x = Math.random() * width;
        //     const y = Math.random() * height;
        //     const ripple = this.add.sprite(x, y, 'ripple');
        //     ripple.setAlpha(0.2);
        //     ripple.setScale(0.3 + Math.random() * 0.4);
            
        //     // Animate ripple
        //     this.tweens.add({
        //         targets: ripple,
        //         alpha: 0,
        //         scale: ripple.scale + 0.3,
        //         duration: 1500 + Math.random() * 1500,
        //         repeat: -1,
        //         yoyo: false,
        //         repeatDelay: Math.random() * 2000
        //     });
        // }
    }
    
    update() {
        // Update all fish
        this.fishList.forEach(fish => fish.update());
    }
}

export default StreamScene;