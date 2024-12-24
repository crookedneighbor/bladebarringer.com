export async function lookupArtist(artist, songName) {
	const bcRes = await fetch('https://bandcamp.com/api/bcsearch_public_api/1/autocomplete_elastic', {
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
			Referer: 'https://bandcamp.com/',
			'Referrer-Policy': 'no-referrer-when-downgrade'
		},
		body: `{"search_text":"${artist} ${songName}","search_filter":"","full_page":false,"fan_id":null}`,
		method: 'POST'
	}).then((res) => res.json());

	if (!bcRes.auto.results[0]) {
		return;
	}

	return bcRes.auto.results[0].item_url_path;
}
