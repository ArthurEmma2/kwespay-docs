---
title: getTransactionStatus
description: Reference for the getTransactionStatus query, which returns the current status of a payment by transaction reference and is the basis for server-side verification.
sidebar:
  order: 4
---

```graphql
query GetTransactionStatus($transactionReference: String!) {
  getTransactionStatus(transactionReference: $transactionReference): Transaction!
}
```

| | |
| --- | --- |
| Type | Query |
| Auth | None |
| SDK | [`getTransactionStatus()`](/sdk/methods/#gettransactionstatus), [`pollTransactionStatus()`](/sdk/methods/#polltransactionstatus) |

Returns the transaction for a reference. If it is still `pending` or `processing` on an EVM network or Sui, the API first checks the chain directly, so a read can move a payment to its final status.

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `transactionReference` | `String!` | From `createTransaction` |

## Response: `Transaction`

| Field | Type | Description |
| --- | --- | --- |
| `transactionReference` | `String!` | The reference you asked for |
| `transactionStatus` | `String!` | One of `pending`, `processing`, `completed`, `underpaid`, `overpaid`, `failed`, `expired`, `refunded` |
| `blockchainHash` | `String` | Payment transaction hash or digest, once known |
| `blockchainNetwork` | `String` | Network key |
| `displayAmount` | `Float!` | Quoted merchant amount in whole tokens |
| `cryptoCurrency` | `String!` | Token symbol |
| `payerWalletAddress` | `String!` | Payer address given to `createTransaction` |
| `initiatedAt` | `DateTime!` | When the transaction was created |
| `vendorInfo` | `Vendor!` | The merchant. Select `vendorIdentifier` to check ownership |

## Example

```graphql
query Status($ref: String!) {
  getTransactionStatus(transactionReference: $ref) {
    transactionStatus
    blockchainHash
    blockchainNetwork
    displayAmount
    cryptoCurrency
    vendorInfo { vendorIdentifier }
  }
}
```

Example response. Values are illustrative.

```json
{
  "data": {
    "getTransactionStatus": {
      "transactionStatus": "completed",
      "blockchainHash": "0xTRANSACTION_HASH",
      "blockchainNetwork": "baseSepolia",
      "displayAmount": 10.0,
      "cryptoCurrency": "USDT",
      "vendorInfo": { "vendorIdentifier": "YOUR_VENDOR_ID" }
    }
  }
}
```

An unknown reference returns the GraphQL error `Transaction not found`.

## Behaviour

- No API key is needed, so the reference itself is the only thing protecting the record. Do not publish references.
- Use it to show progress. To decide whether an order is paid, use [`verifyPayment`](/api/operations/verify-payment/), which also checks the order, amount and currency.
- Once a transaction has a final status, reads return the stored record without checking the chain again.
