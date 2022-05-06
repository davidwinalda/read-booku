import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useSearchParams, Link } from "react-router-dom";
import Fuse from 'fuse.js'

import { BookHighlight } from "./components";
import './books.css'

const Books = () => {
  const [search, setSearch] = useSearchParams();
  const [books, setBooks] = useState([]);
  const categoryId = search.get("categoryId");
  const size = search.get("size");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState()

  let idxLastBooks = currentPage * size
  let idxFirstBooks = idxLastBooks - size
  let currentBooks = books.slice(idxFirstBooks, idxLastBooks)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(books.length / size); i++) {
    pageNumbers.push(i)
  }

  useEffect(() => {
    getBooksbyCategory()
  }, [])

  const getBooksbyCategory = async () => {
    setLoading(true)
    const res = await axios.get(`https://asia-southeast2-sejutacita-app.cloudfunctions.net/fee-assessment-books?categoryId=${categoryId}`)
    let { data } = res
    setBooks(data)
    setLoading(false)
  }

  const handleSearch = (keyword) => {
    if (!keyword) {
      getBooksbyCategory()
      return;
    }

    const fuse = new Fuse(books, {
      keys: ['title', 'authors']
    })

    const result = fuse.search(keyword);
    const matches = [];
    if (!result.length) {
      setBooks([])
    } else {
      result.forEach(({ item }) => {
        matches.push(item);
      });
      setBooks(matches)
    }
  }
  return (
    <div className="container">
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search Books"
          onChange={(e) => {
            handleSearch(e.target.value);
            setCurrentPage(1);
          }} />
      </div>
      {
        loading ? (
          <div className="loading">Loading ...</div>
        ) : (
          <>
            <ul className="listBooks">
              {
                currentBooks.map(book => (
                  <li key={book.id}><Link to="/details" state={book} style={{ textDecoration: 'none', color: '#52565e' }}><BookHighlight src={book.cover_url} alt="books" title={book.title} authors={book.authors} description={book.description} widthCover="150" /></Link></li>
                ))
              }
            </ul>
            <div className="pagination-wrapper">
              <span onClick={() => setCurrentPage(currentPage - 1)}>Prev</span>
              {
                pageNumbers.map((pageNum, idx) => (
                  <span
                    className={pageNum === currentPage
                      ? "current-page"
                      : "not-current-page"} key={idx} onClick={() => setCurrentPage(pageNum)}>

                    {pageNum}

                  </span>

                ))
              }
              <span onClick={() => setCurrentPage(currentPage + 1)}>Next</span>
            </div>
          </>
        )
      }
    </div>
  );
}

export default Books;