/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Upload, 
  Image as ImageIcon, 
  Camera, 
  Sun, 
  Maximize2, 
  Sparkles, 
  ChevronRight,
  Loader2,
  RefreshCw,
  Download,
  Copy,
  Check,
  Info,
  ChevronDown,
  Layout,
  Diamond,
  Leaf,
  Factory,
  Building2,
  Shapes,
  Layers,
  Droplets,
  Palette,
  Zap,
  Cloud,
  Eye,
  ArrowDownToLine,
  ChevronUp,
  RotateCw,
  Trophy,
  Table,
  Waves,
  Anchor,
  Wind,
  Hand,
  Clapperboard,
  Flame,
  Snowflake,
  Lightbulb,
  Box,
  Monitor,
  Car,
  Mountain,
  Utensils,
  Sofa,
  Rocket,
  TreePine,
  Hammer,
  Cpu,
  Map,
  Move,
  Search,
  Sunrise,
  Moon,
  SunMedium,
  Ban,
  ArrowUp,
  Wand2,
  Hourglass,
  Shirt,
  BedDouble,
  Dumbbell,
  Landmark,
  Ghost,
  Candy,
  Focus
} from 'lucide-react';

// Help icons mapping
const backgroundIcons: Record<BackgroundStyle, React.ReactNode> = {
  None: <Ban size={14} />,
  Minimalist: <Layout size={14} />,
  Luxury: <Diamond size={14} />,
  Nature: <Leaf size={14} />,
  Industrial: <Factory size={14} />,
  Urban: <Building2 size={14} />,
  Abstract: <Shapes size={14} />,
  "Studio Gradient": <Layers size={14} />,
  "Liquid & Splash": <Droplets size={14} />,
  "Monochrome Stage": <Palette size={14} />,
  "Neon Vaporwave": <Zap size={14} />,
  "Ethereal Cloud": <Cloud size={14} />,
  "Coastal/Beach": <Waves size={14} />,
  "Mountain Road": <Mountain size={14} />,
  "Modern Kitchen": <Utensils size={14} />,
  "Cozy Living Room": <Sofa size={14} />,
  "Sci-Fi/Futuristic": <Rocket size={14} />,
  "Cyberpunk City": <Building2 size={14} />,
  "Autumn Forest": <TreePine size={14} />,
  "Rustic Workshop": <Hammer size={14} />,
  "High-Tech Lab": <Cpu size={14} />,
  "Cozy Bedroom": <BedDouble size={14} />,
  "Fitness Gym": <Dumbbell size={14} />,
  "Art Gallery": <Landmark size={14} />,
  "Space Station": <Rocket size={14} />,
  "Frozen Tundra": <Snowflake size={14} />,
  "Ancient Ruins": <Ghost size={14} />,
  "Candy Wonderland": <Candy size={14} />,
  "Desert Dunes": <Sun size={14} />
};

const perspectiveIcons: Record<Perspective, React.ReactNode> = {
  None: <Ban size={14} />,
  Front: <Monitor size={14} />,
  "Top Down": <ArrowDownToLine size={14} />,
  "Eye Level": <Eye size={14} />,
  "Low Angle": <ChevronUp size={14} />,
  Macro: <Maximize2 size={14} />,
  "Dutch Angle": <RotateCw size={14} />,
  "Tracking Shot": <Move size={14} />,
  "Wide Establishing": <Map size={14} />,
  "Extreme Close-up": <Search size={14} />,
  "Over the Shoulder": <Eye size={14} />,
  "Isometric": <Box size={14} />,
  "Symmetrical": <Layout size={14} />,
  "Point of View (POV)": <Focus size={14} />
};

const placementIcons: Record<Placement, React.ReactNode> = {
  None: <Ban size={14} />,
  "Center Podium": <Trophy size={14} />,
  "Levitating": <Cloud size={14} />,
  "Tabletop": <Table size={14} />,
  "Submerged": <Waves size={14} />,
  "Embedded": <Anchor size={14} />,
  "Dynamic Movement": <Wind size={14} />,
  "Handheld": <Hand size={14} />,
  "Moving on Road": <Car size={14} />,
  "Kitchen Counter": <Utensils size={14} />,
  "Living Room Table": <Sofa size={14} />,
  "Outdoor Terrain": <Mountain size={14} />,
  "Suspended in Space": <Rocket size={14} />,
  "Reflected on Mirror": <Monitor size={14} />,
  "Sinking in Liquid": <Droplets size={14} />,
  "Buried in Sand": <Hourglass size={14} />,
  "Held by Glove": <Hand size={14} />,
  "Draped over Surface": <Shirt size={14} />
};

const lightingIcons: Record<LightingStyle, React.ReactNode> = {
  None: <Ban size={14} />,
  Natural: <Sun size={14} />,
  Studio: <Box size={14} />,
  Cinematic: <Clapperboard size={14} />,
  Warm: <Flame size={14} />,
  Cold: <Snowflake size={14} />,
  Neon: <Lightbulb size={14} />,
  "Volumetric Rays": <Zap size={14} />,
  "Night Streetlights": <Moon size={14} />,
  "Golden Hour": <Sunrise size={14} />,
  "Harsh Sunlight": <SunMedium size={14} />,
  "Bioluminescent Glow": <Leaf size={14} />,
  "Dark & Moody": <Moon size={14} />,
  "High-Key Bright": <Sun size={14} />,
  "Cyberpunk Neon": <Zap size={14} />,
  "Romantic Candlelight": <Flame size={14} />
};

