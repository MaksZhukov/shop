import getConfig from 'next/config';
import axios from 'axios';
import Parser from 'rss-parser';
import https from 'https';
import { NextRequest, NextResponse } from 'next/server';
let parser = new Parser();
const { publicRuntimeConfig } = getConfig();

const agent = new https.Agent({
	rejectUnauthorized: false,
});
export default async function handler(req: NextRequest, res: NextResponse) {
	res.json(
		//@ts-ignore
		await parser.parseString(
			(
				await axios(publicRuntimeConfig.rssLink, {
					httpsAgent: agent,
				})
			).data
		)
	);
}
