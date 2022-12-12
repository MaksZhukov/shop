import { FC } from 'react';
import ReactMarkdownLib from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import getConfig from 'next/config';
import ReactPlayer from 'react-player';
import Typography from 'components/Typography';
import { Link } from '@mui/material';
import Image from 'components/Image';

const { publicRuntimeConfig } = getConfig();

interface Props {
	content: string;
	inline?: boolean;
}

const ReactMarkdown: FC<Props> = ({ content, inline }) => {
	return (
		<ReactMarkdownLib
			rehypePlugins={[rehypeRaw]}
			components={{
				img: ({ src, alt = '' }) => {
					return <Image alt={alt} width={640} height={480} src={src || ''}></Image>;
				},
				video: ({ src }) => {
					return <ReactPlayer controls url={publicRuntimeConfig.backendLocalUrl + src}></ReactPlayer>;
				},
				p: (data) => {
					return (
						<Typography display={inline ? 'inline' : 'initial'} gutterBottom>
							{data.children}
						</Typography>
					);
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
