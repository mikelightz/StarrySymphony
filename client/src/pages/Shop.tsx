import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Product } from "@/types";

export default function Shop() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/products"],
  });

  // Define an array of product IDs to hide
  const productsToHide = [1, 2, 3, 4];

  // Filter the hardcoded products
  const filteredHardcodedProducts = [
    {
      id: 1,
      name: "Somatic Moon Journal",
      price: 27.0,
      type: "DIGITAL",
      description:
        "Our beautifully designed digital journal that combines lunar wisdom with somatic awareness practices. Includes fillable PDF pages, moon phase calendars, and embodiment exercises.",
      imageUrl:
        "https://images.unsplash.com/photo-1544967082-d9d25d867d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
    },
    {
      id: 2,
      name: "Somatic Moon Journal",
      price: 45.0,
      type: "PRINT",
      description:
        "A beautifully crafted physical journal printed on premium recycled paper. Features guidance for each moon phase, somatic check-ins, and plenty of space for reflection.",
      imageUrl:
        "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
    },
    {
      id: 3,
      name: "Moon Masterclass",
      price: 197.0,
      type: "COURSE",
      description:
        "A comprehensive online course to deepen your connection with lunar cycles. Includes 8 video modules, guided practices, and printable resources.",
      imageUrl:
        "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
    },
    {
      id: 4,
      name: "Lunar Self-Care Bundle",
      price: 225.0,
      originalPrice: 269.0,
      type: "BUNDLE",
      description:
        "The complete lunar wellness package: Print journal, Moon Masterclass, and a 1:1 session to get personalized guidance for your journey.",
      imageUrl:
        "https://images.unsplash.com/photo-1501139083538-0139583c060f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
    },
    {
      id: 7,
      name: "Her Moon: Lunar Self-Care Journal",
      price: 18.0,
      type: "PRINT",
      description: "This journal was created as a simple invitation to return to the body.\n\nIn a world that constantly pulls us outward, it offers a sacred space to slow down, soften, and reconnect with the subtle language that lives within you. Each page becomes a reflection guiding you back into presence and true embodiment.\n\nCharged by the magic of the moon and inspired by the wisdom of the feminine cycle, this journal gently supports you in attuning to your natural rhythms. It becomes a place where you can learn your patterns, honor your emotions, and rediscover the divine intelligence of your body.",
      imageUrl: "/images/lunar_journal_banner.png",
    },
    {
      id: 8,
      name: "Her Moon: Sacred Scents Candle",
      price: 15.0,
      type: "PRODUCT",
      description: "Her Moon: Sea Salt & Orchid Sacred Scents Candle.\n\nSea salt and orchid mingle softly, carrying the freshness of the ocean and the delicate sweetness of blooming petals. Each flicker becomes a quiet invitation to return to your body, to pause, and to feel the subtle currents of your own inner landscape.\n\nThis candle is more than fragrance—it is a small ritual, a luminous companion for reflection, journaling, or simply calling in more presence. Its scent guides you gently to attune with the natural rhythms of your body and the subtle magic of the moonlit cycles.",
      imageUrl: "/images/candle_banner.png",
    },
    {
      id: 5,
      name: "AstroSomatics Guidebook",
      price: 22.0,
      type: "DIGITAL",
      description: "The AstroSomatic guidebook bridges astrology and embodiment, helping you reconnect with your body’s natural intelligence through the cosmic blueprint of the zodiac.\n\nWhether you’re navigating tension, burnout, emotional waves, or simply seeking deeper alignment—this guidebook offers a compassionate, somatic path home to yourself.\n\nWhat’s Inside:\n    •    12 in-depth sections on each zodiac sign and its associated body parts + emotional themes\n    •    Somatic practices for breath, touch, movement, and voice—customized to each sign\n    •    Herbal allies + embodiment tools for nervous system support\n    •    Journal prompts + reflections to uncover the deeper story living in your soma\n    •    Quick-reference zodiac body chart for daily awareness or symptom mapping\n    •    A lovingly written overview of medical astrology to connect body and cosmos\n    •    Encouragement to follow your intuition over perfection",
      imageUrl: "/images/Guidebook_Banner.png",
    },
    {
      id: 6,
      name: "Astro Self Study Journal",
      price: 44.0,
      type: "PRINT",
      description: "The Astro Self-Study Journal is more than a journal, it’s a portal to your inner universe. Created as a fully customizable, heart-led guide, this 246-page journey invites you to gently unravel the story written in your stars and anchor it into embodied, earthly wisdom.\n\nFrom the emotional tides of your Moon sign to the soul-aligned calling of your North Node, this journal offers a beautifully organized space to explore your personal astrology—Sun through Chiron, and all the luminaries in between. Whether you're a seasoned stargazer or just beginning your astrological path, this tool helps you connect the celestial dots of your birth chart with deep intention.",
      imageUrl: "/images/Journal_Banner.png",
    },
  ].filter((product) => !productsToHide.includes(product.id)); // Filter hardcoded products

  return (
    <div className="pt-24 pb-16 bg-neutral bg-opacity-20">
      <div className="container-custom max-w-5xl">
        <motion.h1
          className="font-playfair tracking-widest uppercase font-light text-4xl md:text-5xl text-center mb-16 text-foreground"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          Shop
        </motion.h1>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-copper rounded-full border-t-transparent animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {!products || products.length === 0 ? (
              // Use the filtered hardcoded products here
              <>
                {filteredHardcodedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBuyClick={
                      product.id === 5
                        ? () =>
                          window.open(
                            "https://payhip.com/b/bPHMX",
                            "_blank",
                            "noopener,noreferrer"
                          )
                        : product.id === 6
                          ? () =>
                            window.open(
                              "https://www.amazon.com/dp/B0FWN7MK3V/?_encoding=UTF8&ref_=navm_hdr_signin",
                              "_blank",
                              "noopener,noreferrer"
                            )
                          : product.id === 7
                            ? () =>
                              window.open(
                                "https://omflorwellness.printful.me/product/her-moon-journal-sacred-rhythm-keeper",
                                "_blank",
                                "noopener,noreferrer"
                              )
                            : product.id === 8
                              ? () =>
                                window.open(
                                  "https://omflorwellness.printful.me/product/scented-soy-candle",
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              : undefined
                    }
                  />
                ))}
              </>
            ) : (
              // Filter products fetched from the API
              products
                .filter(
                  (product: Product) => !productsToHide.includes(product.id)
                )
                .map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onBuyClick?: () => void;
}

function ProductCard({
  product,
  onBuyClick,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 flex flex-col"
        style={{
          transform: isHovered ? "scale(1.03)" : "scale(1)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover"
        />

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-playfair tracking-widest uppercase font-light text-2xl text-foreground">
              {product.name}
            </h2>
            <span
              className={`
              px-4 py-1 rounded-full text-sm text-white
              ${product.type === "DIGITAL"
                  ? "bg-foreground"
                  : product.type === "PRINT"
                    ? "bg-cloth"
                    : product.type === "COURSE"
                      ? "bg-gold"
                      : product.type === "PRODUCT"
                        ? "bg-dune"
                        : "bg-foreground"
                }
            `}
            >
              {product.type}
            </span>
          </div>

          <div className="mb-6 flex-grow">
            {product.originalPrice ? (
              <div className="flex items-center">
                <span className="text-xl font-medium text-copper">
                  ${product.price.toFixed(2)}
                </span>
                <span className="ml-3 line-through text-gray-500">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="ml-3 bg-copper text-white text-xs px-2 py-1 rounded">
                  SAVE{" "}
                  {Math.round(
                    100 - (product.price / product.originalPrice) * 100
                  )}
                  %
                </span>
              </div>
            ) : (
              <span className="text-xl font-medium text-copper">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mt-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-foreground underline bg-transparent border-none cursor-pointer p-0"
            >
              View Details
            </button>
            <button
              className="bg-verde hover:bg-opacity-90 text-white px-6 py-3 rounded-lg transition duration-300"
              onClick={onBuyClick}
            >
              Buy Now
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setIsModalOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="font-playfair tracking-widest uppercase font-light text-2xl text-foreground mb-4 pr-8">
                {product.name}
              </h3>
              {product.description ? (
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {product.description}
                </div>
              ) : (
                <p className="text-gray-500 italic">No additional details available.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
