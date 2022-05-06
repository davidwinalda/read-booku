import React from 'react';
import { Routes, Route } from "react-router-dom";

import Home from './Home';
import Books from './Books'
import Details from './Details'
import Bookmarks from './Bookmarks'
import './App.css';
import { Footer } from './components';

const App: React.FC = () => {
  return (
    <div className="main-layout">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="details" element={<Details />} />
        <Route path="bookmarks" element={<Bookmarks />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
