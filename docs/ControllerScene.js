class ControllerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ControllerScene' });

        this.fishDetected = false;
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
            });
        };

        // Detect shake event
        let shakeThreshold = 15;
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

                    if (speed > shakeThreshold) {
                        // Shake detected, send RPC event
                        // Playroom.sendRpc('catchFish', { playerId: Playroom.myPlayer().id });
                        // for now just print to console
                        if (this.fishDetected) {
                            alert('Fish caught!');
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