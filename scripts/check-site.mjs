import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const origin = (process.env.CANONICAL_ORIGIN || 'https://docs.kwespay.xyz').replace(/\/$/, '');
const base = `/${process.env.BASE_PATH || '/'}`.replace(/\/+/g, '/').replace(/\/?$/, '/');
const canonicalDeploy = base === '/' && (process.env.SITE_URL || origin).replace(/\/$/, '') === origin;
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

const walk = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});

const EMBEDS = ['widget-sandbox/'];
const htmlFiles = walk(dist).filter((f) => f.endsWith('.html') && !EMBEDS.some((e) => relative(dist, f).split(sep).join('/').startsWith(e)));
const routeOf = (file) => {
	const rel = relative(dist, file).split(sep).join('/');
	return rel === '404.html' ? '/404' : `/${rel.replace(/index\.html$/, '')}`;
};

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const metaContent = (html, key) => {
	for (const tag of html.match(/<meta\s[^>]*>/g) ?? []) {
		if (attr(tag, 'name') === key || attr(tag, 'property') === key) return attr(tag, 'content');
	}
	return undefined;
};
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const pages = new Map();
for (const file of htmlFiles) {
	const html = readFileSync(file, 'utf8');
	const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => decode(m[1])));
	pages.set(routeOf(file), { file, html, ids });
}

const titles = new Map();
const descriptions = new Map();
const indexable = [];

for (const [route, { file, html }] of pages) {
	const name = relative(dist, file);
	const head = html.slice(0, html.indexOf('</head>'));
	const isNotFound = route === '/404';
	const title = head.match(/<title>([^<]*)<\/title>/)?.[1];
	const description = metaContent(head, 'description');
	const robots = metaContent(head, 'robots');
	const canonical = head.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];

	if (!/<html[^>]*\slang="en"/.test(html)) fail(name, 'missing lang="en"');
	if (!title) fail(name, 'missing <title>');
	else if (titles.has(title)) fail(name, `duplicate title "${title}" (also ${titles.get(title)})`);
	else titles.set(title, name);
	if (!description || description.length < 40) fail(name, 'missing or short meta description');
	else if (descriptions.has(description)) fail(name, `duplicate description (also ${descriptions.get(description)})`);
	else descriptions.set(description, name);

	for (const key of ['og:title', 'og:description', 'og:type', 'og:image', 'twitter:card', 'twitter:title', 'twitter:image']) {
		if (!metaContent(head, key)) fail(name, `missing ${key}`);
	}
	for (const key of ['og:image', 'twitter:image']) {
		const value = metaContent(head, key);
		if (value && !value.startsWith(`${origin}/`)) fail(name, `${key} is not an absolute production URL: ${value}`);
		if (value && canonicalDeploy && !existsSync(join(dist, new URL(value).pathname))) fail(name, `${key} does not exist in build: ${value}`);
	}

	if (isNotFound) {
		if (!robots?.includes('noindex')) fail(name, '404 page must be noindex');
		if (canonical) fail(name, '404 page must not declare a canonical URL');
		continue;
	}

	const expected = `${origin}${route}`;
	if (canonical !== expected) fail(name, `canonical ${canonical} !== ${expected}`);
	if (metaContent(head, 'og:url') !== expected) fail(name, 'og:url does not match canonical');
	if (/localhost|127\.0\.0\.1|:\d{4}\//.test(canonical ?? '')) fail(name, `canonical points at a development host: ${canonical}`);
	if (canonicalDeploy && robots !== 'index, follow') fail(name, `unexpected robots directive "${robots}"`);
	if (!canonicalDeploy && !robots?.includes('noindex')) fail(name, 'non-canonical deployment must be noindex');
	if (robots?.includes('noindex') === false) indexable.push(expected);

	for (const [, json] of head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
		try {
			const data = JSON.parse(json);
			for (const node of data['@graph'] ?? []) {
				if (node['@type'] === 'BreadcrumbList') {
					node.itemListElement.forEach((item, i) => {
						if (item.position !== i + 1) fail(name, 'breadcrumb positions out of order');
						const path = new URL(item.item).pathname;
						if (!item.item.startsWith(`${origin}/`) || !pages.has(path)) fail(name, `breadcrumb item does not resolve: ${item.item}`);
					});
				}
				for (const key of ['url', 'mainEntityOfPage']) {
					if (node[key] && !String(node[key]).startsWith(`${origin}/`)) fail(name, `JSON-LD ${key} not on production origin`);
				}
			}
		} catch (e) {
			fail(name, `invalid JSON-LD: ${e.message}`);
		}
	}
}

