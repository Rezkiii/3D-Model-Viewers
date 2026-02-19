import React from "react";

export interface LightingState {
  ambientIntensity: number;
  ambientColor: string;
  directionalIntensity: number;
  directionalColor: string;
  directionalPosition: [number, number, number];
  pointIntensity: number;
  pointColor: string;
  pointPosition: [number, number, number];
  showPointLightHelper: boolean;
  modelRotation: [number, number, number];
  texture: string | null;
  backgroundColor: string;
  wireframe: boolean;
  showStats: boolean;
}

interface LightingControlsProps {
  config: LightingState;
  onChange: (newConfig: LightingState) => void;
}

export default function LightingControls({ config, onChange }: LightingControlsProps) {
  const updateConfig = (key: keyof LightingState, value: string | number | boolean | number[] | null) => {
    onChange({ ...config, [key]: value });
  };

  const updatePosition = (key: "directionalPosition" | "pointPosition" | "modelRotation", axis: 0 | 1 | 2, value: number) => {
    const newPos = [...config[key]] as [number, number, number];
    newPos[axis] = value;
    updateConfig(key, newPos);
  };

  return (
    <div className="absolute top-20 right-4 bg-slate-800/90 text-white p-4 rounded-lg backdrop-blur-sm w-72 max-h-[80vh] overflow-y-auto border border-slate-700 shadow-xl z-10">
      <h3 className="font-bold text-lg mb-4 text-blue-400">Scene Controls</h3>

      {/* View Options */}
      <div className="mb-6 space-y-3">
        <h4 className="font-semibold text-sm uppercase text-slate-400 border-b border-slate-700 pb-1">View Options</h4>
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs">Background Color</label>
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateConfig("backgroundColor", e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
              />
            </div>
            <div className="flex items-center gap-2">
               <input 
                 type="checkbox" 
                 checked={config.wireframe}
                 onChange={(e) => updateConfig("wireframe", e.target.checked)}
                 id="wireframeMode"
               />
               <label htmlFor="wireframeMode" className="text-xs">Wireframe Mode</label>
            </div>
            <div className="flex items-center gap-2">
               <input 
                 type="checkbox" 
                 checked={config.showStats}
                 onChange={(e) => updateConfig("showStats", e.target.checked)}
                 id="showStats"
               />
               <label htmlFor="showStats" className="text-xs">Show Model Stats</label>
            </div>
        </div>
      </div>

      {/* Texture Upload */}
      <div className="mb-6 space-y-3">
        <h4 className="font-semibold text-sm uppercase text-slate-400 border-b border-slate-700 pb-1">Texture</h4>
        <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  updateConfig("texture", url);
                }
              }}
            />
            {config.texture && (
              <div className="relative w-full h-20 bg-slate-700 rounded overflow-hidden">
                <img src={config.texture} alt="Texture Preview" className="w-full h-full object-cover opacity-50" />
                <button
                  onClick={() => {
                    URL.revokeObjectURL(config.texture!);
                    updateConfig("texture", null);
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs hover:bg-red-500/50 transition-colors"
                >
                  Remove Texture
                </button>
              </div>
            )}
        </div>
      </div>

      {/* Model Rotation */}
      <div className="mb-6 space-y-3">
        <h4 className="font-semibold text-sm uppercase text-slate-400 border-b border-slate-700 pb-1">Model Rotation</h4>
        <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-mono w-4 text-center bg-red-500/20 rounded">X</label>
              <input
                type="range"
                min={-Math.PI}
                max={Math.PI}
                step="0.01"
                value={config.modelRotation[0]}
                onChange={(e) => updatePosition("modelRotation", 0, parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer hover:bg-slate-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-mono w-4 text-center bg-green-500/20 rounded">Y</label>
              <input
                type="range"
                min={-Math.PI}
                max={Math.PI}
                step="0.01"
                value={config.modelRotation[1]}
                onChange={(e) => updatePosition("modelRotation", 1, parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer hover:bg-slate-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-mono w-4 text-center bg-blue-500/20 rounded">Z</label>
              <input
                type="range"
                min={-Math.PI}
                max={Math.PI}
                step="0.01"
                value={config.modelRotation[2]}
                onChange={(e) => updatePosition("modelRotation", 2, parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer hover:bg-slate-500 transition-colors"
              />
            </div>
            <button 
              onClick={() => updateConfig("modelRotation", [0, 0, 0])}
              className="w-full mt-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
            >
              Reset Rotation
            </button>
        </div>
      </div>

      {/* Ambient Light */}
      <div className="mb-6 space-y-3">
        <h4 className="font-semibold text-sm uppercase text-slate-400 border-b border-slate-700 pb-1">Ambient Light</h4>
        <div className="flex flex-col gap-1">
          <label className="text-xs">Intensity: {config.ambientIntensity}</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={config.ambientIntensity}
            onChange={(e) => updateConfig("ambientIntensity", parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs">Color</label>
          <input
            type="color"
            value={config.ambientColor}
            onChange={(e) => updateConfig("ambientColor", e.target.value)}
            className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
          />
        </div>
      </div>

      {/* Directional Light */}
      <div className="mb-6 space-y-3">
        <h4 className="font-semibold text-sm uppercase text-slate-400 border-b border-slate-700 pb-1">Directional Light</h4>
        <div className="flex flex-col gap-1">
          <label className="text-xs">Intensity: {config.directionalIntensity}</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={config.directionalIntensity}
            onChange={(e) => updateConfig("directionalIntensity", parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs">Color</label>
          <input
            type="color"
            value={config.directionalColor}
            onChange={(e) => updateConfig("directionalColor", e.target.value)}
            className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs block">Position (X, Y, Z)</label>
          <div className="grid grid-cols-3 gap-2">
             {[0, 1, 2].map((axis) => (
                <input
                  key={axis}
                  type="number"
                  value={config.directionalPosition[axis]}
                  onChange={(e) => updatePosition("directionalPosition", axis as 0|1|2, parseFloat(e.target.value))}
                  className="bg-slate-700 rounded px-2 py-1 text-xs w-full"
                />
             ))}
          </div>
        </div>
      </div>

      {/* Point Light */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm uppercase text-slate-400 border-b border-slate-700 pb-1">Point Light</h4>
        <div className="flex items-center gap-2 mb-2">
           <input 
             type="checkbox" 
             checked={config.showPointLightHelper}
             onChange={(e) => updateConfig("showPointLightHelper", e.target.checked)}
             id="showHelper"
           />
           <label htmlFor="showHelper" className="text-xs">Show Helper</label>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs">Intensity: {config.pointIntensity}</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={config.pointIntensity}
            onChange={(e) => updateConfig("pointIntensity", parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs">Color</label>
          <input
            type="color"
            value={config.pointColor}
            onChange={(e) => updateConfig("pointColor", e.target.value)}
            className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs block">Position (X, Y, Z)</label>
          <div className="grid grid-cols-3 gap-2">
             {[0, 1, 2].map((axis) => (
                <input
                  key={axis}
                  type="number"
                  value={config.pointPosition[axis]}
                  onChange={(e) => updatePosition("pointPosition", axis as 0|1|2, parseFloat(e.target.value))}
                  className="bg-slate-700 rounded px-2 py-1 text-xs w-full"
                />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
