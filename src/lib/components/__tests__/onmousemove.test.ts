import { getNewCoordinates } from '../onmousemove';

describe('onmousemove', () => {
	beforeEach(() => {
		// kind of dumb, but we have to supply actual values for these
		vi.spyOn(document.body, 'scrollWidth', 'get').mockImplementation(() => 100);
		vi.spyOn(document.body, 'scrollHeight', 'get').mockImplementation(() => 100);
	});

	it('returns the clientX and clientY params', () => {
		const event = new MouseEvent('mouseover', {
			clientX: 10,
			clientY: 15
		});
		const container = document.createElement('div');
		Object.defineProperty(event, 'target', {
			writable: true,
			value: container
		});
		expect(getNewCoordinates(event, { x: 0, y: 0 })).toEqual({
			x: 10,
			y: 15
		});
	});

	it("sets x to starting coordinate if container's new position would be beyond the page width", () => {
		const event = new MouseEvent('mouseover', {
			clientX: 10,
			clientY: 15
		});
		const container = document.createElement('div');
		Object.defineProperty(container, 'offsetWidth', {
			writable: true,
			value: 91
		});
		Object.defineProperty(event, 'target', {
			writable: true,
			value: container
		});
		expect(getNewCoordinates(event, { x: 22, y: 0 })).toEqual({
			x: 22,
			y: 15
		});
	});

	it("sets y to starting coordinate if container's new position would be beyond the page width", () => {
		const event = new MouseEvent('mouseover', {
			clientX: 10,
			clientY: 15
		});
		const container = document.createElement('div');
		Object.defineProperty(container, 'offsetHeight', {
			writable: true,
			value: 86
		});
		Object.defineProperty(event, 'target', {
			writable: true,
			value: container
		});
		expect(getNewCoordinates(event, { x: 0, y: 82 })).toEqual({
			x: 10,
			y: 82
		});
	});
});
