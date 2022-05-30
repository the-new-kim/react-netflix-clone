import { AnimatePresence, motion } from "framer-motion";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  /* overflow: hidden; */
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

function Tv() {
  const ref = useRef<HTMLDivElement>(null);

  console.log("render", ref.current);

  useEffect(() => {
    console.log("use effect", ref.current);
  });

  useLayoutEffect(() => {
    console.log("use layout effect", ref.current?.clientWidth);
  });

  return (
    <Wrapper>
      <Row>
        <RowTitle>Title</RowTitle>
        <Slider ref={ref}>
          <Items>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <Box key={item}>{item}</Box>
            ))}
          </Items>
        </Slider>
      </Row>
    </Wrapper>
  );
}

export default Tv;
