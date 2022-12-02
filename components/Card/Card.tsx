import { Box } from '@mui/material';
import { Image as IImage } from 'api/types';
import Image from 'components/Image';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { FC } from 'react';
import Typography from 'components/Typography';
interface Props {
	image: IImage;
	description: string;
	name: string;
	link: string;
}

const Card: FC<Props> = ({ image, description, name, link }) => {
	return (
		<Box display='flex' marginBottom='2em'>
			<Image
				alt={image.alternativeText}
				width={208}
				height={156}
				src={image.formats?.thumbnail.url || image.url}></Image>

			<Box marginLeft='1em'>
				<Typography component='h2' variant='h5'>
					<NextLink href={link}>
						<Link component='span' underline='hover'>
							{name}
						</Link>
					</NextLink>
				</Typography>
				<Typography>
					{description?.substring(0, 500)}...{' '}
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

export default Card;
