<script lang="ts">
	interface Props {
		id: string;
	}
	let { id }: Props = $props();
</script>

<div class="player">
	<iframe
		style="border-radius:12px"
		src={`https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`}
		width="100%"
		height="152"
		frameBorder="0"
		allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
		loading="lazy"
		title="Embededed Playlist"
	></iframe>
</div>
