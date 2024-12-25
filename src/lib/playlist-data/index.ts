import { twentyTwentyFour } from './2024';
import type { Playlist, Track } from './types';

export function playlistToArray(playlist: Playlist): Track[] {
	return Object.values(playlist.tracks)
		.map((track) => {
			return track;
		})
		.sort((a, b) => {
			return a.number > b.number ? 1 : -1;
		});
}

export default {
	2024: twentyTwentyFour
} as Record<string, Playlist>;
