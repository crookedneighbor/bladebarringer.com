<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Track } from './types';

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
				class="text-left w-full flex flex-col py-1"
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
