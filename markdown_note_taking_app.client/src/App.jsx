import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage.jsx';

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/*" element={<MainPage /> } />
            </Routes>
        </Router>
    );
}

export default App;