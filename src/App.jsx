import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Opportunities from "./pages/opportunities";
import NGOs from "./pages/NGOs";
import Dashboard from "./pages/Dashboard";
import CreateOpportunity from "./pages/CreateOpportunity";
import OpportunityDetail from "./pages/OpportunityDetail";
import Messages from "./pages/Messages";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/NGOs" element={<NGOs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/create-opportunity/:id?" element={<CreateOpportunity />} />
        <Route path="/edit-opportunity/:id" element={<CreateOpportunity />} />
        <Route path="/messages" element={<Messages />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;