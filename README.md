# 🚗 Tableau Kilométrique - Suivi et Historique des Voitures

Ce projet est une application web de gestion du kilométrage, de la consommation de carburant et des accélérations/décélérations d'une voiture.  
Il permet l'ajout de véhicules, la modification de leur état (vitesse, carburant), et le suivi complet de leur historique de conduite.

---

## ⚙️ Technologies utilisées

- **Front-end** : [React.js](https://reactjs.org/)
- **Back-end** : [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- **Base de données** : [PostgreSQL](https://www.postgresql.org/)

---

## ✨ Fonctionnalités principales

- 🚘 **Insertion d’un véhicule**
- 🛣️ **Mise à jour du kilométrage**
- ⛽ **Calcul automatique du carburant consommé selon la distance**
- ⚡ **Gestion de l'accélération et décélération**
- 📜 **Historique des actions par véhicule (mouvement, consommation, etc.)**
- 🧾 **Visualisation des données sous forme de tableau**

---

## 📦 Installation du projet

### 1. Cloner le dépôt

```bash
git clone https://github.com/romeo2433/Tableau-Kilometrique.git
cd Tableau-Kilometrique
 cd backend
npm install
npm run dev
 cd ../frontend
npm install
npm start
  Tableau-Kilometrique/
├── backend/         # API Express + logique métier
├── frontend/        # Interface utilisateur React
└── README.md        # Ce fichier
