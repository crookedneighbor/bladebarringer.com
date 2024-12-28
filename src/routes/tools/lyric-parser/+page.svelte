<script lang="ts">
	import SpotifyPlayer, { currentPlayer } from '$lib/components/SpotifyPlayer/SpotifyPlayer.svelte';

	let id = $state('');
	let rawLyrics = $state('');
	let lyrics = $derived(rawLyrics.split('\n'));
	let focusedLyricIndex = $state(0);
	let lyricAnnotations: { words?: string; position?: number; spacer?: boolean }[] = $state([]);

	function onkeydown(e: KeyboardEvent) {
		if (
			!id ||
			!rawLyrics ||
			!(e.code === 'Space' || e.code === 'Enter' || e.code === 'Backspace')
		) {
			return;
		}

		if (!currentPlayer.playing) {
			alert('Spotify Player not playing!');
			return;
		}

		if (e.code === 'Backspace') {
			if (focusedLyricIndex === 0) {
				return;
			}
			focusedLyricIndex--;
			if (lyricAnnotations[focusedLyricIndex]?.spacer) {
				lyricAnnotations.pop();
				focusedLyricIndex--;
			}
			lyricAnnotations.pop();
		} else {
			lyricAnnotations.push({
				words: lyrics[focusedLyricIndex],
				position: currentPlayer.position
			});

			focusedLyricIndex++;
			if (!lyrics[focusedLyricIndex].trim()) {
				focusedLyricIndex++;
				lyricAnnotations.push({
					spacer: true
				});
			}
		}

		document.querySelector(`[data-index="${focusedLyricIndex}"`)?.scrollIntoView();
	}
</script>

<svelte:window {onkeydown} />

<div class="prose container m-auto">
	<h1>Lyric Parser</h1>

	<h2>Spotify Player</h2>

	{#if id}
		<SpotifyPlayer kind="track" {id} />
	{:else}
		<div
			class="animate-pulse w-full bg-gray-800 flex justify-center items-center"
			style:height="352px"
			style:border-radius="12px"
		>
			<label for="spotify-track-id" class="sr-only">Spotify Track ID:</label>
			<input
				id="spotify-track-id"
				class="p-2 flex-grow mx-8 rounded"
				placeholder="Paste in the Spotify Track ID here"
				bind:value={id}
				type="text"
			/>
		</div>
	{/if}

	<h2>Spotify Player Stats</h2>
	<div class="bg-white p-4 my-4 rounded">
		<ul>
			<li>Is Playing: {currentPlayer.playing}</li>
			<li>Position: {currentPlayer.position}</li>
		</ul>
	</div>

	<h2>Lyrics</h2>
	<div class="p-4 flex justify-center items-center">
		<label for="raw-lyrics" class="sr-only">Lyrics:</label>
		<textarea id="raw-lyrics" bind:value={rawLyrics} class="flex-grow h-48 p-2"></textarea>
	</div>

	<div class="flex justify-center">
		{#if rawLyrics}
			<div class="bg-white mr-2 rounded w-1/2">
				{#each lyrics as lyric, index}
					{@const focused = focusedLyricIndex === index}
					<div
						data-index={index}
						class={{ 'px-2': true, 'py-2': !lyric, border: focused, 'border-red-800': focused }}
					>
						{lyric}
					</div>
				{/each}
			</div>

			<div class="p-4 bg-gray-100 rounded w-1/2">
				<div>lines: &#91;</div>
				{#each lyricAnnotations as annotation}
					<div>
						&nbsp;&nbsp;&lcub;
						{#if annotation.spacer}
							spacer: true
						{:else}
							position: {annotation.position}, words: {JSON.stringify(annotation.words)}
						{/if}
						&rcub;,
					</div>
				{/each}
				<div>&#93;</div>
			</div>
		{/if}
	</div>
</div>
