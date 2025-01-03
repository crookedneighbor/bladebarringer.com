<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Playlist, Track } from './types';

	interface Props {
		playlist: Playlist;
		currentTrack?: Track;
	}
	let { currentTrack, playlist }: Props = $props();
</script>

<!-- TODO show preview label if suspected preview -->
{#key currentTrack?.id ?? ''}
	<div transition:slide class="mx-2 m-h-12">
		{#if currentTrack}
			<h1>{currentTrack.number}. {currentTrack.name}</h1>
			<div class="subtitle">{currentTrack.artist}</div>
		{:else}
			<h1>{playlist.name}</h1>
			<div class="subtitle">
				For best experience, <a href="https://accounts.spotify.com/login">login to Spotify</a> and then
				press play
			</div>
		{/if}
	</div>
{/key}

<style lang="postcss">
	h1 {
		@apply text-xl;
	}
	.subtitle {
		@apply text-xs text-gray-500;
	}
	a {
		@apply font-bold underline;
	}
</style>
