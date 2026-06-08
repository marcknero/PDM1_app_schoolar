function roundToOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

function calculateGradeSituation(media) {
  return media >= 6 ? 'Aprovado' : 'Reprovado';
}

module.exports = {
  roundToOneDecimal,
  calculateGradeSituation,
};