import { SvgIcon, SvgIconProps } from '@mui/material';

export const MenuIcon = (props: SvgIconProps) => (
	<SvgIcon {...props}>
		<path
			d='M3 6H21M3 12H21M3 18H21'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			fill='none'
		/>
	</SvgIcon>
);
