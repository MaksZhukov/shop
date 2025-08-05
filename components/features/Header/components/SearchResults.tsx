import { Box, Typography } from '@mui/material';
import React from 'react';
import reactStringReplace from 'react-string-replace';
import { highlightSearchTerms } from 'services/StringService';
import { SparePart } from 'api/spareParts/types';

interface SearchResultsProps {
	searchedSpareParts: SparePart[];
	searchValue: string;
	isFetching: boolean;
	onSearchSelect: (item: SparePart) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
	searchedSpareParts,
	searchValue,
	isFetching,
	onSearchSelect
}) => {
	const handleSearchSelect = (item: SparePart) => (event: React.MouseEvent<HTMLDivElement>) => {
		onSearchSelect(item);
	};

	return (
		<>
			{searchedSpareParts.map((item) => (
				<Box
					key={item.id}
					color='custom.text-muted'
					sx={{
						height: '37px',
						p: 1,
						cursor: 'pointer',
						display: 'block',
						pointerEvents: isFetching ? 'none' : 'auto',
						opacity: isFetching ? 0.5 : 1,
						'&:hover': {
							backgroundColor: 'action.hover'
						}
					}}
					onClick={handleSearchSelect(item)}
				>
					{reactStringReplace(item.h1, highlightSearchTerms(item.h1, searchValue), (match, i) => (
						<Typography key={i} component='span' color='text.primary'>
							{match}
						</Typography>
					))}
				</Box>
			))}
		</>
	);
};
