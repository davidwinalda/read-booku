import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdChevronLeft } from "react-icons/md";

import { BookHighlight } from "./components";

const Bookmarks = () => {
  let navigate = useNavigate();
  let [bookmark, setBookmark] = useState([]);

  useEffect(() => {
    try {
      const bookmarksRetrieve = JSON.parse(
        localStorage.getItem("bookmark") || "[]"
      );
      setBookmark(bookmarksRetrieve);
    } catch (error) {
      console.error("Error retrieving bookmarks:", error);
      setBookmark([]);
    }
  }, []);

  const removeBookmark = (id) => {
    const updatedBookmarks = bookmark.filter((book) => book.id !== id);
    setBookmark(updatedBookmarks);
    localStorage.setItem("bookmark", JSON.stringify(updatedBookmarks));
  };

  return (
    <div className="container">
      <div className="header">
        <MdChevronLeft
          size="2em"
          onClick={() => navigate(-1)}
          className="back-button"
        />
        <h2>Your Bookmarks</h2>
      </div>
      {bookmark.length > 0 ? (
        <ul className="listBooks">
          {bookmark.map((book) => (
            <li key={book.id}>
              <Link
                to="/details"
                style={{ textDecoration: "none", color: "#52565e" }}
                state={book}
              >
                <BookHighlight
                  src={book.cover_url}
                  alt="books"
                  title={book.title}
                  authors={book.authors || ["Unknown"]}
                  description={
                    typeof book.description === "string"
                      ? book.description
                      : "No description available"
                  }
                  widthCover="150"
                />
              </Link>
              <button
                className="remove-bookmark"
                onClick={(e) => {
                  e.preventDefault();
                  removeBookmark(book.id);
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-bookmarks">
          <p>You haven't bookmarked any books yet.</p>
          <Link to="/" className="browse-link">
            Browse books
          </Link>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
