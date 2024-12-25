import 'dotenv/config';
import { compile } from 'mdsvex';
import { getPlaylist } from './spotify/playlist.js';
import { lookupArtist } from './bandcamp/lookup-artist.js';
import { writeFileSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';

const PLAYLIST_ID = process.env.PLAYLIST_ID;

function populateBandcampLinks(playlist, previousEntries) {
	let bandcampPromise = Promise.resolve();

	Object.values(playlist.tracks).forEach((track) => {
		bandcampPromise = bandcampPromise.then(async () => {
			if (previousEntries && previousEntries.tracks[track.id]) {
				// we've already looked up this track
				track.bandcampPath = previousEntries.tracks[track.id].bandcampPath;
				return;
			}
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

async function populatePageDescriptions(playlist) {
	const { slug } = playlist;
	const path = resolvePath('src', 'lib', 'playlist-data', 'page-blurbs', slug);
	const dir = readdirSync(path);
	await Promise.all(
		dir.map(async (filename) => {
			const id = filename.split('.')[0];
			const raw = readFileSync(resolvePath(path, filename), 'utf-8');
			const transformedCode = await compile(raw);

			if (!playlist.tracks[id]) {
				console.error('Could not find id', id);
				return;
			}
			playlist.tracks[id].pageContent = transformedCode.code;
		})
	);
}

async function populatePlaylistPage(id) {
	const slug = process.env.PLAYLIST_SLUG;
	const path = resolvePath('src', 'lib', 'playlist-data', 'raw', `${slug}.json`);
	const previousEntries = existsSync(path) && JSON.parse(readFileSync(path, 'utf8'));
	const playlist = await getPlaylist(id, slug);
	await populateBandcampLinks(playlist, previousEntries);
	await populatePageDescriptions(playlist);

	writeFileSync(path, JSON.stringify(playlist, null, 2), 'utf8');

	console.log('Finished writing playlist to', path);
}

populatePlaylistPage(PLAYLIST_ID);
