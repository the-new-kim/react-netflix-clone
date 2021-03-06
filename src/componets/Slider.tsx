import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult, IGetTvShowsResult } from "../api";
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

const Container = styled.div`
  position: relative;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;

  transform-style: preserve-3d;
`;
const Item = styled(motion.div)`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  /* transform: perspective(500px);
  transform-origin: bottom center;
  :first-child {
    transform-origin: bottom left;
  }
  :last-child {
    transform-origin: bottom right;
  } */
`;

const Cover = styled(motion.div)<{ $bgImg: string }>`
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;

  aspect-ratio: ${(props) => props.theme.coverRatio};
`;

const Info = styled(motion.div)`
  width: 100%;
  padding: 10px;
  position: relative;
  bottom: 0;
  background-color: rgb(50, 50, 50);
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
    cursor: pointer;
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
    originX: 0.5,
    originY: 1,
  },
  hover: {
    scale: 1.3,
    z: 100,

    transition: { delay: 0.3 },
  },
};

const infoVariants = {
  inital: {
    scaleY: 0,
    opacity: 0,
  },
  hover: {
    scaleY: 1,
    opacity: 1,
    transition: { delay: 0.3 },
  },
};

const sliderOffset = 6;

interface ISliderProps {
  data: IGetMoviesResult | IGetTvShowsResult;
  title: string;
  category: string;
}

function Slider({ data, title, category }: ISliderProps) {
  const navigate = useNavigate();
  const onItemClicked = (mediaId: number, categoryName: string) => {
    navigate(`${categoryName}/${mediaId}`);
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
    <Wrapper>
      <Title>{title}</Title>

      <Container>
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
                  onClick={() => onItemClicked(item.id, category)}
                  variants={itemVariants}
                  initial="initial"
                  exit="initial"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  key={item.id}
                >
                  <Cover
                    $bgImg={makeImagePath(
                      item.backdrop_path || item.poster_path,
                      "w500"
                    )}
                  ></Cover>
                  <Info variants={infoVariants}>
                    <h4>{"title" in item ? item.title : item.name}</h4>
                  </Info>
                </Item>
              ))}
          </Row>
        </AnimatePresence>
        <NextArrow>
          <svg
            onClick={increasesliderIndex}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
          </svg>
        </NextArrow>
      </Container>
    </Wrapper>
  );
}

export default Slider;
