import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";

export default function Shop() {
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ["/products"],
  });

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
    <div className="pt-24 pb-16 bg-neutral bg-opacity-20">
      <div className="container-custom max-w-5xl">
        <motion.h1
          className="font-playfair text-4xl md:text-5xl text-center mb-16 text-deepblue"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          Shop
        </motion.h1>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-terracotta rounded-full border-t-transparent animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fallback to hardcoded products if API fails */}
            {!products || products.length === 0 ? (
              <>
                <ProductCard
                  product={{
                    id: 1,
                    name: "Somatic Moon Journal",
                    price: 27.0,
                    type: "DIGITAL",
                    description:
                      "Our beautifully designed digital journal that combines lunar wisdom with somatic awareness practices. Includes fillable PDF pages, moon phase calendars, and embodiment exercises.",
                    imageUrl:
                      "https://images.unsplash.com/photo-1544967082-d9d25d867d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
                  }}
                  onAddToCart={handleAddToCart}
                />

                <ProductCard
                  product={{
                    id: 2,
                    name: "Somatic Moon Journal",
                    price: 45.0,
                    type: "PRINT",
                    description:
                      "A beautifully crafted physical journal printed on premium recycled paper. Features guidance for each moon phase, somatic check-ins, and plenty of space for reflection.",
                    imageUrl:
                      "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
                  }}
                  onAddToCart={handleAddToCart}
                />

                <ProductCard
                  product={{
                    id: 3,
                    name: "Moon Masterclass",
                    price: 197.0,
                    type: "COURSE",
                    description:
                      "A comprehensive online course to deepen your connection with lunar cycles. Includes 8 video modules, guided practices, and printable resources.",
                    imageUrl:
                      "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
                  }}
                  onAddToCart={handleAddToCart}
                />

                <ProductCard
                  product={{
                    id: 4,
                    name: "Lunar Self-Care Bundle",
                    price: 225.0,
                    originalPrice: 269.0,
                    type: "BUNDLE",
                    description:
                      "The complete lunar wellness package: Print journal, Moon Masterclass, and a 1:1 session to get personalized guidance for your journey.",
                    imageUrl:
                      "https://images.unsplash.com/photo-1501139083538-0139583c060f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
                  }}
                  onAddToCart={handleAddToCart}
                />
              </>
            ) : (
              products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
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
  onAddToCart: (productId: number) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300"
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

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-playfair text-2xl text-deepblue">
            {product.name}
          </h2>
          <span
            className={`
            px-4 py-1 rounded-full text-sm text-white
            ${
              product.type === "DIGITAL"
                ? "bg-deepblue"
                : product.type === "PRINT"
                ? "bg-terracotta"
                : product.type === "COURSE"
                ? "bg-gold"
                : "bg-deepblue"
            }
          `}
          >
            {product.type}
          </span>
        </div>

        <div className="mb-4">
          {product.originalPrice ? (
            <div className="flex items-center">
              <span className="text-xl font-medium text-terracotta">
                ${product.price.toFixed(2)}
              </span>
              <span className="ml-3 line-through text-gray-500">
                ${product.originalPrice.toFixed(2)}
              </span>
              <span className="ml-3 bg-terracotta text-white text-xs px-2 py-1 rounded">
                SAVE{" "}
                {Math.round(
                  100 - (product.price / product.originalPrice) * 100
                )}
                %
              </span>
            </div>
          ) : (
            <span className="text-xl font-medium text-terracotta">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <p className="text-gray-700 mb-6">{product.description}</p>

        <div className="flex justify-between items-center">
          <a href="#" className="text-deepblue underline">
            View Details
          </a>
          <button
            className="bg-olive hover:bg-opacity-90 text-white px-6 py-3 rounded-lg transition duration-300"
            onClick={() => onAddToCart(product.id)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
