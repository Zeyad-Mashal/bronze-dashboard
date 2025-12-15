import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Reservations from "./components/Reservations/Reservations";
import Blogs from "./components/Blogs/Blogs";
import Service from "./components/Service/Service";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Reservations />} />
        <Route path="/service" element={<Service />} />
        <Route path="/blogs" element={<Blogs />} />
      </Routes>
    </Router>
  );
}

export default App;
