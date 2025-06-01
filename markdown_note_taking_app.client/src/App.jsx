import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage/SignUpPage.jsx';
import AuthGuard from './components/AuthGuard.jsx'

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/signup" element={ <SignUpPage /> } />

                <Route
                    path="/*"
                    element={
                        //{/*<AuthGuard>*/}
                            <MainPage />
                        //{/*</AuthGuard>*/}
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;