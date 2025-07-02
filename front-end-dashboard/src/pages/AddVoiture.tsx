import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddVoiture.css"; // Garde le même fichier CSS
import axios from "axios";

export default function VoitureForm() {
  const { id } = useParams(); // Vérifie si on est en mode modification
  const navigate = useNavigate();
  const [car, setCar] = useState({
    nom: "",
    jauge_max: 100,
    vitesse_max: 0,
    acceleration: 0,
    consommation: 0,
    freinage_max: 0,
  });

  // Charger les données en mode modification
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/api/voitures/${id}`)
        .then((response) => {
          const data = response.data;

          setCar({
            nom: data.nom || "",
            jauge_max: data.jauge_max || 100,
            vitesse_max: data.vitesse_max || 0,
            acceleration: data.acceleration?.valeur || 0,
            consommation: data.consommation?.consommation || 0,
            freinage_max: data.freinage_max || 0,
          });
        })
        .catch((error) => {
          console.error("Erreur lors du chargement :", error);
          alert("Impossible de charger la voiture.");
          navigate("/");
        });
    }
  }, [id, navigate]);

  // Gestion des champs
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setCar((prevCar) => ({
      ...prevCar,
      [name]:
        type === "number" && value !== ""
          ? Math.max(0, parseFloat(value))
          : value,
    }));
  };

  // Ajouter ou modifier
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/voitures/${id}`, car);
        alert("Voiture modifiée avec succès !");
      } else {
        await axios.post("http://localhost:3000/api/voitures", car);
        alert("Voiture ajoutée avec succès !");
      }
      navigate("/cars");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur s'est produite.");
    }
  };

  // Supprimer une voiture
  const handleDelete = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer cette voiture ?")) {
      try {
        await axios.delete(`http://localhost:3000/api/voitures/${id}`);
        alert("Voiture supprimée !");
        navigate("/cars");
      } catch (error) {
        console.error("Erreur :", error);
        alert("Échec de la suppression.");
      }
    }
  };

  return (
    <div className="add-car-container">
      <h2>{id ? "Modifier" : "Ajouter"} une Voiture</h2>
      <form onSubmit={handleSubmit} className="add-car-form">
        <div>
          <label>Nom :</label>
          <input
            type="text"
            name="nom"
            value={car.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Jauge Max :</label>
          <input
            type="number"
            name="jauge_max"
            value={car.jauge_max}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Vitesse Max :</label>
          <input
            type="number"
            name="vitesse_max"
            value={car.vitesse_max}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Accélération :</label>
          <input
            type="number"
            name="acceleration"
            value={car.acceleration}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Consommation :</label>
          <input
            type="number"
            name="consommation"
            value={car.consommation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Freinage :</label>
          <input
            type="number"
            name="freinage_max"
            value={car.freinage_max}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{id ? "Modifier" : "Ajouter"}</button>
        {id && (
          <button type="button" className="delete-btn" onClick={handleDelete}>
            Supprimer
          </button>
        )}
      </form>
    </div>
  );
}
