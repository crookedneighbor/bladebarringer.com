import { error } from '@sveltejs/kit';

export async function load({ parent, params }) {
	const { tracks } = await parent();
	const track = tracks.find((track) => track.id === params.slug);
	if (!track) {
		return error(404, 'Not Found');
	}

	const pageBlurb = await import(`$lib/playlist-data/page-blurbs/${params.id}/${params.slug}.svx`);

	return {
		track,
		spotifyPlayerID: track.spotifyID,
		hideTrackList: true,
		pageBlurb: pageBlurb.default
	};
}
