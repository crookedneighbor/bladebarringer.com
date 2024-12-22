import { render, screen } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';
import AvoidMouse from '../avoid-mouse.svelte';
import { createRawSnippet, type Snippet } from 'svelte';
import { getNewCoordinates } from '../onmousemove';

vi.mock('../onmousemove');

describe('AvoidMouse', () => {
	let children: Snippet;

	beforeEach(() => {
		vi.mocked(getNewCoordinates).mockReturnValue({
			x: 10,
			y: 11
		});
		children = createRawSnippet(() => ({
			render() {
				return '<div></div>';
			}
		}));
	});

	it('gets new coordinates on mousemove', async () => {
		render(AvoidMouse, {
			children
		});

		const container = screen.getByTestId('avoid-mouse-container');

		await fireEvent.mouseMove(container, {
			clientX: 10,
			clientY: 11
		});

		expect(getNewCoordinates).toBeCalledTimes(1);
		expect(getNewCoordinates).toBeCalledWith(expect.any(MouseEvent), { x: 0, y: 0 });
	});

	it('can configure starting coordinates', async () => {
		render(AvoidMouse, {
			startingCoordinates: {
				x: 3,
				y: 5
			},
			children
		});

		const container = screen.getByTestId('avoid-mouse-container');

		await fireEvent.mouseMove(container, {
			clientX: 101,
			clientY: 101
		});

		expect(getNewCoordinates).toBeCalledTimes(1);
		expect(getNewCoordinates).toBeCalledWith(expect.any(MouseEvent), { x: 3, y: 5 });
	});
});
