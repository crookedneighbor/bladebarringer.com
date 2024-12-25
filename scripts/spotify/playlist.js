import { getAccessToken } from './access-token.js';

export async function getPlaylist(id, slug) {
	const accessToken = await getAccessToken();
	const data = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	}).then((res) => res.json());

	const formattedTracks = data.items.reduce((tracks, { track }, index) => {
		const id = track.name
			.toLowerCase()
			.replace(/[^a-zA-Z\s]/g, '')
			.replaceAll(' ', '-');
		tracks[id] = {
			id,
			number: index + 1,
			name: track.name,
			artist: track.artists.map((a) => a.name).join(' | '),
			img: track.album.images[0].url
		};

		return tracks;
	}, {});

	return {
		slug,
		tracks: formattedTracks
	};
}
