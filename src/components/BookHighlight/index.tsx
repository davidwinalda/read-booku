import React from "react";
import { FaUser } from "react-icons/fa";

interface Props {
  id?: number | string;
  src: string;
  alt: string;
  title: string;
  authors: string[];
  description: string;
  // widthCover is no longer used directly here, sizing is handled by CSS
  category?: string;
  showDescription?: boolean;
}

const BookHighlight: React.FC<Props> = ({
  src,
  alt,
  title,
  authors,
  description,
  category,
  showDescription = true,
}) => {
  return (
    <div className="book-card">
      {" "}
      {/* Main container for card layout */}
      {category && <div className="category-badge">{category}</div>}
      <img
        src={src}
        alt={alt}
        className="book-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "https://via.placeholder.com/80x120?text=No+Image"; // Placeholder matching new size
        }}
      />
      <div className="book-info">
        {" "}
        {/* Wrapper for text content */}
        <h3 className="book-title">{title}</h3>
        <div className="book-author">
          <FaUser size={12} /> {/* Icon directly inside, CSS handles margin */}
          {authors && authors.length > 0 ? (
            authors.map((author, idx) => (
              <span key={idx}>
                {author}
                {idx < authors.length - 1 ? ", " : ""}
              </span>
            ))
          ) : (
            <span>Unknown Author</span>
          )}
        </div>
        {showDescription && (
          <p className="book-description">
            {description && description.length > 0
              ? description
              : "No description available for this book."}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookHighlight;
