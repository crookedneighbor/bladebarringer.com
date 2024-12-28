import { render, screen } from '@testing-library/svelte';
import SpotifyPlayer, { currentPlayer } from '../SpotifyPlayer/SpotifyPlayer.svelte';
import { fireEvent } from '@testing-library/dom';

function createEvent(
	options: { messageType?: string; duration?: number; isPaused?: boolean; position?: number } = {}
) {
	return new MessageEvent('message', {
		data: {
			type: options.messageType ?? 'playback_update',
			payload: {
				duration: options.duration ?? 100,
				isPaused: options.isPaused ?? false,
				position: options.position ?? 10
			}
		}
	});
}

describe('SpotifyPlayer', () => {
	it('renders a spotify playlist iframe', () => {
		render(SpotifyPlayer, {
			id: 'abc-id',
			kind: 'playlist'
		});

		expect(screen.getByTitle('Embeded Playlist')).toHaveAttribute(
			'src',
			expect.stringContaining('/playlist/abc-id?')
		);
	});

	it('renders a spotify track iframe', () => {
		render(SpotifyPlayer, {
			id: 'abc-id',
			kind: 'track'
		});

		expect(screen.getByTitle('Embeded Playlist')).toHaveAttribute(
			'src',
			expect.stringContaining('/track/abc-id?')
		);
	});

	it('calls onPlayEvent cb whenever song duration changes', async () => {
		const spy = vi.fn();
		render(SpotifyPlayer, {
			id: 'abc-id',
			kind: 'playlist',
			onPlayevent: spy
		});

		await fireEvent(
			window,
			createEvent({
				duration: 99
			})
		);

		expect(spy).toBeCalledTimes(1);
		expect(spy).toBeCalledWith(99);

		spy.mockReset();
		await fireEvent(
			window,
			createEvent({
				duration: 99
			})
		);
		expect(spy).not.toBeCalled();

		await fireEvent(
			window,
			createEvent({
				duration: 100
			})
		);
		expect(spy).toBeCalledTimes(1);
		expect(spy).toBeCalledWith(100);
	});

	it('does not call onPlayEvent cb if no payload is found', async () => {
		const spy = vi.fn();
		render(SpotifyPlayer, {
			id: 'abc-id',
			kind: 'playlist',
			onPlayevent: spy
		});

		await fireEvent(
			window,
			new MessageEvent('message', {
				data: {
					type: 'playback_update'
				}
			})
		);

		expect(spy).not.toBeCalled();
	});

	it('does not call onPlayEvent cb if type is not playback_update', async () => {
		const spy = vi.fn();
		render(SpotifyPlayer, {
			id: 'abc-id',
			kind: 'playlist',
			onPlayevent: spy
		});

		await fireEvent(window, createEvent({ messageType: 'not_playback_update' }));

		expect(spy).not.toBeCalled();
	});

	it('updates current player info', async () => {
		render(SpotifyPlayer, {
			id: 'abc-id',
			kind: 'playlist'
		});

		await fireEvent(
			window,
			createEvent({
				isPaused: false,
				position: 123
			})
		);
		expect(currentPlayer.playing).toBe(true);
		expect(currentPlayer.position).toBe(123);

		await fireEvent(
			window,
			createEvent({
				isPaused: true,
				position: 321
			})
		);
		expect(currentPlayer.playing).toBe(false);
		expect(currentPlayer.position).toBe(321);
	});
});
