import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieDetails,
  getSimilarMovies,
  getVideos,
  IGetMovieDetals,
  IGetMoviesResult,
  IGetVideosResult,
} from "../api";
import { makeImagePath, makeVideoPath, toHoursAndMinutes } from "../utils";

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

const Wrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 50vw;
  max-width: 500px;
  height: auto;
  background-color: rgba(30, 30, 30, 1);
  z-index: 101;

  overflow-y: hidden;
`;

const InnerWrapper = styled.div`
  position: relative;
`;

const Cover = styled.div<{ $bgImg: string }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${(props) => props.theme.coverRatio};

  background-image: linear-gradient(
      rgba(30, 30, 30, 0.1),
      80%,
      rgba(30, 30, 30, 1)
    ),
    url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;

  font-size: 40px;
  font-weight: bold;
`;

const Info = styled.div`
  width: 100%;
  height: auto;
  padding: 20px;

  > *:not(:last-child) {
    margin-bottom: 30px;
  }
`;

const TitleAndRuntime = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;

  height: fit-content;
  > * {
    display: inline-block;
  }
`;

const Title = styled.h2`
  font-size: 40px;
  font-weight: bold;
  max-width: 90%;
`;
const Runtime = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 3px 10px;
`;
const Overview = styled.div``;
const Genres = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));

  gap: 4px;
`;
const GenreName = styled.div`
  background-color: rgb(50, 50, 50);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 10px;
`;

const SimilarWrapper = styled.div`
  > *:first-child {
    margin-bottom: 10px;
  }
`;
const SimilarTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
`;
const SimilarContents = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const Content = styled.div<{ $bgImg: string }>`
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  width: 100%;
  aspect-ratio: ${(props) => props.theme.coverRatio};
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

  const { isLoading: loadingSimilar, data: dataSimilar } =
    useQuery<IGetMoviesResult>(
      ["similar", movieMatch?.params.movieId],
      () => getSimilarMovies(movieMatch?.params.movieId || ""),
      { keepPreviousData: true, enabled: !!movieMatch }
    );

  const { isLoading: loadingVideo, data: dataVideo } =
    useQuery<IGetVideosResult>(
      ["video", movieMatch?.params.movieId],
      () => getVideos(movieMatch?.params.movieId || ""),
      { keepPreviousData: true, enabled: !!movieMatch }
    );

  const closeInfo = () => {
    navigate("/");
  };

  const { scrollY } = useViewportScroll();

  return (
    <>
      <AnimatePresence initial={false}>
        {movieMatch === null ? null : (
          <>
            <Oberlay
              onClick={closeInfo}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <Wrapper
              layoutId={`${movieMatch.params.category}${movieMatch.params.movieId}`}
              style={{ top: scrollY.get() + 100 }}
            >
              <InnerWrapper>
                {isLoading ? (
                  <div>loading</div>
                ) : (
                  <>
                    <Cover
                      $bgImg={makeImagePath(data?.backdrop_path || "", "w500")}
                    >
                      {loadingVideo ? null : (
                        <iframe
                          style={{ width: "100%", height: "100%" }}
                          src={makeVideoPath(
                            dataVideo?.results.find(
                              (video) => video.type === "Trailer"
                            )?.key || ""
                          )}
                          allow="autoplay"
                          // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                      )}
                    </Cover>

                    <Info>
                      <TitleAndRuntime>
                        <Title>{data?.title}</Title>
                        <Runtime>{toHoursAndMinutes(data!.runtime)}</Runtime>
                      </TitleAndRuntime>
                      <Genres>
                        {data?.genres.map((item) => (
                          <GenreName key={item.id}>{item.name}</GenreName>
                        ))}
                      </Genres>
                      <Overview>{data?.overview}</Overview>

                      {loadingSimilar ? (
                        "laoding..."
                      ) : (
                        <SimilarWrapper>
                          <SimilarTitle>Silmilar Contents</SimilarTitle>
                          <SimilarContents>
                            {dataSimilar?.results.map((item, index) => (
                              <Content
                                $bgImg={makeImagePath(item.backdrop_path)}
                                key={index}
                              >
                                {/* {item.title} */}
                              </Content>
                            ))}
                          </SimilarContents>
                        </SimilarWrapper>
                      )}
                    </Info>
                  </>
                )}
              </InnerWrapper>
            </Wrapper>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Detail;
