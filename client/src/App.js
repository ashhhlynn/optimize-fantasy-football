import './App.css';
import 'semantic-ui-css/semantic.min.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Head from './components/Head.js';
import ClassicHome from './components/classic/ClassicHome.js';
import CaptainHome from './components/captain/CaptainHome.js';
import MondayCaptainHome from './components/captain/MondayCaptainHome.js';

function App() {

  const [clDate, setClDate] = useState('');
  const [sdTeams1, setSdTeams1] = useState('');
  const [sdDate1, setSdDate1] = useState('');
  const [sdTeams2, setSdTeams2] = useState('');
  const [sdDate2, setSdDate2] = useState('');

  useEffect(() => {
    getDates()
  }, );

  const getDates = () => {
    fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98582/draftables')
    .then(response => response.json())
    .then(data => {
      setClDate(data.draftables[0].competition.startTime.substr(5,5))
      fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98585/draftables')
      .then(response => response.json())
      .then(data2 => {
        setSdTeams2(data2.draftables[0].competition.name)            
        fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98584/draftables')
        .then(response => response.json())
        .then(data1 => {
          setSdTeams1(data1.draftables[0].competition.name)
          let d1 = new Date(data1.draftables[0].competition.startTime.substr(0,10))
          let dow1 = d1.getDay()
          let d2 = new Date(data2.draftables[0].competition.startTime.substr(0,10))
          let dow2 = d2.getDay()
          const dayNames = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
          setSdDate1(dayNames[dow1] + ' ' + data1.draftables[0].competition.startTime.substr(5,5))   
          setSdDate2(dayNames[dow2] + ' ' + data2.draftables[0].competition.startTime.substr(5,5))
        })
      })
    })
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Head 
          sdDate2={sdDate2} 
          sdDate1={sdDate1} 
          clDate={clDate} 
        />
        <Routes>
          <Route exact path="/" element={<ClassicHome />}/>
          <Route exact path="/showdown1" element={
            <CaptainHome 
              sdTeams1={sdTeams1} 
              sdDate1={sdDate1} 
              sdDate2={sdDate2} 
              sdTeams2={sdTeams2} 
            />
          }/>
          <Route exact path="/showdown2" element={
            <MondayCaptainHome 
              sdTeams1={sdTeams1} 
              sdDate1={sdDate1} 
              sdDate2={sdDate2} 
              sdTeams2={sdTeams2}
            />
          }/>
        </Routes>
        <br/><br/>
      </div>
    </BrowserRouter>
  );
};

export default App;