export interface Track {
	id: string;
	number: number;
	name: string;
	artist: string;
	img: string;
	blurb?: string;
	bandcampPath?: string;
}

export type Playlist = Record<string, Track>;
