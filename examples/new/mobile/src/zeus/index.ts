export type ZeusOperation = 'query' | 'mutation' | 'subscription';

export type ZeusChain = <TResult = unknown>(
  operation: ZeusOperation,
  payload: Record<string, unknown>,
) => Promise<TResult>;

export function Chain(_url: string, _config?: { headers?: Record<string, string> }): ZeusChain {
  return async () => {
    throw new Error('Zeus client is not generated yet. Replace src/zeus with generated artifacts.');
  };
}
