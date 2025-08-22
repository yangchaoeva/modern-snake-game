import React from 'react';
import { GameState } from '../types';
import { getPowerUpDescription, getPowerUpColor } from '../utils/gameUtils';
import { useLanguage } from '../contexts/LanguageContext';

interface GameInfoProps {
  gameState: GameState;
}

const GameInfo: React.FC<GameInfoProps> = ({ gameState }) => {
  const { score, level, powerUpActive, powerUpTimer, gameMode, players, snake } = gameState;
  const { t } = useLanguage();
  
  const formatTime = (ms: number): string => {
    return (ms / 1000).toFixed(1);
  };
  
  const renderSinglePlayerInfo = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-300">{t('score')}:</span>
        <span className="text-xl font-bold text-yellow-400">{score}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-300">{t('level')}:</span>
        <span className="text-xl font-bold text-blue-400">{level}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-300">{t('length')}:</span>
        <span className="text-xl font-bold text-green-400">{snake.body.length}</span>
      </div>
    </div>
  );
  
  const renderMultiPlayerInfo = () => {
    if (!players || players.length === 0) {
      return (
        <div className="text-center text-gray-400">
          {t('gameInfo')}...
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {players.map((player, index) => (
          <div key={player.id} className={`p-4 rounded-lg border-2 ${
            player.id === 'player1' 
              ? 'bg-green-900/20 border-green-500' 
              : 'bg-pink-900/20 border-pink-500'
          }`}>
            <h3 className={`text-lg font-bold mb-3 text-center ${
              player.id === 'player1' ? 'text-green-400' : 'text-pink-400'
            }`}>
              {t('player')}{index + 1} {player.id === 'player1' ? `(${t('greenSnake')} - WASD)` : `(${t('pinkSnake')} - ↑↓←→)`}
            </h3>
            
            {!player.isAlive && (
              <div className="text-center text-red-400 font-bold mb-2">{t('dead')}</div>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{t('score')}:</span>
                <span className="text-lg font-bold text-yellow-400">{player.score}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{t('level')}:</span>
                <span className="text-lg font-bold text-blue-400">{player.level}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{t('length')}:</span>
                <span className="text-lg font-bold text-cyan-400">{player.body.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-400">{t('gameInfo')}</h2>
      
      {gameMode === 'single' ? renderSinglePlayerInfo() : renderMultiPlayerInfo()}
        
      {powerUpActive && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-500">
          <h3 className="text-lg font-semibold mb-2 text-center text-purple-400">{t('powerUpActive')}</h3>
          <div className="text-center">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPowerUpColor(powerUpActive)} text-gray-900 mb-2`}>
              {getPowerUpDescription(powerUpActive)}
            </div>
            <div className="text-sm text-gray-300">
              {t('remainingTime')}: {formatTime(powerUpTimer)}{t('seconds')}
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-400 h-2 rounded-full transition-all duration-100"
                style={{ width: `${(powerUpTimer / 20000) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-500">
        <h3 className="text-lg font-semibold mb-3 text-center text-cyan-400">{t('gameInstructions')}</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded animate-pulse"></div>
            <span>{t('normalFood')} (+10{t('points')})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded animate-bounce"></div>
            <span>{t('specialFood')} (+50{t('points')})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded animate-pulse"></div>
            <span>{t('mysteryItem')} ({t('randomEffect')})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-600 rounded"></div>
            <span>{t('obstacle')} ({t('avoidCarefully')})</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-500">
        <h3 className="text-lg font-semibold mb-3 text-center text-orange-400">{t('controls')}</h3>
        <div className="space-y-1 text-sm text-gray-300">
          <div>↑↓←→ {t('or')} WASD: {t('move')}</div>
          <div>{t('spaceKey')}: {t('pauseResume')}</div>
          <div>{t('enterKey')}: {t('startRestart')}</div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;