import Fish from "./Fish.js";

class StreamScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StreamScene' });
        this.fishList = [];
        this.amountOfFish = 9;

        // dictionary of players and their scores
        this.players = {};

        this.gameStarted = false;
        this.gameTime = 120; // 120 seconds
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

        // load circle sprite for emitters
        this.load.image('circle', 'https://sam2wow.github.io/MultiplayerFishingGame/sprites/whitecircle.png');

        // load the bgm.mp3
        this.load.audio('bgm', 'https://sam2wow.github.io/MultiplayerFishingGame/sounds/bgm.mp3');

        // load the fish catch sound
        this.load.audio('catch', 'https://sam2wow.github.io/MultiplayerFishingGame/sounds/catch.mp3');
        this.load.audio('miss', 'https://sam2wow.github.io/MultiplayerFishingGame/sounds/miss.mp3');

        // load game sounds
        this.load.audio('ready', 'https://sam2wow.github.io/MultiplayerFishingGame/sounds/ready.mp3');
        this.load.audio('count', 'https://sam2wow.github.io/MultiplayerFishingGame/sounds/count.mp3');
        this.load.audio('go', 'https://sam2wow.github.io/MultiplayerFishingGame/sounds/go.mp3');
        this.load.audio('gameover', 'https://sam2wow.github.io/MultiplayerFishingGame/sounds/gameover.mp3');
    }
    
    create(data) {
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;
        
        // Add pond background
        const bg = this.add.sprite(width/2, height/2, 'background');
        bg.setDisplaySize(width, height);
        bg.setTint(0x2288cc);
        
        // add splash emitter
        this.splashEmitter = this.add.particles(width / 2, height / 2 ,'circle', {
            lifespan: 1000,
            speed: { min: 150, max: 250 },
            scale: { start: 0.8, end: 0 },
            gravityY: 150,
            blendMode: 'ADD',
            tint: 0x87CEEB, // Sky blue color
            emitting: false
        });

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

        // play ready sound
        this.sound.play('ready');

        // Create a timed event to count down and start the game
        this.time.addEvent({
            delay: 1000, // 1 second
            repeat: 3, // 3 times
            callback: () => {
            if (readyText.text === 'Ready') {
                readyText.setText('3');
                this.sound.play('count');
            } else if (readyText.text === '3') {
                readyText.setText('2');
                this.sound.play('count');
            } else if (readyText.text === '2') {
                readyText.setText('1');
                this.sound.play('count');
            } else {
                readyText.setText('Go!');
                this.sound.play('go');
                
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

                    // Add background music and make it not loop
                    this.sound.add('bgm', { loop: true, volume: 0.8 });
                    this.sound.play('bgm');

                    // play splash sound
                    this.sound.play('catch');

                }
                });
            }
            }
        });

        // Access RPC from the data object
        const { RPC, playerList } = data;

        console.log('Players:', playerList);

        // Store players id
        // players is a list
        // Store players in a dictionary
        playerList.forEach(player => {
            this.players[player.id] = { score: 0, name: player.state.profile.name, icon_url: player.state.profile.photo };
        });

        console.log('Players:', this.players);

        //////////////////PLAYER SCOREBOARD/////////////////////
        // Create scoreboard background with transparency
        this.scoreboard = this.add.graphics();
        this.scoreboard.fillStyle(0x000000, 0.5); // 50% opacity black
        this.scoreboard.fillRoundedRect(20, 20, 350, 200, 15); // Adjusted width

        // Scoreboard title
        this.scoreTitle = this.add.text(30, 30, 'Leaderboard', { fontSize: '28px', fill: '#ffffff', fontStyle: 'bold' });

        this.scoreEntries = {}; // Store player score text objects

        // Properly position player names in a single column
        let yOffset = 70; // Start position for the first player's name
        playerList.forEach((player) => {
            this.scoreEntries[player.id] = this.add.text(30, yOffset,
                `${player.state.profile.name}: 0`, { fontSize: '24px', fill: '#ffca3a' }
            );
            yOffset += 35; // Move down for the next player
        });

        // Update scores dynamically
        RPC.register('updateScore', (data) => {
            this.players[data.playerID].score = data.newScore;
            this.scoreEntries[data.playerID].setText(
                `${this.players[data.playerID].name}: ${data.newScore}`
            );
        });

        ////////////END SCOREBOARD////////////////

        this.gameOverRPC = () => {
            // call the RPC for gameOver
            RPC.call('gameOver', { playerID: "0000" }, RPC.Mode.ALL);
        };

        // add test case
        RPC.register('testFishing', (data, caller) => {
            console.log("player info: ", caller);
            console.log('Test RPC:', data);
        });

        // handle fish catching
        RPC.register('startCatching', (data, caller) => {
            if (!this.gameStarted) {
                return;
            }

            console.log("player info: ", caller);
            console.log(`Player ${caller.id} start catch fish #${data.fishID}`);
            // players[data.victimId].setState("dead", true);

            // find the fish and call the start catching function inside fish class
            // fish id is just the index of the fish
            this.fishList[data.fishID].startCatchingFish();
        });

        RPC.register('endCatching', (data, caller) => {
            if (!this.gameStarted) {
                return;
            }

            console.log(`Player ${caller.id} end catch fish #${data.fishID}: ${data.success ? 'caught' : 'missed'}`);
            // players[data.victimId].setState("dead", false);

            if (data.success) {
                this.players[caller.id].score += 1;

                // Update UI and send new score to players
                RPC.call('updateScore', { playerID: caller.id, newScore: this.players[caller.id].score }, RPC.Mode.ALL);
                
                // play catch sound 2d at the fish position
                const fishPosition = this.fishList[data.fishID].sprite.getCenter();
                this.sound.play('catch', { volume: 1.0, loop: false, delay: 0, spatial: true, x: fishPosition.x, y: fishPosition.y });

                // Create splash particle effect
                this.splashEmitter.setPosition(fishPosition.x, fishPosition.y);
                this.splashEmitter.explode(4 + Math.floor(Math.random() * 5));

                // Display catch text at fish position
                const catchText = this.add.text(fishPosition.x, fishPosition.y, `Caught by ${this.players[caller.id].name}!`, {
                    fontSize: '24px',
                    fill: '#ffca3a'
                }).setOrigin(0.5);

                // Destroy the text after 3 seconds
                this.time.addEvent({
                    delay: 2000,
                    callback: () => {
                        catchText.destroy();
                    }
                });
            } else {
                // play miss sound at fish position
                const fishPosition = this.fishList[data.fishID].sprite.getCenter();
                this.sound.play('miss', { volume: 1.0, loop: false, delay: 0, spatial: true, x: fishPosition.x, y: fishPosition.y });

                // Create a puff cloud particle effect
                // random amount from 4 - 8
                this.splashEmitter.setPosition(fishPosition.x, fishPosition.y);
                this.splashEmitter.explode(4 + Math.floor(Math.random() * 5));
            }

            // BUG: the print statement was being interpreted as print screen on browser
            // changed to console.log for now
            //print('Player scores:', this.players);
            console.log('Player scores:', this.players);

            this.fishList[data.fishID].endCatchingFish(data.success);
        });

        
    }

    update(time, delta) {
        // Update all fish
        this.fishList.forEach(fish => fish.update(time, delta));

        // Update game time
        if (this.gameStarted) {
            this.gameTime -= delta / 1000;

            if (this.gameTime <= 0) {
                this.gameStarted = false;

                console.log('Game over!');
                this.timeText.destroy();

                // play game over sound
                this.sound.play('gameover');

                // remove all the fish
                this.fishList.forEach(fish => fish.destroy());
                this.fishList = [];

                const width = this.sys.game.config.width;
                const height = this.sys.game.config.height;

                // Display "GAME OVER!" text
                const gameOverText = this.add.text(width / 2, height / 2 - 100, 'GAME OVER!', {
                    fontSize: '64px',
                    fill: '#ffffff'
                }).setOrigin(0.5);

                // Sort players by score
                const sortedPlayers = Object.values(this.players).sort((a, b) => b.score - a.score);

                // Display each player's score
                sortedPlayers.forEach((player, index) => {
                    this.add.text(width / 2, height / 2 - 50 + index * 30, `${index + 1}. ${player.name}: ${player.score}`, {
                        fontSize: `${36 - index * 2}px`,
                        fill: '#00ffff'
                    }).setOrigin(0.5);
                });

                // also display the photo next to their name (this is dataURL)
                // sortedPlayers.forEach((player, index) => {
                //     let img = new Image();
                //     img.src = player.icon_url;
                //     img.width = 50;
                //     img.height = 50;
                //     this.add.image(width / 2 - 100, height / 2 - 50 + index * 30, img);
                // });

                // Display restart message
                const restartText = this.add.text(width / 2, height / 2 + 200, 'Game restarts in 20 seconds', {
                    fontSize: '24px',
                    fill: '#ffffff'
                }).setOrigin(0.5);

                
                // call the RPC
                this.gameOverRPC();

                // Restart game after 20 seconds
                this.time.addEvent({
                    delay: 20000,
                    callback: () => {
                        // location.reload();
                        //open the webpage instead
                        // window.open('https://sam2wow.github.io/MultiplayerFishingGame?restart=true', '_self');
                        window.open('https://sam2wow.github.io/MultiplayerFishingGame', '_self');
                    }
                });
                
            } else {
                this.timeText.setText(`Time: ${this.gameTime.toFixed(1)}s`);
            }
        }
    }
}

export default StreamScene;