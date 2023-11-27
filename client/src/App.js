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

  useEffect(() => {
    getDates()
  }, )

  const getDates = () => {
    const current = Math.ceil((new Date() - new Date("2023-09-04"))/604800000)
    let sundayDate = new Date("2023-09-05")
    sundayDate.setDate(sundayDate.getDate() + (current-1)*7 + 5)
    let sun = String(sundayDate.getMonth() + 1).padStart(2, '0') + '-' + String(sundayDate.getDate() + 1).padStart(2, '0')
    setSunday(sun)
    let thursdayDate = new Date("2023-09-05")
    thursdayDate.setDate(thursdayDate.getDate() + (current-1)*7 + 2)
    let tr = String(thursdayDate.getMonth() + 1).padStart(2, '0') + '-' + String(thursdayDate.getDate() + 1).padStart(2, '0')
    setThursday(tr)
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Head sunday={sunday} thursday={thursday}/>
        <Routes>
				  <Route exact path="/" element={<ClassicHome/> }/>
          <Route exact path="/trcaptain" element={<CaptainHome/> }/>
        </Routes>
        <br></br><br></br>
      </div>
    </BrowserRouter>
  )
}

export default App