import { act, render, screen } from '@testing-library/svelte';
import Lyrics, { type Props } from './Lyrics.svelte';
import {
	player,
	resetForTest
} from '$lib/components/HeadlessSpotifyController/HeadlessSpotifyController.svelte';
import userEvent from '@testing-library/user-event';

describe('Lyrics', () => {
	let props: Props;

	beforeEach(() => {
		Element.prototype.scrollIntoView = vi.fn();
		props = {
			lines: [
				{ position: 1025, words: 'first line' },
				{ position: 1050, words: 'second line' },
				{ position: 1055, words: 'third line' }
			]
		};
		player.ready = true;
		player.autoscroll = true;
		player.position = 2000;
		vi.spyOn(player, 'seek').mockResolvedValue();
	});

	afterEach(() => {
		resetForTest();
	});

	it('does not render if pos is 8 seconds past last line', async () => {
		player.position = 9056;
		const { rerender } = render(Lyrics, props);

		expect(screen.queryByText('first line')).not.toBeInTheDocument();
		expect(screen.queryByText('second line')).not.toBeInTheDocument();
		expect(screen.queryByText('third line')).not.toBeInTheDocument();

		player.position = 9055;
		await rerender({});

		expect(screen.queryByText('first line')).toBeInTheDocument();
		expect(screen.queryByText('second line')).toBeInTheDocument();
		expect(screen.queryByText('third line')).toBeInTheDocument();
	});

	it('does not render if pos is 1 second or more before first line', async () => {
		player.position = 25;
		const { rerender } = render(Lyrics, props);

		expect(screen.queryByText('first line')).not.toBeInTheDocument();
		expect(screen.queryByText('second line')).not.toBeInTheDocument();
		expect(screen.queryByText('third line')).not.toBeInTheDocument();

		player.position = 26;
		await rerender({});

		expect(screen.queryByText('first line')).toBeInTheDocument();
		expect(screen.queryByText('second line')).toBeInTheDocument();
		expect(screen.queryByText('third line')).toBeInTheDocument();
	});

	it('does not render if player is not ready', async () => {
		player.ready = false;
		player.position = 1025;
		render(Lyrics, props);

		expect(screen.queryByRole('first line')).not.toBeInTheDocument();
		expect(screen.queryByText('second line')).not.toBeInTheDocument();
		expect(screen.queryByText('third line')).not.toBeInTheDocument();
	});

	it('highlights lyrics when song has passed their starting point', async () => {
		player.position = 1024;
		render(Lyrics, props);

		expect(screen.getByText('first line')).not.toHaveClass('current');
		expect(screen.getByText('first line')).not.toHaveClass('highlighted');
		expect(screen.getByText('second line')).not.toHaveClass('highlighted');
		expect(screen.getByText('third line')).not.toHaveClass('highlighted');

		await act(() => {
			player.position = 1025;
		});

		expect(screen.getByText('first line')).toHaveClass('current');
		expect(screen.getByText('first line')).toHaveClass('highlighted');
		expect(screen.getByText('second line')).not.toHaveClass('highlighted');
		expect(screen.getByText('second line')).not.toHaveClass('current');
		expect(screen.getByText('third line')).not.toHaveClass('highlighted');
		expect(screen.getByText('third line')).not.toHaveClass('current');

		await act(() => {
			player.position = 1049;
		});
		expect(screen.getByText('first line')).toHaveClass('current');
		expect(screen.getByText('first line')).toHaveClass('highlighted');
		expect(screen.getByText('second line')).not.toHaveClass('highlighted');
		expect(screen.getByText('second line')).not.toHaveClass('current');
		expect(screen.getByText('third line')).not.toHaveClass('highlighted');
		expect(screen.getByText('third line')).not.toHaveClass('current');

		await act(() => {
			player.position = 1050;
		});
		expect(screen.getByText('first line')).toHaveClass('highlighted');
		expect(screen.getByText('first line')).not.toHaveClass('current');
		expect(screen.getByText('second line')).toHaveClass('highlighted');
		expect(screen.getByText('second line')).toHaveClass('current');
		expect(screen.getByText('third line')).not.toHaveClass('highlighted');
		expect(screen.getByText('third line')).not.toHaveClass('current');
	});

	it('scrolls to node as it becomes the current node', async () => {
		player.position = 1024;
		render(Lyrics, props);

		expect(screen.getByText('first line').scrollIntoView).not.toBeCalled();

		await act(() => {
			player.position = 1025;
		});

		expect(screen.getByText('first line').scrollIntoView).toBeCalledTimes(1);
	});

	it('does not scroll when in preview mode', async () => {
		player.preview = true;
		player.position = 1024;
		render(Lyrics, props);

		expect(screen.getByText('first line').scrollIntoView).not.toBeCalled();

		await act(() => {
			player.position = 1025;
		});

		expect(screen.getByText('first line').scrollIntoView).not.toBeCalled();
	});

	it('does not scroll when autoscroll is turned off', async () => {
		player.autoscroll = false;
		player.position = 1024;
		render(Lyrics, props);

		expect(screen.getByText('first line').scrollIntoView).not.toBeCalled();

		await act(() => {
			player.position = 1025;
		});

		expect(screen.getByText('first line').scrollIntoView).not.toBeCalled();
	});

	it('seeks to position when clicked', async () => {
		const user = userEvent.setup();
		render(Lyrics, props);

		await user.click(screen.getByText('second line'));

		expect(player.seek).toBeCalledTimes(1);
		expect(player.seek).toBeCalledWith(1.05);
	});
});
