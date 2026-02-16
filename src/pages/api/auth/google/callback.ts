import type { NextApiRequest, NextApiResponse } from 'next';
import { backendUrl } from 'shared/services';

const AUTH_COOKIE_NAME = 'token';
const AUTH_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

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

	const jwt = data?.jwt;
	if (!jwt) {
		return res.redirect(302, '/');
	}

	const isProd = process.env.NODE_ENV === 'production';

	res.setHeader(
		'Set-Cookie',
		[
			`${AUTH_COOKIE_NAME}=${jwt}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${AUTH_COOKIE_MAX_AGE}${isProd ? '; Secure' : ''}`
		].join(', ')
	);

	return res.redirect(302, '/');
}
