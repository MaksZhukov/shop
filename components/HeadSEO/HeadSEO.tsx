import { Image } from 'api/types';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC } from 'react';
const { publicRuntimeConfig } = getConfig();

interface Props {
    title?: string;
    description?: string;
    keywords?: string;
    image?: Image | null;
}

const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

const getOGType = (url: string) => {
    if (url.match(/(spare-parts|wheels|cabins|tires)\/.*\/.*/)) {
        return 'Товар';
    } else if (url.match(/(spare-parts|wheels|cabins|tires)\/.*/)) {
        return 'Категория';
    } else if (url.match(/(articles)\/.*/)) {
        return 'Статья';
    } else if (url.match(/articles\//)) {
        return 'Статьи';
    } else {
        return 'Страница';
    }
};

const HeadSEO: FC<Props> = ({ title, description, keywords, image }) => {
    const router = useRouter();
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description}></meta>
            <meta name="keywords" content={keywords} />
            <meta property="og:url" content={origin + router.asPath} />
            <meta property="og:site_name" content="Разбор авто" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={getOGType(router.asPath)} />
            <meta
                property="og:image"
                content={image ? publicRuntimeConfig.backendUrl + image.url : origin + '/logo.png'}
            />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
        </Head>
    );
};

export default HeadSEO;
