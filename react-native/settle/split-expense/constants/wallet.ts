/**
 * Wallet configuration for Solana Mobile Wallet Adapter
 */

export const APP_IDENTITY = {
  name: 'Settle',
  uri: 'https://settle.app',
  icon: 'favicon.ico',
};

// Valid cluster values: 'devnet', 'testnet', 'mainnet-beta'
export const SOLANA_CLUSTER = 'devnet' as const;

// For mainnet, use: 'mainnet-beta'
// export const SOLANA_CLUSTER = 'mainnet-beta' as const;
