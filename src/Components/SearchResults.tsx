import styled from "styled-components";
import { AnimatePresence, useScroll, } from "framer-motion";
import { useQuery } from "react-query";
import { getSearchResult, IGetSearchResult, IGetMovieDetails, getMovieDetails, IGetMovieCredit, getMovieCredit, IGetTvShowDetails, IGetTvShowCredit, getTvShowDetails, getTvShowCredit } from "../api";
import { Thumbnail, Thumbnails, ThumbTitle, thumbTitleVariants, BigCover, BigTitle, BigMovieDetails, BigOverview, thumbnailVariants, Overlay, Year, Genres, Genre, Runtime, Stars, BigMovie, Actors, Cast, offset } from "./Slider";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";
import { Ratings } from "./Ratings"

const Wraper = styled.div<{totalRows: number}>`
  height: calc(${prop => prop.totalRows} * 140px);
  position: relative;
  align-content: center;
  margin-bottom: 200px;
`;
const Type = styled.h1`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 20px;
  margin-left: 10px;
  color: ${(props) => props.theme.white.lighter};
  text-transform: uppercase;
  padding-top: 50px;
`;


export function MovieSearchResults({ keyword }: { keyword: string }) {
  const bigMovieMatch = useMatch(`/myApp/search/movie/:movieId`);
  const { data } = useQuery<IGetSearchResult>(["search", keyword], () => getSearchResult(keyword));
  const { data: detailData, } = useQuery<IGetMovieDetails>(["tvShowDetails", bigMovieMatch?.params.movieId], () => getMovieDetails(bigMovieMatch?.params.movieId));
  const { data: creditData, } = useQuery<IGetMovieCredit>(["tvShowCredit", bigMovieMatch?.params.movieId], () => getMovieCredit(bigMovieMatch?.params.movieId));
  const movieResults = data?.results.filter(result => result.media_type === "movie");
  const navigate = useNavigate();
  const onBoxClicked = (type: string, movieId: number) => {
    navigate(`/myApp/search/${type}/${movieId}?keyword=${keyword}`);
  };
  const onOverlayClick = () => {
    navigate(-1);
  };
  const totalRows = Math.ceil(movieResults?.length as number / offset);
  const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find((movie) => movie.id + "" === bigMovieMatch?.params.movieId);
  const { scrollY } = useScroll();
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
    <Wraper totalRows={totalRows}>
      <Type>
        Movie Contents ({movieResults?.length as number})
      </Type>
      <Thumbnails          >
        {movieResults?.map((movie) => (
          <Thumbnail
            layoutId={movie.id + ""}
            onClick={() => onBoxClicked(movie.media_type, movie.id)}
            variants={thumbnailVariants}
            initial="normal"
            whileHover="hover"
            transition={{ type: "tween" }}
            key={movie.id}
            bgPhoto={makeImagePath(movie.backdrop_path + "", "w500")}
          >
            <ThumbTitle variants={thumbTitleVariants}>
              <h4>{movie.title}</h4>
            </ThumbTitle>
          </Thumbnail>
        ))}
      </Thumbnails>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 0.7, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}>
            </Overlay>
            <BigMovie
              layoutId={bigMovieMatch.params.movieId + ""}
              style={{
                top: scrollY.get() -200,
              }}
            >
              {clickedMovie &&
                <>
                  <BigCover style={{ backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path + "",)})` }}>
                  </BigCover>
                  <BigTitle>
                    {clickedMovie.title}
                  </BigTitle>
                  <BigMovieDetails>
                    <Year>
                      {new Date(detailData?.release_date as string).getFullYear()}
                    </Year>
                    <Stars>
                      <Ratings rating={detailData?.vote_average as number} />
                    </Stars>
                    <Runtime>
                      Running time: {runtimeCalculator(detailData?.runtime)}
                    </Runtime>
                    <Genres>
                      Genres: {detailData?.genres.map((data) => (
                        <Genre> {data.name} </Genre>
                      ))}
                    </Genres>
                    <Cast>
                      Cast: {creditData?.cast.splice(0, 3).map((prop) => (
                        <Actors>{prop.name}</Actors>
                      ))}
                    </Cast>
                    <BigOverview>
                      {clickedMovie.overview}
                    </BigOverview>
                  </BigMovieDetails>
                </>}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </Wraper>
  );
};

export function TvShowSearchResults({ keyword }: { keyword: string }) {

  const bigTvShowMatch = useMatch(`/myApp/search/tv/:tvShowId`);
  const { data, } = useQuery<IGetSearchResult>(["tvShows", keyword], () => getSearchResult(keyword));
  const { data: tvShowDetailData, } = useQuery<IGetTvShowDetails>(["tvShowDetails", bigTvShowMatch?.params.tvShowId], () => getTvShowDetails(bigTvShowMatch?.params.tvShowId));
  const { data: tvShowCreditData, } = useQuery<IGetTvShowCredit>(["tvShowCredit", bigTvShowMatch?.params.tvShowId], () => getTvShowCredit(bigTvShowMatch?.params.tvShowId));
  const tvShowResults = data?.results.filter(result => result.media_type === "tv");
  const navigate = useNavigate(); // url 이동을 위한 hook
  const onOverlayClick = () => {
    navigate(-1);
  };
  const totalRows = Math.ceil(tvShowResults?.length as number / offset);
  const clickedTvShow = bigTvShowMatch?.params.tvShowId && data?.results.find((tvShow) => tvShow.id + "" === bigTvShowMatch?.params.tvShowId);
  const { scrollY } = useScroll();
  const onBoxClicked = (type: string, tvShowId: number) => {
    navigate(`/myApp/search/${type}/${tvShowId}?keyword=${keyword}`);
  };

  return (
    <>
    <Wraper totalRows={totalRows}>
    <Type>
      tv show Contents ({tvShowResults?.length as number})
    </Type>
    <Thumbnails          >
      {tvShowResults?.map((tvShow) => (
        <Thumbnail
          layoutId={tvShow.id + ""}
          onClick={() => onBoxClicked(tvShow.media_type, tvShow.id)}
          variants={thumbnailVariants}
          initial="normal"
          whileHover="hover"
          transition={{ type: "tween" }}
          key={tvShow.id}
          bgPhoto={makeImagePath(tvShow.backdrop_path + "", "w500")}
        >
          <ThumbTitle variants={thumbTitleVariants}>
            <h4>{tvShow.title}</h4>
          </ThumbTitle>
        </Thumbnail>
      ))}
    </Thumbnails>
    </Wraper>
    <AnimatePresence>
        {bigTvShowMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 0.7, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}>
            </Overlay>
            <BigMovie
              layoutId={bigTvShowMatch?.params.tvShowId + ""}
              style={{
                top: scrollY.get() + 100,
              }}
            >
              {clickedTvShow &&
                <>
                  <BigCover style={{ backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedTvShow.backdrop_path + "",)})` }}>
                  </BigCover>
                  <BigTitle>
                    {clickedTvShow.name}
                  </BigTitle>
                  <BigMovieDetails>
                    <Year>
                      {new Date(tvShowDetailData?.first_air_date as string).getFullYear()}
                    </Year>
                    <Stars>
                      <Ratings rating={tvShowDetailData?.vote_average as number} />
                    </Stars>
                    <Runtime>
                      Running time: {tvShowDetailData?.episode_run_time.length !== 0 ? tvShowDetailData?.episode_run_time + "m" + " / " + tvShowDetailData?.number_of_episodes + " episodes": "-"}
                    </Runtime>
                    <Genres>
                      Genres: {tvShowDetailData?.genres.length ? tvShowDetailData?.genres.map((data) => (
                        <Genre> {data.name} </Genre>
                      )) : "-"}
                    </Genres>
                    <Cast>
                      Cast: {tvShowCreditData?.cast.length ? tvShowCreditData?.cast.splice(0, 3).map((prop) => (
                        <Actors>{prop.name}</Actors>
                      )) : "-"}
                    </Cast>
                    <BigOverview>
                      {clickedTvShow.overview}
                    </BigOverview>
                  </BigMovieDetails>
                </>}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
  </>
  );
};