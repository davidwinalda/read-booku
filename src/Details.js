import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { MdBookmarks, MdChevronLeft } from "react-icons/md"

import './detail.css';

const Details = () => {
  let location = useLocation()
  let navigate = useNavigate();

  let book = location.state
  let [bookmark, setBookmark] = useState([])

  const minutes = Math.floor(book.audio_length / 60);

  useEffect(() => {
    const bookmarksRetrieve = JSON.parse(localStorage.getItem('bookmark'));
    if (bookmarksRetrieve) {
      setBookmark(bookmarksRetrieve);
    }
  }, []);

  useEffect(() => {
    if (bookmark?.length) {
      localStorage.setItem('bookmark', JSON.stringify(bookmark));
    }
  }, [bookmark])

  const handleBookmarks = (e) => {
    e.preventDefault()
    if (window.confirm("Do you really want to bookmark this book?")) {
      alert("Bookmark book successful")
    }
    setBookmark([book, ...bookmark])
  }

  return (
    <div className="container">
      <nav className="nav">
        <MdChevronLeft size="2em" onClick={() => navigate(-1)} />
        <MdBookmarks size="2em" onClick={handleBookmarks} className="bookmark" />
      </nav>
      <div className="cover">
        <img src={book.cover_url} alt="Books Cover" width="150" />
      </div>
      <div className="info">
        <h3>{book.title}</h3>
        <p>{book.authors[0]}</p>
        <div className="summary">
          <span>{book.sections.length} chapters</span>
          <span>{minutes} min</span>
        </div>
      </div>
      <div className="desc">
        <h3>Description</h3>
        <p>{book.description}</p>
      </div>
      <div className="highlight">
        <h3>Whats inside</h3>
        <ul>
          {
            book.sections.map((section, idx) => (
              <li key={idx}>{section.title}</li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default Details;