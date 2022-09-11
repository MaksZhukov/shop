import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import { fetchArticle } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import axios from 'axios';
import WhiteBox from 'components/WhiteBox';
import ReactMarkdown from 'react-markdown';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Image from 'next/image';

const { publicRuntimeConfig } = getConfig();

interface Props {
	data: Article;
}

const ArticlePage = ({ data }: Props) => {
	console.log(data);
	return (
		<Container>
			<WhiteBox padding='2em'>
				<Typography
					textAlign='center'
					variant='h4'
					title={data.title}
					component='h1'>
					{data.title}
				</Typography>
				<ReactMarkdown
					unwrapDisallowed
					components={{
						img: (props) => {
							return (
								<Image
									width={640}
									height={480}
									src={
										publicRuntimeConfig.backendLocalUrl +
										props.src
									}
									alt={props.alt}></Image>
							);
						},
					}}>
					{data.description}
				</ReactMarkdown>
			</WhiteBox>
		</Container>
	);
};

export const getServerSideProps: GetServerSideProps<
	{},
	{ slug: string }
> = async (context) => {
	let data = null;
	let notFound = false;
	try {
		const response = await fetchArticle(context.params?.slug || '', true);

		data = response.data.data;
	} catch (err) {
		console.log(err);
		if (axios.isAxiosError(err)) {
			notFound = true;
		}
	}

	return {
		notFound,
		props: { data },
	};
};

export default ArticlePage;
