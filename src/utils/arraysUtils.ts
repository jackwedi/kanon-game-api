import _ from "lodash";

export const shiftArray = (array: any[], shiftOffset: number) => {
	const arrayCopy = [...array];
	// updates the reel with th offsetted rows
	for (let oldIndex = 0; oldIndex < array.length; oldIndex++) {
		const newIndex: number = (oldIndex + shiftOffset) % array.length;
		arrayCopy[newIndex] = array[oldIndex];
	}

	return arrayCopy;
};

export const consecutiveCount = (row: string[]): any => {
	const count = _.countBy(row);
	Object.keys(count).forEach((key) => (count[key] = 0));

	let lastCell: string = null;
	for (const cell of row) {
		if (lastCell && lastCell === cell) {
			count[cell] += 1;
		} else if (count[cell] < 2) {
			count[cell] = 1;
		}
		lastCell = cell;
	}

	return count;
};
