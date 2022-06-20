import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./componets/Header";
import Home from "./routes/Home";
import Movie from "./routes/Movie";
import Search from "./routes/Search";
import Tv from "./routes/Tv";

function Router() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path=":category/:mediaId" element={<Home />} />
        </Route>
        <Route path="/movie" element={<Movie />} />
        <Route path="/tv" element={<Tv />}>
          <Route path=":category/:mediaId" element={<Tv />} />
        </Route>
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
