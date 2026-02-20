# Web 3D Viewer

A modern web application for rendering 3D models directly in your browser. Built to view `.glb`, `.gltf`, `.obj`, `.fbx`, and `.stl` files instantly without needing heavy 3D software.

## Features

- **Comprehensive File Support**: Supports `.glb`, `.gltf`, `.obj`, `.fbx`, and `.stl` formats.
- **Environment Presets**: Switch between realistic lighting environments (City, Studio, Sunset, Night, etc.).
- **Post-Processing Effects**: Enable cinematic visual effects like **Bloom** (glow) and **Vignette**.
- **Smart Texture Mapping**: 
  - Automatically handles UV mapping and vertex normals to preserve original material properties.
  - Includes a **Flip Texture Y** toggle to fix common orientation issues.
- **Advanced Lighting Controls**: Customize Ambient, Directional, and Point lights with real-time visual helpers.
- **Precise Manipulation**: Sliders for precise model rotation on X, Y, and Z axes.
- **Intuitive Controls**: Standard orbit, zoom, and pan controls.

## Tech Stack

- **Next.js 16** (App Router)
- **React Three Fiber** & **Drei**
- **Three-stdlib** (Loaders)
- **React Postprocessing** (Effects)
- **Tailwind CSS**
- **Lucide React**

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/username/web-3d-viewer.git
    cd web-3d-viewer
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes

- **Blender Files**: Native Blender files (`.blend`) are not supported directly. Please export your models to **glTF 2.0**, **Wavefront (.obj)**, **FBX**, or **STL** before uploading.
- **Textures**: While the viewer uses smart mapping logic, textures will look best on models that have proper **UV Maps** created in 3D modeling software.

