<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Playlist, Track } from './types';
	import { player } from '../HeadlessSpotifyController/HeadlessSpotifyController.svelte';

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
			<h1 class="flex items-center">
				{currentTrack.number}. {currentTrack.name}

				{#if player.preview}
					<span class="flex bg-blue-400 text-white rounded p-1 ml-2 mt-1 text-xs">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-4 mr-1"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
							/>
						</svg>

						Preview</span
					>
				{/if}
			</h1>
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
