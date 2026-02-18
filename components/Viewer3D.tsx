"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, Loader } from "@react-three/drei";
import { OBJLoader } from "three-stdlib";
import * as THREE from "three";
import LightingControls, { LightingState } from "./LightingControls";

interface ModelProps {
  url: string;
  rotation: [number, number, number];
  texture: string | null;
}

// Separate component to avoid conditional hook usage
function TextureLoaderComponent({ url, target }: { url: string, target: THREE.Object3D }) {
    const texture = useLoader(THREE.TextureLoader, url);
    
    useEffect(() => {
       if (!texture) return;
       target.traverse((child) => {
           if ((child as THREE.Mesh).isMesh) {
             const mesh = child as THREE.Mesh;
             // Ensure material is a standard material before setting map
             if (mesh.material) {
                 const material = mesh.material as THREE.MeshStandardMaterial;
                 texture.flipY = false;
                 texture.colorSpace = THREE.SRGBColorSpace;
                 material.map = texture;
                 material.needsUpdate = true;
             }
           }
       });
       
       return () => {
           target.traverse((child) => {
               if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    if (mesh.material) {
                        const material = mesh.material as THREE.MeshStandardMaterial;
                        if (material.map === texture) {
                            material.map = null;
                            material.needsUpdate = true;
                        }
                    }
               }
           });
       };
    }, [texture, target]);

    return null;
}

function GLTFModel({ url, rotation, texture }: ModelProps) {
  const { scene } = useGLTF(url);
  return (
    <group rotation={rotation}>
      <primitive object={scene} />
      {texture && <TextureLoaderComponent url={texture} target={scene} />}
    </group>
  );
}

function OBJModel({ url, rotation, texture }: ModelProps) {
  const obj = useLoader(OBJLoader, url);
  return (
    <group rotation={rotation}>
      <primitive object={obj} />
      {texture && <TextureLoaderComponent url={texture} target={obj} />}
    </group>
  );
}

// Helper to visualize point light position
function PointLightHelper({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// Component to handle lights inside Canvas
function SceneLights({ config }: { config: LightingState }) {
  return (
    <>
      <ambientLight intensity={config.ambientIntensity} color={config.ambientColor} />
      <directionalLight 
        intensity={config.directionalIntensity} 
        color={config.directionalColor} 
        position={config.directionalPosition} 
        castShadow
      />
      <pointLight 
        intensity={config.pointIntensity} 
        color={config.pointColor} 
        position={config.pointPosition} 
        castShadow
      />
      {config.showPointLightHelper && (
        <PointLightHelper position={config.pointPosition} color={config.pointColor} />
      )}
    </>
  );
}

interface ViewerProps {
  url: string | null;
  type: "glb" | "gltf" | "obj" | null;
}

export default function Viewer3D({ url, type }: ViewerProps) {
  const [lighting, setLighting] = useState<LightingState>({
    ambientIntensity: 0.5,
    ambientColor: "#ffffff",
    directionalIntensity: 1,
    directionalColor: "#ffffff",
    directionalPosition: [5, 10, 5],
    pointIntensity: 0.5,
    pointColor: "#ffffff",
    pointPosition: [-5, 5, 5],
    showPointLightHelper: true,
    modelRotation: [0, 0, 0],
    texture: null
  });

  if (!url) {
    return (
      <div className="flex items-center justify-center w-full h-full text-white bg-slate-900">
        <p className="text-xl">Upload a file to view</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-slate-900 relative">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        <SceneLights config={lighting} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            {(type === "glb" || type === "gltf") && <GLTFModel url={url} rotation={lighting.modelRotation} texture={lighting.texture} />}
            {type === "obj" && <OBJModel url={url} rotation={lighting.modelRotation} texture={lighting.texture} />}
          </Stage>
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
      <Loader />
      <LightingControls config={lighting} onChange={setLighting} />
    </div>
  );
}
