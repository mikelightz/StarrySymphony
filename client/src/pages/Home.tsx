import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Star, Moon, Heart } from "lucide-react";
import MoonPhases from "@/components/MoonPhases";
import { fadeIn, slideUp } from "@/lib/animations";

export default function Home() {
  const [_, navigate] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Force play on mount to bypass mobile browser restrictions on standard autoPlay attributes
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Mobile browser blocked autoplay:", err);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-cloth">
      <div
        className="bg-cover bg-center bg-no-repeat w-full"
        style={{ backgroundImage: "url('/images/textures/texture-3.png')" }}
      >
        <div className="absolute inset-0 bg-noise bg-repeat pointer-events-none opacity-0 mix-blend-overlay" />
        {/* Hero Section */}
        <div className="pt-24 pb-16 md:pt-40 md:pb-32 px-4 relative z-10">
          <div className="container-custom max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            <motion.div
              initial="hidden" animate="visible" variants={fadeIn}
              className="flex-1 text-center lg:text-left z-20"
            >
              <h1 className="font-playfair text-5xl md:text-7xl lg:text-[6rem] text-cloth mb-6 md:mb-8 capitalize tracking-normal leading-[1.1]">
                OMFLOR<br />WELLNESS
              </h1>

              <motion.p
                className="text-cloth/90 md:text-espresso font-lato text-base md:text-xl font-light mb-8 md:mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed drop-shadow-md"
                initial="hidden" animate="visible" variants={slideUp}
              >
                Your Roadmap Home to Wholeness in <br className="hidden md:block" />Psyche, Soma, and Stars
              </motion.p>

              <motion.div initial="hidden" animate="visible" variants={slideUp} custom={0.3}>
                <button
                  className="bg-black/10 backdrop-blur-md text-terracota border border-terracota/30 hover:bg-terracota/80 hover:text-white hover:border-transparent px-8 py-4 rounded-full transition-all duration-300 font-lato tracking-widest text-sm uppercase shadow-lg shadow-terracota/10"
                  style={{ backgroundColor: 'hsl(var(--terracota) / 0.15)' }}
                  onClick={() => { window.open("https://payhip.com/b/isUBL", "_blank", "noopener,noreferrer"); }}
                >
                  Discover Astrosomatics
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex-1 relative w-full flex justify-center lg:justify-end mt-8 md:mt-12 lg:mt-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Arched image container */}
              <div className="relative z-10 w-[65%] sm:w-[50%] md:w-[60%] lg:w-[80%] aspect-[3/4] rounded-t-full overflow-hidden shadow-2xl bg-black/5 mx-auto lg:mr-0 lg:ml-auto">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  {/* Moved the source here and added the type attribute */}
                  <source src="/videos/v2/Cosmic_Wellness_Journey_2.mp4" type="video/mp4" />

                  {/* Fallback text just in case the browser utterly fails */}
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Background offset shape/texture placeholder */}
              <div
                className="absolute top-[8%] left-[10%] lg:-left-[10%] w-[55%] sm:w-[45%] md:w-[55%] lg:w-[70%] h-[90%] backdrop-blur-md rounded-tl-3xl -z-10 shadow-2xl"
                style={{ backgroundColor: 'hsl(var(--terracota) / 0.35)' }}
              ></div>

              {/* Planet Badge replacing the "NEW" circle */}
              <div className="absolute top-4 left-[70%] sm:top-1/4 sm:left-[80%] md:top-[10%] md:left-[70%] lg:-top-12 lg:-right-16 lg:left-auto z-20">
                <PlanetBadge />
              </div>
            </motion.div>

          </div>
        </div>

        {/* Texture Divider */}
        <div className="w-full h-24 md:h-40 relative z-20">
          <img
            src="/images/textures/texture-4.png"
            alt="Texture Divider"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Mission Section */}
        <div className="py-20 md:py-32 px-4 relative z-10">
          <div className="container-custom max-w-6xl mx-auto">

            <div className="flex flex-row items-center gap-0 max-w-5xl mx-auto relative px-2 md:px-0">

              <motion.div
                className="relative w-[45%] md:w-5/12 flex justify-end z-10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative w-full aspect-[2/3] sm:aspect-[3/4] opacity-100">
                  <img
                    src="/images/v2/IMG_0470.JPG"
                    alt="Embodiment Practice"
                    className="w-full h-full object-cover shadow-2xl rounded-sm"
                  />
                  {/* Decorative background block shifted slightly left and down */}
                  <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-8 w-3/4 h-3/4 bg-terracota/20 -z-10 rounded-sm blur-sm"></div>
                </div>
              </motion.div>

              <motion.div
                className="w-[65%] sm:w-8/12 md:bg-dune/80 bg-dune/90 backdrop-blur-md p-5 sm:p-6 md:p-12 lg:p-16 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl z-20 -ml-8 sm:-ml-12 md:-ml-16"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-4 md:space-y-6 lg:space-y-8">
                  <h2 className="font-playfair text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-gold font-normal capitalize drop-shadow-sm leading-none">
                    OUR MISSION
                  </h2>
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6 font-lato text-cloth text-[11px] sm:text-xs md:text-lg leading-relaxed md:leading-relaxed font-light drop-shadow-md max-h-[110px] sm:max-h-none overflow-y-auto scrollbar-hide">
                    <p>
                      At OmFlor Wellness, we believe that true transformation happens when we align with both our inner wisdom and the natural rhythms that surround us. Our approach combines somatic embodiment practices, astrological & earthly wisdom, and psycho-spiritual guidance to help you reconnect and reimagine yourself in a holistic way.
                    </p>
                    <p>
                      Through intentional practices and gentle awareness, we create a nurturing space for you to honor your body's wisdom and harness the power of celestial cycles for profound personal and creative expression.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/about')}
                    className="bg-cloth text-dune hover:bg-white hover:text-black px-8 py-3 rounded-sm transition-all duration-300 font-lato tracking-widest text-xs uppercase mt-6">
                    Read More
                  </button>
                </div>
              </motion.div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mt-16 md:mt-24 border-t border-border/60 pt-12 md:pt-16">
              <FeatureCard
                icon={<Moon className="h-8 w-8 md:h-10 md:w-10 text-dune" strokeWidth={1} />}
                title="Celestial Wisdom"
                description="Harness the energy of planetary movements to align your self-nourishment practices with natural cycles."
              />

              <FeatureCard
                icon={<Heart className="h-8 w-8 md:h-10 md:w-10 text-dune" strokeWidth={1} />}
                title="Embodiment"
                description="Learn to listen to your body's innate wisdom through somatic awareness practices."
              />

              <FeatureCard
                icon={<Star className="h-8 w-8 md:h-10 md:w-10 text-oliva" strokeWidth={1} />}
                title="Emotional Alchemy"
                description="Develop emotional intelligence and resilience through psychosomatic techniques."
              />
            </div>

            {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mt-20 pt-16">
              <ServiceCard
                image="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                title="Coaching"
                description="Harness the energy of moon phases to align your self-care practices with natural cycles."
              />

              <ServiceCard
                image="https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                title="Program"
                description="Learn to listen to your body's innate wisdom through somatic awareness practices."
              />

              <ServiceCard
                image="https://images.unsplash.com/photo-1600508774634-4e11d34730e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                title="Shop"
                description="Develop emotional intelligence and resilience through psychosomatic techniques."
              />
            </div>*/}
          </div>
        </div>
      </div>


      {/* Testimonials Section */}
      <div className="py-20 md:py-32 px-4 relative z-10 bg-dune/90">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-gold font-normal capitalize mb-4">
              Sacred Integrations
            </h2>
            <p className="text-clay/80 font-lato text-sm tracking-widest uppercase">
              Hear from those who have journeyed with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <TestimonialCard
              quote="The embodiment practices have completely transformed how I handle stress. I finally feel connected to my body again after years of living entirely in my head."
              author="Sarah"
            />
            <TestimonialCard
              quote="Understanding my natural rhythms through the lunar cycles has brought so much peace and productivity to my life. OmFlor's guidance is truly invaluable."
              author="Michael"
            />
          </div>
        </div>
      </div>
    </div >
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      className="bg-muted/40 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-border/30 p-6 md:p-10 flex flex-col items-center text-center transform hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="mb-4 md:mb-6 p-3 md:p-4 bg-background rounded-full">{icon}</div>
      <h3 className="font-playfair text-xl md:text-2xl mb-3 md:mb-4 text-cloth tracking-wider uppercase">{title}</h3>
      <p className="text-espresso font-lato font-light text-sm md:text-base leading-relaxed">{description}</p>
    </motion.div>
  );
}

