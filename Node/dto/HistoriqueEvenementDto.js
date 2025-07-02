const VoitureDTO = require("./VoitureDto");

class HistoriqueEvenementDto {
  constructor(event) {
    this.id = event.id;
    this.vitesse_initiale = event.vitesse_initiale;
    this.vitesse_finale = event.vitesse_finale;
    this.acceleration = event.acceleration;
    this.date_debut = event.date_debut;
    this.date_fin = event.date_fin;
    this.voiture = new VoitureDTO(event.Voiture); // Association avec VoitureDTO
  }
}

module.exports = HistoriqueEvenementDto;
