export const getParamByRelation = (value?: string | null, field: 'slug' | 'name' = 'name') =>
	value ? { [field]: value } : undefined;
