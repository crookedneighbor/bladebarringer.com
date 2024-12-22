import 'dotenv/config';
import { getPlaylist } from './spotify/playlist.js';

const PLAYLIST_ID = process.env.PLAYLIST_ID;

async function populatePlaylistPage(id) {
	const playlist = await getPlaylist(id);
	let bandcampPromise = Promise.resolve();

	playlist.forEach((track) => {
		bandcampPromise = bandcampPromise.then(async () => {
			let { name, artist } = track;
			name = name.toLowerCase();
			artist = artist.split(' | ')[0].toLowerCase();

			const bcRes = await fetch(
				'https://bandcamp.com/api/bcsearch_public_api/1/autocomplete_elastic',
				{
					headers: {
						accept: '*/*',
						'accept-language': 'en-US,en;q=0.9',
						'cache-control': 'no-cache',
						'content-type': 'application/json; charset=UTF-8',
						pragma: 'no-cache',
						priority: 'u=1, i',
						'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
						'sec-ch-ua-mobile': '?0',
						'sec-ch-ua-platform': '"macOS"',
						'sec-fetch-dest': 'empty',
						'sec-fetch-mode': 'cors',
						'sec-fetch-site': 'same-origin',
						'x-requested-with': 'XMLHttpRequest',
						cookie:
							'__stripe_mid=2299c541-07f9-4e31-9499-fe89d22963e48bde11; _ga_RFKMJESM35=GS1.1.1708487260.2.0.1708487260.0.0.0; client_id=8590F3EAAA819C1FBF4FEB0DA53B6E9F809400E2E85D9639098C5797EE62E9A5; _ga=GA1.1.1529094918.1720292957; cart_client_id=8590F3EAAA819C1FBF4FEB0DA53B6E9F809400E2E85D9639098C5797EE62E9A5; BACKENDID3=flexocentral-xc8t-5; identity=7%09zn53KFGvZ95AuVl7NGag9F9q2OS6voWhNsjE2kKYWig%3D%09%7B%22id%22%3A2626406838%2C%22ex%22%3A0%7D; js_logged_in=1; logout=%7B%22username%22%3A%22blade%40crookedneighbor.com%22%7D; menubar_active_band=3715789601; playlimit_client_id=8590F3EAAA819C1FBF4FEB0DA53B6E9F809400E2E85D9639098C5797EE62E9A5; _ga_XT8BDGDTT6=GS1.1.1734746205.1.1.1734746227.0.0.0; download_encoding=401; session=1%09r%3A%5B%22539354161s0f0x1734875012%22%2C%2210394G0f0x1734874888%22%2C%22261569836S0a447892716x1734755110%22%5D%09t%3A1734874888%09bp%3A1%09c%3A1; _ga_MN4RN3JYWL=GS1.1.1734874852.5.1.1734875022.0.0.0',
						Referer: 'https://bandcamp.com/',
						'Referrer-Policy': 'no-referrer-when-downgrade'
					},
					body: `{"search_text":"${artist} ${name}","search_filter":"","full_page":false,"fan_id":null}`,
					method: 'POST'
				}
			).then((res) => res.json());

			if (bcRes.auto.results[0]) {
				track.bandcampPath = bcRes.auto.results[0].item_url_path;
			}
		});
	});

	await bandcampPromise;

	console.log(JSON.stringify(playlist));
}

populatePlaylistPage(PLAYLIST_ID);
