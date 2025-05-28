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
import { fadeIn, slideUp } from "@/lib/animations";

// --- NEW IMPORTS FOR AUTOCOMPLETE ---
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";

//import * as astrology from "astrology-js";

// ... (The ChartResults interface, moonSignInterpretations object, and getZodiacSign function remain exactly the same)
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

export default function NatalChart() {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
  });
  // --- NEW STATE FOR LOCATION AUTOCOMPLETE ---
  const [location, setLocation] = useState<any>(null);

  const [results, setResults] = useState<ChartResults | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- UPDATED CALCULATION LOGIC ---
  const calculateChart = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.birthDate || !formData.birthTime || !location) {
      alert("Please fill out all fields, including birth location.");
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Get coordinates from the selected location
      const results = await geocodeByAddress(location.label);
      const { lat, lng } = await getLatLng(results[0]);

      // Step 2: Use the coordinates to calculate the chart
      const [year, month, day] = formData.birthDate.split("-").map(Number);
      const [hour, minute] = formData.birthTime.split(":").map(Number);

      const config = {
        year,
        month,
        day,
        hour,
        minute,
        latitude: lat,
        longitude: lng,
      };

      const chart = new astrology.Natal(config);
      const sunPosition = chart.get("sun").position.longitude;
      const moonPosition = chart.get("moon").position.longitude;
      const ascendantPosition = chart.get("ascendant").position.longitude;

      const sunSign = getZodiacSign(sunPosition);
      const moonSign = getZodiacSign(moonPosition);
      const risingSign = getZodiacSign(ascendantPosition);

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

  const resetForm = () => {
    setShowForm(true);
    setResults(null);
    setLocation(null); // Reset location
    setFormData({ name: "", birthDate: "", birthTime: "" });
  };

  return (
    <div className="min-h-screen bg-cream py-20">
      <div className="container-custom max-w-4xl">
        {/* ... (Hero, Why It Matters, What You'll Receive sections are unchanged) ... */}
        {showForm ? (
          <>
            {/* The top sections are identical to your file */}
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
            <motion.div
              className="mb-16"
              initial="hidden"
              animate="visible"
              variants={slideUp}
              custom={0.2}
            >
              {/* ...What You'll Receive Grid... */}
            </motion.div>

            {/* --- UPDATED FORM SECTION --- */}
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
                {/* Name, Date, and Time inputs are unchanged */}
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

                {/* --- REPLACED LOCATION INPUT --- */}
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
          /* Results section is unchanged */
          <motion.div
            className="bg-white rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* The rest of your results display JSX goes here */}
          </motion.div>
        )}
      </div>
    </div>
  );
}
