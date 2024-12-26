import { playlistToArray } from '$lib/playlist-data';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { id } = params;

	try {
		const playlist = await import(`$lib/playlist-data/raw/${id}.json`);
		return {
			spotifyPlayerID: playlist.id,
			tracks: playlist.tracks,
			playlist: playlistToArray(playlist)
		};
	} catch (e) {
		error(404, 'Not Found');
	}
}
