import { Box, Container, SxProps } from '@mui/system';
import Image from 'components/Image';
import { FC } from 'react';

interface Props {
	imageSRCs?: string[];
	isOnSSR?: boolean;
	sx?: SxProps<any>;
}

const BlockImages: FC<Props> = ({ imageSRCs = [], isOnSSR = false, sx }) => {
	return (
		<Box paddingY='3em' marginY='3em' bgcolor='#fff' sx={sx}>
			<Container>
				<Box display='flex' gap={'1em'}>
					{imageSRCs.map((src) => (
						<Box key={src}>
							<Image isOnSSR={isOnSSR} src={src} alt='alt' width={390} height={270}></Image>
						</Box>
					))}
				</Box>
			</Container>
		</Box>
	);
};

export default BlockImages;
