import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
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

const fakeApi = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function Tv() {
  const [items, setItems] = useState<number[]>([]);

  useEffect(() => setItems((pre) => [...fakeApi, ...pre]), []);

  const onClick = () => {
    setItems((oldItems) => {
      const newItems = [...oldItems];
      const firstItem = newItems[0];
      newItems.splice(0, 1);
      newItems.splice(newItems.length, 0, firstItem);

      return newItems;
    });
  };

  console.log(items);

  return (
    <Wrapper onClick={onClick}>
      <Row>
        <RowTitle>Title</RowTitle>
        <Slider>
          <Items>
            {items.map((item, index) => (
              <Box
                initial={{
                  x: -210,
                  backgroundColor: items[index] === 1 ? "red" : "blue",
                }}
                layout
                key={item}
              >
                {item}
              </Box>
            ))}
          </Items>
        </Slider>
      </Row>
    </Wrapper>
  );
}

export default Tv;
