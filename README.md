# SignCraft 3D — Procedural Road Sign & Gantry Studio

A real-time 3D procedural road sign and highway gantry studio built with Three.js, React, and TypeScript. Create custom single-post, dual-post, route-tree, cantilever, and overhead gantry assemblies with authentic highway typography, seed-driven random generation, 3 real-time LOD levels, and a standardized Game/Module API.

[![Try it in your browser](https://img.shields.io/badge/Try%20it%20in%20your%20browser-Launch%20SignCraft%203D-7C83FD?style=for-the-badge&logo=webgl&logoColor=white)](https://yigitsalihemecen.github.io/Roadsign-gen/)

👉 **[Try it in your browser: https://yigitsalihemecen.github.io/Roadsign-gen/](https://yigitsalihemecen.github.io/Roadsign-gen/)**

---

## Features

- **Full Structural Customization**: Single posts, dual breakaway posts, multi-shield route trees, overhead cantilevers, portal gantries, and 4-chord box-truss bridges (`round-steel`, `square-perforated`, `i-beam`, `u-channel`, `wood-post`, `octagonal-mast`).
- **Multi-Sign Stacking & Gantry Mounting**: Mount and position multiple signs, auxiliary plaques, directional arrows, and top exit tabs on a single structure.
- **Authentic Highway Typography & Graphics**: Includes **FHWA Series E/D/F (Highway Gothic)**, **DIN 1451 Mittelschrift & Engschrift** (German Autobahn), **Overpass / Clearview**, and **NEXCO Kaku Gothic** (Japanese Expressway), plus procedural retroreflective sheeting (`diamond-cubed`, `high-intensity`, `engineer-grade`) and weathering.
- **Deterministic Seeded Generator**: Generate complete regional sign assemblies from any seed string with reproducible parameters.
- **3 Real-Time LOD Levels & Multi-Format Export**: Switch live between **LOD 0** (Hero), **LOD 1** (Mid-range), and **LOD 2** (Low-poly game prop), and export to `.glb`, `.gltf`, `.obj`, `.stl`, `.png`, or `.json`.

---

## Game & Module API (`RoadSignAPI`)

SignCraft 3D includes a standalone programmatic API (`src/api`) so you can generate 3D road signs and `THREE.LOD` hierarchies directly inside a Three.js game, simulator, or asset pipeline.

### 1. ES Module Usage

```ts
import {
  createSignFromSeed,
  createSign,
  createSignFromTemplate,
  createThreeLOD,
} from './src/api';

// 1. Deterministically generate a sign from a seed
const sign = createSignFromSeed('AUTOBAHN-A4-7721', { lod: 0 });
scene.add(sign.model); // THREE.Group ready to mount in your scene

// 2. Create a Three.js THREE.LOD with LOD0 (0m), LOD1 (25m), and LOD2 (65m)
const lodObject = sign.toThreeLOD([0, 25, 65]);
scene.add(lodObject);

// 3. Build a custom sign assembly with custom parameters
const customSign = createSign(
  {
    structure: {
      structureType: 'cantilever',
      poleProfile: 'round-steel',
      poleMaterial: 'galvanized',
      poleHeight: 5.8,
      gantrySpan: 8.5,
    },
    signs: [
      {
        shape: 'rounded-rect',
        width: 3.4,
        height: 1.6,
        colorPreset: 'freeway-green',
        fontFamily: 'HighwayGothicExp',
        badges: [{ id: 'b1', type: 'interstate', number: '95', direction: 'NORTH' }],
        lines: [
          { id: '1', text: 'DOWNTOWN', fontSize: 68, letterSpacing: 3, align: 'center' },
          { id: '2', text: 'HARBOR TUNNEL', fontSize: 58, letterSpacing: 2, align: 'center' },
        ],
        arrowType: 'up-right',
        arrowPosition: 'right',
        exitTab: { enabled: true, text: 'EXIT 14B', align: 'right', widthRatio: 0.44 },
      },
    ],
  },
  { lod: 1 }
);
scene.add(customSign.model);

// 4. Export directly in memory (ArrayBuffer / string) for game pipelines
const glbBuffer: ArrayBuffer = await customSign.toGLB(0);
const objText: string = customSign.toOBJ(1);
const stlBuffer: ArrayBuffer = customSign.toSTL(2);
```

### 2. Browser Global Usage (`window.RoadSignAPI`)

When running in the browser or embedded in a WebView, the API is also exposed globally on `window.RoadSignAPI`:

```js
const { model, config, triangles } = window.RoadSignAPI.createSignFromSeed('HWY-4092-XVA', { lod: 1 });
console.log('Generated sign with', triangles, 'triangles', config);
```

---

## Local Development

```bash
npm install
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Type-check & build production bundle to ./dist
```
