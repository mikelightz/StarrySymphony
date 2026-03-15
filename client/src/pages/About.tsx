import { motion } from "framer-motion";
import { Sprout, Brain, Moon, HandHelping } from "lucide-react";
import { fadeIn } from "@/lib/animations";

export default function About() {
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        <motion.h1
          className="font-playfair tracking-widest uppercase font-light text-4xl md:text-5xl text-center mb-16 text-foreground"
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
          <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg border-4 border-border flex-shrink-0 mx-auto">
            <img
              src="/images/new_3.jpg"
              alt="Founder portrait"
              className="w-full h-full object-cover object-[center_15%]"
            />
          </div>

          <div>
            <h2 className="font-playfair tracking-widest uppercase font-light text-2xl mb-4 text-copper text-center md:text-left">
              Meet the Founder — Sierra Flor
            </h2>
            <p className="text-espresso mb-4 leading-relaxed">
              As a Somatic Astrologer & Wellness Counselor, I blend the ancient wisdom of astrology with modern embodiment practices and nervous system regulation techniques to guide you on your journey to harmonious living and authentic expression.
            </p>
            <p className="text-espresso mb-4 leading-relaxed">
              My approach is deeply rooted in the understanding that our bodies hold answers, our emotions carry messages, and the cosmos provides a natural rhythm mirrored on earth that we can align with for greater harmony and wellbeing.
            </p>
            <p className="text-espresso leading-relaxed">
              With over a decade of study in astrological wisdom, somatic practices, and psychological healing modalities, I create safe, nurturing spaces for exploration, growth, and impact that honors your unique path.
            </p>
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <div className="mt-20">
          <motion.h2
            className="font-playfair tracking-widest uppercase font-light text-3xl text-center mb-10 text-foreground"
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
              src="/images/IMG_0535.jpg"
              alt="Serene nature landscape"
              className="w-full h-64 md:h-80 object-cover object-[center_35%]"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PhilosophyCard
              icon={<Sprout className="h-8 w-8" />}
              title="Earth • Sky Connection"
              description="We believe in honoring both our earthly existence and cosmic connections. By aligning with natural rhythms, we find balance and purpose in our daily lives."
              color="olive"
            />

            <PhilosophyCard
              icon={<Brain className="h-8 w-8" />}
              title="Mind • Body Integration"
              description="Our approach integrates psychological understanding with somatic awareness, honoring the profound connection between emotional patterns and physical experience."
              color="terracotta"
            />

            <PhilosophyCard
              icon={<Moon className="h-8 w-8" />}
              title="Planetary Wisdom"
              description="We use the movements of the planets as a powerful framework for personal growth, self-reflection, and renewal, honoring ancient traditions in a modern context."
              color="gold"
            />

            <PhilosophyCard
              icon={<HandHelping className="h-8 w-8" />}
              title="Embodied Practice"
              description="We believe true transformation happens when we honor the body's wisdom through intentional awareness, movement, and inspired action."
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
    olive: "text-forest",
    terracotta: "text-copper",
    gold: "text-gold",
    deepblue: "text-foreground",
  }[color];

  return (
    <motion.div
      className="bg-muted/40 p-8 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className={`text-3xl mb-4 ${colorClass}`}>{icon}</div>
      <h3 className="font-playfair tracking-widest uppercase font-light text-xl mb-3 text-foreground">{title}</h3>
      <p className="text-espresso">{description}</p>
    </motion.div>
  );
}
