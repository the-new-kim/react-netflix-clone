import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";

import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

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
const Slider = styled(motion.div)`
  position: relative;
  top: -100px;
  margin-bottom: 200px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;

  transform-style: preserve-3d;
`;
const Item = styled(motion.div)<{ $bgImg: string }>`
  position: relative;
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  height: 12vw;
  color: red;
  font-size: 66px;
  transform: perspective(500px);
  transform-origin: bottom center;
  :first-child {
    transform-origin: bottom left;
  }
  :last-child {
    transform-origin: bottom right;
  }
`;
const Info = styled(motion.div)`
  width: 100%;
  padding: 10px;
  position: absolute;
  bottom: 0;
  background-color: darkblue;
  opacity: 0;
  h4 {
    font-size: 15px;
  }
`;

const rowVariants = {
  initial: { x: window.innerWidth + 10 },
  animate: { x: 0 },
  exit: { x: -window.innerWidth - 10 },
};

const itemVariants = {
  initial: {
    scale: 1,
    z: 0,
  },
  hover: {
    scale: 1.3,
    z: 100,
    transition: { delay: 0.3 },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.3 },
  },
};

const sliderOffset = 6;

function Home() {
  const navigate = useNavigate();
  const movieMatch = useMatch("/movies/:movieId");
  const { isLoading, data } = useQuery<IGetMoviesResult>("movies", getMovies);
  const [randomIndex, setRandomIndex] = useState(0);

  useLayoutEffect(() => {
    setRandomIndex((prev) =>
      data ? Math.floor(Math.random() * data?.results.length) : prev
    );
  }, [data]);

  const closeInfo = () => {
    navigate("/");
  };
  const onItemClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const [sliderIndex, setSliderIndex] = useState(0);
  const [sliding, setSliding] = useState(false);

  const toggleSliding = () => {
    setSliding((prev) => !prev);
  };

  const increasesliderIndex = () => {
    if (data) {
      if (sliding) return;
      const maxIndex = Math.floor(data?.results.length / sliderOffset) - 1;
      toggleSliding();
      setSliderIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
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
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleSliding}>
              <Row
                variants={rowVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                key={sliderIndex}
                transition={{ type: "tween", duration: 1 }}
              >
                {data?.results
                  .slice(
                    sliderOffset * sliderIndex,
                    sliderOffset * sliderIndex + sliderOffset
                  )
                  .map((item, index) => (
                    <Item
                      layoutId={item.id + ""}
                      onClick={() => onItemClicked(item.id)}
                      variants={itemVariants}
                      initial="initial"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      $bgImg={makeImagePath(item.backdrop_path, "w500")}
                      key={item.id}
                    >
                      <Info variants={infoVariants}>
                        <h4>{item.title}</h4>
                      </Info>
                    </Item>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
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
    </Wrapper>
  );
}

export default Home;
