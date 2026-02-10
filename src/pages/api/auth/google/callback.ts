import type { NextApiRequest, NextApiResponse } from 'next';
import { backendUrl } from 'shared/services';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).end();
	}
	const token = typeof req.query.access_token === 'string' ? req.query.access_token : null;

	if (!token) {
		return res.redirect(302, '/');
	}

	const path = `/api/auth/google/callback`;
	const url = new URL(backendUrl + path);
	url.searchParams.set('access_token', token);

	const response = await fetch(url.href);
	const data = await response.json();

	return res.redirect(302, `/auth/callback?token=${data.jwt}`);
}
