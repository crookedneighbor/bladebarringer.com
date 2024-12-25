import rawData from './raw/2024.json';
import type { Playlist } from './types';

export const twentyTwentyFour: Playlist = rawData;

// correct incorrect Bandcamp records
delete twentyTwentyFour.tracks['borrow-trouble'].bandcampPath;
twentyTwentyFour.tracks['i-missed-the-bus-man'].bandcampPath =
	'https://jonnysdayout.bandcamp.com/track/i-missed-the-bus-man';
twentyTwentyFour.tracks['the-insulation'].bandcampPath =
	'https://menomena.bandcamp.com/track/the-insulation';
twentyTwentyFour.tracks['eso-que-tu-haces'].bandcampPath =
	'https://lidopimienta.bandcamp.com/track/eso-que-tu-haces';
twentyTwentyFour.tracks['outside-all-the-time'].bandcampPath =
	'https://steveslagg.bandcamp.com/track/outside-all-the-time-2';
twentyTwentyFour.tracks['light-on'].bandcampPath =
	'https://dehdforever.bandcamp.com/track/light-on';
