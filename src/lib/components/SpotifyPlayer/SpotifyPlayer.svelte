<script lang="ts" module>
	export let currentPlayer = $state({
		songId: '', // setable outside the module
		playing: false,
		position: 0
	});
</script>

<script lang="ts">
	interface Props {
		id: string;
		kind: 'playlist' | 'track';
		onPlayevent?: (dir: number) => void;
	}
	let { id, kind, onPlayevent }: Props = $props();

	let currentDuration = $state(0);

	function onmessage(e: MessageEvent) {
		const payload = e.data?.payload;
		if (!payload || e.data?.type !== 'playback_update') {
			return;
		}

		const { duration, isPaused, position } = e.data.payload;
		currentPlayer.playing = !isPaused;
		currentPlayer.position = position;

		// got to do it this way, because the player
		// changes the duration after the initial load
		// so the current duration is not accurate
		// for the song being played after the initial
		// event
		if (currentDuration !== duration) {
			currentDuration = duration;
			onPlayevent?.(duration);
		}
	}
</script>

<svelte:window {onmessage} />

<div class="player">
	<iframe
		style="border-radius:12px"
		src={`https://open.spotify.com/embed/${kind}/${id}?utm_source=generator&theme=0`}
		width="100%"
		height="352"
		frameBorder="0"
		allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
		loading="lazy"
		title="Embeded Playlist"
	></iframe>
</div>
