import 'dotenv/config';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let accessTokenPromise;

export async function getAccessToken() {
	if (!accessTokenPromise) {
		accessTokenPromise = fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			body:
				'grant_type=client_credentials&client_id=' +
				SPOTIFY_CLIENT_ID +
				'&client_secret=' +
				SPOTIFY_CLIENT_SECRET,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
			.then((res) => res.json())
			.then((d) => d.access_token);
	}
	return accessTokenPromise;
}
