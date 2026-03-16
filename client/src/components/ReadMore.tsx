import React, { useState } from "react";
import { motion } from "framer-motion";

interface ReadMoreProps {
  children: React.ReactNode;
  collapsedHeight?: string;
}

const ReadMore = ({ children, collapsedHeight = "10rem" }: ReadMoreProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <motion.div
        className="overflow-hidden relative"
        initial={false}
        animate={{ height: isExpanded ? "auto" : collapsedHeight }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={!isExpanded ? { 
          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', 
          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' 
        } : undefined}
      >
        {children}
      </motion.div>

      {/* Button is now completely separate from the gradient */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 text-copper font-bold hover:underline focus:outline-none uppercase tracking-wide text-sm"
      >
        {isExpanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
};

export default ReadMore;
