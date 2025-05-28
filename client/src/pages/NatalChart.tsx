// Step 1 Code: Basic UI and State
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

// NOTE: We are intentionally NOT importing the complex libraries yet.

export default function NatalChart() {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthLocation: "", // We'll use a simple text input for now
  });
  const [results, setResults] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateChart = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! Calculation logic is not yet connected.");
  };

  const resetForm = () => {
    setShowForm(true);
    setResults(null);
    setFormData({ name: "", birthDate: "", birthTime: "", birthLocation: "" });
  };

  return (
    <div className="min-h-screen bg-cream py-20">
      <div className="container-custom max-w-4xl">
        {showForm ? (
          <motion.div
            className="bg-white rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
              </div>
              <div>
                <label
                  htmlFor="birthLocation"
                  className="block text-sm font-medium text-deepblue mb-2"
                >
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Birth Location
                </label>
                <input
                  type="text"
                  id="birthLocation"
                  name="birthLocation"
                  placeholder="City, State, Country"
                  value={formData.birthLocation}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold text-white py-3 px-6 rounded-lg font-semibold hover:bg-gold/90"
              >
                Generate My Chart
              </button>
            </form>
          </motion.div>
        ) : (
          <div>{/* Results would go here */}</div>
        )}
      </div>
    </div>
  );
}
