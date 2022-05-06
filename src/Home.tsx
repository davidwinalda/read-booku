import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './home.css'

const Home: React.FC = () => {
  const [category, setCategory] = useState<Array<{ id: number, name: string }>>([])

  useEffect(() => {
    axios.get("https://asia-southeast2-sejutacita-app.cloudfunctions.net/fee-assessment-categories")
      .then(res => {
        setCategory(res.data)
      })
  })
  return (
    <div>
      <h2>Booku</h2>
      {
        category ? (
          <ul className="book-wrapper">
            <h3>Explore Categories</h3>
            {
              category.map(listCategory => (
                <Link to={`/books?categoryId=${listCategory.id}&size=10`} key={listCategory.id} style={{ textDecoration: 'none', color: '#52565e' }}><li className="book-lists">{listCategory.name}</li></Link>
              ))
            }
          </ul>
        ) : (
          <div>Loading ...</div>
        )
      }
    </div>
  );
}

export default Home;
