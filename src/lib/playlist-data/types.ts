export interface Track {
	id: string;
	name: string;
	artist: string;
	img: string;
	bandcampPath?: string;
}

export type Playlist = Track[];
