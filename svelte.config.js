import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { importAssets } from 'svelte-preprocess-import-assets';

import { mdsvex, escapeSvelte } from 'mdsvex';

import { getHighlighter } from 'shiki';

import remarkUnwrapImages from 'remark-unwrap-images';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	// highlight: {
	// 	highlighter: async (code, lang = 'text') => {
	// 		const highlighter = await getHighlighter({
	// 			themes: ['poimandres', 'monokai', 'github-dark'],
	// 			langs: [
	// 				'javascript',
	// 				'typescript',
	// 				'html',
	// 				'svelte',
	// 				'json',
	// 				'css',
	// 				'postcss',
	// 				'yaml',
	// 				'shellscript',
	// 				'text'
	// 			]
	// 		});
	// 		// https://shiki.style/languages
	// 		await highlighter.loadLanguage(
	// 			'javascript',
	// 			'typescript',
	// 			'html',
	// 			'svelte',
	// 			'json',
	// 			'css',
	// 			'postcss',
	// 			'yaml',
	// 			'shellscript',
	// 			'text'
	// 		);
	// 		const html = escapeSvelte(
	// 			highlighter.codeToHtml(code, {
	// 				lang,
	// 				theme: 'github-dark'
	// 			})
	// 		);
	// 		return `{@html \`${html}\` }`;
	// 	}
	// },
	layout: {
		_: './src/mdsvex.svelte'
	},
	remarkPlugins: [
		remarkUnwrapImages,
		[
			remarkToc,
			{
				tight: true
			}
		]
	],
	rehypePlugins: [rehypeSlug]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	extensions: ['.svelte', '.md'],
	onwarn: (warning, handler) => {
		// e.g. don't warn on a11y-autofocus
		// if (warning.code === 'a11y-click-events-have-key-events') return;
		if (warning.code === 'vite-plugin-svelte-preprocess-many-dependencies') return;

		// let vite handle all other warnings normally
		handler(warning);
	},
	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexOptions),
		importAssets({
			sources: (default_sources) => {
				return [
					...default_sources,
					{
						tag: `a`,
						srcAttributes: [`href`],
						filter: (node) =>
							node.attributes?.href.toLowerCase().endsWith(`.pdf`) ||
							node.attributes?.href.toLowerCase().endsWith(`.txt`) ||
							node.attributes?.href.toLowerCase().endsWith(`.c3p`) ||
							node.attributes?.href.toLowerCase().endsWith(`.zip`)
					},
					{
						// Include URLs with specific extensions only
						urlFilter: (url) => /\.(pdf|txt|c3p|C3P|zip|ZIP)$/.test(url)
					}
				];
			}
		})
	],
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			fallback: '404.html'
		}),
		// prerender: {
		// 	handleHttpError: 'warn'
		// },
		paths: {
			base: process.argv.includes('dev') ? '' : ''
		},
		alias: {
			$root: `.`
		}
	}
};

export default config;
