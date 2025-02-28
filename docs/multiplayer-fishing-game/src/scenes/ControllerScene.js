import Phaser from 'phaser';
import QRScanner from '../components/QRScanner';

export default class ControllerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ControllerScene' });
    this.qrScanner = null;
    this.scannedCodeText = null;
  }

  preload() {
    // Load any assets needed for the controller scene here
  }

  create() {
    this.add.text(20, 20, 'Controller Interface', { fontSize: '32px', fill: '#fff' });

    // Initialize QR Scanner
    this.qrScanner = new QRScanner(this);
    this.qrScanner.init();

    // Display scanned QR code
    this.scannedCodeText = this.add.text(20, 100, 'Scanned QR Code: None', { fontSize: '24px', fill: '#fff' });

    // Set up joystick controls
    const joystick = nipplejs.create({
      zone: document.getElementById('joystick'),
      mode: 'static',
      position: { left: '50%', bottom: '20%' },
      color: 'white',
      size: 100,
    });

    joystick.on('move', (evt, data) => {
      const direction = data.direction ? data.direction.angle : null;
      myPlayer().setState('dir', direction);
    });

    joystick.on('end', () => {
      myPlayer().setState('dir', undefined);
    });
  }

  update() {
    // Update logic for the controller scene
    const scannedCode = this.qrScanner.getScannedCode();
    if (scannedCode) {
      this.scannedCodeText.setText(`Scanned QR Code: ${scannedCode}`);
    }
  }
}