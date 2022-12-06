import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { Autocomis as IAutocomis } from 'api/autocomises/types';
import { fetchServiceStation } from 'api/serviceStations/serviceStations';
import HeadSEO from 'components/HeadSEO';
import Image from 'components/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import SEOBox from 'components/SEOBox';
import WhiteBox from 'components/WhiteBox';
import { GetServerSideProps, NextPage } from 'next';

interface Props {
	data: IAutocomis;
}

const Autocomis: NextPage<Props> = ({ data }) => {
	return (
		<>
			<HeadSEO title={data.seo?.title} description={data.seo?.content} keywords={data.seo?.keywords}></HeadSEO>
			<Container>
				<WhiteBox>
					<Typography component='h1' variant='h4' gutterBottom>
						{data.name}
					</Typography>
					<Box>
						{data.image && (
							<Box marginRight='1em' sx={{ float: 'left' }}>
								<Image
									alt={data.image.alternativeText}
									width={640}
									height={480}
									src={data.image?.url}
								></Image>
							</Box>
						)}
						<ReactMarkdown content={data.description}></ReactMarkdown>
						<Box sx={{ clear: 'both' }}></Box>
					</Box>
				</WhiteBox>
				<SEOBox content={data.seo?.content} images={data.seo?.images}></SEOBox>
			</Container>
		</>
	);
};

export default Autocomis;

export const getServerSideProps: GetServerSideProps<{}, { slug: string }> = async (context) => {
	let data = null;
	let notFound = false;
	try {
		const result = await fetchServiceStation(context.params?.slug as string, true);
		data = result.data.data;
	} catch (err) {
		console.log(err);
		notFound = true;
	}
	return { props: { data }, notFound };
};
