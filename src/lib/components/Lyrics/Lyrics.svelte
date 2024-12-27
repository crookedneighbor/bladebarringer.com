<script lang="ts">
	import { currentPlayer } from '$lib/components/SpotifyPlayer/SpotifyPlayer.svelte';
	interface Line {
		position: number;
		words: string;
	}
	interface Props {
		lines: Line[];
		id: string;
	}
	let { lines, id }: Props = $props();
	let thisSong = $derived(id === currentPlayer.songId);
</script>

<blockquote>
	{#each lines as line}
		<p class:highlighted={thisSong && currentPlayer.position >= line.position}>
			{line.words}
		</p>
	{/each}
</blockquote>

<style lang="postcss">
	.highlighted {
		@apply text-red-800;
	}
</style>
