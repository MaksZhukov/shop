import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import Image from 'components/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { FC } from 'react';

interface Props {
	data: ServiceStation | Autocomis;
}

const Card: FC<Props> = ({ data }) => {
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
							src={isMobile ? data.image?.formats?.small.url || '' : data.image?.url || ''}
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

export default Card;
