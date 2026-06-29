import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import Sidebar from './Sidebar'; 
import Kassa from './components/Kassa';
import Ombor from './components/Ombor';
import Mijozlar from './components/Mijozlar';
import Analtika from './components/Analtika'; 
import CreateProducts from './components/CreateProducts';
import CubeBackground from './components/CubeBackground';

function App() {
  // Kassadan signal kelganda Mijozlardagi inputni uyg'otuvchi trigger
  const [triggerFocus, setTriggerFocus] = useState(false);

  return (
    <div className="main-app-layout" style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f6f9fc' }}>
      {/* 1. Chap tomondagi doimiy menyu */}
      <Sidebar />

      {/* 2. O'ng tomondagi dinamik kontent va aylanuvchi fon */}
      <div className="main-dynamic-content" style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <CubeBackground>
          
          <Routes>
            {/* Sayt ochilganda avtomatik /kassa linkiga o'tkazib yuboradi */}
            <Route path="/" element={<Navigate to="/kassa" />} />
            
            {/* Haqiqiy brauzer linklari (Triggerni prop sifatida uzatamiz) */}
            <Route path="/kassa" element={<Kassa setTriggerFocus={setTriggerFocus} />} />
            <Route path="/ombor" element={<Ombor />} />
            <Route path="/mijozlar" element={<Mijozlar triggerFocus={triggerFocus} setTriggerFocus={setTriggerFocus} />} />
            <Route path="/analtika" element={<Analtika />} />
            <Route path="/yangi-tovar" element={<CreateProducts />} />
          </Routes>

        </CubeBackground>
      </div>
    </div>
  );
}

export default App;