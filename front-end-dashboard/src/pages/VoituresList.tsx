import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/VoituresList.css";

export default function VoituresList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/voitures") // Remplace par l'URL réelle de ton API
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des voitures");
        }
        return response.json();
      })
      .then((data) => {
        setCars(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleTestCar = (car) => {
    const inputSpeed = prompt(
      `Entrez la vitesse initiale (max: ${car.vitesse_max} km/h) :`,
      "0"
    );

    if (inputSpeed === null) return; // L'utilisateur a annulé
    const speedValue = Number(inputSpeed);

    if (isNaN(speedValue) || speedValue < 0 || speedValue > car.vitesse_max) {
      alert(`Veuillez entrer une vitesse entre 0 et ${car.vitesse_max} km/h.`);
      return;
    }

    navigate(`/test-car/${car.id}`, { state: { initialSpeed: speedValue } });
  };

  if (loading) return <p>Chargement des voitures...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="car-list-container">
      <h2>Liste des Voitures</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Vitesse Max (km/h)</th>
            <th>Accélération (km/h)</th>
            <th>Jauge Max (L)</th>
            <th>Consommation (L/VMax)</th>
            <th>Freinage (km/h)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.nom}</td>
              <td>{car.vitesse_max}</td>
              <td>{car.acceleration.valeur}</td>
              <td>{car.jauge_max} L</td>
              <td>{car.consommation.consommation}</td>
              <td>{car.freinage_max}</td>
              <td>
                <Link to={`/edit-car/${car.id}`} className="edit-btn">
                  Modifier
                </Link>
                <button onClick={() => handleTestCar(car)} className="test-btn">
                  Tester
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
