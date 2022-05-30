import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";

import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import Slider from "../componets/Slider";

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

function Home() {
  const navigate = useNavigate();
  const movieMatch = useMatch("/movies/:movieId");
  const { isLoading, data } = useQuery<IGetMoviesResult>("movies", () =>
    getMovies("now_playing")
  );
  const [randomIndex, setRandomIndex] = useState(0);

  useLayoutEffect(() => {
    setRandomIndex((prev) =>
      data ? Math.floor(Math.random() * data?.results.length) : prev
    );
  }, [data]);

  const closeInfo = () => {
    navigate("/");
  };

  const loading = isLoading || randomIndex === null;

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
          <Slider category={"now_playing"} title={"now"} />
          <Slider category={"top_rated"} title={"top rated"} />
          <Slider category={"upcoming"} title={"upcoming"} />

          <AnimatePresence>
            {movieMatch ? (
              <motion.div
                onClick={closeInfo}
                style={{
                  position: "absolute",
                  width: "50vw",
                  height: "50vh",
                  backgroundColor: "red",
                  top: 0,
                  left: 0,
                }}
                layoutId={movieMatch.params.movieId}
              ></motion.div>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
