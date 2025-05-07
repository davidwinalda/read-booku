import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdChevronLeft, MdSchedule, MdMenuBook } from "react-icons/md";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import axios from "axios";

import "./detail.css";

const MAX_RECENTLY_VIEWED = 10;

const Details = () => {
  let location = useLocation();
  let navigate = useNavigate();

  let bookFromState = location.state; // Renamed to avoid confusion
  let [bookDetails, setBookDetails] = useState(bookFromState); // Initialize with state, update with fetched details
  let [bookmark, setBookmark] = useState([]);
  let [loading, setLoading] = useState(false);
  let [isBookmarked, setIsBookmarked] = useState(false);

  const minutes = Math.floor((bookDetails?.audio_length || 1800) / 60); // Use bookDetails and provide default

  // Utility to extract description
  const getSafeDescription = (desc) => {
    if (!desc) return "No description available.";
    if (typeof desc === "string") return desc;
    if (desc.value && typeof desc.value === "string") return desc.value;
    return "No description available.";
  };

  // Utility to get category name from ID
  const getCategoryName = (id) => {
    // Extract category from ID if possible
    let categoryId = id;
    if (typeof id === "string" && id.includes("/")) {
      const parts = id.split("/");
      categoryId = parts[parts.length - 1];
    }

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

    // Try to find in predefined categories, otherwise format the ID
    return (
      categories[categoryId] ||
      (categoryId || "").charAt(0).toUpperCase() +
        (categoryId || "").slice(1).replace(/_/g, " ")
    );
  };

  useEffect(() => {
    if (bookDetails && bookDetails.id) {
      try {
        const recentlyViewed = JSON.parse(
          localStorage.getItem("recentlyViewed") || "[]"
        );
        const filteredRecent = recentlyViewed.filter(
          (item) => item.id !== bookDetails.id
        );

        const recentViewEntry = {
          id: bookDetails.id,
          title: bookDetails.title,
          authors:
            bookDetails.authors && bookDetails.authors.length > 0
              ? bookDetails.authors
              : ["Unknown"], // Simplified
          cover_url: bookDetails.cover_url,
          description: getSafeDescription(bookDetails.description),
          sections: bookDetails.sections || [],
          audio_length: bookDetails.audio_length || 1800,
          category: bookDetails.category || getCategoryName(bookDetails.id),
        };

        const updatedRecent = [recentViewEntry, ...filteredRecent].slice(
          0,
          MAX_RECENTLY_VIEWED
        );
        localStorage.setItem("recentlyViewed", JSON.stringify(updatedRecent));
      } catch (error) {
        console.error("Error updating recently viewed books:", error);
      }
    }
  }, [bookDetails]); // Ensure this effect runs when bookDetails (and its authors) changes

  useEffect(() => {
    const checkBookmarked = () => {
      if (!bookFromState?.id) return; // Guard clause
      try {
        const bookmarksRetrieve = JSON.parse(
          localStorage.getItem("bookmark") || "[]"
        );
        setBookmark(bookmarksRetrieve);
        const bookmarkExists = bookmarksRetrieve.some(
          (item) => item.id === bookFromState.id
        );
        setIsBookmarked(bookmarkExists);
      } catch (error) {
        console.error("Error retrieving bookmarks:", error);
        setBookmark([]);
        setIsBookmarked(false);
      }
    };
    checkBookmarked();

    const fetchBookDetails = async () => {
      if (!bookFromState?.id) return; // Guard clause
      setLoading(true);
      try {
        const response = await axios.get(
          `https://openlibrary.org/works/${bookFromState.id}.json`
        );
        setBookDetails((prevDetails) => {
          // Determine authors: Prioritize from bookFromState, then prevDetails, else default.
          // We do NOT parse response.data.authors from /works/ endpoint for names.
          let newAuthors = ["Unknown"]; // Default
          if (
            bookFromState &&
            Array.isArray(bookFromState.authors) &&
            bookFromState.authors.length > 0 &&
            bookFromState.authors.every((a) => typeof a === "string")
          ) {
            newAuthors = bookFromState.authors;
          } else if (
            prevDetails &&
            Array.isArray(prevDetails.authors) &&
            prevDetails.authors.length > 0 &&
            prevDetails.authors.every((a) => typeof a === "string")
          ) {
            newAuthors = prevDetails.authors;
          }

          return {
            ...(prevDetails || {}), // Spread previous details first
            ...response.data, // Then API response data
            id: bookFromState.id, // Ensure ID from state is prioritized
            title:
              response.data.title || prevDetails?.title || bookFromState.title,
            authors: newAuthors, // Use the carefully determined authors array
            cover_url:
              bookFromState.cover_url ||
              (response.data.covers && response.data.covers.length > 0
                ? `https://covers.openlibrary.org/b/id/${response.data.covers[0]}-M.jpg`
                : "https://via.placeholder.com/150x200?text=No+Image"),
            description: getSafeDescription(response.data.description),
            sections: (prevDetails?.sections && prevDetails.sections.length > 0
              ? prevDetails.sections
              : bookFromState?.sections) || [{ title: "Chapter 1" }],
            audio_length:
              prevDetails?.audio_length || bookFromState?.audio_length || 1800,
            category:
              bookFromState?.category ||
              prevDetails?.category ||
              getCategoryName(bookFromState.id),
            subjects: response.data.subjects || prevDetails?.subjects || [],
          };
        });
      } catch (error) {
        console.error("Error fetching book details:", error);
        if (!bookDetails) setBookDetails(bookFromState);
      }
      setLoading(false);
    };

    fetchBookDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookFromState?.id]); // Simplified dependencies

  const toggleBookmark = () => {
    if (!bookDetails?.id) return; // Guard clause
    try {
      let updatedBookmarks;
      const bookmarkEntry = {
        id: bookDetails.id,
        title: bookDetails.title,
        authors:
          bookDetails.authors && bookDetails.authors.length > 0
            ? bookDetails.authors
            : ["Unknown"], // Simplified
        cover_url: bookDetails.cover_url,
        description: getSafeDescription(bookDetails.description),
        sections: bookDetails.sections,
        audio_length: bookDetails.audio_length,
        category: bookDetails.category,
      };

      if (isBookmarked) {
        updatedBookmarks = bookmark.filter(
          (item) => item.id !== bookDetails.id
        );
      } else {
        updatedBookmarks = [bookmarkEntry, ...bookmark];
      }
      setBookmark(updatedBookmarks);
      localStorage.setItem("bookmark", JSON.stringify(updatedBookmarks));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error updating bookmarks:", error);
    }
  };

  if (!bookDetails) {
    return <div className="loading">Loading book data...</div>;
  }

  return (
    <div className="container details-page">
      <nav className="nav">
        <MdChevronLeft size="2em" onClick={() => navigate(-1)} />
      </nav>
      {loading && !bookDetails.title ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="book-detail-layout">
            <div className="cover">
              <img
                src={bookDetails.cover_url}
                alt={bookDetails.title || "Book Cover"} // Use book title for alt text
                onError={(e) => {
                  // Correct way to type target in JS without TS syntax
                  const target = e.target;
                  target.onerror = null;
                  target.src =
                    "https://via.placeholder.com/150x200?text=No+Image";
                }}
              />
            </div>
            <div className="info">
              <h3>{bookDetails.title}</h3>
              <p>
                {bookDetails.authors && bookDetails.authors.length > 0
                  ? bookDetails.authors.join(", ")
                  : "Unknown Author"}
              </p>
              <div className="summary">
                <span>
                  <MdMenuBook style={{ marginRight: "5px" }} />
                  {bookDetails.sections ? bookDetails.sections.length : 0}{" "}
                  chapters
                </span>
                <span>
                  <MdSchedule style={{ marginRight: "5px" }} />
                  {minutes} min
                </span>
              </div>
              <button
                className={`bookmark-button ${
                  isBookmarked ? "bookmarked" : ""
                }`}
                onClick={toggleBookmark}
                disabled={!bookDetails.id} // Disable if no id
              >
                {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                {isBookmarked ? " Bookmarked" : " Bookmark"}
              </button>
            </div>
          </div>
          <div className="desc">
            <h3>Description</h3>
            <p>{getSafeDescription(bookDetails.description)}</p>
          </div>
          <div className="highlight">
            {bookDetails.subjects && bookDetails.subjects.length > 0 ? (
              <div className="subjects">
                <h4>Subjects</h4>
                <ul>
                  {bookDetails.subjects.slice(0, 8).map((subject, idx) => (
                    <li key={idx}>{subject}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <h3>What's inside</h3>
            {bookDetails.sections && bookDetails.sections.length > 0 ? (
              <ul>
                {bookDetails.sections.map((section, idx) => (
                  <li key={idx}>{section.title}</li>
                ))}
              </ul>
            ) : (
              <p>No chapters information available</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Details;
