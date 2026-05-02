import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Moon,
  Sun,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Equator, Body, Observer, SiderealTime, GeoVector, Ecliptic } from "astronomy-engine";
import { fromZonedTime } from "date-fns-tz";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Animation Variants ---
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1 },
  }),
};

// --- Interfaces and Static Data ---
interface Placement {
  label: string;
  lon: number;
  sign: string;
  signAbbr: string;
  degree: number;
  minutes: number;
  house: number;
  isRetrograde: boolean;
  isPoint: boolean; // meaning it's not a physical planet, like nodes
}

interface ChartResults {
  name: string;
  sun: string;
  moon: string;
  rising: string;
  sunInterpretation: string;
  moonInterpretation: string;
  risingInterpretation: string;
  placements: Placement[];
}

const ZODIAC_SIGNS = [
  { name: "Aries", abbr: "Ari" },
  { name: "Taurus", abbr: "Tau" },
  { name: "Gemini", abbr: "Gem" },
  { name: "Cancer", abbr: "Can" },
  { name: "Leo", abbr: "Leo" },
  { name: "Virgo", abbr: "Vir" },
  { name: "Libra", abbr: "Lib" },
  { name: "Scorpio", abbr: "Sco" },
  { name: "Sagittarius", abbr: "Sag" },
  { name: "Capricorn", abbr: "Cap" },
  { name: "Aquarius", abbr: "Aqu" },
  { name: "Pisces", abbr: "Pis" }
];

const sunSignInterpretations = {
  Aries:
    "Your core identity is bold and pioneering. You shine brightest when leading and initiating new adventures.",
  Taurus:
    "You embody steadfastness and sensuality. Your core identity glows with stability and an appreciation for life's earthly pleasures.",
  Gemini:
    "Your essence is versatile and communicative. You shine by gathering and sharing knowledge with a curious spirit.",
  Cancer:
    "Your core is nurturing and deeply intuitive. You shine brightest when protecting and caring for those you love.",
  Leo: "You radiate warmth and natural leadership. Your core identity is beautifully expressive and creative.",
  Virgo:
    "Your essence is analytical and service-oriented. You shine by bringing order, healing, and practical wisdom.",
  Libra:
    "Your core identity seeks harmony and connection. You shine brightest in partnership and creating beauty.",
  Scorpio:
    "You embody intensity and transformation. Your essence glows with depth, passion, and emotional power.",
  Sagittarius:
    "Your core is adventurous and philosophical. You shine through exploration, learning, and seeking higher truths.",
  Capricorn:
    "Your essence is ambitious and structured. You shine brightest when achieving goals and building lasting legacies.",
  Aquarius:
    "Your core identity is visionary and unconventional. You shine by innovating and championing humanitarian ideals.",
  Pisces:
    "You embody empathy and artistic sensitivity. Your essence glows with compassion and deep spiritual understanding.",
};

const risingSignInterpretations = {
  Aries:
    "You approach the world with bold enthusiasm. Your outer personality is decisive, energetic, and unapologetically direct.",
  Taurus:
    "You present a calm, grounded demeanor to the world. Your outer personality appears steady, deliberate, and drawn to beauty.",
  Gemini:
    "You greet life with curiosity and lively charm. Your outer personality is adaptable, quick-witted, and highly engaging.",
  Cancer:
    "You approach the world with gentle caution. Your outer personality is empathetic, nurturing, and immediately protective.",
  Leo: "You enter a room with natural radiance and confidence. Your outer personality is magnetic, warm, and instinctively theatrical.",
  Virgo:
    "You present a thoughtful, organized face to the world. Your outer personality appears observant, modest, and keenly helpful.",
  Libra:
    "You greet life with grace and diplomacy. Your outer personality is charming, cooperative, and aesthetically attuned.",
  Scorpio:
    "You approach the world with a quietly intense presence. Your outer personality is magnetic, perceptive, and powerfully guarded.",
  Sagittarius:
    "You enter new situations with optimistic enthusiasm. Your outer personality is outward-looking, jovial, and wonderfully frank.",
  Capricorn:
    "You present a responsible, mature demeanor. Your outer personality is serious, capable, and commands natural respect.",
  Aquarius:
    "You greet life with a friendly but detached uniqueness. Your outer personality is intriguing, egalitarian, and fiercely independent.",
  Pisces:
    "You approach the world with a soft, dreamlike sensitivity. Your outer personality is gentle, receptive, and deeply intuitive.",
};

