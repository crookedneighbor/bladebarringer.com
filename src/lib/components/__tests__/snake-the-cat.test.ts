import { render, screen } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';
import SnakeTheCat from '../snake-the-cat.svelte';

describe('SnakeTheCat', () => {
	it.todo('updates position of snake the cat image when hovered over', async () => {
		// TODO can't figure out how to make the store update correctly after firing event
		const component = render(SnakeTheCat);

		const img = screen.getByTestId('snake-the-cat');

		expect(img.style.left).toEqual('150px');
		expect(img.style.top).toEqual('150px');

		await fireEvent(
			img,
			new MouseEvent('mousemove', {
				bubbles: true,
				cancelable: true,
				clientX: 10,
				clientY: 10
			})
		);

		expect(img.style.left).toEqual('150px');
		expect(img.style.top).toEqual('150px');
	});

	it.todo('sets x position to 50 when image bounds would exceed page', () => {
		// TODO
	});

	it.todo('sets y position to 50 when image bounds would exceed page', () => {
		// TODO
	});
});
