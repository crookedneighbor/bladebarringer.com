<script lang="ts" module>
	const LENGTH_OF_PREVIEW_TRACK = 30000;
	const URI_FOR_JOHN_CAGES_4_33 = 'spotify:track:2bNCdW4rLnCTzgqUXTTDO1';

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
		player.initialLoadComplete = false;
		player.loadedURI = '';
		player.playing = false;
		player.buffering = false;
		player.position = 0;
		player.duration = 0;
		player.autoplay = false;
		player.autoscroll = false;
	}

	type EventCallback = () => void;

	class Player {
		private readyPromise: Promise<void>;
		private readyToLoadPromise: Promise<void>;

		_readyResolve = () => {};
		_readyToLoadResolve = () => {};
		_controller: null | SpotifyController = $state(null);
		_songCompletedFns: EventCallback[] = $state([]);

		initialLoadComplete = $state(false);
		preview = $state(false);
		ready = $state(false);
		loadedURI = $state('');
		autoscroll = $state(false);
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
			const uri = `spotify:${kind}:${id}`;
			if (this.loadedURI === uri) {
				return;
			}
			this.loadedURI = uri;
			this.ready = false;
			this.position = 0;
			this.duration = 0;
			this.playing = false;
			this.readyPromise = new Promise((resolve) => {
				this._readyResolve = resolve;
			});
			await this.readyToLoadPromise;
			this._controller?.loadUri(uri);
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

		embedController.addListener('ready', () => {
			player._readyResolve();
			player.ready = true;
		});
		embedController.addListener('playback_update', ({ data }) => {
			// set this first so it's up to date
			// even if the rest of the data is not
			// ready to process
			player.buffering = data.isBuffering;

			if (!player.initialLoadComplete) {
				if (data.isBuffering) {
					// got to wait until it's
					// done buffering so we can determine the logged in state
					return;
				}
				if (data.isPaused) {
					// if duration is less than or equal to the length
					// of a preview track, it's mostly likely a preview track
					// will give a false positive about this if the track is
					// just really short
					player.preview = data.duration <= LENGTH_OF_PREVIEW_TRACK;
					player.initialLoadComplete = true;
					player._readyToLoadResolve();
					return;
				}
				player.pause();

				return;
			}
			if (!player.ready) {
				// stop updating if currently loading
				return;
			}
			player.position = data.position;
			player.playing = !data.isPaused;
			player.duration = data.duration;

			if (data.position >= data.duration && data.duration > 0) {
				player._songCompletedFns.forEach((cb) => cb());
			}
		});

		// got to start the john cage piece to kick off the playback
		// update event so we can derive info about the user, namely
		// whether or not they are logged in
		player.play();
	};

	onMount(() => {
		// @ts-expect-error I know, I know, but this is how Spotify wants us to do it
		window.onSpotifyIframeApiReady = (IFrameAPI) => {
			const options = {
				// use john cage's 4'33" (silence) to gather some info about whether or not the
				// user is logged in based on the duration of the song
				uri: URI_FOR_JOHN_CAGES_4_33,
				height: 1,
				width: 1
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
