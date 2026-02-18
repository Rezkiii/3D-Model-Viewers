# Web 3D Viewer

Aplikasi web sederhana untuk menampilkan model 3D langsung di browser. Dibuat untuk melihat file `.glb`, `.gltf`, atau `.obj` tanpa perlu membuka software 3D editor.

## Fitur

- **Format File**: Mendukung file `.glb`, `.gltf`, dan `.obj`.
- **Lighting Controls**: Pengaturan pencahayaan yang dapat disesuaikan (Ambient, Directional, dan Point Light).
- **Model Rotation**: Slider untuk merotasi model pada sumbu X, Y, dan Z.
- **Texture Upload**: Fitur untuk mengunggah dan menerapkan tekstur gambar pada model.
- **Viewer Controls**: Zoom, pan, dan orbit menggunakan kontrol standar.

## Tech Stack

- **Next.js 16** (App Router)
- **React Three Fiber**
- **Tailwind CSS**
- **Lucide React**

## Cara Menjalankan

1.  **Clone repository**:
    ```bash
    git clone https://github.com/username/web-3d-viewer.git
    cd web-3d-viewer
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Jalankan server development**:
    ```bash
    npm run dev
    ```

4.  Buka browser dan akses `http://localhost:3000`.

## Catatan

- **Format Blender**: File asli Blender (`.blend`) tidak didukung secara langsung. Silakan export menjadi **glTF 2.0 (.glb/.gltf)** atau **Wavefront (.obj)** terlebih dahulu.
- **Tekstur**: Tekstur yang diunggah akan diterapkan secara global ke seluruh mesh pada model.

