import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	resolve: {
		conditions: mode === 'test' ? ['browser'] : []
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.ts'],
		include: ['src/**/*.{test,spec}.{js,ts}'],
		restoreMocks: true,
		globals: true
	},
	typecheck: {
		tsConfig: mode === 'test' ? 'tsconfig.vitest.json' : 'tsconfig.json'
	}
}));
