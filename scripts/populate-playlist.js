import 'dotenv/config';
import { getPlaylist } from './spotify/playlist.js';
import { lookupArtist } from './bandcamp/lookup-artist.js';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { compile } from 'mdsvex';

const PLAYLIST_ID = process.env.PLAYLIST_ID;

async function parseSVX(pathToFile) {
	const existingFileData = readFileSync(pathToFile, 'utf-8');
	let page = existingFileData.split('---\n').at(-1);
	if (!existingFileData.startsWith('---')) {
		page = `\n${page}`;
	}
	const { data } = await compile(existingFileData);

	return {
		page,
		metadata: data.fm || {}
	};
}

async function writeSVX(pathToFile, pageData, obj) {
	const metadata = Object.keys(obj).reduce((str, key) => {
		if (str) {
			str += '\n';
		}
		str += `${key}: ${obj[key]}`;
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
}

async function populatePageDescriptions(playlist) {
	const { slug } = playlist;
	const path = resolvePath('src', 'lib', 'playlist-data', 'page-blurbs', slug);
	const indexPath = resolvePath(path, 'index.svx');
	let indexPage = `
TODO`;

	const indexPageData = {
		...playlist
	};
	delete indexPageData.tracks;

	if (existsSync(indexPath)) {
		const { page, metadata } = await parseSVX(indexPath);
		indexPage = page;
		// overrides
		indexPageData.name = metadata.name;
	}

	writeSVX(indexPath, indexPage, indexPageData);

	await Promise.all(
		Object.values(playlist.tracks).map(async (track) => {
			const pathToFile = resolvePath(path, `${track.id}.svx`);
			let pageData = `
TODO`;
			if (existsSync(pathToFile)) {
				const { page, metadata } = await parseSVX(pathToFile);
				pageData = page;
				// overwrite the fields if they already exist
				if (metadata.bandcampPath) {
					track.bandcampPath = metadata.bandcampPath;
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
			writeSVX(pathToFile, pageData, track);
		})
	);
}

async function populatePlaylistPage(id) {
	const slug = process.env.PLAYLIST_SLUG;
	const path = resolvePath('src', 'lib', 'playlist-data', 'page-blurbs', slug, 'index.svx');
	const playlist = await getPlaylist(id, slug);
	await populatePageDescriptions(playlist);

	console.log('Finished writing playlist to', path);
}

populatePlaylistPage(PLAYLIST_ID);
