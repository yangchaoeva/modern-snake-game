import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译字典
const translations = {
  zh: {
    // 游戏标题和基本信息
    gameTitle: '经典贪吃蛇游戏',
    gameInfo: '游戏信息',
    score: '得分',
    level: '等级',
    length: '长度',
    highScore: '最高分',
    
    // 游戏模式
    singlePlayer: '单人模式',
    multiPlayer: '双人模式',
    
    // 游戏状态
    gameOver: '游戏结束',
    gamePaused: '游戏暂停',
    newRecord: '新纪录！',
    congratulations: '恭喜你创造了新的最高分！',
    
    // 按钮
    start: '开始游戏',
    restart: '重新开始',
    continue: '继续游戏',
    backToMenu: '回到菜单',
    
    // 玩家信息
    player: '玩家',
    greenSnake: '绿蛇',
    pinkSnake: '粉蛇',
    dead: '已死亡',
    finalScore: '最终得分',
    lastSurvivorScore: '最后存活蛇的得分',
    
    // 游戏说明
    gameInstructions: '游戏说明',
    normalFood: '普通食物 (+10分)',
    specialFood: '特殊食物 (+50分)',
    powerUp: '神秘道具 (随机效果)',
    obstacle: '障碍物 (小心避开)',
    
    // 操作说明
    controls: '操作说明',
    movement: '↑↓←→ 或 WASD: 移动',
    pause: '空格键: 暂停/继续',
    restart_key: '回车键: 开始/重新开始',
    
    // 道具效果
    powerUpActive: '道具激活',
    remainingTime: '剩余时间',
    slowMotion: '慢动作模式',
    invincible: '无敌模式',
    doubleScore: '双倍得分',
    phaseThrough: '穿墙模式',
    
    // 欢迎信息
    welcome: '欢迎来到全新的贪吃蛇体验！',
    gameFeatures: '收集食物、获得道具、避开障碍、挑战更高等级！',
    collectFood: '收集食物',
    mysteriousItems: '神秘道具',
    avoidObstacles: '避开障碍',
    challengeLevels: '挑战等级',
    controlHint: '使用 ↑↓←→ 或 WASD 控制方向',
    
    // 其他翻译
    seconds: '秒',
    points: '分',
    mysteryItem: '神秘道具',
    randomEffect: '随机效果',
    avoidCarefully: '小心避开',
    or: '或',
    move: '移动',
    spaceKey: '空格键',
    pauseResume: '暂停/继续',
    enterKey: '回车键',
    startRestart: '开始/重新开始',
    reachedLevel: '达到等级',
    snakeLength: '蛇的长度'
  },
  en: {
    // 游戏标题和基本信息
    gameTitle: 'Classic Snake Game',
    gameInfo: 'Game Info',
    score: 'Score',
    level: 'Level',
    length: 'Length',
    highScore: 'High Score',
    
    // 游戏模式
    singlePlayer: 'Single Player',
    multiPlayer: 'Multi Player',
    
    // 游戏状态
    gameOver: 'Game Over',
    gamePaused: 'Game Paused',
    newRecord: 'New Record!',
    congratulations: 'Congratulations on setting a new high score!',
    
    // 按钮
    start: 'Start Game',
    restart: 'Restart',
    continue: 'Continue',
    backToMenu: 'Back to Menu',
    
    // 玩家信息
    player: 'Player',
    greenSnake: 'Green Snake',
    pinkSnake: 'Pink Snake',
    dead: 'Dead',
    finalScore: 'Final Score',
    lastSurvivorScore: 'Last Survivor Score',
    
    // 游戏说明
    gameInstructions: 'Game Instructions',
    normalFood: 'Normal Food (+10 points)',
    specialFood: 'Special Food (+50 points)',
    powerUp: 'Power-up (Random Effect)',
    obstacle: 'Obstacle (Avoid)',
    
    // 操作说明
    controls: 'Controls',
    movement: '↑↓←→ or WASD: Move',
    pause: 'Space: Pause/Resume',
    restart_key: 'Enter: Start/Restart',
    
    // 道具效果
    powerUpActive: 'Power-up Active',
    remainingTime: 'Remaining Time',
    slowMotion: 'Slow Motion',
    invincible: 'Invincible',
    doubleScore: 'Double Score',
    phaseThrough: 'Phase Through',
    
    // 欢迎信息
    welcome: 'Welcome to the new Snake experience!',
    gameFeatures: 'Collect food, get power-ups, avoid obstacles, challenge higher levels!',
    collectFood: 'Collect Food',
    mysteriousItems: 'Mysterious Items',
    avoidObstacles: 'Avoid Obstacles',
    challengeLevels: 'Challenge Levels',
    controlHint: 'Use ↑↓←→ or WASD to control direction',
    
    // 其他翻译
    seconds: 's',
    points: ' pts',
    mysteryItem: 'Mystery Item',
    randomEffect: 'Random Effect',
    avoidCarefully: 'Avoid Carefully',
    or: 'or',
    move: 'Move',
    spaceKey: 'Space',
    pauseResume: 'Pause/Resume',
    enterKey: 'Enter',
    startRestart: 'Start/Restart',
    reachedLevel: 'Reached Level',
    snakeLength: 'Snake Length'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['zh']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};