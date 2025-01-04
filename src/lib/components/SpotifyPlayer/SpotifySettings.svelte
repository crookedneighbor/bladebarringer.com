<script lang="ts">
	import { player } from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
</script>

<div class="p-2 text-sm text-gray-500 border-t">
	<div class="flex items-center" class:line-through={player.preview}>
		<input
			class="mr-2"
			type="checkbox"
			disabled={player.preview}
			bind:checked={player.autoscroll}
		/> Autoscroll lyrics
	</div>
	{#if player.preview}
		<div class="text-xs">(Must log into Spotify for this feature)</div>
	{/if}
</div>
