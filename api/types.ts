import { SparePart } from './spareParts/types';
import { Tire } from './tires/types';
import { Wheel } from './wheels/types';

export const enum ErrorTypes {
	ValidationError = 'ValidationError',
}

export type Product = Wheel | Tire | SparePart;

export type ProductType = 'sparePart' | 'tire' | 'wheel';

export type Image = {
	id: number;
	url: string;
	alternativeText: string;
	caption: string;
	formats?: {
		thumbnail: { url: string };
		small: { url: string };
	};
};

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

export type Filters = {
	[field: string]:
		| {
				[operator: string]: number | string | undefined;
		  }
		| string
		| number
		| number[]
		| undefined;
};

export type CollectionParams = {
	sort?: string[] | string;
	filters?: Filters;
	populate?: string[] | string;
	fields?: string[];
	pagination?: {
		page?: number;
		pageSize?: number;
		limit?: number;
	};
	publicationState?: 'live' | 'preview';
};

export type SEO = {
	title: string;
	description: string;
	keywords: string;
	h1: string;
	images?: Image[];
	content?: string;
};
