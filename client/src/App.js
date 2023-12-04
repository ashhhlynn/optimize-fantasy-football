import './App.css'
import 'semantic-ui-css/semantic.min.css'
import React, { useState, useEffect } from 'react'
import Head from './components/Head.js'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import ClassicHome from './components/classic/ClassicHome.js'
import CaptainHome from './components/captain/CaptainHome.js'
import MondayCaptainHome from './components/captain/MondayCaptainHome.js'

function App() {

  const [thursday, setThursday] = useState('')
  const [sunday, setSunday] = useState('')
  const [monday, setMonday] = useState('')

  useEffect(() => {
    getDates()
  }, )

  const getDates = () => {
    const current = Math.ceil((new Date() - new Date("2023-09-05"))/604800000)
    let sundayDate = new Date("2023-09-05")
    sundayDate.setDate(sundayDate.getDate() + (current-1)*7 + 5)
    let sun = String(sundayDate.getMonth() + 1).padStart(2, '0') + '-' + String(sundayDate.getDate() + 1).padStart(2, '0')
    setSunday(sun)
    let thursdayDate = new Date("2023-09-05")
    thursdayDate.setDate(thursdayDate.getDate() + (current-1)*7 + 2)
    let tr = String(thursdayDate.getMonth() + 1).padStart(2, '0') + '-' + String(thursdayDate.getDate() + 1).padStart(2, '0')
    setThursday(tr)
    let mondayDate = new Date("2023-09-05")
    mondayDate.setDate(mondayDate.getDate() + (current-1)*7 + 6)
    let mon = String(mondayDate.getMonth() + 1).padStart(2, '0') + '-' + String(mondayDate.getDate() + 1).padStart(2, '0')
    setMonday(mon)
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Head sunday={sunday} thursday={thursday} monday={monday} />
        <Routes>
				  <Route exact path="/" element={<ClassicHome/>}/>
          <Route exact path="/trcaptain" element={<CaptainHome/>}/>
          <Route exact path="/moncaptain" element={<MondayCaptainHome/>}/>
        </Routes>
        <br></br><br></br>
      </div>
    </BrowserRouter>
  )
}

export default App