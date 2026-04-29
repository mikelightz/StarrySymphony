import * as astro from "astronomy-engine";
console.log(Object.keys(astro).filter(k => k.toLowerCase().includes('eclip') || k.toLowerCase().includes('geo')));
