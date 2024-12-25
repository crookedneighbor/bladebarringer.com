import 'dotenv/config';
import { getPlaylist } from './spotify/playlist.js';
import { lookupArtist } from './bandcamp/lookup-artist.js';
import { writeFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';

const PLAYLIST_ID = process.env.PLAYLIST_ID;

function populateBandcampLinks(playlist) {
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

	return bandcampPromise;
}

async function populatePlaylistPage(id) {
	const playlist = await getPlaylist(id);
	await populateBandcampLinks(playlist);

	const path = resolvePath('src', 'lib', 'playlist-data', 'raw', `${id}.json`);

	writeFileSync(path, JSON.stringify(playlist, null, 2), 'utf8');

	console.log('Finished writing playlist to', path);
}

populatePlaylistPage(PLAYLIST_ID);
