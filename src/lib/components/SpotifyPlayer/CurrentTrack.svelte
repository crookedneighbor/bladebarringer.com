<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Track } from './types';

	interface Props {
		currentTrack?: Track;
	}
	let { currentTrack }: Props = $props();
</script>

{#if currentTrack}
	{#key currentTrack.id}
		<div transition:slide class="mx-2 text-xl">
			{currentTrack.number}. {currentTrack.name}
			<div class="text-xs text-gray-500">{currentTrack.artist}</div>
		</div>
	{/key}
{/if}
