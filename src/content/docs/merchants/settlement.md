---
title: Settlement
description: How and when a merchant receives funds from a KwesPay payment, in which asset, and and how payments land directly in the merchant's wallet when they settle on-chain.
sidebar:
  order: 4
---

Settlement happens **inside the customer's payment transaction**. When the transaction succeeds on-chain, the merchant's receiving wallet has already been credited.

## What the merchant receives

- **Asset:** the token the customer paid with, on the network it was paid on. A USDC payment on Base arrives as USDC on Base.
- **Amount:** exactly `amountBaseUnits` from the quote. The customer pays the platform fee on top.
- **Destination:** the merchant's receiving wallet for that chain family, as registered in the payment contract.
- **Timing:** as soon as the transaction is final on that chain. KwesPay's `completed` status follows when its listeners have confirmed the event.

## Straight to your wallet

- Every payment lands in the merchant's own wallet the moment it settles. There are no payout cycles, balances or withdrawals to wait for.
- The merchant keeps the token the customer paid with, on the network it was paid on, ready to hold or move as the business chooses.

## Reconciling

Each payment can be traced three ways:

| Identifier | Where it lives |
| --- | --- |
| `transactionReference` | KwesPay's record. Use it in your order system and the dashboard |
| `paymentIdBytes32` | The contract's record and its payment event |
| Transaction hash | The chain. Open it in a block explorer |

To reconcile, match the transaction reference in your order record to the KwesPay status, then match the transaction hash to the credit in the receiving wallet.
