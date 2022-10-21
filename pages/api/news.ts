import getConfig from 'next/config';
import axios from 'axios';
import Parser from 'rss-parser';
import https from 'https';
import { NextRequest, NextResponse } from 'next/server';

let parser = new Parser();
const { publicRuntimeConfig } = getConfig();

const TWO_HOURS = 3600000 * 2;

const agent = new https.Agent({
	rejectUnauthorized: false,
});

export interface OneNews {
	author: string;
	categories: string[];
	title: string;
	content: string;
	pubDate: string;
	link: string;
	guid: string;
}

export default async function handler(req: NextRequest, res: NextResponse) {
	let result = (await parser.parseString(
		(
			await axios(publicRuntimeConfig.rssLink, {
				httpsAgent: agent,
			})
		).data
	)) as { items: OneNews[] };

	const filteredNews = result.items.filter(
		(item: OneNews) =>
			new Date(item.pubDate).getTime() < new Date().getTime() - TWO_HOURS
	);
	//@ts-expect-error error
	res.json({
		data: filteredNews.map(({ content, guid, link, pubDate, title }) => {
			let imageUrls = content.match(/([^"]+.jpg)/g);
			return {
				guid,
				link,
				pubDate,
				title,
				imageUrl: imageUrls ? imageUrls[0] : '',
			};
		}),
	});
}
