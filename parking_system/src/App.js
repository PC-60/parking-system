import React from 'react'
import './App.css';
import Login from './components/Login';
import { useState } from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Signup from './components/Signup';
import Home from './components/Home';
import Slots from './components/Slots';
import Confirmed from './components/Confirmed';
import Admin from './components/Admin';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/Admin' element={<Admin/>}></Route>
        {isAuthenticated ? (
          <Route path='/Home' element={<Home />} />
        ) : (
          <Route path='/Home' element={<div>Not Authorized</div>} />
        )}
        <Route path='/Home/Slots' element={<Slots />} />
        <Route path='/Home/Slots/Confirmation' element={<Confirmed />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
