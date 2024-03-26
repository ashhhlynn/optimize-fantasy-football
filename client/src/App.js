import './App.css'
import 'semantic-ui-css/semantic.min.css'
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Head from './components/Head.js'
import ClassicHome from './components/classic/ClassicHome.js'
import CaptainHome from './components/captain/CaptainHome.js'
import MondayCaptainHome from './components/captain/MondayCaptainHome.js'

function App() {

  const [clDate, setClDate] = useState('')
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
    fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98582/draftables')
    .then(response => response.json())
    .then(data => {
        let cl = data.draftables[0].competition
        let cldate = cl.startTime.substr(5,5)
        setClDate(cldate)
        fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98585/draftables')
        .then(response => response.json())
        .then(data2 => {
            let sd2 = data2.draftables[0].competition
            setSdTeams2(sd2.name)
            let startDay2 = sd2.startTime.substr(0,10)
            let sddate2 = startDay2.substr(5,5)
            setSdDate2(sddate2)
            let d2 = new Date(startDay2)
            let dow2 = String(d2.getDay())
            fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98584/draftables')
            .then(response => response.json())
            .then(data1 => {
                let sd1 = data1.draftables[0].competition
                setSdTeams1(sd1.name)
                let startDay1 = sd1.startTime.substr(0,10)
                let sddate1 = startDay1.substr(5,5)
                setSdDate1(sddate1)
                let d1 = new Date(startDay1)
                let dow1 = String(d1.getDay())
                const dayNames = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
                setSdDow1(dayNames[dow1])
                setSdDow2(dayNames[dow2])
            })
        })
    })
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Head sdDate2={sdDate2} sdDow2={sdDow2} sdDate1={sdDate1} sdDow1={sdDow1} clDate={clDate} />
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