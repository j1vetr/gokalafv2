import { motion } from "framer-motion";

export const LiftingAnimation = () => {
  return (
    <div className="flex items-end h-14 w-14 pb-2 ml-2 overflow-hidden opacity-80">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        stroke="#ccff00"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Head */}
        <motion.circle 
            cx="50" 
            cy="30" 
            r="8" 
            fill="#ccff00"
            stroke="none"
            animate={{ cy: [30, 32, 30] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Body */}
        <motion.path 
            d="M50 38 L50 70 M50 70 L30 95 M50 70 L70 95" 
            animate={{ d: [
                "M50 38 L50 70 M50 70 L30 95 M50 70 L70 95", // Stand
                "M50 40 L50 72 M50 72 L25 92 M50 72 L75 92", // Squat slightly
                "M50 38 L50 70 M50 70 L30 95 M50 70 L70 95"  // Stand
            ] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Arms - Left */}
        <motion.path 
            d="M50 45 L30 45 L20 25"
            animate={{ d: [
                "M50 45 L30 45 L20 25", // Up
                "M50 48 L30 55 L20 60", // Down
                "M50 45 L30 45 L20 25"  // Up
            ] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Arms - Right */}
        <motion.path 
            d="M50 45 L70 45 L80 25"
            animate={{ d: [
                "M50 45 L70 45 L80 25", // Up
                "M50 48 L70 55 L80 60", // Down
                "M50 45 L70 45 L80 25"  // Up
            ] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Barbell */}
        <motion.g
            animate={{ y: [0, 35, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Bar */}
            <line x1="10" y1="25" x2="90" y2="25" strokeWidth="6" />
            {/* Weights Left */}
            <rect x="5" y="15" width="5" height="20" fill="#ccff00" stroke="none" />
            <rect x="12" y="18" width="3" height="14" fill="#ccff00" stroke="none" />
            {/* Weights Right */}
            <rect x="90" y="15" width="5" height="20" fill="#ccff00" stroke="none" />
            <rect x="85" y="18" width="3" height="14" fill="#ccff00" stroke="none" />
        </motion.g>
      </svg>
    </div>
  );
};
