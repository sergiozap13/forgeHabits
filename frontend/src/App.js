import './App.css';
import React from 'react';
import HomePage from './pages/HomePage';
import HeaderComponent from './components/HeaderComponent';

function App() {
  return (
    <>
    <HeaderComponent/>
    <div className="App">
      <HomePage/>
    </div>
    </>
  );
}

export default App;
