---
title: Payment statuses
description: Every KwesPay transaction status, how a payment moves between them, which statuses are final and how merchants should handle each one.
sidebar:
  order: 3
---

## Lifecycle

```text
pending ──► processing ──► completed | underpaid | overpaid
   │             │
   │             ├──► failed
   └─────────────┴──► expired
```

| Status | Final | Meaning | Merchant action |
| --- | --- | --- | --- |
| `pending` | No | Signed terms issued. No transaction reported yet | Wait |
| `processing` | No | A transaction hash was reported and is being confirmed | Wait. Recheck later if polling stops |
| `completed` | Yes | The on-chain payment matched the quote | Fulfil the order once |
| `underpaid` | Yes | Confirmed on-chain, but the merchant received less than quoted, beyond a 0.1% tolerance | Hold the order and review |
| `overpaid` | Yes | Confirmed on-chain, but the merchant received more than quoted, beyond a 0.1% tolerance | Fulfil, and review the difference |
| `failed` | Yes | An on-chain payment event did not match the transaction's merchant wallet or token | Review before fulfilling or refunding |
| `expired` | Yes | No payment was recorded within the 15-minute window | Offer a new quote |
| `refunded` | Yes | The merchant refunded the payment from its own wallet and recorded it | Reverse fulfilment if needed |

## Who sets each status

- `pending` is set when `createTransaction` succeeds.
- `processing` is set when a transaction hash is submitted.
- `completed`, `underpaid` and `overpaid` are set only by KwesPay's chain listeners and the confirmation checks that read the chain. No API call or dashboard action can set them.
- `failed` is set by the chain listeners when a payment event does not match the expected merchant wallet or token.
- `expired` is set by KwesPay's background reconciler after it confirms on-chain that nothing was paid. If a payment confirms later, KwesPay records it as `completed` automatically.

## Why underpaid and overpaid are rare

The contracts charge exactly the signed amount, so the merchant normally receives exactly `amountBaseUnits`. On Stellar a matched payment is recorded as `completed`. The tolerance comparison on EVM networks and Sui is a safeguard against mismatches between the quote and what the chain reports.
