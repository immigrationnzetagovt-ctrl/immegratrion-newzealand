const countries = require("i18n-iso-countries");
const en = require("i18n-iso-countries/langs/en.json");

countries.registerLocale(en);

const countryList = Object.entries(
  countries.getNames("en", { select: "official" })
).map(([code, name]) => ({
  code,
  name,
}));

module.exports = countryList;