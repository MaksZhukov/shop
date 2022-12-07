import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { Autocomis as IAutocomis } from 'api/autocomises/types';
import { Layout } from 'api/layout/types';
import { fetchServiceStation } from 'api/serviceStations/serviceStations';
import HeadSEO from 'components/HeadSEO';
import Image from 'components/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import SEOBox from 'components/SEOBox';
import WhiteBox from 'components/WhiteBox';
import { GetServerSideProps, NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	data: IAutocomis;
	layout: Layout;
}

const Autocomis: NextPage<Props> = ({ data }) => {
	return (
		<>
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
			</Container>
		</>
	);
};

export default Autocomis;

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	data: (await fetchServiceStation(context.params?.slug as string, true)).data.data,
}));