interface VisualSelectProps<T extends string> {
  label: string;
  value: T;
  options: T[];
  onChange: (val: T) => void;
  iconMap: Record<T, React.ReactNode>;
  detailMap: Record<T, string>;
  isRecommended?: boolean;
}

function VisualSelect<T extends string>({ label, value, options, onChange, iconMap, detailMap, isRecommended }: VisualSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`bg-slate-900 p-4 rounded-xl border flex flex-col justify-between gap-3 relative group transition-all duration-500 ${isRecommended ? 'border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-950/20' : 'border-slate-800'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{label}</label>
           {isRecommended && <Sparkles size={10} className="text-emerald-400" />}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Info size={10} className="text-slate-600" />
        </div>
      </div>
      
      <div className="relative" ref={containerRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full bg-slate-800 border border-slate-700 rounded-md text-xs p-2.5 text-slate-200 focus:outline-none focus:border-yellow-400/50 flex items-center justify-between cursor-pointer hover:bg-slate-750 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-yellow-400/70">{iconMap[value]}</span>
            <span>{value}</span>
          </div>
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-[100] left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar"
            >
              {options.map((opt) => (
                <div 
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className={`group/item p-3 flex flex-col gap-1 cursor-pointer transition-all border-l-2 ${value === opt ? 'bg-yellow-400/5 border-yellow-400' : 'hover:bg-slate-800 border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded bg-slate-800 border border-slate-700 transition-colors ${value === opt ? 'text-yellow-400 border-yellow-400/30' : 'text-slate-400 group-hover/item:text-slate-300'}`}>
                      {iconMap[opt]}
                    </div>
                    <span className={`text-xs font-bold tracking-tight transition-colors ${value === opt ? 'text-yellow-400' : 'text-slate-300 group-hover/item:text-white'}`}>
                      {opt}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight pl-10 opacity-80 group-hover/item:opacity-100 transition-opacity font-medium">
                    {detailMap[opt]}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistent Visual Tooltip on Selection */}
      <div className="mt-1 h-8 overflow-hidden">
         <p className="text-[9px] text-slate-400 leading-tight italic line-clamp-2">
            {detailMap[value]}
         </p>
      </div>
    </div>
  );
}
import { motion, AnimatePresence } from 'motion/react';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
type LightingStyle = 'None' | 'Natural' | 'Studio' | 'Cinematic' | 'Warm' | 'Cold' | 'Neon' | 'Volumetric Rays' | 'Night Streetlights' | 'Golden Hour' | 'Harsh Sunlight' | 'Bioluminescent Glow' | 'Dark & Moody' | 'High-Key Bright' | 'Cyberpunk Neon' | 'Romantic Candlelight';
type Perspective = 'None' | 'Front' | 'Top Down' | 'Eye Level' | 'Low Angle' | 'Macro' | 'Dutch Angle' | 'Tracking Shot' | 'Wide Establishing' | 'Extreme Close-up' | 'Over the Shoulder' | 'Isometric' | 'Symmetrical' | 'Point of View (POV)';
type BackgroundStyle = 'None' | 'Minimalist' | 'Luxury' | 'Nature' | 'Industrial' | 'Urban' | 'Abstract' | 'Studio Gradient' | 'Liquid & Splash' | 'Monochrome Stage' | 'Neon Vaporwave' | 'Ethereal Cloud' | 'Coastal/Beach' | 'Mountain Road' | 'Modern Kitchen' | 'Cozy Living Room' | 'Sci-Fi/Futuristic' | 'Cyberpunk City' | 'Autumn Forest' | 'Rustic Workshop' | 'High-Tech Lab' | 'Cozy Bedroom' | 'Fitness Gym' | 'Art Gallery' | 'Space Station' | 'Frozen Tundra' | 'Ancient Ruins' | 'Candy Wonderland' | 'Desert Dunes';
type Placement = 'None' | 'Center Podium' | 'Levitating' | 'Tabletop' | 'Submerged' | 'Embedded' | 'Dynamic Movement' | 'Handheld' | 'Moving on Road' | 'Kitchen Counter' | 'Living Room Table' | 'Outdoor Terrain' | 'Suspended in Space' | 'Reflected on Mirror' | 'Sinking in Liquid' | 'Buried in Sand' | 'Held by Glove' | 'Draped over Surface';

