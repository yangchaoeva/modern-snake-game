import React from 'react';
import Game from './components/Game';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="App">
        <Game />
      </div>
    </LanguageProvider>
  );
};

export default App;