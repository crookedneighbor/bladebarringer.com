import { error } from '@sveltejs/kit';

export async function load({ parent, params }) {
	const { tracks, playlist, og } = await parent();
	const track = tracks.find((track) => track.id === params.slug);
	if (!track) {
		return error(404, 'Not Found');
	}

	const pageBlurb = await import(`$lib/playlist-data/page-blurbs/${params.id}/${params.slug}.svx`);

	return {
		og: {
			...og,
			title: `${track.number}. ${track.name} by ${track.artist}`,
			description: `Track number ${track.number} from my playlist "${playlist.name}"`
		},
		track,
		spotifyPlayerID: track.spotifyID,
		hideTrackList: true,
		pageBlurb: pageBlurb.default
	};
}
