import { fetchNews } from "api/news/news";
import { OneNews } from "api/news/types";
import { useEffect, useState } from "react";

const TWO_HOURS = 3600000;

const News = () => {
  const [news, setNews] = useState<OneNews[]>();
  useEffect(() => {
    const fetchData = async () => {
      let { items } = await fetchNews();
      let data = items.filter(
        (item) =>
          new Date(item.pubDate).getTime() < new Date().getTime() - TWO_HOURS
      );
      setNews(data);
    };
    fetchData();
  }, []);
  return <></>;
};

export default News;
