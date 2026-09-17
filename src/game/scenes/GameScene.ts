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
  GAME_HEIGHT,
  INITIAL_LIVES,
} from "../constants";

export class GameScene extends Phaser.Scene {
  // 声明挡板
  private paddle!: Phaser.GameObjects.Rectangle;
  // 声明球
  private ball!: Phaser.GameObjects.Arc;
  // 可变状态（restart 时须在 create() 开头重置，见开发计划 3.4）
  private launched = false;
  private lives = INITIAL_LIVES;
  // 声明球的物理 body（create 中赋值）
  private ballBody!: Phaser.Physics.Arcade.Body;
  // 声明生命数文字
  private livesText!: Phaser.GameObjects.Text;

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
    // 初始化生命
    this.lives = INITIAL_LIVES;

    // 渲染文字
    this.livesText = this.add.text(10, 10, `剩余球数量：${this.lives}`, {
      fontSize: "24px",
      color: "#ffffff",
    });
    // 挂载物理body，第二个参数 true = 静态body（挡板不被球推动，只反弹）
    this.physics.add.existing(this.paddle, true);
    // 球是可动的
    this.physics.add.existing(this.ball);

    // 给球挂载物理引擎
    this.ballBody = this.ball.body as Phaser.Physics.Arcade.Body;
    this.ballBody.setCircle(BALL_R);
    this.ballBody.setBounce(1, 1);
    this.ballBody.enable = false;

    this.physics.add.collider(
      this.ball,
      this.paddle,
      this.hitPaddle,
      undefined,
      this,
    );

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
      if (!this.launched && this.lives > 0) this.launch();
    });
  }

  update() {
    // 未发射时球是手动贴挡板的，body 也没启用，不做反弹与落底检测
    if (!this.launched) return;

    // 左墙：越过左边界且正往左飞 → x 速度反转为正
    if (this.ball.x <= BALL_R && this.ballBody.velocity.x < 0) {
      this.ballBody.velocity.x = Math.abs(this.ballBody.velocity.x);
    }

    // 右墙：越过右边界且正往右飞 → x 速度反转为负
    if (this.ball.x >= GAME_WIDTH - BALL_R && this.ballBody.velocity.x > 0) {
      this.ballBody.velocity.x = -Math.abs(this.ballBody.velocity.x);
    }

    // 上墙：越过上边界且正往上飞 → y 速度反转为正（往下）
    if (this.ball.y <= BALL_R && this.ballBody.velocity.y < 0) {
      this.ballBody.velocity.y = Math.abs(this.ballBody.velocity.y);
    }

    // 底部：落底部扣除生命
    if (this.ball.y > GAME_HEIGHT + BALL_R) {
      this.lives--;
      this.launched = false;
      this.ball.x = this.paddle.x;
      this.ball.y = PADDLE_Y - PADDLE_H / 2 - BALL_R;
      this.ballBody.enable = false;
      // 更新文字
      this.livesText.setText(`剩余球数：${this.lives}`);

      // 命用完：显示游戏结束（只在落底时执行一次，不会每帧叠加）
      if (this.lives <= 0) {
        this.add
          .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "游戏结束", {
            fontSize: "48px",
            color: "#ffffff",
          })
          .setOrigin(0.5);
      }
    }
  }

  private launch(): void {
    this.ball.x = this.paddle.x;
    this.ball.y = PADDLE_Y - PADDLE_H / 2 - BALL_R;

    // 启动球的物理 body
    this.ballBody.enable = true;
    // 初始速度
    this.ballBody.setVelocity(BALL_SPEED_X, BALL_SPEED_Y);

    this.launched = true;
  }

  private hitPaddle(): void {
    this.ballBody.velocity.y = -Math.abs(this.ballBody.velocity.y);
  }
}
