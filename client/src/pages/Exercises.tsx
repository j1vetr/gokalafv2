import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Search, Dumbbell, X, RotateCcw, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";
import type { Exercise } from "@shared/schema";

interface ExercisesResponse {
  exercises: Exercise[];
  total: number;
}

const levelLabels: Record<string, string> = {
  beginner: "Başlangıç",
  intermediate: "Orta",
  expert: "İleri",
};

const muscleLabels: Record<string, string> = {
  abdominals: "Karın",
  abductors: "Dış Bacak",
  adductors: "İç Bacak",
  biceps: "Biceps",
  calves: "Baldır",
  chest: "Göğüs",
  forearms: "Ön Kol",
  glutes: "Kalça",
  hamstrings: "Arka Bacak",
  lats: "Sırt (Lat)",
  "lower back": "Alt Sırt",
  "middle back": "Orta Sırt",
  neck: "Boyun",
  quadriceps: "Ön Bacak",
  shoulders: "Omuz",
  traps: "Trapez",
  triceps: "Triceps",
};

const equipmentLabels: Record<string, string> = {
  barbell: "Halter",
  "body only": "Vücut Ağırlığı",
  cable: "Kablo",
  dumbbell: "Dambıl",
  "e-z curl bar": "EZ Bar",
  "exercise ball": "Pilates Topu",
  "foam roll": "Foam Roller",
  kettlebells: "Kettlebell",
  machine: "Makine",
  "medicine ball": "Sağlık Topu",
  other: "Diğer",
  bands: "Direnç Bandı",
};

type BodyView = "front" | "back";

