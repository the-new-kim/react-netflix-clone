import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetails, IGetMovieDetals } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div``;

const Oberlay = styled(motion.div)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 100;
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 50vw;
  height: 80vh;
  background-color: darkblue;
  z-index: 101;
`;

const BigCover = styled.div<{ $bgImg: string }>`
  width: 100%;

  height: 40%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), 80%, rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
`;

interface IDetailProps {
  movieMatch: {
    params: { movieId: string | undefined; category: string | undefined };
  } | null;
}

function Detail({ movieMatch }: IDetailProps) {
  const navigate = useNavigate();

  const { isLoading, data } = useQuery<IGetMovieDetals>(
    ["detail", movieMatch?.params.movieId],
    () => getMovieDetails(movieMatch?.params.movieId || ""),
    { keepPreviousData: true, enabled: !!movieMatch }
  );

  const closeInfo = () => {
    navigate("/");
  };

  const { scrollY } = useViewportScroll();

  const loading = isLoading || movieMatch === null;

  return (
    <>
      <AnimatePresence>
        {loading ? null : (
          <Wrapper>
            <Oberlay
              onClick={closeInfo}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              layoutId={`${movieMatch.params.category}${movieMatch.params.movieId}`}
              style={{ top: scrollY.get() + 100 }}
            >
              <BigCover
                $bgImg={makeImagePath(data?.backdrop_path || "", "w500")}
              />
              {data?.title}
            </BigMovie>
          </Wrapper>
        )}
      </AnimatePresence>
    </>
  );
}

export default Detail;
