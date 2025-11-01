
import React from 'react';
import { GitHubIcon } from './icons/Icons';

const Header: React.FC = () => {
  return (
    <header className="pb-4 mb-4 border-b border-gray-700/50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">EvoActiv</h1>
          <p className="text-sm text-gray-400">Evolutionary Activation Discovery</p>
        </div>
        <a 
          href="https://github.com/evo-activ/evo-activ" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-400 hover:text-white transition-colors"
          title="View on GitHub"
        >
          <GitHubIcon />
        </a>
      </div>
    </header>
  );
};

export default Header;