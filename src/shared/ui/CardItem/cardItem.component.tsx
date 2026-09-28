import { Box, useMediaQuery } from '@mui/material';
import Link from '@mui/material/Link';
import type { Image as IImage } from 'shared/api/types';
import { Image } from 'shared/ui';
import { ReactMarkdown } from 'shared/ui';
import { Typography } from 'shared/ui';
import NextLink from 'next/link';
import { FC } from 'react';
interface Props {
	image?: IImage;
	description: string;
	name: string;
	link: string;
}

export const CardItem: FC<Props> = ({ image, description, name, link }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
        <Box
            sx={{
                display: 'flex',
                marginBottom: '3em',
                flexDirection: { xs: 'column', sm: 'row' }
            }}>
            <Image
				title={image?.caption}
				alt={image?.alternativeText || name}
				width={isMobile ? 500 : 330}
				height={isMobile ? 375 : 220}
				src={image?.formats?.small?.url || image?.url || ''}
				style={isMobile ? { height: 'auto' } : { minWidth: 330, objectFit: 'cover' }}
			></Image>
            <Box sx={{ marginLeft: { xs: '0', sm: '1em' }, marginTop: { xs: '1em', sm: '0' } }}>
				<Typography component='h2' variant={isMobile ? 'h6' : 'h5'} gutterBottom>
					<NextLink href={link}>
						<Link
                            component='span'
                            underline='hover'
                            sx={{
                                color: 'secondary.main',
                                textTransform: 'uppercase',
                                fontWeight: '500'
                            }}>
							{name}
						</Link>
					</NextLink>
				</Typography>
				<Box>
					<ReactMarkdown inline content={`${description?.substring(0, 500)}...`}></ReactMarkdown>
					<Typography sx={{ mt: '0.5em' }}>
						<NextLink href={link}>
							<Link component='span' underline='hover' sx={{
                                color: 'text.secondary'
                            }}>
								Читать далее {'>>'}
							</Link>
						</NextLink>
					</Typography>
				</Box>
			</Box>
        </Box>
    );
};
