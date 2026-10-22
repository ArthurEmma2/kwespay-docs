---
title: Payment link checkout
description: The public GraphQL operations behind a payment link page, used to read a link, price it, start a checkout and follow its status.
sidebar:
  order: 8
---

These operations power the hosted payment link page. They need no API key: the link's slug is public, and each checkout returns its own short-lived token.

| Operation | Type | Purpose | Limit |
| --- | --- | --- | --- |
| `publicPaymentLink(slug)` | Query | Read the link, its merchant branding, state and payment options | 120/min per IP |
| `previewPaymentLinkQuote(input)` | Mutation | Price an amount in a token before the customer connects a wallet | 12/min per IP |
| `startPaymentLinkCheckout(input)` | Mutation | Create the signed payment for the customer's wallet | 12/min per IP, 60/min per link |
| `paymentLinkCheckoutStatus(slug, transactionReference, checkoutToken)` | Query | Follow the payment to its final status | 240/min per IP |

## Flow

```graphql
mutation Start($input: StartPaymentLinkCheckoutInput!) {
  startPaymentLinkCheckout(input: $input) {
    success
    message
    code
    checkoutToken
    resumed
    payment { transaction { transactionReference } backendSignature paymentIdBytes32 totalBaseUnits deadline contractAddress }
  }
}
```

`StartPaymentLinkCheckoutInput`:

| Field | Required | Description |
| --- | --- | --- |
| `slug` | Yes | The link's slug |
| `network`, `token` | Yes | One of the link's `options` |
| `payerWalletAddress` | Yes | The paying wallet |
| `idempotencyKey` | Yes | A random value per attempt. Retrying with the same key resumes the same payment (`resumed: true`) |
| `amount` | Flexible links | Decimal string in the link's currency, within its minimum and maximum |
| `customerName`, `customerEmail`, `customerReference` | When the link requires them | |
| `quoteId` | No | From `previewPaymentLinkQuote`, to pay the price the customer was shown |

`payment` has the same fields as [`createTransaction`](/api/operations/create-transaction/). Submit it with the customer's wallet, then call [`submitTransactionHash`](/api/operations/submit-transaction-hash/) with `checkoutToken` in the `X-API-Key` header, and poll `paymentLinkCheckoutStatus` until `paid` is `true` or the status is final. `redirectUrl` is returned once the payment is paid.

## Error codes

`startPaymentLinkCheckout` returns `success: false` with a `code`:

| Code | Meaning |
| --- | --- |
| `NOT_FOUND` | No such link |
| `INACTIVE`, `EXPIRED`, `COMPLETED`, `UNAVAILABLE` | The link isn't accepting payments |
| `IN_PROGRESS` | Someone else is paying this single-use link |
| `ATTEMPT_ENDED` | The checkout being resumed has expired. Start a new one |
| `INVALID_AMOUNT`, `INVALID_CUSTOMER` | Fix the input and retry |
| `UNSUPPORTED_OPTION` | The network and token aren't accepted by this link |
| `INVALID_REQUEST`, `CONFLICT` | Refresh the link and try again |
| `PAYMENT_UNAVAILABLE` | Pricing or signing failed. `message` explains why |
| `RATE_LIMITED` | Wait and retry |
