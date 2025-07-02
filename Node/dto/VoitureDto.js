class VoitureDto {
  constructor(voiture, acceleration, consommation) {
    this.id = voiture.id;
    this.nom = voiture.nom;
    this.jauge_max = voiture.jauge_max;
    this.vitesse_max = voiture.vitesse_max;
    this.freinage_max = voiture.freinage_max;
    this.acceleration = acceleration || null; // Dernière accélération enregistrée
    this.consommation = consommation || null; // Dernière consommation enregistrée
  }
}

module.exports = VoitureDto;
