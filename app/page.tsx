"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Upload } from "lucide-react";

// Dynamically import Viewer3D to avoid SSR issues with Canvas
const Viewer3D = dynamic(() => import("@/components/Viewer3D"), { ssr: false });

export default function Home() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"glb" | "gltf" | "obj" | "fbx" | "stl" | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    
    if (extension !== "glb" && extension !== "gltf" && extension !== "obj" && extension !== "fbx" && extension !== "stl") {
      alert("Unsupported file format. Please upload .glb, .gltf, .obj, .fbx, or .stl");
      return;
    }
    
    // Revoke previous URL to prevent memory leaks
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setFileType(extension as "glb" | "gltf" | "obj" | "fbx" | "stl");
    setFileName(file.name);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Header */}
      <header className="fixed z-50 top-0 left-0 w-full p-4 flex justify-between items-center bg-neutral-900/80 backdrop-blur border-b border-neutral-800">
        <h1 className="text-xl font-bold font-mono tracking-tighter">
          3D<span className="text-blue-500">VIEWER</span>
        </h1>
        {fileName && (
          <div className="flex items-center gap-4">
            <span className="text-xs bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700 text-neutral-400">
              {fileName} ({fileType?.toUpperCase()})
            </span>
            <button
              onClick={() => {
                setFileUrl(null);
                setFileType(null);
                setFileName(null);
              }}
              className="text-xs text-red-400 hover:text-red-300 underline"
            >
              Close
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative w-full h-full pt-16">
        {fileUrl ? (
          <div className="w-full h-full">
            <Viewer3D url={fileUrl} type={fileType} />
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center h-full w-full px-4"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
             <div 
                className={`
                  transition-all duration-300 ease-in-out
                  max-w-2xl w-full border-2 border-dashed rounded-2xl p-12
                  flex flex-col items-center justify-center text-center
                  cursor-pointer group
                  ${dragActive 
                    ? "border-blue-500 bg-blue-500/10 scale-[1.02]" 
                    : "border-neutral-700 hover:border-neutral-500 hover:bg-neutral-900"
                  }
                `}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleChange}
                  accept=".glb,.gltf,.obj"
                />
                <label 
                  htmlFor="file-upload" 
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className={`p-4 rounded-full bg-neutral-800 mb-6 group-hover:scale-110 transition-transform ${dragActive ? 'bg-blue-500/20' : ''}`}>
                    <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-400' : 'text-neutral-400'}`} />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Upload 3D Model</h2>
                  <p className="text-neutral-400 max-w-sm mb-4">
                    Drag & drop your .glb, .gltf, or .obj file here, or click to browse
                  </p>
                  
                  <p className="text-xs text-neutral-500 mb-8 italic">
                     Note: For .blend files, please export them as .glb or .gltf in Blender.
                  </p>

                  <div className="flex gap-4 text-xs text-neutral-500">
                    <span className="bg-neutral-900 px-2 py-1 rounded">.GLB</span>
                    <span className="bg-neutral-900 px-2 py-1 rounded">.GLTF</span>
                    <span className="bg-neutral-900 px-2 py-1 rounded">.OBJ</span>
                  </div>
                </label>
             </div>
          </div>
        )}
      </div>
    </main>
  );
}
