import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Chat from "./components/Chat";

function App() {
  <meta name="viewport" content="initial-scale=1, width=device-width" />

  return (
    <Router>
    <div className="App">
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
