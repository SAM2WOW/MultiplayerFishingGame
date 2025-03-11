class ControllerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ControllerScene' });

        this.fishDetected = false;
        this.shakeProgress = 0;
        this.shakeThreshold = 500;
        this.shakeMeterMax = 100; // Maximum value for the shake meter

        this.currentFish = null;
        this.playerData = null;

        // TODO: Fix issue when fish already caught when player catch RPC
    }

    create(data) {
        var resultContainer = document.getElementById('qr-reader-results');
        var lastResult, countResults = 0;

        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;

        // Access RPC from the data object
        const { RPC, myPlayer } = data;

        this.playerData = myPlayer();
        console.log('Player data:', this.playerData);

        // delay fire test
        this.time.delayedCall(3000, () => {
            RPC.call('testFishing', { fishID: 'test' }, RPC.Mode.ALL);
            console.log('Test RPC fired');
        });

        // Player Score UI
        //this.score = 0;
        //this.scoreText = this.add.text(10, 40, 'Score: 0', { fontSize: '24px', fill: '#ffca3a' });
        // Create top UI background
        let topUI = this.add.graphics();
        topUI.fillStyle(0xffffff, 1); // White background
        topUI.fillRect(0, 0, this.cameras.main.width, 50);

        // Display player icon (left side)
        let playerIcon = this.add.image(25, 25, 'playerIcon').setOrigin(0.5);
        playerIcon.setDisplaySize(40, 40);
        playerIcon.setTexture(this.playerData.state.profile.photo);

        // Display player name (next to icon)
        let playerName = this.add.text(50, 15, this.playerData.state.profile.name, 
            { fontSize: '20px', fill: '#000000' }); // Black text

        // Display player score (right side)
        this.scoreText = this.add.text(this.cameras.main.width - 100, 15, 'Score: 0', 
            { fontSize: '20px', fill: '#000000' }); // Black text

        // Adjust score position to stay aligned
        this.scoreText.setOrigin(1, 0);

        // Function to update the score
        this.updateScore = (points) => {
            this.score = points;
            this.scoreText.setText('Score: ' + this.score);
        };

        // Listen for score updates from host
        RPC.register('updateScore', (data) => {
            if (data.playerID === this.playerData.id) {
                this.updateScore(data.newScore);
            }
        });

        // display the player name on top left with a red color
        this.add.text(10, 10, this.playerData.state.profile.name, { fontSize: '24px', fill: '#ff0000' });

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


        //var html5QrcodeScanner = new Html5QrcodeScanner(
        //    "qr-reader", { fps: 10, qrbox: 250, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] });
        //html5QrcodeScanner.render(onScanSuccess);

        ///////////CHOOSE BACK-FACING CAMERA AUTOMATICALLY///////////
        const html5QrCode = new Html5Qrcode("qr-reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        // Function to start scanner with the correct camera
        const startScanner = (cameraId) => {
            html5QrCode.start(cameraId, config, onScanSuccess)
                .catch(err => {
                    console.error("Error starting scanner:", err);
                });
        };

        // Detect available cameras and select the back camera
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices = devices.filter(device => device.kind === "videoinput");
                
                // Try to find a back-facing camera
                let backCamera = videoDevices.find(device => device.label.toLowerCase().includes("back"));

                if (backCamera) {
                    console.log("Using back-facing camera:", backCamera.label);
                    startScanner(backCamera.deviceId);
                } else {
                    console.warn("No back camera found, using default.");
                    startScanner({ facingMode: "environment" });
                }
            })
            .catch(err => {
                console.error("Error detecting cameras:", err);
                startScanner({ facingMode: "environment" }); // Fallback
            });
        /////////////////////CAMERA SELECTION END//////////////////////
        

        // Function to show the "Fish Found" message
        this.startCatchingFish = () => {
            console.log('Fish detected!');
            const message = this.add.text(150, 100, 'Shake to fish!', { fontSize: '24px', fill: '#fff' });
            message.setOrigin(0.5);

            this.fishDetected = true;

            this.time.delayedCall(10000, () => {
                message.destroy();
                RPC.call('endCatching', { fishID: this.currentFish, success: false }, RPC.Mode.ALL);
                this.resetFishProgress();
            });

            // Create the shake meter
            this.shakeMeter = this.add.graphics();
            this.shakeMeter.fillStyle(0x00ff00, 1);
            const centerX = this.cameras.main.width / 2;
            const centerY = this.cameras.main.height / 2;
            this.shakeMeter.fillRect(centerX - this.shakeMeterMax / 2, centerY - 10, 0, 20); // Initial width is 0

            // make it outlined
            this.shakeMeter.lineStyle(2, 0x000000, 1);
            this.shakeMeter.strokeRect(centerX - this.shakeMeterMax / 2, centerY - 10, this.shakeMeterMax, 20);

            RPC.call('startCatching', { fishID: this.currentFish }, RPC.Mode.ALL);
        };

        this.resetFishProgress = () => {
            if (this.fishDetected) {
                this.fishDetected = false;
                this.shakeProgress = 0;
                this.shakeMeter.clear();
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

                    if (speed > this.shakeThreshold) {
                        // Shake detected, increase shake progress based on speed
                        if (this.fishDetected) {
                            this.shakeProgress += 15; // Increase progress based on speed

                            const centerX = this.cameras.main.width / 2;
                            const centerY = this.cameras.main.height / 2;
                            
                            this.shakeMeter.clear();
                            this.shakeMeter.fillStyle(0x00ff00, 1);
                            this.shakeMeter.fillRect(centerX - this.shakeMeterMax / 2, centerY - 10, this.shakeProgress, 20);

                            this.shakeMeter.lineStyle(2, 0x000000, 1);
                            this.shakeMeter.strokeRect(centerX - this.shakeMeterMax / 2, centerY - 10, this.shakeMeterMax, 20);

                            if (this.shakeProgress >= this.shakeMeterMax) {
                                // Shake meter is full, catch the fish
                                // const message = this.add.text(100, 100, 'Fish caught!', { fontSize: '32px', fill: '#fff' });
                                // message.setOrigin(0.5);
                                
                                this.resetFishProgress();

                                RPC.call('endCatching', { fishID: this.currentFish, success: true }, RPC.Mode.ALL);

                                // Update the score
                                this.updateScore(1);
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