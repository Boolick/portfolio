# WebP Asset Conversion & Upload Manifest (MOB-05 / D-11)

This manifest outlines the exact dimensions, target byte budgets, storage locations, and compression parameters for optimizing portfolio visual assets to WebP format.

The frontend runtime uses a dual-source resolution pipeline (`HardwareImage` and `resolveProjectImage`):
- It requests `.webp` files as primary sources.
- If a `.webp` asset is missing or fails to load, it automatically falls back to the existing `.png` asset without throwing errors or breaking layout geometry.

---

## 1. Asset Conversion Matrix

| Original Asset | Target WebP Filename | Dimensions (W x H) | Aspect Ratio | Target Size | Primary Destination | Fallback PNG |
|---|---|---|---|---|---|---|
| `Image_1.png` | `Image_1.webp` | `896 x 1200` | 3:4 (Portrait) | 80–140 KB | `project-images/` (Supabase) or `public/images/` | `public/images/Image_1.png` |
| `Image_2.png` | `Image_2.webp` | `1376 x 768` | 16:9 (Wide) | 110–180 KB | `project-images/` (Supabase) or `public/images/` | `public/images/Image_2.png` |
| `Image_3.png` | `Image_3.webp` | `896 x 1200` | 3:4 (Tall) | 110–180 KB | `project-images/` (Supabase) or `public/images/` | `public/images/Image_3.png` |
| `Image_4.png` | `Image_4.webp` | `1024 x 1024` | 1:1 (Square) | 100–160 KB | `project-images/` (Supabase) or `public/images/` | `public/images/Image_4.png` |
| `Image_5.png` | `Image_5.webp` | `1376 x 768` | 16:9 (Wide) | 110–180 KB | `project-images/` (Supabase) or `public/images/` | `public/images/Image_5.png` |
| `Image_6.png` | `Image_6.webp` | `1024 x 1024` | 1:1 (Square) | 100–160 KB | `project-images/` (Supabase) or `public/images/` | `public/images/Image_6.png` |
| `Image_7.png` | `Image_7.webp` | `1024 x 1024` | 1:1 (Square) | 100–160 KB | `project-images/` (Supabase) or `public/images/` | `public/images/Image_7.png` |
| `dkmline.png` | `dkmline.webp` | `1280 x 800` | 16:10 | 80–150 KB | `public/projects/` or Supabase `project-images/` | `public/projects/dkmline.png` |
| `dexsa.png` | `dexsa.webp` | `1280 x 800` | 16:10 | 80–150 KB | `public/projects/` or Supabase `project-images/` | `public/projects/dexsa.png` |
| `tower-empire.png` | `tower-empire.webp` | `1280 x 800` | 16:10 | 80–150 KB | `public/projects/` or Supabase `project-images/` | `public/projects/tower-empire.png` |
| `portfolio.png` | `portfolio.webp` | `1280 x 800` | 16:10 | 80–150 KB | `public/projects/` or Supabase `project-images/` | `public/projects/portfolio.png` |
| N/A | `tma_preview_640x360.png` | `640 x 360` | 16:9 | < 1 MB | Upload directly to `@BotFather` `/newapp` | N/A |

---

## 2. Conversion Settings (Preserving Crisp Line-Art)

The graphic chronicle features sharp Constructivist ink strokes, monospace typography, and subtle paper grain. Aggressive lossy compression will produce noticeable ringing artifacts around technical diagrams and text bubbles.

### Option A: Google `cwebp` CLI (Recommended)
Install `cwebp` (via `libwebp` or package manager) and run:

```bash
# Convert Hero portrait
cwebp -q 82 -m 6 public/images/Image_1.png -o public/images/Image_1.webp

# Convert Comic chronicle panels (2 through 7)
cwebp -q 82 -m 6 public/images/Image_2.png -o public/images/Image_2.webp
cwebp -q 82 -m 6 public/images/Image_3.png -o public/images/Image_3.webp
cwebp -q 82 -m 6 public/images/Image_4.png -o public/images/Image_4.webp
cwebp -q 82 -m 6 public/images/Image_5.png -o public/images/Image_5.webp
cwebp -q 82 -m 6 public/images/Image_6.png -o public/images/Image_6.webp
cwebp -q 82 -m 6 public/images/Image_7.png -o public/images/Image_7.webp

# Convert Project covers
cwebp -q 82 -m 6 public/projects/dkmline.png -o public/projects/dkmline.webp
cwebp -q 82 -m 6 public/projects/dexsa.png -o public/projects/dexsa.webp
cwebp -q 82 -m 6 public/projects/tower-empire.png -o public/projects/tower-empire.webp
cwebp -q 82 -m 6 public/projects/portfolio.png -o public/projects/portfolio.webp
```

### Option B: Squoosh / Web GUI
1. Open [Squoosh](https://squoosh.app/).
2. Select **WebP** encoder.
3. Set **Quality** to `82` (Effort `6`).
4. Ensure Sharp YUV is enabled if available to preserve clean high-contrast text edges.

---

## 3. Upload & Deployment Steps

1. **Local Repository Fallback:**
   Place the generated `.webp` files alongside their `.png` counterparts in `public/images/` and `public/projects/`.

2. **Supabase Storage Bucket (Optional Production CDN):**
   - Log in to your Supabase project dashboard.
   - Navigate to **Storage** -> `project-images` (public bucket).
   - Upload `Image_1.webp` through `Image_7.webp` directly into the bucket root.

3. **Fallback Guarantee:**
   If any `.webp` is missing from Supabase or `public/`, `HardwareImage` catches the error and silently switches to `.png` without triggering layout shift or UI flickering.
