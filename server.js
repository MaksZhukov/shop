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

const sparePartsIDs = [76060, 75630, 75025, 74992, 74990, 74977, 73213, 74964];

app.prepare().then(() => {
	if (process.env.NODE_APP_INSTANCE === '0') {
		setInterval(async () => {
			try {
				let productID = sparePartsIDs[Math.floor(Math.random() * sparePartsIDs.length)];
				await axios.get(
					`${process.env.BACKEND_URL}/api/orders/checkout?products[0][id]=${productID}&products[0][type]=sparePart&paymentMethodType=credit_card`
				);
			} catch (err) {
				axios.post(process.env.BACKEND_LOCAL_URL + '/api/email', {
					to: 'maks_zhukov_97@mail.ru',
					subject: 'ERROR SEND TEST CHECKOUT ORDER',
					html: JSON.stringify(err)
				});
			}
		}, 60 * 1000 * 5);
	}
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
		if (process.env.NODE_APP_INSTANCE === '0') {
			axios.post(process.env.BACKEND_LOCAL_URL + '/api/email', {
				to: 'maks_zhukov_97@mail.ru',
				subject: 'Start Nextjs FE Successful'
			});
		}
		if (err) throw err;
		console.log(`> Ready on http://${hostname}:${port}`);
	});
});
