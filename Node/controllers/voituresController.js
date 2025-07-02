const Voiture = require("../models/Voitures");
const Acceleration = require("../models/Accelerations");
const Consommation = require("../models/Consommations");
const VoitureDto = require("../dto/VoitureDto");
const CreateVoitureDto = require("../dto/createVoitureDto");

// 🔹 GET all voitures
exports.getAllVoitures = async (req, res) => {
  try {
    // Récupérer toutes les voitures
    const voitures = await Voiture.findAll();

    // Formater les données avec VoitureDto et ajouter accélération et consommation
    const voituresDtos = await Promise.all(
      voitures.map(async (voiture) => {
        // Recherche de la dernière accélération pour chaque voiture
        const acceleration = await Acceleration.findOne({
          where: { id_voiture: voiture.id },
          order: [["date_enregistrement", "DESC"]],
        });

        // Recherche de la dernière consommation pour chaque voiture
        const consommation = await Consommation.findOne({
          where: { id_voiture: voiture.id },
        });

        // Formater avec VoitureDto
        return new VoitureDto(voiture, acceleration, consommation);
      })
    );

    // Retourner les voitures formatées
    res.status(200).json(voituresDtos);
  } catch (error) {
    res.status(400).json({
      error: error.message || "Erreur lors de la récupération des voitures.",
    });
  }
};

// 🔹 GET voiture by ID
exports.getVoitureById = async (req, res) => {
  const { id } = req.params;

  try {
    // Récupérer la voiture par son ID
    const voiture = await Voiture.findByPk(id);
    if (!voiture) {
      return res.status(404).json({ error: "Voiture non trouvée" });
    }

    // Recherche de la dernière accélération pour la voiture
    const acceleration = await Acceleration.findOne({
      where: { id_voiture: voiture.id },
      order: [["date_enregistrement", "DESC"]],
    });

    // Recherche de la dernière consommation pour la voiture
    const consommation = await Consommation.findOne({
      where: { id_voiture: voiture.id },
    });

    // Formater avec VoitureDto
    const voitureDto = new VoitureDto(voiture, acceleration, consommation);

    // Retourner la voiture formatée
    res.status(200).json(voitureDto);
  } catch (error) {
    res.status(400).json({
      error: error.message || "Erreur lors de la récupération de la voiture.",
    });
  }
};

// 🔹 CREATE voiture
exports.createVoiture = async (req, res) => {
  const transaction = await Voiture.sequelize.transaction(); // Démarrer une transaction
  try {
    const voitureData = new CreateVoitureDto(req.body);

    // 1️⃣ Création de la voiture
    const nouvelleVoiture = await Voiture.create(
      {
        nom: voitureData.nom,
        jauge_max: voitureData.jauge_max,
        vitesse_max: voitureData.vitesse_max,
        freinage_max: voitureData.freinage_max,
      },
      { transaction }
    );

    // 2️⃣ Création de l’accélération associée
    const nouvelleAcceleration = await Acceleration.create(
      {
        id_voiture: nouvelleVoiture.id,
        valeur: voitureData.acceleration.valeur,
      },
      { transaction }
    );

    // 3️⃣ Création de la consommation associée
    const nouvelleConsommation = await Consommation.create(
      {
        id_voiture: nouvelleVoiture.id,
        consommation: voitureData.consommation.consommation,
      },
      { transaction }
    );

    // Valider la transaction
    await transaction.commit();

    res
      .status(201)
      .json(
        new VoitureDto(
          nouvelleVoiture,
          nouvelleAcceleration,
          nouvelleConsommation
        )
      );
  } catch (error) {
    await transaction.rollback(); // Annuler si erreur
    res.status(400).json({
      error: error.message || "Erreur lors de la création de la voiture.",
    });
  }
};

// 🔹 UPDATE voiture
exports.updateVoiture = async (req, res) => {
  const transaction = await Voiture.sequelize.transaction();
  try {
    const { id } = req.params;
    const voitureData = new CreateVoitureDto(req.body);

    // 1️⃣ Mise à jour de la voiture
    const voiture = await Voiture.findByPk(id);
    if (!voiture) {
      throw new Error("Voiture non trouvée");
    }

    await voiture.update(
      {
        nom: voitureData.nom,
        jauge_max: voitureData.jauge_max,
        vitesse_max: voitureData.vitesse_max,
        freinage_max: voitureData.freinage_max,
      },
      { transaction }
    );

    // 2️⃣ Mise à jour de l’accélération
    const acceleration = await Acceleration.findOne({
      where: { id_voiture: id },
    });
    if (acceleration) {
      await acceleration.update(
        { valeur: voitureData.acceleration.valeur },
        { transaction }
      );
    }

    // 3️⃣ Mise à jour de la consommation
    const consommation = await Consommation.findOne({
      where: { id_voiture: id },
    });
    if (consommation) {
      await consommation.update(
        { consommation: voitureData.consommation.consommation },
        { transaction }
      );
    }

    await transaction.commit();
    res.status(200).json(new VoitureDto(voiture, acceleration, consommation));
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({
      error: error.message || "Erreur lors de la mise à jour de la voiture.",
    });
  }
};

// 🔹 DELETE voiture
exports.deleteVoiture = async (req, res) => {
  try {
    const voiture = await Voiture.findByPk(req.params.id);
    if (!voiture) {
      return res.status(404).json({ error: "Voiture non trouvée." });
    }
    await voiture.destroy();
    res.json({ message: "Voiture supprimée avec succès." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la voiture." });
  }
};
