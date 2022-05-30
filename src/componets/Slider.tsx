import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled(motion.div)`
  position: relative;
  top: -100px;
  margin-bottom: 50px;
  width: 100%;
  height: 10vw;
  margin-bottom: 5vw;
`;
const Title = styled.h1`
  font-size: 30px;
  font-weight: bold;
  padding: 10px;
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
  height: 10vw;
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

const NextArrow = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  width: 8vw;
  height: 10vw;
  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 99;
  svg {
    width: 40px;
    height: 40px;
    fill: white;
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

interface ISliderProps {
  category: string;
  title: string;
}

function Slider({ category, title }: ISliderProps) {
  const { isLoading, data } = useQuery<IGetMoviesResult>(category, () =>
    getMovies(category)
  );
  const navigate = useNavigate();
  const onItemClicked = (movieId: number) => {
    navigate(`/movies/${category}${movieId}`);
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

  return (
    <>
      {isLoading ? null : (
        <Wrapper>
          <Title>{title}</Title>
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
                .map((item) => (
                  <Item
                    layoutId={`${category}${item.id}`}
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
          <NextArrow onClick={increasesliderIndex}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
            </svg>
          </NextArrow>
        </Wrapper>
      )}
    </>
  );
}

export default Slider;
