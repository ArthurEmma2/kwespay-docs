---
title: Error codes
description: Every KwesPayError code thrown by @kwespay/client, what triggers it and how to respond, with the class definition and the codes added in 0.1.27.
sidebar:
  order: 5
---

The SDK throws `KwesPayError`, a subclass of `Error`:

```ts
class KwesPayError extends Error {
  readonly name: "KwesPayError";
  readonly code: KwesPayErrorCode;
  readonly cause?: unknown;
}
```

`cause` holds the underlying error, such as the wallet's rejection or the failed `fetch`, when there is one.

| Code | Thrown when | Respond by |
| --- | --- | --- |
| `INVALID_KEY` | No API key in the constructor, or the API rejected the key | Fix the key or its scope |
| `QUOTE_EXPIRED` | The quote expired | Request a new quote |
| `QUOTE_USED` | The quote already has a transaction | Request a new quote |
| `QUOTE_NOT_FOUND` | Unknown quote ID | Request a new quote |
| `MERCHANT_NOT_FOUND` | Unknown or inactive vendor ID (0.1.27) | Check the vendor ID and its status |
| `NETWORK_NOT_ENABLED` | The merchant has not enabled the network (0.1.27) | Enable it or stop offering it |
| `TOKEN_NOT_SUPPORTED` | Token not offered on the network (0.1.27) | Offer only tokens from `getMerchantConfig()` |
| `WALLET_REJECTED` | The customer rejected the payment, or the wrong wallet type was passed to `pay()` | Let the customer retry. Check `provider` vs `wallet` |
| `APPROVAL_REJECTED` | The customer rejected the ERC-20 approval | Let the customer retry |
| `INSUFFICIENT_BALANCE` | Not enough tokens or gas | Ask the customer to fund the wallet |
| `WRONG_NETWORK` | The EVM wallet is on another chain and could not switch | Ask the customer to switch manually |
| `CONTRACT_ERROR` | The contract call reverted, simulation failed or the receipt timed out | Check the status before retrying |
| `TRANSACTION_FAILED` | The payload is incomplete or invalid, or a wallet message was rejected by the API | Request a new quote |
| `NETWORK_ERROR` | `fetch` failed or the API returned a non-2xx HTTP status | Retry with backoff |
| `WEBHOOK_SIGNATURE_INVALID` | `verifyWebhook()` found a missing, wrong or expired signature | Respond with HTTP 400 and do not process the event |
| `UNKNOWN` | Anything else, including GraphQL errors and polling timeouts | Read `message` |

See [Error handling](/guides/error-handling/) for recovery patterns.
