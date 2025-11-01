
import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '../types';

interface LogConsoleProps {
  logs: LogEntry[];
}

const LogConsole: React.FC<LogConsoleProps> = ({ logs }) => {
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-2 flex-shrink-0">Event Log</h2>
      <div className="bg-black/50 h-32 rounded-md p-2 font-mono text-xs text-gray-300 overflow-y-auto border border-gray-700/50">
        {logs.map((log, index) => (
          <div key={index} className="flex">
            <span className="text-gray-500 mr-2 flex-shrink-0">{log.timestamp}</span>
            <span className="flex-1 whitespace-pre-wrap break-words">{log.message}</span>
          </div>
        ))}
        <div ref={endOfLogsRef} />
      </div>
    </div>
  );
};

export default LogConsole;
