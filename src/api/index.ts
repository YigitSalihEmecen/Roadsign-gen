import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import {
  LODLevel,
  RoadSignAssembly,
  SignPanelConfig,
  StructureConfig,
} from '../types/sign';
import {
  createDefaultSignPanel,
  STARTER_TEMPLATES,
  StarterTemplateItem,
} from '../data/presets';
import { generateSignAssemblyFromSeed, createRandomSeedCode } from '../utils/prng';
import { normalizeSignConfig, loadSignFonts } from './core';
import { buildRoadSignAssemblyScene } from '../utils/geometryBuilder';
import { renderSignPanelTexture } from '../utils/textureRenderer';
import { ExportFormat, ExportLODTarget, exportRoadSignModel } from '../utils/exporters';

export const generateRandomSeedString = createRandomSeedCode;

export interface RoadSignBuildOptions {
  /** Level of Detail: 0 (Hero ~20k tris), 1 (Mid ~4k tris), 2 (Far ~400 tris). Default: 0 */
  lod?: LODLevel;
  /** Distances [lod0, lod1, lod2] in meters when creating a THREE.LOD group. Default: [0, 25, 65] */
  lodDistances?: [number, number, number];
}

export interface GeneratedRoadSign {
  /** Complete serializable road sign assembly configuration */
  config: RoadSignAssembly;
  /** Ready-to-mount Three.js Group containing poles, hardware, and sign panels */
  model: THREE.Group;
  /** Triangle count for the generated LOD */
  triangles: number;
  /** Vertex count for the generated LOD */
  vertices: number;
  /** Build a Three.js THREE.LOD object with LOD0, LOD1, and LOD2 automatically registered */
  toThreeLOD: (distances?: [number, number, number]) => THREE.LOD;
  /** Export the sign to a binary GLB ArrayBuffer for game engines (Unity, Unreal, Godot, Three.js) */
  toGLB: (lod?: ExportLODTarget) => Promise<ArrayBuffer>;
  /** Export the sign to Wavefront OBJ text */
  toOBJ: (lod?: LODLevel) => string;
  /** Export the sign to binary STL ArrayBuffer */
  toSTL: (lod?: LODLevel) => ArrayBuffer;
  /** Render individual sign panel textures as HTMLCanvasElement[] */
  getPanelCanvases: (lod?: LODLevel) => HTMLCanvasElement[];
}

/**
 * Create a Three.js THREE.LOD node with all 3 LOD levels (LOD0, LOD1, LOD2) pre-built
 * and registered at distance thresholds (default: [0, 25, 65] meters).
 */
export function createThreeLOD(
  configInput: RoadSignAssembly | Partial<RoadSignAssembly>,
  distances: [number, number, number] = [0, 25, 65]
): THREE.LOD {
  const config = normalizeSignConfig(configInput);
  const lodGroup = new THREE.LOD();
  lodGroup.name = `RoadSign_LOD_${config.seed}`;

  ([0, 1, 2] as LODLevel[]).forEach((lodLevel, idx) => {
    const built = buildRoadSignAssemblyScene(config, lodLevel, false, null);
    built.rootGroup.name = `LOD${lodLevel}`;
    lodGroup.addLevel(built.rootGroup, distances[idx] ?? idx * 30);
  });

  lodGroup.userData = { roadSignConfig: config };
  return lodGroup;
}

/**
 * Export a RoadSignAssembly directly to a binary GLB ArrayBuffer (no DOM download triggered).
 */
