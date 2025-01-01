import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

const IGNORABLE_WARNINGS = ['Error: Not implemented: HTMLCanvasElement.prototype.getContext'];

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
		globals: true,
		onConsoleLog(log: string) {
			if (IGNORABLE_WARNINGS.find((warning) => log.includes(warning))) {
				return false;
			}
		}
	}
}));
