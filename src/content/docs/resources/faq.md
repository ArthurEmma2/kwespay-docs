---
title: FAQ
description: Short answers to common questions about KwesPay custody, fees, supported assets, conversion, refunds, webhooks and environments.
sidebar:
  order: 2
---

## Does KwesPay hold funds?

No. The customer's wallet pays the merchant's wallet through the payment contract in one transaction. KwesPay never has custody of the payment.

## Who pays the fee?

The customer. It is added on top of the price: 1% on Stellar and 0.5% on the other supported chains. The merchant receives the full quoted amount. See [Fee model](/contracts/fee-model/).

## Does KwesPay convert crypto to fiat?

No. The merchant receives the token the customer paid with. Fiat is used only to price the payment.

## Which assets can customers pay with?

It depends on the network and on what the merchant accepts. See [Supported networks](/overview/networks/) and use `getMerchantConfig()` for a specific merchant.

## How does my server know a payment arrived?

Add a [webhook endpoint](/guides/webhooks/). KwesPay sends a signed `payment.succeeded` request to your server when the payment settles on-chain, whether or not the customer is still on your page. You can also call [`verifyPayment`](/guides/payment-confirmation/) with a reference at any time.

## How do refunds work?

The merchant sends the refund straight from its wallet to the customer, then records it so the payment shows as `refunded` and a `payment.refunded` webhook is sent. Because KwesPay is non-custodial, the merchant stays in full control of its funds.

## Can I test without real money?

Yes. Use the [testnet dashboard](https://app.testnet.kwespay.xyz), the testnet API and testnet networks. The [testnet console](https://console.kwespay.xyz) shows a complete payment and helps you get test tokens.

## Is my API key secret?

It is a publishable key, built to live in your page. It cannot redirect funds, because KwesPay signs the receiving wallet and amount itself. Restrict it to the networks and tokens you use. See [Authentication](/api/authentication/).
