
import React, { useRef } from 'react';
import type { EvolutionConfig } from '../types';
import { PlayIcon, PauseIcon, ResetIcon, FileUploadIcon } from './icons/Icons';

interface ConfigPanelProps {
  config: EvolutionConfig;
  setConfig: React.Dispatch<React.SetStateAction<EvolutionConfig>>;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onDatasetChange: (file: File) => void;
  currentGeneration: number;
}

const sliderTooltips: Record<keyof Omit<EvolutionConfig, 'generations' | 'dataset'>, string> = {
  populationSize: "Number of candidate formulas in each generation.",
  mutationRate: "Probability of a formula being randomly altered.",
  crossoverRate: "Probability of two formulas combining to create a child.",
  elitism: "Number of top formulas to carry over to the next generation.",
  maxComplexity: "Maximum nesting depth of generated formulas."
}

const ConfigSlider: React.FC<{ label: string; value: number; min: number; max: number; step: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; tooltip: string; }> = ({ label, value, min, max, step, onChange, tooltip }) => (
    <div title={tooltip}>
        <label className="block text-sm font-medium text-gray-400 mb-1 flex justify-between">
            <span>{label}</span>
            <span className="text-cyan-400 font-mono">{value}</span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
            style={{ '--thumb-color': '#22d3ee' } as React.CSSProperties}
        />
        <style>{`
            .range-thumb::-webkit-slider-thumb {
                -webkit-appearance: none; appearance: none;
                width: 16px; height: 16px;
                background: var(--thumb-color);
                border-radius: 50%; cursor: pointer;
                transition: transform 0.1s ease-in-out;
            }
            .range-thumb:hover::-webkit-slider-thumb { transform: scale(1.2); }
            .range-thumb::-moz-range-thumb {
                width: 16px; height: 16px;
                background: var(--thumb-color);
                border-radius: 50%; cursor: pointer;
            }
        `}</style>
    </div>
);

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, isRunning, onStart, onPause, onReset, onDatasetChange, currentGeneration }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConfigChange = (key: keyof EvolutionConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, [key]: parseFloat(e.target.value) }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onDatasetChange(file);
    }
  };
  
  const progressPercentage = config.generations > 0 ? (currentGeneration / config.generations) * 100 : 0;

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Configuration</h2>
        
        <div className="space-y-4">
          <ConfigSlider label="Population Size" value={config.populationSize} min={10} max={100} step={1} onChange={handleConfigChange('populationSize')} tooltip={sliderTooltips.populationSize} />
          <ConfigSlider label="Generations" value={config.generations} min={5} max={50} step={1} onChange={handleConfigChange('generations')} tooltip={"Total number of generations to simulate."} />
          <ConfigSlider label="Mutation Rate" value={config.mutationRate} min={0.1} max={1} step={0.05} onChange={handleConfigChange('mutationRate')} tooltip={sliderTooltips.mutationRate} />
          <ConfigSlider label="Crossover Rate" value={config.crossoverRate} min={0.1} max={1} step={0.05} onChange={handleConfigChange('crossoverRate')} tooltip={sliderTooltips.crossoverRate} />
          <ConfigSlider label="Elitism" value={config.elitism} min={1} max={10} step={1} onChange={handleConfigChange('elitism')} tooltip={sliderTooltips.elitism} />
          <ConfigSlider label="Max Complexity" value={config.maxComplexity} min={2} max={8} step={1} onChange={handleConfigChange('maxComplexity')} tooltip={sliderTooltips.maxComplexity} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Dataset</h3>
          <div className="bg-gray-800/60 p-2 rounded-md flex items-center justify-between">
              <span className="text-sm text-gray-300 truncate pr-2" title={config.dataset}>{config.dataset}</span>
              <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white transition-colors" title="Upload custom CSV">
                  <FileUploadIcon />
              </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Simulation Progress</h3>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-2">Generation {currentGeneration} / {config.generations}</p>
        </div>

        <div className="flex items-center justify-center space-x-3 pt-4 border-t border-gray-700/50">
          <button onClick={onReset} className="p-3 bg-gray-600 hover:bg-red-500 rounded-full text-white transition-colors disabled:opacity-50" title="Reset Simulation">
              <ResetIcon />
          </button>
          {!isRunning ? (
               <button onClick={onStart} disabled={currentGeneration >= config.generations} className="p-4 bg-green-500 hover:bg-green-400 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Start Simulation">
                  <PlayIcon />
               </button>
          ) : (
              <button onClick={onPause} className="p-4 bg-yellow-500 hover:bg-yellow-400 rounded-full text-white transition-colors" title="Pause Simulation">
                  <PauseIcon />
              </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfigPanel;
