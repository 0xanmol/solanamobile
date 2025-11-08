import React, { FC, ReactNode, createContext, useContext, useMemo } from 'react';
import { Connection, ConnectionConfig } from '@solana/web3.js';

export interface ConnectionProviderProps {
  children: ReactNode;
  endpoint: string;
  config?: ConnectionConfig;
}

export interface ConnectionContextState {
  connection: Connection;
}

const ConnectionContext = createContext<ConnectionContextState>(
  {} as ConnectionContextState
);

export function useConnection(): Connection {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within ConnectionProvider');
  }
  return context.connection;
}

/**
 * ConnectionProvider - Provides a memoized Solana RPC Connection to the app
 *
 * This prevents unnecessary re-instantiation of the Connection object across renders.
 * The connection is only recreated if the endpoint or config changes.
 */
export const ConnectionProvider: FC<ConnectionProviderProps> = ({
  children,
  endpoint,
  config = { commitment: 'confirmed' },
}) => {
  const connection = useMemo(
    () => new Connection(endpoint, config),
    [endpoint, config]
  );

  return (
    <ConnectionContext.Provider value={{ connection }}>
      {children}
    </ConnectionContext.Provider>
  );
};
