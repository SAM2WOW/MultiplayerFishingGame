import Phaser from 'phaser';

export default class Pond {
  constructor(scene) {
    this.scene = scene;
    this.fishGroup = this.scene.physics.add.group();
    this.createPond();
  }

  createPond() {
    // Create the pond background
    this.scene.add.rectangle(400, 300, 800, 600, 0x1e90ff); // Example color for the pond

    // Create fish
    for (let i = 0; i < 5; i++) {
      this.addFish();
    }
  }

  addFish() {
    const fish = this.scene.physics.add.image(
      Phaser.Math.Between(100, 700),
      Phaser.Math.Between(100, 500),
      'fish' // Assuming 'fish' is a preloaded image key
    );
    fish.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    fish.setBounce(1);
    fish.setCollideWorldBounds(true);
    this.fishGroup.add(fish);
  }

  update() {
    // Update fish movement or interactions here if needed
    this.fishGroup.children.iterate(fish => {
      if (fish.x < 0 || fish.x > 800 || fish.y < 0 || fish.y > 600) {
        fish.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
      }
    });
  }
}