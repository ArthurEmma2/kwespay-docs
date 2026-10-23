import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import sitemap from '@astrojs/sitemap';
import { baseLinks } from './src/plugins/base-links.mjs';
import { PRODUCTION_ORIGIN, canonicalFor, isCanonicalDeployment, normaliseBase, normaliseOrigin } from './src/lib/urls.mjs';

const canonicalOrigin = normaliseOrigin(process.env.CANONICAL_ORIGIN || PRODUCTION_ORIGIN);
const site = process.env.SITE_URL || canonicalOrigin;
const base = normaliseBase(process.env.BASE_PATH || '/');
const indexable = isCanonicalDeployment({ site, base, origin: canonicalOrigin });
const editBaseUrl = process.env.EDIT_BASE_URL || undefined;
const lastUpdated = process.env.LAST_UPDATED === 'true';

export default defineConfig({
	site,
	base,
	trailingSlash: 'always',
	build: { format: 'directory' },
	vite: {
		define: {
			__KP_CANONICAL_ORIGIN__: JSON.stringify(canonicalOrigin),
			__KP_INDEXABLE__: JSON.stringify(indexable),
		},
	},
	integrations: [
		baseLinks(base),
		sitemap({
			filter: (page) => !/\/404\/?$/.test(new URL(page).pathname),
			serialize: (item) => ({ ...item, url: canonicalFor(new URL(item.url).pathname, { origin: canonicalOrigin, base }) }),
		}),
		starlight({
			title: 'KwesPay Docs',
			description:
				'Developer documentation for KwesPay: accept crypto, price in fiat. Checkout widget, JavaScript SDK, GraphQL API and payment contracts on EVM, Sui, Stellar and NEAR.',
			logo: {
				light: './src/assets/wordmark-ink.png',
				dark: './src/assets/wordmark-paper.png',
				alt: 'KwesPay',
				replacesTitle: true,
			},
			favicon: '/favicon.png',
			head: [
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: `${base.replace(/\/$/, '')}/apple-touch-icon.png` } },
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#faf9f6', media: '(prefers-color-scheme: light)' } },
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#121212', media: '(prefers-color-scheme: dark)' } },
			],
			social: [{ icon: 'github', label: 'KwesPay on GitHub', href: 'https://github.com/Kwespay' }],
			editLink: editBaseUrl ? { baseUrl: editBaseUrl } : undefined,
			lastUpdated,
			pagination: true,
			tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
			credits: false,
			customCss: [
				'@fontsource-variable/inter/wght.css',
				'@fontsource-variable/jetbrains-mono/wght.css',
				'./src/styles/theme.css',
			],
			expressiveCode: {
				themes: ['github-light', 'github-dark-dimmed'],
				useStarlightDarkModeSwitch: true,
				useStarlightUiThemeColors: false,
				styleOverrides: {
					borderRadius: '2px',
					borderWidth: '1px',
					borderColor: 'var(--kp-rule)',
					codeFontFamily: 'var(--kp-font-mono)',
					codeFontSize: '0.8125rem',
					codeLineHeight: '1.7',
					uiFontFamily: 'var(--kp-font-sans)',
					uiFontSize: '0.75rem',
					codeBackground: 'var(--kp-code-bg)',
					frames: {
						shadowColor: 'transparent',
						frameBoxShadowCssValue: 'none',
						editorBackground: 'var(--kp-code-bg)',
						terminalBackground: 'var(--kp-code-bg)',
						editorTabBarBackground: 'var(--kp-code-chrome)',
						terminalTitlebarBackground: 'var(--kp-code-chrome)',
						editorActiveTabBackground: 'var(--kp-code-bg)',
						editorActiveTabIndicatorTopColor: 'transparent',
						editorActiveTabIndicatorBottomColor: 'var(--kp-accent)',
						editorTabBarBorderBottomColor: 'var(--kp-rule)',
						terminalTitlebarBorderBottomColor: 'var(--kp-rule)',
						terminalTitlebarDotsOpacity: '0',
						inlineButtonBackground: 'var(--kp-ink)',
						inlineButtonForeground: 'var(--kp-ink)',
						inlineButtonBorder: 'var(--kp-rule-strong)',
						tooltipSuccessBackground: 'var(--kp-ink)',
						tooltipSuccessForeground: 'var(--kp-paper)',
					},
				},
			},
			routeMiddleware: './src/route-middleware.ts',
			components: {
				PageTitle: './src/components/PageTitle.astro',
				Header: './src/components/Header.astro',
				Footer: './src/components/Footer.astro',
			},
			sidebar: [
				{ label: 'Overview', items: [{ autogenerate: { directory: 'overview' } }] },
				{ label: 'Getting started', items: [{ autogenerate: { directory: 'getting-started' } }] },
				{ label: 'Integration guides', items: [{ autogenerate: { directory: 'guides' } }] },
				{
					label: 'API reference',
					items: [
						'api',
						'api/authentication',
						{ label: 'Operations', items: [{ autogenerate: { directory: 'api/operations' } }] },
						'api/errors',
					],
				},
				{ label: 'SDK reference', collapsed: true, items: [{ autogenerate: { directory: 'sdk' } }] },
				{ label: 'Smart contracts', collapsed: true, items: [{ autogenerate: { directory: 'contracts' } }] },
				{ label: 'Merchant resources', collapsed: true, items: [{ autogenerate: { directory: 'merchants' } }] },
				{ label: 'Resources', collapsed: true, items: [{ autogenerate: { directory: 'resources' } }] },
			],
			plugins: [starlightLinksValidator({ errorOnInvalidHashes: true, errorOnLocalLinks: true })],
		}),
	],
});
