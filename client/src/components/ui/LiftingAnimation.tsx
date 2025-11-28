import { motion } from "framer-motion";

export const LiftingAnimation = () => {
  return (
    <div className="flex items-end h-16 w-24 pb-1 ml-2 overflow-hidden opacity-90">
      <svg
        viewBox="0 0 200 100"
        className="w-full h-full"
        fill="none"
        stroke="#ccff00"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Bench */}
        <path d="M20 75 L100 75 L100 90 M30 75 L30 90" stroke="#444" strokeWidth="4" />
        <path d="M15 75 L105 75" stroke="#ccff00" strokeWidth="2" />

        {/* Muscular Body (Lying down) - Side View */}
        <motion.g
           initial={{ y: 0 }}
        >
            {/* Head */}
            <ellipse cx="35" cy="68" rx="8" ry="6" stroke="#ccff00" fill="none" />
            
            {/* Torso (Arch) */}
            <path d="M42 70 Q 60 60 80 70" stroke="#ccff00" strokeWidth="4" fill="none" />
            
            {/* Legs (Bent) */}
            <path d="M80 70 L95 60 L100 90" stroke="#ccff00" strokeWidth="4" fill="none" />
        </motion.g>

        {/* Arms & Barbell Animation */}
        <motion.g
            animate={{ y: [0, -25, 0] }} // Push up movement
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Arm (Shoulder to Elbow to Hand) */}
            <motion.path 
                d="M50 65 L50 65 L50 65" // Initial placeholder
                animate={{ d: [
                    "M50 65 L55 50 L50 35", // Down (Elbow bent)
                    "M50 65 L50 45 L50 15", // Up (Straight)
                    "M50 65 L55 50 L50 35"  // Down
                ]}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                stroke="#ccff00" 
                strokeWidth="3"
            />

            {/* Barbell Plates */}
            <line x1="20" y1="35" x2="80" y2="35" stroke="#ccff00" strokeWidth="2" />
            {/* Weights */}
            <rect x="25" y="20" width="5" height="30" fill="#ccff00" stroke="none" rx="1" />
            <rect x="32" y="24" width="3" height="22" fill="#ccff00" stroke="none" rx="1" />
            <rect x="70" y="20" width="5" height="30" fill="#ccff00" stroke="none" rx="1" />
            <rect x="65" y="24" width="3" height="22" fill="#ccff00" stroke="none" rx="1" />
        </motion.g>
      </svg>
    </div>
  );
};
