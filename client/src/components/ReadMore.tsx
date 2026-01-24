import React, { useState } from "react";

interface ReadMoreProps {
  children: React.ReactNode; // Accepts HTML/JSX instead of just text
  collapsedHeight?: string; // Optional: Height when collapsed (default: h-40)
}

const ReadMore = ({ children, collapsedHeight = "h-40" }: ReadMoreProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Container determines visibility. 
        If expanded: show full height.
        If collapsed: use fixed height and hide overflow.
      */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-full" : collapsedHeight
        }`}
      >
        {children}
      </div>

      {/* Gradient Overlay (optional, makes it look smoother) */}
      {!isExpanded && (
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}

      {/* Toggle Button */}
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
