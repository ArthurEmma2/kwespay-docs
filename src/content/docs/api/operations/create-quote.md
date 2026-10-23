---
title: createQuote
description: Reference for the createQuote mutation, which prices a fiat amount in a token on one network for a merchant and returns a quote valid for 10 minutes.
sidebar:
  order: 1
---

```graphql
mutation CreateQuote($input: CreateQuoteInput!) {
  createQuote(input: $input): QuoteResponse!
}
```

| | |
| --- | --- |
| Type | Mutation |
| Auth | `X-API-Key` header |
| SDK | [`getQuote()`](/sdk/methods/#getquote), or [`quote()`](/sdk/methods/#quote) which also calls `createTransaction` |
| Next step | [`createTransaction`](/api/operations/create-transaction/) |

Prices `fiatAmount` in `cryptoCurrency` on `network` at current rates and stores the result as a quote. The quote is valid for **10 minutes** and can be used for **one** transaction.

## Input: `CreateQuoteInput`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `vendorIdentifier` | `String` | No | The merchant's vendor ID. Optional when the API key belongs to one merchant |
| `fiatAmount` | `Float!` | Yes | Amount to charge in `fiatCurrency`. Must be greater than 0 |
| `fiatCurrency` | `String` | No | ISO 4217 code. Defaults to `USD` |
| `cryptoCurrency` | `String!` | Yes | Token symbol, such as `USDC` or `XLM`. Case-insensitive |
| `network` | `String` | Recommended | Network key, such as `base` or `stellarTestnet`. If omitted, the API uses its environment's default network. Always set it |
| `orderReference` | `String` | No | Your order ID, 1 to 128 printable characters. Returned by `verifyPayment` and `getTransactionStatus` |

The API key must authorise the merchant, network and token. The merchant must be active, have the network enabled and have a receiving wallet for its chain family.

## Response: `QuoteResponse`

| Field | Type | Description |
| --- | --- | --- |
| `success` | `Boolean!` | `false` when the quote was not created |
| `message` | `String!` | Result or failure reason |
| `quoteId` | `Int` | Pass to `createTransaction` |
| `quoteReference` | `String` | UUID for the quote |
| `cryptoCurrency` | `String` | Token symbol, upper case |
| `tokenAddress` | `String` | Token identifier on the network. The zero address for a native EVM coin |
| `amountBaseUnits` | `String` | Amount the merchant receives, in base units |
| `totalBaseUnits` | `String` | Amount the customer pays, including the platform fee |
| `displayAmount` | `Float` | `amountBaseUnits` in whole tokens |
| `network` | `String` | Network key |
| `chainId` | `Int` | EVM chain ID. `0` for Sui, Stellar and NEAR |
| `expiresAt` | `String` | Expiry, ISO 8601 in UTC |
| `usdPriceSnapshot` | `Float` | USD price of the token used for the quote |

## Example

```graphql
mutation CreateQuote($input: CreateQuoteInput!) {
  createQuote(input: $input) {
    success
    message
    quoteId
    quoteReference
    tokenAddress
    amountBaseUnits
    totalBaseUnits
    displayAmount
    network
    chainId
    expiresAt
  }
}
```

```json title="Variables"
{
  "input": {
    "vendorIdentifier": "YOUR_VENDOR_ID",
    "fiatAmount": 10,
    "fiatCurrency": "USD",
    "cryptoCurrency": "USDT",
    "network": "baseSepolia"
  }
}
```

Example response. Values are illustrative.

```json
{
  "data": {
    "createQuote": {
      "success": true,
      "message": "Quote ready. Use quote_id in createTransaction.",
      "quoteId": 1042,
      "quoteReference": "8c6d2f0e-5b1a-4c3e-9f7d-2a4b6c8e0f13",
      "tokenAddress": "TOKEN_CONTRACT_ADDRESS",
      "amountBaseUnits": "10000000",
      "totalBaseUnits": "10050000",
      "displayAmount": 10.0,
      "network": "baseSepolia",
      "chainId": 84532,
      "expiresAt": "2026-10-19T09:40:00.000000"
    }
  }
}
```

USDT has 6 decimals on Base Sepolia, so `10000000` is 10 USDT. The 0.5% fee makes the total `10050000`.

## Behaviour

- USDT, USDC, USDC.e, USDbC, DAI and MUSD are priced at exactly 1 USD. Other tokens use a live USD price. Non-USD fiat is converted with live exchange rates. See [Fiat pricing](/merchants/fiat-pricing/).
- `totalBaseUnits` uses the network's fee: 1% on Stellar networks, 0.5% elsewhere. See [Fee model](/contracts/fee-model/).
- Creating a quote does not reserve funds or contact the chain.

Failure messages are listed in [API errors](/api/errors/#createquote-messages).
