import { FC } from 'react';
import ReactMarkdownLib from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Typography from 'components/Typography';
import { Link } from '@mui/material';
import Image from 'components/Image';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

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
				img: ({ src, alt = '', ...rest }) => {
					return <Image alt={alt} width={640} height={480} src={src || ''}></Image>;
				},
				video: ({ src }) => {
					return <ReactPlayer controls url={publicRuntimeConfig.backendLocalUrl + src}></ReactPlayer>;
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
					<Typography component='h2' gutterBottom marginTop='1em' variant='h5'>
						{data.children}
					</Typography>
				),
			}}
		>
			{content}
		</ReactMarkdownLib>
	);
};

export default ReactMarkdown;
