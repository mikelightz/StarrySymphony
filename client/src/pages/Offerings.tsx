import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
                  1:1 Sessions
                </h2>
                <p className="text-gray-700 mb-4">
                  Personalized guidance that combines somatic awareness,
                  astrological insights, and emotional processing techniques to
                  help you navigate your unique journey with greater ease and
                  alignment.
                </p>

                <div className="mb-6 mt-8">
                  <h3 className="font-medium text-deepblue mb-2">
                    Our sessions include:
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2">
                    <li>
                      Somatic Moon Work: Connect with your body's wisdom through
                      the lunar cycle
                    </li>
                    <li>
                      Astrological Embodiment: Understand how planetary energies
                      manifest in your physical and emotional experience
                    </li>
                    <li>
                      Emotional Integration: Process and transform challenging
                      patterns with gentle, body-centered approaches
                    </li>
                    <li>
                      Custom practices to support your journey between sessions
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <p className="text-lg font-medium text-deepblue mb-2">
                    Session Options:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://calendly.com/omflorwellness/30min?month=2025-05"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-terracotta text-white px-6 py-3 rounded-lg text-center hover:bg-opacity-90 transition duration-300"
                    >
                      Single Session ($120)
                    </a>
                    <a
                      href="https://calendly.com/omflorwellness/new-meeting"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-olive text-white px-6 py-3 rounded-lg text-center hover:bg-opacity-90 transition duration-300"
                    >
                      Package of 4 ($425)
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Moon Masterclass */}
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

              {/* A celestial image related to moon phases */}
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

        {/* The Somatic Moon Journal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row gap-8">
              {/* An image of a journal with celestial elements */}
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
      </div>
    </div>
  );
}
