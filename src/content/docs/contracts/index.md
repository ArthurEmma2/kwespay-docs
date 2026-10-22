---
title: Contract architecture
description: How the KwesPay payment contracts on EVM, Sui, Stellar and NEAR share one model of backend-signed terms, customer-submitted transactions and atomic settlement.
sidebar:
  label: Architecture
  order: 1
---

KwesPay has one payment contract per chain family. They are written in different languages but enforce the same model.

| Chain family | Language | Contract | Signature scheme |
| --- | --- | --- | --- |
| EVM | Solidity 0.8.20, OpenZeppelin 5 | `Payment` | ECDSA secp256k1 over a keccak256 hash, EIP-191 prefixed |
| Sui | Move 2024 | `kwespay::payment` | secp256k1 recoverable signature over a keccak256 digest |
| Stellar | Rust, Soroban SDK | KwesPay Soroban payment contract | Ed25519 over a SHA-256 hash |
| NEAR | Rust, near-sdk | `pay.kwespay.testnet` | Ed25519 over a SHA-256 hash |

## Shared model

1. **KwesPay signs, the customer submits.** The KwesPay API signs the payment terms off-chain. The customer's wallet sends the transaction and pays the fees. KwesPay never submits or co-signs the customer's transaction.
2. **The contract verifies the signature** against the KwesPay signer key it stores. Terms that were not signed by that key, or were changed after signing, are rejected.
3. **Every payment ID is single-use.** The contract records each payment ID and rejects a second payment with the same ID.
4. **Signatures expire.** Each signature carries a deadline the contract checks.
5. **Settlement is atomic.** In one transaction the contract moves the merchant amount to the merchant's wallet and the fee to KwesPay's fee recipient, then emits an event. If any step fails, nothing moves.
6. **No balances are held.** Funds pass through the contract within the transaction. Neither KwesPay nor the merchant has a balance inside the contract.

## Registries

Each contract keeps a registry of merchants and, on EVM and Stellar, of supported tokens. KwesPay's administrator registers merchants and their receiving wallets on-chain. A payment to an unregistered or deactivated merchant, or in a token that is not allowlisted, is rejected.

## Administration

Each contract has an administrator that can register merchants, allowlist tokens, change the fee within a 10% cap, rotate the KwesPay signer key and pause payments. Payments pass straight through to the merchant and fee recipient in the same transaction, so there is no pool of customer funds in the contract. The EVM contract also has an owner-only emergency withdrawal for tokens or coins that end up in the contract outside a payment.

## Chain pages

- [EVM contract](/contracts/evm/)
- [Stellar contract](/contracts/stellar/)
- [Sui contract](/contracts/sui/)
- [NEAR contract](/contracts/near/)
- [Fee model](/contracts/fee-model/)
- [Security considerations](/contracts/security/)
