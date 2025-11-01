
import type { EvolutionConfig } from './types';

export const OPERATORS: string[] = ['+', '-', '*', '/'];
export const FUNCTIONS: string[] = ['sin', 'cos', 'tanh', 'exp', 'log', 'abs'];
export const VARIABLES: string[] = ['x'];
export const PARAMS: string[] = ['a', 'b', 'c'];

export const SIMULATION_TICK_RATE_MS = 1200;

export const DEFAULT_CONFIG: EvolutionConfig = {
  populationSize: 20,
  generations: 15,
  mutationRate: 0.3,
  crossoverRate: 0.5,
  elitism: 3,
  maxComplexity: 4,
  dataset: 'MNIST (Default)',
};
