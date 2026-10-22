---
title: createTransaction
description: Reference for the createTransaction mutation, which turns a quote into signed payment terms for the payer's wallet and returns the transaction reference.
sidebar:
  order: 2
---

```graphql
mutation CreateTransaction($input: CreateTransactionInput!) {
  createTransaction(input: $input): PaymentTransactionResponse!
}
```

| | |
| --- | --- |
| Type | Mutation |
| Auth | `X-API-Key` header |
| SDK | Called by [`quote()`](/sdk/methods/#quote) |
| Next step | The wallet submits the terms to the [payment contract](/contracts/) |

Uses a quote to create a transaction, marks the quote as used, generates a payment ID and signs the payment terms for the target contract. The transaction expires after **15 minutes** if no payment arrives.

## Input: `CreateTransactionInput`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `quoteId` | `Int!` | Yes | From `createQuote` |
| `payerWalletAddress` | `String!` | Yes | Address that will pay. On Stellar it is part of the signed message, so only this address can submit the payment |

The input type also declares `vendorIdentifier`, `transactionAmount`, `cryptoCurrency` and `network`. They are ignored: the values always come from the quote.

## Response: `PaymentTransactionResponse`

| Field | Type | Description |
| --- | --- | --- |
| `success` | `Boolean!` | `false` when no transaction was created |
| `message` | `String!` | Result or failure reason |
| `paymentIdBytes32` | `String` | Payment ID stored by the contract |
| `backendSignature` | `String` | KwesPay's signature over the payment terms |
| `tokenAddress` | `String` | Token identifier |
| `amountBaseUnits` | `String` | Amount the merchant receives |
| `totalBaseUnits` | `String` | Amount the customer pays |
| `chainId` | `Int` | EVM chain ID. `0` for Sui and Stellar |
| `deadline` | `Int` | Signature deadline. Unix seconds on EVM and Sui, a **ledger sequence** on Stellar |
| `expiresAt` | `String` | Transaction expiry, ISO 8601 in UTC |
| `contractAddress` | `String` | Contract the terms were signed for: EVM address, Sui package ID or Stellar contract ID |
| `registryObjectId` | `String` | Sui registry object ID. `null` on other chains |
| `transaction` | `Transaction` | Includes `transactionReference`, `transactionStatus` (`pending`) and `vendorInfo` |

Keep `transactionReference`. It is how you read and verify the payment later.

## Example

```graphql
mutation CreateTransaction($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    success
    message
    paymentIdBytes32
    backendSignature
    tokenAddress
    amountBaseUnits
    totalBaseUnits
    chainId
    deadline
    expiresAt
    contractAddress
    registryObjectId
    transaction {
      transactionReference
      transactionStatus
      vendorInfo { vendorIdentifier }
    }
  }
}
```

```json title="Variables"
{ "input": { "quoteId": 1042, "payerWalletAddress": "PAYER_WALLET_ADDRESS" } }
```

## Behaviour

- Use `contractAddress` from this response, not a hard-coded address. The signature is only valid for that contract.
- Never change any returned value before submitting it. The contract recomputes the signed message and rejects the payment if anything differs.
- A quote can be used once. Calling `createTransaction` twice with the same `quoteId` fails with `This quote has already been used for a transaction.`

Failure messages are listed in [API errors](/api/errors/#createtransaction-messages).