for (const [route, { file, html }] of pages) {
	const name = relative(dist, file);
	const body = html.slice(html.indexOf('<body'));
	for (const [, raw] of body.matchAll(/<a\s[^>]*?href="([^"]+)"/g)) {
		const href = decode(raw);
		if (/^(https?:|mailto:|tel:|javascript:)/.test(href)) continue;
		const url = new URL(href, `https://local.test${base.replace(/\/$/, '')}${route === '/404' ? '/' : route}`);
		let path = url.pathname;
		if (!path.startsWith(base)) {
			fail(name, `link outside base path: ${href}`);
			continue;
		}
		path = `/${path.slice(base.length)}`;
		const target = pages.get(path);
		if (!target) {
			if (!existsSync(join(dist, path))) fail(name, `broken link: ${href}`);
			continue;
		}
		const hash = decodeURIComponent(url.hash.slice(1));
		if (hash && !target.ids.has(hash)) fail(name, `missing fragment #${hash} in ${path}`);
	}
	for (const [, src] of body.matchAll(/data-sandbox="([^"]+)"/g)) {
		const path = new URL(src, `https://local.test${base}`).pathname;
		const file = path.startsWith(base) ? join(dist, path.slice(base.length)) : '';
		if (!file || !existsSync(file) || !statSync(file).isFile()) fail(name, `sandbox URL must point at a file, got ${src}`);
	}
	for (const [, src] of body.matchAll(/<img\s[^>]*?src="([^"]+)"/g)) {
		if (/^(https?:|data:)/.test(src)) continue;
		const path = new URL(src, `https://local.test${base}`).pathname;
		if (!path.startsWith(base) || !existsSync(join(dist, path.slice(base.length)))) fail(name, `missing image ${src}`);
	}
}

const robotsTxt = readFileSync(join(dist, 'robots.txt'), 'utf8');
if (canonicalDeploy) {
	if (!robotsTxt.includes(`Sitemap: ${origin}/sitemap-index.xml`)) fail('robots.txt', 'missing production sitemap');
	if (/Disallow:\s*\/\s*$/m.test(robotsTxt)) fail('robots.txt', 'blocks the whole site');
	const sitemap = readdirSync(dist)
		.filter((f) => /^sitemap-\d+\.xml$/.test(f))
		.flatMap((f) => [...readFileSync(join(dist, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
	const inSitemap = new Set(sitemap);
	if (inSitemap.size !== sitemap.length) fail('sitemap', 'duplicate URLs');
	for (const url of sitemap) {
		if (!url.startsWith(`${origin}/`)) fail('sitemap', `non-production URL ${url}`);
		if (/\/404\/?$/.test(url)) fail('sitemap', 'contains 404 page');
	}
	for (const url of indexable) if (!inSitemap.has(url)) fail('sitemap', `missing ${url}`);
	for (const url of inSitemap) if (!indexable.includes(url)) fail('sitemap', `lists non-indexable or unknown ${url}`);
} else if (!/Disallow:\s*\//.test(robotsTxt)) {
	fail('robots.txt', 'non-canonical deployment should disallow crawling');
}

if (!existsSync(join(dist, 'pagefind', 'pagefind.js'))) fail('pagefind', 'search index missing');

if (errors.length) {
	console.error(`Site check failed with ${errors.length} problem(s):\n${errors.map((e) => `  - ${e}`).join('\n')}`);
	process.exit(1);
}
console.log(`Site check passed: ${pages.size} pages, ${indexable.length} indexable, base ${base}, canonical ${origin}.`);
