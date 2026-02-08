import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'] })],
	extensions: ['.svelte', '.md'],

	kit: {
		// Static adapter for deployment to any static host
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true,
			paths: {
				base: process.env.NODE_ENV === 'production' ? '/Portfolio' : ''
			}
		}),
	},
	prerender: {
		handleHttpError: 'warn'
	}
};

export default config;
