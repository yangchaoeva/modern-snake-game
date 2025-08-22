export interface Position {
  x: number;
  y: number;
}

export interface Snake {
  body: Position[];
  direction: Direction;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type CellType = 'empty' | 'snake-head' | 'snake-body' | 'food' | 'special-food' | 'obstacle' | 'power-up' | 'snake1-head' | 'snake1-body' | 'snake2-head' | 'snake2-body';

export type GameMode = 'single' | 'multi';

export interface PlayerSnake extends Snake {
  id: 'player1' | 'player2';
  score: number;
  level: number;
  isAlive: boolean;
  color: 'green' | 'pink';
}

export interface Obstacle {
  position: Position;
  createdAt: number;
}

export interface GameState {
  gameMode: GameMode;
  // 单人模式属性
  snake: Snake;
  score: number;
  level: number;
  // 双人模式属性
  players: PlayerSnake[];
  // 共用属性
  foods: Position[];
  specialFood: Position | null;
  powerUps: Position[];
  obstacles: Obstacle[];
  gameStatus: 'playing' | 'paused' | 'game-over' | 'menu';
  speed: number;
  powerUpActive: PowerUpType | null;
  powerUpTimer: number;
}

export type PowerUpType = 'slow-motion' | 'invincible' | 'double-score' | 'phase-through';

export interface PowerUp {
  type: PowerUpType;
  position: Position;
  duration: number;
}