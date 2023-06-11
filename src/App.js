import { useState, useRef, useCallback } from "react";
import "./App.css";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState("");

  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);
  const observer = useRef();
  const lastBookElementRef = useCallback(
    //useCallback is used so that itll load on state changes. Ref doesnt work depending on state changes
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect(); //disconnecting the last elem it was observing
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          //if the elem's intersectiong is true, ie means the last element has appeared on the screen, then increase page no so itll load rest of the content
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node); //if last node in the current page, then observe it
    },
    [loading, hasMore]
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };
  return (
    <div className="App">
      <input type="text" value={query} onChange={handleChange}></input>
      {books.map((book, index) => {
        if (books.length == index + 1) {
          return (
            <div ref={lastBookElementRef} key={book}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}
      {loading && <div>loading...</div>}
      {error && <div>Error</div>}
    </div>
  );
}

export default App;
