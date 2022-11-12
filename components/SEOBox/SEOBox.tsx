import { Box } from '@mui/material';
import { Image } from 'api/types';
import WhiteBox from 'components/WhiteBox';
import getConfig from 'next/config';
import NextImage from 'next/image';
import { FC } from 'react';

const { publicRuntimeConfig } = getConfig();

interface Props {
	images?: Image[];
}

const SEOBox: FC<Props> = ({ images }) => {
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
		</>
	);
};

export default SEOBox;
