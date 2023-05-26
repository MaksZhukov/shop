import { FC } from 'react';
import ReactMarkdownLib from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Typography from 'components/Typography';
import { Box, Link, useMediaQuery } from '@mui/material';
import Image from 'components/Image';
import { Image as IImage } from 'api/types';
import classNames from 'classnames';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const { publicRuntimeConfig } = getConfig();

interface Props {
    content: string;
    inline?: boolean;
    blockImagesSnippets?: { [key: string]: IImage[] };
}

const ReactMarkdown: FC<Props> = ({ content, inline, blockImagesSnippets = {} }) => {
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
    return (
        <ReactMarkdownLib
            rehypePlugins={[rehypeRaw]}
            components={{
                img: ({ src, alt = '', style, className = '' }) => {
                    const modifiedClassName = isMobile
                        ? className?.replace('image-style-align-left', '').replace('image-style-align-right', '')
                        : className;
                    return (
                        <Image
                            className={modifiedClassName}
                            alt={alt}
                            width={isMobile ? 500 : 640}
                            height={isMobile ? 375 : 480}
                            src={src || ''}
                            style={{
                                margin: isMobile ? 0 : '0 1.5em',
                                height: 'auto',
                                ...style,
                                ...(isMobile ? { width: '100%' } : {})
                            }}></Image>
                    );
                },
                video: ({ src }) => {
                    return (
                        <ReactPlayer
                            width={isTablet ? '100%' : 640}
                            height={isTablet ? 360 : 480}
                            controls
                            style={isTablet ? {} : { margin: '1em' }}
                            url={publicRuntimeConfig.backendLocalUrl + src}></ReactPlayer>
                    );
                },
                p: (data) => {
                    return (
                        <Typography component='span' display={inline ? 'inline' : 'block'} gutterBottom>
                            {data.children}
                        </Typography>
                    );
                },
                a: (data) => {
                    return <Link href={data.href}>{data.children}</Link>;
                },
                h3: (data) => (
                    <Typography component='h3' gutterBottom variant='h6'>
                        {data.children}
                    </Typography>
                ),
                h2: (data) => (
                    <Typography component='h2' gutterBottom marginTop='1em' variant='h5'>
                        {data.children}
                    </Typography>
                ),
                h1: (data) => {
                    return (
                        <Typography component='h1' variant='h4' style={data.style}>
                            {data.children}
                        </Typography>
                    );
                },
                code: (data) => {
                    let snippet = Object.keys(blockImagesSnippets).find((key) =>
                        data.children.some((item) => item === `{${key}}`)
                    );
                    if (snippet) {
                        return <></>;
                    }
                    return <></>;
                },
                div: ({ className, children, style = {} }) => {
                    const { float, ...restStyle } = style;
                    return (
                        <Box sx={isTablet && float ? restStyle : style} className={classNames(className)}>
                            {children}
                        </Box>
                    );
                }
            }}>
            {content}
        </ReactMarkdownLib>
    );
};

export default ReactMarkdown;
