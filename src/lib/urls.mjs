export const PRODUCTION_ORIGIN = 'https://docs.kwespay.xyz';

export function normaliseBase(base = '/') {
	const trimmed = `/${base}`.replace(/\/+/g, '/').replace(/\/$/, '');
	return `${trimmed}/`;
}

export function normaliseOrigin(origin = PRODUCTION_ORIGIN) {
	return new URL(origin).origin;
}

export function stripBase(pathname, base = '/') {
	const prefix = normaliseBase(base);
	if (prefix === '/') return pathname || '/';
	if (pathname === prefix.slice(0, -1)) return '/';
	return pathname.startsWith(prefix) ? `/${pathname.slice(prefix.length)}` : pathname;
}

export function canonicalFor(pathname, { origin = PRODUCTION_ORIGIN, base = '/', hash = '' } = {}) {
	let path = stripBase(pathname, base);
	if (!path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) path = `${path}/`;
	const url = new URL(path, `${normaliseOrigin(origin)}/`);
	if (hash) url.hash = hash;
	return url.href;
}

export function isCanonicalDeployment({ site, base, origin = PRODUCTION_ORIGIN }) {
	return normaliseOrigin(site) === normaliseOrigin(origin) && normaliseBase(base) === '/';
}
