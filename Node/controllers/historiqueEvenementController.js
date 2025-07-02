const HistoriqueEvenements = require("../models/HistoriqueEvenements");
const Voitures = require("../models/Voitures");
const CreateHistoriqueEvenementDto = require("../dto/CreateHistoriqueEvenementDto");
const HistoriqueEvenementDto = require("../dto/HistoriqueEvenementDto");

// 🔹 GET all historiques d'événements avec DTO (sans `include`)
exports.getAllHistoriqueEvenements = async (req, res) => {
  try {
    // Récupérer tous les événements
    const evenements = await HistoriqueEvenements.findAll();

    // Mapper les événements en utilisant HistoriqueEvenementDto
    const evenementsDtos = await Promise.all(
      evenements.map(async (event) => {
        // Recherche de la voiture associée pour chaque événement
        const voiture = await Voitures.findByPk(event.id_voiture);
        if (!voiture) {
          throw new Error(`Voiture non trouvée pour l'événement ${event.id}`);
        }

        // Formater l'événement avec le DTO, en incluant la voiture
        return new HistoriqueEvenementDto({
          ...event.toJSON(), // Convertir l'événement en objet JSON
          Voiture: voiture, // Ajouter la voiture associée
        });
      })
    );

    // Retourner les événements formatés
    res.status(200).json(evenementsDtos);
  } catch (error) {
    res.status(400).json({
      error: error.message || "Erreur lors de la récupération des événements.",
    });
  }
};

// 🔹 GET un événement par ID avec DTO (sans `include`)
exports.getHistoriqueEvenementById = async (req, res) => {
  try {
    // Récupérer l'événement par son ID
    const evenement = await HistoriqueEvenements.findByPk(req.params.id);
    if (!evenement) {
      return res.status(404).json({ error: "Événement non trouvé" });
    }

    // Recherche de la voiture associée pour cet événement
    const voiture = await Voitures.findByPk(evenement.id_voiture);
    if (!voiture) {
      return res
        .status(404)
        .json({ error: "Voiture non trouvée pour cet événement" });
    }

    // Formater l'événement avec le DTO, en incluant la voiture
    const evenementDto = new HistoriqueEvenementDto({
      ...evenement.toJSON(), // Convertir l'événement en objet JSON
      Voiture: voiture, // Ajouter la voiture associée
    });

    // Retourner l'événement formaté
    res.status(200).json(evenementDto);
  } catch (error) {
    res.status(400).json({
      error: error.message || "Erreur lors de la récupération de l'événement.",
    });
  }
};

// 🔹 CREATE un événement
exports.createHistoriqueEvenement = async (req, res) => {
  const transaction = await HistoriqueEvenements.sequelize.transaction();
  try {
    const evenementData = new CreateHistoriqueEvenementDto(req.body);

    // 1️⃣ Création de l'événement
    const nouvelEvenement = await HistoriqueEvenements.create(
      {
        id_voiture: evenementData.id_voiture,
        vitesse_initiale: evenementData.vitesse_initiale,
        vitesse_finale: evenementData.vitesse_finale,
        acceleration: evenementData.acceleration,
        date_debut: evenementData.date_debut,
        date_fin: evenementData.date_fin,
      },
      { transaction }
    );

    // Valider la transaction
    await transaction.commit();

    res.status(201).json(nouvelEvenement);
  } catch (error) {
    await transaction.rollback(); // Annuler si erreur
    res.status(400).json({
      error: error.message || "Erreur lors de la création de l'événement.",
    });
  }
};

// 🔹 UPDATE un événement
exports.updateHistoriqueEvenement = async (req, res) => {
  const transaction = await HistoriqueEvenements.sequelize.transaction();
  try {
    const { id } = req.params;
    const evenementData = new CreateHistoriqueEvenementDto(req.body);

    // 1️⃣ Mise à jour de l'événement
    const evenement = await HistoriqueEvenements.findByPk(id);
    if (!evenement) {
      throw new Error("Événement non trouvé");
    }

    await evenement.update(
      {
        vitesse_initiale: evenementData.vitesse_initiale,
        vitesse_finale: evenementData.vitesse_finale,
        acceleration: evenementData.acceleration,
        date_debut: evenementData.date_debut,
        date_fin: evenementData.date_fin,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(200).json(evenement);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({
      error: error.message || "Erreur lors de la mise à jour de l'événement.",
    });
  }
};

// 🔹 DELETE un événement
exports.deleteHistoriqueEvenement = async (req, res) => {
  try {
    const evenement = await HistoriqueEvenements.findByPk(req.params.id);
    if (!evenement) {
      return res.status(404).json({ error: "Événement non trouvé." });
    }
    await evenement.destroy();
    res.json({ message: "Événement supprimé avec succès." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'événement." });
  }
};
