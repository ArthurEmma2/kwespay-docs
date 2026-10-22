---
title: Security considerations
description: The security properties of KwesPay payments, what the contracts and API protect against, and the responsibilities that remain with integrators and merchants.
sidebar:
  order: 6
---

## What the design protects

| Threat | Protection |
| --- | --- |
| A client changes the amount, token or merchant | The contract rejects terms that do not match KwesPay's signature |
| A signed payment is replayed | Payment IDs are single-use on-chain |
| An old signature is used much later | Signatures carry a deadline the contract enforces |
| A signature is reused on another chain or contract | EVM signatures include the chain ID and contract address. Stellar includes the contract ID and network passphrase. Sui includes the registry object ID |
| A Stellar authorization is used by another wallet | The customer address is signed and must authorise the call |
| KwesPay's API is compromised | The signer key can only authorise payments to registered merchant wallets, and every payment still needs the customer to submit it. The contracts hold no payment balances |
| A fee is raised without notice | The EVM contract publishes a proposed increase on-chain and only applies it after 24 hours. All contracts cap the fee at 10% |
| Re-entrancy during ERC-20 or native transfers | The EVM contract records the payment before moving funds and uses a reentrancy guard |

## What remains your responsibility

- **Verify on your server.** Fulfil orders only after [`verifyPayment`](/guides/payment-confirmation/) returns `paid: true` for the order, amount and currency.
- **Protect receiving wallets.** Payments go straight to the merchant's wallet. Whoever controls its keys controls the funds.
- **Scope API keys.** Keys in browser code are public. Restrict them to the networks and tokens you use. See [Authentication](/api/authentication/).
- **Keep transaction references private.** Anyone with a reference can read its status.
- **Understand token approvals.** On EVM, the SDK approves the KwesPay payment contract for exactly the payment total. The contract only pulls tokens from the account that calls `createPayment` with valid signed terms, so the allowance is used only when the customer submits a payment. Customers may still want to review allowances in their wallet.

## Signer keys

Each contract stores the public key or address it accepts signatures from. Rotating KwesPay's signer key requires updating the API's signing key and the contract's trusted key together. On Stellar, rotation immediately invalidates every authorization signed with the old key.

## Reporting a vulnerability

See [Security](/resources/security/).
