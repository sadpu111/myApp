import { AnimatePresence, motion, useScroll, } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useMatch, useParams } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult, getMovies, getMovieDetails, IGetMovieDetails } from "../api";
import { makeImagePath, MovieStatus } from "../utils";

const Category = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 20px;
  margin-left: 10px;
  color: ${(props) => props.theme.white.lighter};
  text-transform: uppercase;
`;
const Slider = styled(motion.div)`
  height: 150px;
  column-gap: 5px;
  position: relative;
  top: -100px;
  align-content: center;
  margin-bottom: 100px;
`;
const SliderBtn = styled(motion.button) <{ isRight: boolean }>`
  position: absolute;
  right: ${(props) => (props.isRight ? 0 : null)};
  left: ${(props) => (props.isRight ? null : 0)};
  background-color: rgba(0,0,0,0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 35px;
  border: none;
  z-index: 2;
  color: ${(props) => props.theme.white.lighter};
  svg {
    width: 28px;
    height: 40px;
  }
`;
const Thumbnails = styled(motion.div)`
  display: grid;
  column-gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
`;
const Thumbnail = styled(motion.div) <{ bgPhoto: string }>`
  height: 150px;
  font-size: 64px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  justify-content: center;
  align-items: center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
`;
export const ThumbTitle = styled(motion.div)`
padding: 10px;
background-color: ${(props) => props.theme.black.darker};
opacity: 0;
position: absolute;
width: 100%;
bottom: 0;
h4 {
  color: white;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
}
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  overflow: hidden;
  border-radius: 10px;
  z-index: 4;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #ccc;
  }
`;
const BigCover = styled.div`
  width: 100%;
  height: 350px;
  background-size: cover;
  background-position: center center;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 30px;
  font-weight: bold;
  padding: 10px;
  position: relative;
  top: -50px;
`;
const BigMovieDetails = styled.div`
  display: grid;
`;
const Year = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-weight: bold;
  font-size: 24px;
  margin-top: -40px;
  margin-left: 20px;
`;
const Runtime = styled.h1`
  font-size: 15px;
  font-weight: bold;
  margin-left: 20px;
  color: ${(props) => props.theme.white.lighter};
  background-color
`;
const Genres = styled.h3`
color: ${(props) => props.theme.white.lighter};
font-weight: bold;
margin-top: 10px;
margin-left: 20px;
`;
const Genre = styled.span`
  text-align: center;
  font-weight: normal;
  padding-top: 2px;
  padding-left: 5px;
  padding-right: 5px;
  background-color: ${(props) => props.theme.blue};
  margin-left: 5px;
  border-radius: 5px;
`;
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: 10px;
  color: ${(props) => props.theme.white.lighter};
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 1);
  opacity: 0;
  z-index: 3;
