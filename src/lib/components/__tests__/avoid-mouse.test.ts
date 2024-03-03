import { render, screen } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';
import AvoidMouse from '../avoid-mouse.svelte';
import { spring } from 'svelte/motion';
import { writable } from 'svelte/store';

describe('AvoidMouse', () => {
	let coordinatesStore: ReturnType<typeof spring>;

	beforeEach(() => {
		// this is kind of stupid, but there's buggy behavior with spring
		// not actually updating in the test when firing the event, but a normal
		// writable store does, so we have to fake it :/
		coordinatesStore = writable({ x: 0, y: 0 }) as ReturnType<typeof spring>;

		// also kind of dumb, but we have to supply actual values for these
		vi.spyOn(document.body, 'scrollWidth', 'get').mockImplementation(() => 100);
		vi.spyOn(document.body, 'scrollHeight', 'get').mockImplementation(() => 100);
	});

	it('moves element when moused over', async () => {
		render(AvoidMouse, {
			coordinatesStore
		});

		const container = screen.getByTestId('avoid-mouse-container');

		expect(container.style.left).toEqual('0px');
		expect(container.style.top).toEqual('0px');

		await fireEvent.mouseMove(container, {
			clientX: 10,
			clientY: 11
		});

		expect(container.style.left).toEqual('10px');
		expect(container.style.top).toEqual('11px');
	});

	it('sets x position to starting coordinatres when image bounds would exceed page', async () => {
		render(AvoidMouse, {
			coordinatesStore
		});

		const container = screen.getByTestId('avoid-mouse-container');

		expect(container.style.left).toEqual('0px');

		await fireEvent.mouseMove(container, {
			clientX: 101,
			clientY: 11
		});

		expect(container.style.left).toEqual('0px');
		expect(container.style.top).toEqual('11px');
	});

	it('sets y position to starting coordinatres when image bounds would exceed page', async () => {
		render(AvoidMouse, {
			coordinatesStore
		});

		const container = screen.getByTestId('avoid-mouse-container');

		expect(container.style.left).toEqual('0px');

		await fireEvent.mouseMove(container, {
			clientX: 10,
			clientY: 101
		});

		expect(container.style.left).toEqual('10px');
		expect(container.style.top).toEqual('0px');
	});

	it('can configure starting coordinates', async () => {
		render(AvoidMouse, {
			coordinatesStore,
			startingCoordinates: {
				x: 3,
				y: 5
			}
		});

		const container = screen.getByTestId('avoid-mouse-container');

		expect(container.style.left).toEqual('0px');

		await fireEvent.mouseMove(container, {
			clientX: 101,
			clientY: 101
		});

		expect(container.style.left).toEqual('3px');
		expect(container.style.top).toEqual('5px');
	});
});
