import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			typography: {
				quoteless: {
					css: {
						'blockquote p': { margin: 0 },
						'blockquote p::before': { content: 'none' },
						'blockquote p::after': { content: 'none' }
					}
				}
			}
		}
	},
	plugins: [typography]
};
