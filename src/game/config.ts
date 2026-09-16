import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";
import { GAME_HEIGHT, GAME_WIDTH, BACKGROUND_COLOR } from "./constants";
export const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "app",
  backgroundColor: BACKGROUND_COLOR,
  scene: [GameScene],
  physics: { default: "arcade", arcade: { gravity: { x : 0 ,y: 0 }, debug: false } },
};
