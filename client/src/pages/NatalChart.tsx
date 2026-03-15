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
import { Equator, Body, Observer, SiderealTime } from "astronomy-engine";
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
interface ChartResults {
  name: string;
  sun: string;
  moon: string;
  rising: string;
  moonInterpretation: string;
}

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
function getZodiacSign(longitude: number): string {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const index = Math.floor(longitude / 30) % 12;
  return signs[index];
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
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
      const sunEq = Equator(Body.Sun, birthDateUTC, observer, true, true);
      const sunLon = getEclipticLon(sunEq.ra, sunEq.dec);
      const sun = getZodiacSign(sunLon);

      // Moon calculation
      const moonEq = Equator(Body.Moon, birthDateUTC, observer, true, true);
      const moonLon = getEclipticLon(moonEq.ra, moonEq.dec);
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

      const rising = getZodiacSign(ascDegrees);

      setResults({
        name: formData.name,
        sun,
        moon,
        rising,
        moonInterpretation:
          moonSignInterpretations[moon as keyof typeof moonSignInterpretations],
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
    setFormData({ name: "", birthDate: "", birthTime: "", ampm: "AM", latitude: "", longitude: "", timezone: "", locationName: "" });
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
                  className="w-full bg-gold text-white py-3 px-6 rounded-lg font-semibold hover:bg-gold/90 transition duration-300 transform hover:scale-105 disabled:bg-gray-400"
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
              <div className="bg-forest/5 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Your Moon Sign Insights:
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {results?.moonInterpretation}
                </p>
              </div>
              <div className="text-center">
                <a
                  //href=""
                  className="inline-block bg-copper text-white py-3 px-6 rounded-lg font-semibold hover:bg-copper/90 transition duration-300 mr-4"
                >
                  Get Your Moon Sign Rituals & Prompts
                </a>
                <button
                  onClick={resetForm}
                  className="inline-block bg-gray-300 text-foreground py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition duration-300"
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
