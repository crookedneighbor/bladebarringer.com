import 'dotenv/config';
import { getPlaylist } from './spotify/playlist.js';
import { lookupArtist } from './bandcamp/lookup-artist.js';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { compile } from 'mdsvex';
import { getLyrics } from './spotify/lyrics.js';

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

function formatValue(val) {
	if (Array.isArray(val)) {
		const values = val
			.map((v) => {
				return ` { ${Object.entries(v)
					.map(([key, val]) => `${key}: ${JSON.stringify(val)}`)
					.join(', ')} }`;
			})
			.join(',\n  ');
		return `[
  ${values}
]`;
	}
	return String(val);
}

async function writeSVX(pathToFile, pageData, obj) {
	const metadata = Object.keys(obj).reduce((str, key) => {
		const value = formatValue(obj[key]);
		if (str) {
			str += '\n';
		}
		str += `${key}: ${value}`;
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
		...playlist,
		tracks: Object.keys(playlist.tracks).join('|')
	};

	if (existsSync(indexPath)) {
		const { page, metadata } = await parseSVX(indexPath);
		indexPage = page;
		// overrides
		indexPageData.name = metadata.name;
		indexPageData.description = metadata.description;
		indexPageData.image = metadata.image;
	}

	writeSVX(indexPath, indexPage, indexPageData);

	const tracks = Object.values(playlist.tracks);
	await Promise.all(
		tracks.map(async (track) => {
			const previousTrack = tracks.find((t) => t.number === track.number - 1);
			const nextTrack = tracks.find((t) => t.number === track.number + 1);

			track.previousLink = previousTrack?.permalink ?? '';
			track.nextLink = nextTrack?.permalink ?? '';

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
				if (metadata.lines) {
					track.lines = metadata.lines;
				}
				if (metadata.artistWebsite) {
					track.artistWebsite = metadata.artistWebsite;
				}
			} else {
				let { name, artist } = track;
				name = name.toLowerCase();
				artist = artist.split(' | ')[0].toLowerCase();

				const bandcampLink = await lookupArtist(artist, name);
				if (bandcampLink) {
					track.bandcampPath = bandcampLink;
				}

				const lyrics = await getLyrics(track.spotifyID);
				track.lines = lyrics ?? [];
			}
			writeSVX(pathToFile, pageData, track);
		})
	);
}

async function populatePlaylistPage(id) {
	const slug = process.env.PLAYLIST_SLUG;
	const playlist = await getPlaylist(id, slug);

	await populatePageDescriptions(playlist);
}

populatePlaylistPage(PLAYLIST_ID);
