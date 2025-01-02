<script lang="ts">
	import Lyrics from '$lib/components/Lyrics/Lyrics.svelte';

	let { data } = $props();
	let {
		id,
		lines,
		img,
		artist,
		artistWebsite,
		number,
		name,
		bandcampPath,
		previousLink,
		nextLink
	} = $derived(data.track);
</script>

<div class="song-container" style={'view-transition-name: ' + id}>
	<div class="relative">
		<img class="w-full" src={img} style:view-transition-name={`${id}-img`} alt="" />
		<Lyrics {lines} />
	</div>
	<div
		class="info prose prose-quoteless prose-blockquote:not-italic prose-blockquote:whitespace-pre-wrap prose-blockquote:text-xl"
	>
		<h1>{number}. {name}</h1>
		<div class="artist">
			by
			{#if artistWebsite}
				<a href={artistWebsite}>{artist}</a>
			{:else}
				{artist}
			{/if}
		</div>
		<div class="navigation">
			{#if bandcampPath}
				<div class="buy-on-bandcamp">
					<a href={bandcampPath} target="_blank" class="flex justify-center items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6 pr-1"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
							/>
						</svg>

						Buy this song</a
					>
				</div>
			{/if}
			<div class="flex-grow"></div>
			<!-- TODO add links to next/previous -->
			<div class="navigation-icon">
				<a href={previousLink || './'}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-10"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>

					<span class="sr-only">Previous Track</span>
				</a>
			</div>
			<div class="navigation-icon">
				<a href={nextLink || './'}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-10"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					<span class="sr-only">Next Track</span>
				</a>
			</div>
		</div>
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
		@apply border-b -mt-6 pb-2 text-2xl;
	}

	.navigation {
		@apply py-2 flex border-b items-center justify-center;
	}

	.navigation-icon {
		@apply items-center justify-center flex;
	}
</style>
