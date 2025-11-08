import React, {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { PublicKey } from '@solana/web3.js';
import {
  AuthorizationResult,
  AuthorizedAccount,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_IDENTITY, SOLANA_CLUSTER } from '@/constants/wallet';

/**
 * Account represents a wallet account with its public key
 */
export interface Account {
  address: string; // base58 encoded
  label?: string;
  publicKey: PublicKey;
}

/**
 * Authorization state containing auth token and selected account
 */
export type Authorization = Readonly<{
  accounts: Account[];
  authToken: string;
  selectedAccount: Account;
}>;

export interface AuthorizationProviderProps {
  children: ReactNode;
}

export interface AuthorizationContextState {
  authorization: Authorization | null;
  authorizeSession: (wallet: Web3MobileWallet) => Promise<Account>;
  deauthorizeSession: () => Promise<void>;
  onChangeAccount: (nextAccount: Account) => void;
}

const AuthorizationContext = createContext<AuthorizationContextState>(
  {} as AuthorizationContextState
);

export function useAuthorization(): AuthorizationContextState {
  const context = useContext(AuthorizationContext);
  if (!context) {
    throw new Error('useAuthorization must be used within AuthorizationProvider');
  }
  return context;
}

/**
 * Convert address to base58 string format
 * Handles both base58 strings and Uint8Array/byte array formats
 */
const toBase58String = (address: any): string => {
  try {
    // If it's a Uint8Array or array-like, convert directly
    if (address instanceof Uint8Array || Array.isArray(address)) {
      const pubkey = new PublicKey(address);
      return pubkey.toBase58();
    }

    // If it's a string
    if (typeof address === 'string') {
      // Check if it looks like base64 (contains +, /, or =)
      if (address.includes('+') || address.includes('/') || address.includes('=')) {
        // Decode base64 to Uint8Array
        const binaryString = atob(address);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const pubkey = new PublicKey(bytes);
        return pubkey.toBase58();
      }
      // Otherwise assume it's already base58, validate it
      const pubkey = new PublicKey(address);
      return pubkey.toBase58();
    }

    throw new Error(`Unsupported address format: ${typeof address}`);
  } catch (error) {
    console.error('Error converting address to base58:', error, 'Address:', address);
    throw new Error('Invalid wallet address format');
  }
};

/**
 * Convert AuthorizedAccount from MWA to our Account type
 */
function getAccountFromAuthorizedAccount(account: AuthorizedAccount): Account {
  const address = toBase58String(account.address);
  return {
    address,
    label: account.label,
    publicKey: new PublicKey(address),
  };
}

/**
 * Transform AuthorizationResult to our Authorization type
 */
function getAuthorizationFromAuthorizationResult(
  authorizationResult: AuthorizationResult,
  previousAccount?: Account
): Authorization {
  const accounts = authorizationResult.accounts.map(getAccountFromAuthorizedAccount);

  // If we had a previously selected account, try to keep it selected if still authorized
  let selectedAccount = accounts[0];
  if (previousAccount) {
    const foundAccount = accounts.find(
      (account) => account.address === previousAccount.address
    );
    if (foundAccount) {
      selectedAccount = foundAccount;
    }
  }

  return {
    accounts,
    authToken: authorizationResult.auth_token,
    selectedAccount,
  };
}

/**
 * AuthorizationProvider - Manages wallet authorization state
 *
 * This provider handles:
 * - Initial wallet authorization
 * - Reauthorization with cached tokens
 * - Account selection
 * - Session persistence in AsyncStorage
 * - Deauthorization/logout
 */
export const AuthorizationProvider: FC<AuthorizationProviderProps> = ({ children }) => {
  const [authorization, setAuthorization] = useState<Authorization | null>(null);

  // Load cached authorization on mount
  useEffect(() => {
    const loadCachedAuth = async () => {
      try {
        const cachedAuthData = await AsyncStorage.getItem('wallet_authorization');
        if (cachedAuthData) {
          const parsed = JSON.parse(cachedAuthData);
          // Reconstruct PublicKey objects (they're not preserved in JSON)
          const auth: Authorization = {
            ...parsed,
            accounts: parsed.accounts.map((acc: any) => ({
              ...acc,
              publicKey: new PublicKey(acc.address),
            })),
            selectedAccount: {
              ...parsed.selectedAccount,
              publicKey: new PublicKey(parsed.selectedAccount.address),
            },
          };
          setAuthorization(auth);
        }
      } catch (error) {
        console.error('Failed to load cached authorization:', error);
      }
    };

    loadCachedAuth();
  }, []);

  // Save authorization to AsyncStorage whenever it changes
  useEffect(() => {
    const saveAuth = async () => {
      try {
        if (authorization) {
          await AsyncStorage.setItem('wallet_authorization', JSON.stringify(authorization));
        } else {
          await AsyncStorage.removeItem('wallet_authorization');
        }
      } catch (error) {
        console.error('Failed to save authorization:', error);
      }
    };

    saveAuth();
  }, [authorization]);

  /**
   * Authorize or reauthorize the wallet session
   * Uses cached authToken for reauth if available
   */
  const authorizeSession = useCallback(
    async (wallet: Web3MobileWallet): Promise<Account> => {
      const authorizationResult = await (authorization?.authToken
        ? // Reauthorize with cached token
          wallet.reauthorize({
            auth_token: authorization.authToken,
            cluster: SOLANA_CLUSTER,
            identity: APP_IDENTITY,
          })
        : // Initial authorization
          wallet.authorize({
            cluster: SOLANA_CLUSTER,
            identity: APP_IDENTITY,
          }));

      const nextAuthorization = getAuthorizationFromAuthorizationResult(
        authorizationResult,
        authorization?.selectedAccount
      );

      setAuthorization(nextAuthorization);
      return nextAuthorization.selectedAccount;
    },
    [authorization]
  );

  /**
   * Deauthorize the wallet session
   */
  const deauthorizeSession = useCallback(async () => {
    if (!authorization) {
      return;
    }

    // Import transact here to avoid circular dependencies
    const { transact } = await import('@solana-mobile/mobile-wallet-adapter-protocol-web3js');

    try {
      await transact(async (wallet: Web3MobileWallet) => {
        await wallet.deauthorize({ auth_token: authorization.authToken });
      });
    } catch (error) {
      console.error('Deauthorization error:', error);
      // Continue to clear state even if deauthorize fails
    }

    setAuthorization(null);
  }, [authorization]);

  /**
   * Change the selected account
   */
  const onChangeAccount = useCallback(
    (nextAccount: Account) => {
      if (!authorization) {
        return;
      }

      // Verify the account exists in the authorized accounts
      const accountExists = authorization.accounts.some(
        (account) => account.address === nextAccount.address
      );

      if (!accountExists) {
        console.error('Attempted to select unauthorized account');
        return;
      }

      setAuthorization({
        ...authorization,
        selectedAccount: nextAccount,
      });
    },
    [authorization]
  );

  const value: AuthorizationContextState = {
    authorization,
    authorizeSession,
    deauthorizeSession,
    onChangeAccount,
  };

  return <AuthorizationContext.Provider value={value}>{children}</AuthorizationContext.Provider>;
};
