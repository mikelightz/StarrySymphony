import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Optional if you want smoother animations later

interface ReadMoreProps {
  children: React.ReactNode;
  collapsedHeight?: string;
}

const ReadMore = ({ children, collapsedHeight = "h-40" }: ReadMoreProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-full" : collapsedHeight
        }`}
      >
        {children}
      </div>

      {/* FIX: Added check (&& collapsedHeight !== "h-0") 
         Only show the fade if it's NOT expanded AND the height is NOT zero.
      */}
      {!isExpanded && collapsedHeight !== "h-0" && (
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
