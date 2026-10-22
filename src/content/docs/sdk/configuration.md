---
title: Client configuration
description: Options for the KwesPayClient constructor, including the API key, the GraphQL endpoint and overrides for Sui and Stellar contract configuration.
sidebar:
  order: 2
---

```ts
import { KwesPayClient } from "@kwespay/client";

const kwespay = new KwesPayClient({
  apiKey: "YOUR_API_KEY",
  graphqlEndpoint: "https://api.testnet.kwespay.xyz/graphql",
});
```

## `KwesPayConfig`

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | Yes | API key from the dashboard. An empty value throws `INVALID_KEY` |
| `graphqlEndpoint` | `string` | No | API endpoint. Defaults to `https://api.kwespay.xyz/graphql` |
| `stellarNetworks` | `Partial<Record<StellarNetworkKey, StellarNetworkConfig>>` | No | Override the Stellar contract ID or Soroban RPC URL |
| `suiNetworks` | `Partial<Record<SuiNetworkKey, SuiNetworkConfig>>` | No | Override the Sui package and registry IDs |
| `nearNetworks` | `Partial<Record<NearNetworkKey, NearNetworkConfig>>` | No | Override the NEAR contract account or RPC URL |

## Each client is independent

Every option is stored on the client instance. A testnet client and a mainnet client can run side by side in the same page or process.

## Contract configuration

You normally do not need the network overrides. The SDK reads networks, contracts, fees and public RPC URLs from the API's `paymentNetworks` query (see [`getNetworks()`](/sdk/methods/#getnetworks)), and `createTransaction` returns the contract the terms were signed for. An override, when set, takes precedence over both.

Set `rpcUrl` if you run your own RPC or need a provider with higher limits:

```ts
new KwesPayClient({
  apiKey: "YOUR_API_KEY",
  stellarNetworks: {
    stellarMainnet: {
      contractId: "CD4PCXKGYXYQKW3NXKQNKLBM2XML6HKHKQ2CTPBTVAGQGPPKTHCWKXTC",
      rpcUrl: "https://your-soroban-rpc.example",
    },
  },
});
```
