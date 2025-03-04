class ControllerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ControllerScene' });

        this.fishDetected = false;
        this.shakeProgress = 0;
        this.shakeThreshold = 15;
        this.shakeMeterMax = 100; // Maximum value for the shake meter
    }

    preload() {
        // Load assets for the QR code scanner
    }

    create() {
        var resultContainer = document.getElementById('qr-reader-results');
        var lastResult, countResults = 0;

        function onScanSuccess(decodedText, decodedResult) {
            if (decodedText !== lastResult) {
                ++countResults;
                lastResult = decodedText;
                // Handle on success condition with the decoded message.
                console.log(`Scan result ${decodedText}`, decodedResult);
                showFishFoundMessage();
            }
        }

        var html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader", { fps: 10, qrbox: 250 });
        html5QrcodeScanner.render(onScanSuccess);

        // Function to show the "Fish Found" message
        const showFishFoundMessage = () => {
            const message = this.add.text(100, 100, 'Fish Found! /n Shake to fish!', { fontSize: '32px', fill: '#fff' });
            message.setOrigin(0.5);

            this.fishDetected = true;

            this.time.delayedCall(3000, () => {
                message.destroy();
                hideFishFoundMessage();
            });

            // Create the shake meter
            this.shakeMeter = this.add.graphics();
            this.shakeMeter.fillStyle(0x00ff00, 1);
            this.shakeMeter.fillRect(50, 200, 0, 20); // Initial width is 0
        };

        const resetFishProgress = () => {
            if (this.fishDetected) {
                this.fishDetected = false;
                this.shakeProgress = 0;
                this.shakeMeter.clear();
            }
        }

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
                        // Shake detected, increase shake progress
                        if (this.fishDetected) {
                            this.shakeProgress += 10; // Increase progress by 10 for each shake
                            this.shakeMeter.clear();
                            this.shakeMeter.fillStyle(0x00ff00, 1);
                            this.shakeMeter.fillRect(50, 200, this.shakeProgress, 20);

                            if (this.shakeProgress >= this.shakeMeterMax) {
                                // Shake meter is full, catch the fish
                                // Playroom.sendRpc('catchFish', { playerId: Playroom.myPlayer().id });
                                // alert('Fish caught!');

                                const message = this.add.text(100, 100, 'Fish caught!', { fontSize: '32px', fill: '#fff' });
                                message.setOrigin(0.5);
                                
                                resetFishProgress();
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
        // Update logic for the QR code scanner
    }
}

export default ControllerScene;