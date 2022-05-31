import { AnimatePresence, motion } from "framer-motion";
import { type } from "os";
import { useLayoutEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovieDetails } from "../api";

const Wrapper = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: red;
`;

interface ITestProps {
  movieMatch: {
    params: { movieId: string | undefined; category: string | undefined };
  } | null;
}

function Test({ movieMatch }: ITestProps) {
  const { isLoading, data } = useQuery("detail", () =>
    getMovieDetails(movieMatch?.params.movieId || "")
  );

  console.log(movieMatch?.params);

  const loading = isLoading || movieMatch === null;

  console.log(data);

  return (
    <>
      <AnimatePresence>
        {loading ? null : (
          <Wrapper
            layoutId={`${movieMatch.params.category}${movieMatch.params.movieId}`}
          ></Wrapper>
        )}
      </AnimatePresence>
    </>
  );
}

export default Test;
