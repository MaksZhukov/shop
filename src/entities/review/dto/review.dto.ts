export interface ReviewDto {
	id: number;
	email: string;
	authorName: string;
	rating: number;
	description?: string;
	publishedAt: string;
}
