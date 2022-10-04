import { Collapse, Link, useMediaQuery, Skeleton, Alert } from "@mui/material";
import { Box } from "@mui/system";
import { fetchNews } from "api/news/news";
import { OneNews } from "api/news/types";
import Typography from "components/Typography";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import WhiteBox from "components/WhiteBox";
import { useEffect, useState } from "react";
import { useStore } from "store";

const TWO_HOURS = 3600000 * 2;
const COUNT_SKELETON_ITEMS = 5;

const News = () => {
  const [news, setNews] = useState<OneNews[]>([]);
  const [isNewsLoaded, setIsNewsLoaded] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const store = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let {
          data: { items },
        } = await fetchNews();
        let data = items.filter(
          (item) =>
            new Date(item.pubDate).getTime() < new Date().getTime() - TWO_HOURS
        );
        setNews(data);
        setIsNewsLoaded(true);
      } catch (err) {
        store.notification.showErrorMessage(
          "Произошла какая-то ошибка при загрузки статей, обратитесь в поддержку"
        );
      }
    };
    fetchData();
  }, []);

  const handleClick = () => {
    setIsOpened(!isOpened);
  };

  const renderNews = isNewsLoaded
    ? news.map((item) => (
        <WhiteBox key={item.guid}>
          <Link href={item.link}>
            <Typography lineClamp={3}>{item.title}</Typography>
          </Link>
          <Typography textAlign="right" color="text.secondary">
            {new Date(item.pubDate).toLocaleDateString("ru-RU")}{" "}
            {new Date(item.pubDate).toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </WhiteBox>
      ))
    : new Array(COUNT_SKELETON_ITEMS).fill(Math.random()).map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          width="100%"
          height={128}
          sx={{
            marginBottom: "1em",
            bgcolor: "grey.50",
            borderRadius: "10px",
          }}
        />
      ));

  return (
    <Box>
      {isTablet && (
        <WhiteBox>
          <Typography
            sx={
              isTablet
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }
                : { marginBottom: "0.5em" }
            }
            variant="h5"
            {...(isTablet ? { onClick: handleClick } : {})}
          >
            Новости{" "}
            {isTablet && (
              <>
                {" "}
                {isOpened ? (
                  <ExpandLess></ExpandLess>
                ) : (
                  <ExpandMore></ExpandMore>
                )}
              </>
            )}
          </Typography>
        </WhiteBox>
      )}
      {isTablet ? <Collapse in={isOpened}>{renderNews}</Collapse> : renderNews}
    </Box>
  );
};

export default News;
