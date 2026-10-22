---
title: validateAccessKey
description: Reference for the validateAccessKey query, which reports whether an API key is valid and which merchants, networks and tokens it may use.
sidebar:
  order: 5
---

```graphql
query ValidateAccessKey($accessKey: String!) {
  validateAccessKey(accessKey: $accessKey): ValidateAccessKeyResponse!
}
```

| | |
| --- | --- |
| Type | Query |
| Auth | None. The key is the argument |
| SDK | [`validateKey()`](/sdk/methods/#validatekey) |

## Response: `ValidateAccessKeyResponse`

| Field | Type | Description |
| --- | --- | --- |
| `isValid` | `Boolean!` | Whether the key can be used |
| `error` | `String` | Reason when `isValid` is `false`, such as `Access key not found` |
| `keyId` | `Int` | Key identifier |
| `keyLabel` | `String` | Label given in the dashboard |
| `activeFlag` | `Boolean` | Whether the key is active |
| `expirationDate` | `String` | Expiry, if set |
| `vendorInfo` | `VendorInfo` | The merchant that existed when the key was created: `vendorPk`, `vendorIdentifier`, `businessName` |
| `allowedVendors` | `[Int]` | Internal IDs of every merchant the key can currently use |
| `allowedNetworks` | `[String]` | Network keys the key is limited to. `null` means no limit |
| `allowedTokens` | `[String]` | Token symbols the key is limited to. `null` means no limit |

`vendorInfo` only shows the merchant the key was created with. Keys work for all of the account's merchants, so use `allowedVendors` for the current list.

## Example

```graphql
query {
  validateAccessKey(accessKey: "YOUR_API_KEY") {
    isValid
    error
    allowedNetworks
    allowedTokens
  }
}
```

Response for an unknown key, as returned by the API:

```json
{
  "data": {
    "validateAccessKey": {
      "isValid": false,
      "error": "Access key not found",
      "allowedNetworks": null,
      "allowedTokens": null
    }
  }
}
```

Use this to check configuration at startup or in a health check. Every protected operation validates the key again, so a successful check here is not required before calling them.
