---
title: Installation
description: Install @kwespay/client from npm or a CDN, check the version you need for Stellar, Sui and endpoint selection, and meet the runtime requirements.
sidebar:
  order: 1
---

```sh
npm install @kwespay/client
```

```sh
pnpm add @kwespay/client
```

## Versions

This site documents `@kwespay/client` 0.1.27 and later: EVM, Sui and Stellar payments, `checkout()`, `verifyPayment()` and a configurable `graphqlEndpoint`. NEAR payments, `getNetworks()` and `verifyWebhook()` need 0.1.28. Check what npm serves with `npm view @kwespay/client version`.

## Requirements

- Node.js 18 or later when used on a server. The SDK relies on the global `fetch`.
- In the browser, an ES module bundler such as Vite, webpack, Rollup or Next.js.
- TypeScript is optional. Type definitions ship with the package.

The package is ESM only (`"type": "module"`). Import it with `import`, not `require`.

## Dependencies

`@mysten/sui` and `@stellar/stellar-sdk` are dependencies of the SDK and load only when a Sui or Stellar payment runs. For Stellar wallets you also need a wallet library in your app, such as `@stellar/freighter-api`.

## Browser bundle

The package includes a single-file build that exposes a global `KwesPay`:

```html
<script src="https://cdn.jsdelivr.net/npm/@kwespay/client@0.1.27/dist/browser/kwespay.js"></script>
<script>
  const kwespay = new KwesPay.KwesPayClient({ apiKey: "YOUR_API_KEY" });
</script>
```

The browser bundle supports EVM payments only. Sui, Stellar and NEAR need a bundler that can resolve their npm packages. Pin the version in the URL.
