export function getNewCoordinates(event: MouseEvent, staringCoordinates: { x: number; y: number }) {
	const pageWidth = document.body.scrollWidth;
	const pageHeight = document.body.scrollHeight;
	const container = event.target as HTMLElement;
	let { clientX, clientY } = event;

	if (container.offsetWidth + clientX > pageWidth) {
		clientX = staringCoordinates.x;
	}
	if (container.offsetHeight + clientY > pageHeight) {
		clientY = staringCoordinates.y;
	}

	return { x: clientX, y: clientY };
}
