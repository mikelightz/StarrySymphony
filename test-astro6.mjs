import { Body, GeoVector, Ecliptic } from "astronomy-engine";
const date = new Date("1995-07-22T23:30:00Z");

const vec = GeoVector(Body.Moon, date, true);
const ecl = Ecliptic(vec);
console.log("Moon Geocentric Apparent Ecliptic of Date:");
console.log("Lon:", ecl.elon, "Lat:", ecl.elat);

const vecSun = GeoVector(Body.Sun, date, true);
const eclSun = Ecliptic(vecSun);
console.log("Sun Geocentric Apparent Ecliptic of Date:");
console.log("Lon:", eclSun.elon, "Lat:", eclSun.elat);
