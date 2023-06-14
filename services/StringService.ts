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
