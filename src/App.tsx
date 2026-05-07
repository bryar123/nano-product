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
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
type LightingStyle = 'Natural' | 'Studio' | 'Cinematic' | 'Warm' | 'Cold' | 'Neon';
type Perspective = 'Front' | 'Top Down' | 'Eye Level' | 'Low Angle' | 'Macro' | 'Dutch Angle';
type BackgroundStyle = 'Minimalist' | 'Luxury' | 'Nature' | 'Industrial' | 'Urban' | 'Abstract' | 'Studio Gradient' | 'Liquid & Splash' | 'Monochrome Stage' | 'Neon Vaporwave' | 'Ethereal Cloud';
type Placement = 'Center Podium' | 'Levitating' | 'Tabletop' | 'Submerged' | 'Embedded' | 'Dynamic Movement' | 'Handheld';

const styleDetails: Record<BackgroundStyle, string> = {
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
  "Ethereal Cloud": "soft floating clouds, pastel colored fog, heavenly glowing atmosphere, dreamy feather-light environment, hazy and ethereal lighting."
};

const perspectiveDetails: Record<Perspective, string> = {
  Front: "straight-on heroic composition, 50mm prime lens for zero distortion, symmetrical balance, and a clean professional catalog look.",
  "Top Down": "birds-eye view, 35mm wide-angle lens, flat lay arrangement, graphic composition, and a contemporary editorial vibe.",
  "Eye Level": "natural horizontal perspective, 85mm portrait lens, gentle bokeh, natural human-eye view, and a relatable lifestyle feel.",
  "Low Angle": "worm's-eye view looking up, 24mm ultra-wide lens, majestic and imposing presence, dramatic power dynamics, and a heroic product stance.",
  Macro: "extreme macro close-up, 100mm specialty macro lens, razor-thin depth of field, focused on microscopic textures and intricate craftsmanship.",
  "Dutch Angle": "tilted horizon, creative diagonal composition, 35mm lens, dynamic energy, unconventional and edgy perspective, avant-garde style."
};

const placementDetails: Record<Placement, string> = {
  "Center Podium": "perfectly centered on an elegant display podium, anchoring the composition, presenting as a highly coveted artifact.",
  "Levitating": "magically suspended in mid-air, defying gravity, completely disconnected from the ground, surrounded by floating particles.",
  "Tabletop": "resting naturally on a textured surface or table, grounded and realistic, casting a solid shadow.",
  "Submerged": "partially or fully submerged beneath the surface of a liquid, with refraction, ripples, and bubbles interacting with the product.",
  "Embedded": "organically embedded or nestling into the surrounding environment (like sand, moss, or crushed ice) as if it naturally belongs there.",
  "Dynamic Movement": "caught in mid-motion, flying through the scene, surrounded by motion blur, splashing elements, or dramatic kinetic energy.",
  "Handheld": "elegantly held by a human hand, establishing scale and interaction, adding a human element to the composition."
};

