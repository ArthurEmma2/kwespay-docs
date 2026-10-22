---
title: Payment links
description: Create shareable payment links in the dashboard for products, invoices, donations and events, and collect crypto payments without writing code.
sidebar:
  order: 5
---

A payment link is a page you share by URL, QR code or message. The customer opens it, picks a network and token, and pays from their own wallet. No code or website is needed. Funds settle to the business's wallet exactly as with the widget or SDK.

Create links on the dashboard's **Payment links** page.

## Link types

| Purpose | Pricing | Typical use |
| --- | --- | --- |
| Product | Fixed | One product or service at a set price |
| Payment request | Fixed | An invoice for one customer |
| Flexible | Customer enters the amount | Tips, top-ups, open payments |
| Event | Fixed or flexible | Tickets, with a date and location |
| Donation | Flexible, with suggested amounts and an optional target | Fundraising, with collected progress shown |

Prices are set in fiat, for example 50 GHS, and converted to the token when the customer pays. See [Fiat pricing](/merchants/fiat-pricing/).

## Options

- **Single use or reusable.** A single-use link closes after it is paid. While one customer is paying, others are asked to try again in a few minutes.
- **Expiry.** An optional date after which the link stops accepting payments.
- **Payment methods.** Choose the networks and tokens the link accepts, from those the business has enabled.
- **Customer details.** Ask for name, email and a reference (with your own label), each off, optional or required.
- **Redirect.** Send the customer to your URL after a successful payment.
- **Branding.** Use the business's checkout branding (name, logo, colour, support message) or override it per link, and add a cover image.

## Status

A link is `active`, `inactive` (paused), `expired`, `completed` (single use, paid) or `archived`. A link with no usable payment method shows as unavailable to customers. Links with payments can be archived but not deleted.

Editing a link never changes payments already made. Each payment keeps the terms it was made under, recorded with a link version.

## Tracking payments

Each link shows its payments, amount collected and customer details. Link payments also appear in the business's payment history, and [webhook](/guides/webhooks/#payload) events carry a `paymentLink` object so your systems can match them.

To build your own link checkout instead of the hosted page, see [Payment link checkout](/api/operations/payment-link-checkout/).
