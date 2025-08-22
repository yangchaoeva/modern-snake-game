import React, { useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { useLanguage } from '../contexts/LanguageContext';
import GameGrid from './GameGrid';
import GameInfo from './GameInfo';
import GameOverlay from './GameOverlay';
import { Direction } from '../types';

const Game: React.FC = () => {
  const { gameState, resetGame, pauseGame, changeDirection, changePlayerDirection, goToMenu, startSinglePlayer, startMultiPlayer } = useGame();
  const { language, toggleLanguage, t } = useLanguage();

  // 键盘事件处理
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;

      if (gameState.gameMode === 'single') {
        // 单人模式控制
        switch (event.key) {
          case 'ArrowUp':
            changeDirection('UP');
            break;
          case 'ArrowDown':
            changeDirection('DOWN');
            break;
          case 'ArrowLeft':
            changeDirection('LEFT');
            break;
          case 'ArrowRight':
            changeDirection('RIGHT');
            break;
        }
      } else if (gameState.gameMode === 'multi') {
        // 双人模式控制
        // Player 1 (WASD)
        switch (event.key.toLowerCase()) {
          case 'w':
            changePlayerDirection('player1', 'UP');
            break;
          case 's':
            changePlayerDirection('player1', 'DOWN');
            break;
          case 'a':
            changePlayerDirection('player1', 'LEFT');
            break;
          case 'd':
            changePlayerDirection('player1', 'RIGHT');
            break;
        }
        
        // Player 2 (Arrow keys)
        switch (event.key) {
          case 'ArrowUp':
            changePlayerDirection('player2', 'UP');
            break;
          case 'ArrowDown':
            changePlayerDirection('player2', 'DOWN');
            break;
          case 'ArrowLeft':
            changePlayerDirection('player2', 'LEFT');
            break;
          case 'ArrowRight':
            changePlayerDirection('player2', 'RIGHT');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameStatus, gameState.gameMode, changeDirection, changePlayerDirection]);
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 游戏网格 */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-green-400 mb-4 text-center">
            {t('gameTitle')}
          </h1>
          <GameGrid gameState={gameState} />
          
          {/* 移动端控制按钮 */}
          <div className="mt-6 lg:hidden">
            <div className="grid grid-cols-3 gap-2 w-32">
              <div></div>
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
                onClick={() => {
                  const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
                  window.dispatchEvent(event);
                }}
              >
                ↑
              </button>
              <div></div>
              
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
                onClick={() => {
                  const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
                  window.dispatchEvent(event);
                }}
              >
                ←
              </button>
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
                onClick={pauseGame}
              >
                ⏸
              </button>
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
                onClick={() => {
                  const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
                  window.dispatchEvent(event);
                }}
              >
                →
              </button>
              
              <div></div>
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
                onClick={() => {
                  const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
                  window.dispatchEvent(event);
                }}
              >
                ↓
              </button>
              <div></div>
            </div>
          </div>
        </div>
        
        {/* 游戏信息面板 */}
        <div className="w-full lg:w-80">
          <GameInfo gameState={gameState} />
        </div>
      </div>
      
      {/* 游戏覆盖层 */}
      <GameOverlay 
        gameState={gameState}
        onStart={resetGame}
        onResume={pauseGame}
        onGoToMenu={goToMenu}
        onStartSinglePlayer={startSinglePlayer}
        onStartMultiPlayer={startMultiPlayer}
      />
      
      {/* 语言切换按钮 - 右下角，仅在主页面显示 */}
      {gameState.gameStatus === 'menu' && (
        <button
          onClick={toggleLanguage}
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-lg z-50 flex items-center gap-2"
          aria-label="切换语言 / Switch Language"
        >
          <span className="text-lg">{language === 'zh' ? '🇨🇳' : '🇺🇸'}</span>
          <span className="text-sm">{language === 'zh' ? '中' : 'EN'}</span>
        </button>
      )}
    </div>
  );
};

export default Game;