const contextSuggestions: Record<BackgroundStyle, string[]> = {
  None: ["premium materials", "intricate details", "creative lighting"],
  Minimalist: ["clean geometric shadows", "soft matte texture", "perfectly balanced layout"],
  Luxury: ["gold foil accents", "velvet draped background", "faceted crystal reflections"],
  Nature: ["sunlight filtering through leaves", "dew drops on moss", "wildflowers in the background"],
  Industrial: ["brushed steel textures", "exposed concrete", "warm tungsten bulb glow"],
  Urban: ["blurred street lights", "wet asphalt reflections", "concrete and glass textures"],
  Abstract: ["floating geometric shapes", "surreal lighting gradients", "impossible architecture"],
  "Studio Gradient": ["smooth seamless backdrop", "perfect rim lighting", "soft reflections"],
  "Liquid & Splash": ["high-speed water crown", "floating citrus slices", "effervescent bubbles"],
  "Monochrome Stage": ["painted wooden blocks", "perfect color match", "soft diffused shadows"],
  "Neon Vaporwave": ["glowing grid lines", "retro-futuristic tech", "cyan and pink neon glow"],
  "Ethereal Cloud": ["soft cotton-like clouds", "pastel skies", "angelic sun rays"],
  "Coastal/Beach": ["crashing ocean waves", "white sand textures", "driftwood accents", "seashells"],
  "Mountain Road": ["misty pine trees", "winding mountain pass", "morning fog"],
  "Modern Kitchen": ["chef's knife", "cutting board", "fresh ingredients", "ambient steam", "marble countertop"],
  "Cozy Living Room": ["knitted throw blanket", "steaming mug", "warm fireplace glow", "houseplants"],
  "Sci-Fi/Futuristic": ["holographic displays", "glowing blue energy lines", "metallic paneling"],
  "Cyberpunk City": ["rain-slicked streets", "neon kanji signs", "dense futuristic buildings"],
  "Autumn Forest": ["falling amber leaves", "morning frost", "soft golden sunlight"],
  "Rustic Workshop": ["wood shavings", "vintage hand tools", "dust motes in sunbeams"],
  "High-Tech Lab": ["sterile glass surfaces", "blue laser scanners", "clean room environment"]
};

const styleDetails: Record<BackgroundStyle, string> = {
  None: "Auto-determined by AI based on product category seamlessly.",
  Minimalist: "clean lines, monochromatic surfaces, subtle shadows, vast empty space, matte textures, geometric forms, and a serene, uncluttered atmosphere.",
  Luxury: "soft velvet drapes, polished marble pedestals, gilded gold accents, crystal reflections, premium leather textures, and a high-end boutique or palace atmosphere.",
  Nature: "lush tropical foliage, moss-covered rocks, morning dewdrops, sun-dappled forest floor, soft organic curves, whispering ferns, and vibrant earthy textures.",
  Industrial: "exposed brick walls, weathered steel beams, polished concrete floors, copper pipe accents, raw urban materials, warm Edison bulb glow, and gritty sophistication.",
  Urban: "pulsing neon city lights, wet asphalt reflecting colors, modern skyscraper backdrop, contemporary glass architecture, and vibrant late-night street energy.",
  Abstract: "floating geometric shapes, iridescent liquid metal, ethereal light orbs, soft color gradients, dreamlike surrealism, and artistic non-Euclidean geometry.",
  "Studio Gradient": "seamless smooth paper backdrop with a vibrant color gradient, soft studio lighting, clean commercial aesthetic, energetic pop-art colors.",
  "Liquid & Splash": "dynamic splashing water, milk, or colorful liquid, floating droplets frozen in time, high-speed macro photography setup, refreshing and energetic vibe.",
  "Monochrome Stage": "surroundings match the exact color of the product, creating a monochrome surreal stage, highly stylized editorial advertising, painted props.",
  "Neon Vaporwave": "retro-futuristic geometry, neon pink and cyan lights, glowing synthwave aesthetics, dark studio environment with vibrant saturated rim lighting.",
  "Ethereal Cloud": "soft floating clouds, pastel colored fog, heavenly glowing atmosphere, dreamy feather-light environment, hazy and ethereal lighting.",
  "Coastal/Beach": "white sand, crashing waves, sea foam, driftwood, bright sunny skies, coastal breeze vibe, seashells, and clear turquoise water.",
  "Mountain Road": "winding asphalt, majestic snow-capped peaks, pine trees blurring by, misty valleys, and rugged mountainous terrain.",
  "Modern Kitchen": "marble countertops, stainless steel appliances, warm pendant lights, fresh herbs, clean ceramic tiles, and a cozy morning atmosphere.",
  "Cozy Living Room": "plush sofa, woven rug, warm fireplace glow, bookshelves, potted indoor plants, and soft diffused window light.",
  "Sci-Fi/Futuristic": "holographic interfaces, sleek metal panels, anti-gravity chambers, glowing blue energy cores, and advanced technological architecture.",
  "Cyberpunk City": "rain-slicked streets, towering megastructures, glowing neon signs in various languages, gritty alleyways, and flying vehicles overhead.",
  "Autumn Forest": "golden and crimson leaves falling, crisp autumn air, mossy logs, warm earthy tones, and a magical woodland path.",
  "Rustic Workshop": "wooden workbench, scattered vintage tools, sawdust in the air, warm sunlight beaming through a dusty window, and raw craftsmanship.",
  "High-Tech Lab": "pristine white surfaces, glass beakers, glowing data screens, sterile environment, laser beams, and advanced technological research."
};

const lightingDetails: Record<LightingStyle, string> = {
  None: "Auto-determined dynamic professional lighting setup.",
  Natural: "soft ambient sunlight, authentic outdoor feel, gentle shadows, and realistic color reproduction.",
  Studio: "clean multi-point key lighting, professional commercial look, rim light separation, and controlled reflections.",
  Cinematic: "dramatic chiaroscuro lighting, high contrast, moody atmosphere, volumetric fog, and teal/orange color grading.",
  Warm: "golden hour glow, cozy candle-lit ambiance, soft orange hues, and inviting rich textures.",
  Cold: "steely blue tones, moonlight influence, crisp clean look, and a clinical or modern technology vibe.",
  Neon: "vibrant saturated colored lights, cyberpunk atmosphere, glowing rim lighting, and energetic artificial colors.",
  "Volumetric Rays": "thick atmospheric light beams breaking through clouds or windows, creating a majestic and divine mood with high contrast shadows.",
  "Night Streetlights": "orange sodium vapor glow, harsh overhead pools of light, deep shadows, cinematic night-time urban feel.",
  "Golden Hour": "low-angled warm sunlight just before sunset, long directional shadows, highly flattering amber tones, and romantic atmosphere.",
  "Harsh Sunlight": "unfiltered midday sun, sharp hard shadows, high exposure, bright outdoor desert or beach style, high contrast."
};

