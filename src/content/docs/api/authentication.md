---
title: Authentication
description: How KwesPay API keys authenticate payment requests through the X-API-Key header, how key scope limits networks and tokens, and how to keep keys safe.
sidebar:
  order: 2
---

Payment operations that create or change a payment require an **API key** in the `X-API-Key` header.

```http
POST /graphql HTTP/1.1
Host: api.kwespay.xyz
Content-Type: application/json
X-API-Key: YOUR_API_KEY
```

| Operation | Requires `X-API-Key` |
| --- | --- |
| `createQuote` | Yes |
| `createTransaction` | Yes |
| `submitTransactionHash` | Yes |
| `verifyPayment` | Yes |
| `getTransactionStatus` | No |
| `validateAccessKey` | No. The key is passed as an argument |
| `getVendor` | No |

## What the key authorises

On every protected call the API checks that the key:

- exists, is active and has not expired;
- belongs to the account that owns the merchant in the request;
- covers the requested network and token, when the key has a scope.

A missing key returns `Access key required. Provide X-API-Key header with a valid API key.` An unknown or expired key returns `Invalid or expired access key: …`. Both arrive as `success: false` on quotes and transactions.

## Scope

When you create a key in the dashboard you can restrict it to networks and tokens. [`validateAccessKey`](/api/operations/validate-access-key/) returns the scope as `allowedNetworks`, `allowedTokens` and `allowedVendors`. A `null` list means no restriction on that dimension.

## Environments

Keys are created per environment. A testnet key is unknown to the mainnet API, and a mainnet key is unknown to the testnet API.

## Keeping keys safe

API keys are publishable: the widget and the browser SDK use them in your page. A key can only create quotes and transactions for your merchants. It cannot change where money goes, because the receiving wallet comes from the merchant record and the terms are signed by KwesPay. Even so:

- Restrict each key to the networks and tokens your checkout offers.
- Use separate keys for separate sites, so you can revoke one without affecting the others.
- Decide that an order is paid only with [`verifyPayment`](/api/operations/verify-payment/) from your server, never from a browser result.
- Never put a dashboard password, wallet recovery phrase or private key anywhere near your integration.

The merchant dashboard uses a separate login session with `Authorization: Bearer` tokens. Those are not API keys and should never be used in an integration.
