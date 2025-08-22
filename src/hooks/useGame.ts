import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Direction, Position, PowerUpType, Obstacle, PlayerSnake } from '../types';
import {
  GRID_SIZE,
  getRandomPosition,
  isPositionEqual,
  isValidMove,
  getNextPosition,
  getOppositeDirection,
  calculateScore,
  calculateSpeed,
  generateObstacles,
  generateObstaclesAwayFromSnakeHead,
  getPowerUpColor
} from '../utils/gameUtils';

const POWER_UP_TYPES: PowerUpType[] = ['slow-motion', 'invincible', 'double-score', 'phase-through'];

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialSnake = {
      body: [{ x: 10, y: 10 }],
      direction: 'RIGHT' as Direction
    };
    
    return {
      gameMode: 'single',
      snake: initialSnake,
      score: 0,
      level: 1,
      players: [],
      foods: [getRandomPosition(initialSnake.body)],
      specialFood: null,
      powerUps: [],
      obstacles: [],
      gameStatus: 'menu',
      speed: 150,
      powerUpActive: null,
      powerUpTimer: 0
    };
  });
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const powerUpTimerRef = useRef<NodeJS.Timeout | null>(null);
  const obstacleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const obstacleCleanupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const foodTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const resetGame = useCallback(() => {
    setGameState(prev => {
      if (prev.gameMode === 'multi') {
        // 双人模式重置
        const player1: PlayerSnake = {
          id: 'player1',
          body: [{ x: 8, y: 10 }],
          direction: 'RIGHT' as Direction,
          score: 0,
          level: 1,
          isAlive: true,
          color: 'green'
        };
        
        const player2: PlayerSnake = {
          id: 'player2',
          body: [{ x: 12, y: 10 }],
          direction: 'LEFT' as Direction,
          score: 0,
          level: 1,
          isAlive: true,
          color: 'pink'
        };
        
        const allBodies = [...player1.body, ...player2.body];
        
        return {
          gameMode: 'multi',
          snake: { body: [], direction: 'RIGHT' }, // 单人模式的蛇，双人模式下不使用
          score: 0,
          level: 1,
          players: [player1, player2],
          foods: [getRandomPosition(allBodies)],
          specialFood: null,
          powerUps: [],
          obstacles: [],
          gameStatus: 'playing',
          speed: 150,
          powerUpActive: null,
          powerUpTimer: 0
        };
      } else {
        // 单人模式重置
        const initialSnake = {
          body: [{ x: 10, y: 10 }],
          direction: 'RIGHT' as Direction
        };
        
        return {
          gameMode: 'single',
          snake: initialSnake,
          score: 0,
          level: 1,
          players: [],
          foods: [getRandomPosition(initialSnake.body)],
          specialFood: null,
          powerUps: [],
          obstacles: [],
          gameStatus: 'playing',
          speed: 150,
          powerUpActive: null,
          powerUpTimer: 0
        };
      }
    });
  }, []);
  
  const activatePowerUp = useCallback((type: PowerUpType) => {
    setGameState(prev => ({
      ...prev,
      powerUpActive: type,
      powerUpTimer: 20000 // 20秒持续时间
    }));
    
    // 设置道具计时器
    if (powerUpTimerRef.current) {
      clearTimeout(powerUpTimerRef.current);
    }
    
    powerUpTimerRef.current = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        powerUpActive: null,
        powerUpTimer: 0
      }));
    }, 20000);
  }, []);

  const moveMultiPlayerSnakes = useCallback((prevState: GameState): GameState => {
    const { players, foods, specialFood, powerUps, obstacles } = prevState;
    let newFoods = [...foods];
    let newSpecialFood = specialFood;
    let newPowerUps = [...powerUps];
    let updatedPlayers = [...players];
    
    // 移动每条活着的蛇
    updatedPlayers = updatedPlayers.map(player => {
      if (!player.isAlive) return player;
      
      const head = player.body[0];
      const newHead = getNextPosition(head, player.direction);
      
      // 检查边界碰撞
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        return { ...player, isAlive: false };
      }
      
      // 检查与障碍物碰撞
      if (obstacles.some(obstacle => isPositionEqual(obstacle.position, newHead))) {
        return { ...player, isAlive: false };
      }
      
      // 检查与自己身体碰撞 - 已禁用，蛇头可以穿过蛇身
      // if (player.body.some(segment => isPositionEqual(segment, newHead))) {
      //   return { ...player, isAlive: false };
      // }
      
      // 检查与对方蛇身体碰撞
      const otherPlayer = players.find(p => p.id !== player.id);
      if (otherPlayer && otherPlayer.isAlive && otherPlayer.body.some(segment => isPositionEqual(segment, newHead))) {
        return { ...player, isAlive: false };
      }
      
      let newBody = [newHead, ...player.body];
      let newScore = player.score;
      let newLevel = player.level;
      let ateFood = false;
      
      // 检查是否吃到普通食物
      const eatenFoodIndex = newFoods.findIndex(food => isPositionEqual(newHead, food));
      if (eatenFoodIndex !== -1) {
        ateFood = true;
        const basePoints = 10;
        newScore += calculateScore(basePoints, newLevel, false);
        newFoods = newFoods.filter((_, index) => index !== eatenFoodIndex);
        
        // 可能生成特殊食物
        if (!newSpecialFood) {
          const allBodies = updatedPlayers.flatMap(p => p.body);
          const obstaclePositions = obstacles.map(obs => obs.position);
          const excludePositions = [...allBodies, ...obstaclePositions, ...newPowerUps, ...newFoods];
          if (Math.random() < 0.2) {
            newSpecialFood = getRandomPosition(excludePositions);
          }
        }
      }
      
      // 检查是否吃到特殊食物
      if (newSpecialFood && isPositionEqual(newHead, newSpecialFood)) {
        ateFood = true;
        const basePoints = 50;
        newScore += calculateScore(basePoints, newLevel, false);
        newSpecialFood = null;
      }
      
      // 检查是否吃到道具
      const powerUpIndex = newPowerUps.findIndex(powerUp => isPositionEqual(newHead, powerUp));
      if (powerUpIndex !== -1) {
        ateFood = true;
        newPowerUps = newPowerUps.filter((_, index) => index !== powerUpIndex);
        const randomPowerUp = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
        activatePowerUp(randomPowerUp);
      }
      
      // 如果没有吃到食物，移除尾巴
      if (!ateFood) {
        newBody = newBody.slice(0, -1);
      }
      
      // 检查是否升级
      if (newScore >= newLevel * 100) {
        newLevel = newLevel + 1;
      }
      
      return {
        ...player,
        body: newBody,
        score: newScore,
        level: newLevel
      };
    });
    
    // 处理死亡的蛇，将其身体转换为特殊食物
    const deadPlayers = updatedPlayers.filter(player => !player.isAlive && players.find(p => p.id === player.id)?.isAlive);
    deadPlayers.forEach(deadPlayer => {
      const originalPlayer = players.find(p => p.id === deadPlayer.id);
      if (originalPlayer?.isAlive) {
        // 将死亡蛇的身体转换为特殊食物
        originalPlayer.body.forEach(segment => {
          if (!newFoods.some(food => isPositionEqual(food, segment))) {
            newFoods.push(segment);
          }
        });
      }
    });
    
    // 检查游戏是否结束
    const alivePlayers = updatedPlayers.filter(player => player.isAlive);
    if (alivePlayers.length === 0) {
      const playerScores = updatedPlayers.map(p => p.score);
      const finalScore = playerScores.length > 0 ? Math.max(...playerScores) : 0;
      return {
        ...prevState,
        players: updatedPlayers,
        foods: newFoods,
        specialFood: newSpecialFood,
        powerUps: newPowerUps,
        score: finalScore,
        gameStatus: 'game-over'
      };
    }
    
    return {
      ...prevState,
      players: updatedPlayers,
      foods: newFoods,
      specialFood: newSpecialFood,
      powerUps: newPowerUps
    };
  }, [activatePowerUp]);
  
  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: prev.gameStatus === 'paused' ? 'playing' : 'paused'
    }));
  }, []);

  const goToMenu = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'menu'
    }));
  }, []);

  const startSinglePlayer = useCallback(() => {
    const initialSnake = {
      body: [{ x: 10, y: 10 }],
      direction: 'RIGHT' as Direction
    };
    
    setGameState({
      gameMode: 'single',
      snake: initialSnake,
      score: 0,
      level: 1,
      players: [],
      foods: [getRandomPosition(initialSnake.body)],
      specialFood: null,
      powerUps: [],
      obstacles: [],
      gameStatus: 'playing',
      speed: 150,
      powerUpActive: null,
      powerUpTimer: 0
    });
  }, []);

  const startMultiPlayer = useCallback(() => {
    const player1: PlayerSnake = {
      id: 'player1',
      body: [{ x: 8, y: 10 }],
      direction: 'RIGHT' as Direction,
      score: 0,
      level: 1,
      isAlive: true,
      color: 'green'
    };
    
    const player2: PlayerSnake = {
      id: 'player2',
      body: [{ x: 12, y: 10 }],
      direction: 'LEFT' as Direction,
      score: 0,
      level: 1,
      isAlive: true,
      color: 'pink'
    };
    
    const allBodies = [...player1.body, ...player2.body];
    
    setGameState({
      gameMode: 'multi',
      snake: { body: [], direction: 'RIGHT' }, // 单人模式的蛇，双人模式下不使用
      score: 0,
      level: 1,
      players: [player1, player2],
      foods: [getRandomPosition(allBodies)],
      specialFood: null,
      powerUps: [],
      obstacles: [],
      gameStatus: 'playing',
      speed: 150,
      powerUpActive: null,
      powerUpTimer: 0
    });
  }, []);
  
  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      
      if (prev.gameMode === 'single') {
        // 防止反向移动
        if (getOppositeDirection(newDirection) === prev.snake.direction) {
          return prev;
        }
        
        return {
          ...prev,
          snake: {
            ...prev.snake,
            direction: newDirection
          }
        };
      }
      
      return prev;
    });
  }, []);

  const changePlayerDirection = useCallback((playerId: 'player1' | 'player2', newDirection: Direction) => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing' || prev.gameMode !== 'multi') return prev;
      
      const updatedPlayers = prev.players.map(player => {
        if (player.id === playerId && player.isAlive) {
          // 防止反向移动
          if (getOppositeDirection(newDirection) === player.direction) {
            return player;
          }
          return {
            ...player,
            direction: newDirection
          };
        }
        return player;
      });
      
      return {
        ...prev,
        players: updatedPlayers
      };
    });
  }, []);
  
  const generateSpecialFood = useCallback((excludePositions: Position[]): Position | null => {
    // 20% 概率生成特殊食物
    if (Math.random() < 0.2) {
      return getRandomPosition(excludePositions);
    }
    return null;
  }, []);
  
  const generatePowerUp = useCallback((excludePositions: Position[]): Position[] => {
    // 15% 概率生成道具
    if (Math.random() < 0.15) {
      return [{
        x: getRandomPosition(excludePositions).x,
        y: getRandomPosition(excludePositions).y
      }];
    }
    return [];
  }, []);
  
  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      
      if (prev.gameMode === 'multi') {
        return moveMultiPlayerSnakes(prev);
      }
      
      const { snake, foods, specialFood, powerUps, obstacles, score, level } = prev;
      const head = snake.body[0];
      const newHead = getNextPosition(head, snake.direction);
      
      // 检查是否有穿墙能力
      const hasPhaseThrough = prev.powerUpActive === 'phase-through';
      const hasInvincible = prev.powerUpActive === 'invincible';
      
      // 边界处理 - 如果有穿墙能力，允许穿越边界
      let finalNewHead = newHead;
      if (hasPhaseThrough) {
        if (newHead.x < 0) finalNewHead = { ...newHead, x: GRID_SIZE - 1 };
        if (newHead.x >= GRID_SIZE) finalNewHead = { ...newHead, x: 0 };
        if (newHead.y < 0) finalNewHead = { ...newHead, y: GRID_SIZE - 1 };
        if (newHead.y >= GRID_SIZE) finalNewHead = { ...newHead, y: 0 };
      }
      
      // 检查碰撞
      if (!hasInvincible && !isValidMove(finalNewHead, snake, obstacles, hasPhaseThrough)) {
        return {
          ...prev,
          gameStatus: 'game-over'
        };
      }
      
      let newBody = [finalNewHead, ...snake.body];
      let newScore = score;
      let newLevel = level;
      let newFoods = foods;
      let newSpecialFood = specialFood;
      let newPowerUps = powerUps;
      let ateFood = false;
      
      // 检查是否吃到普通食物
      const eatenFoodIndex = foods.findIndex(food => isPositionEqual(finalNewHead, food));
      if (eatenFoodIndex !== -1) {
        ateFood = true;
        const basePoints = 10;
        const hasDoubleScore = prev.powerUpActive === 'double-score';
        newScore += calculateScore(basePoints, level, hasDoubleScore);
        
        // 移除被吃掉的食物
        newFoods = foods.filter((_, index) => index !== eatenFoodIndex);
        
        // 可能生成特殊食物
        if (!specialFood) {
          const obstaclePositions = obstacles.map(obs => obs.position);
          const excludePositions = [...newBody, ...obstaclePositions, ...powerUps, ...newFoods];
          newSpecialFood = generateSpecialFood(excludePositions);
        }
        
        // 可能生成道具
        if (powerUps.length === 0) {
          const obstaclePositions = obstacles.map(obs => obs.position);
          const excludeAll = [...newBody, ...obstaclePositions, ...newFoods];
          if (newSpecialFood) excludeAll.push(newSpecialFood);
          newPowerUps = generatePowerUp(excludeAll);
        }
      }
      
      // 检查是否吃到特殊食物
      if (specialFood && isPositionEqual(finalNewHead, specialFood)) {
        ateFood = true;
        const basePoints = 50;
        const hasDoubleScore = prev.powerUpActive === 'double-score';
        newScore += calculateScore(basePoints, level, hasDoubleScore);
        newSpecialFood = null;
      }
      
      // 检查是否吃到道具
      const powerUpIndex = powerUps.findIndex(powerUp => isPositionEqual(finalNewHead, powerUp));
      if (powerUpIndex !== -1) {
        ateFood = true;
        newPowerUps = powerUps.filter((_, index) => index !== powerUpIndex);
        
        // 激活随机道具
        const randomPowerUp = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
        activatePowerUp(randomPowerUp);
      }
      
      // 如果没有吃到食物，移除尾巴
      if (!ateFood) {
        newBody = newBody.slice(0, -1);
      }
      
      // 检查是否升级
      if (newScore >= level * 100) {
        newLevel = level + 1;
        
        // 生成新的障碍物
        const excludePositions = [...newBody, ...newFoods, ...newPowerUps];
        if (newSpecialFood) excludePositions.push(newSpecialFood);
        const newObstacles = generateObstaclesAwayFromSnakeHead(newBody[0], 7, excludePositions);
        
        return {
          ...prev,
          snake: { ...snake, body: newBody },
          foods: newFoods,
          specialFood: newSpecialFood,
          powerUps: newPowerUps,
          obstacles: newObstacles,
          score: newScore,
          level: newLevel,
          speed: calculateSpeed(newLevel, prev.powerUpActive === 'slow-motion')
        };
      }
      
      return {
        ...prev,
        snake: { ...snake, body: newBody },
        foods: newFoods,
        specialFood: newSpecialFood,
        powerUps: newPowerUps,
        score: newScore,
        level: newLevel
      };
    });
  }, [generateSpecialFood, generatePowerUp, activatePowerUp]);
  
  // 游戏循环
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      const speed = calculateSpeed(gameState.level, gameState.powerUpActive === 'slow-motion');
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.gameStatus, gameState.level, gameState.powerUpActive, moveSnake]);
  
  // 食物自动刷新机制 - 每秒生成新食物
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      foodTimerRef.current = setInterval(() => {
        setGameState(prev => {
          const obstaclePositions = prev.obstacles.map(obs => obs.position);
          let allBodies: Position[] = [];
          
          if (prev.gameMode === 'single') {
            allBodies = prev.snake.body;
          } else if (prev.gameMode === 'multi') {
            allBodies = prev.players.flatMap(player => player.body);
          }
          
          const excludePositions = [
            ...allBodies,
            ...obstaclePositions,
            ...prev.powerUps,
            ...prev.foods
          ];
          if (prev.specialFood) excludePositions.push(prev.specialFood);
          
          const newFood = getRandomPosition(excludePositions);
          
          return {
            ...prev,
            foods: [...prev.foods, newFood]
          };
        });
      }, 1000); // 每秒生成一个新食物
    } else {
      if (foodTimerRef.current) {
        clearInterval(foodTimerRef.current);
        foodTimerRef.current = null;
      }
    }
    
    return () => {
      if (foodTimerRef.current) {
        clearInterval(foodTimerRef.current);
      }
    };
  }, [gameState.gameStatus]);
  
  // 障碍物克隆机制 - 每3秒克隆1个新障碍物，位置在蛇头7格以外
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      obstacleTimerRef.current = setInterval(() => {
        setGameState(prev => {
          let snakeHead: Position;
          let allBodies: Position[] = [];
          
          if (prev.gameMode === 'single') {
            snakeHead = prev.snake.body[0];
            allBodies = prev.snake.body;
          } else if (prev.gameMode === 'multi') {
            // 在双人模式下，使用第一个活着的玩家的头部作为参考点
            const alivePlayer = prev.players.find(player => player.isAlive);
            snakeHead = alivePlayer ? alivePlayer.body[0] : { x: 10, y: 10 };
            allBodies = prev.players.flatMap(player => player.body);
          } else {
            snakeHead = { x: 10, y: 10 };
          }
          
          const excludePositions = [
            ...allBodies,
            ...prev.powerUps,
            ...prev.foods,
            ...prev.obstacles.map(obs => obs.position)
          ];
          if (prev.specialFood) excludePositions.push(prev.specialFood);
          
          // 克隆1个新障碍物
          const newObstacle = generateObstaclesAwayFromSnakeHead(snakeHead, 7, excludePositions).slice(0, 1);
          
          return {
            ...prev,
            obstacles: [...prev.obstacles, ...newObstacle]
          };
        });
      }, 3000); // 每3秒克隆1个障碍物
    } else {
      if (obstacleTimerRef.current) {
        clearInterval(obstacleTimerRef.current);
        obstacleTimerRef.current = null;
      }
    }
    
    return () => {
      if (obstacleTimerRef.current) {
        clearInterval(obstacleTimerRef.current);
      }
      if (obstacleCleanupTimerRef.current) {
        clearInterval(obstacleCleanupTimerRef.current);
      }
    };
  }, [gameState.gameStatus]);
  
  // 障碍物自动清理 - 每个克隆体存在4-9秒后消失
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      obstacleCleanupTimerRef.current = setInterval(() => {
        setGameState(prev => {
          const currentTime = Date.now();
          const filteredObstacles = prev.obstacles.filter(obstacle => {
             const lifeTime = currentTime - obstacle.createdAt;
             const maxLifeTime = 4000 + Math.random() * 5000; // 4-9秒随机
             return lifeTime < maxLifeTime;
           });
          
          return {
            ...prev,
            obstacles: filteredObstacles
          };
        });
      }, 500); // 每500ms检查一次
    } else {
      if (obstacleCleanupTimerRef.current) {
        clearInterval(obstacleCleanupTimerRef.current);
        obstacleCleanupTimerRef.current = null;
      }
    }
    
    return () => {
      if (obstacleCleanupTimerRef.current) {
        clearInterval(obstacleCleanupTimerRef.current);
      }
    };
  }, [gameState.gameStatus]);
  
  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          changeDirection('RIGHT');
          break;
        case ' ':
          event.preventDefault();
          if (gameState.gameStatus === 'playing' || gameState.gameStatus === 'paused') {
            pauseGame();
          }
          break;
        case 'Enter':
          if (gameState.gameStatus === 'menu' || gameState.gameStatus === 'game-over') {
            resetGame();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, pauseGame, resetGame, gameState.gameStatus]);
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      if (powerUpTimerRef.current) {
        clearTimeout(powerUpTimerRef.current);
      }
      if (foodTimerRef.current) {
        clearInterval(foodTimerRef.current);
      }
      if (obstacleTimerRef.current) {
        clearInterval(obstacleTimerRef.current);
      }
    };
  }, []);
  
  return {
    gameState,
    resetGame,
    pauseGame,
    changeDirection,
    changePlayerDirection,
    goToMenu,
    startSinglePlayer,
    startMultiPlayer
  };
};