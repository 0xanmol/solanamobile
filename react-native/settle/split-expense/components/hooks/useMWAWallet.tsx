import { useMemo } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { useAuthorization } from '../providers/AuthorizationProvider';
import { APP_IDENTITY, SOLANA_CLUSTER } from '@/constants/wallet';

/**
 * MWAWallet interface - Provides wallet adapter for signing transactions
 * Compatible with Solana wallet adapter patterns
 */
export interface MWAWallet {
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signAndSendTransaction: (transaction: Transaction) => Promise<string>;
  publicKey: PublicKey;
}

/**
 * useMWAWallet - Custom hook for Mobile Wallet Adapter operations
 *
 * Provides a wallet adapter interface for signing and sending transactions.
 * Each operation re-authorizes the session to ensure a valid auth token.
 *
 * @returns MWAWallet | null - Returns null if no account is selected
 *
 * @example
 * ```tsx
 * const wallet = useMWAWallet();
 *
 * if (!wallet) {
 *   return <Text>Please connect wallet</Text>;
 * }
 *
 * // Sign a transaction
 * const signedTx = await wallet.signTransaction(transaction);
 *
 * // Sign and send a transaction
 * const signature = await wallet.signAndSendTransaction(transaction);
 * ```
 */
export function useMWAWallet(): MWAWallet | null {
  const { authorization, authorizeSession } = useAuthorization();
  const selectedAccount = authorization?.selectedAccount;

  return useMemo(() => {
    if (!selectedAccount || !authorizeSession) {
      return null;
    }

    return {
      /**
       * Sign a single transaction
       * Re-authorizes the session before signing
       */
      signTransaction: async (transaction: Transaction): Promise<Transaction> => {
        return await transact(async (wallet: Web3MobileWallet) => {
          // Re-authorize to ensure fresh session
          await authorizeSession(wallet);

          const signedTransactions = await wallet.signTransactions({
            transactions: [transaction],
          });

          return signedTransactions[0];
        });
      },

      /**
       * Sign multiple transactions
       * Re-authorizes the session before signing
       */
      signAllTransactions: async (transactions: Transaction[]): Promise<Transaction[]> => {
        return await transact(async (wallet: Web3MobileWallet) => {
          // Re-authorize to ensure fresh session
          await authorizeSession(wallet);

          const signedTransactions = await wallet.signTransactions({
            transactions,
          });

          return signedTransactions;
        });
      },

      /**
       * Sign and send a single transaction
       * Re-authorizes the session before signing and sending
       * Automatically retries with fresh auth if token expired
       * @returns Transaction signature
       */
      signAndSendTransaction: async (transaction: Transaction): Promise<string> => {
        try {
          // First attempt with existing auth token
          return await transact(async (wallet: Web3MobileWallet) => {
            await authorizeSession(wallet);

            const signedTransactions = await wallet.signAndSendTransactions({
              transactions: [transaction],
            });

            return signedTransactions[0];
          });
        } catch (error: any) {
          // Check if error is due to expired/invalid auth
          const errorMessage = error.message || '';
          if (
            errorMessage.includes('CancellationException') ||
            errorMessage.includes('expired') ||
            errorMessage.includes('invalid') ||
            errorMessage.includes('auth')
          ) {
            console.log('Auth token expired, retrying with fresh authorization...');

            // Retry in a completely new transact() session with fresh auth
            return await transact(async (wallet: Web3MobileWallet) => {
              // Force fresh authorization (no cached token)
              await wallet.authorize({
                cluster: SOLANA_CLUSTER,
                identity: APP_IDENTITY,
              });

              // Note: The authorization state will be updated by the next authorizeSession call
              // For now, just proceed with the transaction

              const signedTransactions = await wallet.signAndSendTransactions({
                transactions: [transaction],
              });

              return signedTransactions[0];
            });
          }

          // Not an auth error, rethrow
          throw error;
        }
      },

      /**
       * The public key of the selected account
       */
      publicKey: selectedAccount.publicKey,
    };
  }, [selectedAccount, authorizeSession]);
}
