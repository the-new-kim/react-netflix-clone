import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { IMulti, ISearchMovieResult, MediaType, searchContents } from "../api";
import Column from "../componets/Column";
import useViewportSize from "../hooks/useViewportSize";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 100px;
`;

const Results = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data, isLoading } = useQuery<ISearchMovieResult>(
    ["search", keyword],
    () => searchContents(keyword || "")
  );

  return (
    <Wrapper>
      <div>{keyword}</div>
      <Results>
        {data?.results.map((result, index) =>
          result.media_type === MediaType.person ? null : (
            <Column
              key={result.id}
              isLoading={isLoading}
              data={result}
              id={result.id + ""}
            />
          )
        )}
      </Results>
    </Wrapper>
  );
}

export default Search;
