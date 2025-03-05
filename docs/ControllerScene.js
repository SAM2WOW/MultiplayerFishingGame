class ControllerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ControllerScene' });

        this.fishDetected = false;
        this.shakeProgress = 0;
        this.shakeThreshold = 15;
        this.shakeMeterMax = 100; // Maximum value for the shake meter

        this.currentFish = null;
    }

    create(data) {
        var resultContainer = document.getElementById('qr-reader-results');
        var lastResult, countResults = 0;

        // Access RPC from the data object
        const { RPC } = data;

        // delay fire test
        this.time.delayedCall(3000, () => {
            RPC.call('testFishing', { fishID: 'test' }, RPC.Mode.ALL);
            console.log('Test RPC fired');
        });

        // fire a test RPC when player touch
        // this.input.on('pointerdown', () => {
        //     RPC.call('testFishing', { fishID: 'test' }, RPC
        //         .Mode.HOST);
            
        //     console.log('Test RPC fired');

        //     // draw a circle where player touched
        //     let pointer = this.input.activePointer;
        //     let circle = this.add.circle(pointer.x, pointer.y, 10, 0xff0000);
        //     this.time.delayedCall(500, () => {
        //         circle.destroy();
        //     });
            
        // });

        const onScanSuccess = (decodedText, decodedResult) => {
            if (!this.fishDetected) {
                ++countResults;
                lastResult = decodedText;
                // Handle on success condition with the decoded message.
                console.log(`Scan result ${decodedText}`, decodedResult);

                // only react when the text starts with fg
                // example: fg0, fg1
                if (decodedText.startsWith('fg')) {
                    // get the fish id
                    let fishID = parseInt(decodedText.substring(2));
                    console.log('Fish ID:', fishID);

                    this.currentFish = fishID;
                    this.startCatchingFish();
                } else {
                    console.log('Invalid fish ID');
                }
            }
        };

        var html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader", { fps: 10, qrbox: 250 });
        html5QrcodeScanner.render(onScanSuccess);

        // Function to show the "Fish Found" message
        this.startCatchingFish = () => {
            console.log('Fish detected!');
            const message = this.add.text(100, 100, 'Shake to fish!', { fontSize: '32px', fill: '#fff' });
            message.setOrigin(0.5);

            this.fishDetected = true;

            this.time.delayedCall(3000, () => {
                message.destroy();
                this.resetFishProgress();
            });

            // Create the shake meter
            this.shakeMeter = this.add.graphics();
            this.shakeMeter.fillStyle(0x00ff00, 1);
            this.shakeMeter.fillRect(50, 200, 0, 20); // Initial width is 0

            RPC.call('startCatching', { fishID: this.currentFish }, RPC.Mode.ALL);
        };

        this.resetFishProgress = () => {
            if (this.fishDetected) {
                this.fishDetected = false;
                this.shakeProgress = 0;
                this.shakeMeter.clear();

                RPC.call('endCatching', { fishID: this.currentFish, success: false }, RPC.Mode.ALL);
            }
        };

        // Detect shake event
        let lastUpdate = 0;
        let x = 0, y = 0, z = 0, lastX = 0, lastY = 0, lastZ = 0;

        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', (event) => {
                let acceleration = event.accelerationIncludingGravity;
                let currentTime = new Date().getTime();
                if ((currentTime - lastUpdate) > 100) {
                    let diffTime = currentTime - lastUpdate;
                    lastUpdate = currentTime;

                    x = acceleration.x;
                    y = acceleration.y;
                    z = acceleration.z;

                    let speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
                    let maxSpeed = 25;

                    // visualize how fast player shakes by drawing a reatangle bar on the top of canvas
                    // canvas is 300x300
                    // speed is 0-maxSpeed
                    this.shakeMeter.clear();
                    this.shakeMeter.fillStyle(0x00ff00, 1);
                    this.shakeMeter.fillRect(50, 200, speed, 20);

                    if (speed > this.shakeThreshold) {
                        // Shake detected, increase shake progress based on speed
                        if (this.fishDetected) {
                            this.shakeProgress += speed / maxSpeed; // Increase progress based on speed
                            // this.shakeMeter.clear();
                            // this.shakeMeter.fillStyle(0x00ff00, 1);
                            // this.shakeMeter.fillRect(50, 200, this.shakeProgress, 20);

                            if (this.shakeProgress >= this.shakeMeterMax) {
                                // Shake meter is full, catch the fish
                                const message = this.add.text(100, 100, 'Fish caught!', { fontSize: '32px', fill: '#fff' });
                                message.setOrigin(0.5);
                                
                                this.resetFishProgress();

                                // Trigger the RPC on the host only
                                RPC.call('endCatching', { fishID: this.currentFish, success: true }, RPC.Mode.HOST);
                            }
                        }
                    }

                    lastX = x;
                    lastY = y;
                    lastZ = z;
                }
            });
        }
    }

    update() {
        // draw a red circle where player mouse is
        // let pointer = this.input.activePointer;
        // let circle = this.add.circle(pointer.x, pointer.y, 10, 0xff0000);
        // this.time.delayedCall(500, () => {
        //     circle.destroy();
        // });

        

    }
}

export default ControllerScene;