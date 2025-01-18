<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';
	let { children } = $props();

	let shareURL = $derived.by(() => {
		let pathName = '';

		if (page.data.og.url) {
			pathName = page.data.og.url;
		} else if (page.url.pathname !== '/') {
			pathName = page.url.pathname;
		}

		return `https://bladebarringer.com${pathName}`;
	});
</script>

<svelte:head>
	<title>{page.data.og.title}</title>
	<meta property="og:title" content={page.data.og.title} />
	<meta property="og:type" content={page.data.og.type || 'website'} />
	<meta property="og:url" content={shareURL} />
	<meta property="og:image" content={page.data.og.image} />
	<meta property="og:description" content={page.data.og.description} />
	<meta property="og:logo" content={page.data.og.logo || '/favicon.png'} />
</svelte:head>

{@render children()}
