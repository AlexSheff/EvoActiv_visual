
import React from 'react';
import type { Formula } from '../../types';

interface TopFormulasListProps {
    topFormulas: Formula[];
}

export const TopFormulasList: React.FC<TopFormulasListProps> = ({ topFormulas }) => {
    return (
        <div>
            <h3 className="text-lg font-medium text-white mb-2">Top 10 Formulas Discovered</h3>
            <div className="bg-gray-900/70 p-3 rounded-md">
                {topFormulas.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No top formulas yet. Run the simulation.</p>
                ) : (
                    <ol className="space-y-2">
                        {topFormulas.map((formula, index) => (
                            <li 
                                key={formula.id} 
                                className="text-sm p-2 rounded-md bg-gray-800/80 flex justify-between items-center hover:bg-gray-800 transition-colors"
                                style={{ animation: `fadeIn 0.5s ease ${index * 0.05}s both` }}
                            >
                               <div className="flex items-center overflow-hidden">
                                    <span className="font-bold text-cyan-400 mr-3 text-base w-6 text-center flex-shrink-0">{index + 1}.</span>
                                    <code className="text-gray-300 truncate">{formula.expression}</code>
                               </div>
                               <div className="flex space-x-4 text-xs font-mono flex-shrink-0 ml-4">
                                   <span>Acc: <span className="text-green-400">{formula.accuracy.toFixed(3)}</span></span>
                                   <span>Loss: <span className="text-red-400">{formula.loss.toFixed(3)}</span></span>
                                   <span>Score: <span className="text-yellow-400 font-bold">{formula.score.toFixed(3)}</span></span>
                               </div>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};
