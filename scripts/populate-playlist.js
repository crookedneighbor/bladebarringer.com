import 'dotenv/config';
import { getPlaylist } from './spotify/playlist.js';
import { lookupArtist } from './bandcamp/lookup-artist.js';

const PLAYLIST_ID = process.env.PLAYLIST_ID;

async function populatePlaylistPage(id) {
	const playlist = await getPlaylist(id);
	let bandcampPromise = Promise.resolve();

	playlist.forEach((track) => {
		bandcampPromise = bandcampPromise.then(async () => {
			let { name, artist } = track;
			name = name.toLowerCase();
			artist = artist.split(' | ')[0].toLowerCase();

			const link = await lookupArtist(artist, name);

			if (link) {
				track.bandcampPath = link;
			}
		});
	});

	await bandcampPromise;

	console.log(JSON.stringify(playlist));
}

populatePlaylistPage(PLAYLIST_ID);
