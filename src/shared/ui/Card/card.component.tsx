import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/material';
import { Image } from 'shared/ui';
import { ReactMarkdown } from 'shared/ui';
import { Typography } from 'shared/ui';
import { WhiteBox } from 'shared/ui';
import { FC } from 'react';
import type { Image as IImage } from 'shared/api/types';

interface Data {
	name: string;
	image: IImage;
	description: string;
}

export interface CardProps {
	data: Data;
}

export const Card: FC<CardProps> = ({ data }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
		<WhiteBox>
			<Typography component='h1' variant='h4' gutterBottom>
				{data.name}
			</Typography>
			<Box>
				{data.image && (
					<Box
						sx={{
							marginRight: { xs: 0, sm: '1em' },
							marginBottom: { xs: '1em', sm: 0 },
							float: 'left'
						}}
					>
						<Image
							title={data.image.caption}
							alt={data.image.alternativeText}
							width={isMobile ? 500 : 640}
							height={isMobile ? 375 : 480}
							src={data.image.url}
							style={{ height: 'auto' }}
						></Image>
					</Box>
				)}
				<ReactMarkdown content={data.description}></ReactMarkdown>
				<Box sx={{ clear: 'both' }}></Box>
			</Box>
		</WhiteBox>
	);
};
