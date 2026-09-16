import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 700, 500, 0xd97757)
      .setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "我是测试文字", {
      fontSize: "24px",
      color: "#ffffff",
    });

    

  }
}
