import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Upload from './upload';
import News from './news';
import Preview from './preview';

function App() {
  return (
    <Router> {/* Wrap everything with the Router component */}
      <div>
        <header>
          <Navbar />
        </header>
          <Routes> 
            <Route path="/" element={<Upload />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/news" element={<News />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;

// npm install react-router-dom