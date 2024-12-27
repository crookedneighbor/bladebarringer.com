const publicPlaylists = ['2024'];

export async function load() {
	const playlists = await Promise.all(
		publicPlaylists.map(async (slug) => {
			const { metadata } = await import(`$lib/playlist-data/page-blurbs/${slug}/index.svx`);
			return metadata;
		})
	);

	return {
		playlists
	};
}
