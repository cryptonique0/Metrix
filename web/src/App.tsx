import React, { useEffect, useState } from 'react';
import { TvlChart } from './components/TvlChart';
import { useSocket } from './hooks/useSocket';
import { getHistory, Metric } from './services/graphql';

export default function App() {
  const [history, setHistory] = useState<Metric[]>([]);
  const [latest, setLatest] = useState<Metric | null>(null);
  const socket = useSocket();

  useEffect(() => {
    getHistory('llamaflow', 24).then(setHistory);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('tvlUpdate', (data: Metric) => {
      setLatest(data);
      setHistory((prev) => [...prev, data]);
    });
    return () => {
      socket.off('tvlUpdate');
    };
  }, [socket]);

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Metrix: Real-time TVL</h1>
      <p>Live updates via WebSocket + historical via GraphQL</p>
      <div style={{ marginTop: 16 }}>
        <TvlChart data={history} />
      </div>
      {latest && (
        <div style={{ marginTop: 16 }}>
          <strong>Latest TVL:</strong> {latest.tvl.toLocaleString()} at {new Date(latest.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
