import { NextApiResponse, NextApiRequest } from 'next';

const PAGES = [
	'/404',
	'/500',
	'/autocomises',
	'/car-dismantling-photos',
	'/company-photo',
	'/vacancies',
	'/service-stations',
	'/profile',
	'/installment-plan',
	'/how-to-get-to',
	'/guarantee',
	'/favorites',
	'/delivery',
	'/contacts',
	'/buyback-cars',
    '/privacy',
    '/sitemap'
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.query.revalidateToken !== process.env.REVALIDATE_TOKEN) {
		return res.status(401).json({ message: 'Invalid token' });
	}
	try {
		if (typeof req.query.pagePath === 'string') {
			if (req.query.pagePath === '*') {
				await Promise.all(PAGES.map((page) => res.revalidate(page)));
			} else {
				await res.revalidate(req.query.pagePath);
			}
		}
		return res.json({ revalidated: true });
	} catch (err) {
		return res.status(500).send('Error revalidating');
	}
}
