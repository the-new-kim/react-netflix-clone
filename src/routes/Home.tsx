import { useQuery } from "react-query";
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

enum Categories {
  now_playing = "now_playing",
  top_rated = "top_rated",
  popular = "popular",
}

function Home() {
  const [randomIndex, setRandomIndex] = useState(0);
  const mediaMatch = useMatch("/:category/:mediaId");

  // const queryResults = useQueries(
  //   movieCategory.map((category) => {
  //     return {
  //       queryKey: ["queries", category],
  //       queryFn: () => getMovies(category),
  //     };
  //   })
  // ) as UseQueryResult<IGetMoviesResult>[];

  // console.log(
  //   queryResults.map((result) =>
  //     result.data?.results.map((movieData) => movieData.id)
  //   )
  // );

  const { isLoading: loadingNowPlaying, data: dataNowPlaying } =
    useQuery<IGetMoviesResult>(
      [Categories.now_playing, "movie"],
      () => getMovies(Categories.now_playing),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const { isLoading: loadingTopRated, data: dataTopRated } =
    useQuery<IGetMoviesResult>(
      [Categories.top_rated, "movie"],
      () => getMovies(Categories.top_rated),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const { isLoading: loadingPopular, data: dataPopular } =
    useQuery<IGetMoviesResult>(
      [Categories.popular, "movie"],
      () => getMovies(Categories.popular),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  useLayoutEffect(() => {
    setRandomIndex((prev) =>
      dataNowPlaying
        ? Math.floor(Math.random() * dataNowPlaying?.results.length)
        : prev
    );
  }, [dataNowPlaying]);

  const loading =
    loadingNowPlaying ||
    loadingTopRated ||
    loadingPopular ||
    randomIndex === null;

  return (
    <Wrapper>
      {loading ? (
        <Loader>Loader</Loader>
      ) : (
        <>
          <Banner
            $bgImg={makeImagePath(
              dataNowPlaying?.results[randomIndex].backdrop_path || ""
            )}
          >
            <Title>{dataNowPlaying?.results[randomIndex].title}</Title>
            <Overview>{dataNowPlaying?.results[randomIndex].overview}</Overview>
          </Banner>

          {dataNowPlaying && (
            <Slider
              data={dataNowPlaying}
              title={"Movies in theatres"}
              category={Categories.now_playing}
            />
          )}
          {dataTopRated && (
            <Slider
              data={dataTopRated}
              title={"Top movies"}
              category={Categories.top_rated}
            />
          )}
          {dataPopular && (
            <Slider
              data={dataPopular}
              title={"popular movies"}
              category={Categories.popular}
            />
          )}

          <Detail mediaMatch={mediaMatch} isTv={false} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
