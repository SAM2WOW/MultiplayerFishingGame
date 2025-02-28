import QRCode from 'qrcode';

class QRScanner {
  constructor() {
    this.scannedCode = '';
    this.initScanner();
  }

  initScanner() {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        video.srcObject = stream;
        video.setAttribute('playsinline', true);
        video.play();
        this.scanQRCode(video, context);
      })
      .catch(err => {
        console.error('Error accessing camera: ', err);
      });
  }

  scanQRCode(video, context) {
    const scan = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = QRCode.decode(imageData.data);

      if (code) {
        this.scannedCode = code;
        this.displayScannedCode();
        video.pause();
      } else {
        requestAnimationFrame(scan);
      }
    };

    requestAnimationFrame(scan);
  }

  displayScannedCode() {
    const codeDisplay = document.getElementById('scanned-code-display');
    if (codeDisplay) {
      codeDisplay.innerText = `Scanned QR Code: ${this.scannedCode}`;
    }
  }
}

export default QRScanner;