export function exportSignToGLB(
  configInput: RoadSignAssembly | Partial<RoadSignAssembly>,
  lodTarget: ExportLODTarget = 0
): Promise<ArrayBuffer> {
  const config = normalizeSignConfig(configInput);
  const group =
    lodTarget === 'all-lods'
      ? (() => {
          const g = new THREE.Group();
          ([0, 1, 2] as LODLevel[]).forEach((l, i) => {
            const sub = buildRoadSignAssemblyScene(config, l, false, null).rootGroup;
            sub.name = `LOD${l}`;
            sub.position.x = (i - 1) * 6.5;
            g.add(sub);
          });
          g.updateMatrixWorld(true);
          return g;
        })()
      : buildRoadSignAssemblyScene(config, lodTarget, false, null).rootGroup;

  group.updateMatrixWorld(true);
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      group,
      (res) => {
        if (res instanceof ArrayBuffer) {
          resolve(res);
        } else {
          reject(new Error('Expected binary GLB ArrayBuffer output'));
        }
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

/**
 * Export a RoadSignAssembly to a Wavefront OBJ string.
 */
export function exportSignToOBJ(
  configInput: RoadSignAssembly | Partial<RoadSignAssembly>,
  lod: LODLevel = 0
): string {
  const config = normalizeSignConfig(configInput);
  const group = buildRoadSignAssemblyScene(config, lod, false, null).rootGroup;
  group.updateMatrixWorld(true);
  const exporter = new OBJExporter();
  return exporter.parse(group);
}

/**
 * Export a RoadSignAssembly to a binary STL ArrayBuffer.
 */
export function exportSignToSTL(
  configInput: RoadSignAssembly | Partial<RoadSignAssembly>,
  lod: LODLevel = 0
): ArrayBuffer {
  const config = normalizeSignConfig(configInput);
  const group = buildRoadSignAssemblyScene(config, lod, false, null).rootGroup;
  group.updateMatrixWorld(true);
  const exporter = new STLExporter();
  const view = exporter.parse(group, { binary: true }) as DataView;
  return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength) as ArrayBuffer;
}

/**
 * Build a GeneratedRoadSign instance from a complete or partial RoadSignAssembly configuration.
 */
export function createSign(
  configInput: Partial<RoadSignAssembly> & {
    structure?: Partial<StructureConfig>;
    signs?: Partial<SignPanelConfig>[];
  } = {},
  options: RoadSignBuildOptions = {}
): GeneratedRoadSign {
  const lod: LODLevel = options.lod ?? 0;
  const config = normalizeSignConfig(configInput);
  const built = buildRoadSignAssemblyScene(config, lod, false, null);
  built.rootGroup.name = `RoadSign_${config.seed}_LOD${lod}`;
  built.rootGroup.userData = {
    roadSignConfig: config,
    lod,
    triangles: built.triangles,
    vertices: built.vertices,
  };

  return {
    config,
    model: built.rootGroup,
    triangles: built.triangles,
    vertices: built.vertices,
    toThreeLOD: (distances = options.lodDistances || [0, 25, 65]) =>
      createThreeLOD(config, distances),
    toGLB: (targetLod: ExportLODTarget = lod) => exportSignToGLB(config, targetLod),
    toOBJ: (targetLod: LODLevel = lod) => exportSignToOBJ(config, targetLod),
    toSTL: (targetLod: LODLevel = lod) => exportSignToSTL(config, targetLod),
    getPanelCanvases: (targetLod: LODLevel = lod) =>
      config.signs.map((panel) => renderSignPanelTexture(panel, targetLod).image as HTMLCanvasElement),
  };
}

/**
 * Deterministically generate a road sign assembly and 3D model from any seed string.
 * Omit `seed` to generate a fresh random seed automatically.
 */
export function createSignFromSeed(
  seed: string = generateRandomSeedString(),
  options: RoadSignBuildOptions = {}
): GeneratedRoadSign {
  const config = generateSignAssemblyFromSeed(seed);
  if (options.lod !== undefined) {
    config.structure.showRoadBase = false;
  }
  return createSign(config, options);
}

/**
 * Build a road sign assembly and 3D model from one of the built-in regional starter templates.
 */
export function createSignFromTemplate(
  templateId: string,
  options: RoadSignBuildOptions = {}
): GeneratedRoadSign {
  const found =
    STARTER_TEMPLATES.find((t) => t.id === templateId) || STARTER_TEMPLATES[0];
  const cloned: RoadSignAssembly = JSON.parse(JSON.stringify(found.assembly));
  return createSign(cloned, options);
}

/**
 * List all available regional starter templates.
 */
export function getTemplates(): StarterTemplateItem[] {
  return STARTER_TEMPLATES;
}

export { normalizeSignConfig, loadSignFonts };

export const RoadSignAPI = {
  normalizeSignConfig,
  loadSignFonts,
  createSign,
  createSignFromSeed,
  createSignFromTemplate,
  createThreeLOD,
  exportSignToGLB,
  exportSignToOBJ,
  exportSignToSTL,
  downloadSignModel: exportRoadSignModel,
  generateSignAssemblyFromSeed,
  generateRandomSeedString,
  createDefaultSignPanel,
  getTemplates,
};

export type {
  RoadSignAssembly,
  SignPanelConfig,
  StructureConfig,
  LODLevel,
  ExportFormat,
  ExportLODTarget,
};
