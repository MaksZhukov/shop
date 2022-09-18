import { Collapse, Link, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { fetchNews } from 'api/news/news';
import { OneNews } from 'api/news/types';
import Typography from 'components/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import WhiteBox from 'components/WhiteBox';
import { useEffect, useState } from 'react';

const TWO_HOURS = 3600000 * 2;

const News = () => {
	const [news, setNews] = useState<OneNews[]>([]);
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const isTablet = useMediaQuery((theme: any) =>
		theme.breakpoints.down('md')
	);
	useEffect(() => {
		const fetchData = async () => {
			let {
				data: { items },
			} = await fetchNews();
			let data = items.filter(
				(item) =>
					new Date(item.pubDate).getTime() <
					new Date().getTime() - TWO_HOURS
			);
			setNews(data);
		};
		fetchData();
	}, []);

	const handleClick = () => {
		setIsOpened(!isOpened);
	};

	const renderNews = news.map((item) => (
		<WhiteBox key={item.guid}>
			<Link href={item.link}>
				<Typography lineClamp={3}>{item.title}</Typography>
			</Link>
			<Typography textAlign='right' color='text.secondary'>
				{new Date(item.pubDate).toLocaleDateString('ru-RU')}{' '}
				{new Date(item.pubDate).toLocaleTimeString('ru-RU', {
					hour: '2-digit',
					minute: '2-digit',
				})}
			</Typography>
		</WhiteBox>
	));

	return (
		<Box>
			{isTablet && (
				<WhiteBox>
					<Typography
						sx={
							isTablet
								? {
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
								  }
								: { marginBottom: '0.5em' }
						}
						variant='h5'
						{...(isTablet ? { onClick: handleClick } : {})}>
						Новости{' '}
						{isTablet && (
							<>
								{' '}
								{isOpened ? (
									<ExpandLess></ExpandLess>
								) : (
									<ExpandMore></ExpandMore>
								)}
							</>
						)}
					</Typography>
				</WhiteBox>
			)}
			{isTablet ? (
				<Collapse in={isOpened}>{renderNews}</Collapse>
			) : (
				renderNews
			)}
		</Box>
	);
};

export default News;
