import playlists from '$lib/playlist-data';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const playlist = playlists['2024'];
	const track = playlist.find((c) => c.id === params.slug);
	if (!track) {
		return error(404, 'Not Found');
	}
	return {
		track
	};
}
