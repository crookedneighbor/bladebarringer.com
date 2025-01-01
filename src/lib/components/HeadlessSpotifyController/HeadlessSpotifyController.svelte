<script lang="ts" module>
	interface UpdateEvent {
		isPaused: boolean;
		isBuffering: boolean;
		duration: number;
		position: number;
	}
	type ListenerCallback = (event: { data: UpdateEvent }) => void;
	interface SpotifyController {
		loadUri: (uri: string) => void;
		play: () => void;
		pause: () => void;
		resume: () => void;
		togglePlay: () => void;
		restart: () => void;
		seek: (pos: number) => void;
		destroy: () => void;
		addListener: (eventName: string, cb: ListenerCallback) => void;
	}

	export function resetForTest() {
		// @ts-expect-error i know this is dumb, but it's for testing the singleton
		player.readyToLoadPromise = new Promise((resolve) => {
			player._readyToLoadResolve = resolve;
		});
		// @ts-expect-error i know this is dumb, but it's for testing the singleton
		player.readyPromise = new Promise((resolve) => {
			player._readyResolve = resolve;
		});
		player.ready = false;
		player.playing = false;
		player.buffering = false;
		player.position = 0;
		player.duration = 0;
		player.autoplay = false;
	}

	type EventCallback = () => void;

	class Player {
		private readyPromise: Promise<void>;
		private readyToLoadPromise: Promise<void>;
		_readyResolve = () => {};
		_readyToLoadResolve = () => {};
		_controller: null | SpotifyController = $state(null);
		_songCompletedFns: EventCallback[] = $state([]);

		ready = $state(false);
		playing = $state(false);
		buffering = $state(false);
		position = $state(0);
		duration = $state(0);
		autoplay = $state(false);

		constructor() {
			this.readyToLoadPromise = new Promise((resolve) => {
				this._readyToLoadResolve = resolve;
			});
			this.readyPromise = new Promise((resolve) => {
				this._readyResolve = resolve;
			});
		}

		async load(id: string, kind: 'track' | 'playlist' = 'track') {
			this.ready = false;
			this.readyPromise = new Promise((resolve) => {
				this._readyResolve = resolve;
			});
			this.playing = false;
			this.position = 0;
			this.duration = 0;
			await this.readyToLoadPromise;
			return this._controller?.loadUri(`spotify:${kind}:${id}`);
		}

		async play() {
			await this.readyPromise;
			return this._controller?.play();
		}

		async pause() {
			await this.readyPromise;
			return this._controller?.pause();
		}

		async resume() {
			await this.readyPromise;
			return this._controller?.resume();
		}

		async toggle() {
			await this.readyPromise;
			return this._controller?.togglePlay();
		}

		async restart() {
			await this.readyPromise;
			return this._controller?.restart();
		}

		async seek(pos: number) {
			await this.readyPromise;
			return this._controller?.seek(pos);
		}

		onSongCompleted(cb: EventCallback) {
			this._songCompletedFns.push(cb);
		}
	}

	export const player = new Player();
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let el: HTMLDivElement;

	const callback = (embedController: SpotifyController) => {
		player._controller = embedController;
		player._readyToLoadResolve();

		embedController.addListener('ready', () => {
			player._readyResolve();
			player.ready = true;
		});
		embedController.addListener('playback_update', ({ data }) => {
			player.position = data.position;
			player.playing = !data.isPaused;
			player.buffering = data.isBuffering;
			player.duration = data.duration;

			if (data.position >= data.duration && data.duration > 0) {
				player._songCompletedFns.forEach((cb) => cb());
			}
		});
	};

	onMount(() => {
		// @ts-expect-error I know, I know, but this is how Spotify wants us to do it
		window.onSpotifyIframeApiReady = (IFrameAPI) => {
			const options = {
				height: 1
			};
			IFrameAPI.createController(el, options, callback);
		};

		return () => {
			player?._controller?.destroy();
		};
	});
</script>

<svelte:head>
	<script src="https://open.spotify.com/embed/iframe-api/v1" async></script>
</svelte:head>

<div data-testid="spotify-iframe-container" bind:this={el}></div>
