const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const axios = require('axios');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });

const handle = app.getRequestHandler();

app.prepare().then(() => {
	createServer(async (req, res) => {
		try {
			// Be sure to pass `true` as the second argument to `url.parse`.
			// This tells it to parse the query portion of the URL.
			const parsedUrl = parse(req.url, true);
			const { pathname, query } = parsedUrl;

			if (pathname === '/a') {
				await app.render(req, res, '/a', query);
			} else if (pathname === '/b') {
				await app.render(req, res, '/b', query);
			} else {
				await handle(req, res, parsedUrl);
			}
		} catch (err) {
			console.error('Error occurred handling', req.url, err);
			res.statusCode = 500;
			res.end('internal server error');
		}
	}).listen(port, (err) => {
		const backendLocalUrls = JSON.parse(process.env.BACKEND_LOCAL_URLS);
		axios.post(backendLocalUrls[0] + '/api/email', {
			to: 'maks_zhukov_97@mail.ru',
			subject: 'Start Nextjs FE Successful',
			text: `NODE_APP_INSTANCE: ${process.env.NODE_APP_INSTANCE}`
		});

		if (err) throw err;
		console.log(`> Ready on http://${hostname}:${port}`);
	});
});
