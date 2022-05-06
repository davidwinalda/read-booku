import { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { MdChevronLeft } from "react-icons/md"

import { BookHighlight } from './components'

const Bookmarks = () => {
  let navigate = useNavigate()
  let [bookmark, setBookmark] = useState([])

  useEffect(() => {
    const bookmarksRetrieve = JSON.parse(localStorage.getItem('bookmark'));
    if (bookmarksRetrieve) {
      setBookmark(bookmarksRetrieve);
    }
  }, []);
  return (
    <div className="container">
      <MdChevronLeft size="2em" onClick={() => navigate(-1)} />
      {
        bookmark.length > 0 ? (
          <ul className="listBooks">
            {
              bookmark.map(book => (
                <li key={book.id}><Link to="/details" style={{ textDecoration: 'none', color: '#52565e' }} state={book}><BookHighlight src={book.cover_url} alt="books" title={book.title} authors={book.authors} description={book.description} widthCover="150" /></Link></li>
              ))
            }
          </ul>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Bookmark your favorite books<Link to="/"><span style={{ paddingLeft: '3px' }}>here</span></Link></div>
        )
      }

    </div>
  );
}

export default Bookmarks;