export default function App() {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [styleReference, setStyleReference] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [lighting, setLighting] = useState<LightingStyle>('Studio');
  const [perspective, setPerspective] = useState<Perspective>('Eye Level');
  const [background, setBackground] = useState<BackgroundStyle>('Minimalist');
  const [placement, setPlacement] = useState<Placement>('Center Podium');
  const [customContext, setCustomContext] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isPrompting, setIsPrompting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const productInputRef = useRef<HTMLInputElement>(null);
  const styleInputRef = useRef<HTMLInputElement>(null);

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
      
      STEP 1: Identify the product's EXACT CATEGORY and INDUSTRY (e.g., Skincare, Electronics, Organic Food, Luxury Jewelry).
      
      STEP 2: Introduce DYNAMIC LIFE & MOVEMENT. Add elements that give the product "life", such as:
      - BEAUTY/SKINCARE: Add soft rippling water, splashing serum droplets, floating organic leaves, translucent glass blocks, and gentle light caustics playing across surfaces.
      - ORGANIC FOOD/DRINK: Add fresh morning dew, exploding powder or spices, swirling steam, patches of lush green grass, rustic raw linen, and soft natural sunlight filtering through foliage.
      - TECH/ELECTRONICS: Add glowing micro-circuitry motifs, levitating anti-gravity components, brushed carbon fiber, dynamic sparks, and sharp neon rim lighting.
      - FASHION/FRAGRANCE: Add elegant fabric swatches catching the wind, sculptural shadows, floating flower petals, and architectural concrete forms.
      
      Current Parameters:
      - Aspect Ratio: ${aspectRatio}
      - Product Placement: ${placement} (${placementInfo})
      - Lighting Mood: ${lighting}
      - Camera Perspective: ${perspective} (${angleInfo})
      - Environment Theme: ${background} (${styleInfo})
      ${customContext ? `- CUSTOM USER INSTRUCTION: "${customContext}"` : ''}
      ${styleReference ? `- CRITICAL: A Style Reference image is provided. You MUST deeply analyze its lighting techniques, color palette, specific props, set design, and overall mood, and forcefully inject those EXACT aesthetics into your prompt. Mimic its vibe perfectly.` : ''}

      Construct a highly advanced, ultra-detailed prompt that includes:
      1. THE PRODUCT: Precise identification. Describe its physical characteristics, materials, and premium finish in meticulous detail. Incorporate the exact placement: "${placementInfo}".
      2. ENVIRONMENT & PROPS: A rich, living world heavily influenced by the Style Reference (if provided) and the ${background} theme. Surrounding it with the exact "Signature Elements" mentioned in Step 2. Include dynamic elements (water splashes, light rays, floating particles) to give the scene movement and life.
      3. CUSTOM DETAILS: Incorporate exactly: ${customContext ? customContext : 'elements that fit the product category flawlessly'}.
      4. LIGHTING & ATMOSPHERE (CRITICAL): Describe professional, complex lighting matching the ${lighting} mood (e.g., "volumetric fog", "cinematic chiaroscuro", "subsurface scattering", "soft glowing bounce light").
      5. CINEMATIC SPECS: ${angleInfo}. Use terms like "8k resolution, hyper-realistic rendering, Unreal Engine 5, Octane Render, shot on Arri Alexa 65, macrophotography, insane detail".
      
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
      <main className="flex-1 flex p-6 gap-6 overflow-hidden">
        {/* Left Sidebar: Assets & Inputs */}
        <aside className="w-[380px] flex flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 block">Source Product</label>
              <div 
                onClick={() => productInputRef.current?.click()}
                className={`aspect-square w-full rounded-lg bg-slate-800 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center group cursor-pointer hover:border-yellow-400/50 transition-all overflow-hidden ${productImage ? 'border-none' : ''}`}
              >
                {productImage ? (
                  <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-600 mb-2 group-hover:text-yellow-400 transition-colors" />
                    <p className="text-xs text-slate-500 font-medium">Click to upload product image</p>
                  </>
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
        <section className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Global Parameters */}
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 shrink-0">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-3">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Aspect Ratio</label>
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
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-3">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Placement</label>
              <select 
                value={placement}
                onChange={(e) => setPlacement(e.target.value as Placement)}
                className="bg-slate-800 border border-slate-700 rounded-md text-xs p-2 text-slate-200 focus:outline-none focus:border-yellow-400/50 appearance-none cursor-pointer"
              >
                {(['Center Podium', 'Levitating', 'Tabletop', 'Submerged', 'Embedded', 'Dynamic Movement', 'Handheld'] as Placement[]).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-3">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Lighting Style</label>
              <select 
                value={lighting}
                onChange={(e) => setLighting(e.target.value as LightingStyle)}
                className="bg-slate-800 border border-slate-700 rounded-md text-xs p-2 text-slate-200 focus:outline-none focus:border-yellow-400/50 appearance-none cursor-pointer"
              >
                {(['Natural', 'Studio', 'Cinematic', 'Warm', 'Cold', 'Neon'] as LightingStyle[]).map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-3">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Perspective</label>
              <select 
                value={perspective}
                onChange={(e) => setPerspective(e.target.value as Perspective)}
                className="bg-slate-800 border border-slate-700 rounded-md text-xs p-2 text-slate-200 focus:outline-none focus:border-yellow-400/50 appearance-none cursor-pointer"
              >
                {(['Front', 'Top Down', 'Eye Level', 'Low Angle', 'Macro', 'Dutch Angle'] as Perspective[]).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-3">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Environment Style</label>
              <select 
                value={background}
                onChange={(e) => setBackground(e.target.value as BackgroundStyle)}
                className="bg-slate-800 border border-slate-700 rounded-md text-xs p-2 text-slate-200 focus:outline-none focus:border-yellow-400/50 appearance-none cursor-pointer"
              >
                {(['Minimalist', 'Luxury', 'Nature', 'Industrial', 'Urban', 'Abstract', 'Studio Gradient', 'Liquid & Splash', 'Monochrome Stage', 'Neon Vaporwave', 'Ethereal Cloud'] as BackgroundStyle[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shrink-0">
             <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 block">Custom Scene Influence (Optional)</label>
             <input 
              type="text"
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              placeholder="e.g. Add floating silk ripples or glowing embers..."
              className="w-full bg-slate-800 border border-slate-700 rounded-md text-xs p-3 text-slate-200 focus:outline-none focus:border-yellow-400/30 font-sans"
             />
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
                  className="w-full h-full relative group p-8"
                >
                  <img src={resultImage} alt="Result" className="w-full h-full object-contain rounded-lg shadow-2xl" />
                  <a 
                    href={resultImage} 
                    download="nano-banana-edit.png"
                    className="absolute top-4 right-4 p-3 bg-slate-900/80 backdrop-blur border border-slate-700 hover:bg-yellow-400 hover:text-slate-950 transition-all rounded-lg opacity-0 group-hover:opacity-100 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-lg"
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
