import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Movie from "./Routes/Movie";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import TvShow from "./Routes/TvShow";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/myApp/*" element={<Movie />}></Route>
        <Route path="/myApp/tvShows/*" element={<TvShow />}></Route>
        <Route path="/myApp/search/*" element={<Search />}></Route>
      </Routes>
    </Router>

  );
}

export default App;