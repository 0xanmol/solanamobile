import { useMemo } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Account, useAuthorization } from '../providers/AuthorizationProvider';

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
       * @returns Transaction signature
       */
      signAndSendTransaction: async (transaction: Transaction): Promise<string> => {
        return await transact(async (wallet: Web3MobileWallet) => {
          // Re-authorize to ensure fresh session
          await authorizeSession(wallet);

          const signedTransactions = await wallet.signAndSendTransactions({
            transactions: [transaction],
          });

          return signedTransactions[0];
        });
      },

      /**
       * The public key of the selected account
       */
      publicKey: selectedAccount.publicKey,
    };
  }, [selectedAccount, authorizeSession]);
}
