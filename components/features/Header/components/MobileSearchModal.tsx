import { Box, Button, Input, Modal, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { ModalContainer } from 'components/ui';
import { SearchIcon } from 'components/Icons';
import Loader from 'components/Loader';
import reactStringReplace from 'react-string-replace';
import { highlightSearchTerms } from 'services/StringService';

interface MobileSearchModalProps {
	isOpened: boolean;
	onClose: () => void;
	searchValue: string;
	setSearchValue: (value: string) => void;
	searchedSpareParts: any;
	isFetching: boolean;
}

export const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
	isOpened,
	onClose,
	searchValue,
	setSearchValue,
	searchedSpareParts,
	isFetching
}) => {
	const router = useRouter();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
	};

	const handleClose = () => {
		onClose();
		setSearchValue('');
	};

	const handleSearch = () => {
		if (searchedSpareParts?.data?.data.length) {
			router.push(`/spare-parts?searchValue=${searchValue}`);
			handleClose();
		} else {
			handleClose();
		}
	};

	return (
		<Modal open={isOpened} onClose={handleClose}>
			<ModalContainer
				px={1}
				py={1}
				onClose={handleClose}
				title={
					<Input
						sx={{ pl: 1 }}
						size='medium'
						startAdornment={<SearchIcon />}
						value={searchValue}
						placeholder='Быстрый поиск'
						fullWidth
						onChange={handleInputChange}
					/>
				}
				width={'calc(100% - 1em)'}
				sx={{ mx: 1, my: 1, height: 'calc(100vh - 1em)', position: 'relative' }}
			>
				<Box position='relative'>
					{isFetching && <Loader />}
					{searchValue.length > 2 &&
						(
							searchedSpareParts?.data?.data.map((item: any) => ({
								label: item.h1,
								slug: item.slug,
								brand: item.brand,
								value: item.id
							})) || []
						).map((item: any) => (
							<Box
								key={item.value}
								color='custom.text-muted'
								sx={{
									height: '37px',
									p: 1,
									display: 'block',
									pointerEvents: isFetching ? 'none' : 'auto',
									opacity: isFetching ? 0.5 : 1
								}}
								onClick={() => {
									router.push(`/spare-parts/${item.brand?.slug}/${item.slug}`);
									handleClose();
								}}
							>
								{reactStringReplace(
									item.label,
									highlightSearchTerms(item.label, searchValue),
									(match, i) => (
										<Typography key={i} component='span' color='text.primary'>
											{match}
										</Typography>
									)
								)}
							</Box>
						))}
				</Box>
				<Button
					sx={{
						position: 'absolute',
						bottom: '1em',
						left: '1em',
						zIndex: 1,
						width: 'calc(100% - 2em)'
					}}
					size='large'
					startIcon={
						searchedSpareParts?.data?.data.length && searchValue.length > 2 ? <SearchIcon /> : undefined
					}
					variant='contained'
					color='primary'
					onClick={handleSearch}
				>
					{searchedSpareParts?.data?.data.length && searchValue.length > 2 ? 'Найти' : 'Закрыть'}
				</Button>
			</ModalContainer>
		</Modal>
	);
};