function RealisticBodyMap({ 
  view, 
  selectedMuscle, 
  onSelectMuscle, 
  hoveredMuscle,
  onHoverMuscle 
}: { 
  view: BodyView;
  selectedMuscle: string;
  onSelectMuscle: (muscle: string) => void;
  hoveredMuscle: string;
  onHoverMuscle: (muscle: string) => void;
}) {
  
  const getMuscleStyle = (muscleId: string) => {
    const isSelected = selectedMuscle === muscleId;
    const isHovered = hoveredMuscle === muscleId;
    
    if (isSelected) {
      return {
        fill: "url(#muscleGradientActive)",
        stroke: "#ccff00",
        strokeWidth: 2,
        filter: "url(#glowStrong)",
      };
    }
    if (isHovered) {
      return {
        fill: "url(#muscleGradientHover)",
        stroke: "#ccff00",
        strokeWidth: 1.5,
        filter: "url(#glowMedium)",
      };
    }
    return {
      fill: "url(#muscleGradient)",
      stroke: "#444",
      strokeWidth: 0.5,
      filter: "",
    };
  };

  const handleClick = (muscleId: string) => {
    onSelectMuscle(muscleId === selectedMuscle ? "" : muscleId);
  };

  return (
    <svg viewBox="0 0 200 400" className="w-full h-full max-h-[550px]">
      <defs>
        {/* Realistic skin gradient */}
        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="50%" stopColor="#2d2d2d" />
          <stop offset="100%" stopColor="#252525" />
        </linearGradient>
        
        {/* Muscle gradients for 3D effect */}
        <linearGradient id="muscleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(204, 255, 0, 0.15)" />
          <stop offset="50%" stopColor="rgba(204, 255, 0, 0.08)" />
          <stop offset="100%" stopColor="rgba(204, 255, 0, 0.12)" />
        </linearGradient>
        
        <linearGradient id="muscleGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(204, 255, 0, 0.5)" />
          <stop offset="50%" stopColor="rgba(204, 255, 0, 0.35)" />
          <stop offset="100%" stopColor="rgba(204, 255, 0, 0.45)" />
        </linearGradient>
        
        <linearGradient id="muscleGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ccff00" />
          <stop offset="50%" stopColor="#a8d600" />
          <stop offset="100%" stopColor="#ccff00" />
        </linearGradient>
        
        {/* Shadow for depth */}
        <filter id="bodyShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="3" stdDeviation="5" floodColor="#000" floodOpacity="0.4"/>
        </filter>
        
        {/* Glow effects */}
        <filter id="glowMedium">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="glowStrong">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Muscle definition lines */}
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#555" stopOpacity="0"/>
          <stop offset="50%" stopColor="#555" stopOpacity="1"/>
          <stop offset="100%" stopColor="#555" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {view === "front" ? (
        <g filter="url(#bodyShadow)">
          {/* FRONT VIEW - Realistic Muscular Body */}
          
          {/* Head */}
          <ellipse cx="100" cy="32" rx="18" ry="24" fill="url(#skinGradient)" stroke="#333" strokeWidth="0.5"/>
          <ellipse cx="100" cy="30" rx="16" ry="20" fill="none" stroke="#444" strokeWidth="0.3"/>
          
          {/* Neck */}
          <path d="M 88 52 L 88 68 Q 100 72 112 68 L 112 52" fill="url(#skinGradient)" stroke="#333" strokeWidth="0.5"/>
          
          {/* Trapezius - Front */}
          <path 
            d="M 70 68 Q 85 60 100 62 Q 115 60 130 68 L 125 82 Q 100 78 75 82 Z"
            {...getMuscleStyle("traps")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("traps")}
            onMouseEnter={() => onHoverMuscle("traps")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-traps"
          />

          {/* Left Shoulder/Deltoid */}
          <path 
            d="M 58 72 Q 50 78 48 95 Q 50 108 58 115 Q 70 110 75 95 Q 72 78 70 70 Q 65 68 58 72"
            {...getMuscleStyle("shoulders")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("shoulders")}
            onMouseEnter={() => onHoverMuscle("shoulders")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-shoulder-l"
          />
          
          {/* Right Shoulder/Deltoid */}
          <path 
            d="M 142 72 Q 150 78 152 95 Q 150 108 142 115 Q 130 110 125 95 Q 128 78 130 70 Q 135 68 142 72"
            {...getMuscleStyle("shoulders")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("shoulders")}
            onMouseEnter={() => onHoverMuscle("shoulders")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-shoulder-r"
          />

          {/* Left Chest/Pec */}
          <path 
            d="M 72 82 Q 85 78 98 85 L 98 120 Q 85 128 72 122 Q 68 105 72 82"
            {...getMuscleStyle("chest")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("chest")}
            onMouseEnter={() => onHoverMuscle("chest")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-chest-l"
          />
          {/* Chest definition line */}
          <path d="M 80 90 Q 88 95 95 92" stroke="#444" strokeWidth="0.5" fill="none" opacity="0.6"/>
          
          {/* Right Chest/Pec */}
          <path 
            d="M 102 85 Q 115 78 128 82 Q 132 105 128 122 Q 115 128 102 120 Z"
            {...getMuscleStyle("chest")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("chest")}
            onMouseEnter={() => onHoverMuscle("chest")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-chest-r"
          />
          <path d="M 120 90 Q 112 95 105 92" stroke="#444" strokeWidth="0.5" fill="none" opacity="0.6"/>

          {/* Left Bicep */}
          <path 
            d="M 48 115 Q 42 125 40 145 Q 42 165 48 175 Q 58 178 65 170 Q 68 150 65 130 Q 62 118 55 112 Q 50 112 48 115"
            {...getMuscleStyle("biceps")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("biceps")}
            onMouseEnter={() => onHoverMuscle("biceps")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-bicep-l"
          />
          {/* Bicep peak definition */}
          <path d="M 50 135 Q 55 130 58 138" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.5"/>

          {/* Right Bicep */}
          <path 
            d="M 152 115 Q 158 125 160 145 Q 158 165 152 175 Q 142 178 135 170 Q 132 150 135 130 Q 138 118 145 112 Q 150 112 152 115"
            {...getMuscleStyle("biceps")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("biceps")}
            onMouseEnter={() => onHoverMuscle("biceps")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-bicep-r"
          />
          <path d="M 150 135 Q 145 130 142 138" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.5"/>

          {/* Left Forearm */}
          <path 
            d="M 40 178 Q 35 195 32 220 Q 34 240 38 250 Q 48 255 55 248 Q 60 225 58 200 Q 55 182 50 175 Q 45 175 40 178"
            {...getMuscleStyle("forearms")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("forearms")}
            onMouseEnter={() => onHoverMuscle("forearms")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-forearm-l"
          />

          {/* Right Forearm */}
          <path 
            d="M 160 178 Q 165 195 168 220 Q 166 240 162 250 Q 152 255 145 248 Q 140 225 142 200 Q 145 182 150 175 Q 155 175 160 178"
            {...getMuscleStyle("forearms")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("forearms")}
            onMouseEnter={() => onHoverMuscle("forearms")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-forearm-r"
          />

          {/* Abdominals - 6 Pack */}
          <path 
            d="M 82 125 Q 100 120 118 125 L 118 195 Q 100 200 82 195 Z"
            {...getMuscleStyle("abdominals")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("abdominals")}
            onMouseEnter={() => onHoverMuscle("abdominals")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-abs"
          />
          {/* Ab definition lines */}
          <line x1="100" y1="128" x2="100" y2="190" stroke="#444" strokeWidth="0.8" opacity="0.5"/>
          <path d="M 85 140 Q 100 138 115 140" stroke="#444" strokeWidth="0.5" fill="none" opacity="0.5"/>
          <path d="M 85 155 Q 100 153 115 155" stroke="#444" strokeWidth="0.5" fill="none" opacity="0.5"/>
          <path d="M 85 170 Q 100 168 115 170" stroke="#444" strokeWidth="0.5" fill="none" opacity="0.5"/>
          <path d="M 86 185 Q 100 183 114 185" stroke="#444" strokeWidth="0.5" fill="none" opacity="0.5"/>

          {/* Obliques */}
          <path d="M 72 125 Q 78 130 82 140 L 82 190 Q 78 198 72 200 Q 68 170 72 125" fill="url(#skinGradient)" stroke="#444" strokeWidth="0.3"/>
          <path d="M 128 125 Q 122 130 118 140 L 118 190 Q 122 198 128 200 Q 132 170 128 125" fill="url(#skinGradient)" stroke="#444" strokeWidth="0.3"/>

          {/* Hip/Pelvis area */}
          <path d="M 70 200 Q 100 195 130 200 L 128 220 Q 100 225 72 220 Z" fill="url(#skinGradient)" stroke="#333" strokeWidth="0.5"/>

          {/* Left Quadriceps */}
          <path 
            d="M 72 222 Q 68 235 66 265 Q 68 305 72 330 Q 82 340 92 332 Q 98 295 96 260 Q 94 235 92 222 Q 82 218 72 222"
            {...getMuscleStyle("quadriceps")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("quadriceps")}
            onMouseEnter={() => onHoverMuscle("quadriceps")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-quad-l"
          />
          {/* Quad definition - vastus lateralis */}
          <path d="M 74 250 Q 80 260 78 290" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.5"/>
          {/* Quad definition - rectus femoris */}
          <path d="M 82 235 Q 84 270 83 310" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.5"/>

          {/* Right Quadriceps */}
          <path 
            d="M 128 222 Q 132 235 134 265 Q 132 305 128 330 Q 118 340 108 332 Q 102 295 104 260 Q 106 235 108 222 Q 118 218 128 222"
            {...getMuscleStyle("quadriceps")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("quadriceps")}
            onMouseEnter={() => onHoverMuscle("quadriceps")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-quad-r"
          />
          <path d="M 126 250 Q 120 260 122 290" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.5"/>
          <path d="M 118 235 Q 116 270 117 310" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.5"/>

          {/* Inner thigh gap */}
          <path d="M 92 225 Q 100 220 108 225" fill="url(#skinGradient)" stroke="none"/>

          {/* Left Calf */}
          <path 
            d="M 70 340 Q 65 355 64 375 Q 68 395 75 398 Q 85 395 88 380 Q 90 360 88 345 Q 82 338 70 340"
            {...getMuscleStyle("calves")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("calves")}
            onMouseEnter={() => onHoverMuscle("calves")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-calf-l"
          />

          {/* Right Calf */}
          <path 
            d="M 130 340 Q 135 355 136 375 Q 132 395 125 398 Q 115 395 112 380 Q 110 360 112 345 Q 118 338 130 340"
            {...getMuscleStyle("calves")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("calves")}
            onMouseEnter={() => onHoverMuscle("calves")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-front-calf-r"
          />

          {/* Hands */}
          <ellipse cx="45" cy="262" rx="10" ry="14" fill="url(#skinGradient)" stroke="#333" strokeWidth="0.3"/>
          <ellipse cx="155" cy="262" rx="10" ry="14" fill="url(#skinGradient)" stroke="#333" strokeWidth="0.3"/>
        </g>
      ) : (
        <g filter="url(#bodyShadow)">
          {/* BACK VIEW - Realistic Muscular Body */}
          
          {/* Head */}
          <ellipse cx="100" cy="32" rx="18" ry="24" fill="url(#skinGradient)" stroke="#333" strokeWidth="0.5"/>
          
          {/* Neck */}
          <path d="M 88 52 L 88 68 Q 100 72 112 68 L 112 52" fill="url(#skinGradient)" stroke="#333" strokeWidth="0.5"/>

          {/* Trapezius - Upper Back */}
          <path 
            d="M 65 65 Q 82 55 100 58 Q 118 55 135 65 L 130 95 Q 100 100 70 95 Z"
            {...getMuscleStyle("traps")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("traps")}
            onMouseEnter={() => onHoverMuscle("traps")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-traps"
          />
          {/* Trap definition */}
          <path d="M 100 62 L 100 92" stroke="#444" strokeWidth="0.5" fill="none" opacity="0.5"/>

          {/* Left Rear Deltoid */}
          <path 
            d="M 55 70 Q 45 80 44 100 Q 48 115 58 120 Q 68 115 72 100 Q 70 82 65 70 Q 60 68 55 70"
            {...getMuscleStyle("shoulders")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("shoulders")}
            onMouseEnter={() => onHoverMuscle("shoulders")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-shoulder-l"
          />

          {/* Right Rear Deltoid */}
          <path 
            d="M 145 70 Q 155 80 156 100 Q 152 115 142 120 Q 132 115 128 100 Q 130 82 135 70 Q 140 68 145 70"
            {...getMuscleStyle("shoulders")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("shoulders")}
            onMouseEnter={() => onHoverMuscle("shoulders")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-shoulder-r"
          />

          {/* Left Lat */}
          <path 
            d="M 68 98 Q 60 110 58 140 Q 62 170 70 185 Q 82 188 88 180 Q 92 150 90 120 Q 88 105 82 98 Q 75 95 68 98"
            {...getMuscleStyle("lats")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("lats")}
            onMouseEnter={() => onHoverMuscle("lats")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-lat-l"
          />
          {/* Lat striation lines */}
          <path d="M 70 120 Q 78 125 82 135" stroke="#444" strokeWidth="0.3" fill="none" opacity="0.4"/>
          <path d="M 68 140 Q 76 145 80 155" stroke="#444" strokeWidth="0.3" fill="none" opacity="0.4"/>
          <path d="M 68 160 Q 75 165 78 175" stroke="#444" strokeWidth="0.3" fill="none" opacity="0.4"/>

          {/* Right Lat */}
          <path 
            d="M 132 98 Q 140 110 142 140 Q 138 170 130 185 Q 118 188 112 180 Q 108 150 110 120 Q 112 105 118 98 Q 125 95 132 98"
            {...getMuscleStyle("lats")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("lats")}
            onMouseEnter={() => onHoverMuscle("lats")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-lat-r"
          />
          <path d="M 130 120 Q 122 125 118 135" stroke="#444" strokeWidth="0.3" fill="none" opacity="0.4"/>
          <path d="M 132 140 Q 124 145 120 155" stroke="#444" strokeWidth="0.3" fill="none" opacity="0.4"/>
          <path d="M 132 160 Q 125 165 122 175" stroke="#444" strokeWidth="0.3" fill="none" opacity="0.4"/>

          {/* Middle Back / Rhomboids */}
          <path 
            d="M 88 100 Q 100 95 112 100 L 112 145 Q 100 150 88 145 Z"
            {...getMuscleStyle("middle back")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("middle back")}
            onMouseEnter={() => onHoverMuscle("middle back")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-mid"
          />
          {/* Spine line */}
          <line x1="100" y1="100" x2="100" y2="190" stroke="#444" strokeWidth="0.8" opacity="0.5"/>

          {/* Lower Back / Erector Spinae */}
          <path 
            d="M 85 150 Q 100 145 115 150 L 115 195 Q 100 200 85 195 Z"
            {...getMuscleStyle("lower back")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("lower back")}
            onMouseEnter={() => onHoverMuscle("lower back")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-lower"
          />
          {/* Lower back definition */}
          <path d="M 92 160 Q 100 155 108 160" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.4"/>
          <path d="M 90 175 Q 100 170 110 175" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.4"/>

          {/* Left Tricep */}
          <path 
            d="M 45 120 Q 38 135 36 160 Q 40 180 48 188 Q 60 185 65 175 Q 68 155 65 135 Q 60 122 52 118 Q 48 118 45 120"
            {...getMuscleStyle("triceps")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("triceps")}
            onMouseEnter={() => onHoverMuscle("triceps")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-tricep-l"
          />
          {/* Tricep horseshoe definition */}
          <path d="M 48 140 Q 55 145 52 165" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.5"/>

          {/* Right Tricep */}
          <path 
            d="M 155 120 Q 162 135 164 160 Q 160 180 152 188 Q 140 185 135 175 Q 132 155 135 135 Q 140 122 148 118 Q 152 118 155 120"
            {...getMuscleStyle("triceps")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("triceps")}
            onMouseEnter={() => onHoverMuscle("triceps")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-tricep-r"
          />
          <path d="M 152 140 Q 145 145 148 165" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.5"/>

          {/* Left Forearm - Back */}
          <path 
            d="M 38 190 Q 32 210 30 235 Q 35 255 42 260 Q 52 258 58 248 Q 62 225 58 205 Q 52 192 48 188 Q 42 188 38 190"
            {...getMuscleStyle("forearms")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("forearms")}
            onMouseEnter={() => onHoverMuscle("forearms")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-forearm-l"
          />

          {/* Right Forearm - Back */}
          <path 
            d="M 162 190 Q 168 210 170 235 Q 165 255 158 260 Q 148 258 142 248 Q 138 225 142 205 Q 148 192 152 188 Q 158 188 162 190"
            {...getMuscleStyle("forearms")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("forearms")}
            onMouseEnter={() => onHoverMuscle("forearms")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-forearm-r"
          />

          {/* Glutes */}
          <path 
            d="M 72 198 Q 100 192 128 198 L 128 240 Q 100 248 72 240 Z"
            {...getMuscleStyle("glutes")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("glutes")}
            onMouseEnter={() => onHoverMuscle("glutes")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-glutes"
          />
          {/* Glute separation */}
          <line x1="100" y1="200" x2="100" y2="238" stroke="#444" strokeWidth="0.6" opacity="0.5"/>
          <path d="M 80 210 Q 90 215 98 212" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.4"/>
          <path d="M 120 210 Q 110 215 102 212" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.4"/>

          {/* Left Hamstring */}
          <path 
            d="M 72 245 Q 66 270 65 300 Q 68 330 75 345 Q 85 348 92 340 Q 96 310 94 275 Q 92 255 90 245 Q 82 242 72 245"
            {...getMuscleStyle("hamstrings")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("hamstrings")}
            onMouseEnter={() => onHoverMuscle("hamstrings")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-ham-l"
          />
          {/* Hamstring definition - biceps femoris */}
          <path d="M 75 265 Q 82 280 80 310" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.4"/>
          <path d="M 84 260 Q 88 285 86 320" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.4"/>

          {/* Right Hamstring */}
          <path 
            d="M 128 245 Q 134 270 135 300 Q 132 330 125 345 Q 115 348 108 340 Q 104 310 106 275 Q 108 255 110 245 Q 118 242 128 245"
            {...getMuscleStyle("hamstrings")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("hamstrings")}
            onMouseEnter={() => onHoverMuscle("hamstrings")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-ham-r"
          />
          <path d="M 125 265 Q 118 280 120 310" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.4"/>
          <path d="M 116 260 Q 112 285 114 320" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.4"/>

          {/* Left Calf - Back */}
          <path 
            d="M 68 350 Q 62 365 60 385 Q 65 398 75 400 Q 88 396 92 380 Q 94 365 90 352 Q 82 348 68 350"
            {...getMuscleStyle("calves")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("calves")}
            onMouseEnter={() => onHoverMuscle("calves")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-calf-l"
          />
          {/* Calf diamond shape */}
          <path d="M 75 360 Q 78 375 76 390" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.4"/>

          {/* Right Calf - Back */}
          <path 
            d="M 132 350 Q 138 365 140 385 Q 135 398 125 400 Q 112 396 108 380 Q 106 365 110 352 Q 118 348 132 350"
            {...getMuscleStyle("calves")}
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick("calves")}
            onMouseEnter={() => onHoverMuscle("calves")}
            onMouseLeave={() => onHoverMuscle("")}
            data-testid="muscle-back-calf-r"
          />
          <path d="M 125 360 Q 122 375 124 390" stroke="#444" strokeWidth="0.4" fill="none" opacity="0.4"/>

          {/* Hands */}
          <ellipse cx="45" cy="272" rx="10" ry="14" fill="url(#skinGradient)" stroke="#333" strokeWidth="0.3"/>
          <ellipse cx="155" cy="272" rx="10" ry="14" fill="url(#skinGradient)" stroke="#333" strokeWidth="0.3"/>
        </g>
      )}

      {/* Hover label */}
      {hoveredMuscle && (
        <g>
          <rect 
            x="50" 
            y="10" 
            width={muscleLabels[hoveredMuscle]?.length * 10 + 20 || 80} 
            height="28" 
            rx="6" 
            fill="rgba(0,0,0,0.9)" 
            stroke="#ccff00" 
            strokeWidth="1"
          />
          <text 
            x="60" 
            y="29" 
            fill="#ccff00" 
            fontSize="14" 
            fontWeight="bold" 
            className="pointer-events-none"
          >
            {muscleLabels[hoveredMuscle] || hoveredMuscle}
          </text>
        </g>
      )}
    </svg>
  );
}

export default function Exercises() {
  const [selectedMuscle, setSelectedMuscle] = useState<string>("");
  const [hoveredMuscle, setHoveredMuscle] = useState<string>("");
  const [bodyView, setBodyView] = useState<BodyView>("front");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedMuscle) params.set("muscle", selectedMuscle);
    params.set("limit", String(limit));
    params.set("offset", String((currentPage - 1) * limit));
    return params.toString();
  }, [searchQuery, selectedMuscle, currentPage]);

  const { data, isLoading } = useQuery<ExercisesResponse>({
    queryKey: ["/api/exercises", queryParams],
    queryFn: async () => {
      const res = await fetch(`/api/exercises?${queryParams}`);
      return res.json();
    },
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  const handleMuscleSelect = (muscle: string) => {
    setSelectedMuscle(muscle === selectedMuscle ? "" : muscle);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const clearSelection = () => {
    setSelectedMuscle("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <SEO
        title="Egzersiz Akademisi - 800+ Fitness Hareketi | Gokalaf"
        description="800'den fazla fitness egzersizi ve hareket rehberi. Kas gruplarına göre filtreleme yaparak doğru egzersizleri öğrenin."
        keywords="egzersiz, fitness hareketleri, gym egzersizleri, kas çalışma, antrenman rehberi"
        canonical="/egzersiz-akademisi"
      />

      <section className="pt-32 sm:pt-36 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] opacity-30" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Dumbbell className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">{data?.total || 800}+ Egzersiz</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase mb-4 text-white tracking-tighter">
              Egzersiz{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                Akademisi
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400">
              Çalıştırmak istediğin kasa tıkla, hareketleri keşfet.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Body Map Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-b from-[#0A0A0A] to-[#080808] border border-white/10 rounded-2xl p-6 lg:sticky lg:top-24"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-bold text-white">Kas Haritası</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant={bodyView === "front" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBodyView("front")}
                    className={bodyView === "front" ? "bg-primary text-black" : "border-white/20 text-gray-400"}
                    data-testid="button-view-front"
                  >
                    Ön
                  </Button>
                  <Button
                    variant={bodyView === "back" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBodyView("back")}
                    className={bodyView === "back" ? "bg-primary text-black" : "border-white/20 text-gray-400"}
                    data-testid="button-view-back"
                  >
                    Arka
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setBodyView(bodyView === "front" ? "back" : "front")}
                    className="text-gray-400 hover:text-white"
                    data-testid="button-rotate-body"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={bodyView}
                    initial={{ opacity: 0, rotateY: bodyView === "front" ? -90 : 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: bodyView === "front" ? 90 : -90 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-[280px] md:max-w-[320px]"
                  >
                    <RealisticBodyMap
                      view={bodyView}
                      selectedMuscle={selectedMuscle}
                      onSelectMuscle={handleMuscleSelect}
                      hoveredMuscle={hoveredMuscle}
                      onHoverMuscle={setHoveredMuscle}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Quick muscle buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {Object.entries(muscleLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleMuscleSelect(key)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedMuscle === key
                        ? "bg-primary text-black shadow-lg shadow-primary/30"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                    data-testid={`button-muscle-${key}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {selectedMuscle && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-primary text-sm font-medium">Seçili Kas:</span>
                      <h3 className="text-white font-bold text-lg">{muscleLabels[selectedMuscle] || selectedMuscle}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSelection}
                      className="text-gray-400 hover:text-white"
                      data-testid="button-clear-muscle"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Temizle
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Exercises Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Egzersiz ara..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  data-testid="input-exercise-search"
                />
              </div>

              {/* Results header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-white">
                  {selectedMuscle ? muscleLabels[selectedMuscle] : "Tüm"} Egzersizler
                  <span className="text-primary ml-2">({data?.total || 0})</span>
                </h2>
                {(selectedMuscle || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="text-gray-400 hover:text-white"
                    data-testid="button-show-all"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Tümünü Göster
                  </Button>
                )}
              </div>

              {/* Exercises grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-xl h-64 animate-pulse" />
                  ))}
                </div>
              ) : data?.exercises.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl">
                  <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-bold text-white mb-2">Egzersiz Bulunamadı</h3>
                  <p className="text-gray-400 mb-4">Bu kas grubu için egzersiz bulunamadı.</p>
                  <Button onClick={clearSelection} className="bg-primary text-black hover:bg-primary/90">
                    Tüm Egzersizleri Göster
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data?.exercises.map((exercise, index) => (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link href={`/egzersiz-akademisi/${exercise.slug}`}>
                          <div
                            className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer"
                            data-testid={`card-exercise-${exercise.id}`}
                          >
                            <div className="aspect-[4/3] relative overflow-hidden bg-black/50">
                              {exercise.images[0] && (
                                <img
                                  src={exercise.images[0]}
                                  alt={exercise.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                              )}
                              <div className="absolute top-2 left-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  exercise.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                  exercise.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {levelLabels[exercise.level] || exercise.level}
                                </span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                                <span className="text-primary text-sm font-medium flex items-center gap-1">
                                  Detayları Gör <ChevronRight className="w-4 h-4" />
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {exercise.name}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {exercise.primaryMuscles.slice(0, 2).map((muscle) => (
                                  <span
                                    key={muscle}
                                    className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded"
                                  >
                                    {muscleLabels[muscle] || muscle}
                                  </span>
                                ))}
                                {exercise.equipment && (
                                  <span className="text-xs text-primary/80 bg-primary/10 px-2 py-1 rounded">
                                    {equipmentLabels[exercise.equipment] || exercise.equipment}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="border-white/10 text-white hover:bg-white/10"
                        data-testid="button-prev-page"
                      >
                        Önceki
                      </Button>
                      <div className="flex items-center gap-1 px-4">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-primary text-black"
                                  : "text-gray-400 hover:text-white hover:bg-white/10"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="border-white/10 text-white hover:bg-white/10"
                        data-testid="button-next-page"
                      >
                        Sonraki
                      </Button>
                    </div>
                  )}

                  <div className="text-center text-gray-500 text-sm">
                    {data?.total} egzersiz arasından {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, data?.total || 0)} arası gösteriliyor
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
