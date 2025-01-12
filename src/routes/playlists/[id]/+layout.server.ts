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

		const playlist = {
			slug: id,
			name: metadata.name,
			description: metadata.description,
			art: metadata.image,
			permalink: `/playlists/${id}`,
			spotifyLink: `https://open.spotify.com/playlist/${metadata.id}`
		};

		return {
			og: {
				title: playlist.name,
				image: `/og-shares/playlists/${playlist.slug}.jpg`,
				description: playlist.description
			},
			playlist,
			tracks
		};
	} catch (e) {
		console.error(e);
		error(404, 'Not Found');
	}
}
