# KwesPay Docs

Source for the KwesPay developer documentation at [docs.kwespay.xyz](https://docs.kwespay.xyz).

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), customised with a KwesPay theme. It is a fully static site: navigation, search (Pagefind), and metadata are generated at build time. It deploys to GitHub Pages and needs no server, database, or CMS.

## Local development

Requires Node.js 22.12 or later (see `.nvmrc`) and pnpm 9.

```sh
pnpm install
pnpm dev          # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server with hot reload. Search only works in a production build |
| `pnpm build` | Static build to `dist/`, including the Pagefind search index, sitemap and internal link validation |
| `pnpm preview` | Serves `dist/` locally. Use this to test search |
| `pnpm check` | Type-checks Astro and TypeScript files |
| `pnpm check:site` | Checks the built site: canonical URLs, metadata, JSON-LD, sitemap, robots.txt, every internal link and heading fragment, and the search index |
| `pnpm verify` | `check`, `build` and `check:site` in one go. CI runs the same steps |

## Project layout

```
src/
  content/docs/        All articles. Folder = sidebar section, file = page
  components/          Header, PageTitle, Footer overrides; homepage; sequence diagram
  lib/urls.mjs         The single source for canonical URL generation
  lib/site.ts          Site constants used at runtime (origin, indexability, OG image)
  lib/breadcrumbs.ts   Breadcrumb trail from the sidebar, shared by the page title and JSON-LD
  route-middleware.ts  Per-page SEO: canonical, robots, Open Graph, X card, JSON-LD
  plugins/base-links.mjs  Prefixes root-relative Markdown links with the deploy base path
  pages/robots.txt.ts  robots.txt, generated per deployment
  styles/theme.css     Design tokens and all visual overrides for light and dark themes
public/                Favicon, social image (og/kwespay-docs.png), CNAME
scripts/check-site.mjs Post-build verification
astro.config.mjs       Site, base path, sidebar, Starlight options
```

## Writing content

### Adding a page

Create a Markdown (`.md`) or MDX (`.mdx`) file in the right folder under `src/content/docs/`. It appears in the sidebar, search, sitemap, and previous/next navigation automatically. No layout or navigation code changes are needed.

```md
---
title: Payment confirmation
description: One or two sentences describing what this page covers. Used for search results, link previews and the page lede.
sidebar:
  order: 4
---

