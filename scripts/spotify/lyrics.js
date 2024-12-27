import 'dotenv/config';

export async function getLyrics(songID) {
	const data = await fetch(
		`https://spclient.wg.spotify.com/color-lyrics/v2/track/${songID}/image/https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b2739c98e0751b676018f2fa9c90?format=json&vocalRemoval=false&market=from_token`,
		{
			headers: {
				accept: 'application/json',
				'accept-language': 'en',
				'app-platform': 'WebPlayer',
				authorization: `Bearer ${process.env.SPOTIFY_LYRICS_ACCESS_TOKEN}`,
				'client-token': process.env.SPOTIFY_LYRICS_CLIENT_TOKEN,
				'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'spotify-app-version': '1.2.54.219.g19a93a5d',
				Referer: 'https://open.spotify.com/',
				'Referrer-Policy': 'strict-origin-when-cross-origin'
			},
			body: null,
			method: 'GET'
		}
	).then((res) => {
		if (res.status === 404) {
			return;
		}
		return res.json();
	});

	if (!data) {
		return;
	}

	return data.lyrics.lines.map((line) => {
		return {
			position: Number(line.startTimeMs),
			words: line.words
		};
	});
}
