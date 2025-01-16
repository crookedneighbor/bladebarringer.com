import { error } from '@sveltejs/kit';

export const prerender = false;

export async function load({ params }) {
	const { id } = params;

	try {
		const { metadata: playlist } = await import(`$lib/playlist-data/page-blurbs/${id}/index.svx`);
		const trackIDs = (playlist.tracks as string).split('|');
		const tracks = await Promise.all(
			trackIDs.map(async (trackID) => {
				return await import(`$lib/playlist-data/page-blurbs/${id}/${trackID}.svx`);
			})
		);
		tracks.sort((a, b) => {
			return a.metadata.number > b.metadata.number ? 1 : -1;
		});

		return {
			playlist,
			tracks
		};
	} catch (e) {
		console.error(e);
		error(404, 'Not Found');
	}
}
