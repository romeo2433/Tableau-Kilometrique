-- Table des voitures
CREATE TABLE voitures (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    jauge_max DECIMAL(5,2) NOT NULL, -- Capacité maximale de la jauge de carburant
    vitesse_max INT NOT NULL,         -- Vitesse maximale de la voiture (km/h)
    freinage_max DECIMAL(5,2) NOT NULL
);

-- Table des accélérations par voiture
CREATE TABLE accelerations (
    id SERIAL PRIMARY KEY,
    id_voiture INT REFERENCES voitures(id) ON DELETE CASCADE,
    valeur DECIMAL(5,2) NOT NULL, -- Valeur de l’accélération en m/s²
    date_enregistrement TIMESTAMP DEFAULT NOW()
);

-- Table de la consommation par accélération
CREATE TABLE consommations (
    id SERIAL PRIMARY KEY,
    id_voiture INT REFERENCES voitures(id) ON DELETE CASCADE,
    id_acceleration INT REFERENCES accelerations(id) ON DELETE CASCADE,
    consommation DECIMAL(6,3) NOT NULL -- Consommation en L/100km
);

-- Table de l'historique des événements
CREATE TABLE historique_evenements (
    id SERIAL PRIMARY KEY,
    id_voiture INT REFERENCES voitures(id) ON DELETE CASCADE,
    vitesse_initiale INT NOT NULL,
    vitesse_finale INT NOT NULL,
    acceleration DECIMAL(5,2) NOT NULL, -- Accélération durant l’événement
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP NOT NULL
);