`;
const sliderBtnVariants = {
  normal: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "tween"
    },
  },
};
const thumbnailVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const thumbnailsVariants = {
  hidden: ({ width, toPrev }:
    {
      width: number;
      toPrev: boolean;
    }) => ({
      x: toPrev ? -width - 5 : width + 5  // 사용자 윈도우 너비
    }),
  visible: {
    x: 0,
  },
  exit: ({ width, toPrev }:
    {
      width: number;
      toPrev: boolean;
    }) => ({
      x: toPrev ? width + 5 : -width - 5 // 사용자 윈도우 너비
    }),
};
export const thumbTitleVariants = {
  hover: {
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
    opacity: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};
const offset = 6;

export function MovieSlider({ status }: { status: MovieStatus }) {
  const bigMovieMatch = useMatch(`/movies/${status}/:movieId`);
  const { data, } = useQuery<IGetMoviesResult>(["movies", status], () => getMovies(status));
  const { data: detailData, } = useQuery<IGetMovieDetails>(["movieDetails", bigMovieMatch?.params.movieId], () => getMovieDetails(bigMovieMatch?.params.movieId));
  const { scrollY } = useScroll();
  const navigate = useNavigate(); // url 이동을 위한 hook
  const onOverlayClick = () => {
    navigate(-1);
  };
  const [toPrev, setToPrev] = useState(false);
  const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find((movie) => movie.id + "" === bigMovieMatch?.params.movieId);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = ({ movieId, status, }: { movieId: number; status: string; }) => {
    navigate(`/movies/${status}/${movieId}`);
  };
  const width = window.innerWidth;
  const increseIndex = () => {
    if (data) {
      if (leaving) return;
      setToPrev(false);
      toggleLeaving(); // setLeaving(true)는 항상 true가 되서 다른 동작이 되지 않음
      const totalMovies = data?.results.length - 1; // if (data)를 통해 maybe undefined 오류 방지. 배너 영화 한 개를 제외한 총 개수
      const maxIndex = Math.floor(totalMovies / offset) - 1; // 1개 row당 보여지는 영화의 개수(offset=6)으로 나눠 index 상한 설정
      setIndex((prev) => prev === maxIndex ? 0 : prev + 1);
    };
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setToPrev(true);
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      const minIndex = 0;
      setIndex((prev) => prev === minIndex ? maxIndex : prev - 1);
    };
  };
  const runtimeCalculator = (runtime: number | undefined) => {
    if (runtime) {
      let hour = Math.floor(runtime / 60);
      let min = Math.floor(runtime % 60);
      let hourValue = hour > 0 ? hour + "h" : "";
      let minValue = min > 0 ? min + "m" : "";

      return hourValue + " " + minValue;
    }
  };
  return (
    <>
      <Slider>
        <Category>
          {status === "now_playing"
            ? "Now Playing"
            : status === "top_rated"
              ? "Top Rated"
              : "Popular"}
        </Category>
        <AnimatePresence onExitComplete={toggleLeaving} initial={false} custom={{ width, toPrev }}>
          {/* onExitComplete => exit이 완료되면 실행되는 함수
            initial={false} => 화면 새로고침 시 애니메이션이 작동하지 않는다 */}
          <Thumbnails
            custom={{ width, toPrev }}
            key={status + index}
            variants={thumbnailsVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 0.7 }} // linear transition
          /* increaseIndex로 key의 index 값이 증가할 때마다, react.js는 새로운 row가 추가되는 것으로 인식하고, 이에 따라 기존의 row는 exit로 사라진다(AnimationPresence를 통해) */
          >
            {data?.results.slice(1) // 배너 영화 1개를 제외한 영화 목록
              .slice(offset * index, offset * index + offset).map((movie) => (
                <Thumbnail
                  layoutId={status + movie.id + ""}
                  onClick={() => onBoxClicked({ movieId: movie.id, status: status })}
                  /* onBoxClicked에 movie.id라는 전달인자를 넘겨주기 위해 () => 익명함수를 사용 */
                  variants={thumbnailVariants}
                  initial="normal"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  key={movie.id}
                  bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                >
                  <ThumbTitle variants={thumbTitleVariants}>
                    <h4>{movie.title}</h4>
                  </ThumbTitle>
                </Thumbnail>
              ))}
          </Thumbnails>
        </AnimatePresence>
        <SliderBtn
          onClick={decreaseIndex}
          isRight={false}
          variants={sliderBtnVariants}
          initial="normal"
          whileHover="hover">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
            fill="currentColor"
          >
            <path d="M137.4 406.6l-128-127.1C3.125 272.4 0 264.2 0 255.1s3.125-16.38 9.375-22.63l128-127.1c9.156-9.156 22.91-11.9 34.88-6.943S192 115.1 192 128v255.1c0 12.94-7.781 24.62-19.75 29.58S146.5 415.8 137.4 406.6z" />
          </svg>
        </SliderBtn>
        <SliderBtn
          onClick={increseIndex}
          isRight={true}
          variants={sliderBtnVariants}
          initial="normal"
          whileHover="hover">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
            fill="currentColor"
          >
            <path d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z" />
          </svg>
        </SliderBtn>
      </Slider>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 0.7, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}>
            </Overlay>
            <BigMovie
              layoutId={status + bigMovieMatch.params.movieId + ""}
              style={{
                top: scrollY.get() + 100,
              }}
            >
              {clickedMovie &&
                <>
                  <BigCover style={{ backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path,)})` }}>
                  </BigCover>
                  <BigTitle>
                    {clickedMovie.title}
                  </BigTitle>
                  <BigMovieDetails>
                    <Year>
                      {new Date(detailData?.release_date as string).getFullYear()}
                    </Year>
                    <Runtime>
                      Running time: {runtimeCalculator(detailData?.runtime)}
                    </Runtime>
                    <Genres>
                      Genres: {detailData?.genres.map((data) => (
                        <Genre> {data.name} </Genre>
                      ))}
                    </Genres>
                    <BigOverview>
                      {clickedMovie.overview}
                    </BigOverview>
                  </BigMovieDetails>
                </>}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>);
}