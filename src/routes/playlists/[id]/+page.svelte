<script lang="ts">
	import { player } from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
	import { createHoverProps, hovered } from '$lib/hovered-state.svelte.js';
	import { onMount } from 'svelte';

	let { data } = $props();
	let { tracks } = $derived(data);

	onMount(() => {
		player.load(tracks[0].spotifyID);
	});
</script>

<div class="lg:min-h-screen lg:flex justify-center items-center">
	<div class="album-arts">
		{#each tracks as track}
			<div class="track" style={'view-transition-name: ' + track.id}>
				<a
					href={`/playlists/2024/${track.id}`}
					{...createHoverProps(track.id)}
					class:hovered={hovered.name === track.id}
				>
					<img src={track.img} alt="" style={'view-transition-name: ' + track.id + '-img'} />
				</a>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.album-arts {
		@apply flex flex-wrap justify-center;
	}
	.track {
		@apply w-1/2 lg:w-1/5 p-2;
	}

	img {
		transition: all 0.1s ease-in;
	}
	.hovered img,
	a:hover img,
	a:focus img {
		scale: 1.15;
	}
</style>
