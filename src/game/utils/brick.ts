import Phaser from "phaser";
import {
  BRICK_COLORS,
  BRICK_GAP,
  BRICK_H,
  BRICK_W,
  BRICKS_TOP,
  GAME_WIDTH,
} from "../constants";
import type { Level } from "../data/levels";

// 解析结果：砖块组 + 砖块总数（总数供 GameScene 记 remaining，步骤 6 判胜用）
export interface BrickWall {
  group: Phaser.GameObjects.Group;
  total: number;
}

// 布局数据 → 砖块对象：根据关卡数据 + 常量算出每块砖的坐标/颜色，逐个挂静态 body
export function buildBricks(scene: Phaser.Scene, level: Level): BrickWall {
  const group = scene.add.group();

  // 整面墙总宽 = 砖块宽 + 砖缝，算出第一列砖块的中心 x，让墙在画布里水平居中
  const wallWidth = level.cols * BRICK_W + (level.cols - 1) * BRICK_GAP;
  const startX = (GAME_WIDTH - wallWidth) / 2 + BRICK_W / 2;

  for (let row = 0; row < level.rows; row++) {
    for (let col = 0; col < level.cols; col++) {
      const x = startX + col * (BRICK_W + BRICK_GAP);
      const y = BRICKS_TOP + row * (BRICK_H + BRICK_GAP);
      const color = BRICK_COLORS[level.rowColors[row]];

      const brick = scene.add.rectangle(x, y, BRICK_W, BRICK_H, color);
      // 静态 body：砖块不被球推动，只做反弹
      scene.physics.add.existing(brick, true);
      group.add(brick);
    }
  }

  return { group, total: level.rows * level.cols };
}
