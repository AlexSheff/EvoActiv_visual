
import React from 'react';
import Header from './components/Header';
import ConfigPanel from './components/ConfigPanel';
import EvolutionView from './components/EvolutionView';
import ResultsDashboard from './components/ResultsDashboard';
import LogConsole from './components/LogConsole';
import About from './components/About';
import { useEvolutionSimulation } from './hooks/useEvolutionSimulation';

/**
 * The main application component. It orchestrates the entire UI layout,
 * bringing together the configuration sidebar and the main content area for simulation results.
 */
const App: React.FC = () => {
  const {
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
  } = useEvolutionSimulation();

  return (
    <div className="min-h-screen text-gray-200 font-sans">
      <div className="flex">
        {/* Sidebar: Configuration and Logs */}
        <aside className="w-80 h-screen sticky top-0 flex flex-col p-4 bg-black/20 backdrop-blur-lg border-r border-gray-700/50">
          <div className="flex-shrink-0">
            <Header />
          </div>
          <div className="flex-grow overflow-y-auto pr-2 space-y-6">
            <ConfigPanel
              config={config}
              setConfig={setConfig}
              isRunning={isRunning}
              onStart={startSimulation}
              onPause={pauseSimulation}
              onReset={resetSimulation}
              onDatasetChange={handleDatasetChange}
              currentGeneration={currentGeneration?.generationNumber || 0}
            />
             <LogConsole logs={logs} />
          </div>
        </aside>

        {/* Main Content: Simulation Visualization and Analysis */}
        <main className="flex-1 p-6 space-y-6">
          <About />
          <EvolutionView generation={currentGeneration} />
          <ResultsDashboard history={history} topFormulas={topFormulas} />
        </main>
      </div>
    </div>
  );
};

export default App;
