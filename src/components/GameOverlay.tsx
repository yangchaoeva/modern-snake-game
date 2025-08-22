import React from 'react';
import { GameState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import Fireworks from './Fireworks';

interface GameOverlayProps {
  gameState: GameState;
  onStart: () => void;
  onResume: () => void;
  onGoToMenu: () => void;
  onStartSinglePlayer: () => void;
  onStartMultiPlayer: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({ gameState, onStart, onResume, onGoToMenu, onStartSinglePlayer, onStartMultiPlayer }) => {
  const { gameStatus, score, level } = gameState;
  const { t } = useLanguage();
  
  if (gameStatus === 'playing') {
    return null;
  }
  
  const renderMenuScreen = () => (
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-8 text-green-400 animate-pulse">
        {t('gameTitle')}
      </h1>
      <div className="mb-8">
        <div className="text-xl text-gray-300 mb-4">{t('welcome')}</div>
        <div className="text-lg text-gray-400 mb-6">
          {t('gameFeatures')}
        </div>
      </div>
      
      <div className="mb-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-2xl mb-2">🍎</div>
          <div className="text-sm text-gray-300">{t('collectFood')}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-sm text-gray-300">{t('mysteriousItems')}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-2xl mb-2">🧱</div>
          <div className="text-sm text-gray-300">{t('avoidObstacles')}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-2xl mb-2">🏆</div>
          <div className="text-sm text-gray-300">{t('challengeLevels')}</div>
        </div>
      </div>
      
      <div className="flex gap-6 justify-center">
        <button
          onClick={onStartSinglePlayer}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 animate-bounce"
        >
          {t('singlePlayer')}
        </button>
        <button
          onClick={onStartMultiPlayer}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 animate-bounce"
        >
          {t('multiPlayer')}
        </button>
      </div>
      
      <div className="mt-6 text-gray-400 text-sm">
        {t('controlHint')}
      </div>
    </div>
  );
  
  const renderPauseScreen = () => (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-8 text-yellow-400">{t('gamePaused')}</h2>
      <div className="mb-8">
        <div className="text-xl text-gray-300 mb-2">{t('score')}: {score}</div>
        <div className="text-lg text-gray-400">{t('level')}: {level}</div>
      </div>
      <button
        onClick={onResume}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
      >
        {t('continue')} ({t('spaceKey')})
      </button>
    </div>
  );
  
  const renderGameOverScreen = () => {
    const currentHighScore = localStorage.getItem('snakeHighScore') ? parseInt(localStorage.getItem('snakeHighScore')!) : 0;
    const isHighScore = score >= currentHighScore;
    
    if (isHighScore) {
      localStorage.setItem('snakeHighScore', score.toString());
    }
    
    const renderSinglePlayerGameOver = () => (
      <div className="mb-8 space-y-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-400 mb-2">{score}</div>
          <div className="text-gray-300">{t('finalScore')}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-xl font-bold text-blue-400">{level}</div>
            <div className="text-sm text-gray-300">{t('reachedLevel')}</div>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-xl font-bold text-purple-400">{gameState.snake.body.length}</div>
            <div className="text-sm text-gray-300">{t('snakeLength')}</div>
          </div>
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-lg font-bold text-orange-400">
            {localStorage.getItem('snakeHighScore') || '0'}
          </div>
          <div className="text-sm text-gray-300">{t('highScore')}</div>
        </div>
      </div>
    );
    
    const renderMultiPlayerGameOver = () => (
      <div className="mb-8 space-y-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-400 mb-2">{score}</div>
          <div className="text-gray-300">{t('lastSurvivorScore')}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {gameState.players.map((player, index) => (
            <div key={player.id} className={`p-4 rounded-lg border-2 ${
              player.id === 'player1' 
                ? 'bg-green-900/20 border-green-500' 
                : 'bg-pink-900/20 border-pink-500'
            }`}>
              <h4 className={`font-bold mb-2 ${
                player.id === 'player1' ? 'text-green-400' : 'text-pink-400'
              }`}>
                {t('player')}{index + 1} {player.id === 'player1' ? `(${t('greenSnake')})` : `(${t('pinkSnake')})`}
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('level')}:</span>
                  <span className="text-blue-400 font-bold">{player.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('length')}:</span>
                  <span className="text-purple-400 font-bold">{player.body.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    
    return (
      <div className="text-center">
        <h2 className="text-5xl font-bold mb-6 text-red-400 animate-pulse">
          {t('gameOver')}
        </h2>
        
        {isHighScore && gameState.gameMode === 'single' && (
          <div className="mb-6 p-4 bg-yellow-900 border border-yellow-500 rounded-lg">
            <div className="text-2xl text-yellow-400 font-bold mb-2">🎉 {t('newRecord')}</div>
            <div className="text-yellow-300">{t('congratulations')}</div>
          </div>
        )}
        
        {gameState.gameMode === 'single' ? renderSinglePlayerGameOver() : renderMultiPlayerGameOver()}
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={onStart}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 animate-pulse"
          >
            {t('restart')} ({t('enterKey')})
          </button>
          <button
            onClick={onGoToMenu}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200"
          >
            {t('backToMenu')}
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <>
      {/* 烟花效果 - 只在游戏结束且达到或超过历史最高分时显示 */}
      <Fireworks isActive={gameStatus === 'game-over' && score >= (localStorage.getItem('snakeHighScore') ? parseInt(localStorage.getItem('snakeHighScore')!) : 0)} />
      
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-xl border-2 border-gray-600 max-w-2xl w-full mx-4">
          {gameStatus === 'menu' && renderMenuScreen()}
          {gameStatus === 'paused' && renderPauseScreen()}
          {gameStatus === 'game-over' && renderGameOverScreen()}
        </div>
      </div>
    </>
  );
};

export default GameOverlay;