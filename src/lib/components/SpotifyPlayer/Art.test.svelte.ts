import { act, render, screen } from '@testing-library/svelte';
import {
	player,
	resetForTest
} from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
import Art from './Art.svelte';
import { page } from '$app/state';

describe('Art', () => {
	beforeEach(() => {
		page.data.playlistSlug = '1234';
	});

	afterEach(() => {
		resetForTest();
	});

	it('sets playlist link when the page has a track', async () => {
		page.data.track = {};
		render(Art, {
			playlist: {
				name: 'Name',
				art: 'https://example.com/art.png',
				permalink: '/playlists/1234'
			}
		});

		expect(screen.getByRole('link')).toHaveAttribute('href', '/playlists/1234');
	});

	it('does not set link when page does not have a track', async () => {
		delete page.data.track;
		render(Art, {
			playlist: {
				name: 'Name',
				art: 'https://example.com/art.png',
				permalink: '/playlists/1234'
			}
		});

		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('applies preveiw badge when in preview mode', async () => {
		render(Art, {
			playlist: {
				name: 'Name',
				art: 'https://example.com/art.png',
				permalink: '/playlists/1234'
			}
		});

		expect(screen.queryByText('Preview')).not.toBeInTheDocument();

		await act(() => (player.preview = true));
		expect(screen.queryByText('Preview')).toBeInTheDocument();
	});
});
