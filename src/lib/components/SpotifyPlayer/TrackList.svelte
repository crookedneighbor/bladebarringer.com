<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Track } from './types';
	import { createHoverProps, hovered } from '$lib/hovered-state.svelte.js';

	interface Props {
		tracks: Track[];
		onTrackChoice: (trackID: string) => void;
	}
	let { tracks, onTrackChoice }: Props = $props();
</script>

<ol class="border border-b-0 bg-white pt-2 w-11/12 m-auto z-0 rounded-t">
	{#each tracks as track (track.id)}
		<li transition:slide class="border-b px-2">
			<a
				href={track.permalink}
				{...createHoverProps(track.id)}
				class="text-left w-full flex flex-col py-1"
				class:hovered={hovered.name === track.slug}
				onclick={(e) => {
					e.preventDefault();

					onTrackChoice(track.id);
				}}
			>
				<span class="text-sm">{track.number}. {track.name}</span>
				<span class="text-xs text-gray-500 pl-2">{track.artist}</span>
			</a>
		</li>
	{/each}
</ol>

<style lang="postcss">
	a.hovered,
	a:focus,
	a:hover {
		/* TODO is this the right way to highlight it? */
		@apply text-amber-700;
	}
</style>
