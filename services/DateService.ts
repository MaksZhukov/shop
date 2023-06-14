export const generateArrayOfYears = (count: number) => {
	const max = new Date().getFullYear();
	const min = max - count;
	const years = [];

	for (var i = max; i >= min; i--) {
		years.push(i);
	}
	return years;
};
