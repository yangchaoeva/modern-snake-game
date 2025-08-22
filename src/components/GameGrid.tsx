import React from 'react';
import { GameState, CellType } from '../types';
import { GRID_SIZE, isPositionEqual } from '../utils/gameUtils';

interface GameGridProps {
  gameState: GameState;
}

const GameGrid: React.FC<GameGridProps> = ({ gameState }) => {
  const { snake, foods, specialFood, powerUps, obstacles, gameMode, players } = gameState;
  
  const getCellType = (x: number, y: number): CellType => {
    const position = { x, y };
    
    if (gameMode === 'single') {
      // 单人模式逻辑
      if (isPositionEqual(position, snake.body[0])) {
        return 'snake-head';
      }
      
      if (snake.body.slice(1).some(segment => isPositionEqual(segment, position))) {
        return 'snake-body';
      }
    } else if (gameMode === 'multi') {
      // 双人模式逻辑
      for (const player of players) {
        // 只有活着的玩家才渲染蛇头和蛇身
        if (player.isAlive && player.body.length > 0) {
          // 检查玩家1蛇头
          if (player.id === 'player1' && isPositionEqual(position, player.body[0])) {
            return 'snake1-head';
          }
          
          // 检查玩家1蛇身
          if (player.id === 'player1' && player.body.slice(1).some(segment => isPositionEqual(segment, position))) {
            return 'snake1-body';
          }
          
          // 检查玩家2蛇头
          if (player.id === 'player2' && isPositionEqual(position, player.body[0])) {
            return 'snake2-head';
          }
          
          // 检查玩家2蛇身
          if (player.id === 'player2' && player.body.slice(1).some(segment => isPositionEqual(segment, position))) {
            return 'snake2-body';
          }
        }
      }
    }
    
    // 检查普通食物
    if (foods.some(food => isPositionEqual(position, food))) {
      return 'food';
    }
    
    // 检查特殊食物
    if (specialFood && isPositionEqual(position, specialFood)) {
      return 'special-food';
    }
    
    // 检查道具
    if (powerUps.some(powerUp => isPositionEqual(powerUp, position))) {
      return 'power-up';
    }
    
    // 检查障碍物
    if (obstacles.some(obstacle => isPositionEqual(obstacle.position, position))) {
      return 'obstacle';
    }
    
    return 'empty';
  };
  
  const getCellClassName = (cellType: CellType): string => {
    const baseClass = 'game-cell';
    
    switch (cellType) {
      case 'snake-head':
        return `${baseClass} snake-head`;
      case 'snake-body':
        return `${baseClass} snake-body`;
      case 'snake1-head':
        return `${baseClass} snake1-head`;
      case 'snake1-body':
        return `${baseClass} snake1-body`;
      case 'snake2-head':
        return `${baseClass} snake2-head`;
      case 'snake2-body':
        return `${baseClass} snake2-body`;
      case 'food':
        return `${baseClass} food`;
      case 'special-food':
        return `${baseClass} special-food`;
      case 'power-up':
        return `${baseClass} power-up`;
      case 'obstacle':
        return `${baseClass} obstacle`;
      default:
        return baseClass;
    }
  };
  
  const renderGrid = () => {
    const grid = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cellType = getCellType(x, y);
        const className = getCellClassName(cellType);
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className={className}
            style={{
              gridColumn: x + 1,
              gridRow: y + 1
            }}
          />
        );
      }
    }
    
    return grid;
  };
  
  return (
    <div 
      className="inline-block p-4 bg-gray-800 rounded-lg border-2 border-gray-600"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        gap: '1px'
      }}
    >
      {renderGrid()}
    </div>
  );
};

export default GameGrid;