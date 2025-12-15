import { Box, Pagination, PaginationItem } from '@mui/material';
import { Link } from 'shared/ui';
import { useRouter } from 'next/router';

interface ArticlesPaginationProps {
	currentPage: number;
	totalPages: number;
}

export const ArticlesPagination = ({ currentPage, totalPages }: ArticlesPaginationProps) => {
	const router = useRouter();

	if (totalPages <= 1) return null;

	return (
		<Box display='flex' py={2} justifyContent='center'>
			<Pagination
				page={currentPage}
				renderItem={(params) =>
					params.disabled ? (
						<PaginationItem {...params} />
					) : (
						<Link shallow href={`${router.pathname}?page=${params.page}`}>
							<PaginationItem {...params} />
						</Link>
					)
				}
				siblingCount={2}
				color='primary'
				count={totalPages}
			/>
		</Box>
	);
};
