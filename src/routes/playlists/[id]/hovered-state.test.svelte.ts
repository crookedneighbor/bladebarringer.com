import { createHoverProps, hovered } from './hovered-state.svelte';

describe('hovered state', () => {
	afterEach(() => {
		hovered.name = '';
	});

	it('creates mouse handlers', () => {
		const { onmouseenter, onmouseleave } = createHoverProps('id');

		onmouseenter();
		expect(hovered.name).toEqual('id');

		onmouseleave();
		expect(hovered.name).toEqual('');

		hovered.name = 'other-id';
		onmouseleave();
		expect(hovered.name).toEqual('other-id');
	});

	it('creates focus handlers', () => {
		const { onfocus, onblur } = createHoverProps('id');

		onfocus();
		expect(hovered.name).toEqual('id');

		onblur();
		expect(hovered.name).toEqual('');

		hovered.name = 'other-id';
		onblur();
		expect(hovered.name).toEqual('other-id');
	});
});
