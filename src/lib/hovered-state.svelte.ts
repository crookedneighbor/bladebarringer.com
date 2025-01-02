export const hovered = $state({ name: '' });

export function createHoverProps(id: string) {
	function set() {
		hovered.name = id;
	}
	function reset() {
		// in case the hovered state has already changed
		// we don't want to accidentally overwrite the new
		// hovered state to nothing
		if (hovered.name === id) {
			hovered.name = '';
		}
	}
	return {
		onmouseenter: set,
		onfocus: set,
		onmouseleave: reset,
		onblur: reset
	};
}
