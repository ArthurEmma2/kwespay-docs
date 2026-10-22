---
title: Environment setup
description: Create a KwesPay merchant, generate an API key, enable networks and receiving wallets, and choose the right API endpoint for testnet or mainnet.
sidebar:
  order: 2
---

Every integration needs the same three things: a **merchant** that can receive payments, an **API key**, and the **API endpoint** for the environment you are using.

## 1. Create an account and merchant

1. Sign up on the dashboard for the environment you want. Use the [testnet dashboard](https://app.testnet.kwespay.xyz) while you build and the [mainnet dashboard](https://app.kwespay.xyz) for real payments. They are separate systems with separate accounts.
2. Create a merchant profile. Its **vendor ID** is the UUID you pass as `vendorIdentifier` (SDK and API) or `vendorId` (widget).
3. Add a receiving wallet for each chain family you will use: an EVM address, a Sui address or a Stellar address. Payments go straight to these wallets.
4. Enable the networks the merchant accepts and choose its accepted tokens.

A quote for a network the merchant has not enabled, or without a receiving wallet of the right family, fails with a message such as `Vendor has not enabled baseSepolia`.

## 2. Generate an API key

Generate a key under **API Keys** in the dashboard. The SDK and widget send it in the `X-API-Key` header.

- A key belongs to your account and can be used for any of its merchants.
- A key can be limited to specific networks and tokens. Quotes outside that scope are rejected.
- Keys can expire. Check a key with [`validateKey()`](/sdk/methods/#validatekey).

The widget and SDK run in your customer's browser, so the key is visible to anyone who opens your page. Limit its scope to what your checkout needs. See [Security](/resources/security/).

## 3. Choose an endpoint

| Environment | GraphQL endpoint |
| --- | --- |
| Mainnet | `https://api.kwespay.xyz/graphql` |
| Testnet | `https://api.testnet.kwespay.xyz/graphql` |

The SDK and widget call the mainnet endpoint by default. Pass `graphqlEndpoint` to the SDK, or `environment: "testnet"` to the widget, for testnet. Read [Testnet and mainnet](/getting-started/testnet-vs-mainnet/) before switching.

## 4. Check the configuration

Confirm the key and the merchant before you write checkout code:

```ts
import { KwesPayClient } from "@kwespay/client";

const kwespay = new KwesPayClient({
  apiKey: "YOUR_TESTNET_API_KEY",
  graphqlEndpoint: "https://api.testnet.kwespay.xyz/graphql",
});

const key = await kwespay.validateKey("YOUR_VENDOR_ID");
if (!key.isValid) throw new Error(key.error);

const merchant = await kwespay.getMerchantConfig("YOUR_VENDOR_ID");
console.table(merchant.networkTokenMap);
```

`networkTokenMap` lists every network the merchant can be paid on and the tokens it accepts there. If the network you need is missing, fix it in the dashboard first.

## 5. Fund a test wallet

The [testnet console](https://console.kwespay.xyz) has a **Test tokens** panel. It can activate a Stellar testnet account with Friendbot, add the USDC trustline and swap a little XLM for test USDC; request SUI from the Sui faucet; mint KwesPay test USDT on most EVM testnets; and link to each EVM network's gas faucet.
