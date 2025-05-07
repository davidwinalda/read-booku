import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import Fuse from "fuse.js";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { BookHighlight } from "./components";
import "./books.css";

const Books = () => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [currentBooks, setCurrentBooks] = useState([]);
  const categoryId = searchParams.get("categoryId") || "fiction";
  const size = parseInt(searchParams.get("size") || "10", 10);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingDescriptions, setLoadingDescriptions] = useState(false);

  // Utility to extract description (consistent with Details.js)
  const getSafeDescription = (desc) => {
    if (!desc) return "No description available.";
    if (typeof desc === "string") return desc;
    if (desc.value && typeof desc.value === "string") return desc.value;
    return "No description available.";
  };

  const getCategoryName = (id) => {
    const categories = {
      fiction: "Fiction",
      science_fiction: "Science Fiction",
      fantasy: "Fantasy",
      biographies: "Biographies",
      history: "History",
      mystery: "Mystery",
      romance: "Romance",
      thriller: "Thriller",
      horror: "Horror",
      poetry: "Poetry",
      "self-help": "Self Help",
      science: "Science",
    };
    return (
      categories[id] ||
      id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, " ")
    );
  };

  const getBooksByCategory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://openlibrary.org/subjects/${categoryId}.json?limit=50`
      );
      let formattedBooks = res.data.works.map((book) => ({
        id: book.key.replace("/works/", ""),
        title: book.title,
        authors: book.authors
          ? book.authors.map((author) => author.name)
          : ["Unknown"],
        cover_url: book.cover_id
          ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
          : "https://via.placeholder.com/80x120?text=No+Image", // Match BookHighlight placeholder
        description: "Loading description...", // Placeholder until we fetch the actual description
        sections: [{ title: "Chapter 1" }, { title: "Chapter 2" }],
        audio_length: 1800,
        category: getCategoryName(categoryId),
      }));
      setBooks(formattedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]); // getCategoryName is stable, not needed in deps

  // Fetch detailed descriptions for currently visible books
  const fetchBookDescriptions = useCallback(async (booksToFetch) => {
    if (!booksToFetch || booksToFetch.length === 0) return;

    setLoadingDescriptions(true);
    const updatedBooks = [...booksToFetch];

    // Process books sequentially to avoid overwhelming the API
    for (let i = 0; i < updatedBooks.length; i++) {
      try {
        const response = await axios.get(
          `https://openlibrary.org/works/${updatedBooks[i].id}.json`
        );

        updatedBooks[i] = {
          ...updatedBooks[i],
          description: getSafeDescription(response.data.description),
        };
      } catch (error) {
        console.error(
          `Error fetching description for book ${updatedBooks[i].id}:`,
          error
        );
        // Keep the existing description if there's an error
      }
    }

    setCurrentBooks(updatedBooks);
    setLoadingDescriptions(false);
  }, []);

  useEffect(() => {
    getBooksByCategory();
    setCurrentPage(1);
  }, [categoryId, getBooksByCategory]);

  // Update current books when page changes or books are loaded/filtered
  useEffect(() => {
    const idxLastBooks = currentPage * size;
    const idxFirstBooks = idxLastBooks - size;
    const visibleBooks = books.slice(idxFirstBooks, idxLastBooks);
    setCurrentBooks(visibleBooks);

    // Fetch descriptions for books in the current page
    fetchBookDescriptions(visibleBooks);
  }, [books, currentPage, size, fetchBookDescriptions]);

  const handleSearch = (keyword) => {
    if (!keyword) {
      getBooksByCategory();
      return;
    }
    const fuse = new Fuse(books, {
      keys: ["title", "authors"],
      threshold: 0.4,
    });
    const result = fuse.search(keyword);
    const matches = result.map((r) => r.item); // Directly map items
    setBooks(matches);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(books.length / size); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container">
      <div className="books-header">
        <h2>Browse {getCategoryName(categoryId)}</h2>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="Search by title or author"
            onChange={(e) => {
              handleSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading books...</div>
      ) : (
        <>
          {currentBooks.length > 0 ? (
            <ul className="listBooks">
              {currentBooks.map((book) => (
                <li key={book.id}>
                  <Link
                    to={`/details`}
                    state={book} // Pass the formatted book object
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <BookHighlight
                      id={book.id}
                      src={book.cover_url}
                      alt={book.title || "Book Cover"}
                      title={book.title}
                      authors={book.authors}
                      description={book.description}
                      category={book.category}
                      showDescription={true} // Show description in list view
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-books">No books found in this category.</div>
          )}
          {loadingDescriptions && (
            <div className="loading-descriptions">
              Loading book descriptions...
            </div>
          )}
          {books.length > size && pageNumbers.length > 1 && (
            <div className="pagination-wrapper">
              <span
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                className={`pagination-button ${
                  currentPage === 1 ? "disabled-page" : ""
                }`}
              >
                <FaArrowLeft style={{ marginRight: "5px" }} /> Prev
              </span>
              {pageNumbers.map((pageNum) => (
                <span
                  className={`pagination-button ${
                    pageNum === currentPage
                      ? "current-page"
                      : "not-current-page"
                  }`}
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </span>
              ))}
              <span
                onClick={() =>
                  currentPage < pageNumbers.length &&
                  setCurrentPage(currentPage + 1)
                }
                className={`pagination-button ${
                  currentPage === pageNumbers.length ? "disabled-page" : ""
                }`}
              >
                Next <FaArrowRight style={{ marginLeft: "5px" }} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Books;
