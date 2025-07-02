class CreateConsommationDto {
  constructor({ consommation }) {
    if (!consommation) {
      throw new Error("La valeur de la consommation est requise.");
    }
    this.consommation = parseFloat(consommation).toFixed(2);
  }
}

module.exports = CreateConsommationDto;
