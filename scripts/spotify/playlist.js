import { getAccessToken } from './access-token.js';

export async function getPlaylist(id, slug) {
	const accessToken = await getAccessToken();
	const data = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	}).then((res) => res.json());

	const formattedTracks = data.tracks.items.reduce((tracks, { track }, index) => {
		const id = track.name
			.toLowerCase()
			.replace(/[^a-zA-Z0-9\s]/g, '')
			.replaceAll(' ', '-')
			.replaceAll('--', '-');
		tracks[id] = {
			id,
			spotifyID: track.id,
			permalink: `/playlists/${slug}/${id}`,
			number: index + 1,
			name: track.name,
			artist: track.artists.map((a) => a.name).join(' | '),
			img: track.album.images[0].url,
			duration: track.duration_ms,
			explicit: track.explicit,
			yearReleased: Number(track.album.release_date.split('-')[0]),
			popularity: track.popularity
		};

		return tracks;
	}, {});

	return {
		id,
		slug,
		name: data.name,
		description: data.description,
		image: data.images[0].url,
		tracks: formattedTracks
	};
}
