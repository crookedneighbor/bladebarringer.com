import rawData from './raw/2024.json';
import type { Playlist } from './types';

export const twentyTwentyFour: Playlist = rawData;

// correct incorrect Bandcamp records
delete twentyTwentyFour['borrow-trouble'].bandcampPath;
twentyTwentyFour['i-missed-the-bus-man'].bandcampPath =
	'https://jonnysdayout.bandcamp.com/track/i-missed-the-bus-man';
twentyTwentyFour['the-insulation'].bandcampPath =
	'https://menomena.bandcamp.com/track/the-insulation';
twentyTwentyFour['eso-que-tu-haces'].bandcampPath =
	'https://lidopimienta.bandcamp.com/track/eso-que-tu-haces';
twentyTwentyFour['outside-all-the-time'].bandcampPath =
	'https://steveslagg.bandcamp.com/track/outside-all-the-time-2';
twentyTwentyFour['light-on'].bandcampPath = 'https://dehdforever.bandcamp.com/track/light-on';
