export const generateArrayOfYears = (count: number) => {
	const max = new Date().getFullYear();
	const min = max - count;
	const years = [];

	for (var i = max; i >= min; i--) {
		years.push(i);
	}
	return years;
};

export const getCurrentTimeInGMT3 = (): Date => {
	const now = new Date();
	const gmt3Time = new Date(now.getTime() + 3 * 60 * 60 * 1000);
	return gmt3Time;
};
