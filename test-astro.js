const { Body, EclipticLongitude } = require("astronomy-engine");
const date = new Date("1995-07-22T23:30:00Z");

try {
  console.log("Sun:", EclipticLongitude(Body.Sun, date));
} catch (e) {
  console.error("Error Sun:", e.message);
}

try {
  console.log("Moon:", EclipticLongitude(Body.Moon, date));
} catch (e) {
  console.error("Error Moon:", e.message);
}

