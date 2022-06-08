import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieDetails,
  getMovieTrailer,
  getSimilarMovies,
  getSimilarTvShows,
  getTvDetails,
  getTvShowTrailer,
  IGetMovieDetals,
  IGetMoviesResult,
  IGetTvShowDetails,
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
  mediaMatch: {
    params: { mediaId: string | undefined; category: string | undefined };
  } | null;
  isTv: boolean;
}

function Detail({ mediaMatch, isTv }: IDetailProps) {
  const navigate = useNavigate();

  const { isLoading, data } = useQuery<IGetMovieDetals | IGetTvShowDetails>(
    ["detail", mediaMatch?.params.mediaId],
    () =>
      isTv
        ? getTvDetails(mediaMatch?.params.mediaId || "")
        : getMovieDetails(mediaMatch?.params.mediaId || ""),
    {
      keepPreviousData: true,
      enabled: !!mediaMatch,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: loadingSimilar, data: dataSimilar } =
    useQuery<IGetMoviesResult>(
      ["similar", mediaMatch?.params.mediaId],
      () =>
        isTv
          ? getSimilarTvShows(mediaMatch?.params.mediaId || "")
          : getSimilarMovies(mediaMatch?.params.mediaId || ""),
      {
        keepPreviousData: true,
        enabled: !!mediaMatch,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const { isLoading: loadingVideo, data: dataVideo } =
    useQuery<IGetVideosResult>(
      ["video", mediaMatch?.params.mediaId],
      () =>
        isTv
          ? getTvShowTrailer(mediaMatch?.params.mediaId || "")
          : getMovieTrailer(mediaMatch?.params.mediaId || ""),
      {
        keepPreviousData: true,
        enabled: !!mediaMatch,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const closeInfo = () => {
    navigate(-1);
  };

  const { scrollY } = useViewportScroll();

  return (
    <>
      <AnimatePresence initial={false}>
        {mediaMatch === null ? null : (
          <>
            <Oberlay
              onClick={closeInfo}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <Wrapper
              layoutId={`${mediaMatch.params.category}${mediaMatch.params.mediaId}`}
              style={{ top: scrollY.get() + 100 }}
            >
              <InnerWrapper>
                {isLoading ? (
                  <div>loading...</div>
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

                    {data ? (
                      <Info>
                        <TitleAndRuntime>
                          <Title>
                            {"title" in data ? data.title : data.name}
                          </Title>
                          {isTv ? null : (
                            <Runtime>{toHoursAndMinutes(data.runtime)}</Runtime>
                          )}
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
                    ) : null}
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
