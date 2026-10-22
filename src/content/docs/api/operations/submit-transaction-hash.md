---
title: submitTransactionHash
description: Reference for the submitTransactionHash mutation, which reports the broadcast transaction hash so KwesPay can confirm the payment faster.
sidebar:
  order: 3
---

```graphql
mutation SubmitTransactionHash($input: SubmitTransactionHashInput!) {
  submitTransactionHash(input: $input): Transaction!
}
```

| | |
| --- | --- |
| Type | Mutation |
| Auth | `X-API-Key` header with an API key authorised for the transaction's merchant, or the `checkoutToken` of a [payment link checkout](/api/operations/payment-link-checkout/) |
| SDK | Called automatically by [`pay()`](/sdk/methods/#pay). Also available as [`submitTransactionHash()`](/sdk/methods/#submittransactionhash) |

Records the transaction hash, sets the status to `processing` and, on EVM networks, checks the transaction receipt immediately. This makes confirmation faster. It does not confirm the payment by itself: the status only becomes `completed` once the on-chain payment event has been verified.

## Input: `SubmitTransactionHashInput`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `transactionReference` | `String!` | Yes | From `createTransaction` |
| `txHash` | `String!` | Yes | Hash (EVM, Stellar, NEAR) or digest (Sui) of the payment transaction. 20 to 128 letters and digits, with an optional `0x` prefix |

## Response

The updated transaction. Select the same fields as [`getTransactionStatus`](/api/operations/get-transaction-status/).

```graphql
mutation SubmitTransactionHash($input: SubmitTransactionHashInput!) {
  submitTransactionHash(input: $input) {
    transactionReference
    transactionStatus
    blockchainHash
    blockchainNetwork
  }
}
```

## Behaviour

- Skipping this call does not lose the payment. KwesPay's listeners find it from the chain, more slowly.
- Submitting after the payment is `completed` returns the error `Transaction already completed`.
- A hash already recorded for another transaction on the same network is rejected.
- The SDK calls this for you and ignores its failure, so a successful payment is never reported as failed because this call failed.
