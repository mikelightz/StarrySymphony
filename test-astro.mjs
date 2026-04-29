import { Body, EclipticLongitude, SunPosition, Ecliptic } from "astronomy-engine";
const date = new Date("1995-07-22T23:30:00Z");

try {
  console.log("Sun:", EclipticLongitude(Body.Sun, date));
} catch (e) {
  console.error("Error Sun string:", e);
}

try {
    let eq = SunPosition(date);
    let ec = Ecliptic(eq);
    console.log("Sun EC:", ec);
} catch (e) {
    console.error(e);
}
