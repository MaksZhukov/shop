import { Link, List, ListItem } from '@mui/material';
import { getNavigation } from 'components/features/Header/Header';
import Typography from 'components/Typography';
import NextLink from 'next/link';
import { getPageProps } from 'services/PagePropsService';

const SiteMap = () => {
	const pages = getNavigation([], '');

	return (
		<>
			<Typography component='h1' textAlign='center' variant='h3'>
				Карта сайта
			</Typography>
			<List sx={{ listStyle: 'initial' }}>
				{pages
					.filter((item) => item.path)
					.map((item) => (
						<>
							<ListItem sx={{ display: 'list-item' }} key={item.id}>
								<NextLink href={item.path as string}>
									<Link color='primary' component='span' underline='hover'>
										{item.name}
									</Link>
								</NextLink>
							</ListItem>
							<List sx={{ paddingLeft: '1em', listStyle: 'initial' }}>
								{item.children.map((el) => (
									<ListItem sx={{ display: 'list-item' }} key={el.id}>
										<NextLink href={el.path as string}>
											<Link color='primary' component='span' underline='hover'>
												{el.name}
											</Link>
										</NextLink>
									</ListItem>
								))}
							</List>
						</>
					))}
			</List>
		</>
	);
};

export default SiteMap;

export const getStaticProps = getPageProps(undefined, () => ({
	page: { seo: { title: 'Карта сайта', description: 'Наша карта сайта', keywords: 'карта сайта' } }
}));
