
import React from 'react';
import type { Formula } from '../types';

interface FormulaCardProps {
  formula: Formula;
}

const Metric: React.FC<{ label: string; value: string | number; colorClass?: string }> = ({ label, value, colorClass = 'text-cyan-400' }) => (
  <div className="flex justify-between text-xs">
    <span className="text-gray-400">{label}</span>
    <span className={`font-mono font-semibold ${colorClass}`}>{value}</span>
  </div>
);

const getScoreColor = (score: number): string => {
    if (score > 1.0) return 'border-green-400';
    if (score > 0.8) return 'border-cyan-400';
    if (score > 0.6) return 'border-yellow-400';
    return 'border-gray-600';
}

const FormulaCard: React.FC<FormulaCardProps> = ({ formula }) => {
  const scoreColorClass = getScoreColor(formula.score);

  return (
    <div className={`bg-gray-900/70 p-3 rounded-md border border-gray-700/80 hover:border-cyan-500 transition-all duration-300 space-y-2 flex flex-col justify-between h-full border-t-4 ${scoreColorClass}`}>
      <div>
        <p className="text-sm font-semibold text-white break-all text-center mb-2" title={formula.expression}>
            {formula.expression}
        </p>
        <div className="space-y-1">
          <Metric label="Accuracy" value={formula.accuracy.toFixed(3)} colorClass="text-green-400" />
          <Metric label="Loss" value={formula.loss.toFixed(3)} colorClass="text-red-400" />
          <Metric label="Complexity" value={formula.complexity} />
        </div>
      </div>
      <div className="pt-2 mt-2 border-t border-gray-700/50">
        <Metric label="Score" value={formula.score.toFixed(3)} colorClass="text-yellow-400" />
      </div>
    </div>
  );
};

// Memoize the component to prevent re-renders if the formula prop hasn't changed.
export default React.memo(FormulaCard);
