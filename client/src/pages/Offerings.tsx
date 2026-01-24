import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ReadMore from "@/components/ReadMore";
import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

export default function Offerings() {
  const { toast } = useToast();

  const addToCartMutation = useMutation({
    mutationFn: (productId: number) =>
      apiRequest("POST", "/cart/add", { productId }),
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ["/cart"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.message || "Could not add to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (productId: number) => {
    addToCartMutation.mutate(productId);
  };

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#A05E44" } }, // Terracotta color
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        <motion.h1
          className="font-playfair text-4xl md:text-5xl text-center mb-16 text-deepblue"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          Offerings
        </motion.h1>

        {/* 1:1 Sessions */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row gap-8">
              {/* An image showing a coaching or counseling session */}
              <div className="md:w-1/3 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80"
                  alt="One-on-one counseling session"
                  className="w-full h-auto"
                />
              </div>

              <div className="md:w-2/3">
                <h2 className="font-playfair text-2xl mb-4 text-terracotta">
                  1:1 AstroSomatic Sessions
                </h2>
                <p className="text-gray-700 mb-4">
                  These private sessions are a sanctuary for coming back into
                  relationship with your body, your emotions, and the grander
                  rhythms guiding your life.
                </p>
                <p>
                  Blending somatic awareness, astrology, and emotional
                  integration, our work together supports you in understanding
                  not just what is happening in your life, but how it is alive
                  in your body. Each session is intuitive, personalized, and
                  paced to meet your nervous system with care.
                </p>

                <div className="mb-6 mt-8">
                  <h3 className="font-medium text-deepblue mb-2">
                    In our sessions, we may explore:
                  </h3>

                  <ReadMore collapsedHeight="0px">
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>
                        <b>Somatic Moon Work:</b> Working with the lunar cycle
                        as a mirror for your inner rhythms, helping you attune
                        to your body’s changing needs and emotional tides.
                      </li>
                      <li>
                        <b>Astrological Embodiment:</b> Translating planetary
                        movements and natal placements into lived, physical, and
                        emotional experience, so insight becomes integration.
                      </li>
                      <li>
                        <b>Emotional Integration:</b> Gently processing stored
                        patterns, stress, and emotional residue through
                        body-centered awareness rather than force or analysis.
                      </li>
                      <li>
                        <b>Custom Supportive Practices:</b> Simple, personalized
                        practices to help you stay connected and supported
                        between sessions.
                      </li>
                    </ul>
                    <p className="text-gray-700 mt-4 mb-4">
                      These sessions are ideal if you’re seeking deeper
                      self-trust, emotional clarity, and a more embodied
                      relationship with your life path.
                    </p>
                  </ReadMore>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* BUTTON 1: Single Session */}
                  <button
                    data-cal-link="omflorwellness/60min?overlayCalendar=true" // Check this slug in Cal.com!
                    data-cal-config='{"layout":"month_view"}'
                    className="bg-terracotta text-white px-6 py-3 rounded-lg text-center hover:bg-opacity-90 active:scale-95 transform transition-transform duration-100 w-full sm:w-auto"
                  >
                    BOOK NOW
                  </button>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* AstroSomatic Rebirth Intensive */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3 order-2 md:order-1">
                <h2 className="font-playfair text-2xl mb-4 text-terracotta">
                  AstroSomatic Rebirth Intensive: A 10-Day Transformative
                  Immersion
                </h2>
                <p className="text-gray-700 mb-4">
                  This 10-day immersion is a call to transform into your highest
                  expression . A guided descent and renewal designed to support
                  profound recalibration in body, psyche, and soul.
                </p>
                <p>
                  The AstroSomatic Rebirth Intensive weaves somatic practice,
                  astrological insight, and emotional integration into a
                  cohesive journey of release, remembrance, and re-embodiment.
                  Over ten days, we work slowly and intentionally, allowing
                  deeper layers of patterning to surface, soften, and reorganize
                  in alignment with your natural rhythms.
                </p>
                <p>
                  This is about creating the conditions for your nervous system
                  to shed what it has outgrown and reorganize around truth,
                  vitality, and inner authority.
                </p>

                <div className="mb-6 mt-8">
                  <h3 className="font-medium text-deepblue mb-2">
                    Within this immersion, we may explore:
                  </h3>

                  <ReadMore collapsedHeight="0px">
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>
                        <b>Somatic Repatterning & Nervous System Reset:</b>{" "}
                        Guided body-based practices that support the release of
                        stored stress, emotional residue, and outdated survival
                        responses, allowing your system to find greater safety
                        and coherence.
                      </li>
                      <li>
                        <b>Astrological Initiation & Embodiment</b>
                        Deep exploration of your natal chart and current
                        transits as living forces within your body and emotional
                        field, helping you consciously integrate cycles of
                        death, rebirth, and becoming.
                      </li>
                      <li>
                        <b>Emotional Alchemy & Integration</b>
                        Spacious, compassionate processing of core themes, life
                        transitions, and identity shifts, meeting emotions as
                        intelligence rather than obstacles.
                      </li>
                      <li>
                        <b>Ritual, Reflection & Personalized Practices</b>
                        Intentionally designed practices, prompts, and rituals
                        to support integration throughout the 10 days, anchoring
                        insight into lived experience.
                      </li>
                    </ul>
                    <p className="text-gray-700 mt-4 mb-4">
                      This immersion is ideal for those standing at a life
                      threshold, moving through major transition, or feeling the
                      call to shed an old skin and step into a more embodied,
                      aligned way of being.
                    </p>
                    <p>It is a return to the body as the compass.</p>
                    <p>A reclamation of inner timing.</p>
                    <p>
                      {" "}
                      A rebirth guided by both the stars and your own deep
                      knowing.{" "}
                    </p>
                  </ReadMore>
                </div>

                {/* Button connecting to Stripe */}
                <a
                  href="https://buy.stripe.com/aFa14o3J98P9fkmgvkgEg02" // Paste your Stripe URL here
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-terracotta text-white px-6 py-3 rounded-lg text-center hover:bg-opacity-90 active:scale-95 transform transition-transform duration-100 w-full sm:w-auto cursor-pointer"
                >
                  BOOK NOW
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Visionaries’ Homecoming */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row gap-8">
              {/*<div className="md:w-1/3 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80"
                  alt="Moon journal with celestial elements"
                  className="w-full h-auto"
                />
              </div> */}

              <div className="md:w-2/3">
                <h2 className="font-playfair text-2xl mb-4 text-terracotta">
                  The Visionaries’ Homecoming: A 3-Month Signature Container
                </h2>
                <p className="text-gray-700 mb-4">
                  The Homecoming Journey is a three-month immersion for
                  creatives, entrepreneurs, and change-makers who feel the pull
                  toward their next level of expression, impact, and alignment.
                </p>
                <p>
                  This container is designed as a season of elevation. Three
                  intentional months devoted to aligning your body, your vision,
                  and your real-world stategy so that what you create, lead, and
                  offer is no longer at odds with your nervous system, energy,
                  or soul blueprint.
                </p>
                <p>
                  Rather than hustling toward success or bypassing the body in
                  pursuit of vision, this journey supports you in building a
                  life and body that can actually hold what you are here to
                  bring through.
                </p>

                <div className="mb-6 mt-8">
                  <h3 className="font-medium text-deepblue mb-2">
                    Within this journey, we may explore:
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2">
                    <li>
                      <b>Somatic Leadership & Capacity Building</b>
                      Ongoing body-based work that expands your nervous system’s
                      ability to hold visibility, responsibility, creativity,
                      and growth without burnout or collapse.
                    </li>
                    <li>
                      <b>Astrological Design & Strategic Timing</b>
                      Deep attunement to your natal chart, transits, and
                      seasonal cycles as a blueprint for aligned
                      decision-making, sustainable momentum, and life and
                      business strategy that honors your unique design.
                    </li>
                    <li>
                      <b>Emotional Alchemy for Creators & Leaders</b>
                      Conscious integration of fear, self-doubt, creative
                      blocks, and identity shifts, meeting emotional patterns as
                      intelligence that informs your next evolution rather than
                      obstacles to overcome.
                    </li>
                    <li>
                      <b>Embodied Vision & Real-World Integration</b>
                      Personalized practices, reflections, and strategy prompts
                      that bridge inner work with tangible action, helping your
                      vision land in the world in a way that feels grounded,
                      resourced, and true.
                    </li>
                  </ul>
                  <p className="text-gray-700 mt-4 mb-4">
                    This container is ideal for those who know they are here to
                    build, lead, or create something meaningful and are ready to
                    do so without self-betrayal, depletion, or misalignment.
                  </p>
                  <p>Three months – One season.</p>
                  <p>
                    A deliberate recalibration of how you live, lead, and
                    create.
                  </p>
                  <p>
                    The Visionaries Homecoming is designed to shape the way you
                    move through every season, guided by embodied wisdom,
                    strategic clarity, and deep trust in your own divine design.
                  </p>
                </div>

                {/* Button connecting to Stripe */}
                <a
                  href="https://buy.stripe.com/4gM8wQfrRaXhfkm6UKgEg03" // Paste your Stripe URL here
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-terracotta text-white px-6 py-3 rounded-lg text-center hover:bg-opacity-90 active:scale-95 transform transition-transform duration-100 w-full sm:w-auto cursor-pointer"
                >
                  BOOK NOW
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Moon Masterclass 
        * <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3 order-2 md:order-1">
                <h2 className="font-playfair text-2xl mb-4 text-terracotta">
                  Moon Masterclass
                </h2>
                <p className="text-gray-700 mb-4">
                  A comprehensive online course that teaches you how to work
                  with lunar cycles for self-discovery, emotional wellness, and
                  embodied living. Learn to create personalized rituals and
                  practices aligned with each moon phase.
                </p>

                <div className="mb-6 mt-8">
                  <h3 className="font-medium text-deepblue mb-2">
                    This masterclass includes:
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2">
                    <li>
                      8 video modules covering each moon phase and its unique
                      energetic qualities
                    </li>
                    <li>Guided somatic practices for embodying lunar wisdom</li>
                    <li>Journaling prompts and reflection exercises</li>
                    <li>Printable lunar tracking tools and calendars</li>
                    <li>
                      Bonus: Seasonal ritual guides for solstices and equinoxes
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <p className="text-lg font-medium text-deepblue mb-2">
                    Investment: $197
                  </p>
                  <Link href="/moon-masterclass">
                    <button className="bg-deepblue text-white px-6 py-3 rounded-lg inline-block hover:bg-opacity-90 transition duration-300">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>

               * A celestial image related to moon phases *
              <div className="md:w-1/3 order-1 md:order-2 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1532767153582-b1a0e5145009?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80"
                  alt="Moon phases illustration"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </motion.div>
      

        * The Somatic Moon Journal *
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row gap-8">
              * An image of a journal with celestial elements *
              <div className="md:w-1/3 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80"
                  alt="Moon journal with celestial elements"
                  className="w-full h-auto"
                />
              </div>

              <div className="md:w-2/3">
                <h2 className="font-playfair text-2xl mb-4 text-terracotta">
                  The Somatic Moon Journal
                </h2>
                <p className="text-gray-700 mb-4">
                  A beautiful guided journal that combines lunar wisdom with
                  somatic awareness practices. Track the moon's cycles while
                  deepening your connection to your body's innate wisdom.
                </p>

                <div className="mb-6 mt-8">
                  <h3 className="font-medium text-deepblue mb-2">Features:</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2">
                    <li>Monthly lunar calendars with phase information</li>
                    <li>Guided prompts for each moon phase</li>
                    <li>Body mapping exercises and somatic check-in pages</li>
                    <li>Emotional awareness tools and tracking systems</li>
                    <li>Space for reflection and intention setting</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      className="bg-gold text-white px-6 py-3 rounded-lg text-center hover:bg-opacity-90 transition duration-300"
                      onClick={() => handleAddToCart(1)}
                    >
                      Digital Version ($27)
                    </button>
                    <button
                      className="bg-terracotta text-white px-6 py-3 rounded-lg text-center hover:bg-opacity-90 transition duration-300"
                      onClick={() => handleAddToCart(2)}
                    >
                      Print Version ($45)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        */}
      </div>
    </div>
  );
}
