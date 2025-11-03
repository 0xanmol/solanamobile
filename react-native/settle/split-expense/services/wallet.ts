/**
 * Wallet service for Solana Mobile Wallet Adapter
 */

import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey } from '@solana/web3.js';
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
 * Convert address to base58 string format
 * Handles both base58 strings and Uint8Array/byte array formats
 */
const toBase58String = (address: any): string => {
  try {
    console.log('Converting address to base58:', {
      type: typeof address,
      value: address,
      isUint8Array: address instanceof Uint8Array,
      isString: typeof address === 'string'
    });

    // If it's a Uint8Array or array-like, convert directly
    if (address instanceof Uint8Array || (Array.isArray(address))) {
      const pubkey = new PublicKey(address);
      const base58 = pubkey.toBase58();
      console.log('Converted from Uint8Array to base58:', base58);
      return base58;
    }

    // If it's a string
    if (typeof address === 'string') {
      // Check if it looks like base64 (contains +, /, or =)
      if (address.includes('+') || address.includes('/') || address.includes('=')) {
        console.log('Detected base64 format, converting to base58');
        // Decode base64 to Uint8Array
        const binaryString = atob(address);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const pubkey = new PublicKey(bytes);
        const base58 = pubkey.toBase58();
        console.log('Converted from base64 to base58:', base58);
        return base58;
      }
      // Otherwise assume it's already base58, validate it
      const pubkey = new PublicKey(address);
      const base58 = pubkey.toBase58();
      console.log('Already base58, validated:', base58);
      return base58;
    }

    throw new Error(`Unsupported address format: ${typeof address}`);
  } catch (error) {
    console.error('Error converting address to base58:', error, 'Address:', address);
    throw new Error('Invalid wallet address format');
  }
};

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

    // Validate we have accounts
    if (!authorizationResult.accounts || authorizationResult.accounts.length === 0) {
      throw new Error('No wallet accounts found. Please ensure your wallet is set up correctly.');
    }

    // Extract and convert the first account's pubkey to base58
    const pubkey = toBase58String(authorizationResult.accounts[0].address);
    const authToken = authorizationResult.auth_token;
    const walletUriBase = authorizationResult.wallet_uri_base;

    console.log('Wallet authorized with base58 pubkey:', pubkey);

    return {
      pubkey,
      authToken,
      walletUriBase,
      accounts: authorizationResult.accounts.map(acc => ({
        address: toBase58String(acc.address),
        label: acc.label,
      })),
    };
  } catch (error: any) {
    console.error('Wallet authorization error:', error);

    // Provide user-friendly error messages
    const errorMessage = error.message || '';
    if (errorMessage.includes('declined') || errorMessage.includes('-1')) {
      throw new Error('Wallet authorization was declined. Please try again and approve the connection.');
    } else if (errorMessage.includes('no wallet') || errorMessage.includes('not found')) {
      throw new Error('No wallet app found. Please install Phantom, Solflare, or another Solana wallet.');
    } else {
      throw new Error(errorMessage || 'Failed to authorize wallet');
    }
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

    // Validate we have accounts
    if (!authorizationResult.accounts || authorizationResult.accounts.length === 0) {
      throw new Error('No wallet accounts found. Please ensure your wallet is set up correctly.');
    }

    // Extract and convert the first account's pubkey to base58
    const pubkey = toBase58String(authorizationResult.accounts[0].address);
    const authToken = authorizationResult.auth_token;
    const walletUriBase = authorizationResult.wallet_uri_base;

    console.log('Wallet reauthorized with base58 pubkey:', pubkey);

    return {
      pubkey,
      authToken,
      walletUriBase,
      accounts: authorizationResult.accounts.map(acc => ({
        address: toBase58String(acc.address),
        label: acc.label,
      })),
    };
  } catch (error: any) {
    console.error('Wallet reauthorization error:', error);

    // Provide user-friendly error messages
    const errorMessage = error.message || '';
    if (errorMessage.includes('declined') || errorMessage.includes('-1')) {
      throw new Error('Wallet authorization was declined. Please try again and approve the connection.');
    } else if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
      throw new Error('Session expired. Please reconnect your wallet.');
    } else {
      throw new Error(errorMessage || 'Failed to reauthorize wallet');
    }
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
