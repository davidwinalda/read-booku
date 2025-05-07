import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaBookOpen,
  FaUserAstronaut,
  FaFlask,
  FaDragon,
  FaScroll,
  FaMagic,
  FaSkull,
  FaHatWizard,
  FaUserTie,
  FaMicrophone,
} from "react-icons/fa";

import "./home.css";
import { BookHighlight } from "./components";

interface BookType {
  id: string;
  title: string;
  authors: string[];
  cover_url: string;
  description: string;
  sections: { title: string }[];
  audio_length: number;
  category?: string;
}

const Home: React.FC = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<BookType[]>([]);

  useEffect(() => {
    try {
      const recentBooks = JSON.parse(
        localStorage.getItem("recentlyViewed") || "[]"
      );
      setRecentlyViewed(recentBooks.slice(0, 3)); // Show at most 3 recently viewed books
    } catch (error) {
      console.error("Error retrieving recently viewed books:", error);
    }
  }, []);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "fiction":
        return <FaBook />;
      case "science_fiction":
        return <FaUserAstronaut />;
      case "fantasy":
        return <FaDragon />;
      case "biographies":
        return <FaUserTie />;
      case "history":
        return <FaScroll />;
      case "mystery":
        return <FaMagic />;
      case "romance":
        return <FaBookOpen />;
      case "thriller":
        return <FaSkull />;
      case "horror":
        return <FaHatWizard />;
      case "poetry":
        return <FaMicrophone />;
      case "self-help":
        return <FaBook />;
      case "science":
        return <FaFlask />;
      default:
        return <FaBook />;
    }
  };

  // Utility to get category name from ID
  const getCategoryName = (id: string): string => {
    // Extract category from ID if possible
    let categoryId = id;
    if (typeof id === "string" && id.includes("/")) {
      const parts = id.split("/");
      categoryId = parts[parts.length - 1];
    }

    const categories: { [key: string]: string } = {
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

  // Predefined categories that match OpenLibrary subjects
  const categories = [
    { id: "fiction", name: "Fiction" },
    { id: "science_fiction", name: "Science Fiction" },
    { id: "fantasy", name: "Fantasy" },
    { id: "biographies", name: "Biographies" },
    { id: "history", name: "History" },
    { id: "mystery", name: "Mystery" },
    { id: "romance", name: "Romance" },
    { id: "thriller", name: "Thriller" },
    { id: "horror", name: "Horror" },
    { id: "poetry", name: "Poetry" },
    { id: "self-help", name: "Self Help" },
    { id: "science", name: "Science" },
  ];

  return (
    <div className="home-container container">
      <h1 className="home-title">Discover Your Next Book</h1>
      <p className="home-subtitle">
        Browse through our extensive collection of books across various genres
      </p>

      <div className="book-wrapper">
        <h3 className="categories-title">Explore Categories</h3>
        <ul className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/books?categoryId=${category.id}&size=10`}
              key={category.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <li className="book-lists">
                <div>
                  <div className="category-icon">
                    {getCategoryIcon(category.id)}
                  </div>
                  {category.name}
                </div>
              </li>
            </Link>
          ))}
        </ul>

        {recentlyViewed.length > 0 && (
          <div className="recently-viewed">
            <h3>Recently Viewed</h3>
            <ul className="listBooks">
              {recentlyViewed.map((book) => (
                <li key={book.id}>
                  <Link
                    to={`/details`}
                    state={book}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <BookHighlight
                      id={book.id}
                      src={book.cover_url}
                      alt={book.title || "Book Cover"}
                      title={book.title}
                      authors={book.authors || ["Unknown"]}
                      description={
                        typeof book.description === "string"
                          ? book.description
                          : "No description available"
                      }
                      category={book.category || getCategoryName(book.id)}
                      showDescription={true}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
