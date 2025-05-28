import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Moon,
  Sun,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";

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

const getZodiacSign = (degree: number): string => {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  const signIndex = Math.floor(degree / 30);
  return signs[signIndex];
};

// --- The Final Component ---
export default function NatalChart() {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
  });
  const [location, setLocation] = useState<any>(null);
  const [results, setResults] = useState<ChartResults | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateChart = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.birthDate || !formData.birthTime || !location) {
      alert("Please fill out all fields, including birth location.");
      setIsLoading(false);
      return;
    }

    try {
      const horoscopeModule = await import("horoscope");
      const Horoscope = horoscopeModule.default;

      const geoResults = await geocodeByAddress(location.label);
      const { lat, lng } = await getLatLng(geoResults[0]);

      const [year, month, day] = formData.birthDate.split("-").map(Number);
      const [hour, minute] = formData.birthTime.split(":").map(Number);

      const birthDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

      const chart = new Horoscope({
        date: birthDate,
        latitude: lat,
        longitude: lng,
        houseSystem: "placidus",
      });

      const sunInfo = chart.get("sun");
      const moonInfo = chart.get("moon");
      const risingSign = chart.get("ascendant").sign;

      const sunSign = getZodiacSign(sunInfo.position.longitude);
      const moonSign = getZodiacSign(moonInfo.position.longitude);

      setResults({
        name: formData.name || "Cosmic Soul",
        sun: sunSign,
        moon: moonSign,
        rising: risingSign,
        moonInterpretation:
          moonSignInterpretations[
            moonSign as keyof typeof moonSignInterpretations
          ],
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error during chart calculation:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An unknown error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-20">
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
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-deepblue mb-6">
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
              <h2 className="font-playfair text-3xl text-deepblue mb-6">
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
              <h2 className="font-playfair text-3xl text-deepblue text-center mb-8">
                What You'll Receive
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <Sun className="h-8 w-8 text-terracotta mx-auto mb-4" />
                  <h3 className="font-semibold text-deepblue mb-2">
                    A Full Natal Chart
                  </h3>
                  <p className="text-gray-600">
                    Your complete cosmic blueprint
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <Moon className="h-8 w-8 text-olive mx-auto mb-4" />
                  <h3 className="font-semibold text-deepblue mb-2">
                    Your Big Three
                  </h3>
                  <p className="text-gray-600">
                    Sun, Moon, and Rising explained
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <Star className="h-8 w-8 text-gold mx-auto mb-4" />
                  <h3 className="font-semibold text-deepblue mb-2">
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
              <h2 className="font-playfair text-3xl text-deepblue text-center mb-8">
                Begin Below:
              </h2>
              <form onSubmit={calculateChart} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-deepblue mb-2"
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
                    className="block text-sm font-medium text-deepblue mb-2"
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
                    className="block text-sm font-medium text-deepblue mb-2"
                  >
                    <Clock className="inline h-4 w-4 mr-1" />
                    Exact Time of Birth
                  </label>
                  <input
                    type="time"
                    id="birthTime"
                    name="birthTime"
                    value={formData.birthTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    (Tip: Check your birth certificate if unsure)
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="birthLocation"
                    className="block text-sm font-medium text-deepblue mb-2"
                  >
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Birth Location
                  </label>
                  <GooglePlacesAutocomplete
                    apiKey={import.meta.env.VITE_Maps_API_KEY}
                    selectProps={{
                      value: location,
                      onChange: setLocation,
                      placeholder: "City, State, Country",
                      styles: {
                        input: (provided) => ({
                          ...provided,
                          borderRadius: "0.5rem",
                          padding: "0.75rem 1rem",
                          border: "1px solid #D1D5DB",
                        }),
                        option: (provided) => ({
                          ...provided,
                          backgroundColor: "white",
                          color: "#36454F",
                        }),
                      },
                    }}
                  />
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
              <h2 className="font-playfair text-3xl text-deepblue mb-4">
                Hello {results?.name}, here is your cosmic blueprint:
              </h2>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-terracotta/10 rounded-lg">
                  <Sun className="h-8 w-8 text-terracotta mx-auto mb-3" />
                  <h3 className="font-semibold text-deepblue mb-2">Sun Sign</h3>
                  <p className="text-2xl font-playfair text-terracotta">
                    {results?.sun}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Your core identity
                  </p>
                </div>
                <div className="text-center p-6 bg-olive/10 rounded-lg">
                  <Moon className="h-8 w-8 text-olive mx-auto mb-3" />
                  <h3 className="font-semibold text-deepblue mb-2">
                    Moon Sign
                  </h3>
                  <p className="text-2xl font-playfair text-olive">
                    {results?.moon}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Your emotional nature
                  </p>
                </div>
                <div className="text-center p-6 bg-gold/10 rounded-lg">
                  <Sparkles className="h-8 w-8 text-gold mx-auto mb-3" />
                  <h3 className="font-semibold text-deepblue mb-2">
                    Rising Sign
                  </h3>
                  <p className="text-2xl font-playfair text-gold">
                    {results?.rising}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Your outer personality
                  </p>
                </div>
              </div>
              <div className="bg-olive/5 rounded-lg p-6">
                <h3 className="font-semibold text-deepblue mb-3">
                  Your Moon Sign Insights:
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {results?.moonInterpretation}
                </p>
              </div>
              <div className="text-center">
                <a
                  href="/moon-masterclass"
                  className="inline-block bg-terracotta text-white py-3 px-6 rounded-lg font-semibold hover:bg-terracotta/90 transition duration-300 mr-4"
                >
                  Get Your Moon Sign Rituals & Prompts
                </a>
                <button
                  onClick={resetForm}
                  className="inline-block bg-gray-300 text-deepblue py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition duration-300"
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
