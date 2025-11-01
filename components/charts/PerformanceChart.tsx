
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Generation, ChartDataPoint } from '../../types';

interface PerformanceChartProps {
    history: Generation[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/80 p-3 border border-gray-600 rounded-md text-sm backdrop-blur-sm">
        {label && <p className="label text-white mb-2">{`Generation: ${label}`}</p>}
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color || '#fff' }}>
            {`${pld.name}: ${pld.value.toFixed(4)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ history }) => {
    const chartData = useMemo<ChartDataPoint[]>(() => {
        return history.map(gen => {
            const scores = gen.population.map(f => f.score);
            const accuracies = gen.population.map(f => f.accuracy);
            return {
                name: gen.generationNumber,
                bestScore: Math.max(...scores),
                avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
                bestAccuracy: Math.max(...accuracies),
            };
        });
    }, [history]);

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="name" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: "#a0aec0" }} />
                    <Line type="monotone" dataKey="bestScore" stroke="#f59e0b" strokeWidth={2} name="Best Score" />
                    <Line type="monotone" dataKey="bestAccuracy" stroke="#4ade80" strokeWidth={2} name="Best Accuracy" />
                    <Line type="monotone" dataKey="avgScore" stroke="#a0aec0" strokeWidth={1} name="Avg Score" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
