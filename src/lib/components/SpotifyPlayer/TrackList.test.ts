import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import TrackList from './TrackList.svelte';
import type { Track } from './types';

describe('TrackList', () => {
	let tracks: Track[];

	beforeEach(() => {
		tracks = [
			{
				id: 'abc-1',
				number: 1,
				permalink: '/song/link-1',
				name: 'Song One',
				artist: 'Artist One',
				art: 'art-1'
			},
			{
				id: 'abc-2',
				number: 2,
				permalink: '/song/link-2',
				name: 'Song Two',
				artist: 'Artist Two',
				art: 'art-2'
			}
		];
	});

	it('creates a track entry for each track', () => {
		render(TrackList, {
			tracks,
			onTrackChoice: vi.fn()
		});

		expect(screen.getByText('1. Song One')).toBeInTheDocument();
		expect(screen.getByText('Artist One')).toBeInTheDocument();
		expect(screen.getByText('2. Song Two')).toBeInTheDocument();
		expect(screen.getByText('Artist Two')).toBeInTheDocument();
	});

	it('provides track id of clicked track', async () => {
		const user = userEvent.setup();
		const spy = vi.fn();
		render(TrackList, {
			tracks,
			onTrackChoice: spy
		});

		await user.click(screen.getByText('1. Song One'));
		await user.click(screen.getByText('2. Song Two'));

		expect(spy).toBeCalledTimes(2);
		expect(spy).toHaveBeenNthCalledWith(1, 'abc-1');
		expect(spy).toHaveBeenNthCalledWith(2, 'abc-2');
	});
});
