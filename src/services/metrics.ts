type Metric = {
  protocol_id: string;
  tvl: number;
  volume_24h: number;
  fees_24h: number;
  timestamp: string;
};

const history: Metric[] = [];
let latest: Metric | null = null;
const PROTOCOL_ID = 'llamaflow';

function nowISO() {
  return new Date().toISOString();
}

export function seedInitialData() {
  if (history.length > 0) return;
  const base = 1000000; // base TVL
  for (let i = 24; i >= 0; i--) {
    const tvl = base + Math.sin(i / 3) * 50000 + Math.random() * 20000;
    const m: Metric = {
      protocol_id: PROTOCOL_ID,
      tvl,
      volume_24h: Math.abs(Math.sin(i)) * 50000,
      fees_24h: Math.abs(Math.cos(i)) * 5000,
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
    };
    history.push(m);
    latest = m;
  }
}

export function simulateUpdate() {
  const base = (latest?.tvl ?? 1000000);
  const delta = (Math.random() - 0.5) * 50000;
  const tvl = Math.max(0, base + delta);
  latest = {
    protocol_id: PROTOCOL_ID,
    tvl,
    volume_24h: Math.random() * 60000,
    fees_24h: Math.random() * 6000,
    timestamp: nowISO(),
  };
  history.push(latest);
  if (history.length > 1000) history.shift();
  return latest;
}

export function getLatestMetrics(protocolId: string): Metric | null {
  if (protocolId !== PROTOCOL_ID) return null;
  return latest;
}

export function getMetricsHistory(protocolId: string, hours: number = 24): Metric[] {
  if (protocolId !== PROTOCOL_ID) return [];
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return history.filter(h => new Date(h.timestamp).getTime() >= cutoff);
}

export type { Metric };
