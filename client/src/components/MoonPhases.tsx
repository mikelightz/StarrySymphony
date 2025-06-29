import React from "react";

interface MoonPhasesProps {
  color?: "deepblue" | "gold";
  centerSize?: number;
}

export default function MoonPhases({ 
  color = "deepblue",
  centerSize = 10
}: MoonPhasesProps) {
  const colorClass = color === "gold" ? "bg-gold" : "bg-deepblue";
  
  const phases = [
    { size: 2, opacity: "opacity-20" },
    { size: 3, opacity: "opacity-30" },
    { size: 4, opacity: "opacity-40" },
    { size: 5, opacity: "opacity-60" },
    { size: 6, opacity: "opacity-80" },
    { size: centerSize, opacity: "opacity-100" },
    { size: 6, opacity: "opacity-80" },
    { size: 5, opacity: "opacity-60" },
    { size: 4, opacity: "opacity-40" },
    { size: 3, opacity: "opacity-30" },
    { size: 2, opacity: "opacity-20" },
  ];
  
  return (
    <div className="flex justify-center items-center space-x-3">
      {phases.map((phase, index) => (
        <div 
          key={index} 
          className={`w-${phase.size} h-${phase.size} rounded-full ${colorClass} ${phase.opacity}`}
          style={{ width: `${phase.size * 4}px`, height: `${phase.size * 4}px` }}
        />
      ))}
    </div>
  );
}
