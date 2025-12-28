import { getMetricsHistory, getLatestMetrics } from '../services/metrics';

export const resolvers = {
  Query: {
    metrics: async (_: any, { protocolId, hours }: { protocolId: string; hours: number }) => {
      return getMetricsHistory(protocolId, hours);
    },
    latestMetric: async (_: any, { protocolId }: { protocolId: string }) => {
      return getLatestMetrics(protocolId);
    },
  },
};
