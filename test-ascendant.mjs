import { Observer, SiderealTime, Equator, Body } from 'astronomy-engine';

function getZodiacSign(eclipticLongitude) {
    const signs = [
        "Aries", "Taurus", "Gemini", "Cancer",
        "Leo", "Virgo", "Libra", "Scorpio",
        "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];
    const index = Math.floor(eclipticLongitude / 30);
    return signs[index];
}

const lat = 36.8440719;
const lon = -76.3096749;
const offsetHours = -4;

const localDate = new Date(`1995-07-22T23:30:00Z`);
const birthDateUTC = new Date(localDate.getTime() - (offsetHours * 60 * 60 * 1000));
console.log("UTC Date:", birthDateUTC.toISOString());

const gmstHours = SiderealTime(birthDateUTC);
console.log("GMST Hours:", gmstHours);
const lstHours = (gmstHours + lon / 15) % 24;
let lstDegrees = lstHours * 15;
if (lstDegrees < 0) lstDegrees += 360;
console.log("LST Degrees:", lstDegrees);
const lstRadians = lstDegrees * (Math.PI / 180);

const eps = 23.4392911 * (Math.PI / 180);
const latRadians = lat * (Math.PI / 180);

const y = Math.cos(lstRadians);
const x = -(Math.sin(lstRadians) * Math.cos(eps) + Math.tan(latRadians) * Math.sin(eps));
let ascRadians = Math.atan2(y, x);
if (ascRadians < 0) ascRadians += 2 * Math.PI;
const ascDegrees = ascRadians * (180 / Math.PI);

console.log("Calculated Ascendant Degrees:", ascDegrees);
console.log("Calculated Rising Sign:", getZodiacSign(ascDegrees));

// Test alternative x formula
const x2 = -(Math.sin(lstRadians) * Math.cos(eps) - Math.tan(latRadians) * Math.sin(eps));
let ascRadians2 = Math.atan2(y, x2);
if (ascRadians2 < 0) ascRadians2 += 2 * Math.PI;
const ascDegrees2 = ascRadians2 * (180 / Math.PI);

console.log("Calculated Ascendant Degrees (alt 1):", ascDegrees2);
console.log("Calculated Rising Sign (alt 1):", getZodiacSign(ascDegrees2));

// In traditional astrology longitude is measured from Aries
// The formula for the ascendant is:
// Asc = atan2(cos LST, -sin LST * cos e - tan lat * sin e)
// Let's print out what we get.