const perspectiveDetails: Record<Perspective, string> = {
  None: "Optimal auto-determined camera angle framing.",
  Front: "straight-on heroic composition, 50mm prime lens for zero distortion, symmetrical balance, and a clean professional catalog look.",
  "Top Down": "birds-eye view, 35mm wide-angle lens, flat lay arrangement, graphic composition, and a contemporary editorial vibe.",
  "Eye Level": "natural horizontal perspective, 85mm portrait lens, gentle bokeh, natural human-eye view, and a relatable lifestyle feel.",
  "Low Angle": "worm's-eye view looking up, 24mm ultra-wide lens, majestic and imposing presence, dramatic power dynamics, and a heroic product stance.",
  Macro: "extreme macro close-up, 100mm specialty macro lens, razor-thin depth of field, focused on microscopic textures and intricate craftsmanship.",
  "Dutch Angle": "tilted horizon, creative diagonal composition, 35mm lens, dynamic energy, unconventional and edgy perspective, avant-garde style.",
  "Tracking Shot": "camera moving alongside the subject, intense motion blur on the background and wheels, frozen subject, fast-paced action feel.",
  "Wide Establishing": "ultra-wide 14mm lens showing the entire environment, subject small in frame, epic scale, landscape photography style.",
  "Extreme Close-up": "cropping tightly into a specific detail, abstracting the form, focusing purely on material surface and reflections."
};

const placementDetails: Record<Placement, string> = {
  None: "Auto-positioned flawlessly for best visual appeal.",
  "Center Podium": "perfectly centered on an elegant display podium, anchoring the composition, presenting as a highly coveted artifact.",
  "Levitating": "magically suspended in mid-air, defying gravity, completely disconnected from the ground, surrounded by floating particles.",
  "Tabletop": "resting naturally on a textured surface or table, grounded and realistic, casting a solid shadow.",
  "Submerged": "partially or fully submerged beneath the surface of a liquid, with refraction, ripples, and bubbles interacting with the product.",
  "Embedded": "organically embedded or nestling into the surrounding environment (like sand, moss, or crushed ice) as if it naturally belongs there.",
  "Dynamic Movement": "caught in mid-motion, flying through the scene, surrounded by motion blur, splashing elements, or dramatic kinetic energy.",
  "Handheld": "elegantly held by a human hand, establishing scale and interaction, adding a human element to the composition.",
  "Moving on Road": "driving or moving fast along a paved surface, dynamic connection with the road, motion blur on the ground.",
  "Kitchen Counter": "placed naturally on a kitchen workspace, surrounded by ingredients or culinary tools, ready for use.",
  "Living Room Table": "resting casually on a coffee table or end table, part of a lived-in cozy interior space.",
  "Outdoor Terrain": "placed directly on rugged outdoor ground like dirt, rocks, grass, or sand, integrating with the landscape.",
  "Suspended in Space": "floating in a vast, dark, or glowing void, zero gravity environment, completely isolated from any surface."
};

interface RecommendedSettings {
  aspectRatio?: AspectRatio;
  placement?: Placement;
  lighting?: LightingStyle;
  perspective?: Perspective;
  background?: BackgroundStyle;
  customContext?: string;
}

