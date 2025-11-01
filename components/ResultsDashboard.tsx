
import React, { useMemo } from 'react';
import type { Formula, Generation } from '../types';
import FormulaCard from './FormulaCard';
import { PerformanceChart } from './charts/PerformanceChart';
import { PopulationAnalysisChart } from './charts/PopulationAnalysisChart';
import { TopFormulasList } from './charts/TopFormulasList';


interface ResultsDashboardProps {
  history: Generation[];
  topFormulas: Formula[];
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ history, topFormulas }) => {
  const lastGeneration = useMemo(() => history[history.length - 1], [history]);

  const currentBest = useMemo(() => {
    if (!lastGeneration) return null;
    // Create a new sorted array to find the best formula without mutating the original.
    return [...lastGeneration.population].sort((a,b) => b.score - a.score)[0];
  }, [lastGeneration]);

  return (
    <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700/50 backdrop-blur-sm space-y-6">
      <h2 className="text-xl font-semibold text-white">Results & Analysis</h2>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <h3 className="text-lg font-medium text-white mb-2">Performance Over Generations</h3>
          <PerformanceChart history={history} />
        </div>
        <div>
            <h3 className="text-lg font-medium text-white mb-2">Current Generation Best</h3>
            <div className="h-64 flex items-center justify-center">
                {currentBest ? (
                    <FormulaCard formula={currentBest} />
                ) : (
                    <div className="text-gray-500 text-center">
                        <p>Run simulation to see results.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <div>
          <h3 className="text-lg font-medium text-white mb-2">Population Analysis (Accuracy vs. Complexity)</h3>
          <PopulationAnalysisChart population={lastGeneration?.population || []} />
      </div>

      <TopFormulasList topFormulas={topFormulas} />
    </div>
  );
};

export default ResultsDashboard;
