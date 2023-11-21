import { valuationsMock } from "../mock-data/valuations.mock"; //TODO change to -controller with controllers

export interface valuation {
  id: number;
  clientId: string;
  quarter: string;
  snapshotId: number;
  versionId: number;
  isValuator: boolean;
  valuatorId: string | null;
}

export function findValuationsForClient(clientId: string): valuation[] {
  return valuationsMock.filter((valuation) => valuation.clientId === clientId);
}
