import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import IncomePage from './pages/IncomePage'
import ExpensePage from './pages/ExpensePage'





function App() {
  const cors = require('cors');





  return (
    <div>
<BrowserRouter>
<Routes>
<Route path='/' element={<Home/>} />
<Route path='/signup' element={<Signup/>}/>
<Route path='/dashboard' element={<Dashboard/>}/>
<Route path='/login' element={<Login/>}/>
<Route path="*" element={<Login />} /> {/* Fallback to Login */}
<Route path='/income' element={<IncomePage/>}/>
<Route path='/expense' element={<ExpensePage/>}/>



</Routes>
</BrowserRouter>



    </div>
  )
}

export default App