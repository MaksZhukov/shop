import { Box } from '@mui/material';
import { Image } from 'api/types';
import WhiteBox from 'components/WhiteBox';
import getConfig from 'next/config';
import NextImage from 'next/image';
import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const { publicRuntimeConfig } = getConfig();

interface Props {
	images?: Image[];
	content?: string;
}

const SEOBox: FC<Props> = ({ images, content }) => {
	console.log(content);
	return (
		<>
			{images && (
				<WhiteBox>
					<Box
						display='flex'
						flexWrap='wrap'
						justifyContent='space-around'>
						{images?.map((item) => (
							<Box key={item.id} padding='0.5em'>
								<NextImage
									alt={item.alternativeText}
									width={208}
									height={156}
									src={
										publicRuntimeConfig.backendLocalUrl +
											item.formats?.small.url || item.url
									}></NextImage>
							</Box>
						))}
					</Box>
				</WhiteBox>
			)}
			{content && (
				<WhiteBox>
					<ReactMarkdown
						rehypePlugins={[rehypeRaw]}
						components={{
							img: ({ src, alt }) => {
								return (
									<NextImage
										alt={alt}
										width={640}
										height={480}
										src={
											publicRuntimeConfig.backendLocalUrl +
											src
										}></NextImage>
								);
							},
						}}>
						{content}
					</ReactMarkdown>
				</WhiteBox>
			)}
		</>
	);
};

export default SEOBox;
