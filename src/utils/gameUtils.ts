import { Position, Direction, PowerUpType, Obstacle } from '../types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 10;

export const getRandomPosition = (excludePositions: Position[] = []): Position => {
  let position: Position;
  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (excludePositions.some(pos => pos.x === position.x && pos.y === position.y));
  return position;
};

export const isPositionEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

export const isValidMove = (newHead: Position, obstacles: Obstacle[], hasPhaseThrough: boolean): boolean => {
  // 检查边界
  if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
    return false;
  }
  
  // 如果有穿墙能力，跳过碰撞检测
  if (hasPhaseThrough) {
    return true;
  }
  
  // 检查是否撞到自己的身体 - 已禁用，蛇头可以穿过蛇身
  // if (snake.body.some(segment => isPositionEqual(segment, newHead))) {
  //   return false;
  // }
  
  // 检查是否撞到障碍物
  if (obstacles.some(obstacle => isPositionEqual(obstacle.position, newHead))) {
    return false;
  }
  
  return true;
};

export const getNextPosition = (head: Position, direction: Direction): Position => {
  switch (direction) {
    case 'UP':
      return { x: head.x, y: head.y - 1 };
    case 'DOWN':
      return { x: head.x, y: head.y + 1 };
    case 'LEFT':
      return { x: head.x - 1, y: head.y };
    case 'RIGHT':
      return { x: head.x + 1, y: head.y };
    default:
      return head;
  }
};

export const getOppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case 'UP': return 'DOWN';
    case 'DOWN': return 'UP';
    case 'LEFT': return 'RIGHT';
    case 'RIGHT': return 'LEFT';
  }
};

export const calculateScore = (baseScore: number, level: number, hasDoubleScore: boolean): number => {
  const multiplier = hasDoubleScore ? 2 : 1;
  return baseScore * level * multiplier;
};

export const calculateSpeed = (level: number, hasSlowMotion: boolean): number => {
  const baseSpeed = Math.max(INITIAL_SPEED - (level - 1) * SPEED_INCREMENT, 50);
  return hasSlowMotion ? baseSpeed * 2 : baseSpeed;
};

export const generateObstacles = (level: number, excludePositions: Position[]): Obstacle[] => {
  const obstacleCount = Math.min(Math.floor(level / 3), 8);
  const obstacles: Obstacle[] = [];
  const obstaclePositions: Position[] = [];
  
  for (let i = 0; i < obstacleCount; i++) {
    const position = getRandomPosition([...excludePositions, ...obstaclePositions]);
    const obstacle: Obstacle = {
      position,
      createdAt: Date.now()
    };
    obstacles.push(obstacle);
    obstaclePositions.push(position);
  }
  
  return obstacles;
};

// 计算两个位置之间的曼哈顿距离
export const getManhattanDistance = (pos1: Position, pos2: Position): number => {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
};

// 生成距离蛇头指定距离以外的障碍物
export const generateObstaclesAwayFromSnakeHead = (snakeHead: Position, minDistance: number, excludePositions: Position[]): Obstacle[] => {
  const obstacleCount = Math.min(1, 8); // 每次克隆1个障碍物
  const obstacles: Obstacle[] = [];
  const obstaclePositions: Position[] = [];
  
  for (let i = 0; i < obstacleCount; i++) {
    let position: Position;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
      position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      attempts++;
    } while (
      attempts < maxAttempts && (
        getManhattanDistance(position, snakeHead) < minDistance ||
        [...excludePositions, ...obstaclePositions].some(pos => isPositionEqual(pos, position))
      )
    );
    
    if (attempts < maxAttempts) {
      const obstacle: Obstacle = {
        position,
        createdAt: Date.now()
      };
      obstacles.push(obstacle);
      obstaclePositions.push(position);
    }
  }
  
  return obstacles;
};

export const getPowerUpDescription = (type: PowerUpType): string => {
  switch (type) {
    case 'slow-motion':
      return '慢动作模式';
    case 'invincible':
      return '无敌模式';
    case 'double-score':
      return '双倍得分';
    case 'phase-through':
      return '穿墙模式';
  }
};

export const getPowerUpColor = (type: PowerUpType): string => {
  switch (type) {
    case 'slow-motion':
      return 'bg-purple-400';
    case 'invincible':
      return 'bg-orange-400';
    case 'double-score':
      return 'bg-yellow-400';
    case 'phase-through':
      return 'bg-cyan-400';
  }
};