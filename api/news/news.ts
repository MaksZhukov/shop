import getConfig from "next/config";
import Parser from "rss-parser";
import { OneNews } from "./types";
let parser = new Parser();
const { publicRuntimeConfig } = getConfig();

export const fetchNews = (): Promise<{ items: OneNews[] }> =>
  parser.parseURL(publicRuntimeConfig.rssLink) as any;
