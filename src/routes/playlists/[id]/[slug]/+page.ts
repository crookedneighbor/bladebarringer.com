import playlists from '$lib/playlist-data';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const playlist = playlists[params.id].tracks;
	const track = playlist[params.slug];
	if (!track) {
		return error(404, 'Not Found');
	}

	return {
		track
	};
}
