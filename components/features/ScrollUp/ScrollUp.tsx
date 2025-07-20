import { IconButton } from '@mui/material';
import { ChevronUpIcon } from 'components/Icons';

export const ScrollUp: React.FC = () => {
	return (
		<IconButton
			size='large'
			sx={{
				position: 'fixed',
				bottom: '10px',
				right: '10px',
				bgcolor: 'custom.bg-surface-4',
				color: 'primary.contrastText'
			}}
			onClick={() => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}}
		>
			<ChevronUpIcon></ChevronUpIcon>
		</IconButton>
	);
};
