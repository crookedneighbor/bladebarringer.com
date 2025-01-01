import '@testing-library/svelte/vitest';
import '@testing-library/jest-dom/vitest';
// animations polyfill for components that rely
// on svelte transitions
import 'web-animations-js/web-animations-next-lite.min.js';

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});
