<script lang="ts">
	import { page } from '$app/state';
	import type { Playlist } from './types';
	import { player } from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';

	interface Props {
		playlist: Playlist;
	}
	let { playlist }: Props = $props();
	let link = $derived(page.data.track ? `/playlists/${page.data.playlistSlug}` : null);
</script>

<a href={link} class="relative block">
	<span class="sr-only">Go back to playlist overview</span>
	<img src={playlist.art} class="w-full" alt="" />

	{#if player.preview}
		<span class="preview">
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
</a>

<style lang="postcss">
	.preview {
		@apply flex bg-blue-400 text-white rounded p-1 mr-1 mb-1 text-xs absolute ml-auto right-0 bottom-0;
	}
</style>
