/**
 * Wallet service for Solana Mobile Wallet Adapter
 */

import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { APP_IDENTITY, SOLANA_CLUSTER } from '@/constants/wallet';

export interface WalletAuthResult {
  pubkey: string;
  authToken: string;
  walletUriBase: string | null;
  accounts: Array<{
    address: string;
    label?: string;
  }>;
}

/**
 * Authorize wallet - Opens wallet app and requests authorization
 * This will show the wallet approval dialog to the user
 */
export const authorizeWallet = async (): Promise<WalletAuthResult> => {
  try {
    const authorizationResult = await transact(async (wallet: Web3MobileWallet) => {
      return await wallet.authorize({
        cluster: SOLANA_CLUSTER,
        identity: APP_IDENTITY,
      });
    });

    // Extract the first account's pubkey
    const pubkey = authorizationResult.accounts[0].address;
    const authToken = authorizationResult.auth_token;
    const walletUriBase = authorizationResult.wallet_uri_base;

    return {
      pubkey,
      authToken,
      walletUriBase,
      accounts: authorizationResult.accounts.map(acc => ({
        address: acc.address,
        label: acc.label,
      })),
    };
  } catch (error: any) {
    console.error('Wallet authorization error:', error);
    throw new Error(error.message || 'Failed to authorize wallet');
  }
};

/**
 * Reauthorize wallet with cached auth token
 * This skips the approval dialog if the token is still valid
 */
export const reauthorizeWallet = async (cachedAuthToken: string): Promise<WalletAuthResult> => {
  try {
    const authorizationResult = await transact(async (wallet: Web3MobileWallet) => {
      return await wallet.authorize({
        cluster: SOLANA_CLUSTER,
        identity: APP_IDENTITY,
        auth_token: cachedAuthToken,
      });
    });

    const pubkey = authorizationResult.accounts[0].address;
    const authToken = authorizationResult.auth_token;
    const walletUriBase = authorizationResult.wallet_uri_base;

    return {
      pubkey,
      authToken,
      walletUriBase,
      accounts: authorizationResult.accounts.map(acc => ({
        address: acc.address,
        label: acc.label,
      })),
    };
  } catch (error: any) {
    console.error('Wallet reauthorization error:', error);
    throw new Error(error.message || 'Failed to reauthorize wallet');
  }
};

/**
 * Disconnect wallet - Deauthorize and invalidate the auth token
 */
export const disconnectWallet = async (authToken: string): Promise<void> => {
  try {
    await transact(async (wallet: Web3MobileWallet) => {
      await wallet.deauthorize({
        auth_token: authToken,
      });
    });
  } catch (error: any) {
    console.error('Wallet disconnect error:', error);
    // Don't throw - we still want to clear local cache even if deauth fails
  }
};
