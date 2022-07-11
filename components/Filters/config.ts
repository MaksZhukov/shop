const START_YEAR = 1980;

export const arrayOfYears = new Array(new Date().getFullYear() - START_YEAR + 1)
	.fill(null)
	.map((_, index) => START_YEAR + index + '');
