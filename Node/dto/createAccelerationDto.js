class CreateAccelerationDto {
  constructor({ valeur }) {
    if (!valeur) {
      throw new Error("La valeur de l'accélération est requise.");
    }
    this.valeur = parseFloat(valeur).toFixed(2);
    this.date_enregistrement = new Date(); // Ajout automatique de la date
  }
}

module.exports = CreateAccelerationDto;
