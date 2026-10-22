---
title: Security
description: How to keep a KwesPay integration secure, what KwesPay will never ask for, and how to report a suspected vulnerability responsibly.
sidebar:
  order: 3
---

## Integration security

- Fulfil orders only after [`verifyPayment`](/guides/payment-confirmation/) returns `paid: true` on your server.
- Scope API keys to the networks and tokens you use, and use one key per site.
- Keep transaction references out of logs and public links.
- Pin package versions and CDN URLs so a release cannot change your checkout without review.
- Control the receiving wallets with keys you hold securely. Payments go straight to them.

The contract-level protections are described in [Security considerations](/contracts/security/).

## What KwesPay will never ask for

KwesPay, the widget, the SDK and the testnet console never ask for a wallet recovery phrase or private key. Every payment is approved in the customer's own wallet. Treat any request for a recovery phrase as an attack.

## Reporting a vulnerability

Report suspected vulnerabilities privately by email to [arthur@kwespay.xyz](mailto:arthur@kwespay.xyz). Do not open a public issue with exploit details, and do not test against other merchants' payments or mainnet funds.

Include the affected component, the steps to reproduce and the impact you observed.
