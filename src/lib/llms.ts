import { getCollection, type CollectionEntry } from 'astro:content';
import { CANONICAL_ORIGIN, canonical } from './site';

export type DocEntry = CollectionEntry<'docs'>;

const HIDDEN = new Set(['404']);

export function markdownPath(id: string) {
	return id === '' || id === 'index' ? '/index.md' : `/${id.replace(/\/index$/, '')}.md`;
}

export const markdownUrl = (id: string) => `${CANONICAL_ORIGIN}${markdownPath(id)}`;

export const pageUrl = (id: string) => canonical(id === '' || id === 'index' ? '/' : `/${id}/`);

export async function docEntries(): Promise<DocEntry[]> {
	const entries = await getCollection('docs', (e) => !HIDDEN.has(e.id) && !e.data.draft);
	return entries.sort((a, b) => {
		if (a.id === 'index') return -1;
		if (b.id === 'index') return 1;
		return a.id.localeCompare(b.id);
	});
}

function cleanBody(body: string) {
	const out: string[] = [];
	let fence: string | null = null;
	for (const line of body.split('\n')) {
		const marker = line.match(/^\s*(```+|~~~+)/)?.[1];
		if (marker) {
			if (!fence) fence = marker;
			else if (marker.startsWith(fence)) fence = null;
			out.push(line);
			continue;
		}
		if (fence) {
			out.push(line);
			continue;
		}
		if (/^import\s.+\sfrom\s['"].+['"];?\s*$/.test(line)) continue;
		const tab = line.match(/^\s*<TabItem\s+label="([^"]+)"[^>]*>\s*$/);
		if (tab) {
			out.push(`**${tab[1]}**`, '');
			continue;
		}
		if (/^\s*<\/?(Tabs|TabItem|Steps|CardGrid|Card|LinkCard|Aside)\b[^>]*>\s*$/.test(line)) continue;
		if (/^\s*<[A-Z][A-Za-z]*\b[^>]*\/>\s*$/.test(line)) continue;
		out.push(
			line
				.replace(/^(\s*)<Aside[^>]*>(.*)<\/Aside>\s*$/, '$1> $2')
				.replace(/\]\(\/(?!\/)/g, `](${CANONICAL_ORIGIN}/`),
		);
	}
	return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function pageMarkdown(entry: DocEntry) {
	const { title, description } = entry.data;
	return [`# ${title}`, '', `> ${description}`, '', `Source: ${pageUrl(entry.id)}`, '', cleanBody(entry.body ?? ''), ''].join('\n');
}

export const askClaudeUrl = (prompt: string) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;

const ANSWER_RULES =
	'Base your answers on the KwesPay docs, link the pages you used, and say so when the docs do not cover something.';

export const askClaudeAboutPage = (title: string, id: string) =>
	askClaudeUrl(
		`Read the KwesPay documentation page "${title}" at ${markdownUrl(id)}. Use the docs index at ${CANONICAL_ORIGIN}/llms.txt to open any other KwesPay pages you need. Then help me with my KwesPay integration. ${ANSWER_RULES}`,
	);

export const askClaudeAboutDocs = () =>
	askClaudeUrl(
		`Read the KwesPay developer documentation index at ${CANONICAL_ORIGIN}/llms.txt (the full docs are at ${CANONICAL_ORIGIN}/llms-full.txt). Then help me integrate KwesPay payments into my app. ${ANSWER_RULES}`,
	);

export const textResponse =(body: string, type = 'text/plain') =>
	new Response(body, { headers: { 'Content-Type': `${type}; charset=utf-8` } });
