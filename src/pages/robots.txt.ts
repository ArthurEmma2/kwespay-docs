import type { APIRoute } from 'astro';
import { CANONICAL_ORIGIN, INDEXABLE } from '../lib/site';

export const GET: APIRoute = () => {
	const body = INDEXABLE
		? `User-agent: *\nAllow: /\n\nSitemap: ${CANONICAL_ORIGIN}/sitemap-index.xml\n`
		: 'User-agent: *\nDisallow: /\n';
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
