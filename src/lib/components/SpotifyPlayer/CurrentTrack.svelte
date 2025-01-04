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
			<div class="title flex items-center">
				{currentTrack.number}. {currentTrack.name}
			</div>
			<div class="subtitle">
				<span class="flex-grow">{currentTrack.artist}</span>
			</div>
		{:else}
			<h1 class="title">{playlist.name}</h1>
			<div class="subtitle">
				<!-- TODO make conditional once we can determine that user is logged in -->
				For best experience, <a href="https://accounts.spotify.com/login">login to Spotify</a> and then
				press play
			</div>
		{/if}
	</div>
{/key}

<style lang="postcss">
	.title {
		@apply text-xl;
	}
	.subtitle {
		@apply text-xs text-gray-500;
	}
	a {
		@apply font-bold underline;
	}
</style>
