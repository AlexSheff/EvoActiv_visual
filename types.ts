
export interface Formula {
  id: string;
  expression: string;
  accuracy: number;
  loss: number;
  complexity: number;
  score: number;
  params: { [key: string]: number };
}

export interface Generation {
  generationNumber: number;
  population: Formula[];
}

export interface EvolutionConfig {
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverRate: number;
  elitism: number;
  maxComplexity: number;
  dataset: string;
}

export interface LogEntry {
  timestamp: string;
  message: string;
}

export interface ChartDataPoint {
    name: number;
    bestScore: number;
    avgScore: number;
    bestAccuracy: number;
}
