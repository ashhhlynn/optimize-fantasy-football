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

  const url = "https://optimize-daily.onrender.com";

  useEffect(() => {
    getDates()
  }, );

  const getDates = () => {
    fetch(`${url}/dates`)
    .then((res)=> res.json())
    .then(data => {
      setClDate(data.clDate)
      setSdTeams1(data.sdTeams1)
      setSdTeams2(data.sdTeams2)
      setSdDate1(data.sdDate1)
      setSdDate2(data.sdDate2)
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
          } />
          <Route exact path="/showdown2" element={
            <MondayCaptainHome 
              sdTeams1={sdTeams1} 
              sdDate1={sdDate1} 
              sdDate2={sdDate2} 
              sdTeams2={sdTeams2}
            />
          } />
        </Routes>
        <br/><br/>
      </div>
    </BrowserRouter>
  );
};

export default App;