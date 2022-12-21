export const getParamByRelation = (value: string, field: 'slug' | 'name' = 'name') =>
	value ? { [field]: value } : undefined;
