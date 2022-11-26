import { FC } from 'react';
import ReactMarkdownLib from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import NextImage from 'next/image';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

interface Props {
	content: string;
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
							src={
								publicRuntimeConfig.backendLocalUrl + src
							}></NextImage>
					);
				},
			}}>
			{content}
		</ReactMarkdownLib>
	);
};

export default ReactMarkdown;
