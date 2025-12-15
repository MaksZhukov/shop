export const getStringByTemplateStr = (value: string, data: any) => {
	if (!value) {
		return '';
	}
	let newValue = value;
	for (let result of value.matchAll(/{(\w+)}/g)) {
		let field = result[1];
		newValue = newValue.replace(result[0], typeof data[field] === 'string' ? data[field] : data[field]?.name);
	}
	return newValue;
};

export const highlightSearchTerms = (text: string, searchValue: string) => {
	if (!searchValue || !text) {
		return text;
	}

	// Split search value into individual terms
	const searchTerms = searchValue
		.toLowerCase()
		.split(/\s+/)
		.filter((term) => term.length > 0);

	// Create a regex pattern that matches any of the search terms (case insensitive)
	const pattern = new RegExp(
		`(${searchTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
		'gi'
	);

	return pattern;
};
