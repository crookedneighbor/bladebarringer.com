import type { Playlist } from '$lib/playlist-data/types';

const playlistFiles = import.meta.glob('$lib/playlist-data/raw/*.json', {
	eager: true
});
const playlists: { slug: string; name: string; image: string }[] = [];

for (const moduleImport of Object.values(playlistFiles)) {
	const playlist = (moduleImport as { default: Playlist }).default;
	playlists.push({
		slug: playlist.slug,
		name: playlist.name,
		image: playlist.image
	});
}

export async function load() {
	return {
		playlists
	};
}
