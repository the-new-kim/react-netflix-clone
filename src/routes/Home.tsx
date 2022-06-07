import { useQueries, useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";

import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import Slider from "../componets/Slider";
import Detail from "../componets/Detail";

const Wrapper = styled.div`
  overflow-x: hidden;
`;
const Loader = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: saddlebrown;
`;
const Banner = styled.div<{ $bgImg: string }>`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), 80%, rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  padding: 4%;
`;
const Title = styled.h1`
  font-size: 60px;
  margin-bottom: 30px;
  font-weight: 700;
  width: 50%;
  text-shadow: 0px 8px 30px rgba(0, 0, 0, 0.3);
`;
const Overview = styled.p`
  width: 60%;
  font-size: 25px;
  text-shadow: 0px 0px 30px rgba(0, 0, 0, 0.6);
`;

// const movieCategory = ["now_playing", "top_rated", "popular"];

function Home() {
  const movieMatch = useMatch("/movies/:category/:movieId");

  // const result = useQueries(
  //   movieCategory.map((category) => {
  //     return {
  //       queryKey: ["queries", category],
  //       queryFn: () => getMovies(category),
  //     };
  //   })
  // );

  const { isLoading, data } = useQuery<IGetMoviesResult>(
    ["now_playing", "movie"],
    () => getMovies("now_playing"),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: loadingTopRated, data: dataTopRated } =
    useQuery<IGetMoviesResult>(
      ["top_rated", "movie"],
      () => getMovies("top_rated"),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const { isLoading: loadingPopular, data: dataPopular } =
    useQuery<IGetMoviesResult>(
      ["popular", "movie"],
      () => getMovies("popular"),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const [randomIndex, setRandomIndex] = useState(0);

  useLayoutEffect(() => {
    setRandomIndex((prev) =>
      data ? Math.floor(Math.random() * data?.results.length) : prev
    );
  }, [data]);

  // console.log(result.some((el) => el.isLoading));
  // console.log(result);

  const loading =
    isLoading || loadingTopRated || loadingPopular || randomIndex === null;

  return (
    <Wrapper>
      {loading ? (
        <Loader>Loader</Loader>
      ) : (
        <>
          <Banner
            $bgImg={makeImagePath(
              data?.results[randomIndex].backdrop_path || ""
            )}
          >
            <Title>{data?.results[randomIndex].title}</Title>
            <Overview>{data?.results[randomIndex].overview}</Overview>
          </Banner>

          {data && (
            <Slider
              data={data}
              title={"Movies in theatres"}
              category={"now_playing"}
            />
          )}
          {dataTopRated && (
            <Slider
              data={dataTopRated}
              title={"Top movies"}
              category={"top_rated"}
            />
          )}
          {dataPopular && (
            <Slider
              data={dataPopular!}
              title={"popular movies"}
              category={"popular"}
            />
          )}

          <Detail movieMatch={movieMatch} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
