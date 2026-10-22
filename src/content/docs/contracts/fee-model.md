---
title: Fee model
description: How the KwesPay platform fee is set, computed and charged on each chain, who pays it, and how to read the exact fee for any payment.
sidebar:
  order: 5
---

KwesPay charges a platform fee on each payment. The **customer pays it on top of the price**: the merchant receives the full quoted amount, and the customer's total is the amount plus the fee.

| Chain | Fee |
| --- | --- |
| Stellar (`stellarMainnet`, `stellarTestnet`) | 1% (100 basis points) |
| NEAR (`nearTestnet`) | 1% (100 basis points) |
| EVM networks | 0.5% (50 basis points) |
| Sui (`suiTestnet`) | 0.5% (50 basis points) |

## How it is computed

Every contract computes the fee from the merchant amount with integer division:

```text
fee   = amount * fee_bps / 10000
total = amount + fee
```

The fee is rounded down to the token's base unit. The contract, not the client, computes and transfers it, and the KwesPay API mirrors the same formula so that `totalBaseUnits` in a quote matches what the contract will charge.

## Reading the fee

Do not compute the fee yourself. Read it from the quote or transaction:

```ts
const fee = BigInt(payload.totalBaseUnits) - BigInt(payload.amountBaseUnits);
```

## Who sets it

The fee is stored in each contract and changed by the KwesPay administrator. Every contract caps it at 10% (1000 basis points). On the EVM contract, a fee **increase** is first proposed on-chain, with a `PlatformFeeProposed` event, and can only be applied 24 hours later. Decreases apply immediately.

Fees are a business setting and may change. The API response is always the authoritative figure for a specific payment.

## Who receives it

The fee goes to the fee recipient configured in the contract, in the token the customer paid with, in the same transaction as the merchant's payment. Network gas or transaction fees are separate and are paid by the customer to the network.
