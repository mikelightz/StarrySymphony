import { motion } from "framer-motion";
import { Sprout, Brain, Moon, HandHelping } from "lucide-react";
import { fadeIn } from "@/lib/animations";

export default function About() {
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        <motion.h1
          className="font-playfair text-4xl md:text-5xl text-center mb-16 text-deepblue"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          About
        </motion.h1>

        <motion.div
          className="flex flex-col md:flex-row items-center gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Circular portrait image */}
          <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg border-4 border-cream flex-shrink-0 mx-auto md:mx-0">
            <img
              src="/images/new_1.jpg"
              alt="Founder portrait"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="font-playfair text-2xl mb-4 text-terracotta text-center md:text-left">
              Meet the Founder
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              As a Psychosomatic Wellness Counselor, I blend the ancient wisdom
              of astrology with modern embodiment practices and emotional
              healing techniques to guide you on your journey back to yourself.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              My approach is deeply rooted in the understanding that our bodies
              hold wisdom, our emotions carry messages, and the cosmos provides
              a natural rhythm we can align with for greater harmony and
              wellbeing.
            </p>
            <p className="text-gray-700 leading-relaxed">
              With over a decade of study in somatic practices, lunar wisdom,
              and psychological healing modalities, I create safe spaces for
              exploration, growth, and transformation that honors your unique
              path.
            </p>
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <div className="mt-20">
          <motion.h2
            className="font-playfair text-3xl text-center mb-10 text-deepblue"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Philosophy
          </motion.h2>

          {/* A serene nature scene with earthy tones */}
          <motion.div
            className="mb-10 rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500&q=80"
              alt="Serene nature landscape"
              className="w-full h-auto"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PhilosophyCard
              icon={<Sprout className="h-8 w-8" />}
              title="Earth & Sky Connection"
              description="We believe in honoring both our earthly existence and cosmic connections. By aligning with natural rhythms, we find balance and purpose in our daily lives."
              color="olive"
            />

            <PhilosophyCard
              icon={<Brain className="h-8 w-8" />}
              title="Mind-Body Integration"
              description="Our approach integrates psychological understanding with somatic awareness, honoring the profound connection between emotional patterns and physical experience."
              color="terracotta"
            />

            <PhilosophyCard
              icon={<Moon className="h-8 w-8" />}
              title="Lunar Wisdom"
              description="We use the cycles of the moon as a powerful framework for personal growth, self-reflection, and renewal, honoring ancient traditions in a modern context."
              color="gold"
            />

            <PhilosophyCard
              icon={<HandHelping className="h-8 w-8" />}
              title="Embodied Practice"
              description="We believe true transformation happens when we honor the body's wisdom through intentional awareness, movement, and somatic practices."
              color="deepblue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface PhilosophyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "olive" | "terracotta" | "gold" | "deepblue";
}

function PhilosophyCard({
  icon,
  title,
  description,
  color,
}: PhilosophyCardProps) {
  const colorClass = {
    olive: "text-olive",
    terracotta: "text-terracotta",
    gold: "text-gold",
    deepblue: "text-deepblue",
  }[color];

  return (
    <motion.div
      className="bg-white p-8 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className={`text-3xl mb-4 ${colorClass}`}>{icon}</div>
      <h3 className="font-playfair text-xl mb-3 text-deepblue">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </motion.div>
  );
}
