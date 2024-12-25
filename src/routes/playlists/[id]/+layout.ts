import playlists, { playlistToArray } from '$lib/playlist-data';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const { id } = params;

	if (!playlists[id]) {
		return error(404, 'Not Found');
	}

	return {
		playlist: playlistToArray(playlists[id])
	};
}
