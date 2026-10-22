---
title: EVM contract
description: The KwesPay Solidity payment contract, including createPayment parameters, the signed message, native and ERC-20 settlement, events, read functions and deployments.
sidebar:
  order: 2
---

The EVM contract is `Payment` (Solidity 0.8.20). It inherits OpenZeppelin `ReentrancyGuard`, `Ownable` and `Pausable`. The same code is deployed on every supported EVM network. Addresses are listed in [Supported networks](/overview/networks/#evm).

## createPayment

```solidity
struct PaymentParams {
    bytes32 paymentId;
    string vendorId;
    address token;
    uint256 amount;
    uint256 deadline;
    bytes backendSignature;
}

function createPayment(PaymentParams calldata p) external payable;
```

| Field | Source |
| --- | --- |
| `paymentId` | `paymentIdBytes32` from `createTransaction` |
| `vendorId` | The merchant's vendor ID |
| `token` | `tokenAddress`. `address(0)` for the native coin |
| `amount` | `amountBaseUnits`, the merchant amount, **not** the total |
| `deadline` | `deadline`, Unix seconds |
| `backendSignature` | `backendSignature` |

The contract checks, in order: the deadline has not passed, the payment ID is unused, the vendor exists and is active, the token is allowlisted, the amount is positive, and the signature recovers to `backendSigner`.

### Signed message

```solidity
keccak256(abi.encodePacked(
    paymentId, vendorId, token, amount, deadline,
    block.chainid, address(this)
))
```

The hash is wrapped with the EIP-191 `"\x19Ethereum Signed Message:\n32"` prefix before recovery. Including the chain ID and the contract address means a signature is valid on exactly one contract on one chain.

### Settlement

The fee is `amount * platformFee / 10000`. The customer pays `amount + fee`.

- **Native coin.** Send at least `amount + fee` as `msg.value`. The merchant receives `amount`, the fee recipient receives the fee, and any excess is refunded to the sender in the same transaction.
- **ERC-20.** `msg.value` must be 0. The contract pulls `amount + fee` with `transferFrom`, so the customer must approve the contract first. Fee-on-transfer tokens are rejected.

The payment is recorded before funds move, and the function is non-reentrant.

## Events

```solidity
event PaymentCompleted(
    bytes32 indexed paymentId,
    string indexed vendorId,
    address indexed vendor,
    address customer,
    uint256 totalAmount,
    uint256 vendorAmount,
    uint256 feeAmount,
    address token,
    uint256 timestamp
);
```

KwesPay's listeners use `PaymentCompleted` to confirm payments. Because `vendorId` is an indexed `string`, the log stores its keccak256 hash, not the text. Match payments by `paymentId`.

Administrative events: `VendorRegistered`, `VendorUpdated`, `VendorStatusChanged`, `PlatformFeeUpdated`, `PlatformFeeProposed`, `FeeRecipientUpdated`, `TokenSupportUpdated`, `BackendSignerUpdated`, `EmergencyWithdrawal`.

## Read functions

| Function | Returns |
| --- | --- |
| `getPayment(bytes32 paymentId)` | `vendor, customer, totalAmount, vendorAmount, feeAmount, token, createdAt`. Reverts with `Payment does not exist` |
| `getVendor(string vendorId)` | The vendor record |
| `isVendorActive(string vendorId)` | `bool` |
| `platformFee()` | Current fee in basis points |
| `supportedTokens(address)` | Whether a token is allowlisted |
| `backendSigner()` | The address whose signatures are accepted |

## Revert reasons

| Reason | Cause |
| --- | --- |
| `Signature expired` | `block.timestamp` is after `deadline` |
| `Payment exists` | The payment ID was already used |
| `Vendor does not exist` / `Vendor inactive` | Merchant not registered or deactivated on-chain |
| `Token unsupported` | Token not allowlisted |
| `Invalid amount` | `amount` is 0 |
| `Invalid backend signature` | The terms do not match the signature |
| `Insufficient ETH amount` | `msg.value` below `amount + fee` |
| `No ETH for token payment` | Native value sent with an ERC-20 payment |
| `Fee-on-transfer token unsupported` | The contract received less than it pulled |

The SDK decodes these reasons into `CONTRACT_ERROR` messages.
