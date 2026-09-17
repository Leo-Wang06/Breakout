import Phaser from "phaser";
import {
  GAME_WIDTH,
  PADDLE_H,
  PADDLE_W,
  PADDLE_Y,
  PADDLE_COLOR,
  BALL_R,
  BALL_SPEED_X,
  BALL_SPEED_Y,
} from "../constants";

export class GameScene extends Phaser.Scene {
  // 声明挡板
  private paddle!: Phaser.GameObjects.Rectangle;
  // 声明球
  private ball!: Phaser.GameObjects.Arc;
  // 可变状态
  private launched = false;

  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    // 渲染挡板
    this.paddle = this.add.rectangle(
      GAME_WIDTH / 2,
      PADDLE_Y,
      PADDLE_W,
      PADDLE_H,
      PADDLE_COLOR,
    );

    // 渲染球
    this.ball = this.add.circle(
      GAME_WIDTH / 2,
      PADDLE_Y - PADDLE_H / 2 - BALL_R,
      BALL_R,
      PADDLE_COLOR,
    );

    // 初始化发射状态
    this.launched = false;

    // 挂载物理body，第二个参数 true = 静态body（挡板不被球推动，只反弹）
    this.physics.add.existing(this.paddle, true);
    // 球是可动的
    this.physics.add.existing(this.ball);

    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    body.setCircle(BALL_R);
    body.setBounce(1, 1);
    body.enable = false;

    // 挡板跟随指针移动
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      const x = Phaser.Math.Clamp(
        pointer.x,
        PADDLE_W / 2,
        GAME_WIDTH - PADDLE_W / 2,
      );

      this.paddle.x = x;
      // 还未发射，球的水平位置跟着挡板走
      if (!this.launched) {
        this.ball.x = this.paddle.x;
      }
    });
    // 监听点击发射
    this.input.on("pointerdown", () => {
      if (!this.launched) this.launch();
    });
  }

  private launch() {
    this.ball.x = this.paddle.x;
    this.ball.y = PADDLE_Y - PADDLE_H / 2 - BALL_R;

    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    // 启动球的物理 body
    body.enable = true;
    // 初始速度
    body.setVelocity(BALL_SPEED_X, BALL_SPEED_Y);

    this.launched = true;
  }
}
