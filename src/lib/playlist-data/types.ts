export interface Track {
	id: string;
	number: number;
	name: string;
	artist: string;
	img: string;
	pageContent?: string;
	bandcampPath?: string;
}

export type Playlist = {
	slug: string;
	tracks: Record<string, Track>;
};
