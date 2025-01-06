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
			<div class="subtitle preview-text">
				{#if player.preview}
					For best experience, <a href="https://accounts.spotify.com/login">login to Spotify</a> and
					then press play. Without logging in, you will only get a 30 second preview of each track.
				{/if}
			</div>
			<div class="subtitle ios-helper">
				iOS devices can only stream 30 second previews of Spotify tracks in the browser. Tap the
				spotify icon to open the playlist in the Spotify app.
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

	@supports (-webkit-touch-callout: none) {
		.preview-text {
			@apply hidden;
		}
	}
	@supports not (-webkit-touch-callout: none) {
		.ios-helper {
			@apply hidden;
		}
	}
</style>
