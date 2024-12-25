import 'dotenv/config';
import { compile } from 'mdsvex';
import { getPlaylist } from './spotify/playlist.js';
import { lookupArtist } from './bandcamp/lookup-artist.js';
import { writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';

const PLAYLIST_ID = process.env.PLAYLIST_ID;

function populateBandcampLinks(playlist) {
	let bandcampPromise = Promise.resolve();

	Object.values(playlist).forEach((track) => {
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

async function populatePageDescriptions(id, playlist) {
	const path = resolvePath('src', 'lib', 'playlist-data', 'page-blurbs', id);
	const dir = readdirSync(path);
	await Promise.all(
		dir.map(async (filename) => {
			const id = filename.split('.')[0];
			const raw = readFileSync(resolvePath(path, filename), 'utf-8');
			const transformedCode = await compile(raw);

			if (!playlist[id]) {
				console.error('Could not find id', id);
				return;
			}
			playlist[id].pageContent = transformedCode.code;
		})
	);
}

async function populatePlaylistPage(id) {
	const playlist = await getPlaylist(id);
	await populateBandcampLinks(playlist);
	await populatePageDescriptions(id, playlist);

	const path = resolvePath('src', 'lib', 'playlist-data', 'raw', `${id}.json`);

	writeFileSync(path, JSON.stringify(playlist, null, 2), 'utf8');

	console.log('Finished writing playlist to', path);
}

populatePlaylistPage(PLAYLIST_ID);
