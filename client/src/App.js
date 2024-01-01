import './App.css'
import 'semantic-ui-css/semantic.min.css'
import React, { useState, useEffect } from 'react'
import Head from './components/Head.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ClassicHome from './components/classic/ClassicHome.js'
import CaptainHome from './components/captain/CaptainHome.js'
import MondayCaptainHome from './components/captain/MondayCaptainHome.js'

function App() {

  const [thursday, setThursday] = useState('')
  const [sunday, setSunday] = useState('')

  const [sdTeams2, setSdTeams2] = useState('')
  const [sdDate2, setSdDate2] = useState('')
  const [sdDow2, setSdDow2] = useState('')


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

    fetch("https://optimize-daily.onrender.com/gameschedule")
    .then((res)=> res.json())
    .then(data => {
      setSdTeams2(data.sd2.name)
      let startDay = data.sd2.startTime.substr(0,10)
      let sddate = startDay.substr(5,5)
      setSdDate2(sddate)
      let d = new Date(startDay)
      let dow = d.getDay()
      const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
      setSdDow2(dayNames[dow])
    })
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Head sdDate2={sdDate2} sdDow2={sdDow2} sunday={sunday} thursday={thursday} />
        <Routes>
				  <Route exact path="/" element={<ClassicHome />}/>
          <Route exact path="/showdown1" element={<CaptainHome thursday={thursday} sdDate2={sdDate2} sdDow2={sdDow2} sdTeams2={sdTeams2} />}/>
          <Route exact path="/showdown2" element={<MondayCaptainHome thursday={thursday} sdDate2={sdDate2} sdDow2={sdDow2} sdTeams2={sdTeams2}/>}/>
        </Routes>
        <br></br><br></br>
      </div>
    </BrowserRouter>
  )
}

export default App