const moonSignInterpretations = {
  Aries:
    "Your emotional world is fiery and passionate. You process feelings quickly and need independence in your emotional expression.",
  Taurus:
    "You find security in comfort and stability. Your emotions run deep and steady, seeking grounding in the material world.",
  Gemini:
    "Your emotional nature is curious and adaptable. You process feelings through communication and mental exploration.",
  Cancer:
    "You feel deeply and intuitively. Your emotions ebb and flow like the tides, seeking nurturing and home.",
  Leo: "Your emotional expression is dramatic and generous. You need recognition and warmth in your emotional connections.",
  Virgo:
    "You approach emotions with discernment and care. You find healing through service and practical nurturing.",
  Libra:
    "You seek harmony and balance in your emotional world. Relationships and beauty feed your soul.",
  Scorpio:
    "Your emotions are intense and transformative. You dive deep into the mysteries of feeling and healing.",
  Sagittarius:
    "Your emotional nature seeks adventure and meaning. You find joy in exploration and philosophical understanding.",
  Capricorn:
    "You approach emotions with wisdom and patience. You build emotional security through steady, committed effort.",
  Aquarius:
    "Your emotional expression is unique and innovative. You feel deeply about humanity and future possibilities.",
  Pisces:
    "Your emotional world is vast and intuitive. You feel the collective emotions and find healing through compassion.",
};

// Astronomical Helper Functions
function getZodiacInfo(longitude: number) {
  const index = Math.floor(longitude / 30) % 12;
  const sign = ZODIAC_SIGNS[index];
  const degreeTotal = longitude % 30;
  const degree = Math.floor(degreeTotal);
  const minutes = Math.floor((degreeTotal - degree) * 60);
  return { ...sign, index, degree, minutes };
}

function getZodiacSign(longitude: number): string {
  return getZodiacInfo(longitude).name;
}

function getEclipticLon(raHours: number, decDegrees: number): number {
  const ra = raHours * 15 * (Math.PI / 180);
  const dec = decDegrees * (Math.PI / 180);
  const eps = 23.4392911 * (Math.PI / 180);

  const y = Math.sin(ra) * Math.cos(eps) + Math.tan(dec) * Math.sin(eps);
  const x = Math.cos(ra);
  let lon = Math.atan2(y, x) * (180 / Math.PI);
  if (lon < 0) lon += 360;
  return lon;
}

// Aspect Calculation Helpers
function getAngleDiff(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

// Mathematical Approximations for extra points
function dateToJD(date: Date) {
  return (date.getTime() / 86400000) + 2440587.5;
}

function calculateMeanNode(jd: number) {
  const T = (jd - 2451545.0) / 36525;
  let omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T;
  omega = omega % 360;
  if (omega < 0) omega += 360;
  return omega;
}

function calculateMeanLilith(jd: number) {
  const T = (jd - 2451545.0) / 36525;
  let apogee = 83.35324 + 4069.013728 * T - 0.01032 * T * T;
  apogee = apogee % 360;
  if (apogee < 0) apogee += 360;
  return apogee;
}

function calculateChiron(jd: number, sunVec: any) {
  const d = jd - 2451545.0;
  let M = (27.98 + 0.01964 * d) % 360;
  if (M < 0) M += 360;
  const e = 0.3793;
  let M_rad = M * Math.PI / 180;
  let E = M_rad;
  for (let i = 0; i < 5; i++) {
    E = E - (E - e * Math.sin(E) - M_rad) / (1 - e * Math.cos(E));
  }
  const v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));

  const w = 339.14 * Math.PI / 180;
  const node = 209.39 * Math.PI / 180;
  const i_inc = 6.94 * Math.PI / 180;

  const a = 13.67;
  const r = a * (1 - e * Math.cos(E));

  const x_prime = r * Math.cos(v);
  const y_prime = r * Math.sin(v);

  const cx = x_prime * (Math.cos(w) * Math.cos(node) - Math.sin(w) * Math.sin(node) * Math.cos(i_inc))
    - y_prime * (Math.sin(w) * Math.cos(node) + Math.cos(w) * Math.sin(node) * Math.cos(i_inc));
  const cy = x_prime * (Math.cos(w) * Math.sin(node) + Math.sin(w) * Math.cos(node) * Math.cos(i_inc))
    + y_prime * (Math.cos(w) * Math.cos(node) * Math.cos(i_inc) - Math.sin(w) * Math.sin(node));
  const cz = x_prime * (Math.sin(w) * Math.sin(i_inc))
    + y_prime * (Math.cos(w) * Math.sin(i_inc));

  const sunEcl = Ecliptic(sunVec);
  const ex = -sunEcl.vec.x;
  const ey = -sunEcl.vec.y;
  const ez = -sunEcl.vec.z;

  const gx = cx - ex;
  const gy = cy - ey;
  const gz = cz - ez;

  let geo_lon = Math.atan2(gy, gx) * 180 / Math.PI;
  if (geo_lon < 0) geo_lon += 360;
  return geo_lon;
}

