/**
 * Martin Chung, 000790207
 */
import './App.css';
import './custom.css';
import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import {Map} from './Map';
function App() {
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">FoodCity</Navbar.Brand>
      </Navbar>
      <div className="container">
        <h1>Browse Restaurants in Hamilton!</h1>
        <h3>Restaurant Type</h3>
        <p>Choose restaurant type to see restaurants on the map</p>
        <Map/>
      </div>
      
    </div>
    
  );
}

export default App;
