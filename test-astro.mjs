import {
    Equator,
    Body,
    Observer,
    SiderealTime
} from "astronomy-engine";

function getZodiacSign(longitude) {
    const signs = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];
    const index = Math.floor(longitude / 30) % 12;
    return signs[index];
}

function getEclipticLon(raHours, decDegrees) {
    const ra = raHours * 15 * (Math.PI / 180);
    const dec = decDegrees * (Math.PI / 180);
    const eps = 23.4392911 * (Math.PI / 180);

    const y = Math.sin(ra) * Math.cos(eps) + Math.tan(dec) * Math.sin(eps);
    const x = Math.cos(ra);
    let lon = Math.atan2(y, x) * (180 / Math.PI);
    if (lon < 0) lon += 360;
    return lon;
}

function calculateChart(date, lat, lon) {
    const observer = new Observer(lat, lon, 0);

    // Sun calculation
    const sunEq = Equator(Body.Sun, date, observer, true, true);
    const sunLon = getEclipticLon(sunEq.ra, sunEq.dec);
    const sunSign = getZodiacSign(sunLon);

    // Moon calculation
    const moonEq = Equator(Body.Moon, date, observer, true, true);
    const moonLon = getEclipticLon(moonEq.ra, moonEq.dec);
    const moonSign = getZodiacSign(moonLon);

    // Ascendant calculation
    const gmstHours = SiderealTime(date);
    const lstHours = (gmstHours + lon / 15) % 24;
    let lstDegrees = lstHours * 15;
    if (lstDegrees < 0) lstDegrees += 360;
    const lstRadians = lstDegrees * (Math.PI / 180);

    // Obliquity of the ecliptic (approx 23.439 degrees)
    const eps = 23.4392911 * (Math.PI / 180);
    const latRadians = lat * (Math.PI / 180);

    const y = Math.cos(lstRadians);
    const x = -(Math.sin(lstRadians) * Math.cos(eps) + Math.tan(latRadians) * Math.sin(eps));
    let ascRadians = Math.atan2(y, x);
    if (ascRadians < 0) ascRadians += 2 * Math.PI;
    const ascDegrees = ascRadians * (180 / Math.PI);

    const risingSign = getZodiacSign(ascDegrees);

    return {
        sunLon,
        sunSign,
        moonLon,
        moonSign,
        ascDegrees,
        risingSign
    };
}

const testDate = new Date("1990-10-10T12:00:00-04:00");
const result = calculateChart(testDate, 40.7128, -74.0060);
console.log("Calculated chart:", result);
