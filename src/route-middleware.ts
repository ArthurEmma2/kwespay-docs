import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import type { StarlightRouteData } from '@astrojs/starlight/route-data';
import { breadcrumbs } from './lib/breadcrumbs';
import {
	CANONICAL_ORIGIN,
	DEFAULT_OG_IMAGE,
	HOME_TITLE,
	INDEXABLE,
	ORGANIZATION,
	SITE_NAME,
	absoluteAsset,
	canonical,
} from './lib/site';

type HeadEntry = StarlightRouteData['head'][number];

const REPLACED_META = new Set([
	'og:url',
	'og:type',
	'og:title',
	'og:image',
	'twitter:card',
	'twitter:site',
	'twitter:title',
	'twitter:description',
	'twitter:image',
	'robots',
]);

const meta = (key: 'name' | 'property', id: string, content: string): HeadEntry => ({
	tag: 'meta',
	attrs: { [key]: id, content },
});

export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	const { entry } = route;
	const data = entry.data as typeof entry.data & { ogImage?: string; ogImageAlt?: string };
	const isHome = route.id === '' || route.id === 'index';
	const isNotFound = route.id === '404';
	const url = canonical(context.url.pathname);
	const title = isHome ? HOME_TITLE : `${data.title} | ${SITE_NAME}`;
	const description = data.description ?? '';
	const image = absoluteAsset(data.ogImage ?? DEFAULT_OG_IMAGE);
	const imageAlt = data.ogImageAlt ?? 'KwesPay Docs. Accept crypto. Price in fiat.';
	const indexable = INDEXABLE && !isNotFound && !data.draft;

	const head = route.head.filter((h) => {
		if (h.tag === 'link' && h.attrs?.rel === 'canonical') return false;
		if (h.tag === 'meta') {
			const id = String(h.attrs?.property ?? h.attrs?.name ?? '');
			if (REPLACED_META.has(id)) return false;
		}
		return true;
	});

	if (isHome) {
		const t = head.find((h) => h.tag === 'title');
		if (t) t.content = HOME_TITLE;
	}

	head.push(
		meta('name', 'robots', indexable ? 'index, follow' : 'noindex, follow'),
		meta('property', 'og:type', isHome ? 'website' : 'article'),
		meta('property', 'og:title', title),
		meta('property', 'og:image', image),
		meta('property', 'og:image:width', '1200'),
		meta('property', 'og:image:height', '630'),
		meta('property', 'og:image:type', 'image/png'),
		meta('property', 'og:image:alt', imageAlt),
		meta('name', 'twitter:card', 'summary_large_image'),
		meta('name', 'twitter:site', '@kwespay'),
		meta('name', 'twitter:title', title),
		meta('name', 'twitter:image', image),
		meta('name', 'twitter:image:alt', imageAlt),
	);
	if (description) head.push(meta('name', 'twitter:description', description));

	if (!isNotFound) {
		head.push(
			{ tag: 'link', attrs: { rel: 'canonical', href: url } },
			meta('property', 'og:url', url),
		);
	}

	const website = {
		'@type': 'WebSite',
		'@id': `${CANONICAL_ORIGIN}/#website`,
		name: SITE_NAME,
		url: `${CANONICAL_ORIGIN}/`,
		inLanguage: 'en',
		publisher: ORGANIZATION,
	};

	let graph: object[] = [];
	if (isHome) {
		graph = [website];
	} else if (!isNotFound) {
		const trail = (breadcrumbs(route.sidebar) ?? []).filter((c) => c.href);
		const items = [
			{ name: SITE_NAME, url: `${CANONICAL_ORIGIN}/` },
			...trail.map((c) => ({ name: c.label, url: canonical(c.href!) })),
			{ name: data.title, url },
		].filter((item, i, all) => all.findIndex((o) => o.url === item.url) === i);
		const article: Record<string, unknown> = {
			'@type': 'TechArticle',
			headline: data.title,
			url,
			mainEntityOfPage: url,
			inLanguage: 'en',
			isPartOf: { '@id': website['@id'] },
			publisher: ORGANIZATION,
			image,
		};
		if (description) article.description = description;
		if (route.lastUpdated) article.dateModified = route.lastUpdated.toISOString();
		graph = [
			website,
			article,
			{
				'@type': 'BreadcrumbList',
				itemListElement: items.map((item, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: item.name,
					item: item.url,
				})),
			},
		];
	}

	if (graph.length) {
		head.push({
			tag: 'script',
			attrs: { type: 'application/ld+json' },
			content: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c'),
		});
	}

	route.head = head;
});
