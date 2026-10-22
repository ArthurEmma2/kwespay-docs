---
title: Stellar contract
description: The KwesPay Soroban payment contract, including create_payment parameters, the Ed25519 authorization message, ledger-based deadlines, events and error codes.
sidebar:
  order: 3
---

The Stellar contract is a Soroban smart contract written in Rust. Contract IDs are listed in [Supported networks](/overview/networks/#stellar-soroban-contract-ids).

## create_payment

```rust
pub struct PaymentParams {
    pub payment_id: BytesN<32>,
    pub vendor_id: String,
    pub asset: Address,
    pub amount: i128,
    pub deadline_ledger: u32,
    pub customer: Address,
    pub backend_signature: BytesN<64>,
}

pub fn create_payment(env: Env, params: PaymentParams) -> Result<PaymentRecord, Error>;
```

- `customer` must authorise the call. Only the address the terms were signed for can pay.
- `asset` is the token's Stellar Asset Contract or SEP-41 contract address. XLM is paid through its Stellar Asset Contract.
- `amount` is the merchant amount. The contract computes the fee and transfers `amount` to the merchant's wallet and the fee to the fee recipient, both from the customer.
- `deadline_ledger` is a **ledger sequence**. The contract rejects the call once the current ledger is past it.

## Authorization message

The signature covers a deterministic byte string. Variable-length fields are a big-endian `u16` length followed by UTF-8 bytes.

| # | Field | Encoding |
| --- | --- | --- |
| 1 | Domain separator | `u16_be(len)` and `kwespay_payment_v1` |
| 2 | `payment_id` | 32 raw bytes |
| 3 | `vendor_id` | `u16_be(len)` and UTF-8 |
| 4 | `asset` | `u16_be(len)` and the strkey |
| 5 | `amount` | `i128`, 16 bytes big-endian |
| 6 | `deadline_ledger` | `u32`, 4 bytes big-endian |
| 7 | `customer` | `u16_be(len)` and the strkey |
| 8 | `contract_id` | `u16_be(len)` and the strkey |
| 9 | `network_passphrase` | `u16_be(len)` and UTF-8 |

The contract verifies `Ed25519(backend_public_key, SHA-256(message), signature)`. Because the contract ID, network passphrase and customer are signed, an authorization works on one contract, on one network, for one payer.

## Events

A completed payment publishes topics `("payment", "done")` with data:

```text
(payment_id, vendor_id, vendor_wallet, customer, total_amount, vendor_amount, fee_amount, asset, created_ledger)
```

Administrative events use the topics `("vendor", "reg")`, `("vendor", "upd")`, `("vendor", "stat")`, `("admin", "keyr")`, `("admin", "fee")`, `("admin", "pause")` and `("admin", "unpause")`.

## Read functions

| Function | Returns |
| --- | --- |
| `get_payment(payment_id)` | The `PaymentRecord` |
| `get_vendor(vendor_id)` | The vendor record |
| `is_vendor_active(vendor_id)` | `bool` |
| `is_asset_supported(asset)` | `bool` |
| `get_config()` | Configuration, including `platform_fee_bps` |
| `get_payment_count()` | Number of payments recorded |

## Errors

| Code | Name |
| --- | --- |
| 1 | `AlreadyInitialized` |
| 2 | `NotInitialized` |
| 3 | `Unauthorized` |
| 4 | `Paused` |
| 5 | `VendorNotFound` |
| 6 | `VendorInactive` |
| 7 | `VendorAlreadyExists` |
| 8 | `AssetNotSupported` |
| 9 | `InvalidAmount` |
| 10 | `DeadlineExpired` |
| 11 | `PaymentAlreadyExists` |
| 12 | `PaymentNotFound` |
| 13 | `InvalidSignature` |
| 14 | `FeeTooHigh` |
| 15 | `InvalidArgument` |
| 16 | `InsufficientBalance` |

## Storage lifetime

Payment and vendor records are stored with a long time-to-live and can be extended by anyone with `extend_ttl_payment(payment_id)` and `extend_ttl_vendor(vendor_id)`. Payment records double as replay protection, so they must not expire while a signature for that payment could still be used.
