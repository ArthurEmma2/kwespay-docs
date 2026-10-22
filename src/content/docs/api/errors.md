---
title: API errors
description: The error messages returned by the KwesPay GraphQL payment operations, what each one means and how the SDK maps them to error codes.
sidebar:
  order: 4
---

## Two shapes of error

**Payload errors.** `createQuote` and `createTransaction` return `success: false` and a `message`:

```json
{
  "data": {
    "createQuote": {
      "success": false,
      "message": "Invalid or expired access key: Access key not found. Please check your API key or generate a new one at https://app.kwespay.xyz",
      "quoteId": null
    }
  }
}
```

**GraphQL errors.** Other operations return an `errors` array:

```json
{
  "data": null,
  "errors": [{ "message": "Transaction not found", "path": ["getTransactionStatus"] }]
}
```

Rate limiting is an HTTP error: status `429` with a `Retry-After` header.

## createQuote messages

| Message | Cause | SDK code |
| --- | --- | --- |
| `Access key required. Provide X-API-Key header…` | No `X-API-Key` header | `INVALID_KEY` |
| `Invalid or expired access key: …` | Unknown, inactive or expired key, or key not valid for this merchant, network or token | `QUOTE_EXPIRED` (see note) |
| `Network '<network>' has no contract configured` | The network key is not available in this environment | `UNKNOWN` |
| `<TOKEN> not supported on <network>` | The token is not offered on that network | `TOKEN_NOT_SUPPORTED` |
| `Vendor not found` | Unknown vendor ID | `MERCHANT_NOT_FOUND` |
| `Vendor account is not active` | The merchant is deactivated | `UNKNOWN` |
| `Vendor has not enabled <network>. …` | The merchant has not enabled the network or lacks a wallet for it | `NETWORK_NOT_ENABLED` |
| `fiat_amount must be positive` | Amount is zero or negative | `UNKNOWN` |
| `Could not fetch price for <TOKEN>. Please try again.` | No price or exchange rate available right now | `UNKNOWN` |
| `An unexpected error occurred. Please try again.` | Server error | `UNKNOWN` |

## createTransaction messages

| Message | Cause | SDK code |
| --- | --- | --- |
| `quote_id is required. Call createQuote first.` | Missing quote ID | `UNKNOWN` |
| `Quote not found. …` | Unknown quote ID | `QUOTE_NOT_FOUND` |
| `Quote is no longer valid (status: …).` | The quote was used or expired | `QUOTE_EXPIRED` if the status is `expired`, otherwise `UNKNOWN` |
| `Quote has expired. Please call createQuote again.` | More than 10 minutes since the quote | `QUOTE_EXPIRED` |
| `This quote has already been used for a transaction.` | A transaction already exists for the quote | `QUOTE_USED` |
| `payer_wallet_address is required` | Empty payer address | `UNKNOWN` |
| `Vendor has not enabled <network>. …` | Merchant configuration changed since the quote | `UNKNOWN` |
| `Payment signing failed. Please try again.` | The API could not sign the terms | `UNKNOWN` |
| `Access key required…` or `Invalid or expired access key: …` | Missing or rejected key | `INVALID_KEY` or `QUOTE_EXPIRED` (see note) |

## submitTransactionHash and getTransactionStatus errors

| Message | Cause |
| --- | --- |
| `Transaction reference is required` | Empty reference |
| `Transaction hash is required` | Empty hash |
| `Transaction not found` | Unknown reference, or a reference from the other environment |
| `Transaction already completed` | The hash was submitted after the payment was confirmed |
| `Access key validation failed: …` | Missing or invalid key on `submitTransactionHash` |

The SDK sets codes from message keywords, so a code can be broader than the message. Use the message for diagnosis and the code for control flow. See [SDK error codes](/sdk/errors/).
