<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Track } from './types';
	import { createHoverProps, hovered } from '$lib/hovered-state.svelte.js';

	interface Props {
		tracks: Track[];
		currentTrack?: Track;
		onTrackChoice: (trackID: string) => void;
	}
	let { tracks, currentTrack, onTrackChoice }: Props = $props();
</script>

<ol class="border border-t-0 bg-white w-11/12 m-auto z-0 rounded-b">
	{#each tracks as track (track.id)}
		<li
			transition:slide
			{...createHoverProps(track.slug)}
			class:current={track.id === currentTrack?.id}
			class:hovered={hovered.name === track.slug}
		>
			<span class="mr-4 text-xl">{track.number}</span>
			<!-- class="text-left flex flex-col px-2 py-1" -->
			<a
				href={track.permalink}
				onclick={(e) => {
					e.preventDefault();

					onTrackChoice(track.id);
				}}
			>
				<span>{track.name}</span>
				<span class="artist">{track.artist}</span>
			</a>
		</li>
	{/each}
</ol>

<style lang="postcss">
	ol {
		@apply list-outside list-none;
	}
	li {
		@apply flex text-sm transition-all p-2 border-b pl-4 items-center;
		a {
			@apply flex-grow;
		}
	}
	.artist {
		@apply block text-xs text-gray-500;
	}
	li:nth-child(n + 10) {
		@apply pl-2;
	}
	li.current,
	li.hovered,
	li:hover {
		@apply bg-gray-200 py-2;
	}
</style>
