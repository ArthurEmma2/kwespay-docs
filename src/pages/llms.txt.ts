import type { APIRoute } from 'astro';
import { CANONICAL_ORIGIN } from '../lib/site';
import { docEntries, markdownUrl, textResponse } from '../lib/llms';

const SECTIONS: [string, string][] = [
	['overview', 'Overview'],
	['getting-started', 'Getting started'],
	['guides', 'Integration guides'],
	['api', 'API reference'],
	['sdk', 'SDK reference'],
	['contracts', 'Smart contracts'],
	['merchants', 'Merchant resources'],
	['resources', 'Resources'],
];

export const GET: APIRoute = async () => {
	const entries = await docEntries();
	const lines = [
		'# KwesPay Docs',
		'',
		'> KwesPay is a multi-chain crypto payment gateway: merchants price orders in fiat, the KwesPay backend signs the payment terms, and the customer pays the merchant directly through a contract on EVM networks, Sui or Stellar. These docs cover the checkout widget, the @kwespay/client JavaScript SDK, the GraphQL API, webhooks and the payment contracts.',
		'',
		`Every page is available as Markdown at the URLs below. The complete documentation in one file: ${CANONICAL_ORIGIN}/llms-full.txt`,
	];
	for (const [dir, label] of SECTIONS) {
		const inSection = entries.filter((e) => e.id === dir || e.id.startsWith(`${dir}/`));
		if (!inSection.length) continue;
		lines.push('', `## ${label}`, '');
		for (const e of inSection) lines.push(`- [${e.data.title}](${markdownUrl(e.id)}): ${e.data.description}`);
	}
	return textResponse(`${lines.join('\n')}\n`);
};
