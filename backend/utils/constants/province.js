const provinces = {
  "AB": "Alberta",
  "BC": "British Columbia",
  "MB": "Manitoba",
  "NB": "New Brunswick",
  "NL": "Newfoundland and Labrador",
  "NS": "Nova Scotia",
  "ON": "Ontario",
  "PE": "Prince Edward Island",
  "QC": "Quebec",
  "SK": "Saskatchewan"
};

const territories = {
  "NT": "Northwest Territories",
  "NU": "Nunavut",
  "YT": "Yukon"
}

module.exports = {
  provinceShort2Long: Object.assign({}, provinces, territories),
}
