import { Typography, Grid, ListItemButton, Link, Box, Icon } from '@mui/material';
import { Container } from '@mui/system';
import styles from './Footer.module.scss';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import { Footer as IFooter } from 'api/layout/types';
import { FC } from 'react';
import ReactMarkdown from 'components/ReactMarkdown';
import Image from 'components/Image';

interface Props {
	footer: IFooter;
}

const Footer: FC<Props> = ({ footer }) => {
	const Map = () => {
		return (
			<div className={styles.map}>
				<iframe
					src='https://yandex.ru/map-widget/v1/?um=constructor%3Aa553e2f9544eb2f0c9143e3fc50b1dd10fc059188ae131165b0455a4ff8c645b&amp;source=constructor'
					width='100%'
					height='100%'
					frameBorder='0'
				></iframe>
			</div>
		);
	};

	return (
		<footer className={styles.footer}>
			<Container>
				<Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 12 }}>
					<Grid item xs={3}>
						<Box className={styles.footer__item}>
							<ReactMarkdown content={footer.firstBlock}></ReactMarkdown>
						</Box>
					</Grid>

					<Grid item xs={3}>
						<Box className={styles.footer__item} textAlign='left'>
							{footer.socials.map((item) => (
								<ListItemButton
									component='a'
									key={item.id}
									href={item.link}
									target='_blank'
									color='inherit'
								>
									<Image
										alt={item.image.alternativeText}
										width={20}
										height={20}
										src={item.image.url}
									></Image>
									<Typography marginLeft='0.5em'>{item.image.caption}</Typography>
								</ListItemButton>
							))}
						</Box>
					</Grid>

					<Grid item xs={3}>
						<Box className={(styles.footer__item, styles.footer__item_map)}>
							<Map />
						</Box>
					</Grid>

					<Grid item xs={3}>
						<Box className={styles.footer__item}>
							<ReactMarkdown content={footer.fourthBlock}></ReactMarkdown>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</footer>
	);
};

export default Footer;
