import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import FetchData from './components/RoomList';
import Header from './components/Header';
import Home from './components/Home';
import RoomDetail from './components/RoomDetail';
import Login from './components/Login';

function App() {
  return (
    <Router>
    <div className="App">
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<RoomDetail />} />
          <Route path="/room/login/:id" element={<Login />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
