
import { useState, useCallback, useRef, useEffect } from 'react';
import type { EvolutionConfig, Formula, Generation, LogEntry } from '../types';
import { DEFAULT_CONFIG, SIMULATION_TICK_RATE_MS } from '../constants';
import { createInitialPopulation, evolveNextGeneration } from '../services/evolutionService';

/**
 * A custom hook to manage the entire state and logic of the evolutionary simulation.
 * It encapsulates configuration, state transitions (play, pause, reset), and data history.
 * @returns An object containing the simulation's state and control functions.
 */
export const useEvolutionSimulation = () => {
  const [config, setConfig] = useState<EvolutionConfig>(DEFAULT_CONFIG);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentGeneration, setCurrentGeneration] = useState<Generation | null>(null);
  const [history, setHistory] = useState<Generation[]>([]);
  const [topFormulas, setTopFormulas] = useState<Formula[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const simulationIntervalRef = useRef<number | null>(null);

  /**
   * Adds a new log entry to the event log.
   */
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    // Keep the log history to a reasonable size to avoid performance issues.
    setLogs(prev => [...prev.slice(-100), { timestamp, message }]);
  }, []);
  
  /**
   * Handles the selection of a new dataset file.
   */
  const handleDatasetChange = useCallback((file: File) => {
      setConfig(prev => ({ ...prev, dataset: file.name }));
      addLog(`Loaded dataset: ${file.name}`);
      // In a real application, this is where you would parse the CSV file.
      // For this simulation, we only use the file name to influence the mock score.
  }, [addLog]);

  /**
   * Resets the simulation to its initial state based on the current configuration.
   */
  const resetSimulation = useCallback(() => {
    addLog('Simulation reset.');
    setIsRunning(false);
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    const initialPopulation = createInitialPopulation(config);
    const initialGeneration: Generation = { generationNumber: 1, population: initialPopulation };
    
    setCurrentGeneration(initialGeneration);
    setHistory([initialGeneration]);
    setTopFormulas([]);
    addLog(`Initialized Gen 1 on "${config.dataset}" with ${config.populationSize} formulas.`);
  }, [config, addLog]);

  // Effect to automatically reset the simulation if core parameters change.
  useEffect(() => {
    resetSimulation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.populationSize, config.maxComplexity, config.dataset]);


  /**
   * Starts or resumes the simulation.
   */
  const startSimulation = useCallback(() => {
    if (isRunning) return;
    
    // If the simulation is at the end, a fresh start is initiated.
    if (!currentGeneration || currentGeneration.generationNumber >= config.generations) {
        addLog("Starting new simulation run...");
        // Calling resetSimulation will set up Gen 1.
        resetSimulation();
    } else {
        addLog('Simulation resumed.');
    }
    setIsRunning(true);
  }, [isRunning, addLog, config.generations, currentGeneration, resetSimulation]);
  
  /**
   * Pauses the simulation.
   */
  const pauseSimulation = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    addLog('Simulation paused.');
  }, [isRunning, addLog]);

  // The main simulation loop, managed by an effect.
  useEffect(() => {
    // Clear any existing interval when the component unmounts or dependencies change.
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    // Conditions to halt the simulation.
    if (!isRunning || !currentGeneration || currentGeneration.generationNumber >= config.generations) {
      if(isRunning && currentGeneration && currentGeneration.generationNumber >= config.generations){
        addLog('Maximum generations reached. Simulation finished.');
        setIsRunning(false);
      }
      return;
    }

    const runNextGeneration = () => {
      // Use a functional update with setCurrentGeneration if it were to depend on its previous state
      // but here we get it from the closure, which is fine since the effect re-runs.
      const nextGen = evolveNextGeneration(currentGeneration, config);
      
      setCurrentGeneration(nextGen);
      setHistory(prev => [...prev, nextGen]);

      const bestOfGeneration = [...nextGen.population].sort((a, b) => b.score - a.score)[0];
      addLog(`Gen ${nextGen.generationNumber}: Best score ${bestOfGeneration.score.toFixed(3)}`);
      
      setTopFormulas(prevTop => {
        const combined = [...prevTop, ...nextGen.population];
        // Deduplicate formulas by expression to keep the list clean.
        const unique = Array.from(new Map(combined.map(f => [f.expression, f])).values());
        // Sort by score and take the top 10.
        return unique.sort((a, b) => b.score - a.score).slice(0, 10);
      });
    };

    simulationIntervalRef.current = window.setInterval(runNextGeneration, SIMULATION_TICK_RATE_MS);

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [isRunning, currentGeneration, config, addLog]);

  return {
    config,
    setConfig,
    isRunning,
    currentGeneration,
    history,
    topFormulas,
    logs,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    handleDatasetChange,
  };
};
