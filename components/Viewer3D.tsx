"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, Loader, Stats } from "@react-three/drei";
import { OBJLoader, FBXLoader, STLLoader } from "three-stdlib";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import LightingControls, { LightingState } from "./LightingControls";

interface ModelProps {
  url: string;
  rotation: [number, number, number];
  texture: string | null;
  textureFlipY: boolean;
  wireframe: boolean;
}

// Separate component to handle wireframe
function WireframeEffect({ target, wireframe }: { target: THREE.Object3D, wireframe: boolean }) {
     useEffect(() => {
        target.traverse((child) => {
           if ((child as THREE.Mesh).isMesh) {
             const mesh = child as THREE.Mesh;
             // Ensure material is a standard material before setting map
             if (mesh.material) {
                // If it's an array for some reason (rare in simple imports but possible), use the first one
                 const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
                 material.wireframe = wireframe;
                 material.needsUpdate = true;
             }
           }
       });
     }, [target, wireframe]);
     return null;
}

// Separate component to avoid conditional hook usage
function TextureLoaderComponent({ url, target, flipY }: { url: string, target: THREE.Object3D, flipY: boolean }) {
    const texture = useLoader(THREE.TextureLoader, url);
    
    useEffect(() => {
       if (!texture || !target) return;
       
       texture.flipY = flipY;
       texture.colorSpace = THREE.SRGBColorSpace;
       // Wrap settings are important for correct mapping
       texture.wrapS = THREE.RepeatWrapping;
       texture.wrapT = THREE.RepeatWrapping;
       // We need to update the texture itself when properties change
       texture.needsUpdate = true;

       target.traverse((child) => {
           if ((child as THREE.Mesh).isMesh) {
             const mesh = child as THREE.Mesh;
             if (mesh.material) {
                 // Clone material to avoid affecting shared materials
                 const material = Array.isArray(mesh.material) 
                    ? mesh.material[0].clone() 
                    : mesh.material.clone();
                 
                 // If the mesh has no UVs, we can't properly map texture without complex projection
                 // But we can try to compute vertex normals if missing which helps lighting
                 if (!mesh.geometry.attributes.normal) {
                     mesh.geometry.computeVertexNormals();
                 }

                 // Check if the geometry has UV coordinates
                 if (!mesh.geometry.attributes.uv) {
                    console.warn("Mesh has no UV coordinates, texture mapping will be incorrect.");
                    // Optional: generate basic UVs? Usually better to warn.
                 }

                 material.map = texture;
                 material.needsUpdate = true;
                 mesh.material = material;
             }
           }
       });

       return () => {
        // Cleanup texture
        target.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (mesh.material) {
                   // Optional: revert to original or just clear map
                   // Simpler: just clear the map on the cloned material
                   const material = mesh.material as THREE.MeshStandardMaterial;
                   material.map = null;
                   material.needsUpdate = true;
                }
            }
        });
       };
    }, [texture, target, flipY]);

    return null;
}

function FBXModel({ url, rotation, texture, textureFlipY, wireframe }: ModelProps) {
    const fbx = useLoader(FBXLoader, url);
    return (
      <group rotation={rotation}>
        <primitive object={fbx} scale={0.01} /> 
        {texture && <TextureLoaderComponent url={texture} target={fbx} flipY={textureFlipY} />}
        <WireframeEffect target={fbx} wireframe={wireframe} />
      </group>
    );
}

function STLModel({ url, rotation, texture, textureFlipY, wireframe }: ModelProps) {
    const geometry = useLoader(STLLoader, url);
    const [mesh, setMesh] = useState<THREE.Mesh | null>(null);

    React.useMemo(() => {
        if (!geometry.attributes.normal) {
            geometry.computeVertexNormals();
        }
        geometry.center();
    }, [geometry]);

    return (
      <group rotation={rotation}>
        <mesh ref={setMesh} geometry={geometry}>
             <meshStandardMaterial color="#cccccc" />
        </mesh>
        {texture && mesh && <TextureLoaderComponent url={texture} target={mesh} flipY={textureFlipY} />}
        {mesh && <WireframeEffect target={mesh} wireframe={wireframe} />}
      </group>
    );
}

function GLTFModel({ url, rotation, texture, textureFlipY, wireframe }: ModelProps) {
  const { scene } = useGLTF(url);
  return (
    <group rotation={rotation}>
      <primitive object={scene} />
      {texture && <TextureLoaderComponent url={texture} target={scene} flipY={textureFlipY} />}
      <WireframeEffect target={scene} wireframe={wireframe} />
    </group>
  );
}

function OBJModel({ url, rotation, texture, textureFlipY, wireframe }: ModelProps) {
  const obj = useLoader(OBJLoader, url);
  return (
    <group rotation={rotation}>
      <primitive object={obj} />
      {texture && <TextureLoaderComponent url={texture} target={obj} flipY={textureFlipY} />}
      <WireframeEffect target={obj} wireframe={wireframe} />
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
  type: "glb" | "gltf" | "obj" | "fbx" | "stl" | null;
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
    textureFlipY: false, // Default to false (standard for GLTF), but let user flip it
    showPointLightHelper: true,
    modelRotation: [0, 0, 0],
    texture: null,
    backgroundColor: "#111827", // Start with bg-slate-900 equivalent
    wireframe: false,
    showStats: false,
    environmentPreset: "city",
    enableBloom: false,
    enableVignette: false
  });

  if (!url) {
    return (
      <div className="flex items-center justify-center w-full h-full text-white bg-slate-900">
        <p className="text-xl">Upload a file to view</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative" style={{ backgroundColor: lighting.backgroundColor }}>
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        {lighting.showStats && <Stats />}
        <SceneLights config={lighting} />
        <Suspense fallback={null}>
          <Stage environment={lighting.environmentPreset as any} intensity={0.5}>
            {(type === "glb" || type === "gltf") && <GLTFModel url={url} rotation={lighting.modelRotation} texture={lighting.texture} textureFlipY={lighting.textureFlipY} wireframe={lighting.wireframe} />}
            {type === "obj" && <OBJModel url={url} rotation={lighting.modelRotation} texture={lighting.texture} textureFlipY={lighting.textureFlipY} wireframe={lighting.wireframe} />}
            {type === "fbx" && <FBXModel url={url} rotation={lighting.modelRotation} texture={lighting.texture} textureFlipY={lighting.textureFlipY} wireframe={lighting.wireframe} />}
            {type === "stl" && <STLModel url={url} rotation={lighting.modelRotation} texture={lighting.texture} textureFlipY={lighting.textureFlipY} wireframe={lighting.wireframe} />}
          </Stage>
        </Suspense>
        
        {/* Post Processing Effects */}
        {(lighting.enableBloom || lighting.enableVignette) && (
            <EffectComposer>
                {lighting.enableBloom && <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />}
                {lighting.enableVignette && <Vignette eskil={false} offset={0.1} darkness={1.1} />}
            </EffectComposer>
        )}

        <OrbitControls makeDefault />
      </Canvas>
      <Loader />
      <LightingControls config={lighting} onChange={setLighting} />
    </div>
  );
}
