import type { Wheel } from 'entities/wheel';
import type { Tire } from 'entities/tire';
import type { SparePart } from 'entities/sparePart';
import type { Cabin } from 'entities/cabin';

export type Product = Wheel | Tire | SparePart | Cabin;

export type ProductType = 'wheel' | 'tire' | 'sparePart' | 'cabin';

export type ViewedProduct = {
	id: number;
	type: ProductType;
};

export type ProductSnippets = {
	textAfterH1: string;
};
