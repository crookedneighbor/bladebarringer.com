import playlists from '$lib/playlist-data';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const playlist = playlists['2024'].tracks;
	const track = playlist[params.slug];
	if (!track) {
		return error(404, 'Not Found');
	}

	return {
		track
	};
}
