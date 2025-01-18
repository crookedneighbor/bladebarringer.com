import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import TrackList from './TrackList.svelte';
import type { Track } from './types';
import { hovered } from '$lib/hovered-state.svelte';

describe('TrackList', () => {
	let tracks: Track[];

	beforeEach(() => {
		tracks = [
			{
				id: 'abc-1',
				slug: 'abc-1',
				number: 1,
				permalink: '/song/link-1',
				name: 'Song One',
				artist: 'Artist One',
				art: 'art-1'
			},
			{
				id: 'abc-2',
				slug: 'abc-2',
				number: 2,
				explicit: true,
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

		expect(screen.getByText('Song One')).toBeInTheDocument();
		expect(screen.getByText('Artist One')).toBeInTheDocument();
		expect(screen.getByText('Song Two')).toBeInTheDocument();
		expect(screen.getByText('Artist Two')).toBeInTheDocument();
	});

	it('provides track id of clicked track', async () => {
		const user = userEvent.setup();
		const spy = vi.fn();
		render(TrackList, {
			tracks,
			onTrackChoice: spy
		});

		await user.click(screen.getByText('Song One'));
		await user.click(screen.getByText('Song Two'));

		expect(spy).toBeCalledTimes(2);
		expect(spy).toHaveBeenNthCalledWith(1, 'abc-1');
		expect(spy).toHaveBeenNthCalledWith(2, 'abc-2');
	});

	it('provides current class to current track', async () => {
		render(TrackList, {
			tracks,
			currentTrack: tracks[1],
			onTrackChoice: vi.fn()
		});

		const items = screen.getAllByRole('listitem');
		expect(items[0]).not.toHaveClass('current');
		expect(items[1]).toHaveClass('current');
	});

	it('provides hovered class to hovered track', async () => {
		hovered.name = 'abc-2';
		render(TrackList, {
			tracks,
			onTrackChoice: vi.fn()
		});

		const items = screen.getAllByRole('listitem');
		expect(items[0]).not.toHaveClass('hovered');
		expect(items[1]).toHaveClass('hovered');
	});

	it('includes Explicit marking for explicit track', async () => {
		render(TrackList, {
			tracks,
			onTrackChoice: vi.fn()
		});

		const items = screen.getAllByRole('listitem');
		expect(items[0].querySelector('.explicit')).not.toBeInTheDocument();
		expect(items[1].querySelector('.explicit')).toBeInTheDocument();
	});
});
