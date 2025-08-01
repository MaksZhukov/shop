import { Cabin } from './cabins/types';
import { CarOnParts } from './cars-on-parts/types';
import { SparePart } from './spareParts/types';
import { Tire } from './tires/types';
import { Wheel } from './wheels/types';

export const enum ErrorTypes {
	ValidationError = 'ValidationError'
}

export type Product = Wheel | Tire | SparePart | Cabin;

export type ProductType = 'sparePart' | 'tire' | 'wheel' | 'cabin';

export type ImageFormat = 'thumbnail' | 'small' | 'medium' | 'large';

export type Image = {
	id: number;
	name: string;
	url: string;
	alternativeText: string;
	caption: string;
	width: number;
	height: number;
	formats?: Record<ImageFormat, { url: string }>;
};

export type Video = {
	id: number;
	url: string;
	size: number;
};

export type MetaResponse = {
	pagination?: {
		page: number;
		pageCount: number;
		pageSize: number;
		total: number;
	};
};

export type ApiResponse<T = any> = {
	data: T;
	meta: MetaResponse;
};

export type Filters = {
	[field: string]:
		| {
				[operator: string]: number | string | undefined | null | boolean;
		  }
		| {
				[field: string]: { [operator: string]: number | string | undefined | null | boolean };
		  }
		| string
		| number
		| number[]
		| null
		| boolean
		| undefined
		| any[];
};

export type Populate = string[] | string | { [key: string]: boolean | { count: boolean } | Populate };

export type CollectionParams = {
	sort?: string[] | string;
	filters?: Filters;
	populate?: Populate;
	fields?: string[];
	pagination?: {
		page?: number;
		pageSize?: number;
		limit?: number;
		start?: number;
	};
	publicationState?: 'live' | 'preview';
};

export type ProductSnippets = {
	textAfterH1: string;
};

export type SEO = {
	title: string;
	description: string;
	keywords: string;
	h1: string;
	images?: Image[];
	content?: string;
};

export type ShortSEO = Omit<SEO, 'h1' | 'images' | 'content'>;

export type LinkWithImage = {
	id: number;
	image: Image;
	link: string;
};

export interface BrandTextComponent {
	content: string;
}
