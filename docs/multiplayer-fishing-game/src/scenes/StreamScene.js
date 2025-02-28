class StreamScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StreamScene' });
    this.pond = null;
  }

  preload() {
    // Load any assets needed for the fishing pond
    this.load.image('pond', 'assets/images/pond.png');
    this.load.image('fish', 'assets/images/fish.png');
  }

  create() {
    // Create the fishing pond
    this.pond = new Pond(this);
    this.pond.create();

    // Add text to display instructions or information
    this.add.text(20, 20, 'Welcome to the Fishing Game!', { fontSize: '32px', fill: '#fff' });
    this.add.text(20, 60, 'Other players will control the fishing!', { fontSize: '24px', fill: '#fff' });
  }

  update() {
    // Update the pond and any fish interactions
    this.pond.update();
  }
}

export default StreamScene;