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
        <Box display='flex' marginBottom='3em' sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
            <Image
                title={image?.caption}
                alt={image?.alternativeText || name}
                width={isMobile ? 500 : 330}
                height={isMobile ? 375 : 220}
                src={
                    isMobile
                        ? image?.formats?.small.url || image?.url || ''
                        : image?.formats?.thumbnail.url || image?.url || ''
                }
                style={isMobile ? { height: 'auto' } : { minWidth: 330, objectFit: 'cover' }}></Image>

            <Box sx={{ marginLeft: { xs: '0', sm: '1em' }, marginTop: { xs: '1em', sm: '0' } }}>
                <Typography component='h2' variant={isMobile ? 'h6' : 'h5'} gutterBottom>
                    <NextLink href={link}>
                        <Link
                            component='span'
                            color='secondary.main'
                            textTransform='uppercase'
                            fontWeight='500'
                            underline='hover'>
                            {name}
                        </Link>
                    </NextLink>
                </Typography>
                <Box>
                    <ReactMarkdown inline content={`${description?.substring(0, 500)}...`}></ReactMarkdown>
                    <Typography marginTop='0.5em'>
                        <NextLink href={link}>
                            <Link color='text.secondary' component='span' underline='hover'>
                                Читать далее {'>>'}
                            </Link>
                        </NextLink>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default CardItem;
