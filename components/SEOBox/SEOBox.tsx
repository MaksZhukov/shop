import { Box } from '@mui/material';
import { Image as IImage } from 'api/types';
import Image from 'components/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import WhiteBox from 'components/WhiteBox';
import getConfig from 'next/config';

import { FC } from 'react';

const { publicRuntimeConfig } = getConfig();

interface Props {
    images?: IImage[];
    content?: string;
}

const SEOBox: FC<Props> = ({ images, content }) => {
    return (
        <>
            {images && (
                <Box display="flex" flexWrap="wrap" justifyContent="space-around">
                    {images?.map((item) => (
                        <Box key={item.id} padding="0.5em">
                            <Image
                                alt={item.alternativeText}
                                width={208}
                                height={156}
                                src={item.formats?.small?.url || item.url}></Image>
                        </Box>
                    ))}
                </Box>
            )}
            {content && <ReactMarkdown content={content}></ReactMarkdown>}
        </>
    );
};

export default SEOBox;
