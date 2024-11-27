import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		cors: true,
		proxy: {
			'/api': {
				target: process.env.VITE_SUPABASE_URL,
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});

