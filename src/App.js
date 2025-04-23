import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import UsersList from './components/UsersList';
import Navbar from './components/NavBar';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <div className="App">
            <Navbar/>
            <div className="container">
              <Routes>
                <Route path="/" element={<UsersList />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/edit-user/:id" element={<EditUser />} />
              </Routes>
            </div>
          </div>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;