import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import Navbar from './components/Navbar'
import FormCards from './components/FormCards'
import Resizes from './components/Resizes'
import Footer from './components/Footer';
import Banner from './components/Banner';
import About from './components/About';
import Missing from './components/Missing';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FormCards />} />
        <Route path="/resize/:formId" element={<Resizes />} />
        <Route path='/about' element={<About/>} />
      </Routes>
      <Missing/>
      <Footer/>
      <Banner/>
    </Router>
  );
};

export default App