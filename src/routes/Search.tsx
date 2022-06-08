import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { ISearchMovieResult, MediaType, searchContents } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 100px;
`;

const Results = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
`;

const Result = styled.div`
  background-color: saddlebrown;
`;

const Cover = styled(motion.div)<{ $bgImg: string }>`
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;

  aspect-ratio: ${(props) => props.theme.coverRatio};
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
            <Result key={index}>
              {result.backdrop_path && (
                <Cover $bgImg={makeImagePath(result.backdrop_path)} />
              )}
              {result.media_type === MediaType.movie
                ? result.title
                : result.name}
            </Result>
          )
        )}
      </Results>
    </Wrapper>
  );
}

export default Search;
