import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactSpeedometer from "react-d3-speedometer";
import "../styles/CarDashboard.css";
import { motion } from "framer-motion";
import axios from "axios";

const getFuelColor = (fuelLevel) => {
  if (fuelLevel > 70) return "fuel-green";
  if (fuelLevel > 40) return "fuel-yellow";
  return "fuel-red";
};

export default function CarDashboard() {
  const location = useLocation();
  const initialSpeed = location.state?.initialSpeed || 0;
  const { id } = useParams();

  const [car, setCar] = useState(null);
  const speedRef = useRef(initialSpeed);
  const [speed, setSpeed] = useState(initialSpeed);
  const [fuel, setFuel] = useState(100); // Niveau de carburant initial
  const [loading, setLoading] = useState(true);
  const [accelerationRate, setAccelerationRate] = useState(1);
  const [brakingRate, setBrakingRate] = useState(1);
  const intervalRef = useRef(null);
  const keyPressedRef = useRef({ accelerate: false, brake: false });
  const initialSpeedRef = useRef(null);
  const startTimeRef = useRef<Date | null>(null);

  // Utilisation de refs pour stocker les taux actuels
  const accelerationRateRef = useRef(accelerationRate);
  const brakingRateRef = useRef(brakingRate);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/voitures/${id}`
        );
        const data = response.data;

        setCar({
          nom: data.nom || "",
          jauge_max: Number(data.jauge_max) || 100,
          vitesse_max: Number(data.vitesse_max) || 100,
          acceleration: Number(data.acceleration?.valeur) || 0,
          consommation: Number(data.consommation?.consommation) || 0,
          freinage_max: Number(data.freinage_max) || 0,
        });

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        alert("Impossible de charger les données de la voiture.");
        setLoading(false);
      }
    };

    fetchCarData();
  }, [id]);

  const updateSpeed = () => {
    setSpeed(speedRef.current);
  };

  const frictionCoefficient = 0; // Coefficient de frottement (ajuste cette valeur à ta convenance)

  const applyFriction = () => {
    if (speedRef.current > 0) {
      // Applique le frottement en réduisant la vitesse chaque seconde
      speedRef.current = Math.max(
        speedRef.current - speedRef.current * frictionCoefficient,
        0
      );
      updateSpeed();
    }
  };

  const realIncrease = (acc) => {
    let realAcc = (acc * accelerationRateRef.current) / 3600;
    realAcc = realAcc * 0.1;
    console.log("Real increase : ", realAcc);
    return realAcc;
  };

  const realDecrease = (acc) => {
    let realDec = (acc * brakingRateRef.current) / 3600;
    realDec = realDec * 0.1;
    console.log("Real decrease : ", realDec);
    return realDec;
  };

  const startAcceleration = () => {
    if (fuel <= 0) {
      console.log("OUTTT OF HEERREEEE");
      return;
    }

    // Capture la vitesse initiale et la date de début
    if (!initialSpeedRef.current && !startTimeRef.current) {
      initialSpeedRef.current = speedRef.current; // Vitesse avant
      startTimeRef.current = new Date(); // Date actuelle au début
    }

    keyPressedRef.current.accelerate = true;

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (keyPressedRef.current.accelerate && fuel > 0) {
          speedRef.current = Math.min(
            speedRef.current + realIncrease(car.acceleration),
            car.vitesse_max
          );
          updateSpeed();
        } else {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setSpeed(0); // Réinitialiser la vitesse à 0 si le carburant est épuisé
        }
      }, 100);
    }
  };

  const startBraking = () => {
    if (!car || fuel <= 0) return;

    // Capture la vitesse initiale et la date de début
    if (!initialSpeedRef.current && !startTimeRef.current) {
      console.log("Enregistrement de l'info de freinage (début)");
      initialSpeedRef.current = speedRef.current; // Vitesse avant le freinage
      startTimeRef.current = new Date(); // Date actuelle au début du freinage
    }

    keyPressedRef.current.brake = true;
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (keyPressedRef.current.brake) {
          speedRef.current = Math.max(
            speedRef.current - realDecrease(car.freinage_max),
            0
          );
          updateSpeed();
        }
      }, 100);
    }
  };

  const stopAcceleration = () => {
    keyPressedRef.current.accelerate = false;
    if (!keyPressedRef.current.brake) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;

      // Enregistrement de l'événement dans l'historique après l'accélération
      if (initialSpeedRef.current !== null && startTimeRef.current !== null) {
        const event = {
          id_voiture: id,
          vitesse_initiale: initialSpeedRef.current,
          vitesse_finale: speedRef.current,
          acceleration: car.acceleration * accelerationRateRef.current,
          date_debut: startTimeRef.current,
          date_fin: new Date(),
        };

        axios
          .post("http://localhost:3000/api/historique-evenements", event)
          .then((response) => {
            console.log("Historique événement enregistré", response);
            initialSpeedRef.current = null;
            startTimeRef.current = null;
          })
          .catch((error) => {
            console.error(
              "Erreur lors de l'enregistrement de l'événement",
              error
            );
          });
      }
    }
  };

  const stopBraking = () => {
    keyPressedRef.current.brake = false;
    if (!keyPressedRef.current.accelerate) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;

      // Enregistrement de l'événement dans l'historique après le freinage
      if (initialSpeedRef.current !== null && startTimeRef.current !== null) {
        const event = {
          id_voiture: id,
          vitesse_initiale: initialSpeedRef.current,
          vitesse_finale: speedRef.current,
          acceleration: -car.freinage_max * accelerationRateRef.current,
          date_debut: startTimeRef.current,
          date_fin: new Date(),
        };

        axios
          .post("http://localhost:3000/api/historique-evenements", event)
          .then((response) => {
            console.log("Historique événement enregistré", response);

            // Réinitialisation des variables après l'enregistrement
            initialSpeedRef.current = null;
            startTimeRef.current = null;
          })
          .catch((error) => {
            console.error(
              "Erreur lors de l'enregistrement de l'événement",
              error
            );
          });
      } else {
        console.log("Initial speed or start time not set properly");
      }
    }
  };

  const roundTo = (value, precision) => {
    return Math.round(value * 10 ** precision) / 10 ** precision;
  };

  const realConsommation = () => {
    const percent = speedRef.current / car.vitesse_max;
    const fuelConsumedPerHour = percent * car.consommation;
    const consoPerSeconde = fuelConsumedPerHour / 3600;
    return consoPerSeconde;
  };

  const updateFuel = () => {
    if (!car) return;
    const percent = speedRef.current / car.vitesse_max;
    const fuelConsumed = (realConsommation() / car.jauge_max) * 100;
    console.log(
      "POURCENTAGE VITESSE : ",
      percent,
      " Consommer : ",
      fuelConsumed
    );
    setFuel((prevFuel) => {
      console.log(prevFuel);
      const newFuel = prevFuel - fuelConsumed;
      if (newFuel <= 0) {
        console.log("OUT OF FUELLL 2");
        // Réinitialiser la vitesse et arrêter toute accélération ou freinage
        setSpeed(0);
        keyPressedRef.current.accelerate = false;
        keyPressedRef.current.brake = false;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return Math.max(newFuel, 0); // Ne pas laisser le carburant descendre sous 0
    });
  };

  useEffect(() => {
    // Met à jour la ref chaque fois que l'état change
    accelerationRateRef.current = accelerationRate;
    brakingRateRef.current = brakingRate;
  }, [accelerationRate, brakingRate]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "KeyW" && !keyPressedRef.current.accelerate) {
        console.log(
          "KeyDown: ",
          event.code,
          " condition : ",
          keyPressedRef.current.accelerate
        );
        startAcceleration();
      } else if (event.code === "KeyS" && !keyPressedRef.current.brake) {
        console.log("KeyDown: ", event.code);
        startBraking();
      } else if (event.code === "ArrowUp") {
        // Flèche haut pour augmenter la vitesse (accélération)
        let currentRate = accelerationRateRef.current;
        currentRate = roundTo(currentRate + 0.1, 2); // Suppose une fonction qui retourne le taux actuel
        const newRate = Math.min(currentRate, 1); // Augmente jusqu'à 100% max
        setAccelerationRate(newRate);
        console.log("Vitesse augmentée à : ", newRate * 100);
      } else if (event.code === "ArrowDown") {
        // Flèche bas pour diminuer la vitesse (accélération)
        let currentRate = accelerationRateRef.current;
        currentRate = roundTo(currentRate - 0.1, 2);
        const newRate = Math.max(currentRate, 0); // Diminue jusqu'à 0%
        setAccelerationRate(newRate);
        console.log("Vitesse réduite à : ", newRate * 100);
      } else if (event.code === "ArrowLeft") {
        // Flèche gauche pour augmenter le freinage
        let currentRate = brakingRateRef.current;
        currentRate = roundTo(currentRate + 0.1, 2); // Suppose une fonction qui retourne le taux actuel
        const newRate = Math.min(currentRate, 1); // Augmente jusqu'à 100% max
        setBrakingRate(newRate);
        console.log("Freinage augmenté à : ", newRate * 100);
      } else if (event.code === "ArrowRight") {
        // Flèche droite pour diminuer le freinage
        let currentRate = Number(brakingRateRef.current);
        currentRate = roundTo(currentRate - 0.1, 2);
        const newRate = Math.max(currentRate, 0); // Diminue jusqu'à 0%
        setBrakingRate(newRate);
        console.log("Freinage réduit à : ", newRate * 100);
      } else if (
        event.code.startsWith("Numpad") &&
        event.key >= "0" &&
        event.key <= "9"
      ) {
        const percent = parseInt(event.key, 10);
        const rate = percent === 0 ? 1 : percent / 10;

        if (event.code === "Numpad1" || event.code === "Numpad2") {
          // Par exemple, NumPad 1 ajuste l'accélération
          setAccelerationRate(rate);
          console.log("Accélération ajustée avec Numpad : ", rate * 100);
        } else if (event.code === "Numpad3" || event.code === "Numpad4") {
          // NumPad 3 pour ajuster freinage
          setBrakingRate(rate);
          console.log("Freinage ajusté avec Numpad : ", rate * 100);
        }
      }
    };

    const handleKeyUp = (event) => {
      console.log("KeyUp: ", event.code);

      if (event.code === "KeyW") {
        stopAcceleration();
      } else if (event.code === "KeyS") {
        stopBraking();
      }
    };

    // Déclenchement de la mise à jour du carburant toutes les secondes
    const fuelInterval = setInterval(() => {
      updateFuel();
    }, 1000);

    const frictionInterval = setInterval(() => {
      applyFriction(); // Appliquer le frottement toutes les secondes
    }, 1000);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(fuelInterval); // Nettoyage de l'intervalle du carburant
      clearInterval(frictionInterval);
    };
  }, [car, fuel]);

  if (loading) {
    return <h2>Chargement des données de la voiture...</h2>;
  }

  return (
    <div className="car-dashboard">
      <h1>Tableau de Bord - {car.nom}</h1>
      <div className="dashboard-container">
        {car && (
          <div className="card speedometer-card">
            <ReactSpeedometer
              maxValue={car.vitesse_max}
              value={speed}
              needleColor="red"
              startColor="green"
              endColor="red"
              segments={10}
              textColor="white"
              width={400}
              height={250}
            />
          </div>
        )}

        <div className="card fuel-card">
          <motion.div
            className={`fuel-bar ${getFuelColor(fuel)}`}
            animate={{ height: `${fuel}%` }}
          />
          <div className="fuel-text">
            {fuel.toFixed(2)}% ({((fuel / 100) * car.jauge_max).toFixed(2)}L)
          </div>
        </div>
      </div>

      <p>📊 Accélération actuelle : {accelerationRate * 100}%</p>
      <p>🛑 Freinage actuel : {brakingRate * 100}%</p>
    </div>
  );
}
