import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";

import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Wrapper = styled.div``;

const Loader = styled.div`
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
  width: 100%;
  display: flex;
  overflow: hidden;
  padding: 0 4%;
`;
const Row = styled(motion.div)`
  position: relative;
  width: 100%;
  height: calc(15vw * 0.555);
  display: flex;
`;
const Item = styled(motion.div)<{ $bgImg: string }>`
  min-width: 15vw;
  height: calc(15vw * 0.555);
  display: flex;
  font-size: 50px;
  justify-content: center;
  align-items: center;
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;

  margin-right: 10px;
`;

const rowVariants = {
  initial: { x: window.innerWidth },
  animate: { x: 0 },
  exit: { x: -window.innerWidth },
};

function Home() {
  const { isLoading, data } = useQuery<IGetMoviesResult>("movies", getMovies);
  const [bannerIndex, setBannerIndex] = useState(0);
  const itemsRef = useRef(new Array());

  const [sliderIndex, setSliderIndex] = useState(0);

  const slideNext = () => {
    setSliderIndex((prev) => prev + 1);
  };

  useEffect(() => {
    setBannerIndex((prev) =>
      data ? Math.floor(Math.random() * data?.results.length) : prev
    );
  }, []);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loader</Loader>
      ) : (
        <>
          <Banner
            $bgImg={makeImagePath(
              data?.results[bannerIndex].backdrop_path || ""
            )}
          >
            <Title>{data?.results[bannerIndex].title}</Title>
            <Overview>{data?.results[bannerIndex].overview}</Overview>
          </Banner>
          <Slider onClick={slideNext}>
            <Row transition={{ type: "tween" }}>
              {data?.results.map((item, index) => (
                <Item
                  ref={(el) => itemsRef.current.push(el)}
                  $bgImg={makeImagePath(item.backdrop_path, "w500")}
                  key={index}
                />
              ))}
            </Row>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
