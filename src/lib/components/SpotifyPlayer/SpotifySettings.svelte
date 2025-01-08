<script lang="ts">
	import { player } from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
</script>

<div class="spotify-settings">
	<div class="flex items-center" class:line-through={player.preview}>
		<input
			class="mr-2"
			type="checkbox"
			disabled={player.preview}
			bind:checked={player.autoscroll}
		/> Autoscroll lyrics
	</div>
	{#if player.preview}
		<div class="text-xs">
			(Must <a href="https://accounts.spotify.com/login">log into Spotify</a> for this feature)
		</div>
	{/if}
</div>

<style lang="postcss">
	.spotify-settings {
		@apply p-2 text-sm text-gray-500 border-t border-gray-600;
	}
	a {
		@apply font-bold underline;
	}

	@supports (-webkit-touch-callout: none) {
		.spotify-settings {
			@apply hidden;
		}
	}
</style>
