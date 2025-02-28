const { insertCoin } = Playroom;
import StreamScene from './scenes/StreamScene.js';
import ControllerScene from './scenes/ControllerScene.js';
import gameConfig from './config/gameConfig.js';

window._USETEMPSTORAGE = true;

const config = {
  ...gameConfig,
  scene: isHost() ? StreamScene : ControllerScene,
};

// Insert Coin! Start the game.
insertCoin().then(() => {
  const game = new Phaser.Game(config);
});