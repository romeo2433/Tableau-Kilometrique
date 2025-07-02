import React, { useEffect, useState } from "react";
import "../styles/VoituresList.css"; // Garde le même fichier CSS pour les styles

export default function HistoriqueEvenementList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/historique-evenements") // Remplace par l'URL réelle de ton API
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des événements");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des événements...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="car-list-container">
      {" "}
      {/* Utilise la même classe CSS pour la structure */}
      <h2>Liste des Événements</h2>
      <table>
        <thead>
          <tr>
            <th>Vitesse Initiale (km/h)</th>
            <th>Vitesse Finale (km/h)</th>
            <th>Accélération (km/h²)</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Voiture</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.vitesse_initiale}</td>
              <td>{event.vitesse_finale}</td>
              <td>{event.acceleration}</td>
              <td>{new Date(event.date_debut).toLocaleString()}</td>
              <td>{new Date(event.date_fin).toLocaleString()}</td>
              <td>{event.voiture.nom}</td>{" "}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
