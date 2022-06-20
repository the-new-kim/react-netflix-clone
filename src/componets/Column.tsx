import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IMulti, MediaType } from "../api";
import useViewportSize from "../hooks/useViewportSize";
import { makeImagePath } from "../utils";

const Wrapper = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const Cover = styled(motion.div)<{ $bgImg: string }>`
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center center;
  width: 100%;

  /* aspect-ratio: ${(props) => props.theme.coverRatio}; */
`;

const coverVariants = {
  animate: (coverWidth: number) => ({ height: coverWidth * 0.625 }),
};

interface IColumnProps {
  isLoading: boolean;
  data: IMulti;
  id: string;
}

function Column({ isLoading, data, id }: IColumnProps) {
  const { viewportWidth } = useViewportSize();
  const [coverWidth, setCoverWidth] = useState(0);

  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (coverRef.current) setCoverWidth(coverRef.current.clientWidth);
  }, [isLoading, viewportWidth]);
  return (
    <Wrapper>
      {data.backdrop_path && (
        <Cover
          ref={coverRef}
          layoutId={id}
          variants={coverVariants}
          animate="animate"
          $bgImg={makeImagePath(data.backdrop_path, "w500")}
          custom={coverWidth}
        />
      )}
      {data.media_type === MediaType.movie ? data.title : data.name}
    </Wrapper>
  );
}

export default Column;
