import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: darkblue;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Row = styled.div`
  width: 80%;
  height: fit-content;
  display: flex;
  flex-direction: column;

  background-color: saddlebrown;
`;

const RowTitle = styled.h1``;

const Slider = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
  display: flex;
  overflow: hidden;
  background-color: saddlebrown;
`;

const Items = styled(motion.div)`
  position: relative;
  width: 100%;
  height: fit-content;
  display: flex;
  background-color: darkblue;
`;

const Box = styled(motion.div)`
  min-width: 200px;
  height: 200px;
  color: black;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;

  margin-right: 10px;
`;

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

function Movie() {
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(sliderRef.current?.scrollWidth, sliderRef.current?.offsetWidth);
    if (!sliderRef.current) return;
    setSliderWidth(
      sliderRef.current.scrollWidth - sliderRef.current.offsetWidth
    );
  }, [sliderRef]);

  return (
    <Wrapper>
      <Row>
        <RowTitle>Title</RowTitle>
        <Slider ref={sliderRef}>
          <Items drag="x" dragConstraints={{ right: 0, left: -sliderWidth }}>
            {items.map((item, index) => (
              <Box key={index}>{index}</Box>
            ))}
          </Items>
        </Slider>
      </Row>
    </Wrapper>
  );
}

export default Movie;
