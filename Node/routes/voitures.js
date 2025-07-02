const express = require("express");
const router = express.Router();
const voituresController = require("../controllers/voituresController");

router.get("/", voituresController.getAllVoitures);
router.get("/:id", voituresController.getVoitureById);
router.post("/", voituresController.createVoiture);
router.put("/:id", voituresController.updateVoiture);
router.delete("/:id", voituresController.deleteVoiture);

module.exports = router;