export default function App() {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [styleReference, setStyleReference] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [lighting, setLighting] = useState<LightingStyle>('Studio');
  const [perspective, setPerspective] = useState<Perspective>('Eye Level');
  const [background, setBackground] = useState<BackgroundStyle>('Minimalist');
  const [placement, setPlacement] = useState<Placement>('Center Podium');
  const [customContext, setCustomContext] = useState<string>('');
  const [styleInfluence, setStyleInfluence] = useState<number>(100);
  
  const [recommendations, setRecommendations] = useState<RecommendedSettings | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isPrompting, setIsPrompting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const productInputRef = useRef<HTMLInputElement>(null);
  const styleInputRef = useRef<HTMLInputElement>(null);

  // Auto-analyze uploaded image
  React.useEffect(() => {
    if (!productImage) return;
    
    const timer = setTimeout(() => {
      const analyzeImage = async () => {
        setIsAnalyzing(true);
        try {
          const parts: any[] = [{ text: `Analyze the provided image(s) deeply and suggest the best photography settings to create a stunning hero shot. 
          CRITICAL LIGHTING LOGIC: If the product has highly reflective surfaces (metal, glass), prioritize 'Studio' or 'Cinematic' lighting with emphasis on reflections. If the product is for outdoor use, prioritize 'Natural', 'Golden Hour', or 'Harsh Sunlight'. Match the lighting to the material and intended use.
          
          ${styleReference ? `CRITICAL STYLE REFERENCE LOGIC: Two images are provided. The first is the PRODUCT, the second is the STYLE REFERENCE. The user has set the style influence to ${styleInfluence}%. If 100%, you MUST dictate the \`customContext\` to EXACTLY mimic the set design, spatial arrangement, element distribution, color palette, and general aesthetic from the STYLE REFERENCE, adapted to make sense for the PRODUCT. If lower, blend proportionally.` : `Based on the product alone, come up with an interesting \`customContext\` setting.`}
          
          Respond ONLY with a valid JSON object matching this exact format:
          {
            "aspectRatio": "16:9", // pick one: "16:9", "1:1", "4:3", "3:4", "9:16"
            "placement": "Center Podium",
            "lighting": "Studio",
            "perspective": "Eye Level",
            "background": "Minimalist",
            "customContext": "a short custom scenic detail suggestion"
          }
          
          Valid Placements: ${JSON.stringify(Object.keys(placementDetails))}
          Valid Lightings: ${JSON.stringify(Object.keys(lightingDetails))}
          Valid Perspectives: ${JSON.stringify(Object.keys(perspectiveDetails))}
          Valid Backgrounds: ${JSON.stringify(Object.keys(styleDetails))}
          
          No markdown formatting around JSON. Just the raw JSON object.` }];
          
          const base64Data = productImage.split(',')[1];
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: "image/png"
            }
          });
          
          if (styleReference) {
            const styleBase64Data = styleReference.split(',')[1];
            parts.push({
              inlineData: {
                data: styleBase64Data,
                mimeType: "image/png"
              }
            });
          }

          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ parts }],
            config: {
               temperature: 0.1,
            }
          });

          const textOutput = response.text || "";
          const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]) as RecommendedSettings;
            setRecommendations(parsed);
            
            if (parsed.aspectRatio) setAspectRatio(parsed.aspectRatio);
            if (parsed.placement) setPlacement(parsed.placement);
            if (parsed.lighting) setLighting(parsed.lighting);
            if (parsed.perspective) setPerspective(parsed.perspective);
            if (parsed.background) setBackground(parsed.background);
            if (parsed.customContext) setCustomContext(parsed.customContext);
          }
        } catch (err) {
          console.error("Failed to analyze image", err);
        } finally {
          setIsAnalyzing(false);
        }
      };
      
      analyzeImage();
    }, 1200);

    return () => clearTimeout(timer);
  }, [productImage, styleReference, styleInfluence]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generatePrompt = async () => {
    if (!productImage) return;
    setIsPrompting(true);
    setError(null);

    try {
      const styleInfo = styleDetails[background as keyof typeof styleDetails] || "";
      const angleInfo = perspectiveDetails[perspective as keyof typeof perspectiveDetails] || "";
      const placementInfo = placementDetails[placement as keyof typeof placementDetails] || "";
      
      const prompt = `You are a world-class Product Photographer and Master Scene Designer. 
      Analyze the uploaded product and the user's intent to create a breathtaking, high-end "hero shot" image generation prompt.
      
      STEP 1: Deeply analyze the image and accurately detect and categorize the product, paying special attention to niche product types like 'Cleaning Supplies', 'Automotive Accessories', 'Outdoor Gear', 'Pet Supplies', 'Skincare', 'Electronics', etc. Identify its EXACT CATEGORY, INDUSTRY, and PURPOSE.
      
      STEP 2: Based on the precise category identified in Step 1, introduce DYNAMIC LIFE, CONTEXT & MOVEMENT related to the product's action. You MUST explicitly include highly relevant dynamic elements, props, and environmental context:
      - CLEANING SUPPLIES: Explicitly include elements like soapy bubbles, water spray, or thick foam. Surround the product with a context demonstrating its use, such as a brushed steel kitchen counter with a pristine wiped surface contrasting with abstract grime, wet textures, and sterile bright lighting.
      - AUTOMOTIVE ACCESSORIES: Explicitly include dynamic elements like motion blur on wheels, volumetric smoke, road textures, glowing neon reflections, or wet asphalt.
      - OUTDOOR GEAR: Explicitly include elements like rugged terrain, splashing mud, dramatic mountain background, morning fog, or harsh sunlight reflections on the gear.
      - PET SUPPLIES: Explicitly include playful blur, flying kibble, soft fur textures, leaping pets in the blurred background, or sunny backyard vibes.
      - BEAUTY/SKINCARE: Add soft rippling water, splashing serum droplets, floating organic leaves, and gentle caustics.
      - ORGANIC FOOD/DRINK: Add fresh morning dew, exploding powder or spices, swirling steam, or lush greenery.
      - TECH/ELECTRONICS: Add glowing micro-circuitry motifs, anti-gravity components, brushed carbon fiber, dynamic sparks.
      - FASHION/FRAGRANCE: Add elegant fabric swatches catching the wind, sculptural shadows, floating petals.
      - HOME DECOR/FURNITURE: Add soft window light, floating dust motes, luxurious interior styling, organic shadows.
      - KITCHEN/HOME APPLIANCES: Add warm ambient steam, freshly chopped herbs, elegant wooden textures, spilled coffee beans.
      - TOYS/GAMING: Add playful floating geometric shapes, miniature diorama scale feel, energetic particle effects.
      
      Current Parameters:
      - Aspect Ratio: ${aspectRatio}
      ${placement !== 'None' ? `- Product Placement: ${placement} (${placementInfo})` : ''}
      ${lighting !== 'None' ? `- Lighting Mood: ${lighting} (${lightingDetails[lighting as keyof typeof lightingDetails]})` : ''}
      ${perspective !== 'None' ? `- Camera Perspective: ${perspective} (${angleInfo})` : ''}
      ${background !== 'None' ? `- Environment Theme: ${background} (${styleInfo})` : ''}
      ${customContext ? `- CUSTOM USER INSTRUCTION: "${customContext}"` : ''}
      ${styleReference ? `- CRITICAL: A Style Reference image is provided. The user desires the style influence to be ${styleInfluence}%. If 100%, mimic its EXACT element distribution, spatial arrangement, specific props, set design, color palette, and overall mood PERFECTLY, keeping the composition identical while seamlessly adapting the elements to make sense for the uploaded product. If lower, blend the reference's layout and aesthetic with the base product category proportionally.` : ''}

      Construct a highly advanced, ultra-detailed prompt that includes:
      1. THE PRODUCT: Precise identification. Describe its physical characteristics, materials, and premium finish in meticulous detail. ${placement !== 'None' ? `Incorporate the exact placement: "${placementInfo}".` : ''}
      2. ENVIRONMENT & PROPS: A rich, living world heavily influenced by the Style Reference (if provided) AND the ${background !== 'None' ? background : 'best-fitting'} theme. CRITICAL: If a Style Reference is provided, you MUST adopt the exact distribution of elements and the structural arrangement from it, swapping in context-appropriate props (e.g., if the reference has scattered fruit, but the product is electronics, scatter microchips/cables in the exact same pattern). Merge this with the product's natural context and the "Signature Elements" mentioned in Step 2. If it's a cleaning product, ensure the environment clearly shows what it cleans (grease, grime, dirt on appropriate surfaces like steel or tile). Include dynamic elements (water splashes, light rays, floating particles) to give the scene movement and life.
      3. CUSTOM DETAILS: Incorporate exactly: ${customContext ? customContext : 'elements that fit the product category flawlessly'}.
      4. LIGHTING & ATMOSPHERE (CRITICAL): ${lighting !== 'None' ? `Describe professional, complex lighting matching the ${lighting} mood.` : 'Describe professional, highly complementary lighting for the product.'} The LIGHTING MUST PRIORITIZE THE PRODUCT. Use a crisp spotlight, bright rim light, or key light aimed directly at the product to ensure it stands out sharply in focus, while the background and props subtly fall into a softer, supportive light. Wait, let me re-emphasize: The product must be the brightest, sharpest, most in-focus element.
      5. CINEMATIC SPECS: ${perspective !== 'None' ? angleInfo : 'Establish a compelling perspective.'}. Use terms like "8k resolution, hyper-realistic rendering, Unreal Engine 5, Octane Render, shot on Arri Alexa 65, macrophotography, insane detail, extremely sharp focus on the product, shallow depth of field".
      
      The product MUST remain the central hero, surrounded by a rich, hyper-detailed, living ecosystem perfectly aligned with the parameters and reference image. Output ONLY the final prompt. No meta-talk.`;

      const parts: any[] = [{ text: prompt }];
      
      const productBase64 = productImage.split(',')[1];
      parts.push({
        inlineData: {
          data: productBase64,
          mimeType: "image/png"
        }
      });

      if (styleReference) {
        const styleBase64 = styleReference.split(',')[1];
        parts.push({
          inlineData: {
            data: styleBase64,
            mimeType: "image/png"
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts }],
      });

      setGeneratedPrompt(response.text || '');
    } catch (err: any) {
      console.error(err);
      const errorString = String(err).toLowerCase();
      if (err.status === 429 || err?.error?.code === 429 || errorString.includes("429") || errorString.includes("quota")) {
        setError("API Quota Exceeded. Please check your plan and billing details.");
      } else {
        setError("Failed to generate prompt. Please check your API key or connection.");
      }
    } finally {
      setIsPrompting(false);
    }
  };

  const generateImage = async () => {
    if (!generatedPrompt || !productImage) return;
    setIsGenerating(true);
    setResultImage(null);
    setError(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: productImage.split(',')[1],
                mimeType: "image/png",
              },
            },
            {
              text: generatedPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          }
        }
      });

      const candidates = (response as any).candidates;
      if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            setResultImage(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      const errorString = String(err).toLowerCase();
      if (err.status === 429 || err?.error?.code === 429 || errorString.includes("429") || errorString.includes("quota")) {
        setError("API Quota Exceeded. Please check your plan and billing details.");
      } else {
        setError("Image generation failed. Ensure your Gemini API Key supports image generation.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-yellow-400 selection:text-slate-900 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-slate-900" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nano <span className="text-yellow-400">Banana</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex bg-slate-800 rounded-full p-1">
            <button className="px-4 py-1 text-[10px] uppercase font-bold bg-slate-700 rounded-full text-white shadow-sm transition-all">Studio</button>
            <button className="px-4 py-1 text-[10px] uppercase font-bold text-slate-500 hover:text-slate-300 transition-colors">History</button>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
             <div className="w-4 h-4 bg-slate-600 rounded-full opacity-50"></div>
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-6 overflow-x-hidden overflow-y-auto lg:overflow-hidden">
        {/* Left Sidebar: Assets & Inputs */}
        <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-5 lg:overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 relative">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 block">Source Product</label>
              <div 
                onClick={() => productInputRef.current?.click()}
                className={`aspect-square w-full rounded-lg bg-slate-800 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center group cursor-pointer hover:border-yellow-400/50 transition-all overflow-hidden ${productImage ? 'border-none' : ''}`}
              >
                {productImage ? (
                  <img src={productImage} alt="Product" className={`w-full h-full object-cover transition-opacity ${isAnalyzing ? 'opacity-50 blur-sm' : ''}`} />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-600 mb-2 group-hover:text-yellow-400 transition-colors" />
                    <p className="text-xs text-slate-500 font-medium">Click to upload product image</p>
                  </>
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                    <Loader2 size={32} className="text-yellow-400 animate-spin drop-shadow-md mb-2" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-200 drop-shadow-md bg-slate-900/50 px-2 py-1 rounded">Analyzing...</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={productInputRef} 
                  hidden 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, setProductImage)} 
                />
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 block">Style Reference (Optional)</label>
              <div className="flex gap-3 items-center">
                <div 
                  onClick={() => styleInputRef.current?.click()}
                  className={`w-20 h-20 shrink-0 rounded-lg bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center cursor-pointer hover:border-yellow-400/50 transition-all overflow-hidden ${styleReference ? 'border-none' : ''}`}
                >
                  {styleReference ? (
                    <img src={styleReference} alt="Style" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl text-slate-600">+</span>
                  )}
                  <input 
                    type="file" 
                    ref={styleInputRef} 
                    hidden 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, setStyleReference)} 
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-wider">Guide lighting and composition with a reference shot.</p>
                </div>
              </div>
              {styleReference && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 flex justify-between">
                    <span>Style Influence</span>
                    <span className="text-yellow-400">{styleInfluence}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={styleInfluence} 
                    onChange={(e) => setStyleInfluence(parseInt(e.target.value))}
                    className="w-full accent-yellow-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-yellow-400 block shrink-0">AI Generation Prompt</label>
              <div className="relative flex-1 min-h-[160px] flex flex-col gap-2">
                <textarea
                  value={generatedPrompt}
                  onChange={(e) => setGeneratedPrompt(e.target.value)}
                  placeholder="The scene prompt will appear here after composing..."
                  className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 resize-none focus:outline-none focus:border-yellow-400/30 font-mono"
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button 
                    onClick={handleCopyPrompt}
                    disabled={!generatedPrompt}
                    className={`p-2 rounded-md transition-all shadow-sm flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${isCopied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-yellow-400 border border-slate-700'}`}
                    title="Copy Prompt"
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} /> <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setGeneratedPrompt('')}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-500 hover:text-red-400 rounded-md transition-all shadow-sm border border-slate-700"
                    title="Clear Prompt"
                  >
                    <RefreshCw size={14} className={isPrompting ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={!productImage || isPrompting}
                  onClick={generatePrompt}
                  className="py-3 bg-slate-800 text-slate-200 font-bold rounded-lg hover:bg-slate-700 transition-all border border-slate-700 disabled:opacity-50 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {isPrompting ? <Loader2 size={14} className="animate-spin" /> : <Maximize2 size={14} />}
                  Compose
                </button>
                <button
                  disabled={!generatedPrompt || isGenerating}
                  onClick={generateImage}
                  className="py-3 bg-yellow-400 text-slate-950 font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/10 disabled:opacity-50 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Loader2 size={14} className="animate-spin text-slate-900" /> : <Sparkles size={14} />}
                  Generate
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Center/Right: Parameters & Canvas */}
        <section className="flex-1 flex flex-col gap-6 lg:overflow-hidden min-h-[600px] lg:min-h-0">
          {/* Global Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 shrink-0">
            <div className={`bg-slate-900 p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all duration-500 ${recommendations?.aspectRatio === aspectRatio ? 'border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-emerald-950/20' : 'border-slate-800'}`}>
              <div className="flex items-center gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Aspect Ratio</label>
                {recommendations?.aspectRatio === aspectRatio && <Sparkles size={10} className="text-emerald-400" />}
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['1:1', '3:4', '4:3', '9:16', '16:9'] as AspectRatio[]).map(r => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold border transition-all ${aspectRatio === r ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="mt-1 h-8">
                <p className="text-[9px] text-slate-600 italic">Determines the frame shape and final image resolution.</p>
              </div>
            </div>

            <VisualSelect 
              label="Placement"
              value={placement}
              options={['None', 'Center Podium', 'Levitating', 'Tabletop', 'Submerged', 'Embedded', 'Dynamic Movement', 'Handheld', 'Moving on Road', 'Kitchen Counter', 'Living Room Table', 'Outdoor Terrain', 'Suspended in Space', 'Reflected on Mirror', 'Sinking in Liquid', 'Buried in Sand', 'Held by Glove', 'Draped over Surface'] as Placement[]}
              onChange={setPlacement}
              iconMap={placementIcons}
              detailMap={placementDetails}
              isRecommended={recommendations?.placement === placement}
            />

            <VisualSelect 
              label="Lighting Style"
              value={lighting}
              options={['None', 'Natural', 'Studio', 'Cinematic', 'Warm', 'Cold', 'Neon', 'Volumetric Rays', 'Night Streetlights', 'Golden Hour', 'Harsh Sunlight', 'Bioluminescent Glow', 'Dark & Moody', 'High-Key Bright', 'Cyberpunk Neon', 'Romantic Candlelight'] as LightingStyle[]}
              onChange={setLighting}
              iconMap={lightingIcons}
              detailMap={lightingDetails}
              isRecommended={recommendations?.lighting === lighting}
            />

            <VisualSelect 
              label="Perspective"
              value={perspective}
              options={['None', 'Front', 'Top Down', 'Eye Level', 'Low Angle', 'Macro', 'Dutch Angle', 'Tracking Shot', 'Wide Establishing', 'Extreme Close-up', 'Over the Shoulder', 'Isometric', 'Symmetrical', 'Point of View (POV)'] as Perspective[]}
              onChange={setPerspective}
              iconMap={perspectiveIcons}
              detailMap={perspectiveDetails}
              isRecommended={recommendations?.perspective === perspective}
            />

            <VisualSelect 
              label="Environment Style"
              value={background}
              options={['None', 'Minimalist', 'Luxury', 'Nature', 'Industrial', 'Urban', 'Abstract', 'Studio Gradient', 'Liquid & Splash', 'Monochrome Stage', 'Neon Vaporwave', 'Ethereal Cloud', 'Coastal/Beach', 'Mountain Road', 'Modern Kitchen', 'Cozy Living Room', 'Sci-Fi/Futuristic', 'Cyberpunk City', 'Autumn Forest', 'Rustic Workshop', 'High-Tech Lab', 'Cozy Bedroom', 'Fitness Gym', 'Art Gallery', 'Space Station', 'Frozen Tundra', 'Ancient Ruins', 'Candy Wonderland', 'Desert Dunes'] as BackgroundStyle[]}
              onChange={setBackground}
              iconMap={backgroundIcons}
              detailMap={styleDetails}
              isRecommended={recommendations?.background === background}
            />
          </div>

          <div className={`p-4 rounded-xl border shrink-0 transition-all duration-500 ${recommendations?.customContext ? 'bg-emerald-950/20 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-900 border-slate-800'}`}>
             <div className="flex items-center gap-2 mb-3">
               <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block">Custom Scene Influence (Optional)</label>
               {recommendations?.customContext && <Sparkles size={10} className="text-emerald-400" />}
             </div>
             <input 
              type="text"
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              placeholder="e.g. Add floating silk ripples or glowing embers..."
              className="w-full bg-slate-800 border border-slate-700 rounded-md text-xs p-3 text-slate-200 focus:outline-none focus:border-yellow-400/30 font-sans"
             />
             
             {/* Auto-completion chips based on Environment Style */}
             {background !== 'None' && contextSuggestions[background] && (
               <div className="flex flex-wrap gap-2 mt-3">
                 {contextSuggestions[background].map(suggestion => (
                   <button
                     key={suggestion}
                     onClick={() => {
                        const current = customContext.trim();
                        if (!current.includes(suggestion)) {
                           setCustomContext(current ? `${current}, ${suggestion}` : suggestion);
                        }
                     }}
                     className="px-2.5 py-1 text-[10px] bg-slate-800 border border-slate-700 hover:border-yellow-400/50 hover:bg-slate-700 text-slate-300 rounded-full transition-colors truncate max-w-[200px]"
                   >
                     + {suggestion}
                   </button>
                 ))}
               </div>
             )}

             {recommendations?.customContext && (
               <p className="text-[9px] text-emerald-400/80 mt-2 italic flex items-center gap-1">
                 <Info size={10} /> AI suggested context applied. Feel free to edit.
               </p>
             )}
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center shadow-inner">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:24px_24px]"></div>
            
            <AnimatePresence mode="wait">
              {resultImage ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full h-full relative group p-8 flex items-center justify-center"
                >
                  <motion.div 
                    className="relative w-full h-full max-w-full max-h-full flex items-center justify-center"
                  >
                    <div className="relative inline-block max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden">
                      <img src={resultImage} alt="Result" className="w-full h-full object-contain max-h-[calc(100vh-350px)]" />
                    </div>
                  </motion.div>

                  <a 
                    href={resultImage} 
                    download="nano-banana-edit.png"
                    className="absolute top-4 right-4 p-3 bg-slate-900/80 backdrop-blur border border-slate-700 hover:bg-yellow-400 hover:text-slate-950 transition-all rounded-lg opacity-0 group-hover:opacity-100 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-lg z-50"
                  >
                    <Download size={14} /> Download
                  </a>
                </motion.div>
              ) : (
                <div className="z-10 flex flex-col items-center gap-6 text-center">
                  <div className={`w-32 h-32 border-4 border-slate-800 rounded-full border-t-yellow-400 flex items-center justify-center transition-all ${isGenerating ? 'animate-spin border-t-yellow-400' : 'opacity-40'}`}>
                    <ImageIcon className="text-slate-600" size={40} />
                  </div>
                  <div className="space-y-2 max-w-xs opacity-40">
                    <h3 className="text-xl font-bold tracking-tight text-slate-300 lowercase italic">Awaiting Scene Composition</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Select your parameters and click generate to visualize your product photography.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md flex flex-col items-center justify-center gap-6 z-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-slate-700 rounded-full border-t-yellow-400 animate-spin"></div>
                  <div className="space-y-1 text-center">
                    <p className="text-lg font-bold tracking-widest uppercase text-yellow-400 animate-pulse">Rendering Scene</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">Crafting professional photorealistic lighting...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Status Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-950/90 backdrop-blur px-6 flex items-center justify-between border-t border-slate-800 z-30">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isPrompting || isGenerating ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-500'}`}></span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest opacity-80">NANO_CORE v4.5: CONNECTED</span>
                </div>
                {error && (
                  <p 
                    className="text-[10px] text-red-400 font-bold truncate max-w-md bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20"
                    title={error}
                  >
                    Error: {error}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-6 text-slate-500 text-[10px] font-mono tracking-widest opacity-60">
                <div className="flex gap-4">
                  <span>RES: {aspectRatio}</span>
                  <span>RT: 14s</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
