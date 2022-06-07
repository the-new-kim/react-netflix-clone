import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { ISearchResult, searchContents } from "../api";

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search);

  const { data, isLoading } = useQuery<ISearchResult>(
    ["search", `${keyword.get("keyword")}`],
    () => searchContents(keyword.get("keyword") || "")
  );

  return (
    <div>
      <div>{keyword.get("keyword")}</div>
      <div>
        {data?.results.length !== 0
          ? data?.results.map((result, index) => (
              <div key={index}>{result.title}</div>
            ))
          : "no result"}
      </div>
    </div>
  );
}

export default Search;
