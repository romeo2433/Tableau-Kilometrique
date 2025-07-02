import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles/Main.css"; // Assure-toi d'avoir un fichier CSS pour les styles
import CarList from "./pages/VoituresList";
import AddCarForm from "./pages/AddVoiture";
import CarDashboard from "./pages/CardDashoard";
import HistoriqueEvenementList from "./pages/HistoriqueEvenementList";

export default function App() {
  return (
    <Router>
      <div className="main-container">
        <nav className="navbar">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/cars" className="nav-link">
                Liste des voitures
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/add-car" className="nav-link">
                Ajouter une voiture
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/historique" className="nav-link">
                Historique évenements
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/cars" element={<CarList />} />
          <Route path="/add-car" element={<AddCarForm />} />
          <Route path="/edit-car/:id" element={<AddCarForm />} />
          <Route path="/test-car/:id" element={<CarDashboard />} />
          <Route path="/historique" element={<HistoriqueEvenementList />} />
        </Routes>
      </div>
    </Router>
  );
}
