import { act, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import SpotifyControls, { type Props } from './SpotifyControls.svelte';
import {
	player,
	resetForTest
} from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';

describe('SpotifyControls', () => {
	let props: Props;

	beforeEach(() => {
		props = {
			firstTrackID: 'first',
			currentTrackID: 'current',
			previousTrackID: 'prev',
			nextTrackID: 'next',
			onTrackChange: vi.fn()
		};

		vi.spyOn(player, 'restart').mockResolvedValue();
		vi.spyOn(player, 'play').mockResolvedValue();
		vi.spyOn(player, 'pause').mockResolvedValue();
		vi.spyOn(player, 'toggle').mockResolvedValue();
		player.initialLoadComplete = true;
	});

	afterEach(() => {
		resetForTest();
	});

	describe('previous button', () => {
		it('loads the previous track', async () => {
			const user = userEvent.setup();
			render(SpotifyControls, props);

			await user.click(screen.getByText('Previous track'));

			expect(props.onTrackChange).toBeCalledTimes(1);
			expect(props.onTrackChange).toBeCalledWith('prev');
		});

		it('restarts player when position is greater than 3000', async () => {
			const user = userEvent.setup();
			render(SpotifyControls, props);

			player.position = 3001;
			await user.click(screen.getByText('Previous track'));

			expect(player.restart).toBeCalledTimes(1);
			expect(props.onTrackChange).not.toBeCalled();

			vi.mocked(player.restart).mockReset();
			player.position = 3000;
			await user.click(screen.getByText('Previous track'));

			expect(props.onTrackChange).toBeCalledTimes(1);
			expect(player.restart).not.toBeCalled();
		});

		it('autoplays if autoplayer is on', async () => {
			const user = userEvent.setup();
			render(SpotifyControls, props);

			player.autoplay = false;
			await user.click(screen.getByText('Previous track'));
			expect(player.play).not.toBeCalled();

			player.autoplay = true;
			await user.click(screen.getByText('Previous track'));
			expect(player.play).toBeCalledTimes(1);
		});

		it('auto-pauses if there is no previous track', async () => {
			const user = userEvent.setup();
			render(SpotifyControls, {
				...props,
				previousTrackID: ''
			});

			await user.click(screen.getByText('Previous track'));
			expect(player.pause).toBeCalledTimes(1);
		});

		it('disables if there is no current track', async () => {
			render(SpotifyControls, {
				...props,
				currentTrackID: ''
			});

			expect(screen.getByRole('button', { name: 'Previous track' })).toHaveAttribute('disabled');
		});
	});

	describe('next button', () => {
		it('loads the next track', async () => {
			const user = userEvent.setup();
			render(SpotifyControls, props);

			await user.click(screen.getByText('Next track'));

			expect(props.onTrackChange).toBeCalledTimes(1);
			expect(props.onTrackChange).toBeCalledWith('next');
		});

		it('autoplays if autoplayer is on', async () => {
			const user = userEvent.setup();
			render(SpotifyControls, props);

			player.autoplay = false;
			await user.click(screen.getByText('Next track'));
			expect(player.play).not.toBeCalled();

			player.autoplay = true;
			await user.click(screen.getByText('Next track'));
			expect(player.play).toBeCalledTimes(1);
		});

		it('auto-pauses if there is no next track', async () => {
			const user = userEvent.setup();
			render(SpotifyControls, {
				...props,
				nextTrackID: ''
			});

			await user.click(screen.getByText('Next track'));
			expect(player.pause).toBeCalledTimes(1);
		});

		it('disables if there is no current track', async () => {
			render(SpotifyControls, {
				...props,
				currentTrackID: ''
			});

			expect(screen.getByRole('button', { name: 'Next track' })).toHaveAttribute('disabled');
		});
	});

	describe('play/pause button', () => {
		it('toggles when pressed', async () => {
			const user = userEvent.setup();
			render(SpotifyControls, props);

			await user.click(screen.getByText('Play'));
			await act(() => (player.playing = true));
			await user.click(screen.getByText('Pause'));

			expect(player.toggle).toBeCalledTimes(2);
		});

		it('renders play button when currently paused', async () => {
			await act(() => (player.playing = false));

			render(SpotifyControls, props);

			expect(screen.queryByText('Play')).toBeInTheDocument();
			expect(screen.queryByText('Pause')).not.toBeInTheDocument();
		});

		it('renders pause button when currently playing', async () => {
			await act(() => (player.playing = true));

			render(SpotifyControls, props);

			expect(screen.queryByText('Pause')).toBeInTheDocument();
			expect(screen.queryByText('Play')).not.toBeInTheDocument();
		});

		it('turns autoplay on when playing', async () => {
			const user = userEvent.setup();
			await act(() => {
				player.playing = false;
				player.autoplay = false;
			});

			render(SpotifyControls, props);

			await user.click(screen.getByText('Play'));

			expect(player.autoplay).toEqual(true);
		});

		it('turns autoplay off when pausing', async () => {
			const user = userEvent.setup();
			await act(() => {
				player.playing = true;
				player.autoplay = true;
			});

			render(SpotifyControls, props);

			await user.click(screen.getByText('Pause'));

			expect(player.autoplay).toEqual(false);
		});

		it('loads and plays first track if no current track is present', async () => {
			const user = userEvent.setup();
			render(SpotifyControls, {
				...props,
				currentTrackID: ''
			});

			await user.click(screen.getByText('Play'));

			expect(props.onTrackChange).toBeCalledWith('first');
		});
	});

	it('disables all buttons if player is not initially loaded', async () => {
		player.initialLoadComplete = false;
		render(SpotifyControls, props);

		const btns = screen.getAllByRole('button');
		expect(btns).toHaveLength(3);
		btns.forEach((btn) => {
			expect(btn).toHaveAttribute('disabled');
		});
	});
});
