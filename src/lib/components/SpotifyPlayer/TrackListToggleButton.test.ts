import { render, screen } from '@testing-library/svelte';
import TrackListToggleButton from './TrackListToggleButton.svelte';

describe('TrackListToggleButton', () => {
	it('displays icon based on tracklistIsOpen prop', async () => {
		const { rerender } = render(TrackListToggleButton, {
			trackListOpen: false
		});

		expect(screen.queryByText('Open Track panel')).toBeInTheDocument();
		expect(screen.queryByText('Close Track panel')).not.toBeInTheDocument();

		await rerender({
			trackListOpen: true
		});

		expect(screen.queryByText('Open Track panel')).not.toBeInTheDocument();
		expect(screen.queryByText('Close Track panel')).toBeInTheDocument();
	});
});
