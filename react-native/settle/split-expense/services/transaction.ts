/**
 * Transaction service for Solana payments
 */

import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { APP_IDENTITY, SOLANA_CLUSTER } from '@/constants/wallet';
import { getStoredWalletAuth } from '@/apis/auth';

// Solana RPC endpoint (devnet)
const SOLANA_RPC_ENDPOINT = 'https://api.devnet.solana.com';

export interface SendSolResult {
  success: boolean;
  signature?: string;
  message?: string;
}

/**
 * Send SOL to another wallet address
 * @param toAddress - Recipient's wallet address (pubkey)
 * @param amountInSol - Amount in SOL (e.g., 0.5 for half a SOL)
 * @returns Transaction signature if successful
 */
/**
 * Validate if a string is a valid Solana public key
 */
const isValidSolanaAddress = (address: string): boolean => {
  try {
    // Check basic format
    if (!address || address.length < 32 || address.length > 44) {
      return false;
    }
    // Try to create a PublicKey - will throw if invalid
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

export const sendSol = async (
  toAddress: string,
  amountInSol: number
): Promise<SendSolResult> => {
  try {
    // Get cached wallet auth
    const cachedAuth = await getStoredWalletAuth();
    if (!cachedAuth) {
      throw new Error('No wallet connected. Please connect your wallet first.');
    }

    // Validate addresses
    if (!isValidSolanaAddress(cachedAuth.address)) {
      throw new Error('Your wallet address is invalid. Please reconnect your wallet.');
    }

    if (!isValidSolanaAddress(toAddress)) {
      throw new Error(
        'Invalid recipient wallet address. The address must be a valid Solana public key (base58 encoded, 32-44 characters).'
      );
    }

    // Create connection to Solana
    const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');

    // Convert addresses to PublicKey
    const fromPubkey = new PublicKey(cachedAuth.address);
    const toPubkey = new PublicKey(toAddress);

    // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
    const lamports = Math.floor(amountInSol * LAMPORTS_PER_SOL);

    console.log('Creating SOL transfer transaction:', {
      from: fromPubkey.toBase58(),
      to: toPubkey.toBase58(),
      amount: amountInSol,
      lamports,
    });

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    // Create transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    });

    // Create transaction
    const transaction = new Transaction({
      feePayer: fromPubkey,
      blockhash,
      lastValidBlockHeight,
    }).add(transferInstruction);

    // Sign and send transaction using Mobile Wallet Adapter
    const signature = await transact(async (wallet: Web3MobileWallet) => {
      // Reauthorize with cached token
      await wallet.authorize({
        cluster: SOLANA_CLUSTER,
        identity: APP_IDENTITY,
        auth_token: cachedAuth.authToken,
      });

      // Sign and send transaction
      const signedTransactions = await wallet.signAndSendTransactions({
        transactions: [transaction],
      });

      return signedTransactions[0];
    });

    console.log('Transaction sent successfully:', signature);

    // Wait for confirmation
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });

    if (confirmation.value.err) {
      throw new Error('Transaction failed: ' + JSON.stringify(confirmation.value.err));
    }

    return {
      success: true,
      signature,
      message: 'Payment sent successfully',
    };
  } catch (error: any) {
    console.error('Send SOL error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send payment',
    };
  }
};

/**
 * Get SOL balance for an address
 */
export const getSolBalance = async (address: string): Promise<number> => {
  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');
    const pubkey = new PublicKey(address);
    const balance = await connection.getBalance(pubkey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Get balance error:', error);
    return 0;
  }
};
