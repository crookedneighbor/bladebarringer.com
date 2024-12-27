import { act, render, screen } from '@testing-library/svelte';
import Lyrics from './Lyrics.svelte';
import { currentPlayer } from '../SpotifyPlayer/SpotifyPlayer.svelte';

describe('Lyrics', () => {
	it('renders lyrics', () => {
		render(Lyrics, {
			id: 'song-id',
			lines: [
				{ position: 0, words: 'first line' },
				{ position: 100, words: 'second line' },
				{ position: 200, words: 'third line' }
			]
		});

		expect(screen.getByText('first line')).toBeInTheDocument();
		expect(screen.getByText('second line')).toBeInTheDocument();
		expect(screen.getByText('third line')).toBeInTheDocument();
	});

	it('highlights lyrics when song has passed their starting point', async () => {
		render(Lyrics, {
			id: 'song-id',
			lines: [
				{ position: 5, words: 'first line' },
				{ position: 100, words: 'second line' },
				{ position: 200, words: 'third line' }
			]
		});
		await act(() => {
			currentPlayer.songId = 'song-id';
		});

		expect(screen.getByText('first line')).not.toHaveClass('highlighted');
		expect(screen.getByText('second line')).not.toHaveClass('highlighted');
		expect(screen.getByText('third line')).not.toHaveClass('highlighted');

		await act(() => {
			currentPlayer.position = 5;
		});

		expect(screen.getByText('first line')).toHaveClass('highlighted');
		expect(screen.getByText('second line')).not.toHaveClass('highlighted');
		expect(screen.getByText('third line')).not.toHaveClass('highlighted');

		await act(() => {
			currentPlayer.position = 99;
		});
		expect(screen.getByText('first line')).toHaveClass('highlighted');
		expect(screen.getByText('second line')).not.toHaveClass('highlighted');
		expect(screen.getByText('third line')).not.toHaveClass('highlighted');

		await act(() => {
			currentPlayer.position = 100;
		});
		expect(screen.getByText('first line')).toHaveClass('highlighted');
		expect(screen.getByText('second line')).toHaveClass('highlighted');
		expect(screen.getByText('third line')).not.toHaveClass('highlighted');
	});

	it("doesnot highlight lyrics when current player's song id does not match", async () => {
		render(Lyrics, {
			id: 'song-id',
			lines: [
				{ position: 5, words: 'first line' },
				{ position: 100, words: 'second line' },
				{ position: 200, words: 'third line' }
			]
		});
		await act(() => {
			currentPlayer.songId = 'not-song-id';
			currentPlayer.position = 999;
		});

		expect(screen.getByText('first line')).not.toHaveClass('highlighted');
		expect(screen.getByText('second line')).not.toHaveClass('highlighted');
		expect(screen.getByText('third line')).not.toHaveClass('highlighted');
	});
});
