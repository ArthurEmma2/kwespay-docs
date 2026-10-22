import type { APIRoute } from 'astro';
import { docEntries, pageMarkdown, textResponse } from '../lib/llms';

export const GET: APIRoute = async () => {
	const pages = (await docEntries()).filter((e) => e.id !== 'index').map(pageMarkdown);
	return textResponse(pages.join('\n---\n\n'));
};
