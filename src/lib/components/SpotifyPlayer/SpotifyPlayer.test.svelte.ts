import { act, render, screen } from '@testing-library/svelte';
import SpotifyPlayer from '$lib/components/SpotifyPlayer/SpotifyPlayer.svelte';
import { fireEvent, waitFor } from '@testing-library/dom';
import {
	player,
	resetForTest
} from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
import type { Track } from './types';
import userEvent from '@testing-library/user-event';
import { tick } from 'svelte';

function createTrack(props: Partial<Track> = {}) {
	return {
		id: 'foo',
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
		vi.spyOn(player, 'load').mockResolvedValue();
		vi.spyOn(player, 'play').mockResolvedValue();
		vi.spyOn(player, 'onSongCompleted').mockReturnValue();
		tracks = ['A', 'B', 'C', 'D', 'E'].map((name, index) => {
			return createTrack({ id: name, name, number: index + 1 });
		});
	});

	afterEach(() => {
		resetForTest();
	});

	it('autoloads the current track', () => {
		const track = createTrack({ id: 'current-track' });
		render(SpotifyPlayer, {
			tracks: [track],
			currentTrack: track,
			spotifyPlaylistLink: 'https://open.spotify.com/playlist/yay',
			onTrackChange: vi.fn()
		});

		expect(player.load).toBeCalledTimes(1);
		expect(player.load).toBeCalledWith('current-track');
	});

	describe('track list', () => {
		it('renders track lists before and after the current track', () => {
			render(SpotifyPlayer, {
				tracks: tracks,

				currentTrack: tracks[2],
				spotifyPlaylistLink: 'https://open.spotify.com/playlist/yay',
				onTrackChange: vi.fn()
			});
			const before = screen.getByTestId('before-tracks').querySelectorAll('li');
			const after = screen.getByTestId('after-tracks').querySelectorAll('li');

			expect(before).toHaveLength(2);
			expect(before[0]).toHaveTextContent('1. A Bar');
			expect(before[1]).toHaveTextContent('2. B Bar');
			expect(after).toHaveLength(2);
			expect(after[0]).toHaveTextContent('4. D Bar');
			expect(after[1]).toHaveTextContent('5. E Bar');
		});

		// Something weird here in the testing library, won't actually
		// hide the track list unless the if's for the toggle and the if's
		// for the length are separate - possibly to do with the transition?
		it.skip('can toggle tracklist open/close', async () => {
			const user = userEvent.setup();
			render(SpotifyPlayer, {
				tracks: tracks,
				currentTrack: tracks[2],
				spotifyPlaylistLink: 'https://open.spotify.com/playlist/yay',
				onTrackChange: vi.fn()
			});
			expect(screen.getByTestId('before-tracks')).toBeInTheDocument();
			expect(screen.getByTestId('after-tracks')).toBeInTheDocument();

			await user.click(screen.getByText('Close Track panel'));
			await waitFor(() => expect(screen.queryByTestId('before-tracks')).not.toBeInTheDocument(), {
				timeout: 250
			});
			await waitFor(() => expect(screen.queryByTestId('after-tracks')).not.toBeInTheDocument(), {
				timeout: 250
			});

			await user.click(screen.getByText('Open Track panel'));
			await waitFor(() => expect(screen.queryByTestId('before-tracks')).toBeInTheDocument(), {
				timeout: 250
			});
			await waitFor(() => expect(screen.queryByTestId('after-tracks')).toBeInTheDocument(), {
				timeout: 250
			});
		});

		it('loads track when selected', async () => {
			const spy = vi.fn();
			const user = userEvent.setup();
			render(SpotifyPlayer, {
				tracks: tracks,
				currentTrack: tracks[2],
				spotifyPlaylistLink: 'https://open.spotify.com/playlist/yay',
				onTrackChange: spy
			});

			await user.click(screen.getByText('1. A'));

			expect(player.load).toBeCalledWith('A');
			expect(spy).toBeCalledWith('A');
		});

		it('plays track from tracklist when selected if autoplay is on', async () => {
			const user = userEvent.setup();
			player.autoplay = false;
			render(SpotifyPlayer, {
				tracks: tracks,
				currentTrack: tracks[2],
				spotifyPlaylistLink: 'https://open.spotify.com/playlist/yay',
				onTrackChange: vi.fn()
			});

			await user.click(screen.getByText('1. A'));
			expect(player.play).not.toBeCalled();

			player.autoplay = true;
			await user.click(screen.getByText('1. A'));
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
				spotifyPlaylistLink: 'https://open.spotify.com/playlist/yay',
				onTrackChange: spy
			});
			vi.mocked(player.load).mockReset();

			const cb = vi.mocked(player.onSongCompleted).mock.calls[0][0];

			cb();
			expect(player.load).not.toBeCalled();
			expect(player.play).not.toBeCalled();
			expect(spy).not.toBeCalled();

			player.autoplay = true;
			cb();
			expect(player.load).toBeCalledWith('D');
			expect(spy).toBeCalledWith('D');
			expect(player.play).toBeCalledTimes(1);
		});

		it('goes to begining if no next song', () => {
			const spy = vi.fn();
			player.autoplay = false;
			render(SpotifyPlayer, {
				tracks: tracks,
				currentTrack: tracks[4],
				spotifyPlaylistLink: 'https://open.spotify.com/playlist/yay',
				onTrackChange: spy
			});
			vi.mocked(player.load).mockReset();

			const cb = vi.mocked(player.onSongCompleted).mock.calls[0][0];

			cb();
			expect(player.load).not.toBeCalled();
			expect(spy).not.toBeCalled();

			player.autoplay = true;
			cb();
			expect(player.load).toBeCalledWith('A');
			expect(spy).toBeCalledWith('A');
		});
	});
});
