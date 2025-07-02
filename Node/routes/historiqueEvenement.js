const express = require("express");
const router = express.Router();
const historiqueEvenementsController = require("../controllers/historiqueEvenementController");

// Routes pour les événements
router.get("/", historiqueEvenementsController.getAllHistoriqueEvenements);
router.get("/:id", historiqueEvenementsController.getHistoriqueEvenementById);
router.post("/", historiqueEvenementsController.createHistoriqueEvenement);
router.put("/:id", historiqueEvenementsController.updateHistoriqueEvenement);
router.delete("/:id", historiqueEvenementsController.deleteHistoriqueEvenement);

module.exports = router;
