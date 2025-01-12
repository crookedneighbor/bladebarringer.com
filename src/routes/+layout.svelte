<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<meta property="og:title" content={page.data.og.title} />
	<meta property="og:type" content={page.data.og.type || 'website'} />
	<meta property="og:url" content={page.data.og.url || page.url.href} />
	<meta property="og:image" content={page.data.og.image} />
	<meta property="og:description" content={page.data.og.description} />
	<meta property="og:logo" content={page.data.og.logo || '/favicon.png'} />
</svelte:head>

{@render children()}
