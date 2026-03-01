import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Star, Moon, Heart } from "lucide-react";
import MoonPhases from "@/components/MoonPhases";
import { fadeIn, slideUp } from "@/lib/animations";

export default function Home() {
  const [_, navigate] = useLocation();

  return (
    <>
      {/* Fixed Background with abstract fluid shapes and linen texture */}
      <div className="fixed inset-0 z-0 bg-background bg-texture-linen">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-floral-gradient opacity-40 shape-blob-1 animate-float blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vh] bg-golden-glow opacity-60 shape-blob-2 animate-pulse-glow blur-3xl pointer-events-none" />
      </div>

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden z-10 pt-20">
        <div className="container-custom text-center relative p-8 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial="hidden" animate="visible" variants={fadeIn}
            className="mb-8"
          >
            <span className="text-gold text-4xl animate-pulse-glow inline-block mb-8">✧</span>
            <h1 className="font-circe text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 uppercase tracking-[0.15em] text-shadow-moonlight font-light leading-tight">
              Omflor Wellness
            </h1>
          </motion.div>

          <motion.p
            className="text-muted-foreground font-lato text-lg md:text-2xl font-light mb-14 max-w-2xl mx-auto tracking-widest leading-relaxed uppercase"
            initial="hidden" animate="visible" variants={slideUp}
          >
            Your Roadmap Home to Wholeness—<br />Mind, Body and Spirit
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={slideUp} custom={0.3}>
            <button
              className="bg-transparent border border-copper text-copper hover:bg-copper hover:text-white px-10 py-4 rounded-full inline-block transition-all duration-500 font-lato tracking-[0.2em] text-sm uppercase shadow-sm hover:shadow-lg"
              onClick={() => { window.open("https://payhip.com/b/isUBL", "_blank", "noopener,noreferrer"); }}
            >
              Discover AstroSomatics
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-32 px-4 relative z-10">
        <div className="container-custom max-w-6xl mx-auto bg-card/60 backdrop-blur-xl rounded-[3rem] p-10 md:p-20 shadow-xl border border-white/40">
          <div className="relative z-10">

            <div className="flex justify-center mb-8">
              <span className="text-copper text-3xl">✺</span>
            </div>

            <h2 className="font-circe text-4xl md:text-5xl lg:text-6xl mb-16 text-center text-foreground tracking-widest font-light uppercase">
              Our Mission
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left mb-24">
              <div className="space-y-8 font-lato text-lg text-muted-foreground leading-loose font-light">
                <p>
                  At OmFlor Wellness, we believe that true healing happens when we
                  align with both our inner wisdom and the natural rhythms that
                  surround us. Our approach combines embodiment practices, lunar
                  wisdom, and psychosomatic guidance to help you reconnect with
                  yourself on a deeper level.
                </p>
                <p>
                  Through intentional practices and gentle awareness, we create
                  space for you to honor your body's wisdom and harness the power of
                  lunar cycles for profound personal transformation.
                </p>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gold/30 shape-blob-3 blur-2xl transform translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-700"></div>
                <img
                  src="/images/new_1.jpg"
                  alt="Serene sanctuary space with soft lighting"
                  className="w-full h-auto rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-xl rounded-bl-xl shadow-lg relative z-10 object-cover aspect-[4/3] grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 border-t border-border/60 pt-16">
              <ServiceCard
                icon={<Moon className="h-10 w-10 text-moonlight" strokeWidth={1} />}
                title="Celestial Wisdom"
                description="Harness the energy of moon phases to align your self-care practices with natural cycles."
              />

              <ServiceCard
                icon={<Heart className="h-10 w-10 text-copper" strokeWidth={1} />}
                title="Embodiment"
                description="Learn to listen to your body's innate wisdom through somatic awareness practices."
              />

              <ServiceCard
                icon={<Star className="h-10 w-10 text-gold" strokeWidth={1} />}
                title="Emotional Alchemy"
                description="Develop emotional intelligence and resilience through psychosomatic techniques."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-32 px-4 relative z-10 bg-gradient-to-b from-transparent to-moonlight-glow">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-gold text-2xl mb-6 inline-block">✧</span>
            <h2 className="font-circe text-4xl md:text-5xl lg:text-6xl text-foreground font-light tracking-widest uppercase mb-4">
              Lunar Transformations
            </h2>
            <p className="text-muted-foreground font-lato text-lg max-w-2xl mx-auto font-light">
              Hear from those who have journeyed to wholeness with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
      className="bg-background/40 backdrop-blur-sm rounded-3xl border border-white/30 p-10 flex flex-col items-center text-center transform hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="mb-6 p-4 bg-white/40 rounded-full">{icon}</div>
      <h3 className="font-circe text-2xl mb-4 text-foreground tracking-wider uppercase">{title}</h3>
      <p className="text-muted-foreground font-lato font-light leading-relaxed">{description}</p>
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
      className="bg-card/80 backdrop-blur-md p-12 rounded-[2.5rem] shadow-lg border border-white/50 relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="absolute top-8 left-8 text-gold/20 text-6xl font-circe tracking-widest uppercase font-light leading-none">"</div>
      <div className="relative z-10">
        <div className="flex items-center mb-8 gap-1">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Star
              key={index}
              className="h-5 w-5 text-gold"
              fill="currentColor"
            />
          ))}
        </div>
        <p className="font-lato font-light text-muted-foreground leading-loose text-lg mb-8 italic">
          {quote}
        </p>
        <p className="font-circe text-foreground uppercase tracking-widest text-sm">— {author}</p>
      </div>
    </motion.div>
  );
}
