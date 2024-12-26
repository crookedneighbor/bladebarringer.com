export interface Track {
	id: string;
	number: number;
	name: string;
	artist: string;
	img: string;
	bandcampPath?: string;
}

export type Playlist = {
	slug: string;
	name: string;
	image: string;
	tracks: Record<string, Track>;
};
