import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./componets/Header";
import Home from "./routes/Home";
import Movie from "./routes/Movie";
import Tv from "./routes/Tv";

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/tv" element={<Tv />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
