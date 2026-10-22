export function baseLinks(base = '/') {
	const prefix = base.replace(/\/$/, '');
	const rewrite = (attr) => (node, ctx) => {
		const value = node.properties?.[attr];
		if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return;
		if (value === prefix || value.startsWith(`${prefix}/`)) return;
		ctx.setProperty(node, attr, `${prefix}${value}`);
	};
	return {
		name: 'kwespay-base-links',
		hooks: {
			'astro:config:setup': ({ config }) => {
				if (!prefix) return;
				const options = config.markdown?.processor?.options;
				if (!options?.hastPlugins) throw new Error('kwespay-base-links requires the Sätteri Markdown processor.');
				options.hastPlugins.push({
					name: 'kwespay-base-links',
					element: [
						{ filter: ['a'], visit: rewrite('href') },
						{ filter: ['img'], visit: rewrite('src') },
					],
				});
			},
		},
	};
}