interface ServiceCardProps {
  image: string;
  title: string;
  description: string;
}

function ServiceCard({ image, title, description }: ServiceCardProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="w-[85%] md:w-full aspect-[3/4] mb-6 overflow-hidden rounded-t-full rounded-b-md shadow-lg border-2 border-transparent group-hover:border-clay/30 transition-all duration-500">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <h3 className="font-playfair text-2xl mb-3 text-cloth capitalize">{title}</h3>
      <p className="text-cloth/90 font-lato font-light text-sm leading-relaxed mb-4 max-w-[250px]">{description}</p>
      <button className="bg-clay text-background hover:bg-dune px-6 py-2 rounded-sm text-xs tracking-widest uppercase font-lato transition-colors">
        More
      </button>
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
      className="bg-card/80 backdrop-blur-md p-8 md:p-12 rounded-3xl md:rounded-[2.5rem] shadow-lg border border-white/50 relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="absolute top-4 left-4 md:top-8 md:left-8 text-gold/20 text-4xl md:text-6xl font-prata tracking-widest uppercase font-light leading-none">&ldquo;</div>
      <div className="relative z-10">
        <div className="flex items-center mb-6 md:mb-8 gap-1">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Star
              key={index}
              className="h-4 w-4 md:h-5 md:w-5 text-gold"
              fill="currentColor"
            />
          ))}
        </div>
        <p className="font-lato font-light text-espresso leading-relaxed md:leading-loose text-base md:text-lg mb-6 md:mb-8 italic">
          {quote}
        </p>
        <p className="font-playfair text-espresso uppercase tracking-widest text-xs md:text-sm">— {author}</p>
      </div>
    </motion.div>
  );
}

