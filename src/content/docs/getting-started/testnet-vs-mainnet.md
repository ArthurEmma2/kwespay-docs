---
title: Testnet and mainnet
description: How the KwesPay testnet and mainnet environments differ, which network keys each accepts, and what has to change when you move an integration to production.
sidebar:
  order: 3
---

KwesPay runs two independent environments. They have separate API endpoints, separate databases, separate dashboards and separate signing keys. Nothing created in one exists in the other.

| | Testnet | Mainnet |
| --- | --- | --- |
| API | `https://api.testnet.kwespay.xyz/graphql` | `https://api.kwespay.xyz/graphql` |
| Dashboard | [app.testnet.kwespay.xyz](https://app.testnet.kwespay.xyz) | [app.kwespay.xyz](https://app.kwespay.xyz) |
| Accounts, merchants, API keys | Testnet only | Mainnet only |
| Funds | Test tokens with no value | Real assets |
| Network keys | `sepolia`, `baseSepolia`, `polygonAmoy`, `arbitrumSepolia`, `liskTestnet`, `mezoTestnet`, `suiTestnet`, `stellarTestnet` | `ethereum`, `base`, `polygon`, `arbitrum`, `lisk`, `stellarMainnet` |
| Developer console | [console.kwespay.xyz](https://console.kwespay.xyz) | None. The console refuses mainnet endpoints |

The SDK's built-in contract table and network types contain both sets of keys, but each API only quotes the networks of its own environment.

## What changes when you go live

1. Create the merchant again on the mainnet dashboard, with mainnet receiving wallets.
2. Generate a mainnet API key.
3. Remove `graphqlEndpoint` from the SDK and `environment: "testnet"` from the widget. Both default to mainnet.
4. Replace testnet network keys with mainnet ones, for example `baseSepolia` with `base` and `stellarTestnet` with `stellarMainnet`.
5. Wallets must be on the matching network. For Stellar, sign with `Networks.PUBLIC` instead of `Networks.TESTNET`.

Work through the [production checklist](/getting-started/production-checklist/) before the first real payment.

## Things that stay the same

The GraphQL operations, the SDK methods, the statuses and the error codes are identical. Fees are set per chain, not per environment: 1% on Stellar and 0.5% on the other supported chains in both environments. See the [fee model](/contracts/fee-model/).
