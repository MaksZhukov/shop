import { FC } from 'react';
import ReactMarkdownLib from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import NextImage from 'next/image';
import getConfig from 'next/config';
import ReactPlayer from 'react-player';
import Typography from 'components/Typography';
import { Link } from '@mui/material';

const { publicRuntimeConfig } = getConfig();

interface Props {
	content: string;
	withVideo?: boolean;
}

const ReactMarkdown: FC<Props> = ({ content }) => {
	return (
		<ReactMarkdownLib
			rehypePlugins={[rehypeRaw]}
			components={{
				img: ({ src, alt = '' }) => {
					return (
						<NextImage
							alt={alt}
							width={640}
							height={480}
							src={publicRuntimeConfig.backendLocalUrl + src}
						></NextImage>
					);
				},
				video: ({ src }) => {
					return <ReactPlayer controls url={publicRuntimeConfig.backendLocalUrl + src}></ReactPlayer>;
				},
				p: (data) => {
					return <Typography gutterBottom>{data.children}</Typography>;
				},
				a: (data) => {
					return (
						<Link color='inherit' underline='hover' href={data.href}>
							{data.children}
						</Link>
					);
				},
			}}
		>
			{content}
		</ReactMarkdownLib>
	);
};

export default ReactMarkdown;
