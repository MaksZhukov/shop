import { FC } from 'react';
import ReactMarkdownLib from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Typography from 'components/Typography';
import { Link, useMediaQuery } from '@mui/material';
import Image from 'components/Image';
import { Box } from '@mui/system';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const { publicRuntimeConfig } = getConfig();

interface Props {
    content: string;
    inline?: boolean;
}

const ReactMarkdown: FC<Props> = ({ content, inline }) => {
    console.log(content);
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    return (
        <ReactMarkdownLib
            rehypePlugins={[rehypeRaw]}
            components={{
                img: ({ src, alt = '', style }) => {
                    return (
                        <Image
                            alt={alt}
                            width={isMobile ? 500 : 640}
                            height={isMobile ? 375 : 480}
                            src={src || ''}
                            style={{ height: 'auto', ...style }}></Image>
                    );
                },
                video: ({ src }) => {
                    return (
                        <ReactPlayer
                            width={isMobile ? '100%' : 640}
                            height={isMobile ? 'auto' : 480}
                            controls
                            style={{ margin: '1em' }}
                            url={publicRuntimeConfig.backendLocalUrl + src}></ReactPlayer>
                    );
                },
                p: (data) => {
                    return (
                        <Typography display={inline ? 'inline' : 'block'} gutterBottom>
                            {data.children}
                        </Typography>
                    );
                },
                a: (data) => {
                    return <Link href={data.href}>{data.children}</Link>;
                },
                h2: (data) => (
                    <Typography component="h2" gutterBottom marginTop="1em" variant="h5">
                        {data.children}
                    </Typography>
                ),
                h1: (data) => {
                    return (
                        <Typography component="h1" variant="h4" style={data.style}>
                            {data.children}
                        </Typography>
                    );
                }
            }}>
            {content}
        </ReactMarkdownLib>
    );
};

export default ReactMarkdown;
