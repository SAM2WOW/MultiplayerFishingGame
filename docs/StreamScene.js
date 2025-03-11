import Fish from "./Fish.js";

class StreamScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StreamScene' });
        this.fishList = [];
        this.amountOfFish = 9;

        this.players = [];

        this.gameStarted = false;
        this.gameTime = 30; // 30 seconds
    }

    preload() {
        // Load assets
        // this.load.image('background', '/MultiplayerFishingGame/sprites/pond.webp');
        this.load.image('background', 'https://sam2wow.github.io/MultiplayerFishingGame/sprites/pond.jpg');
        // this.load.image('ripple', '/api/placeholder/128/128');

        // Load assets
        // this.load.image('fish', '/MultiplayerFishingGame/sprites/fish.webp');
        this.load.image('fish', 'https://sam2wow.github.io/MultiplayerFishingGame/sprites/fish.webp');

        // load all the qr codes
        for (let i = 0; i < this.amountOfFish; i++) {
            // this.load.image(`fish_${i}`, `/MultiplayerFishingGame/sprites/fish_illus/fish_${i}.png`);
            this.load.image(`fish_${i}`, `https://sam2wow.github.io/MultiplayerFishingGame/sprites/fish_illus/fish_${i}.png`);
        }
    }
    
    create(data) {
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
        
        // Add "Ready" text in the center
        const readyText = this.add.text(width / 2, height / 2, 'Ready', {
            fontSize: '64px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Create a timed event to count down and start the game
        this.time.addEvent({
            delay: 1000, // 1 second
            repeat: 3, // 3 times
            callback: () => {
            if (readyText.text === 'Ready') {
                readyText.setText('3');
            } else if (readyText.text === '3') {
                readyText.setText('2');
            } else if (readyText.text === '2') {
                readyText.setText('1');
            } else {
                readyText.setText('Go!');
                this.time.addEvent({
                delay: 500, // 0.5 second
                callback: () => {
                    readyText.destroy();

                    // Add game timer text
                    this.timeText = this.add.text(width / 2, height / 2, 'Time: 30s', {
                        fontSize: '36px',
                        fill: '#00ffff'
                    }).setOrigin(0.5);

                    // Add fish
                    for (let i = 0; i < this.amountOfFish; i++) {
                        const x = Math.random() * width;
                        const y = Math.random() * height;
                        new Fish(this, x, y, i);
                    }

                    // start the game
                    this.gameStarted = true;

                }
                });
            }
            }
        });

        // Add fish
        // for (let i = 0; i < this.amountOfFish; i++) {
        //     const x = Math.random() * width;
        //     const y = Math.random() * height;
        //     new Fish(this, x, y, i);
        // }
        
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

        // Access RPC from the data object
        const { RPC } = data;

        // add test case
        RPC.register('testFishing', (data, caller) => {
            console.log('Test RPC:', data);
        });

        // handle fish catching
        RPC.register('startCatching', (data, caller) => {
            console.log(`Player ${caller.id} start catch fish #${data.fishID}`);
            // players[data.victimId].setState("dead", true);

            // find the fish and call the start catching function inside fish class
            // fish id is just the index of the fish
            this.fishList[data.fishID].startCatchingFish();
        });

        RPC.register('endCatching', (data, caller) => {
            console.log(`Player ${caller.id} end catch fish #${data.fishID}: ${data.success ? 'caught' : 'missed'}`);
            // players[data.victimId].setState("dead", false);

            this.fishList[data.fishID].endCatchingFish(data.success);
        });
    }
    
    update(time, delta) {
        // Update all fish
        this.fishList.forEach(fish => fish.update(time, delta));

        // Update game time
        if (this.gameStarted) {
            this.gameTime -= delta / 1000;

            this.timeText.setText(`Time: ${this.gameTime.toFixed(1)}s`);
            
            if (this.gameTime <= 0) {
                console.log('Game over!');
                this.gameStarted = false;
            }
        }
    }
}

export default StreamScene;