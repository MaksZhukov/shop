import PhotoIcon from '@mui/icons-material/Photo';
import { grey } from '@mui/material/colors';
grey;
interface Props {
    size?: number;
    cursor?: string;
    onClick?: () => void;
}

const EmptyImageIcon = ({ size = 150, cursor, onClick }: Props) => {
    return (
        <PhotoIcon onClick={onClick} sx={{ fontSize: size, color: grey[200], cursor, maxWidth: '100%' }}></PhotoIcon>
    );
};

export default EmptyImageIcon;
