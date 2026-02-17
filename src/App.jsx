import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";      
import Login from "./pages/login";
import Register from "./pages/register";
import Opportunities from "./pages/opportunities";
import NGOs from "./pages/NGOs";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Register Page */}
        <Route path="/register" element={<Register />} />

        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/NGOs" element={<NGOs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
