import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Search, Dumbbell, X, ChevronRight, ArrowLeft } from "lucide-react";
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

function PremiumBodyMap({ 
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
        fill: "#39ff14",
        stroke: "#39ff14",
        strokeWidth: 1,
        opacity: 1,
        filter: "url(#neonGlow)",
      };
    }
    if (isHovered) {
      return {
        fill: "rgba(57, 255, 20, 0.6)",
        stroke: "#39ff14",
        strokeWidth: 0.5,
        opacity: 0.8,
        filter: "url(#neonGlowMedium)",
      };
    }
    return {
      fill: "transparent",
      stroke: "rgba(57, 255, 20, 0.15)",
      strokeWidth: 0.3,
      opacity: 0,
      filter: "",
    };
  };

  const handleClick = (muscleId: string) => {
    onSelectMuscle(muscleId === selectedMuscle ? "" : muscleId);
  };

  const getLabelPosition = (muscleId: string): { x: number; y: number } => {
    const positions: Record<string, { x: number; y: number }> = {
      chest: { x: 30, y: 115 },
      shoulders: { x: 25, y: 85 },
      biceps: { x: 15, y: 145 },
      triceps: { x: 15, y: 145 },
      forearms: { x: 10, y: 195 },
      abdominals: { x: 35, y: 165 },
      quadriceps: { x: 30, y: 270 },
      calves: { x: 30, y: 355 },
      traps: { x: 35, y: 75 },
      lats: { x: 25, y: 135 },
      "middle back": { x: 40, y: 125 },
      "lower back": { x: 40, y: 175 },
      glutes: { x: 40, y: 225 },
      hamstrings: { x: 30, y: 295 },
    };
    return positions[muscleId] || { x: 50, y: 100 };
  };

  return (
    <svg viewBox="0 0 200 420" className="w-full h-full max-h-[550px]">
      <defs>
        {/* Neon glow effects */}
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur1"/>
          <feGaussianBlur stdDeviation="10" result="blur2"/>
          <feMerge>
            <feMergeNode in="blur2"/>
            <feMergeNode in="blur1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="neonGlowMedium" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Body gradient - matte black with subtle highlights */}
        <linearGradient id="bodyGradientMatte" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1a"/>
          <stop offset="30%" stopColor="#0f0f0f"/>
          <stop offset="70%" stopColor="#141414"/>
          <stop offset="100%" stopColor="#0a0a0a"/>
        </linearGradient>

        {/* Subtle muscle definition gradient */}
        <linearGradient id="muscleDefinition" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f1f1f"/>
          <stop offset="50%" stopColor="#0d0d0d"/>
          <stop offset="100%" stopColor="#1a1a1a"/>
        </linearGradient>

        {/* Ambient shadow */}
        <filter id="ambientShadow">
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#000" floodOpacity="0.5"/>
        </filter>
      </defs>

      {view === "front" ? (
        <g filter="url(#ambientShadow)">
          {/* FRONT VIEW - Premium Matte Black Body */}
          
          {/* Head */}
          <ellipse cx="100" cy="32" rx="20" ry="26" fill="url(#bodyGradientMatte)"/>
          <ellipse cx="100" cy="30" rx="18" ry="22" fill="none" stroke="#222" strokeWidth="0.5"/>
          
          {/* Neck */}
          <path d="M 86 54 L 86 72 Q 100 76 114 72 L 114 54" fill="url(#bodyGradientMatte)"/>
          <path d="M 88 58 Q 100 62 112 58" stroke="#1a1a1a" strokeWidth="0.5" fill="none"/>

          {/* Torso base */}
          <path 
            d="M 62 74 
               Q 55 82 50 100 
               L 44 135 
               Q 42 160 48 190 
               L 70 205 
               Q 100 210 130 205 
               L 152 190 
               Q 158 160 156 135 
               L 150 100 
               Q 145 82 138 74 
               Q 100 65 62 74"
            fill="url(#bodyGradientMatte)"
          />

          {/* Left arm */}
          <path 
            d="M 50 100 
               Q 40 115 36 145 
               Q 32 175 28 210 
               Q 25 235 30 255 
               L 48 258 
               Q 55 235 58 205 
               Q 62 170 58 140 
               Q 55 115 55 105"
            fill="url(#bodyGradientMatte)"
          />

          {/* Right arm */}
          <path 
            d="M 150 100 
               Q 160 115 164 145 
               Q 168 175 172 210 
               Q 175 235 170 255 
               L 152 258 
               Q 145 235 142 205 
               Q 138 170 142 140 
               Q 145 115 145 105"
            fill="url(#bodyGradientMatte)"
          />

          {/* Pelvis/hips */}
          <path 
            d="M 68 200 
               Q 100 195 132 200 
               L 135 235 
               Q 100 242 65 235 Z"
            fill="url(#bodyGradientMatte)"
          />

          {/* Left leg */}
          <path 
            d="M 65 235 
               Q 58 260 55 300 
               Q 54 340 58 380 
               Q 62 400 70 410 
               L 95 410 
               Q 100 385 98 350 
               Q 96 300 98 260 
               Q 98 242 95 235"
            fill="url(#bodyGradientMatte)"
          />

          {/* Right leg */}
          <path 
            d="M 135 235 
               Q 142 260 145 300 
               Q 146 340 142 380 
               Q 138 400 130 410 
               L 105 410 
               Q 100 385 102 350 
               Q 104 300 102 260 
               Q 102 242 105 235"
            fill="url(#bodyGradientMatte)"
          />

          {/* Muscle definition lines - subtle */}
          {/* Chest separation */}
          <line x1="100" y1="82" x2="100" y2="130" stroke="#1a1a1a" strokeWidth="1"/>
          {/* Chest curves */}
          <path d="M 72 90 Q 85 100 98 95" stroke="#1a1a1a" strokeWidth="0.8" fill="none"/>
          <path d="M 128 90 Q 115 100 102 95" stroke="#1a1a1a" strokeWidth="0.8" fill="none"/>
          {/* Ab lines */}
          <line x1="100" y1="135" x2="100" y2="200" stroke="#1a1a1a" strokeWidth="1"/>
          <path d="M 85 145 Q 100 143 115 145" stroke="#181818" strokeWidth="0.6" fill="none"/>
          <path d="M 85 160 Q 100 158 115 160" stroke="#181818" strokeWidth="0.6" fill="none"/>
          <path d="M 85 175 Q 100 173 115 175" stroke="#181818" strokeWidth="0.6" fill="none"/>
          <path d="M 86 190 Q 100 188 114 190" stroke="#181818" strokeWidth="0.6" fill="none"/>
          {/* Obliques */}
          <path d="M 72 135 Q 78 150 80 175" stroke="#1a1a1a" strokeWidth="0.6" fill="none"/>
          <path d="M 128 135 Q 122 150 120 175" stroke="#1a1a1a" strokeWidth="0.6" fill="none"/>
          {/* Quad separation */}
          <path d="M 80 250 Q 82 290 80 330" stroke="#1a1a1a" strokeWidth="0.6" fill="none"/>
          <path d="M 120 250 Q 118 290 120 330" stroke="#1a1a1a" strokeWidth="0.6" fill="none"/>
          {/* Bicep definition */}
          <path d="M 45 130 Q 50 145 48 160" stroke="#1a1a1a" strokeWidth="0.5" fill="none"/>
          <path d="M 155 130 Q 150 145 152 160" stroke="#1a1a1a" strokeWidth="0.5" fill="none"/>

          {/* CLICKABLE MUSCLE ZONES - Invisible until hovered/selected */}
          
          {/* Left Chest */}
          <path 
            d="M 70 85 Q 85 80 98 88 L 98 128 Q 85 135 70 128 Q 65 108 70 85"
            {...getMuscleStyle("chest")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("chest")}
            onMouseEnter={() => onHoverMuscle("chest")}
            onMouseLeave={() => onHoverMuscle("")}
          />
          {/* Right Chest */}
          <path 
            d="M 102 88 Q 115 80 130 85 Q 135 108 130 128 Q 115 135 102 128 Z"
            {...getMuscleStyle("chest")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("chest")}
            onMouseEnter={() => onHoverMuscle("chest")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Left Shoulder */}
          <path 
            d="M 55 75 Q 45 85 44 105 Q 48 120 58 125 Q 68 118 70 100 Q 68 82 62 75 Z"
            {...getMuscleStyle("shoulders")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("shoulders")}
            onMouseEnter={() => onHoverMuscle("shoulders")}
            onMouseLeave={() => onHoverMuscle("")}
          />
          {/* Right Shoulder */}
          <path 
            d="M 145 75 Q 155 85 156 105 Q 152 120 142 125 Q 132 118 130 100 Q 132 82 138 75 Z"
            {...getMuscleStyle("shoulders")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("shoulders")}
            onMouseEnter={() => onHoverMuscle("shoulders")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Left Bicep */}
          <path 
            d="M 44 125 Q 38 140 36 165 Q 40 188 50 195 Q 60 190 62 170 Q 64 145 58 128 Q 52 122 44 125"
            {...getMuscleStyle("biceps")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("biceps")}
            onMouseEnter={() => onHoverMuscle("biceps")}
            onMouseLeave={() => onHoverMuscle("")}
          />
          {/* Right Bicep */}
          <path 
            d="M 156 125 Q 162 140 164 165 Q 160 188 150 195 Q 140 190 138 170 Q 136 145 142 128 Q 148 122 156 125"
            {...getMuscleStyle("biceps")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("biceps")}
            onMouseEnter={() => onHoverMuscle("biceps")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Left Forearm */}
          <path 
            d="M 36 198 Q 30 220 28 245 Q 32 260 42 265 Q 52 258 56 238 Q 58 215 54 198 Q 46 195 36 198"
            {...getMuscleStyle("forearms")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("forearms")}
            onMouseEnter={() => onHoverMuscle("forearms")}
            onMouseLeave={() => onHoverMuscle("")}
          />
          {/* Right Forearm */}
          <path 
            d="M 164 198 Q 170 220 172 245 Q 168 260 158 265 Q 148 258 144 238 Q 142 215 146 198 Q 154 195 164 198"
            {...getMuscleStyle("forearms")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("forearms")}
            onMouseEnter={() => onHoverMuscle("forearms")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Abdominals */}
          <path 
            d="M 82 132 Q 100 128 118 132 L 118 198 Q 100 204 82 198 Z"
            {...getMuscleStyle("abdominals")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("abdominals")}
            onMouseEnter={() => onHoverMuscle("abdominals")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Left Quadriceps */}
          <path 
            d="M 68 238 Q 60 270 58 310 Q 62 350 72 365 Q 88 368 95 355 Q 98 310 96 270 Q 94 245 92 238 Q 80 235 68 238"
            {...getMuscleStyle("quadriceps")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("quadriceps")}
            onMouseEnter={() => onHoverMuscle("quadriceps")}
            onMouseLeave={() => onHoverMuscle("")}
          />
          {/* Right Quadriceps */}
          <path 
            d="M 132 238 Q 140 270 142 310 Q 138 350 128 365 Q 112 368 105 355 Q 102 310 104 270 Q 106 245 108 238 Q 120 235 132 238"
            {...getMuscleStyle("quadriceps")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("quadriceps")}
            onMouseEnter={() => onHoverMuscle("quadriceps")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Left Calf */}
          <path 
            d="M 62 372 Q 56 385 55 400 Q 60 408 72 410 Q 88 406 92 395 Q 94 380 90 370 Q 78 368 62 372"
            {...getMuscleStyle("calves")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("calves")}
            onMouseEnter={() => onHoverMuscle("calves")}
            onMouseLeave={() => onHoverMuscle("")}
          />
          {/* Right Calf */}
          <path 
            d="M 138 372 Q 144 385 145 400 Q 140 408 128 410 Q 112 406 108 395 Q 106 380 110 370 Q 122 368 138 372"
            {...getMuscleStyle("calves")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("calves")}
            onMouseEnter={() => onHoverMuscle("calves")}
            onMouseLeave={() => onHoverMuscle("")}
          />
        </g>
      ) : (
        <g filter="url(#ambientShadow)">
          {/* BACK VIEW - Premium Matte Black Body */}
          
          {/* Head */}
          <ellipse cx="100" cy="32" rx="20" ry="26" fill="url(#bodyGradientMatte)"/>
          
          {/* Neck */}
          <path d="M 86 54 L 86 72 Q 100 76 114 72 L 114 54" fill="url(#bodyGradientMatte)"/>

          {/* Torso base */}
          <path 
            d="M 62 74 
               Q 55 82 50 100 
               L 44 135 
               Q 42 160 48 190 
               L 70 205 
               Q 100 210 130 205 
               L 152 190 
               Q 158 160 156 135 
               L 150 100 
               Q 145 82 138 74 
               Q 100 65 62 74"
            fill="url(#bodyGradientMatte)"
          />

          {/* Left arm */}
          <path 
            d="M 50 100 
               Q 40 115 36 145 
               Q 32 175 28 210 
               Q 25 235 30 255 
               L 48 258 
               Q 55 235 58 205 
               Q 62 170 58 140 
               Q 55 115 55 105"
            fill="url(#bodyGradientMatte)"
          />

          {/* Right arm */}
          <path 
            d="M 150 100 
               Q 160 115 164 145 
               Q 168 175 172 210 
               Q 175 235 170 255 
               L 152 258 
               Q 145 235 142 205 
               Q 138 170 142 140 
               Q 145 115 145 105"
            fill="url(#bodyGradientMatte)"
          />

          {/* Pelvis/hips/glutes */}
          <path 
            d="M 68 200 
               Q 100 195 132 200 
               L 135 250 
               Q 100 258 65 250 Z"
            fill="url(#bodyGradientMatte)"
          />

          {/* Left leg */}
          <path 
            d="M 65 250 
               Q 58 280 55 320 
               Q 54 360 58 390 
               Q 62 405 70 410 
               L 95 410 
               Q 100 385 98 350 
               Q 96 300 98 265 
               Q 98 252 95 248"
            fill="url(#bodyGradientMatte)"
          />

          {/* Right leg */}
          <path 
            d="M 135 250 
               Q 142 280 145 320 
               Q 146 360 142 390 
               Q 138 405 130 410 
               L 105 410 
               Q 100 385 102 350 
               Q 104 300 102 265 
               Q 102 252 105 248"
            fill="url(#bodyGradientMatte)"
          />

          {/* Muscle definition lines - subtle */}
          {/* Spine */}
          <line x1="100" y1="72" x2="100" y2="200" stroke="#1a1a1a" strokeWidth="1"/>
          {/* Shoulder blades */}
          <path d="M 75 95 Q 85 105 92 120" stroke="#1a1a1a" strokeWidth="0.6" fill="none"/>
          <path d="M 125 95 Q 115 105 108 120" stroke="#1a1a1a" strokeWidth="0.6" fill="none"/>
          {/* Lat lines */}
          <path d="M 68 115 Q 78 130 82 155" stroke="#1a1a1a" strokeWidth="0.6" fill="none"/>
          <path d="M 132 115 Q 122 130 118 155" stroke="#1a1a1a" strokeWidth="0.6" fill="none"/>
          {/* Lower back */}
          <path d="M 88 165 Q 100 160 112 165" stroke="#181818" strokeWidth="0.5" fill="none"/>
          <path d="M 85 185 Q 100 180 115 185" stroke="#181818" strokeWidth="0.5" fill="none"/>
          {/* Glute separation */}
          <line x1="100" y1="205" x2="100" y2="245" stroke="#1a1a1a" strokeWidth="0.8"/>
          {/* Hamstring lines */}
          <path d="M 78 270 Q 82 310 80 345" stroke="#1a1a1a" strokeWidth="0.5" fill="none"/>
          <path d="M 122 270 Q 118 310 120 345" stroke="#1a1a1a" strokeWidth="0.5" fill="none"/>

          {/* CLICKABLE MUSCLE ZONES */}

          {/* Trapezius */}
          <path 
            d="M 65 68 Q 82 58 100 62 Q 118 58 135 68 L 128 98 Q 100 105 72 98 Z"
            {...getMuscleStyle("traps")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("traps")}
            onMouseEnter={() => onHoverMuscle("traps")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Left Rear Delt */}
          <path 
            d="M 55 72 Q 44 85 44 108 Q 50 122 60 125 Q 70 118 72 100 Q 70 82 62 72 Z"
            {...getMuscleStyle("shoulders")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("shoulders")}
            onMouseEnter={() => onHoverMuscle("shoulders")}
            onMouseLeave={() => onHoverMuscle("")}
          />
          {/* Right Rear Delt */}
          <path 
            d="M 145 72 Q 156 85 156 108 Q 150 122 140 125 Q 130 118 128 100 Q 130 82 138 72 Z"
            {...getMuscleStyle("shoulders")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("shoulders")}
            onMouseEnter={() => onHoverMuscle("shoulders")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Left Lat */}
          <path 
            d="M 68 100 Q 58 120 56 150 Q 62 180 72 195 Q 85 198 90 185 Q 95 155 92 125 Q 88 105 80 100 Z"
            {...getMuscleStyle("lats")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("lats")}
            onMouseEnter={() => onHoverMuscle("lats")}
            onMouseLeave={() => onHoverMuscle("")}
          />
          {/* Right Lat */}
          <path 
            d="M 132 100 Q 142 120 144 150 Q 138 180 128 195 Q 115 198 110 185 Q 105 155 108 125 Q 112 105 120 100 Z"
            {...getMuscleStyle("lats")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("lats")}
            onMouseEnter={() => onHoverMuscle("lats")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Middle Back */}
          <path 
            d="M 88 102 Q 100 98 112 102 L 112 150 Q 100 155 88 150 Z"
            {...getMuscleStyle("middle back")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("middle back")}
            onMouseEnter={() => onHoverMuscle("middle back")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Lower Back */}
          <path 
            d="M 85 155 Q 100 150 115 155 L 115 198 Q 100 205 85 198 Z"
            {...getMuscleStyle("lower back")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("lower back")}
            onMouseEnter={() => onHoverMuscle("lower back")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Left Tricep */}
          <path 
            d="M 44 128 Q 36 150 36 178 Q 42 198 52 202 Q 62 196 65 175 Q 66 150 58 130 Q 52 125 44 128"
            {...getMuscleStyle("triceps")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("triceps")}
            onMouseEnter={() => onHoverMuscle("triceps")}
            onMouseLeave={() => onHoverMuscle("")}
          />
          {/* Right Tricep */}
          <path 
            d="M 156 128 Q 164 150 164 178 Q 158 198 148 202 Q 138 196 135 175 Q 134 150 142 130 Q 148 125 156 128"
            {...getMuscleStyle("triceps")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("triceps")}
            onMouseEnter={() => onHoverMuscle("triceps")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Left Forearm */}
          <path 
            d="M 36 205 Q 30 225 28 248 Q 34 262 45 265 Q 55 258 58 240 Q 60 218 55 205 Q 46 202 36 205"
            {...getMuscleStyle("forearms")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("forearms")}
            onMouseEnter={() => onHoverMuscle("forearms")}
            onMouseLeave={() => onHoverMuscle("")}
          />
          {/* Right Forearm */}
          <path 
            d="M 164 205 Q 170 225 172 248 Q 166 262 155 265 Q 145 258 142 240 Q 140 218 145 205 Q 154 202 164 205"
            {...getMuscleStyle("forearms")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("forearms")}
            onMouseEnter={() => onHoverMuscle("forearms")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Glutes */}
          <path 
            d="M 70 205 Q 100 198 130 205 L 130 248 Q 100 258 70 248 Z"
            {...getMuscleStyle("glutes")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("glutes")}
            onMouseEnter={() => onHoverMuscle("glutes")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Left Hamstring */}
          <path 
            d="M 68 255 Q 60 290 58 330 Q 64 360 75 372 Q 90 375 95 360 Q 98 320 96 280 Q 94 260 92 255 Q 80 252 68 255"
            {...getMuscleStyle("hamstrings")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("hamstrings")}
            onMouseEnter={() => onHoverMuscle("hamstrings")}
            onMouseLeave={() => onHoverMuscle("")}
          />
          {/* Right Hamstring */}
          <path 
            d="M 132 255 Q 140 290 142 330 Q 136 360 125 372 Q 110 375 105 360 Q 102 320 104 280 Q 106 260 108 255 Q 120 252 132 255"
            {...getMuscleStyle("hamstrings")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("hamstrings")}
            onMouseEnter={() => onHoverMuscle("hamstrings")}
            onMouseLeave={() => onHoverMuscle("")}
          />

          {/* Left Calf */}
          <path 
            d="M 60 378 Q 54 392 55 405 Q 62 410 75 410 Q 90 405 94 392 Q 95 380 90 375 Q 76 372 60 378"
            {...getMuscleStyle("calves")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("calves")}
            onMouseEnter={() => onHoverMuscle("calves")}
            onMouseLeave={() => onHoverMuscle("")}
          />
          {/* Right Calf */}
          <path 
            d="M 140 378 Q 146 392 145 405 Q 138 410 125 410 Q 110 405 106 392 Q 105 380 110 375 Q 124 372 140 378"
            {...getMuscleStyle("calves")}
            className="cursor-pointer"
            style={{ transition: "all 0.3s ease" }}
            onClick={() => handleClick("calves")}
            onMouseEnter={() => onHoverMuscle("calves")}
            onMouseLeave={() => onHoverMuscle("")}
          />
        </g>
      )}

      {/* Hover label with arrow */}
      {hoveredMuscle && (
        <g>
          {(() => {
            const pos = getLabelPosition(hoveredMuscle);
            const label = muscleLabels[hoveredMuscle] || hoveredMuscle;
            const boxWidth = label.length * 8 + 24;
            return (
              <>
                <rect 
                  x={pos.x} 
                  y={pos.y - 14} 
                  width={boxWidth} 
                  height="24" 
                  rx="6" 
                  fill="rgba(20, 20, 20, 0.95)" 
                  stroke="#39ff14" 
                  strokeWidth="1"
                />
                <polygon 
                  points={`${pos.x + boxWidth - 8},${pos.y + 10} ${pos.x + boxWidth + 2},${pos.y - 2} ${pos.x + boxWidth + 2},${pos.y + 10}`}
                  fill="rgba(20, 20, 20, 0.95)"
                  stroke="#39ff14"
                  strokeWidth="1"
                />
                <text 
                  x={pos.x + 12} 
                  y={pos.y + 3} 
                  fill="#39ff14" 
                  fontSize="12" 
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                >
                  {label}
                </text>
              </>
            );
          })()}
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
              className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 lg:sticky lg:top-24"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-300 tracking-wide">KAS HARİTASI</h2>
                <div className="flex items-center gap-1 bg-[#111] rounded-lg p-1">
                  <button
                    onClick={() => setBodyView("front")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      bodyView === "front" 
                        ? "bg-[#39ff14] text-black" 
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                    data-testid="button-view-front"
                  >
                    Ön
                  </button>
                  <button
                    onClick={() => setBodyView("back")}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      bodyView === "back" 
                        ? "bg-[#39ff14] text-black" 
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                    data-testid="button-view-back"
                  >
                    Arka
                  </button>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={bodyView}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-[260px] md:max-w-[300px]"
                  >
                    <PremiumBodyMap
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
                        ? "bg-[#39ff14] text-black shadow-lg shadow-[#39ff14]/30"
                        : "bg-[#111] text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300 border border-white/5"
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
                  className="mt-4 p-4 bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#39ff14] text-sm font-medium">Seçili Kas:</span>
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
                  className="pl-10 bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-500"
                  data-testid="input-exercise-search"
                />
              </div>

              {/* Results header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-white">
                  {selectedMuscle ? muscleLabels[selectedMuscle] : "Tüm"} Egzersizler
                  <span className="text-[#39ff14] ml-2">({data?.total || 0})</span>
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
                <div className="text-center py-12 bg-[#0a0a0a] rounded-2xl border border-white/5">
                  <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-bold text-white mb-2">Egzersiz Bulunamadı</h3>
                  <p className="text-gray-400 mb-4">Bu kas grubu için egzersiz bulunamadı.</p>
                  <Button onClick={clearSelection} className="bg-[#39ff14] text-black hover:bg-[#39ff14]/90">
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
                            className="group bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden hover:border-[#39ff14]/50 transition-all duration-300 cursor-pointer"
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
                                <span className="text-[#39ff14] text-sm font-medium flex items-center gap-1">
                                  Detayları Gör <ChevronRight className="w-4 h-4" />
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-heading font-bold text-white mb-2 group-hover:text-[#39ff14] transition-colors line-clamp-2">
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
                                  <span className="text-xs text-[#39ff14]/80 bg-[#39ff14]/10 px-2 py-1 rounded">
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
                                  ? "bg-[#39ff14] text-black"
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
