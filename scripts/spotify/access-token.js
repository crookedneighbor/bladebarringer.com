import 'dotenv/config';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

export async function getAccessToken() {
	const { access_token } = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		body:
			'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}).then((res) => res.json());

	return access_token;
}
