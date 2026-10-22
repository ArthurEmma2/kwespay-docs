---
title: Support
description: Where to get help with a KwesPay integration and what information to include so a payment problem can be investigated quickly.
sidebar:
  order: 4
---

## Where to ask

- **Email:** [arthur@kwespay.xyz](mailto:arthur@kwespay.xyz) for integration help, payment problems and account questions.
- **Integration questions:** [KwesPay on GitHub](https://github.com/Kwespay).
- **Announcements:** [@kwespay on X](https://x.com/kwespay).
- **Try the flow end to end:** the [testnet console](https://console.kwespay.xyz) runs real testnet payments and shows each SDK call with its request, response and timing.

## What to include

For a problem with a specific payment, include:

| Item | Example |
| --- | --- |
| Environment | Testnet or mainnet |
| Network key and token | `stellarTestnet`, `USDC` |
| Transaction reference | From `createTransaction` |
| Transaction hash | From `pay()` or the wallet |
| SDK or widget version | `@kwespay/client@0.1.27` |
| Error code and message | `err.code` and `err.message` |

Never send an API key, recovery phrase or private key in a support request.
