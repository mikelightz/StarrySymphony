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
        // 1. ADD "relative" here so the absolute gradient positions itself inside THIS box
        className="overflow-hidden relative"
        initial={false}
        animate={{ height: isExpanded ? "auto" : collapsedHeight }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {children}

        {/* 2. MOVED INSIDE: The gradient now lives here */}
        {!isExpanded && collapsedHeight !== "0px" && (
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
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
