import type { APIRoute, GetStaticPaths } from 'astro';
import { docEntries, markdownPath, pageMarkdown, textResponse, type DocEntry } from '../lib/llms';

export const getStaticPaths: GetStaticPaths = async () =>
	(await docEntries()).map((entry) => ({
		params: { slug: markdownPath(entry.id).slice(1, -'.md'.length) },
		props: { entry },
	}));

export const GET: APIRoute = ({ props }) => textResponse(pageMarkdown(props.entry as DocEntry), 'text/markdown');
