import { Box, useMediaQuery } from '@mui/material';
import { Image as IImage } from 'api/types';
import Image from 'components/Image';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { FC } from 'react';
import Typography from 'components/Typography';
import ReactMarkdown from 'components/ReactMarkdown';
interface Props {
	image?: IImage;
	description: string;
	name: string;
	link: string;
}

const CardItem: FC<Props> = ({ image, description, name, link }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
		<Box display='flex' marginBottom='2em' sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
			<Image
				alt={image?.alternativeText || name}
				width={isMobile ? 500 : 208}
				height={isMobile ? 375 : 156}
				src={
					isMobile
						? image?.formats?.small.url || image?.url || ''
						: image?.formats?.thumbnail.url || image?.url || ''
				}
				style={isMobile ? { height: 'auto' } : {}}
			></Image>

			<Box sx={{ marginLeft: { xs: '0', sm: '1em' }, marginTop: { xs: '1em', sm: '0' } }}>
				<Typography component='h2' variant='h5'>
					<NextLink href={link}>
						<Link component='span' underline='hover'>
							{name}
						</Link>
					</NextLink>
				</Typography>
				<Typography>
					<ReactMarkdown content={`${description?.substring(0, 500)}...`}></ReactMarkdown>
					<NextLink href={link}>
						<Link component='span' underline='hover'>
							читать далее
						</Link>
					</NextLink>
				</Typography>
			</Box>
		</Box>
	);
};

export default CardItem;
