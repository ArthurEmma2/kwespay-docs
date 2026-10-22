---
title: Sui contract
description: The KwesPay Move payment module on Sui, including the pay function, the shared registry, the secp256k1 signature check, events and current availability.
sidebar:
  order: 4
---

The Sui contract is the Move module `kwespay::payment`. It runs on **Sui Testnet**. Package and registry IDs are in [Supported networks](/overview/networks/#sui).

## Objects

- **Registry**, a shared object holding the fee in basis points, the fee recipient, the KwesPay signer public key, the vendor table keyed by wallet address, and the set of used payment IDs.
- **AdminCap**, an owned capability required for every administrative function.

## pay

```move
public fun pay<T>(
    registry: &mut Registry,
    payment_id: vector<u8>,
    vendor_wallet: address,
    merchant_amount: u64,
    expires_at: u64,
    coin: Coin<T>,
    signature: vector<u8>,
    clock: &Clock,
    ctx: &mut TxContext,
)
```

The function checks that the payment ID is unused and at most 64 bytes, the vendor is registered and active, the signature has not expired, the signature is valid for the registry's signer key, and the coin's value equals `merchant_amount + fee` exactly. It then sends the fee to the fee recipient, the rest to `vendor_wallet`, and marks the payment ID as used.

On Sui the merchant is identified by its wallet address, which is part of the signed terms.

## Signature

KwesPay signs a keccak256 digest of the payment terms with secp256k1. The registry object ID is included in the digest as a domain separator, so a signature is only valid for one registry. The contract recovers the public key with `ecdsa_k1::secp256k1_ecrecover` and compares it with the stored signer key.

## Events

```move
public struct PaymentCreated has copy, drop {
    payment_id: vector<u8>,
    customer: address,
    vendor: address,
    coin_type: vector<u8>,
    merchant_amount: u64,
    fee: u64,
    total: u64,
    expires_at: u64,
    timestamp_ms: u64,
}
```

Administrative events: `VendorRegistered`, `VendorWalletRotated`, `VendorStatusChanged`, `FeeUpdated`, `FeeRecipientUpdated`, `SignerRotated`.

## Read functions

| Function | Returns |
| --- | --- |
| `get_vendor(registry, vendor_wallet)` | `(is_active, total_payments, total_volume)` |
| `is_vendor_active(registry, vendor_wallet)` | `bool` |
| `is_payment_used(registry, payment_id)` | `bool` |
| `compute_fee(registry, amount)` | Fee for an amount |
| `compute_total(registry, amount)` | Amount plus fee |
| `platform_fee_bps(registry)` | Current fee |
