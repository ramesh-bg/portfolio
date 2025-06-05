import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: '404.html',
			assets: 'build'
		}),
		paths: {
			base: '/portfolio'
		}
	}
};

export default config;
