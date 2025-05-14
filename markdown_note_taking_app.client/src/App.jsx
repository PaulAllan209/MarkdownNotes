import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage /> } />
                
                <Route path="/*" element={<MainPage /> } />
            </Routes>
        </Router>
    );
}

export default App;