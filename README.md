# Simple Web 3D Viewer 🧊

Proyek iseng ("gabut") buat nampilin model 3D langsung di browser. Gak perlu install software berat kayak Blender cuma buat ngecek bentuk model doang. Tinggal drag & drop file `.glb`, `.gltf`, atau `.obj`, kelar.

Dibangun pake **Next.js 16**, **React Three Fiber**, sama **Tailwind CSS**.

## ✨ Fitur

- **Support Format Populer**: Bisa baca file `.glb`, `.gltf`, dan `.obj`.
- **Lighting Control**: Atur pencahayaan scene sesuka hati via panel kontrol (Ambient, Directional, Point Light).
- **Model Manipulation**: Puter-puter modelnya (rotasi X, Y, Z) langsung dari UI kalau males nge-drag scene.
- **Texture Support**: Punya file tekstur terpisah? Upload aja gambarnya, nanti otomatis ditempel ke modelnya.
- **Orbit Controls**: Zoom in, zoom out, geser kanan-kiri standar viewer 3D.
- **Responsive**: Tampilan aman dibuka di layar gede maupun kecil (tapi ya enakan di desktop sih buat 3D).

## 🛠️ Cara Jalanin di Lokal

Pastikan udah install Node.js ya.

1.  **Clone repo ini** (atau download zip-nya):
    ```bash
    git clone https://github.com/username/web-3d-viewer.git
    cd web-3d-viewer
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```
    *(Tungguin bentar, tergantung koneksi internet...)*

3.  **Jalanin server dev**:
    ```bash
    npm run dev
    ```

4.  Buka browser, akses `http://localhost:3000`.

## ⚠️ Catatan

- Buat pengguna **Blender**: File `.blend` gak bisa langsung dibaca browser. Export dulu ke format **glTF 2.0 (.glb/.gltf)** atau **Wavefront (.obj)** lewat menu `File > Export` di Blender.
- Tekstur yang di-upload bakal ditempel "rata" ke semua mesh di model. Cocok buat model simpel, tapi mungkin aneh buat model yang UV map-nya kompleks banget.

## 📦 Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (Three.js for React)
- [Drei](https://github.com/pmndrs/drei) (Helpers buat R3F)
- [Tailwind CSS](https://tailwindcss.com/) (Styling sat-set)
- [Lucide React](https://lucide.dev/) (Icon)

___
*Dibuat pas lagi gabut. Enjoy! 🚀*
