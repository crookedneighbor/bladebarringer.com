import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	resolve: {
		conditions: mode === 'test' ? ['browser'] : []
	},

	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.ts'],
		include: ['src/**/*.test.{js,ts}', 'src/**/*.test.svelte.{js,ts}'],
		restoreMocks: true,
		globals: true
	}
}));
