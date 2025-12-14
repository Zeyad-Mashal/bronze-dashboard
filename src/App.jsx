import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Blogs from "./components/Blogs/Blogs";
import Service from "./components/Service/Service";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/service" element={<Service />} />
      </Routes>
    </Router>
  );
}

export default App;
