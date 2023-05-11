import { Box, useMediaQuery } from '@mui/material';
import { Image as IImage } from 'api/types';
import Image from 'components/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

import { FC } from 'react';
import Slider from 'react-slick';

const { publicRuntimeConfig } = getConfig();

interface Props {
    images?: IImage[];
    content?: string;
    h1: string;
}
const SEOBox: FC<Props> = ({ images, content, h1 }) => {
    const router = useRouter();
    const path = router.asPath.split('/');
    const isCatalog =
        (path.includes('spare-parts') && path.length < 4) || (path.length === 4 && path[3].includes('model-'));

    const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
    const renderImages: IImage[] | undefined =
        isCatalog && !images
            ? ([
                  { id: 1, alternativeText: h1, caption: h1, url: '/advantage_1.png' },
                  {
                      id: 2,
                      alternativeText: `${h1.trim()} купить`,
                      caption: `${h1.trim()} купить`,
                      url: '/advantage_2.png'
                  },
                  {
                      id: 3,
                      alternativeText: `${h1.trim()} купить с доставкой`,
                      caption: `${h1.trim()} купить с доставкой`,
                      url: '/advantage_3.png'
                  },
                  {
                      id: 4,
                      alternativeText: `${h1.trim()} купить в магазине запчастей бу`,
                      caption: `${h1.trim()} купить в магазине запчастей бу`,
                      url: '/advantage_4.png'
                  },
                  {
                      id: 5,
                      alternativeText: `${h1.trim()} купить на авторазборке`,
                      caption: `${h1.trim()} купить на авторазборке`,
                      url: '/advantage_5.png'
                  }
              ] as IImage[])
            : images;

    return (
        <>
            {renderImages && (
                <>
                    {isTablet ? (
                        <Box paddingX='1em'>
                            <Slider slidesToShow={2}>
                                {renderImages.map((item) => (
                                    <Box key={item.id} padding='0.5em'>
                                        <Image
                                            isOnSSR={!(isCatalog && !images)}
                                            title={item.caption}
                                            alt={item.alternativeText}
                                            width={208}
                                            height={156}
                                            style={{ margin: 'auto', height: 'auto' }}
                                            src={item.formats?.small?.url || item.url}></Image>
                                    </Box>
                                ))}
                            </Slider>
                        </Box>
                    ) : (
                        <Box display='flex' flexWrap='wrap' justifyContent='space-around'>
                            {renderImages.map((item) => (
                                <Box key={item.id} padding='0.5em'>
                                    <Image
                                        isOnSSR={!(isCatalog && !images)}
                                        title={item.caption}
                                        alt={item.alternativeText}
                                        width={208}
                                        height={156}
                                        src={item.formats?.small?.url || item.url}></Image>
                                </Box>
                            ))}
                        </Box>
                    )}
                </>
            )}
            {content && !router.query.kindSparePart && <ReactMarkdown content={content}></ReactMarkdown>}
        </>
    );
};

export default SEOBox;
