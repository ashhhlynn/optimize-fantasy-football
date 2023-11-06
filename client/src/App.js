import './App.css'
import 'semantic-ui-css/semantic.min.css'
import React, { useState, useEffect } from 'react'
import Head from './components/Head.js'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import ClassicHome from './components/classic/ClassicHome.js'
import CaptainHome from './components/captain/CaptainHome.js'

function App() {

  const [thursday, setThursday] = useState('')
  const [sunday, setSunday] = useState('')
  const [current, setCurrent] = useState('')

  useEffect(() => {
    getDates()
  }, )

  const getDates = () => {
    fetch("http://localhost:8000/dates")
    .then((res)=> res.json())
    .then(data => {
      setThursday(data.tr.substr(5,5))
      setSunday(data.sun.substr(5,5))
      setCurrent(data.current)
    })
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Head thursday={thursday} sunday={sunday} current={current}/>
        <Routes>
				  <Route exact path="/" element={<ClassicHome/> }/>
          <Route exact path="/captain" element={<CaptainHome/> }/>
        </Routes>
        <br></br><br></br>
      </div>
    </BrowserRouter>
  )
}

export default App