Body text starts here. Use `##` for sections and `###` below that.
```

| Frontmatter | Required | Notes |
| --- | --- | --- |
| `title` | Yes | Sentence case. Becomes `Title \| KwesPay Docs` in the browser and in link previews |
| `description` | Yes | At least 40 characters, unique per page. The build fails without it |
| `sidebar.order` | Recommended | Position within the section |
| `sidebar.label` | No | Shorter sidebar label |
| `draft` | No | `true` keeps the page out of production builds, the sitemap and search |
| `ogImage` / `ogImageAlt` | No | Custom 1200×630 link-preview image, a path under `public/` |

### Conventions

- **File names are slugs.** Use lowercase kebab-case (`payment-confirmation.md`). The URL is the folder path plus the file name with a trailing slash: `/guides/payment-confirmation/`. Choose names you will not need to change.
- **Internal links** are root-relative with a trailing slash: `[Fee model](/contracts/fee-model/)`, `[pay()](/sdk/methods/#pay)`. Never include the deploy base path or the domain; the build adds the base path when needed. The build fails on broken links or missing heading anchors.
- **Callouts** use Starlight asides: `:::note`, `:::caution`, `:::danger`, with an optional title in brackets, `:::caution[SDK version]`. Use them sparingly.
- **Code blocks** declare a language and, where helpful, a file name: ```` ```ts title="server.ts" ````. Use obvious placeholders such as `YOUR_API_KEY`, `YOUR_VENDOR_ID`. Never paste real keys, secrets, or private keys. Mark example responses as illustrative.
- **Tabs and steps** come from `@astrojs/starlight/components` in `.mdx` files (`<Tabs syncKey="chain">`, `<Steps>`).
- **Accuracy.** Every API field, SDK method, address and fee must come from the source repositories (`Backend/`, `kwespay-ts/`, `kweswidget/`, the contract repos). If something cannot be verified, leave it out.

### Sidebar

Sections are declared once in `astro.config.mjs` and filled automatically from the folders. To add a new section, create a folder and add one entry to the `sidebar` array.

## URLs, SEO and sharing

- The production origin is `https://docs.kwespay.xyz`. `src/lib/urls.mjs` builds every canonical URL from it, independently of where the site is deployed. Canonical URLs, `og:url`, JSON-LD and the sitemap all use it, and copy-link buttons copy it.
- A build is **indexable** only when it is deployed at the production origin with base path `/`. Any other deployment (a GitHub Pages project URL, a fork) is rendered with `noindex` and a `robots.txt` that disallows crawling, while still pointing canonicals at production.
- Every page gets a unique title, description, canonical URL, robots directive, Open Graph and X card tags, and the default social image `public/og/kwespay-docs.png` unless it sets `ogImage`. Articles carry `TechArticle` and `BreadcrumbList` JSON-LD. `dateModified` is only emitted when Git history provides it (CI sets `LAST_UPDATED=true` with full history).
- The 404 page is `noindex` and excluded from the sitemap.

### Renaming or moving a page

GitHub Pages cannot do server-side redirects. Avoid moving published pages. If you must:

1. Move the file and fix every link the build reports.
2. Search the repository for the old path, including `src/components/Landing.astro`.
3. Add a static redirect page at the old path, for example `src/pages/old/path/index.astro`, containing `<meta http-equiv="refresh" content="0; url=/new/path/">`, `<link rel="canonical" href="https://docs.kwespay.xyz/new/path/">`, `<meta name="robots" content="noindex">` and a visible link to the new page. Search engines and browsers follow it, but it is a client-side redirect, not an HTTP 301.

## Deployment

`.github/workflows/deploy.yml` runs on pushes to the default branch, on pull requests and on demand. It installs with the lockfile, type-checks, builds (including the Pagefind index), runs `check:site`, and only then uploads and deploys the artifact. Pull requests build and verify but do not deploy. A failing step stops the deployment.

All third-party actions are pinned to commit SHAs.

### One-time GitHub setup

1. Push this folder as its own repository (for example `Kwespay/docs`) with `main` as the default branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The first deployment goes to the project URL, `https://<owner>.github.io/<repo>/`. It is built with the correct base path and is marked `noindex`.

### Custom domain: docs.kwespay.xyz

1. At the DNS provider for `kwespay.xyz`, add a `CNAME` record: `docs` → `<owner>.github.io` (the account or organisation that owns the repository, without the repository name).
2. Recommended: verify `kwespay.xyz` for the organisation under **Organisation settings → Pages → Verified domains**, which prevents domain takeover.
3. In the repository's **Settings → Pages**, enter `docs.kwespay.xyz` as the custom domain, wait for the DNS check, then enable **Enforce HTTPS** once the certificate is issued.
4. In **Settings → Secrets and variables → Actions → Variables**, add `DOCS_CUSTOM_DOMAIN` = `docs.kwespay.xyz`.
5. Re-run the workflow. With the variable set, the site builds at base path `/`, becomes indexable, and publishes the sitemap at `https://docs.kwespay.xyz/sitemap-index.xml`.

The `public/CNAME` file records the intended domain. With Actions-based Pages deployments, the domain configured in repository settings is what takes effect.

### Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `SITE_URL` | `https://docs.kwespay.xyz` | Origin the site is deployed at |
| `BASE_PATH` | `/` | Path prefix, for example `/docs` on a project URL |
| `CANONICAL_ORIGIN` | `https://docs.kwespay.xyz` | Origin used for canonical URLs and the sitemap |
| `EDIT_BASE_URL` | unset | Enables "Edit page" links. CI sets it to the repository's edit URL |
| `LAST_UPDATED` | unset | `true` shows Git-based last-updated dates. Needs full Git history |

To reproduce a project-URL build locally:

```sh
SITE_URL=https://kwespay.github.io BASE_PATH=/docs pnpm build && SITE_URL=https://kwespay.github.io BASE_PATH=/docs pnpm check:site
```

## Widget simulation

The [Checkout widget](https://docs.kwespay.xyz/guides/checkout-widget/) page embeds the widget so readers can try a payment without a wallet or funds.

- `public/widget-sandbox/kwespay-widget.min.js` is the single-file browser build of `@kwespay/widget`. To update it, copy `dist/kwespay-widget.min.js` from the published npm tarball (`npm pack @kwespay/widget@<version>`) of the release the docs describe.
- `public/widget-sandbox/sandbox.js` answers the widget's GraphQL calls (`validateAccessKey`, `createQuote`, `createTransaction`, `getTransactionStatus`) with the same fields as the real API. It also provides an EIP-1193 test wallet, announced through EIP-6963, that asks the reader to confirm or reject each request. Real browser wallets and WalletConnect are blocked inside the sandbox, so nothing reaches a real wallet or chain.
- Prices are fixed placeholders (stablecoins at 1 USD, 1 USD = 15 GHS, ETH at 3000 USD). Scenarios are chosen with the `scenario` query parameter: `success`, `insufficient` or `underpaid`.
- `src/components/WidgetPlayground.astro` loads the sandbox in an iframe only when the reader asks, so the widget bundle never loads on other pages. It shows API calls, wallet requests and widget events as they happen.
- The sandbox page is `noindex`, outside the sitemap and search index, and skipped by `check:site`.

## Design notes

- Typography: Inter Variable for interface and prose, JetBrains Mono Variable (ligatures off) for code, identifiers and section labels. Both are self-hosted through Fontsource.
- Colour: warm paper and ink neutrals with KwesPay blue (`#2563eb`) as the only accent. Light and dark palettes are tuned separately in `src/styles/theme.css`. The theme follows the operating system until the reader picks one, and the choice persists in `localStorage`.
- Wordmark and favicon are derived from the existing KwesPay logo in the merchant dashboard repository.
- Client-side JavaScript is limited to Starlight's search, theme, table of contents and tabs, plus the copy-link controls.
