import { Body, Observer, Equator, Ecliptic } from "astronomy-engine";
const date = new Date("1995-07-22T23:30:00Z");
const observer = new Observer(36.8354, -76.2983, 0);

try {
  let eq = Equator(Body.Sun, date, observer, true, true);
  // astronomy engine returns EquatorialCoordinates. Let's see if Ecliptic is a method or function.
  // wait, earlier Ecliptic threw error because it might expect a simple vector.
  // Let's print eq
  console.log("RA:", eq.ra, "DEC:", eq.dec);
} catch (e) {
  console.error(e);
}
