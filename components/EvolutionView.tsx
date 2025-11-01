
import React from 'react';
import type { Generation } from '../types';
import FormulaCard from './FormulaCard';

interface EvolutionViewProps {
  generation: Generation | null;
}

const EvolutionView: React.FC<EvolutionViewProps> = ({ generation }) => {
  return (
    <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700/50 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white mb-4">
        Current Population (Generation {generation?.generationNumber || 'N/A'})
      </h2>
      {!generation || generation.population.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 bg-gray-900/50 rounded-md text-gray-500 border border-dashed border-gray-700">
          <h3 className="text-lg font-medium text-gray-400">Simulation Paused</h3>
          <p>Adjust the configuration and press play to begin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {generation.population.map((formula, index) => (
            <div key={formula.id} style={{ animation: `fadeIn 0.5s ease ${index * 0.02}s both` }}>
              <FormulaCard formula={formula} />
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EvolutionView;