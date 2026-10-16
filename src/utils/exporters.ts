import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { LODLevel, RoadSignAssembly } from '../types/sign';
import { buildRoadSignAssemblyScene } from './geometryBuilder';
import { renderSignPanelTexture } from './textureRenderer';

export type ExportFormat = 'glb' | 'gltf' | 'obj' | 'stl' | 'png' | 'json';
export type ExportLODTarget = 0 | 1 | 2 | 'all-lods';

function triggerDownloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function buildExportTargetGroup(
  assembly: RoadSignAssembly,
  lodTarget: ExportLODTarget
): THREE.Group {
  if (lodTarget === 'all-lods') {
    const bundleGroup = new THREE.Group();
    bundleGroup.name = `RoadSign_${assembly.seed}_All_LODs`;
    const spacing =
      assembly.structure.structureType === 'truss-gantry' ||
      assembly.structure.structureType === 'portal-gantry' ||
      assembly.structure.structureType === 'cantilever'
        ? assembly.structure.gantrySpan + 4.5
        : 6.5;

    ([0, 1, 2] as LODLevel[]).forEach((lod, idx) => {
      const built = buildRoadSignAssemblyScene(assembly, lod, false, null);
      built.rootGroup.name = `LOD${lod}`;
      built.rootGroup.position.x = (idx - 1) * spacing;
      bundleGroup.add(built.rootGroup);
    });
    bundleGroup.updateMatrixWorld(true);
    return bundleGroup;
  } else {
    const built = buildRoadSignAssemblyScene(assembly, lodTarget, false, null);
    built.rootGroup.updateMatrixWorld(true);
    return built.rootGroup;
  }
}

export async function exportRoadSignModel(
  assembly: RoadSignAssembly,
  format: ExportFormat,
  lodTarget: ExportLODTarget
): Promise<string> {
  const safeSeed = (assembly.seed || 'custom-sign')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .toLowerCase();
  const lodSuffix = lodTarget === 'all-lods' ? 'LOD0-1-2' : `LOD${lodTarget}`;
  const baseFilename = `roadsign-${safeSeed}-${lodSuffix}`;

  if (format === 'json') {
    const payload = JSON.stringify(assembly, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    triggerDownloadBlob(blob, `${baseFilename}.json`);
    return `${baseFilename}.json`;
  }

  if (format === 'png') {
    const lod: LODLevel = lodTarget === 'all-lods' ? 0 : lodTarget;
    // Render a composite high-res texture sheet of all signs in the assembly
    const canvases: HTMLCanvasElement[] = assembly.signs.map((panel) => {
      const tex = renderSignPanelTexture(panel, lod);
      return tex.image as HTMLCanvasElement;
    });
    const maxW = Math.max(...canvases.map((c) => c.width), 512);
    const totalH = canvases.reduce((acc, c) => acc + c.height + 32, 32);

    const sheet = document.createElement('canvas');
    sheet.width = maxW + 64;
    sheet.height = totalH;
    const ctx = sheet.getContext('2d')!;
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, sheet.width, sheet.height);

    let y = 32;
    canvases.forEach((c) => {
      const x = Math.round((sheet.width - c.width) / 2);
      ctx.drawImage(c, x, y);
      y += c.height + 32;
    });

    return new Promise((resolve) => {
      sheet.toBlob((blob) => {
        if (blob) triggerDownloadBlob(blob, `${baseFilename}-textures.png`);
        resolve(`${baseFilename}-textures.png`);
      }, 'image/png');
    });
  }

  const targetGroup = buildExportTargetGroup(assembly, lodTarget);

  if (format === 'glb' || format === 'gltf') {
    const exporter = new GLTFExporter();
    const binary = format === 'glb';
    return new Promise((resolve, reject) => {
      exporter.parse(
        targetGroup,
        (result) => {
          if (result instanceof ArrayBuffer) {
            const blob = new Blob([result], { type: 'model/gltf-binary' });
            triggerDownloadBlob(blob, `${baseFilename}.glb`);
            resolve(`${baseFilename}.glb`);
          } else {
            const jsonText = JSON.stringify(result, null, 2);
            const blob = new Blob([jsonText], { type: 'model/gltf+json' });
            triggerDownloadBlob(blob, `${baseFilename}.gltf`);
            resolve(`${baseFilename}.gltf`);
          }
        },
        (err) => reject(err),
        { binary }
      );
    });
  }

  if (format === 'obj') {
    const exporter = new OBJExporter();
    const objString = exporter.parse(targetGroup);
    const blob = new Blob([objString], { type: 'text/plain' });
    triggerDownloadBlob(blob, `${baseFilename}.obj`);
    return `${baseFilename}.obj`;
  }

  if (format === 'stl') {
    const exporter = new STLExporter();
    const stlBuffer = exporter.parse(targetGroup, { binary: true });
    const blob = new Blob([stlBuffer], { type: 'application/sla' });
    triggerDownloadBlob(blob, `${baseFilename}.stl`);
    return `${baseFilename}.stl`;
  }

  return baseFilename;
}
