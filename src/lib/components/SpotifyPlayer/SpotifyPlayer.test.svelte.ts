import { render, screen } from '@testing-library/svelte';
import SpotifyPlayer from '$lib/components/SpotifyPlayer/SpotifyPlayer.svelte';
import {
	player,
	resetForTest
} from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
import type { Track } from './types';
import userEvent from '@testing-library/user-event';

function createTrack(props: Partial<Track> = {}) {
	return {
		id: 'foo',
		slug: 'foo',
		name: 'Foo',
		number: 1,
		permalink: 'https://spotify.com/foo',
		artist: 'Bar',
		art: 'https://example.com/foo.png',
		...props
	};
}

describe('SpotifyPlayer', () => {
	let tracks: Track[];

	beforeEach(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vi.fn().mockReturnValue({ matches: vi.fn().mockReturnValue(true) })
		});
		vi.spyOn(player, 'load').mockResolvedValue();
		vi.spyOn(player, 'play').mockResolvedValue();
		vi.spyOn(player, 'onSongCompleted').mockReturnValue();
		tracks = ['A', 'B', 'C', 'D', 'E'].map((name, index) => {
			return createTrack({ id: name, name: `Song ${name}`, number: index + 1 });
		});
	});

	afterEach(() => {
		resetForTest();
	});

	describe('track list', () => {
		it('renders track list', () => {
			render(SpotifyPlayer, {
				tracks: tracks,
				currentTrack: tracks[2],
				playlist: {
					name: 'Name',
					permalink: 'https://open.spotify.com/playlist/yay',
					art: 'https://example.com/art.png'
				},
				onTrackChange: vi.fn()
			});

			const trackList = screen.getAllByRole('listitem');
			expect(trackList).toHaveLength(5);
		});

		// not sure how to mock the match media stuff here :/
		it.skip('hides tracklist initially on small screens', () => {
			window.matchMedia = vi.fn().mockReturnValue({
				matches: vi.fn().mockReturnValue(false)
			});
			render(SpotifyPlayer, {
				tracks: tracks,
				currentTrack: tracks[2],
				playlist: {
					name: 'Name',
					permalink: 'https://open.spotify.com/playlist/yay',
					art: 'https://example.com/art.png'
				},
				onTrackChange: vi.fn()
			});

			const trackList = screen.getAllByRole('listitem');
			expect(trackList).toHaveLength(0);
		});

		// Something weird here in the testing library, won't actually
		// hide the track list unless the if's for the toggle and the if's
		// for the length are separate - possibly to do with the transition?
		it.skip('can toggle tracklist open/close', async () => {
			const user = userEvent.setup();
			render(SpotifyPlayer, {
				tracks: tracks,
				currentTrack: tracks[2],
				playlist: {
					name: 'Name',
					permalink: 'https://open.spotify.com/playlist/yay',
					art: 'https://example.com/art.png'
				},
				onTrackChange: vi.fn()
			});
			expect(screen.getAllByRole('listitem')).toHaveLength(5);

			await user.click(screen.getByText('Close Track panel'));
			expect(screen.getAllByRole('listitem')).toHaveLength(0);
		});

		it('loads track when selected', async () => {
			const spy = vi.fn();
			const user = userEvent.setup();
			render(SpotifyPlayer, {
				tracks: tracks,
				currentTrack: tracks[2],
				playlist: {
					name: 'Name',
					permalink: 'https://open.spotify.com/playlist/yay',
					art: 'https://example.com/art.png'
				},
				onTrackChange: spy
			});

			await user.click(screen.getByText('Song A'));

			expect(spy).toBeCalledWith('A');
		});

		it('plays track from tracklist when selected if autoplay is on', async () => {
			const user = userEvent.setup();
			player.autoplay = false;
			render(SpotifyPlayer, {
				tracks: tracks,
				currentTrack: tracks[2],
				playlist: {
					name: 'Name',
					permalink: 'https://open.spotify.com/playlist/yay',
					art: 'https://example.com/art.png'
				},
				onTrackChange: vi.fn()
			});

			await user.click(screen.getByText('Song A'));
			expect(player.play).not.toBeCalled();

			player.autoplay = true;
			await user.click(screen.getByText('Song A'));
			expect(player.play).toBeCalledTimes(1);
		});
	});

	describe('auto-progress', () => {
		it('goes to next song when autocomplete is enabled ', async () => {
			const spy = vi.fn();
			player.autoplay = false;
			render(SpotifyPlayer, {
				tracks: tracks,
				currentTrack: tracks[2],
				playlist: {
					name: 'Name',
					permalink: 'https://open.spotify.com/playlist/yay',
					art: 'https://example.com/art.png'
				},
				onTrackChange: spy
			});

			const cb = vi.mocked(player.onSongCompleted).mock.calls[0][0];

			cb();
			expect(player.play).not.toBeCalled();
			expect(spy).not.toBeCalled();

			player.autoplay = true;
			cb();
			expect(spy).toBeCalledWith('D');
			expect(player.play).toBeCalledTimes(1);
		});

		it('loads empty string (signifying the playlist index should be shown) if no next track', () => {
			const spy = vi.fn();
			player.autoplay = false;
			render(SpotifyPlayer, {
				tracks: tracks,
				currentTrack: tracks[4],
				playlist: {
					name: 'Name',
					permalink: 'https://open.spotify.com/playlist/yay',
					art: 'https://example.com/art.png'
				},
				onTrackChange: spy
			});

			const cb = vi.mocked(player.onSongCompleted).mock.calls[0][0];

			cb();
			expect(spy).not.toBeCalled();

			player.autoplay = true;
			cb();
			expect(spy).toBeCalledWith('');
		});
	});
});
