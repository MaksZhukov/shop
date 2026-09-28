import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import { TrashFilledIcon } from 'shared/icons';

interface CartHeaderProps {
	allSelected: boolean;
	onSelectAll: () => void;
	onDeleteSelected: () => void;
	hasSelectedItems: boolean;
}

export const CartHeader = ({ allSelected, onSelectAll, onDeleteSelected, hasSelectedItems }: CartHeaderProps) => {
	return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: { xs: 'transparent', md: 'white' },
                mb: 2,
                py: { xs: 0, md: 1.5 },
                px: { xs: 0, md: 1 },
                border: { xs: 'none', md: '1px solid' },
                borderColor: { xs: 'transparent', md: 'custom.divider' },
                borderRadius: 4
            }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
				<Checkbox checked={allSelected} onChange={onSelectAll} />
				<Typography variant='body1'>Выбрать все</Typography>
			</Box>
            <IconButton
				onClick={onDeleteSelected}
				disabled={!hasSelectedItems}
				size='large'
				sx={{
					color: 'secondary.main',
					bgcolor: '#00000029',
					borderRadius: 1.5,
					'&:hover': { bgcolor: '#00000050' },
					'&:disabled': { opacity: 0.5 }
				}}
			>
				<TrashFilledIcon />
			</IconButton>
        </Box>
    );
};
