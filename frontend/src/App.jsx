import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AdmitPatient from './pages/AdmitPatient';
import PatientList from './pages/PatientList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admit" element={<AdmitPatient />} />
            <Route path="/patients" element={<PatientList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;