import { act, render, screen } from '@testing-library/svelte';
import HeadlessSpotifyController, {
	player,
	resetForTest
} from './HeadlessSpotifyController.svelte';

class IFrameAPI {
	static createController = vi.fn();
}

class SpotifyController {
	loadUri = vi.fn();
	play = vi.fn();
	pause = vi.fn();
	resume = vi.fn();
	togglePlay = vi.fn();
	restart = vi.fn();
	seek = vi.fn();
	destroy = vi.fn();
	addListener = vi.fn();
}

describe('HeadlessSpotifyController', () => {
	afterEach(() => {
		resetForTest();
	});

	it('adds the spotify script to the head', () => {
		render(HeadlessSpotifyController);

		const script = document.head.querySelector('script');

		expect(script?.src).toMatch('https://open.spotify.com');
	});

	it('provides a controller state with default values', () => {
		expect(player.ready).toEqual(false);
		expect(player.autoscroll).toEqual(false);
		expect(player.preview).toEqual(false);
		expect(player.playing).toEqual(false);
		expect(player.buffering).toEqual(false);
		expect(player.autoplay).toEqual(false);
		expect(player.position).toEqual(0);
		expect(player.duration).toEqual(0);
	});

	it('creates iframe in spotify-iframe-container when onSpotifyIframeApiReady is called', () => {
		render(HeadlessSpotifyController);

		// @ts-expect-error not a default window function, obvs
		window.onSpotifyIframeApiReady(IFrameAPI);

		expect(IFrameAPI.createController).toBeCalledTimes(1);
		expect(IFrameAPI.createController).toBeCalledWith(
			screen.getByTestId('spotify-iframe-container'),
			{
				uri: 'spotify:track:2bNCdW4rLnCTzgqUXTTDO1',
				height: 1,
				width: 1
			},
			expect.any(Function)
		);
	});

	it('destroys the controller when component unmounts', async () => {
		const { unmount } = render(HeadlessSpotifyController);

		// @ts-expect-error not a default window function, obvs
		window.onSpotifyIframeApiReady(IFrameAPI);
		const callback = IFrameAPI.createController.mock.calls[0][2];
		const instance = new SpotifyController();

		await act(() => callback(instance));

		expect(instance.destroy).not.toBeCalled();
		unmount();

		expect(instance.destroy).toBeCalledTimes(1);
	});

	it('waits to run controller functions until controller is ready', async () => {
		render(HeadlessSpotifyController);

		// methods fired off before onSpotifyIframeApiReady is even called
		await act(() => {
			player.load('id');
			player.play();
			player.resume();
			player.pause();
			player.toggle();
			player.restart();
			player.seek(1);
		});

		// @ts-expect-error not a default window function, obvs
		window.onSpotifyIframeApiReady(IFrameAPI);
		const callback = IFrameAPI.createController.mock.calls[0][2];
		const instance = new SpotifyController();
		await act(() => callback(instance));
		player.initialLoadComplete = true;

		// callback passed instance, but ready not fired
		expect(player.ready).toEqual(false);
		expect(instance.play).not.toBeCalled();
		expect(instance.pause).not.toBeCalled();
		expect(instance.resume).not.toBeCalled();
		expect(instance.togglePlay).not.toBeCalled();
		expect(instance.restart).not.toBeCalled();
		expect(instance.seek).not.toBeCalled();

		const readyCB = instance.addListener.mock.calls[0][1];
		await act(() => readyCB());

		expect(player.ready).toEqual(true);
		expect(instance.play).toBeCalledTimes(2); // once for initial load, second for explicit call
		expect(instance.pause).toBeCalledTimes(1);
		expect(instance.resume).toBeCalledTimes(1);
		expect(instance.togglePlay).toBeCalledTimes(1);
		expect(instance.restart).toBeCalledTimes(1);
		expect(instance.seek).toBeCalledTimes(1);
	});

	it('updates controller data automatically as playback_update events fire', async () => {
		render(HeadlessSpotifyController);

		// @ts-expect-error not a default window function, obvs
		window.onSpotifyIframeApiReady(IFrameAPI);
		const callback = IFrameAPI.createController.mock.calls[0][2];
		const instance = new SpotifyController();

		callback(instance);
		const updateInfoCB = instance.addListener.mock.calls[1][1];
		player.ready = true;
		player.initialLoadComplete = true;

		await updateInfoCB({
			data: {
				position: 123,
				isPaused: false,
				isBuffering: true,
				duration: 321
			}
		});

		expect(player.position).toEqual(123);
		expect(player.duration).toEqual(321);
		expect(player.playing).toEqual(true);
		expect(player.buffering).toEqual(true);
	});

	it('does not update non-buffering data if player is not ready', async () => {
		render(HeadlessSpotifyController);

		// @ts-expect-error not a default window function, obvs
		window.onSpotifyIframeApiReady(IFrameAPI);
		const callback = IFrameAPI.createController.mock.calls[0][2];
		const instance = new SpotifyController();

		callback(instance);
		const updateInfoCB = instance.addListener.mock.calls[1][1];
		player.ready = false;
		player.initialLoadComplete = true;

		await updateInfoCB({
			data: {
				position: 123,
				isPaused: false,
				isBuffering: true,
				duration: 321
			}
		});

		expect(player.position).toEqual(0);
		expect(player.duration).toEqual(0);
		expect(player.playing).toEqual(false);
		expect(player.buffering).toEqual(true);
	});

	it('updates preview when preview duration is detected', async () => {
		render(HeadlessSpotifyController);

		// @ts-expect-error not a default window function, obvs
		window.onSpotifyIframeApiReady(IFrameAPI);
		const callback = IFrameAPI.createController.mock.calls[0][2];
		const instance = new SpotifyController();

		callback(instance);
		const updateInfoCB = instance.addListener.mock.calls[1][1];
		player.ready = true;

		await updateInfoCB({
			data: {
				position: 123,
				isPaused: true,
				isBuffering: false,
				duration: 30000
			}
		});
		expect(player.preview).toEqual(true);
	});

	it('finishes loading after pause succesfully stops playback updates', async () => {
		render(HeadlessSpotifyController);

		// @ts-expect-error not a default window function, obvs
		window.onSpotifyIframeApiReady(IFrameAPI);
		const callback = IFrameAPI.createController.mock.calls[0][2];
		const instance = new SpotifyController();

		callback(instance);
		const readyCB = instance.addListener.mock.calls[0][1];
		await act(() => readyCB());
		player.ready = true;

		const updateInfoCB = instance.addListener.mock.calls[1][1];

		await updateInfoCB({
			data: {
				position: 123,
				isPaused: false,
				isBuffering: true,
				duration: 30000
			}
		});
		// when buffering skip both
		expect(player.initialLoadComplete).toEqual(false);
		expect(instance.pause).not.toBeCalled();

		await updateInfoCB({
			data: {
				position: 123,
				isPaused: false,
				isBuffering: false,
				duration: 30000
			}
		});
		// now pause has happend, but initial load isn't complete
		expect(player.initialLoadComplete).toEqual(false);
		expect(instance.pause).toBeCalledTimes(1);

		await updateInfoCB({
			data: {
				position: 123,
				isPaused: true,
				isBuffering: false,
				duration: 20000
			}
		});
		expect(player.initialLoadComplete).toEqual(true);
	});

	it('calls registered song complete functions when a song completes', async () => {
		render(HeadlessSpotifyController);

		// @ts-expect-error not a default window function, obvs
		window.onSpotifyIframeApiReady(IFrameAPI);
		const callback = IFrameAPI.createController.mock.calls[0][2];
		const instance = new SpotifyController();

		callback(instance);
		const updateInfoCB = instance.addListener.mock.calls[1][1];
		player.ready = true;
		player.initialLoadComplete = true;

		const spy = vi.fn();
		player.onSongCompleted(spy);

		await updateInfoCB({
			data: {
				position: 320,
				isPaused: false,
				isBuffering: true,
				duration: 321
			}
		});
		expect(spy).not.toBeCalled();

		// does not call if duration is 0
		await updateInfoCB({
			data: {
				position: 1,
				isPaused: false,
				isBuffering: true,
				duration: 0
			}
		});
		expect(spy).not.toBeCalled();

		await updateInfoCB({
			data: {
				position: 100,
				isPaused: false,
				isBuffering: true,
				duration: 100
			}
		});
		expect(spy).toBeCalledTimes(1);
	});

	describe('load', () => {
		let instance: SpotifyController;

		beforeEach(async () => {
			render(HeadlessSpotifyController);
			// @ts-expect-error not a default window function, obvs
			window.onSpotifyIframeApiReady(IFrameAPI);
			const callback = IFrameAPI.createController.mock.calls[0][2];
			instance = new SpotifyController();
			callback(instance);

			// got to do this silly thing to put it in a state where load can run at all
			const updateInfoCB = instance.addListener.mock.calls[1][1];
			await updateInfoCB({
				data: {
					position: 123,
					isPaused: true,
					isBuffering: false,
					duration: 9999999
				}
			});
		});

		it('loads spotify uri', async () => {
			await player.load('spotify-id', 'playlist');

			expect(instance.loadUri).toBeCalledWith('spotify:playlist:spotify-id');
		});

		it('skips loading if the previous uri was already loaded', async () => {
			await player.load('spotify-id', 'playlist');

			expect(instance.loadUri).toBeCalledWith('spotify:playlist:spotify-id');

			// show it wasn't called again
			await player.load('spotify-id', 'playlist');
			expect(instance.loadUri).toBeCalledTimes(1);

			// show the uniquness is on id + kind
			await player.load('spotify-id', 'track');
			expect(instance.loadUri).toBeCalledTimes(2);
		});

		it('defaults load kind to track', async () => {
			await player.load('spotify-id');

			expect(instance.loadUri).toBeCalledTimes(1);
			expect(instance.loadUri).toBeCalledWith('spotify:track:spotify-id');
		});

		it('resets ready state', async () => {
			// show ready event has already happened
			const readyCB = instance.addListener.mock.calls[0][1];
			await act(() => readyCB());
			// clear out records of call in initialization
			instance.play.mockReset();

			player.playing = true;
			player.position = 100;
			player.duration = 110;
			await player.load('spotify-id');

			expect(player.playing).toEqual(false);
			expect(player.position).toEqual(0);
			expect(player.duration).toEqual(0);

			// show that even though ready event fired once,
			// player is still not ready
			await act(() => {
				player.play();
			});
			expect(instance.play).not.toBeCalled();

			await act(() => readyCB());
			expect(instance.play).toBeCalledTimes(1);
		});
	});

	describe('controller methods', () => {
		let instance: SpotifyController;

		beforeEach(async () => {
			render(HeadlessSpotifyController);
			// @ts-expect-error not a default window function, obvs
			window.onSpotifyIframeApiReady(IFrameAPI);
			const callback = IFrameAPI.createController.mock.calls[0][2];
			instance = new SpotifyController();
			callback(instance);

			const readyCB = instance.addListener.mock.calls[0][1];
			await act(() => readyCB());
		});

		it('play', async () => {
			// got to clear out the first call that
			// happens as part of initialization
			instance.play.mockReset();
			await player.play();

			expect(instance.play).toBeCalledTimes(1);
		});

		it('pause', async () => {
			await player.pause();

			expect(instance.pause).toBeCalledTimes(1);
		});

		it('toggle', async () => {
			await player.toggle();

			expect(instance.togglePlay).toBeCalledTimes(1);
		});

		it('resume', async () => {
			await player.resume();

			expect(instance.resume).toBeCalledTimes(1);
		});

		it('restart', async () => {
			await player.restart();

			expect(instance.restart).toBeCalledTimes(1);
		});

		it('seek', async () => {
			await player.seek(999);

			expect(instance.seek).toBeCalledTimes(1);
			expect(instance.seek).toBeCalledWith(999);
		});
	});
});
