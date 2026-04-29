import { SunPosition } from "astronomy-engine";
const date = new Date("1995-07-22T23:30:00Z");
let sunPos = SunPosition(date);
console.log("SunPos:", sunPos.elon, sunPos.elat);
