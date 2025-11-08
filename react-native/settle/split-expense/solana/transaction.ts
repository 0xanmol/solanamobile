import axios from 'axios';
import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { APP_IDENTITY, SOLANA_CLUSTER } from '@/constants/wallet';
import { getStoredWalletAuth, saveWalletAuth } from '@/apis/auth';
import { reauthorizeWallet } from './wallet';

// Solana RPC endpoint (devnet)
const SOLANA_RPC_ENDPOINT = 'https://api.devnet.solana.com';
const COINGECKO_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';

export interface SendSolResult {
  success: boolean;
  signature?: string;
  message?: string;
}

/**
 * Fetches the current SOL to USD conversion rate from CoinGecko
 */
export const getSolToUsdRate = async (): Promise<number> => {
  try {
    const response = await axios.get(COINGECKO_PRICE_API);
    const rate = response.data.solana.usd;
    if (!rate) {
      throw new Error('Could not fetch SOL to USD rate.');
    }
    console.log(`Current SOL/USD rate: ${rate}`);
    return rate;
  } catch (error) {
    console.error('Error fetching SOL to USD rate:', error);
    const fallbackRate = 50; // Example fallback
    console.warn(`Using fallback SOL/USD rate: ${fallbackRate}`);
    return fallbackRate;
  }
};

/**
 * Converts a USD amount to its SOL equivalent
 */
export const convertUsdToSol = (amountInUsd: number, solToUsdRate: number): number => {
  if (solToUsdRate <= 0) return 0;
  return amountInUsd / solToUsdRate;
};

/**
 * Converts a SOL amount to its USD equivalent
 */
export const convertSolToUsd = (amountInSol: number, solToUsdRate: number): number => {
  return amountInSol * solToUsdRate;
};


/**
 * Send SOL to another wallet address
 * @param toAddress - Recipient's wallet address (pubkey)
 * @param amountInUsd - Amount in USD to send
 * @returns Transaction signature if successful
 */
const isValidSolanaAddress = (address: string): boolean => {
  try {
    if (!address || address.length < 32 || address.length > 44) {
      return false;
    }
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

export const sendSol = async (
  toAddress: string,
  amountInUsd: number
): Promise<SendSolResult> => {
  let cachedAuth = await getStoredWalletAuth();
  if (!cachedAuth) {
    throw new Error('No wallet connected. Please connect your wallet first.');
  }

  if (!isValidSolanaAddress(cachedAuth.address)) {
    throw new Error('Your wallet address is invalid. Please reconnect your wallet.');
  }

  if (!isValidSolanaAddress(toAddress)) {
    throw new Error(
      'Invalid recipient wallet address. The address must be a valid Solana public key (base58 encoded, 32-44 characters).'
    );
  }

  const solPriceInUsd = await getSolToUsdRate();
  if (!solPriceInUsd) {
    throw new Error('Could not determine SOL to USD conversion rate.');
  }

  const amountInSol = convertUsdToSol(amountInUsd, solPriceInUsd);

  const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');

  const fromPubkey = new PublicKey(cachedAuth.address);
  const toPubkey = new PublicKey(toAddress);

  const lamports = Math.floor(amountInSol * LAMPORTS_PER_SOL);

  console.log('Creating SOL transfer transaction:', {
    from: fromPubkey.toBase58(),
    to: toPubkey.toBase58(),
    amountInUsd,
    amountInSol,
    lamports,
  });

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  const transferInstruction = SystemProgram.transfer({
    fromPubkey,
    toPubkey,
    lamports,
  });

  const transaction = new Transaction({
    feePayer: fromPubkey,
    blockhash,
    lastValidBlockHeight,
  }).add(transferInstruction);

  try {
    // Attempt transaction with cached auth
    const signature = await transact(async (wallet: Web3MobileWallet) => {
      await wallet.authorize({
        cluster: SOLANA_CLUSTER,
        identity: APP_IDENTITY,
        auth_token: cachedAuth.authToken,
      });

      const signedTransactions = await wallet.signAndSendTransactions({
        transactions: [transaction],
      });

      return signedTransactions[0];
    });

    console.log('Transaction sent successfully:', signature);

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
    const errorMessage = error.message || '';

    // Check if error is due to expired/invalid auth token
    if (errorMessage.includes('expired') ||
        errorMessage.includes('invalid') ||
        errorMessage.includes('auth') ||
        errorMessage.includes('token')) {
      console.log('Auth token expired, attempting to reauthorize...');

      try {
        // Reauthorize wallet to get fresh token
        const freshAuth = await reauthorizeWallet(cachedAuth.authToken);

        // Save the fresh auth
        await saveWalletAuth({
          address: freshAuth.pubkey,
          authToken: freshAuth.authToken,
        });

        console.log('Wallet reauthorized, retrying transaction...');

        // Retry transaction with fresh auth
        const signature = await transact(async (wallet: Web3MobileWallet) => {
          await wallet.authorize({
            cluster: SOLANA_CLUSTER,
            identity: APP_IDENTITY,
            auth_token: freshAuth.authToken,
          });

          const signedTransactions = await wallet.signAndSendTransactions({
            transactions: [transaction],
          });

          return signedTransactions[0];
        });

        console.log('Transaction sent successfully after reauth:', signature);

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
      } catch (reAuthError: any) {
        console.error('Reauthorization and retry failed:', reAuthError);
        return {
          success: false,
          message: reAuthError.message || 'Failed to send payment after reauthorization',
        };
      }
    }

    // If not an auth error, return the original error
    return {
      success: false,
      message: errorMessage || 'Failed to send payment',
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
