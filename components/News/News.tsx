import { Link } from '@mui/material';
import { Box } from '@mui/system';
import { fetchNews } from 'api/news/news';
import { OneNews } from 'api/news/types';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { useEffect, useState } from 'react';

const TWO_HOURS = 3600000;

const News = () => {
	const [news, setNews] = useState<OneNews[]>([]);
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

	return (
		<Box>
			{news.map((item) => (
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
			))}
		</Box>
	);
};

export default News;
