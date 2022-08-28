import PhotoIcon from '@mui/icons-material/Photo';
import { grey } from '@mui/material/colors';
grey;
interface Props {
	size?: number;
	cursor?: string;
	margin?: string;
	onClick?: () => void;
}

const EmptyImageIcon = ({ margin, size = 150, cursor, onClick }: Props) => {
	return (
		<PhotoIcon
			onClick={onClick}
			sx={{
				margin: margin,
				fontSize: size,
				color: grey[200],
				cursor,
				maxWidth: '100%',
			}}></PhotoIcon>
	);
};

export default EmptyImageIcon;
