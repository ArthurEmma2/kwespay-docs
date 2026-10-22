import { canonicalFor, normaliseBase } from './urls.mjs';

export const BASE = normaliseBase(import.meta.env.BASE_URL);
export const CANONICAL_ORIGIN: string = __KP_CANONICAL_ORIGIN__;
export const INDEXABLE: boolean = __KP_INDEXABLE__;
export const SITE_NAME = 'KwesPay Docs';
export const HOME_TITLE = 'KwesPay Developer Documentation';
export const DEFAULT_OG_IMAGE = '/og/kwespay-docs.png';
export const ORGANIZATION = {
	'@type': 'Organization',
	name: 'KwesPay',
	url: 'https://www.kwespay.xyz',
	sameAs: ['https://github.com/Kwespay', 'https://x.com/kwespay'],
};

export const canonical = (pathname: string, hash = '') =>
	canonicalFor(pathname, { origin: CANONICAL_ORIGIN, base: BASE, hash });

export const absoluteAsset = (path: string) =>
	/^https?:\/\//.test(path) ? path : new URL(path.replace(/^\//, ''), `${CANONICAL_ORIGIN}/`).href;

export const href = (path: string) => `${BASE.replace(/\/$/, '')}${path}`;
