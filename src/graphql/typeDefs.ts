import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Metric {
    protocol_id: String!
    tvl: Float!
    volume_24h: Float!
    fees_24h: Float!
    timestamp: String!
  }

  type Query {
    metrics(protocolId: String!, hours: Int = 24): [Metric!]!
    latestMetric(protocolId: String!): Metric
  }
`;
