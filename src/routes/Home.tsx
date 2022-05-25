import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 300vh;
  background-color: sandybrown;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Home() {
  return (
    <Wrapper>
      <h1>Home</h1>
    </Wrapper>
  );
}

export default Home;
