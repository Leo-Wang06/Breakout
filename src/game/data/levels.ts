import { COLS, ROWS } from "../constants";

// 关卡纯数据：只描述"有几行几列、每行什么颜色"，
// 不含任何运行时状态（score/lives/remaining 都不得放这里，见开发计划 3.1）
export interface Level {
  rows: number;
  cols: number;
  // 每行砖块的颜色索引，指向 constants 里的 BRICK_COLORS
  rowColors: number[];
}

export const LEVEL_1: Level = {
  rows: ROWS,
  cols: COLS,
  rowColors: [0, 1, 2, 3, 4],
};
