import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IForm } from "../Components/Header";
import { MovieSearchResults, TvShowSearchResults } from "../Components/SearchResults";

const Wraper = styled.div`
  overflow: hidden;
  background-color: black;
  align-items: center;
`;
const SearchArea = styled.form`
  width: 100%;
  height: 300px;
  display: flex;
  padding-top: 75px;
  justify-content: center;
  align-items: center;
`;
const SearchBar = styled.input`
  width: 300px;
  height: 50px;
  background-color: transparent;
  color: ${(props) => props.theme.white.lighter};
  font-size: 20px;
  border-radius: 15px;
  padding-left: 10px;
`;
const SearchBtn = styled.button`
  border-color: transparent;
  background-color: transparent;
  svg{
    height: 35px;
    padding-left: 10px;
    padding-top: 3px;
  }
`;

function Search() {
  const { register, handleSubmit, } = useForm<IForm>();

  const location = useLocation();
  const srcParams = new URLSearchParams(location.search);
  const keyword = srcParams.get("keyword");
  const navigate = useNavigate();
  const onValid = (data: IForm) => {
    navigate(`/myApp/search?keyword=${data.keyword}`);
  };

  return (
    <Wraper>
      <SearchArea onSubmit={handleSubmit(onValid)}>
        <SearchBar
          {...register("keyword", { required: "Please enter at least two characters...", minLength: 2 })}
          placeholder="Search for movie or TV show... ">
        </SearchBar>
        <SearchBtn type="submit">
          <svg
            cursor={"pointer"}
            fill="white"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </SearchBtn>
      </SearchArea>
      <MovieSearchResults keyword={`${keyword}`} />
      <TvShowSearchResults keyword={`${keyword}`} />
    </Wraper>
  );
}

export default Search;