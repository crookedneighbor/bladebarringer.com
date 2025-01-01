import { act, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import {
	player,
	resetForTest
} from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
import SongProgress from './SongProgress.svelte';

describe('SongProgress', () => {
	beforeEach(() => {
		vi.spyOn(player, 'seek').mockResolvedValue();
		// silly workaround to make this work in testing environment
		Object.defineProperties(MouseEvent.prototype, {
			offsetX: {
				get() {
					return this.clientX;
				}
			}
		});
	});

	afterEach(() => {
		resetForTest();
	});

	it('renders 0% progress when position is 0', () => {
		player.position = 0;
		player.duration = 123;
		render(SongProgress);

		expect(screen.getByText('Track 0% done')).toBeInTheDocument();
	});

	it('renders 0% progress when duration is 0', () => {
		player.position = 123;
		player.duration = 0;
		render(SongProgress);

		expect(screen.getByText('Track 0% done')).toBeInTheDocument();
	});

	it('renders 1% progress when percentage is less then 1', () => {
		player.position = 2;
		player.duration = 1000;
		render(SongProgress);

		expect(screen.getByText('Track 1% done')).toBeInTheDocument();
	});

	it('renders progress as a percent to the 2 decimal places', () => {
		player.position = 231;
		player.duration = 1029;
		render(SongProgress);

		expect(screen.getByText('Track 22.45% done')).toBeInTheDocument();
	});

	it('seeks to the point that was clicked on the progress bar', async () => {
		const user = userEvent.setup();
		player.position = 250;
		player.duration = 1000;
		render(SongProgress);

		const button = screen.getByRole('button');
		button.style.width = '100px';

		await user.pointer({
			keys: '[MouseLeft]',
			target: button,
			coords: {
				x: 1234
			}
		});

		expect(player.seek).toBeCalledTimes(1);
		expect(player.seek).toBeCalledWith(12.34);
	});
});
