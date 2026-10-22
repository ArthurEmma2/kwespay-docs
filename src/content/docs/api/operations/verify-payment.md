---
title: verifyPayment
description: Reference for the verifyPayment query, which tells your server whether a payment is confirmed for a specific order, amount and currency.
sidebar:
  order: 5
---

```graphql
query VerifyPayment(
  $transactionReference: String!
  $expectedAmount: Float!
  $expectedCurrency: String!
  $orderReference: String
) {
  verifyPayment(
    transactionReference: $transactionReference
    expectedAmount: $expectedAmount
    expectedCurrency: $expectedCurrency
    orderReference: $orderReference
  ): VerifyPayment!
}
```

| | |
| --- | --- |
| Type | Query |
| Auth | `X-API-Key` header |
| SDK | [`verifyPayment()`](/sdk/methods/#verifypayment) |

Answers one question: can this order be fulfilled? Call it from your server before shipping goods or granting access.

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `transactionReference` | `String!` | From the widget result, the `kwespay:result` event or `createTransaction` |
| `expectedAmount` | `Float!` | The order total in fiat |
| `expectedCurrency` | `String!` | The order currency, ISO 4217 |
| `orderReference` | `String` | The order ID passed to checkout as `orderId` |

## Response: `VerifyPayment`

| Field | Type | Description |
| --- | --- | --- |
| `paid` | `Boolean!` | Safe to fulfil the order |
| `reason` | `String` | Why `paid` is `false`. `null` when paid |
| `transactionReference` | `String!` | The reference you asked for |
| `transactionStatus` | `String!` | `pending`, `processing`, `completed`, `underpaid`, `overpaid`, `failed`, `expired` or `refunded` |
| `orderReference` | `String` | Order ID the payment was created for |
| `fiatAmount` | `Float` | Quoted fiat amount |
| `fiatCurrency` | `String` | Quoted fiat currency |
| `cryptoCurrency` | `String!` | Token paid |
| `displayAmount` | `Float!` | Amount the merchant receives, in whole tokens |
| `blockchainNetwork` | `String` | Network key |
| `blockchainHash` | `String` | Transaction hash or digest |
| `vendorIdentifier` | `String!` | Merchant vendor ID |
| `initiatedAt` | `DateTime!` | When the payment was created, in UTC |

## Example

```http
POST /graphql HTTP/1.1
Host: api.kwespay.xyz
Content-Type: application/json
X-API-Key: YOUR_API_KEY

{
  "query": "query V($ref: String!, $amt: Float!, $cur: String!, $order: String) { verifyPayment(transactionReference: $ref, expectedAmount: $amt, expectedCurrency: $cur, orderReference: $order) { paid reason transactionStatus } }",
  "variables": { "ref": "TRANSACTION_REFERENCE", "amt": 120, "cur": "GHS", "order": "1042" }
}
```

```json
{
  "data": {
    "verifyPayment": {
      "paid": true,
      "reason": null,
      "transactionStatus": "completed"
    }
  }
}
```

## Behaviour

- A reference that does not exist and a reference that belongs to a merchant your key cannot access both return `Transaction not found`.
- `paid` is `true` for `completed` and `overpaid`. It is `false` for every other status.
- The amount comparison allows a difference of up to 0.005 for rounding.
- Payments still `pending` or `processing` are checked against the chain before the answer is returned.
