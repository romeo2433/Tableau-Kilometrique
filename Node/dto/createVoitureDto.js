const CreateAccelerationDto = require("./createAccelerationDto");
const CreateConsommationDto = require("./createConsommationDto");

class CreateVoitureDto {
  constructor({
    nom,
    jauge_max,
    freinage_max,
    vitesse_max,
    acceleration,
    consommation,
  }) {
    if (!nom || !jauge_max || !vitesse_max || !acceleration || !consommation) {
      throw new Error(
        "Tous les champs (nom, jauge_max, vitesse_max, acceleration, consommation) sont requis."
      );
    }

    this.nom = nom;
    this.jauge_max = parseFloat(jauge_max).toFixed(2);
    this.freinage_max = parseFloat(freinage_max).toFixed(2);
    this.vitesse_max = parseInt(vitesse_max, 10);
    this.acceleration = new CreateAccelerationDto({
      valeur: Number(acceleration),
    });
    this.consommation = new CreateConsommationDto({
      consommation: Number(consommation),
    });
  }
}

module.exports = CreateVoitureDto;
