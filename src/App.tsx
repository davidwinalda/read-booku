import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./Home";
import Books from "./Books";
import Details from "./Details";
import Bookmarks from "./Bookmarks";
import "./App.css";
import { Footer } from "./components";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="main-layout">
      {location.pathname !== "/details" && (
        <header className="app-header">
          <h1 className="app-title">Booku</h1>
        </header>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="details" element={<Details />} />
        <Route path="bookmarks" element={<Bookmarks />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
