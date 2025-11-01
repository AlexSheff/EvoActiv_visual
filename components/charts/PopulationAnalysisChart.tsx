
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import type { Formula } from '../../types';

interface PopulationAnalysisChartProps {
    population: Formula[];
}

const ScatterTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as Formula;
    return (
      <div className="bg-gray-900/80 p-3 border border-gray-600 rounded-md text-sm backdrop-blur-sm w-48">
        <p className="text-white font-mono mb-2 truncate" title={data.expression}>{data.expression}</p>
        <p style={{ color: '#4ade80' }}>{`Accuracy: ${data.accuracy.toFixed(3)}`}</p>
        <p style={{ color: '#60a5fa' }}>{`Complexity: ${data.complexity}`}</p>
        <p style={{ color: '#f59e0b' }}>{`Score: ${data.score.toFixed(3)}`}</p>
      </div>
    );
  }
  return null;
};

export const PopulationAnalysisChart: React.FC<PopulationAnalysisChartProps> = ({ population }) => {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer>
                <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 30 }}>
                    <CartesianGrid stroke="#4a5568" />
                    <XAxis type="number" dataKey="complexity" name="Complexity" stroke="#a0aec0" domain={['dataMin - 1', 'dataMax + 1']}>
                        <Label value="Complexity" offset={-15} position="insideBottom" fill="#a0aec0" />
                    </XAxis>
                    <YAxis type="number" dataKey="accuracy" name="Accuracy" stroke="#a0aec0" domain={[0.8, 1]}>
                        <Label value="Accuracy" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#a0aec0' }} />
                    </YAxis>
                    <ZAxis type="number" dataKey="score" range={[50, 400]} name="Score" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ScatterTooltip />} />
                    <Scatter name="Formulas" data={population} fill="#22d3ee" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};
