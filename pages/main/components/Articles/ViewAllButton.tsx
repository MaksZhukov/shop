import { Button } from 'components/ui';
import { ChevronRightIcon } from 'components/icons';

interface ViewAllButtonProps {
	title: string;
	visibility: 'mobile' | 'desktop';
}

export const ViewAllButton: React.FC<ViewAllButtonProps> = ({ title, visibility }) => (
	<Button
		sx={{
			display: { xs: visibility === 'mobile' ? 'flex' : 'none', md: visibility === 'desktop' ? 'flex' : 'none' }
		}}
		variant='link'
		href='/articles'
		endIcon={<ChevronRightIcon />}
	>
		{title}
	</Button>
);
