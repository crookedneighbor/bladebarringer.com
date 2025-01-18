<script lang="ts">
	import { player } from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
	import Lyrics from '$lib/components/Lyrics/Lyrics.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let {
		id,
		spotifyID,
		lines,
		img,
		artist,
		artistWebsite,
		number,
		name,
		buyLink,
		explicit,
		yearReleased
	} = $derived(data.track);

	onMount(() => {
		player.load(spotifyID);
	});
</script>

<div class="song-container" style={'view-transition-name: ' + id}>
	<div class="relative">
		<img class="w-full" src={img} style:view-transition-name={`${id}-img`} alt="" />
		<Lyrics {lines} />
	</div>
	<div
		class="info prose prose-quoteless prose-blockquote:text-xl prose-blockquote:border-red-400 prose-blockquote:border-l-8 prose-blockquote:relative prose-blockquote:mx-4 prose-blockquote:px-8"
	>
		<h1>{number}. {name}</h1>
		<div class="artist">
			<div class="flex-grow">
				by
				{#if artistWebsite}
					<a href={artistWebsite}>{artist}</a>
				{:else}
					{artist}
				{/if}
			</div>

			{#if explicit}
				<div class="explicit">Explicit</div>
			{/if}
		</div>
		<ul class="navigation">
			<li>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
					/>
				</svg>

				{yearReleased}
			</li>
			{#if buyLink}
				<li class="buy-link">
					<a href={buyLink} target="_blank" class="flex justify-center items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
							/>
						</svg>

						Buy this song</a
					>
				</li>
			{/if}
			<li class="flex-grow"></li>
			<!-- Any buttons that go to the right go here -->
		</ul>
		{@render data.pageBlurb()}
	</div>
</div>

<style lang="postcss">
	.song-container {
		@apply m-0 w-full max-w-4xl p-0 m-auto;
	}

	.info {
		@apply max-w-full bg-white w-full p-4;
	}

	.artist {
		@apply border-b -mt-6 pb-2 text-2xl flex items-center justify-center;
	}

	.navigation {
		@apply py-2 flex border-b items-center justify-center list-none m-0 p-0;

		li {
			@apply mx-2 flex;

			svg {
				@apply mr-1;
			}
		}

		li:first-child {
			@apply ml-0;
		}
	}

	.explicit {
		@apply bg-gray-200 py-0.5 px-2 rounded text-sm h-6;
	}

	.prose :global(blockquote:before) {
		content: '“';
		@apply absolute -left-7 -mt-8 top-1/2 text-red-400 text-7xl bg-white rounded-full font-serif h-10 w-10 text-center pt-1 my-auto;
	}

	.prose :global(blockquote p) {
		@apply mb-4;
	}
	.prose :global(blockquote p:last-child) {
		@apply text-right text-2xl mt-4 not-italic;
	}
</style>
