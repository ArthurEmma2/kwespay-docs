---
title: Types
description: TypeScript types exported by @kwespay/client, including network and token keys, quote and payment payloads, status results and the wallet adapter interfaces.
sidebar:
  order: 4
---

Import types from the package root:

```ts
import type {
  KwesPayConfig,
  NetworkKey,
  TokenSymbol,
  QuoteParams,
  QuoteResult,
  TransactionPayload,
  TransactionStatus,
  TransactionStatusResult,
  PayParams,
  PaymentResult,
  MerchantConfig,
  EIP1193Provider,
  StellarWalletAdapter,
  SuiWalletAdapter,
  NearWalletAdapter,
  PaymentNetwork,
  KwesPayErrorCode,
} from "@kwespay/client";
```

## Keys

```ts
type EVMNetworkKey =
  | "ethereum" | "sepolia" | "base" | "baseSepolia" | "polygon" | "polygonAmoy"
  | "lisk" | "liskTestnet" | "mezo" | "mezoTestnet" | "arbitrum" | "arbitrumSepolia";
type SuiNetworkKey = "suiTestnet" | "suiMainnet";
type StellarNetworkKey = "stellarTestnet" | "stellarMainnet";
type NearNetworkKey = "nearTestnet";
type NetworkKey = EVMNetworkKey | SuiNetworkKey | StellarNetworkKey | NearNetworkKey | (string & {});

type TokenSymbol =
  | "ETH" | "BTC" | "MATIC" | "POL" | "USDT" | "USDC" | "USDC.E" | "USDBC"
  | "DAI" | "LSK" | "MUSD" | "ARB" | "SUI" | "MEZO" | "XLM" | "NEAR" | (string & {});
```

See [Supported networks](/overview/networks/) for the networks and tokens available in each environment.

## TransactionPayload

Returned by `quote()` and passed to `pay()`.

```ts
interface TransactionPayload {
  paymentIdBytes32: string;
  backendSignature: string;
  tokenAddress: string;
  amountBaseUnits: string;
  totalBaseUnits: string;
  chainId?: number;
  expiresAt: string;
  deadline: number;
  transactionReference: string;
  transactionStatus: TransactionStatus;
  network: NetworkKey;
  vendorIdentifier: string;
  vendorSuiWallet: string | null;
  contractAddress?: string;
  registryObjectId?: string;
}
```

`deadline` is Unix seconds on EVM and Sui, and a ledger sequence on Stellar. The fee is `totalBaseUnits − amountBaseUnits`.

## QuoteResult

Returned by `getQuote()`.

```ts
interface QuoteResult {
  quoteId: number;
  quoteReference: string;
  cryptoCurrency: string;
  tokenAddress: string;
  amountBaseUnits: string;
  totalBaseUnits: string;
  displayAmount: number;
  network: string;
  chainId: number;
  expiresAt: string;
}
```

## TransactionStatus and TransactionStatusResult

```ts
type TransactionStatus =
  | "pending" | "processing" | "completed" | "failed"
  | "expired" | "underpaid" | "overpaid" | "refunded";

interface TransactionStatusResult {
  transactionReference: string;
  transactionStatus: TransactionStatus;
  blockchainHash: string | null;
  blockchainNetwork: string | null;
  displayAmount: number;
  cryptoCurrency: string;
  payerWalletAddress: string;
  initiatedAt: string;
}
```

## MerchantConfig

```ts
interface MerchantConfig {
  vendorIdentifier: string;
  businessName: string;
  enabledNetworks: NetworkKey[];
  networkTokenMap: { network: NetworkKey; tokens: TokenSymbol[]; family: "evm" | "sui" | "stellar" | "near" }[];
  hasEvmWallet: boolean;
  hasSuiWallet: boolean;
  hasStellarWallet: boolean;
  hasNearWallet: boolean;
}
```

## Wallet adapters

```ts
interface EIP1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
}

interface StellarWalletAdapter {
  getAddress(): Promise<{ address: string } | string>;
  signTransaction(
    xdr: string,
    opts?: { networkPassphrase?: string; network?: string },
  ): Promise<{ signedTxXdr: string } | string>;
}

interface SuiWalletAdapter {
  connect(): Promise<{ accounts: Array<{ address: string }> }>;
  accounts?: Array<{ address: string }>;
  signAndExecuteTransactionBlock(params: {
    transactionBlock: unknown;
    options?: { showEffects?: boolean; showEvents?: boolean };
  }): Promise<{ digest: string; effects?: { status?: { status: "success" | "failure"; error?: string } } }>;
}

interface NearWalletAdapter {
  getAccounts(): Promise<Array<{ accountId: string }>>;
  signAndSendTransaction(params: {
    signerId?: string;
    receiverId: string;
    actions: Array<{ type: "FunctionCall"; params: { methodName: string; args: object; gas: string; deposit: string } }>;
  }): Promise<NearTransactionOutcome | void>;
}
```

`StellarWalletAdapter` matches `@stellar/freighter-api`. Wrap other Stellar wallets in an object with these two methods. `NearWalletAdapter` matches a `@near-wallet-selector` wallet once its actions are converted. See [JavaScript SDK](/guides/javascript-sdk/).

## Pay parameters

```ts
interface EVMPayParams {
  provider: EIP1193Provider;
  payload: TransactionPayload;
  onStatus?: (title: string, detail: string) => void;
}

interface StellarPayParams {
  wallet: StellarWalletAdapter;
  payload: TransactionPayload;
  contractId?: string;
  onStatus?: (title: string, detail: string) => void;
}

interface SuiPayParams {
  wallet: SuiWalletAdapter;
  payload: TransactionPayload;
  registryObjectId?: string;
  onStatus?: (title: string, detail: string) => void;
}

interface NearPayParams {
  wallet: NearWalletAdapter;
  payload: TransactionPayload;
  contractId?: string;
  onStatus?: (title: string, detail: string) => void;
}

type PayParams = EVMPayParams | StellarPayParams | SuiPayParams | NearPayParams;
```
