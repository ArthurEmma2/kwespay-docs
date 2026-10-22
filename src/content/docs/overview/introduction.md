---
title: Introduction
description: What KwesPay is, the parts you integrate with, and how this documentation is organised around the work of adding crypto payments priced in fiat.
sidebar:
  order: 1
---

KwesPay is non-custodial payment infrastructure for accepting cryptocurrency while pricing in fiat currency. A merchant charges an amount such as 50 GHS or 10 USD. KwesPay converts it to an exact token amount on a chosen network, signs the payment terms, and the customer's wallet pays the merchant directly through a KwesPay payment contract.

KwesPay does not take custody of funds at any point. The contract moves the payment from the customer's wallet to the merchant's wallet, and the platform fee to KwesPay's fee address, in the same on-chain transaction.

## What you can build

- **A hosted checkout.** Add the [checkout widget](/guides/checkout-widget/) to a page and await a result. It connects the wallet, lets the customer pick a network and token, and runs the payment.
- **A custom checkout.** Use the [JavaScript SDK](/guides/javascript-sdk/) to request a quote and execute it with the customer's wallet inside your own interface.
- **Payment verification.** Read the authoritative status of a payment from the [GraphQL API](/api/) before you fulfil an order.

## The pieces

| Component | What it does | Where it runs |
| --- | --- | --- |
| KwesPay API | Prices quotes, signs payment terms, watches the chains and records final status | KwesPay servers |
| `@kwespay/widget` | Payment modal for merchant websites, built on the SDK | Your customer's browser |
| `@kwespay/client` | TypeScript SDK for quotes, wallet payments and status | Your customer's browser |
| Payment contracts | Check the KwesPay signature and settle the payment on-chain | EVM networks, Sui, Stellar |
| Merchant dashboard | Accounts, merchant profiles, receiving wallets, networks and API keys | [app.kwespay.xyz](https://app.kwespay.xyz) |

## One rule to keep in mind

The browser never decides what a payment is worth. The KwesPay API sets the amount, the receiving merchant, the token, the fee and the deadline, and signs them. The contract rejects anything that does not match that signature. A success message in the browser tells you a transaction was submitted. Only the [status recorded by KwesPay](/guides/payment-confirmation/) tells you the merchant was paid the right amount.

## How these docs are organised

- **Overview** explains the model: [how a payment works](/overview/how-it-works/), the [core concepts](/overview/core-concepts/) and the [supported networks](/overview/networks/).
- **Getting started** takes you from an account to a [confirmed testnet payment](/getting-started/quickstart/), then to [production](/getting-started/production-checklist/).
- **Integration guides** cover the widget, the SDK, confirmation and errors.
- **API reference**, **SDK reference** and **Smart contracts** document the exact interfaces.
