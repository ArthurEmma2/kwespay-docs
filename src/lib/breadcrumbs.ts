import type { StarlightRouteData } from '@astrojs/starlight/route-data';

type Entry = StarlightRouteData['sidebar'][number];
export type Crumb = { label: string; href?: string };

function landing(entries: Entry[]): string | undefined {
	const first = entries[0];
	if (!first || first.type !== 'link') return undefined;
	const rest = entries.slice(1).flatMap(function links(e): string[] {
		return e.type === 'link' ? [e.href] : e.entries.flatMap(links);
	});
	return rest.length > 0 && rest.every((h) => h.startsWith(first.href)) ? first.href : undefined;
}

export function breadcrumbs(sidebar: Entry[], path: Crumb[] = []): Crumb[] | undefined {
	for (const entry of sidebar) {
		if (entry.type === 'link') {
			if (entry.isCurrent) return path;
		} else {
			const found = breadcrumbs(entry.entries, [...path, { label: entry.label, href: landing(entry.entries) }]);
			if (found) return found;
		}
	}
	return undefined;
}
