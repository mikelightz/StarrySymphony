import { Body, Observer, Equator } from "astronomy-engine";
const date = new Date("1995-07-22T23:30:00Z");
const observer = new Observer(36.8354, -76.2983, 0);

// Topocentric
let eq1 = Equator(Body.Moon, date, observer, true, true);
console.log("Topocentric Moon RA:", eq1.ra, "DEC:", eq1.dec);

// Geocentric
let eq2 = Equator(Body.Moon, date, null, true, true);
console.log("Geocentric Moon RA:", eq2.ra, "DEC:", eq2.dec);
