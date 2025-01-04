<script lang="ts" module>
	interface Line {
		position?: number;
		words?: string;
		spacer?: boolean;
	}
	export interface Props {
		lines: Line[];
	}
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	import { player } from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';

	let { lines }: Props = $props();
	// TODO fix bug where lyrics sometimes show before they are supposed to
	// and flash back and forth
	let showLyrics = $derived.by(() => {
		if (!player.ready || lines.length === 0) {
			return false;
		}
		if (player.preview && player.playing) {
			return true;
		}

		const pos = player.position;
		const firstLinePos = lines.at(0)?.position ?? 0;
		const lastLinePos = lines.at(-1)?.position ?? 0;

		if (pos <= 0) {
			return false;
		}

		if (pos - 8000 > lastLinePos) {
			return false;
		}

		return pos + 1000 > firstLinePos;
	});
	let currentLineIndex = $derived.by(() => {
		return lines.findLastIndex((line) => {
			if (!line.position) {
				return false;
			}
			return line.position <= player.position;
		});
	});

	$effect(() => {
		if (player.preview) {
			return;
		}
		const node = document.querySelector(`[data-line-index="${currentLineIndex}"]`);
		// TODO handle stopping scroll if user scrolled or tabbed within lyrics window
		node?.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
	});
</script>

{#if showLyrics}
	<div class="lyrics" transition:fade>
		<blockquote>
			{#each lines as line, index}
				{#if line.spacer}
					<div class="h-4"></div>
				{:else if line.words && typeof line.position === 'number'}
					{@const passed = player.position >= line.position}
					<button
						onclick={() => {
							player.seek((line.position ?? 0) / 1000);
						}}
						class:highlighted={passed}
						class:current={player.preview || currentLineIndex === index}
						data-line-index={index}
					>
						{line.words}
					</button>
				{/if}
			{/each}
		</blockquote>
	</div>
{/if}

<style lang="postcss">
	.lyrics {
		@apply flex items-center justify-center absolute top-0 left-0 w-full h-full bg-black/70 text-gray-400 text-center text-2xl lg:text-3xl backdrop-invert backdrop-opacity-20 overflow-hidden;
	}

	blockquote {
		&::-webkit-scrollbar {
			display: none;
		}
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
		@apply h-full overflow-y-scroll p-8;
	}

	button {
		@apply block transition-all w-full;
	}

	.current {
		@apply text-white text-3xl lg:text-4xl;
	}
</style>
