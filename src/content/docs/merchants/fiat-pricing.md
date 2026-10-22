---
title: Fiat pricing
description: How KwesPay converts a fiat price into an exact token amount, which rates it uses, how long a price is held, and how to present amounts to customers.
sidebar:
  order: 2
---

Merchants price in fiat. Customers pay in crypto. The quote is where the two meet.

## How a quote is priced

1. The fiat amount is converted to US dollars with a live exchange rate, unless it is already in USD.
2. The token's US dollar price is looked up. USDT, USDC, USDC.e, USDbC, DAI and MUSD are fixed at exactly 1 USD. Other tokens use a live market price.
3. The dollar amount is divided by the token price and converted to base units with the token's on-chain decimals.
4. The platform fee is added to give the total the customer pays.

Exchange rates and token prices are fetched from public market data providers and cached briefly by KwesPay. If no price is available, the quote fails with `Could not fetch price for <TOKEN>` and you can retry.

## How long a price holds

A quote holds its price for **10 minutes**. Once it becomes a transaction, the signed terms are valid for **15 minutes** from that point. After that the customer needs a new quote at the current price.

## Currencies

`fiatCurrency` takes an ISO 4217 code and defaults to `USD`. Codes the exchange-rate source does not cover fail to quote. KwesPay highlights these currencies for African markets:

| Code | Currency |
| --- | --- |
| `USD` | US dollar |
| `GHS` | Ghanaian cedi |
| `NGN` | Nigerian naira |
| `KES` | Kenyan shilling |
| `ZAR` | South African rand |
| `ZWG` | Zimbabwe Gold |

## What the fiat amount means after payment

The fiat amount fixes the token amount at the moment of quoting. The merchant receives that token amount. If the token's price moves afterwards, so does the fiat value of what the merchant holds. Pricing with a stablecoin keeps that value close to the US dollar amount.

## Showing amounts to customers

- Show the fiat price your store charges.
- Show the token amount from `totalBaseUnits`, converted with the token's decimals, as the amount the customer will pay.
- If you show the fee separately, use `totalBaseUnits − amountBaseUnits`.
- Show the expiry from `expiresAt` and offer to refresh the quote when it lapses.
