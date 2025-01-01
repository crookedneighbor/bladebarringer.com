import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { id } = params;

	try {
		const { metadata } = await import(`$lib/playlist-data/page-blurbs/${id}/index.svx`);
		const trackIDs = (metadata.tracks as string).split('|');
		const tracks = await Promise.all(
			trackIDs.map(async (trackID) => {
				const { metadata } = await import(`$lib/playlist-data/page-blurbs/${id}/${trackID}.svx`);
				return metadata;
			})
		);
		tracks.sort((a, b) => {
			return a.number > b.number ? 1 : -1;
		});

		return {
			spotifyPlaylistLink: `https://open.spotify.com/playlist/${metadata.id}`,
			playlistSlug: id,
			name: metadata.name,
			description: metadata.description,
			tracks
		};
	} catch (e) {
		console.error(e);
		error(404, 'Not Found');
	}
}
