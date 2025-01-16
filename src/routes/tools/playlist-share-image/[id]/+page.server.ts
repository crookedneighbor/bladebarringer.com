// @ts-expect-error node types, am i right?
import { writeFile, mkdir } from 'fs/promises';
// @ts-expect-error node types, am i right?
import { resolve } from 'path';

export const actions = {
	async default({ request }) {
		const data = await request.formData();
		for (const key of data.keys()) {
			const [playlistSlug, trackId] = key.split('|');
			const dataUrl = (data.get(key) || '') as string;

			const base64Data = dataUrl.split(';base64,').pop();
			// @ts-expect-error Buffer does exist
			const buffer = Buffer.from(base64Data, 'base64');

			const directory = resolve('static', 'og-shares', 'playlists', playlistSlug);
			const filePath = resolve(directory, `${trackId}.png`);
			try {
				await mkdir(directory, { recursive: true });
				await writeFile(filePath, buffer);
			} catch (err) {
				console.error(`Error saving file ${filePath}: ${err}`);
			}
		}
	}
};
