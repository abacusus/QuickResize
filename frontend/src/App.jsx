import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import Navbar from './components/Navbar'
import FormCards from './components/FormCards'
import Resizes from './components/Resizes'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FormCards />} />
        <Route path="/resize/:formId" element={<Resizes />} />
      </Routes>
    </Router>
  );
};

export default App