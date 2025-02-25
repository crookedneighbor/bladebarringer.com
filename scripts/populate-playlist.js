import 'dotenv/config';
import { getPlaylist } from './spotify/playlist.js';
import { lookupArtist } from './bandcamp/lookup-artist.js';
import { writeFileSync, readFileSync, existsSync, createWriteStream, mkdirSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { compile } from 'mdsvex';
import { getLyrics } from './spotify/lyrics.js';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

const SPOTIFY_PLAYLIST_ID = process.env.SPOTIFY_PLAYLIST_ID;

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
	mkdirSync(path, { recursive: true });
	const indexPath = resolvePath(path, 'index.svx');
	let indexPage = `
TODO`;

	const indexPageData = {
		...playlist,
		permalink: `/playlists/${playlist.slug}`,
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

	const playlistArtPath = resolvePath('static', 'playlist-art', playlist.slug);
	mkdirSync(playlistArtPath, { recursive: true });

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
				// overwrite these fields
				// becaue we may have made manual edits to these
				// props after the initial sync
				if (metadata.buyLink) {
					// this one can be undefined
					track.buyLink = metadata.buyLink;
				}
				track = {
					...track,
					lines: metadata.lines,
					artistWebsite: metadata.artistWebsite,
					img: metadata.img,
					explicit: metadata.explicit
				};
			} else {
				let { name, artist } = track;
				name = name.toLowerCase();
				artist = artist.split(' | ')[0].toLowerCase();

				const bandcampLink = await lookupArtist(artist, name);
				if (bandcampLink) {
					track.buyLink = bandcampLink;
				}

				const lyrics = await getLyrics(track.spotifyID);
				track.lines = lyrics ?? [];
				const trackArtPath = resolvePath(playlistArtPath, `${track.id}.jpg`);
				await fetch(track.img).then((res) => {
					const fileStream = createWriteStream(trackArtPath, { flags: 'wx' });
					return finished(Readable.fromWeb(res.body).pipe(fileStream));
				});
				track.img = `/playlist-art/${playlist.slug}/${track.id}.jpg`;
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

populatePlaylistPage(SPOTIFY_PLAYLIST_ID);
