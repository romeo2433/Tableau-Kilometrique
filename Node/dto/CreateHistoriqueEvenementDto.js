class CreateHistoriqueEvenementDto {
  constructor({
    id_voiture,
    vitesse_initiale,
    vitesse_finale,
    acceleration,
    date_debut,
    date_fin,
  }) {
    this.id_voiture = id_voiture;
    this.vitesse_initiale = parseFloat(vitesse_initiale).toFixed(2);
    this.vitesse_finale = parseFloat(vitesse_finale).toFixed(2);
    this.acceleration = parseFloat(acceleration).toFixed(2);
    this.date_debut = new Date(date_debut);
    this.date_fin = new Date(date_fin);
  }
}

module.exports = CreateHistoriqueEvenementDto;
