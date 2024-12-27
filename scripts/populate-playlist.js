import 'dotenv/config';
import { getPlaylist } from './spotify/playlist.js';
import { lookupArtist } from './bandcamp/lookup-artist.js';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { compile } from 'mdsvex';

const PLAYLIST_ID = process.env.PLAYLIST_ID;

async function populatePageDescriptions(playlist) {
	const { slug } = playlist;
	const path = resolvePath('src', 'lib', 'playlist-data', 'page-blurbs', slug);
	await Promise.all(
		Object.values(playlist.tracks).map(async (track) => {
			const pathToFile = resolvePath(path, `${track.id}.svx`);
			let pageData = `
TODO`;
			if (existsSync(pathToFile)) {
				const existingFileData = readFileSync(pathToFile, 'utf-8');
				pageData = existingFileData.split('---\n').at(-1);
				if (!existingFileData.startsWith('---')) {
					pageData = `\n${pageData}`;
				}
				const { data } = await compile(existingFileData);
				// overwrite the fields if they already exist
				if (data.fm?.bandcampPath) {
					track.bandcampPath = data.fm.bandcampPath;
				}
			} else {
				let { name, artist } = track;
				name = name.toLowerCase();
				artist = artist.split(' | ')[0].toLowerCase();
				const link = await lookupArtist(artist, name);

				if (link) {
					track.bandcampPath = link;
				}
			}
			const metadata = Object.keys(track).reduce((str, key) => {
				if (str) {
					str += '\n';
				}
				str += `${key}: ${track[key]}`;
				return str;
			}, '');
			writeFileSync(
				pathToFile,
				`---
${metadata}
---
${pageData}`,
				'utf-8'
			);
		})
	);
}

async function populatePlaylistPage(id) {
	const slug = process.env.PLAYLIST_SLUG;
	const path = resolvePath('src', 'lib', 'playlist-data', 'raw', `${slug}.json`);
	const playlist = await getPlaylist(id, slug);
	await populatePageDescriptions(playlist);

	writeFileSync(path, JSON.stringify(playlist, null, 2), 'utf8');

	console.log('Finished writing playlist to', path);
}

populatePlaylistPage(PLAYLIST_ID);
