import { GAME_HEIGHT, GAME_WIDTH, PADDLE_H, PADDLE_W, PADDLE_Y } from "../constants";
import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  private paddle!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    const paddle = this.add.rectangle(GAME_WIDTH / 2, PADDLE_Y, PADDLE_W, PADDLE_H, 0xffffff);

    // 挂载物理body，第二个参数 true = 静态body（挡板不被球推动，只反弹）
    this.physics.add.existing(paddle, true);

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      const x = Phaser.Math.Clamp(
        pointer.x,
        PADDLE_W / 2,
        GAME_WIDTH - PADDLE_W / 2,
      );

      paddle.x = x;
    });
  }
}
