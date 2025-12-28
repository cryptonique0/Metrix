import { graphql } from './codegen.ts';

export interface Metric {
  protocol_id: string;
  tvl: number;
  volume_24h: number;
  fees_24h: number;
  timestamp: string;
}

const gql = String.raw;

export async function getHistory(protocolId: string, hours: number = 24): Promise<Metric[]> {
  const query = gql`
    query {
      metrics(protocolId: "${protocolId}", hours: ${hours}) {
        protocol_id
        tvl
        volume_24h
        fees_24h
        timestamp
      }
    }
  `;
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const { data } = await res.json();
  return data?.metrics || [];
}

export async function getLatest(protocolId: string): Promise<Metric | null> {
  const query = gql`
    query {
      latestMetric(protocolId: "${protocolId}") {
        protocol_id
        tvl
        volume_24h
        fees_24h
        timestamp
      }
    }
  `;
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const { data } = await res.json();
  return data?.latestMetric || null;
}
