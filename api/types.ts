export const enum ErrorTypes {
	ValidationError = 'ValidationError',
}

export type ApiResponse<T = any> = {
	data: T;
	meta: {
		pagination?: {
			page: number;
			pageCount: number;
			pageSize: number;
			total: number;
		};
	};
};

export type CollectionParams = {
	sort?: string[] | string;
	filters?: {
		[field: string]:
			| {
					[operator: string]: number | string | undefined;
			  }
			| string
			| number[]
			| undefined;
	};
	populate?: string[] | string;
	fields?: string[];
	pagination?: {
		page?: number;
		pageSize?: number;
		limit?: number;
	};
	publicationState?: 'live' | 'preview';
};
