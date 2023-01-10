import {
	Typography,
	Grid,
	ListItemButton,
	Link,
	Box,
	Icon,
	Button,
	MenuItem,
	Menu,
	Popper,
	Grow,
	MenuList,
} from '@mui/material';
import { Container } from '@mui/system';
import styles from './Footer.module.scss';
import { Footer as IFooter } from 'api/layout/types';
import { FC, MetaHTMLAttributes, useState } from 'react';
import ReactMarkdown from 'components/ReactMarkdown';
import Image from 'components/Image';
import qs from 'qs';
import { Share } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { TwitterShareButton } from 'react-share';
import TwitterIcon from 'react-share/lib/TwitterIcon';
import FacebookShareButton from 'react-share/lib/FacebookShareButton';
import FacebookIcon from 'react-share/lib/FacebookIcon';
import VKShareButton from 'react-share/lib/VKShareButton';
import VKIcon from 'react-share/lib/VKIcon';
import PinterestIcon from 'react-share/lib/PinterestIcon';
import PinterestShareButton from 'react-share/lib/PinterestShareButton';
import OKShareButton from 'react-share/lib/OKShareButton';
import OKIcon from 'react-share/lib/OKIcon';
import LivejournalShareButton from 'react-share/lib/LivejournalShareButton';
import LivejournalIcon from 'react-share/lib/LivejournalIcon';

interface Props {
	footer: IFooter;
}

const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

const Footer: FC<Props> = ({ footer }) => {
	const router = useRouter();
	let url = origin + router.pathname;
	const description =
		typeof window !== 'undefined' ? (document.querySelector('[name=description]') as HTMLMetaElement).content : '';
	const title = typeof window !== 'undefined' ? document.title : '';

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
										alt={item.image?.alternativeText}
										width={20}
										height={20}
										src={item.image?.url}
									></Image>
									<Typography marginLeft='0.5em'>{item.image.caption}</Typography>
								</ListItemButton>
							))}
						</Box>
					</Grid>

					<Grid item xs={3}>
						<Box className={(styles.footer__item, styles.footer__item_map)}>
							<div className={styles.map}>
								<iframe
									src='https://yandex.ru/map-widget/v1/?um=constructor%3Aa553e2f9544eb2f0c9143e3fc50b1dd10fc059188ae131165b0455a4ff8c645b&amp;source=constructor'
									width='100%'
									height='100%'
									frameBorder='0'
								></iframe>
							</div>
						</Box>
					</Grid>

					<Grid item xs={3}>
						<Box className={styles.footer__item}>
							<ReactMarkdown content={footer.fourthBlock}></ReactMarkdown>
							<Box>
								<Typography>Поделиться:</Typography>
								<TwitterShareButton
									className={styles.share}
									url='http://twitter.com/share'
									title={title}
									via={'https://twitter.com/MZapcastej'}
								>
									<TwitterIcon size={25}></TwitterIcon>
								</TwitterShareButton>
								<FacebookShareButton
									className={styles.share}
									url={'http://www.facebook.com/sharer.php'}
									quote={title}
								>
									<FacebookIcon size={25}></FacebookIcon>
								</FacebookShareButton>
								<VKShareButton className={styles.share} title={title} url='http://vk.com/share.php'>
									<VKIcon size={25}></VKIcon>
								</VKShareButton>
								<PinterestShareButton
									className={styles.share}
									description={description}
									media={origin + '/logo.jpg'}
									url='http://www.pinterest.com/pin/create/button'
								>
									<PinterestIcon size={25}></PinterestIcon>
								</PinterestShareButton>
								<OKShareButton className={styles.share} url={'https://connect.ok.ru/dk'} quote={title}>
									<OKIcon size={25}></OKIcon>
								</OKShareButton>
								<LivejournalShareButton
									className={styles.share}
									url='http://www.livejournal.com/update.bml'
									title={title}
									description={description}
								>
									<LivejournalIcon size={25}></LivejournalIcon>
								</LivejournalShareButton>
							</Box>
							{/* <Button
								id='share-menu'
								aria-controls={anchorEl ? 'share-menu' : undefined}
								aria-haspopup='true'
								sx={{ color: '#fff' }}
								endIcon={<Share sx={{ marginLeft: '0.1em' }} color='inherit'></Share>}
								aria-expanded={anchorEl ? 'true' : undefined}
								onClick={handleClick}
							>
								Поделиться
							</Button>
							<Menu
								id='share-menu'
								anchorEl={anchorEl}
								open={!!anchorEl}
								onClose={handleClose}
								MenuListProps={{
									'aria-labelledby': 'anchorEl',
								}}
							>
								<MenuItem>
									<Link href={`http://www.facebook.com/sharer.php?u=${url}`}>Facebook</Link>
								</MenuItem>
								<MenuItem>
									<Link
										href={`http://vk.com/share.php?${qs.stringify({
											url,
											title,
											description,
										})}`}
									>
										Вконтакте
									</Link>
								</MenuItem>
								<MenuItem>
									<Link
										href={`http://www.pinterest.com/pin/create/button?${qs.stringify({
											url,
											description,
										})}`}
									>
										Pinterest Pin
									</Link>
								</MenuItem>
								<MenuItem>
									<Link
										href={`http://twitter.com/share?${qs.stringify({
											url,
											text: description,
											via: 'https://twitter.com/MZapcastej',
										})}`}
									>
										Twitter
									</Link>
								</MenuItem>

								<MenuItem>
									<Link
										href={`https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${url}`}
									>
										OK
									</Link>
								</MenuItem>

								<MenuItem>
									<Link
										href={`http://www.livejournal.com/update.bml?${qs.stringify({
											event: url,
											subject: description,
										})}`}
									>
										LiveJournal
									</Link>
								</MenuItem>
							</Menu> */}
						</Box>
					</Grid>
				</Grid>
			</Container>
		</footer>
	);
};

export default Footer;