const ASPECTS = [
  { name: 'Conjunction', angle: 0, orb: 8 },
  { name: 'Sextile', angle: 60, orb: 6 },
  { name: 'Square', angle: 90, orb: 8 },
  { name: 'Trine', angle: 120, orb: 8 },
  { name: 'Opposition', angle: 180, orb: 8 }
];

const PLANETS = [
  { label: 'Sun', body: Body.Sun },
  { label: 'Moon', body: Body.Moon },
  { label: 'Mercury', body: Body.Mercury },
  { label: 'Venus', body: Body.Venus },
  { label: 'Mars', body: Body.Mars },
  { label: 'Jupiter', body: Body.Jupiter },
  { label: 'Saturn', body: Body.Saturn },
  { label: 'Uranus', body: Body.Uranus },
  { label: 'Neptune', body: Body.Neptune },
  { label: 'Pluto', body: Body.Pluto }
];

export default function NatalChart() {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    ampm: "AM",
    latitude: "",
    longitude: "",
    timezone: "",
    locationName: "",
  });
  const [results, setResults] = useState<ChartResults | null>(null);
  const [aspectData, setAspectData] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Email state
  const [emailInput, setEmailInput] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "error">("idle");

  // Autocomplete state
  const [openLocation, setOpenLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchLocations, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateChart = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.birthDate || !formData.birthTime) {
      alert("Please provide a valid birth date and time.");
      return;
    }

    if (!formData.latitude || !formData.longitude || !formData.timezone) {
      alert("Please select a location from the dropdown.");
      setIsLoading(false);
      return;
    }

    try {
      const lat = parseFloat(formData.latitude);
      const lon = parseFloat(formData.longitude);

      if (isNaN(lat) || isNaN(lon)) {
        alert("Location coordinates are invalid.");
        setIsLoading(false);
        return;
      }

      // Parse 12-hour time (birthTime) and AM/PM
      let [hoursStr, minutesStr] = formData.birthTime.split(":");
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      if (formData.ampm === "PM" && hours < 12) {
        hours += 12;
      } else if (formData.ampm === "AM" && hours === 12) {
        hours = 0;
      }

      // Ensure 2-digit format
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const time24 = `${formattedHours}:${formattedMinutes}:00`;

      // Construct full datetime string in the local timezone
      const localDateString = `${formData.birthDate}T${time24}`;

      // Convert to UTC using date-fns-tz and the timezone string (e.g., 'America/New_York')
      const birthDateUTC = fromZonedTime(localDateString, formData.timezone);

      // Exact Calculation Using Astronomy Engine
      const observer = new Observer(lat, lon, 0);

      // Sun calculation
      const sunVec = GeoVector(Body.Sun, birthDateUTC, true);
      const sunLon = Ecliptic(sunVec).elon;
      const sun = getZodiacSign(sunLon);

      // Moon calculation
      const moonVec = GeoVector(Body.Moon, birthDateUTC, true);
      const moonLon = Ecliptic(moonVec).elon;
      const moon = getZodiacSign(moonLon);

      // Ascendant calculation
      const gmstHours = SiderealTime(birthDateUTC);
      const lstHours = (gmstHours + lon / 15) % 24;
      let lstDegrees = lstHours * 15;
      if (lstDegrees < 0) lstDegrees += 360;
      const lstRadians = lstDegrees * (Math.PI / 180);

      const eps = 23.4392911 * (Math.PI / 180);
      const latRadians = lat * (Math.PI / 180);

      const y = Math.cos(lstRadians);
      const x = -(Math.sin(lstRadians) * Math.cos(eps) + Math.tan(latRadians) * Math.sin(eps));
      let ascRadians = Math.atan2(y, x);
      if (ascRadians < 0) ascRadians += 2 * Math.PI;
      const ascDegrees = ascRadians * (180 / Math.PI);

      const risingInfo = getZodiacInfo(ascDegrees);
      const rising = risingInfo.name;
      const risingIndex = risingInfo.index;

      // Calculate future date for Retrograde checking
      const futureDate = new Date(birthDateUTC.getTime() + 86400000); // +1 day

      // --- Calculate All Planetary Placements & Degrees ---
      const jd = dateToJD(birthDateUTC);
      const placements: Placement[] = [];

      placements.push({
        label: "Ascendant",
        lon: ascDegrees,
        sign: risingInfo.name,
        signAbbr: risingInfo.abbr,
        degree: risingInfo.degree,
        minutes: risingInfo.minutes,
        house: 1,
        isRetrograde: false,
        isPoint: true
      });

      for (const p of PLANETS) {
        // Today's Longitude
        const vec = GeoVector(p.body, birthDateUTC, true);
        const pLon = Ecliptic(vec).elon;

        // Tomorrow's Longitude (for Retrograde)
        const vecFuture = GeoVector(p.body, futureDate, true);
        const pLonFuture = Ecliptic(vecFuture).elon;

        // Handle 359 -> 0 degree wrap for Retrograde calculations
        let diff = pLonFuture - pLon;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        const isRetrograde = diff < 0 && p.label !== "Sun" && p.label !== "Moon";

        const zInfo = getZodiacInfo(pLon);
        // Whole Sign House System calculation
        let house = ((zInfo.index - risingIndex + 12) % 12) + 1;

        placements.push({
          label: p.label,
          lon: pLon,
          sign: zInfo.name,
          signAbbr: zInfo.abbr,
          degree: zInfo.degree,
          minutes: zInfo.minutes,
          house,
          isRetrograde,
          isPoint: false
        });
      }

      // Calculate Extra Points (Nodes, Lilith, Chiron)
      const meanNodeLon = calculateMeanNode(jd);
      // Rough approximation for True Node (oscillates around Mean Node)
      const trueNodeLon = (meanNodeLon - 1.5 * Math.sin((134.9 + 477198.867 * ((jd - 2451545.0) / 36525)) * Math.PI / 180)) % 360;
      const lilithLon = calculateMeanLilith(jd);
      const chironLon = calculateChiron(jd, sunVec);

      const extraPoints = [
        { label: "Node (M)", lon: meanNodeLon },
        { label: "Node (T)", lon: trueNodeLon < 0 ? trueNodeLon + 360 : trueNodeLon },
        { label: "Lilith (M)", lon: lilithLon },
        { label: "Chiron", lon: chironLon }
      ];

      for (const xp of extraPoints) {
        const zInfo = getZodiacInfo(xp.lon);
        let house = ((zInfo.index - risingIndex + 12) % 12) + 1;
        // Nodes are generally always "retrograding" backwards
        const isRetrograde = xp.label.includes("Node");

        placements.push({
          label: xp.label,
          lon: xp.lon,
          sign: zInfo.name,
          signAbbr: zInfo.abbr,
          degree: zInfo.degree,
          minutes: zInfo.minutes,
          house,
          isRetrograde,
          isPoint: true
        });
      }

      // --- Calculate Aspects ---
      const calculatedAspects: string[] = [];
      for (let i = 0; i < placements.length; i++) {
        for (let j = i + 1; j < placements.length; j++) {
          const diff = getAngleDiff(placements[i].lon, placements[j].lon);

          for (const aspect of ASPECTS) {
            if (Math.abs(diff - aspect.angle) <= aspect.orb) {
              calculatedAspects.push(`${placements[i].label} ${aspect.name} ${placements[j].label}`);
              break;
            }
          }
        }
      }

      setAspectData(calculatedAspects);

      setResults({
        name: formData.name,
        sun,
        moon,
        rising,
        sunInterpretation:
          sunSignInterpretations[sun as keyof typeof sunSignInterpretations],
        moonInterpretation:
          moonSignInterpretations[moon as keyof typeof moonSignInterpretations],
        risingInterpretation:
          risingSignInterpretations[rising as keyof typeof risingSignInterpretations],
        placements
      });

      setShowForm(false);
    } catch (error) {
      console.error("Calculation error:", error);
      alert("Error calculating chart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setShowForm(true);
    setResults(null);
    setAspectData([]);
    setEmailInput("");
    setEmailStatus("idle");
    setFormData({ name: "", birthDate: "", birthTime: "", ampm: "AM", latitude: "", longitude: "", timezone: "", locationName: "" });
  };

  const handleSendEmail = async () => {
    if (!emailInput) return;
    setIsSendingEmail(true);
    setEmailStatus("idle");

    try {
      const response = await fetch("/.netlify/functions/send-chart", {
        method: "POST",
        body: JSON.stringify({
          email: emailInput,
          name: results?.name,
          sun: results?.sun,
          moon: results?.moon,
          rising: results?.rising,
          aspects: aspectData,
          placements: results?.placements
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setEmailStatus("success");
      } else {
        setEmailStatus("error");
      }
    } catch (err) {
      console.error("Email transit error:", err);
      setEmailStatus("error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  useEffect(() => {
    if (!showForm && results) {
      // Scroll to top when results are shown
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" }); // Or scroll to results section if it's not at top
      }, 0);
    }
  }, [showForm, results]);

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container-custom max-w-4xl">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gold/10">
              <Sparkles className="h-12 w-12 text-gold" />
            </div>
          </div>
          <h1 className="font-playfair tracking-widest uppercase font-light text-4xl md:text-5xl font-bold text-foreground mb-6">
            Unlock Your Cosmic Blueprint
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Enter your birth details below to generate your personalized natal
            chart—your sacred map of soul, psyche, and soma...
          </p>
        </motion.div>

        {showForm ? (
          <>
            {/* Why It Matters Section */}
            <motion.div
              className="mb-16 text-center"
              initial="hidden"
              animate="visible"
              variants={slideUp}
            >
              <h2 className="font-playfair tracking-widest uppercase font-light text-3xl text-foreground mb-6">
                You are more than your Sun sign.
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Your natal chart is a unique celestial imprint of the exact
                moment you took your first breath. It reveals the cosmic
                influences that shape your personality, emotions, and life path.
              </p>
            </motion.div>

            {/* What You'll Receive Section */}
            <motion.div
              className="mb-16"
              initial="hidden"
              animate="visible"
              variants={slideUp}
              custom={0.2}
            >
              <h2 className="font-playfair tracking-widest uppercase font-light text-3xl text-foreground text-center mb-8">
                What You'll Receive
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <Sun className="h-8 w-8 text-copper mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    A Full Natal Chart
                  </h3>
                  <p className="text-gray-600">
                    Your complete cosmic blueprint
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <Moon className="h-8 w-8 text-forest mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    Your Big Three
                  </h3>
                  <p className="text-gray-600">
                    Sun, Moon, and Rising explained
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <Star className="h-8 w-8 text-gold mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    Bonus Content
                  </h3>
                  <p className="text-gray-600">
                    Moon sign rituals & journal prompts
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Form Section */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8"
              initial="hidden"
              animate="visible"
              variants={slideUp}
              custom={0.4}
            >
              <h2 className="font-playfair tracking-widest uppercase font-light text-3xl text-foreground text-center mb-8">
                Begin Below:
              </h2>
              <form onSubmit={calculateChart} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Birth Date
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="birthTime"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    <Clock className="inline h-4 w-4 mr-1" />
                    Exact Time of Birth
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="time"
                      id="birthTime"
                      name="birthTime"
                      value={formData.birthTime}
                      onChange={handleInputChange}
                      required
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                    <select
                      name="ampm"
                      value={formData.ampm}
                      onChange={(e) => setFormData({ ...formData, ampm: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white text-foreground"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    (Tip: Check your birth certificate if unsure)
                  </p>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Birth Location
                  </label>
                  <Popover open={openLocation} onOpenChange={setOpenLocation}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openLocation}
                        className="w-full justify-between px-4 py-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-normal text-md"
                      >
                        {formData.locationName
                          ? formData.locationName
                          : "Search for a city..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-50">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Type a city name..."
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {isSearching ? "Searching..." : "No location found."}
                          </CommandEmpty>
                          <CommandGroup>
                            {searchResults.map((loc) => {
                              const displayName = `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ''}${loc.country ? `, ${loc.country}` : ''}`;
                              return (
                                <CommandItem
                                  key={loc.id}
                                  value={loc.id.toString()}
                                  onSelect={() => {
                                    setFormData({
                                      ...formData,
                                      locationName: displayName,
                                      latitude: loc.latitude.toString(),
                                      longitude: loc.longitude.toString(),
                                      timezone: loc.timezone || "UTC",
                                    });
                                    setOpenLocation(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.locationName === displayName ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {displayName}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <button
                  type="submit"
                  className="w-full bg-dune text-white py-3 px-6 rounded-lg font-semibold hover:bg-dune/90 transition duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:opacity-50 disabled:hover:scale-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Decoding the Cosmos..." : "Generate My Chart"}
                </button>
              </form>
            </motion.div>
          </>
        ) : (
          <motion.div
            className="bg-white rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-gold/10">
                  <Star className="h-12 w-12 text-gold" />
                </div>
              </div>
              <h2 className="font-playfair tracking-widest uppercase font-light text-3xl text-foreground mb-4">
                Hello {results?.name}, here is your cosmic blueprint:
              </h2>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-copper/10 rounded-lg">
                  <Sun className="h-8 w-8 text-copper mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Sun Sign</h3>
                  <p className="text-2xl font-playfair tracking-widest uppercase font-light text-copper">
                    {results?.sun}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Your core identity
                  </p>
                </div>
                <div className="text-center p-6 bg-forest/10 rounded-lg">
                  <Moon className="h-8 w-8 text-forest mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    Moon Sign
                  </h3>
                  <p className="text-2xl font-playfair tracking-widest uppercase font-light text-forest">
                    {results?.moon}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Your emotional nature
                  </p>
                </div>
                <div className="text-center p-6 bg-gold/10 rounded-lg">
                  <Sparkles className="h-8 w-8 text-gold mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    Rising Sign
                  </h3>
                  <p className="text-2xl font-playfair tracking-widest uppercase font-light text-gold">
                    {results?.rising}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Your outer personality
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-copper/5 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-3 text-copper">
                    Your Sun Sign Insights:
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                    {results?.sunInterpretation}
                  </p>
                </div>
                <div className="bg-forest/5 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-3 text-forest">
                    Your Moon Sign Insights:
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                    {results?.moonInterpretation}
                  </p>
                </div>
                <div className="bg-gold/5 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-3 text-gold">
                    Your Rising Sign Insights:
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                    {results?.risingInterpretation}
                  </p>
                </div>
              </div>
              <div className="bg-nude/30 border border-gold/20 p-8 rounded-xl mt-8">
                <div className="text-center w-full max-w-lg mx-auto">
                  <h3 className="font-playfair text-2xl text-foreground mb-3">Keep Your Chart</h3>
                  <p className="text-sm text-gray-600 mb-6 font-lato">
                    Enter your email to receive a beautiful copy of these results, including a complete list of your generated planetary aspects.
                  </p>

                  {emailStatus === "success" ? (
                    <div className="bg-forest/10 border border-forest/30 text-forest px-4 py-3 rounded-lg flex items-center justify-center">
                      <Check className="h-5 w-5 mr-2" />
                      Your celestial blueprint has been sent!
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
                        required
                      />
                      <button
                        onClick={handleSendEmail}
                        disabled={isSendingEmail || !emailInput}
                        className={`py-3 px-6 rounded-lg font-semibold transition duration-300 whitespace-nowrap ${isSendingEmail || !emailInput
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-dune text-white hover:bg-dune/90 transform hover:scale-105"
                          }`}
                      >
                        {isSendingEmail ? "Sending..." : "Send to Email"}
                      </button>
                    </div>
                  )}
                  {emailStatus === "error" && (
                    <p className="text-red-500 text-sm mt-3">An error occurred while sending. Please try again or verify configuration.</p>
                  )}
                </div>
              </div>

              <div className="text-center pt-8 border-t border-gray-100">
                <button
                  onClick={resetForm}
                  className="inline-block bg-gray-200 text-foreground py-3 px-8 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
                >
                  Calculate Another Chart
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
