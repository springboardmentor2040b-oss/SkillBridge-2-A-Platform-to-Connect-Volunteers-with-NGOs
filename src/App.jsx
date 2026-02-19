import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Opportunities from "./pages/opportunities";
import NGOs from "./pages/NGOs";
<<<<<<< HEAD
import Dashboard from "./pages/Dashboard";
import CreateOpportunity from "./pages/CreateOpportunity";
=======
>>>>>>> 9287dd5fbe5c08fc137238a83f113cc88e69204d

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/NGOs" element={<NGOs />} />
<<<<<<< HEAD
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-opportunity" element={<CreateOpportunity />} />
=======
>>>>>>> 9287dd5fbe5c08fc137238a83f113cc88e69204d
      </Routes>
    </BrowserRouter>
  );
}

export default App;
