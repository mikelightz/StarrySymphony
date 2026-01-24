import React, { useState } from "react";
import { motion } from "framer-motion";

interface ReadMoreProps {
  children: React.ReactNode;
  // We'll use a string for height now (e.g. "0px" or "10rem") to help the animation
  collapsedHeight?: string;
}

const ReadMore = ({ children, collapsedHeight = "10rem" }: ReadMoreProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <motion.div
        // Animate the height property
        initial={false}
        animate={{ height: isExpanded ? "auto" : collapsedHeight }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>

      {/* Gradient Overlay - Only shows if NOT expanded and height is NOT 0 */}
      {!isExpanded && collapsedHeight !== "0px" && (
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-terracotta font-bold hover:underline focus:outline-none"
      >
        {isExpanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
};

export default ReadMore;
