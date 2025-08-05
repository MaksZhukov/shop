import { Button, IconButton, Typography } from '@mui/material';
import { ShareIcon } from 'components/icons';
import { useSnackbar } from 'notistack';

interface Props {
	title: string;
	text: string;
	url: string;
	withText?: boolean;
}

export const ShareButton = ({ title, text, url, withText = true }: Props) => {
	const { enqueueSnackbar } = useSnackbar();
	const handleShare = async () => {
		const shareData = {
			title,
			text,
			url
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);
				enqueueSnackbar('Ссылка успешно отправлена', { variant: 'success' });
			} else {
				await navigator.clipboard.writeText(window.location.href);
				enqueueSnackbar('Ссылка скопирована в буфер обмена', { variant: 'success' });
			}
		} catch (error) {
			console.error('Error sharing:', error);
			enqueueSnackbar('Ошибка при отправке ссылки', { variant: 'error' });
		}
	};

	if (withText) {
		return (
			<Button onClick={handleShare} size='small' sx={{ gap: 0.5, px: 0.5 }}>
				<ShareIcon />
				<Typography variant='body1' color='text.primary'>
					Поделиться
				</Typography>
			</Button>
		);
	}

	return (
		<IconButton onClick={handleShare} size='small'>
			<ShareIcon />
		</IconButton>
	);
};
