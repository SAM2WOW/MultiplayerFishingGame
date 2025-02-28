const gameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 480,
  parent: 'root',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: function() {
      // Load assets here
    },
    create: function() {
      // Initialize game objects here
    },
    update: function() {
      // Update game logic here
    }
  }
};

export default gameConfig;