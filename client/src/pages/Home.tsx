import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Star, Moon, Heart } from "lucide-react";
import MoonPhases from "@/components/MoonPhases";
import { fadeIn, slideUp } from "@/lib/animations";

export default function Home() {
  const [_, navigate] = useLocation();

  return (
    <>
      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center relative overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/bg-video.mp4" type="video/mp4" />
          {/* Fallback background for browsers that don't support video */}
          <div className="absolute inset-0 moon-phases-bg"></div>
        </video>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-5"></div>

        <div className="container-custom text-center relative z-10">
          <motion.h1
            className="font-playfair text-4xl md:text-6xl font-bold text-cream mb-4 text-shadow"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            OmFlor Wellness
          </motion.h1>
          <motion.p
            className="text-cream text-xl md:text-2xl font-light mb-8 text-shadow max-w-2xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={slideUp}
          >
            Your Roadmap Home to Wholeness—Mind, Body and Spirit
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp}
            custom={0.3}
          >
            <button
              className="bg-terracotta text-cream px-8 py-3 rounded-full inline-block hover:bg-opacity-80 transition duration-300 font-medium"
              onClick={() => navigate("/lunar-guide")}
            >
              Download your free Lunar Self-Care Guide
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 px-4 bg-cream">
        <div className="container-custom max-w-4xl text-center">
          <div className="mb-12">
            {/* A decorative celestial element showing lunar phases in a horizontal line */}
            <div className="mb-10">
              <MoonPhases />
            </div>

            <h2 className="font-playfair text-3xl md:text-4xl mb-6 text-deepblue">
              Our Mission
            </h2>

            {/* A serene sanctuary space with celestial elements */}
            <div className="mb-8 max-w-xl mx-auto rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80"
                alt="Serene sanctuary space with soft lighting"
                className="w-full h-auto"
              />
            </div>

            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              At OmFlor Wellness, we believe that true healing happens when we
              align with both our inner wisdom and the natural rhythms that
              surround us. Our approach combines embodiment practices, lunar
              wisdom, and psychosomatic guidance to help you reconnect with
              yourself on a deeper level.
            </p>

            <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
              Through intentional practices and gentle awareness, we create
              space for you to honor your body's wisdom and harness the power of
              lunar cycles for profound personal transformation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <ServiceCard
                icon={<Moon className="h-8 w-8 text-gold" />}
                title="Lunar Wisdom"
                description="Harness the energy of moon phases to align your self-care practices with natural cycles."
              />

              <ServiceCard
                icon={<Heart className="h-8 w-8 text-terracotta" />}
                title="Embodiment"
                description="Learn to listen to your body's innate wisdom through somatic awareness practices."
              />

              <ServiceCard
                icon={<Star className="h-8 w-8 text-olive" />}
                title="Emotional Healing"
                description="Develop emotional intelligence and resilience through psychosomatic techniques."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 px-4 bg-neutral bg-opacity-30">
        <div className="container-custom max-w-4xl">
          <h2 className="font-playfair text-3xl text-center mb-12 text-deepblue">
            Lunar Transformations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="The Somatic Moon Journal has completely transformed my relationship with my body and the moon cycles. I feel more connected, grounded, and in tune with myself than ever before."
              author="Amelia R."
            />

            <TestimonialCard
              quote="The 1:1 sessions helped me understand how my emotions are stored in my body. Learning to work with the lunar cycles has brought a beautiful rhythm to my healing journey."
              author="Jason K."
            />
          </div>
        </div>
      </div>
    </>
  );
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="font-playfair text-xl mb-3 text-deepblue">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
}

function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <motion.div
      className="bg-white p-8 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center mb-4">
        <div className="text-gold text-2xl">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Star
              key={index}
              className="h-5 w-5 inline-block"
              fill="currentColor"
            />
          ))}
        </div>
      </div>
      <p className="italic text-gray-700 mb-6">"{quote}"</p>
      <p className="font-medium text-deepblue">— {author}</p>
    </motion.div>
  );
}
