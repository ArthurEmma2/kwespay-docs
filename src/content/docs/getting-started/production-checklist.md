---
title: Production checklist
description: The checks to complete before a KwesPay integration accepts real payments, covering credentials, networks, confirmation, error handling and operations.
sidebar:
  order: 4
---

Work through this list before the first real payment. Each item links to the page that explains it.

## Credentials and configuration

- [ ] The merchant exists on the [mainnet dashboard](https://app.kwespay.xyz) with mainnet receiving wallets you control. Double-check every address: payments go directly to it and cannot be redirected afterwards.
- [ ] You use a **mainnet** API key, scoped to only the networks and tokens your checkout offers. See [Authentication](/api/authentication/).
- [ ] No `environment: "testnet"`, `data-kwespay-environment="testnet"` or testnet `graphqlEndpoint` remains, and no testnet network keys. See [Testnet and mainnet](/getting-started/testnet-vs-mainnet/).
- [ ] Your checkout only offers network and token pairs returned by [`getMerchantConfig()`](/sdk/methods/#getmerchantconfig). See [Supported networks](/overview/networks/).
- [ ] No private keys, recovery phrases or dashboard passwords appear in your frontend code, repository or logs.

## Confirmation

- [ ] Orders are fulfilled only after `verifyPayment` returns `paid: true` on your **server**, with the order's amount and currency. A wallet confirmation, a browser result or a success-page URL is not proof of payment. See [Payment confirmation](/guides/payment-confirmation/).
- [ ] Checkout passes `orderId`, and `verifyPayment` receives the same `orderId`. If you cannot pass it, each reference fulfils at most one order.
- [ ] A [webhook endpoint](/guides/webhooks/) is registered on the mainnet dashboard, verifies `KwesPay-Signature`, responds within 10 seconds and records each `event.id` so a repeated delivery does nothing.
- [ ] Marking an order paid is idempotent, so a repeated check does not fulfil it twice.
- [ ] The webhook secret is stored in your server's secret store, never in frontend code or the repository.
- [ ] `underpaid` and `overpaid` have a defined handling path. See [Payment statuses](/merchants/payment-statuses/).
- [ ] You store the transaction reference with the order so you can reconcile it later.

## Failure handling

- [ ] Expired quotes (10 minutes) and transactions (15 minutes) are handled by requesting a new quote. See [Error handling](/guides/error-handling/).
- [ ] Wallet rejections return the customer to a state where they can try again.
- [ ] A payment still `processing` or `unconfirmed` is rechecked later rather than marked failed.
- [ ] Your server respects the API rate limit of 200 requests per minute per IP and backs off on HTTP 429.

## Operations

- [ ] You have made at least one payment per network and token you offer on testnet, and matched each against the dashboard and a block explorer.
- [ ] Someone on your team knows how to look up a payment by transaction reference, transaction hash and payer address.
