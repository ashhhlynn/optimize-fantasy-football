import './App.css'
import 'semantic-ui-css/semantic.min.css'
import React, { useState, useEffect } from 'react'
import Head from './components/Head.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ClassicHome from './components/classic/ClassicHome.js'
import CaptainHome from './components/captain/CaptainHome.js'
import MondayCaptainHome from './components/captain/MondayCaptainHome.js'

function App() {

  const [sunday, setSunday] = useState('')

  const [sdTeams1, setSdTeams1] = useState('')
  const [sdDate1, setSdDate1] = useState('')
  const [sdDow1, setSdDow1] = useState('')
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

    fetch("https://optimize-daily.onrender.com/gameschedule")
    .then((res)=> res.json())
    .then(data => {
      setSdTeams1(data.sd1.name)
      setSdTeams2(data.sd2.name)
      let startDay1 = data.sd1.startTime.substr(0,10)
      let sddate1 = startDay1.substr(5,5)
      setSdDate1(sddate1)
      let d1 = new Date(startDay1)
      let dow1 = String(d1.getDay())
      let startDay2 = data.sd2.startTime.substr(0,10)
      let sddate2 = startDay2.substr(5,5)
      setSdDate2(sddate2)
      let d2 = new Date(startDay2)
      let dow2 = String(d2.getDay())
      const dayNames = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
      setSdDow1(dayNames[dow1])
      setSdDow2(dayNames[dow2])
    })
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Head sdDate2={sdDate2} sdDow2={sdDow2} sdDate1={sdDate1} sdDow1={sdDow1} sunday={sunday} />
        <Routes>
				  <Route exact path="/" element={<ClassicHome />}/>
          <Route exact path="/showdown1" element={<CaptainHome sdTeams1={sdTeams1} sdDate1={sdDate1} sdDow1={sdDow1} sdDate2={sdDate2} sdDow2={sdDow2} sdTeams2={sdTeams2} />}/>
          <Route exact path="/showdown2" element={<MondayCaptainHome sdTeams1={sdTeams1} sdDate1={sdDate1} sdDow1={sdDow1} sdDate2={sdDate2} sdDow2={sdDow2} sdTeams2={sdTeams2}/>}/>
        </Routes>
        <br></br><br></br>
      </div>
    </BrowserRouter>
  )
}

export default App