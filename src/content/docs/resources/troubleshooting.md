---
title: Troubleshooting
description: Causes and fixes for the most common KwesPay integration problems, from rejected API keys and missing networks to wallet, balance and confirmation issues.
sidebar:
  order: 1
---

## Quotes fail

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Access key required` | No `X-API-Key` header | Pass `apiKey` to the SDK or widget |
| `Invalid or expired access key` | Wrong key, expired key, or a key from the other environment | Check the key with `validateKey()`. Use testnet keys with the testnet API only |
| `QUOTE_EXPIRED` on a brand-new quote | The SDK maps a rejected key to this code | Read `err.message`. See [API errors](/api/errors/) |
| `Vendor has not enabled <network>` | Network not enabled, or no receiving wallet for that chain family | Enable it and add the wallet in the dashboard |
| `<TOKEN> not supported on <network>` | The token is not offered on that network | Use a pair from [Supported networks](/overview/networks/) and `getMerchantConfig()` |
| `Network '<network>' has no contract configured` | Network key from the other environment, or `mezo` or `suiMainnet` on mainnet | Use a network key that the environment supports |
| `Could not fetch price` | Price or exchange-rate provider unavailable, or an unsupported currency code | Retry. Check the currency code |
| `Vendor not found` | Wrong vendor ID, or a vendor from the other environment | Copy the vendor ID from the right dashboard |

## The wallet step fails

| Symptom | Fix |
| --- | --- |
| `WRONG_NETWORK` | The wallet could not switch chains, often because the network is not added. Add it in the wallet, then retry |
| `INSUFFICIENT_BALANCE` | The wallet needs `totalBaseUnits` of the token plus gas in the network's native coin |
| `WALLET_REJECTED` straight away | `provider` was passed for a Stellar or Sui network, or `wallet` for an EVM network |
| Freighter shows the wrong network | Set Freighter to Testnet or Mainnet to match the network key, and sign with the matching passphrase |
| Stellar payment fails for an unfunded account | Fund the account with XLM. On testnet use Friendbot through the [testnet console](https://console.kwespay.xyz) |
| Stellar USDC payment fails | Add the USDC trustline to the payer account |

## The payment never confirms

1. Confirm the transaction succeeded in a block explorer.
2. Read the status with `getTransactionStatus`. If it is `pending`, the hash was never reported. Call `submitTransactionHash()` with the hash.
3. EVM confirmations wait for several blocks behind the chain tip, so allow time on slower networks.
4. If it is `expired` but the transaction succeeded, follow [Payment statuses](/merchants/payment-statuses/#lifecycle).

## "Access key not found"

The key and the API belong to different environments. Testnet keys work only with `environment: "testnet"` (or `data-kwespay-environment="testnet"`), and mainnet keys only without it.

## "vendorIdentifier is required"

The API key can access more than one merchant. Pass `vendorId` to the widget, or `data-kwespay-vendor` on the script tag.

## HTTP 429

You have exceeded 200 requests per minute from one IP. Wait for the number of seconds in `Retry-After`, and reduce polling frequency.
