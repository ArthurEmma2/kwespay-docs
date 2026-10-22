---
title: Supported networks and assets
description: Every network key KwesPay accepts, the tokens quoted on each, chain IDs, payment contract addresses and the platform fee per chain.
sidebar:
  order: 4
---

A payment is always made on one **network**, identified by a network key such as `base` or `stellarTestnet`. You pass the key to `createQuote` or the SDK's `quote()`. Mainnet and testnet keys are served by different API endpoints. See [Testnet and mainnet](/getting-started/testnet-vs-mainnet/).

A merchant can only be paid on networks it has enabled in the dashboard, in tokens it accepts, and on chain families for which it has a receiving wallet. The live list, with contracts and fees, is also available from the public `paymentNetworks` query and the SDK's `getNetworks()`. Use [`getMerchantConfig()`](/sdk/methods/#getmerchantconfig) to read that intersection for a specific merchant.

## Mainnet

| Network key | Network | Chain ID | Tokens quoted | Fee |
| --- | --- | --- | --- | --- |
| `ethereum` | Ethereum | 1 | ETH, USDT, USDC | 0.5% |
| `base` | Base | 8453 | ETH, USDC, USDbC, USDT | 0.5% |
| `polygon` | Polygon | 137 | MATIC, USDT, USDC, USDC.e | 0.5% |
| `arbitrum` | Arbitrum One | 42161 | ETH, USDC, USDT | 0.5% |
| `lisk` | Lisk | 1135 | ETH, USDC.e, USDT, LSK | 0.5% |
| `stellarMainnet` | Stellar | n/a | XLM, USDC | 1% |

## Testnet

| Network key | Network | Chain ID | Tokens quoted | Fee |
| --- | --- | --- | --- | --- |
| `sepolia` | Ethereum Sepolia | 11155111 | ETH, USDT, MUSD | 0.5% |
| `baseSepolia` | Base Sepolia | 84532 | ETH, USDC, USDT | 0.5% |
| `polygonAmoy` | Polygon Amoy | 80002 | MATIC, USDT, USDC | 0.5% |
| `arbitrumSepolia` | Arbitrum Sepolia | 421614 | ETH, USDC, ARB, USDT | 0.5% |
| `liskTestnet` | Lisk Sepolia | 4202 | ETH, LSK | 0.5% |
| `mezoTestnet` | Mezo Testnet | 31611 | BTC, MEZO, MUSD, USDT | 0.5% |
| `suiTestnet` | Sui Testnet | n/a | SUI, USDC | 0.5% |
| `stellarTestnet` | Stellar Testnet | n/a | XLM, USDC | 1% |
| `nearTestnet` | NEAR Testnet | n/a | NEAR, USDC, USDC.e, USDT | 1% |

Testnet tokens have no value. The [testnet console](https://console.kwespay.xyz) can fund a Stellar testnet wallet with XLM and USDC, request SUI from the Sui faucet, mint NEAR test tokens, and links to the gas faucets for the EVM testnets.

## Payment contracts

The address the wallet pays is returned by `createTransaction` as `contractAddress`, together with the signature it belongs to. The SDK uses that value ahead of its built-in table, so a contract redeploy does not require an SDK upgrade. The addresses below are the ones in use at the time of writing.

### EVM

| Network | Contract |
| --- | --- |
| `ethereum` | `0x89840Ccfb80cc945DF1009BbB214ffBCE3D9162c` |
| `base` | `0xaD93fCF21c9F75d94B551a5e0eb1E0855ACe2f6C` |
| `polygon` | `0xaD93fCF21c9F75d94B551a5e0eb1E0855ACe2f6C` |
| `lisk` | `0xaD93fCF21c9F75d94B551a5e0eb1E0855ACe2f6C` |
| `arbitrum` | `0xc00d649903aa8834FE04d1aE548Bf86C5928B6B7` |
| `sepolia` | `0xD9312df771aEf74a6748c0C46A706873C67F44C7` |
| `baseSepolia` | `0x3d7A6a7aD72374D2d3dca4e97053bAbFA6E49ec0` |
| `polygonAmoy` | `0xEb40935599d5D8ef39C1aAE38E7A1f6d9c89B3fF` |
| `arbitrumSepolia` | `0xa430B2e0D1273464809f8541286058e90781DA9C` |
| `liskTestnet` | `0x3378B6074A9DA47Aef8b7C849aFcaF58b8D8134b` |
| `mezoTestnet` | `0x67f3Df6B5BE714303F397104d8F2A3861b9E8b6d` |

### Stellar (Soroban contract IDs)

| Network | Contract |
| --- | --- |
| `stellarMainnet` | `CD4PCXKGYXYQKW3NXKQNKLBM2XML6HKHKQ2CTPBTVAGQGPPKTHCWKXTC` |
| `stellarTestnet` | `CBS6TTZ56NSZLH2PSGA4VHNEBDX6JQV3S2J36KVKTWJ55TK7RN2U7IS5` |

### Sui

| Network | Object | ID |
| --- | --- | --- |
| `suiTestnet` | Package | `0xa47e90a44aac41d1e2dca2fe11169f1e67bdd071b242ea3cbcad1a8b4290875f` |
| `suiTestnet` | Registry | `0x1d34689e7090813f8d32cb7e784ab45c6e0afc134993bff95844b440525049d9` |

### NEAR

| Network | Contract | Tokens |
| --- | --- | --- |
| `nearTestnet` | `pay.kwespay.testnet` | NEAR (native), USDC (`3e2210e1…b8af`), USDC.e (`usdc.fakes.testnet`), USDT (`usdt.fakes.testnet`) |

The API resolves the token contract for each symbol and returns it as `tokenAddress` in the quote. A native coin is represented by the zero address on EVM networks.

## Fiat currencies

`fiatCurrency` accepts ISO 4217 codes and defaults to `USD`. Prices are converted at live exchange rates on the KwesPay API. Currencies that KwesPay highlights for African markets are USD, GHS, NGN, KES, ZAR and ZWG. See [Fiat pricing](/merchants/fiat-pricing/).
