import type { Formula, Generation, EvolutionConfig } from '../types';
import { FUNCTIONS, VARIABLES, PARAMS } from '../constants';

// --- UTILITY FUNCTIONS ---
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomId = () => Math.random().toString(36).substring(2, 9);

/**
 * Finds the matching closing parenthesis for a given opening one in an expression.
 * @param expression The string to search within.
 * @param startIndex The index of the opening parenthesis.
 * @returns The index of the matching closing parenthesis, or -1 if not found.
 */
const findMatchingParen = (expression: string, startIndex: number): number => {
    let balance = 1;
    for (let i = startIndex + 1; i < expression.length; i++) {
        if (expression[i] === '(') balance++;
        else if (expression[i] === ')') balance--;
        if (balance === 0) return i;
    }
    return -1; // Not found
};

/**
 * Extracts all top-level function calls (subtrees) from an expression.
 * E.g., for "sin(cos(x)) + tanh(a)", it would return ["sin(cos(x))", "tanh(a)"]
 * @param expression The formula expression string.
 * @returns An array of string subtrees.
 */
const getSubtrees = (expression: string): string[] => {
    const subtrees: string[] = [];
    // A function call is a function name followed by an opening parenthesis.
    const regex = /[a-zA-Z]+\(/g;
    let match;
    while ((match = regex.exec(expression)) !== null) {
        const startIndex = match.index + match[0].length - 1;
        const endIndex = findMatchingParen(expression, startIndex);
        if (endIndex !== -1) {
            subtrees.push(expression.substring(match.index, endIndex + 1));
        }
    }
    return subtrees;
};


/**
 * Recursively generates a random mathematical expression part.
 * This is the inner logic for building formula arguments.
 * @param depth - Current recursion depth.
 * @param maxDepth - Maximum allowed recursion depth.
 * @returns A string representing a part of the formula.
 */
const _generateRecursive = (depth: number, maxDepth: number): string => {
  // Base case: Terminate with a variable or parameter.
  if (depth >= maxDepth || Math.random() < 0.4) {
    return getRandomElement([...VARIABLES, ...PARAMS]);
  }
  // Recursive step: Create a new function call.
  const func = getRandomElement(FUNCTIONS);
  const arg = _generateRecursive(depth + 1, maxDepth);
  return `${func}(${arg})`;
};

/**
 * Generates a non-trivial random mathematical expression.
 * It ensures the formula always starts with a function call.
 * @param maxDepth - Maximum allowed recursion depth.
 * @returns A string representing the formula.
 */
const generateRandomExpression = (maxDepth: number): string => {
    // A valid activation function must start with a function.
    const func = getRandomElement(FUNCTIONS);
    // The argument is generated recursively. Start at depth 1.
    const arg = _generateRecursive(1, maxDepth);
    return `${func}(${arg})`;
};

/**
 * Creates a new formula object with mock evaluation metrics.
 * @param maxComplexity - The maximum depth for the generated expression tree.
 * @param expressionOverride - Optional expression to use instead of generating one.
 * @param datasetName - The name of the dataset being used.
 * @returns A new Formula object.
 */
const createFormula = (maxComplexity: number, expressionOverride?: string, datasetName: string = 'MNIST (Default)'): Formula => {
  const expression = expressionOverride || generateRandomExpression(maxComplexity);
  const complexity = (expression.match(/[a-zA-Z]+/g) || []).length;
  
  // Mock evaluation metrics. A custom dataset provides a slight, random performance bonus.
  const datasetBonus = datasetName !== 'MNIST (Default)' ? Math.random() * 0.01 : 0;
  const accuracy = 0.85 + Math.random() * 0.14 - (complexity * 0.005) + datasetBonus;
  const loss = (1 - accuracy) * 2 + Math.random() * 0.1;
  
  // Score prioritizes accuracy while penalizing high loss and complexity.
  let score = accuracy * 1.5 - loss * 0.8 - complexity * 0.01;

  // CRITICAL: Penalize meaningless formulas.
  // A valid activation function MUST contain the input 'x' and at least one function.
  if (!expression.includes('x') || !expression.includes('(')) {
    score = -1; // A heavy penalty to ensure it never gets selected.
  }

  return {
    id: randomId(),
    expression,
    accuracy: parseFloat(accuracy.toFixed(4)),
    loss: parseFloat(loss.toFixed(4)),
    complexity,
    score: parseFloat(score.toFixed(4)),
    params: { a: Math.random(), b: Math.random(), c: Math.random() },
  };
};

export const createInitialPopulation = (config: EvolutionConfig): Formula[] => {
  return Array.from({ length: config.populationSize }, () => createFormula(config.maxComplexity, undefined, config.dataset));
};

// --- EVOLUTIONARY OPERATORS ---

/**
 * Selects a formula from the population using tournament selection.
 * @param population - The current population of formulas.
 * @returns The winning formula from the tournament.
 */
const tournamentSelection = (population: Formula[]): Formula => {
  const tournamentSize = 3;
  let best: Formula | null = null;
  for (let i = 0; i < tournamentSize; i++) {
    const randomFormula = getRandomElement(population);
    if (best === null || randomFormula.score > best.score) {
      best = randomFormula;
    }
  }
  return best!;
};

/**
 * Recombines two parent formulas by swapping one of their subtrees.
 * This is a robust implementation that correctly handles nested parentheses.
 * @param parent1 - The first parent formula.
 * @param parent2 - The second parent formula.
 * @param config - The evolution configuration.
 * @returns A new child formula created from the crossover.
 */
const crossover = (parent1: Formula, parent2: Formula, config: EvolutionConfig): Formula => {
    const subtrees1 = getSubtrees(parent1.expression);
    const subtrees2 = getSubtrees(parent2.expression);

    // If either parent has no swappable parts, return a new random formula to maintain population diversity.
    if (subtrees1.length === 0 || subtrees2.length === 0) {
        return createFormula(config.maxComplexity, undefined, config.dataset);
    }
    
    const subtreeToSwap = getRandomElement(subtrees1);
    const newSubtree = getRandomElement(subtrees2);

    const newExpression = parent1.expression.replace(subtreeToSwap, newSubtree);
    
    // Prevent expressions from becoming excessively long.
    if (newExpression.length > 50) {
        return createFormula(config.maxComplexity, undefined, config.dataset);
    }

    return createFormula(config.maxComplexity, newExpression, config.dataset);
}

/**
 * Randomly alters a formula by replacing a single token (function, variable, or parameter).
 * @param formula - The formula to mutate.
 * @param config - The evolution configuration.
 * @returns A new, mutated formula.
 */
const mutate = (formula: Formula, config: EvolutionConfig): Formula => {
    // A simple regex to find all valid tokens: function names, variables, parameters.
    const tokens = formula.expression.match(/[a-zA-Z]+/g) || [];
    if (tokens.length === 0) return createFormula(config.maxComplexity, undefined, config.dataset);

    const mutationPoint = Math.floor(Math.random() * tokens.length);
    const tokenToMutate = tokens[mutationPoint];
    
    let newToken = tokenToMutate;
    const isFunction = FUNCTIONS.includes(tokenToMutate);
    const isVarOrParam = [...VARIABLES, ...PARAMS].includes(tokenToMutate);

    if (isFunction) {
        newToken = getRandomElement(FUNCTIONS.filter(f => f !== tokenToMutate)) || tokenToMutate;
    } else if (isVarOrParam) {
        newToken = getRandomElement([...VARIABLES, ...PARAMS].filter(v => v !== tokenToMutate)) || tokenToMutate;
    }
    
    // This is a more robust way to replace the Nth occurrence of a token.
    let occurrence = 0;
    const newExpression = formula.expression.replace(/[a-zA-Z]+/g, (match) => {
        if (match === tokenToMutate && occurrence++ === mutationPoint) {
            return newToken;
        }
        return match;
    });

    return createFormula(config.maxComplexity, newExpression, config.dataset);
};

/**
 * Evolves a new generation of formulas from the current one.
 * @param currentGen - The current generation.
 * @param config - The evolution configuration settings.
 * @returns The next generation.
 */
export const evolveNextGeneration = (currentGen: Generation, config: EvolutionConfig): Generation => {
  const population = currentGen.population;
  const sortedPopulation = [...population].sort((a, b) => b.score - a.score);

  // Elitism: carry over the best formulas directly to the next generation.
  const elites = sortedPopulation.slice(0, config.elitism).map(f => ({ ...f }));

  const newPopulation: Formula[] = elites;

  while (newPopulation.length < config.populationSize) {
    const parent1 = tournamentSelection(population);
    let child: Formula;

    if (Math.random() < config.crossoverRate && population.length > 1) {
        // Ensure parent2 is different from parent1 for meaningful crossover.
        let parent2 = tournamentSelection(population);
        while (parent2.id === parent1.id) {
            parent2 = tournamentSelection(population);
        }
        child = crossover(parent1, parent2, config);
    } else {
        // If no crossover, clone a selected parent to be a candidate for mutation.
        child = createFormula(config.maxComplexity, parent1.expression, config.dataset);
    }

    if (Math.random() < config.mutationRate) {
        child = mutate(child, config);
    }
    
    newPopulation.push(child);
  }

  return {
    generationNumber: currentGen.generationNumber + 1,
    population: newPopulation.slice(0, config.populationSize),
  };
};