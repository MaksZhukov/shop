import { Typography, Grid, ListItemButton, Link, Box } from '@mui/material';
import { Container } from '@mui/system';
import styles from './Footer.module.scss';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';




const Footer = () => {

	let date = new Date();

	const Map = () => {
		return (
			<div className={styles.map}>
				<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Aa553e2f9544eb2f0c9143e3fc50b1dd10fc059188ae131165b0455a4ff8c645b&amp;source=constructor" width="100%" height="100%" frameBorder="0"></iframe>
			</div >
		)
	};

	return (
		<footer className={styles.footer}>
			<Container>

				<Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 12 }}>

					<Grid item xs={3}>
						<Box className={styles.footer__item}>
							<ListItemButton component="a" href="https://www.instagram.com/" target="_blank">
								<InstagramIcon fontSize="small" />
								Instagram
							</ListItemButton>
							<ListItemButton component="a" href="https://www.pinterest.com/" target="_blank">
								<PinterestIcon fontSize="small" />
								Pinterest
							</ListItemButton>
						</Box>
					</Grid>

					<Grid item xs={3}>
						<Box className={(styles.footer__item, styles.footer__item_map)}>
							<Map />
						</Box>
					</Grid>

					<Grid item xs={3}>
						<Box className={styles.footer__item}>
							<Typography component='p' margin='0.5em 1em' >
								ЦЕНТР ОБСЛУЖИВАНИЯ КЛИЕНТОВ:
							</Typography>
							<Link href="tel:+375297804780" underline="hover" color='inherit'>

								+375-29-780-47-80
							</Link>

						</Box>
					</Grid>

					<Grid item xs={3}>
						<Box className={styles.footer__item}>
							<Typography margin='0.5em 0' component='p'>
								© {date.getFullYear()} - Авторазборка Полотково
							</Typography>
							<Typography margin='0.5em 0' component='p'>
								ООО &quot;Дриблинг&quot;, 2009-2017. УНП 590740644 . Дата
								регистрации 03.11.2008.
							</Typography>
						</Box>
					</Grid>

				</Grid>

			</Container>
		</footer >
	);
};

export default Footer;