function PlanetBadge() {
  return (
    <div className="w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative w-full h-full text-cloth flex items-center justify-center drop-shadow-lg"
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-90">
          <defs>
            <mask id="planet-mask">
              <rect width="100" height="100" fill="white" />
              {/* Crescent shadow simulating eclipse / planet intersection */}
              <circle cx="42" cy="50" r="24" fill="black" />
            </mask>
          </defs>

          {/* Radial Sunburst */}
          <g mask="url(#planet-mask)">
            {Array.from({ length: 90 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2="50"
                y2="4"
                stroke="currentColor"
                strokeWidth="0.6"
                transform={`rotate(${(i * 360) / 90} 50 50)`}
              />
            ))}
          </g>

          {/* Sun/Planet Core */}
          <circle cx="50" cy="50" r="7" fill="currentColor" opacity="0.95" />
          {/* Subtle outer ring */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Subtle Star Accents */}
      <Star className="absolute top-6 right-8 md:right-12 w-3 h-3 md:w-4 md:h-4 text-cloth/80 fill-cloth/80 animate-pulse" />
      <Star className="absolute bottom-6 md:bottom-8 left-6 md:left-8 w-2 h-2 md:w-3 md:h-3 text-cloth/60 fill-cloth/60 animate-pulse delay-500" />
      <Star className="absolute top-1/2 -right-4 w-2 h-2 text-cloth/70 fill-cloth/70 animate-pulse delay-1000" />
      <Star className="absolute bottom-2 md:bottom-4 right-8 w-2 h-2 text-cloth/50 fill-cloth/50 animate-pulse delay-700" />
      <Star className="absolute top-8 left-6 w-1 h-1 md:w-1.5 md:h-1.5 text-cloth/60 fill-cloth/60" />
    </div>
  );
}
