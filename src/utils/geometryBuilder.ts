import * as THREE from 'three';
import {
  LODLevel,
  PoleMaterialType,
  PoleProfile,
  RoadSignAssembly,
  SignPanelConfig,
  StructureConfig,
} from '../types/sign';
import { renderExitTabTexture, renderSignPanelTexture } from './textureRenderer';

export interface BuiltSignScene {
  rootGroup: THREE.Group;
  signSelectableMap: Map<THREE.Object3D, string>;
  triangles: number;
  vertices: number;
}

function createShape2D(panel: SignPanelConfig, lod: LODLevel): THREE.Shape {
  const w = panel.width;
  const h = panel.height;
  const hw = w / 2;
  const hh = h / 2;
  const shape = new THREE.Shape();
  const r = Math.min(panel.cornerRadius, hw * 0.45, hh * 0.45);

  if (
    panel.shape === 'rounded-rect' ||
    panel.shape === 'chevron-rect' ||
    panel.shape === 'us-route-shield'
  ) {
    shape.moveTo(-hw + r, -hh);
    shape.lineTo(hw - r, -hh);
    shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
    shape.lineTo(hw, hh - r);
    shape.quadraticCurveTo(hw, hh, hw - r, hh);
    shape.lineTo(-hw + r, hh);
    shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
    shape.lineTo(-hw, -hh + r);
    shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
    shape.closePath();
    return shape;
  }

  if (panel.shape === 'diamond') {
    const pts: [number, number][] = [
      [0, hh],
      [hw, 0],
      [0, -hh],
      [-hw, 0],
    ];
    return createRoundedPolygonShape(pts, r);
  }

  if (panel.shape === 'circle') {
    const segs = lod === 0 ? 48 : lod === 1 ? 24 : 12;
    shape.absellipse(0, 0, hw, hh, 0, Math.PI * 2, false, 0);
    const pts = shape.getPoints(segs);
    return new THREE.Shape(pts);
  }

  if (panel.shape === 'octagon') {
    const k = 0.29289;
    const pts: [number, number][] = [
      [-hw + w * k, hh],
      [hw - w * k, hh],
      [hw, hh - h * k],
      [hw, -hh + h * k],
      [hw - w * k, -hh],
      [-hw + w * k, -hh],
      [-hw, -hh + h * k],
      [-hw, hh - h * k],
    ];
    return createRoundedPolygonShape(pts, r * 0.35);
  }

  if (panel.shape === 'triangle-up') {
    const pts: [number, number][] = [
      [0, hh * 0.94],
      [hw * 0.94, -hh * 0.9],
      [-hw * 0.94, -hh * 0.9],
    ];
    return createRoundedPolygonShape(pts, r * 1.05);
  }

  if (panel.shape === 'triangle-down') {
    const pts: [number, number][] = [
      [-hw * 0.94, hh * 0.9],
      [hw * 0.94, hh * 0.9],
      [0, -hh * 0.94],
    ];
    return createRoundedPolygonShape(pts, r * 1.05);
  }

  if (panel.shape === 'pentagon') {
    const pts: [number, number][] = [
      [0, hh * 0.94],
      [hw * 0.94, hh * 0.16],
      [hw * 0.64, -hh * 0.92],
      [-hw * 0.64, -hh * 0.92],
      [-hw * 0.94, hh * 0.16],
    ];
    return createRoundedPolygonShape(pts, r * 0.6);
  }

  if (panel.shape === 'pennant') {
    const pts: [number, number][] = [
      [-hw * 0.92, hh * 0.88],
      [hw * 0.92, 0],
      [-hw * 0.92, -hh * 0.88],
    ];
    return createRoundedPolygonShape(pts, r * 0.7);
  }

  if (panel.shape === 'interstate-shield') {
    shape.moveTo(-hw + w * 0.1, hh - h * 0.04);
    shape.quadraticCurveTo(-w * 0.2, hh - h * 0.11, 0, hh - h * 0.04);
    shape.quadraticCurveTo(w * 0.2, hh - h * 0.11, hw - w * 0.1, hh - h * 0.04);
    shape.bezierCurveTo(
      hw + w * 0.04,
      hh - h * 0.35,
      hw - w * 0.02,
      hh - h * 0.78,
      0,
      -hh + h * 0.02
    );
    shape.bezierCurveTo(
      -hw + w * 0.02,
      hh - h * 0.78,
      -hw - w * 0.04,
      hh - h * 0.35,
      -hw + w * 0.1,
      hh - h * 0.04
    );
    shape.closePath();
    return shape;
  }

  return shape;
}

function createRoundedPolygonShape(pts: [number, number][], cornerRadius: number): THREE.Shape {
  const shape = new THREE.Shape();
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[(i - 1 + pts.length) % pts.length];
    const curr = pts[i];
    const next = pts[(i + 1) % pts.length];

    const v1x = prev[0] - curr[0];
    const v1y = prev[1] - curr[1];
    const l1 = Math.hypot(v1x, v1y) || 1;
    const v2x = next[0] - curr[0];
    const v2y = next[1] - curr[1];
    const l2 = Math.hypot(v2x, v2y) || 1;

    const r = Math.min(cornerRadius, l1 * 0.32, l2 * 0.32);
    const p1x = curr[0] + (v1x / l1) * r;
    const p1y = curr[1] + (v1y / l1) * r;
    const p2x = curr[0] + (v2x / l2) * r;
    const p2y = curr[1] + (v2y / l2) * r;

    if (i === 0) shape.moveTo(p1x, p1y);
    else shape.lineTo(p1x, p1y);
    shape.quadraticCurveTo(curr[0], curr[1], p2x, p2y);
  }
  shape.closePath();
  return shape;
}

function normalizeExtrudeUVs(geo: THREE.ExtrudeGeometry, width: number, height: number) {
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const u = (x + width / 2) / width;
    const v = (y + height / 2) / height;
    uv.setXY(i, Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v)));
  }
  uv.needsUpdate = true;
}

function createPerforatedPostTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#B8C0C8';
  ctx.fillRect(0, 0, 128, 512);

  for (let y = 24; y < 512; y += 36) {
    ctx.beginPath();
    ctx.arc(64, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#222831';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#8C96A2';
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 5);
  return tex;
}

function getPolePBRMaterial(
  matType: PoleMaterialType,
  profile: PoleProfile,
  weathering: number,
  wireframe: boolean
): THREE.MeshStandardMaterial {
  const baseMap: Record<PoleMaterialType, { color: string; metalness: number; roughness: number }> = {
    galvanized: { color: '#B4BCC4', metalness: 0.78, roughness: 0.34 },
    aluminum: { color: '#D4DBE2', metalness: 0.85, roughness: 0.24 },
    'weathered-steel': { color: '#6E7680', metalness: 0.65, roughness: 0.55 },
    'charcoal-coat': { color: '#2E343B', metalness: 0.45, roughness: 0.48 },
    'dot-green': { color: '#1F4E3B', metalness: 0.35, roughness: 0.5 },
    'wood-cedar': { color: '#8A5A3B', metalness: 0.05, roughness: 0.85 },
    'concrete-grey': { color: '#9CA3AF', metalness: 0.18, roughness: 0.72 },
    'corten-rust': { color: '#7C3F23', metalness: 0.4, roughness: 0.78 },
  };
  const cfg = baseMap[matType] || baseMap.galvanized;
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cfg.color),
    metalness: Math.max(0.05, cfg.metalness - weathering * 0.25),
    roughness: Math.min(0.95, cfg.roughness + weathering * 0.3),
    wireframe,
  });

  if (profile === 'square-perforated' && matType !== 'wood-cedar') {
    mat.map = createPerforatedPostTexture();
  }
  return mat;
}

function createPoleColumnMesh(
  profile: PoleProfile,
  height: number,
  radius: number,
  lod: LODLevel,
  material: THREE.Material
): THREE.Object3D {
  const group = new THREE.Group();
  const radialSegs = lod === 0 ? 28 : lod === 1 ? 12 : 6;

  if (profile === 'round-steel') {
    const geo = new THREE.CylinderGeometry(radius, radius, height, radialSegs);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = height / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  } else if (profile === 'octagonal-mast') {
    const geo = new THREE.CylinderGeometry(radius * 0.82, radius * 1.12, height, 8);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = height / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  } else if (profile === 'square-perforated' || profile === 'wood-post') {
    const w = radius * 1.85;
    const geo = new THREE.BoxGeometry(w, height, w, 1, lod === 0 ? 4 : 1, 1);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = height / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  } else if (profile === 'i-beam') {
    const w = radius * 2.1;
    const d = radius * 2.2;
    const flangeT = Math.max(0.012, radius * 0.28);
    const webT = Math.max(0.01, radius * 0.22);

    if (lod === 2) {
      const geo = new THREE.BoxGeometry(w, height, d);
      const m = new THREE.Mesh(geo, material);
      m.position.y = height / 2;
      group.add(m);
    } else {
      const fGeo = new THREE.BoxGeometry(w, height, flangeT);
      const frontFlange = new THREE.Mesh(fGeo, material);
      frontFlange.position.set(0, height / 2, d / 2 - flangeT / 2);
      const backFlange = new THREE.Mesh(fGeo, material);
      backFlange.position.set(0, height / 2, -d / 2 + flangeT / 2);
      const webGeo = new THREE.BoxGeometry(webT, height, d - flangeT * 2);
      const web = new THREE.Mesh(webGeo, material);
      web.position.set(0, height / 2, 0);
      frontFlange.castShadow = backFlange.castShadow = web.castShadow = true;
      group.add(frontFlange, backFlange, web);
    }
  } else if (profile === 'u-channel') {
    const w = radius * 1.8;
    const d = radius * 1.2;
    const t = Math.max(0.01, radius * 0.24);
    if (lod === 2) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, height, d), material);
      m.position.y = height / 2;
      group.add(m);
    } else {
      const back = new THREE.Mesh(new THREE.BoxGeometry(w, height, t), material);
      back.position.set(0, height / 2, 0);
      const left = new THREE.Mesh(new THREE.BoxGeometry(t, height, d), material);
      left.position.set(-w / 2 + t / 2, height / 2, -d / 2);
      const right = new THREE.Mesh(new THREE.BoxGeometry(t, height, d), material);
      right.position.set(w / 2 - t / 2, height / 2, -d / 2);
      back.castShadow = left.castShadow = right.castShadow = true;
      group.add(back, left, right);
    }
  }

  return group;
}

function createBaseHardware(
  x: number,
  z: number,
  structure: StructureConfig,
  lod: LODLevel,
  poleMat: THREE.Material,
  wireframe: boolean
): THREE.Group {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const r = structure.poleRadius;

  const concreteMat = new THREE.MeshStandardMaterial({
    color: '#9BA1A8',
    roughness: 0.9,
    metalness: 0.05,
    wireframe,
  });

  if (structure.baseType === 'bolted-flange' || structure.baseType === 'breakaway-slip') {
    const pierSegs = lod === 0 ? 24 : lod === 1 ? 12 : 6;
    const pier = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 2.4, r * 2.7, 0.22, pierSegs),
      concreteMat
    );
    pier.position.y = 0.08;
    pier.receiveShadow = true;
    group.add(pier);

    const plateSize = r * 3.6;
    const plate = new THREE.Mesh(new THREE.BoxGeometry(plateSize, 0.035, plateSize), poleMat);
    plate.position.y = 0.2;
    plate.castShadow = true;
    group.add(plate);

    if (lod === 0) {
      const boltOff = plateSize * 0.36;
      const boltGeo = new THREE.CylinderGeometry(r * 0.22, r * 0.22, 0.08, 6);
      for (const bx of [-boltOff, boltOff]) {
        for (const bz of [-boltOff, boltOff]) {
          const bolt = new THREE.Mesh(boltGeo, poleMat);
          bolt.position.set(bx, 0.24, bz);
          group.add(bolt);
        }
      }
    }

    if (structure.baseType === 'breakaway-slip' && lod < 2) {
      const splice = new THREE.Mesh(
        new THREE.BoxGeometry(plateSize * 0.95, 0.06, plateSize * 0.95),
        poleMat
      );
      splice.position.y = 0.85;
      group.add(splice);
    }
  } else if (structure.baseType === 'crash-barrels') {
    const barrelMat = new THREE.MeshStandardMaterial({
      color: '#EAB308',
      roughness: 0.45,
      metalness: 0.1,
      wireframe,
    });
    const lidMat = new THREE.MeshStandardMaterial({
      color: '#1E232A',
      roughness: 0.6,
      metalness: 0.2,
      wireframe,
    });
    const barrelSegs = lod === 0 ? 20 : lod === 1 ? 10 : 6;
    const positions: [number, number][] =
      lod === 2
        ? [[0, 0.55]]
        : [
            [-0.28, 0.48],
            [0.28, 0.48],
            [0, 0.95],
          ];
    for (const [bx, bz] of positions) {
      const bGroup = new THREE.Group();
      bGroup.position.set(bx, 0, bz);
      const drum = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.26, 0.78, barrelSegs),
        barrelMat
      );
      drum.position.y = 0.39;
      drum.castShadow = true;
      bGroup.add(drum);
      if (lod < 2) {
        const lid = new THREE.Mesh(
          new THREE.CylinderGeometry(0.29, 0.29, 0.06, barrelSegs),
          lidMat
        );
        lid.position.y = 0.79;
        bGroup.add(lid);
      }
      group.add(bGroup);
    }
  } else if (structure.baseType === 'guardrail') {
    const railLen = 2.8;
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, railLen), poleMat);
    rail.position.set(x >= 0 ? -0.42 : 0.42, 0.58, 0);
    rail.castShadow = true;
    group.add(rail);

    if (lod < 2) {
      for (const rz of [-0.95, 0, 0.95]) {
        const gPost = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.75, 0.1), poleMat);
        gPost.position.set(x >= 0 ? -0.48 : 0.48, 0.375, rz);
        group.add(gPost);
      }
    }
  }

  return group;
}

function buildSignPanelMesh(
  panel: SignPanelConfig,
  lod: LODLevel,
  poleMat: THREE.Material,
  wireframe: boolean,
  isSelected: boolean
): THREE.Group {
  const group = new THREE.Group();
  group.name = `SignPanel_${panel.id}`;

  const curveSegs = lod === 0 ? 16 : lod === 1 ? 6 : 2;
  const shape2D = createShape2D(panel, lod);
  const depth = panel.thickness;
  const bevelThick = lod === 0 ? 0.004 : 0;
  const totalHalfDepth = depth / 2 + bevelThick;

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth,
    bevelEnabled: lod === 0,
    bevelSegments: lod === 0 ? 3 : 1,
    steps: 1,
    bevelSize: bevelThick,
    bevelThickness: bevelThick,
    curveSegments: curveSegs,
  };

  const geo = new THREE.ExtrudeGeometry(shape2D, extrudeSettings);
  normalizeExtrudeUVs(geo, panel.width, panel.height);
  geo.center();

  const frontTex = renderSignPanelTexture(panel, lod);
  const isRetro = panel.sheetingType !== 'matte-enamel';

  const frontMat = new THREE.MeshStandardMaterial({
    map: frontTex,
    roughness: isRetro ? 0.26 : 0.65,
    metalness: isRetro ? 0.18 : 0.05,
    emissive: isSelected ? new THREE.Color('#7C83FD') : new THREE.Color('#000000'),
    emissiveIntensity: isSelected ? 0.08 : 0,
    wireframe,
  });

  const backAluminumMat = new THREE.MeshStandardMaterial({
    color: '#B8C1CC',
    metalness: 0.78,
    roughness: 0.34,
    wireframe,
  });

  const plateMesh = new THREE.Mesh(geo, [frontMat, backAluminumMat]);
  plateMesh.castShadow = true;
  plateMesh.receiveShadow = true;
  group.add(plateMesh);

  // Dedicated brushed aluminum back skin at -totalHalfDepth - 0.002 on all LODs so front texture never bleeds onto the back
  const backGeo = new THREE.ShapeGeometry(shape2D, curveSegs);
  const backSkin = new THREE.Mesh(backGeo, backAluminumMat);
  backSkin.rotation.y = Math.PI;
  backSkin.position.z = -totalHalfDepth - 0.002;
  group.add(backSkin);

  // Physical 3D Face Mounting Hex Bolts (LOD 0 only; LOD 1/2 bake them into texture)
  if (panel.showFaceBolts && lod === 0) {
    const boltMat = new THREE.MeshStandardMaterial({
      color: '#D8DEE6',
      metalness: 0.88,
      roughness: 0.22,
      wireframe,
    });
    const boltPositions: [number, number][] =
      panel.shape === 'rounded-rect' && panel.width > 1.3
        ? [
            [-panel.width * 0.38, panel.height * 0.38],
            [0, panel.height * 0.38],
            [panel.width * 0.38, panel.height * 0.38],
            [-panel.width * 0.38, -panel.height * 0.38],
            [0, -panel.height * 0.38],
            [panel.width * 0.38, -panel.height * 0.38],
          ]
        : [
            [0, panel.height * 0.38],
            [0, -panel.height * 0.38],
          ];

    const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.014, 6);
    boltGeo.rotateX(Math.PI / 2);
    const washerGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.004, 12);
    washerGeo.rotateX(Math.PI / 2);

    for (const [bx, by] of boltPositions) {
      const bolt = new THREE.Mesh(boltGeo, boltMat);
      bolt.position.set(bx, by, totalHalfDepth + 0.006);
      const washer = new THREE.Mesh(washerGeo, boltMat);
      washer.position.set(bx, by, totalHalfDepth + 0.002);
      group.add(bolt, washer);
    }
  }

  // Rear Mounting Z-Extrusion Channels & Clamps
  if (lod === 0) {
    const barCount = panel.height > 1.1 ? 2 : 1;
    const barYs = barCount === 2 ? [panel.height * 0.26, -panel.height * 0.26] : [0];
    for (const by of barYs) {
      const zBar = new THREE.Mesh(
        new THREE.BoxGeometry(panel.width * 0.86, 0.045, 0.035),
        poleMat
      );
      zBar.position.set(0, by, -totalHalfDepth - 0.02);
      zBar.castShadow = true;
      group.add(zBar);

      const clamp = new THREE.Mesh(
        new THREE.TorusGeometry(0.055, 0.009, 8, 16, Math.PI),
        poleMat
      );
      clamp.rotation.x = Math.PI / 2;
      clamp.position.set(0, by, -totalHalfDepth - 0.035);
      group.add(clamp);
    }
  } else if (lod === 1) {
    const simpleBar = new THREE.Mesh(
      new THREE.BoxGeometry(panel.width * 0.78, 0.05, 0.03),
      poleMat
    );
    simpleBar.position.set(0, 0, -totalHalfDepth - 0.018);
    group.add(simpleBar);
  }

  // Top Attached Exit Tab Plaque with proportional 1:1 aspect ratio
  if (panel.exitTab && panel.exitTab.enabled) {
    const clampedRatio = Math.max(0.32, Math.min(0.65, panel.exitTab.widthRatio || 0.45));
    const tabW = Math.max(0.75, panel.width * clampedRatio);
    const tabH = Math.max(0.34, Math.min(0.48, panel.height * 0.25));
    const tabShape = new THREE.Shape();
    const tr = 0.05;
    const thw = tabW / 2;
    const thh = tabH / 2;
    tabShape.moveTo(-thw + tr, -thh);
    tabShape.lineTo(thw - tr, -thh);
    tabShape.quadraticCurveTo(thw, -thh, thw, -thh + tr);
    tabShape.lineTo(thw, thh - tr);
    tabShape.quadraticCurveTo(thw, thh, thw - tr, thh);
    tabShape.lineTo(-thw + tr, thh);
    tabShape.quadraticCurveTo(-thw, thh, -thw, thh - tr);
    tabShape.lineTo(-thw, -thh + tr);
    tabShape.quadraticCurveTo(-thw, -thh, -thw + tr, -thh);
    tabShape.closePath();

    const tabDepth = depth * 0.9;
    const tabGeo = new THREE.ExtrudeGeometry(tabShape, {
      depth: tabDepth,
      bevelEnabled: false,
      curveSegments: curveSegs,
    });
    normalizeExtrudeUVs(tabGeo, tabW, tabH);
    tabGeo.center();

    const tabTex = renderExitTabTexture(panel.exitTab, panel, lod, tabW, tabH);
    const tabFrontMat = new THREE.MeshStandardMaterial({
      map: tabTex,
      roughness: 0.28,
      metalness: 0.16,
      wireframe,
    });

    const tabMesh = new THREE.Mesh(tabGeo, [tabFrontMat, backAluminumMat]);
    let tabX = 0;
    if (panel.exitTab.align === 'left') tabX = -panel.width / 2 + tabW / 2 + 0.04;
    else if (panel.exitTab.align === 'right') tabX = panel.width / 2 - tabW / 2 - 0.04;
    const tabY = panel.height / 2 + tabH / 2 + 0.02;

    tabMesh.position.set(tabX, tabY, 0);
    tabMesh.castShadow = true;
    group.add(tabMesh);

    const tabBackSkin = new THREE.Mesh(
      new THREE.ShapeGeometry(tabShape, curveSegs),
      backAluminumMat
    );
    tabBackSkin.rotation.y = Math.PI;
    tabBackSkin.position.set(tabX, tabY, -tabDepth / 2 - 0.002);
    group.add(tabBackSkin);

    // Rear vertical aluminum splice straps connecting exit tab to main sign panel
    if (lod < 2) {
      for (const sx of [tabX - tabW * 0.28, tabX + tabW * 0.28]) {
        const strap = new THREE.Mesh(
          new THREE.BoxGeometry(0.045, tabH * 0.65 + 0.16, 0.022),
          poleMat
        );
        strap.position.set(sx, panel.height / 2 + 0.04, -totalHalfDepth - 0.014);
        group.add(strap);
      }
    }
  }

  return group;
}

function buildBoxTrussBridge(
  span: number,
  trussHeight: number,
  trussDepth: number,
  yCenter: number,
  lod: LODLevel,
  material: THREE.Material
): THREE.Group {
  const group = new THREE.Group();
  group.position.y = yCenter;

  if (lod === 2) {
    const beamMat = material;
    const topFront = new THREE.Mesh(new THREE.BoxGeometry(span, 0.08, 0.08), beamMat);
    topFront.position.set(0, trussHeight / 2, trussDepth / 2);
    const botFront = new THREE.Mesh(new THREE.BoxGeometry(span, 0.08, 0.08), beamMat);
    botFront.position.set(0, -trussHeight / 2, trussDepth / 2);
    const topBack = new THREE.Mesh(new THREE.BoxGeometry(span, 0.08, 0.08), beamMat);
    topBack.position.set(0, trussHeight / 2, -trussDepth / 2);
    const botBack = new THREE.Mesh(new THREE.BoxGeometry(span, 0.08, 0.08), beamMat);
    botBack.position.set(0, -trussHeight / 2, -trussDepth / 2);
    group.add(topFront, botFront, topBack, botBack);
    return group;
  }

  const chordR = 0.042;
  const strutR = 0.024;
  const segs = lod === 0 ? 12 : 6;
  const chordGeo = new THREE.CylinderGeometry(chordR, chordR, span, segs);
  chordGeo.rotateZ(Math.PI / 2);

  const offsets: [number, number][] = [
    [trussHeight / 2, trussDepth / 2],
    [-trussHeight / 2, trussDepth / 2],
    [trussHeight / 2, -trussDepth / 2],
    [-trussHeight / 2, -trussDepth / 2],
  ];
  for (const [cy, cz] of offsets) {
    const chord = new THREE.Mesh(chordGeo, material);
    chord.position.set(0, cy, cz);
    chord.castShadow = true;
    group.add(chord);
  }

  const bayCount =
    lod === 0 ? Math.max(8, Math.round(span * 1.2)) : Math.max(5, Math.round(span * 0.7));
  const bayWidth = span / bayCount;
  const vGeo = new THREE.CylinderGeometry(strutR, strutR, trussHeight, segs);
  const dGeo = new THREE.CylinderGeometry(strutR, strutR, trussDepth, segs);
  dGeo.rotateX(Math.PI / 2);

  const diagLen = Math.hypot(bayWidth, trussHeight);
  const diagGeo = new THREE.CylinderGeometry(strutR * 0.9, strutR * 0.9, diagLen, segs);
  const diagAngle = Math.atan2(bayWidth, trussHeight);

  for (let i = 0; i <= bayCount; i++) {
    const x = -span / 2 + i * bayWidth;
    for (const cz of [-trussDepth / 2, trussDepth / 2]) {
      const v = new THREE.Mesh(vGeo, material);
      v.position.set(x, 0, cz);
      group.add(v);
    }
    for (const cy of [-trussHeight / 2, trussHeight / 2]) {
      const d = new THREE.Mesh(dGeo, material);
      d.position.set(x, cy, 0);
      group.add(d);
    }

    if (i < bayCount) {
      const midX = x + bayWidth / 2;
      const flip = i % 2 === 0 ? 1 : -1;
      for (const cz of [-trussDepth / 2, trussDepth / 2]) {
        const diag = new THREE.Mesh(diagGeo, material);
        diag.position.set(midX, 0, cz);
        diag.rotation.z = flip * diagAngle;
        group.add(diag);
      }
    }
  }

  return group;
}

export function buildRoadSignAssemblyScene(
  assembly: RoadSignAssembly,
  lod: LODLevel,
  wireframe: boolean,
  selectedSignId: string | null
): BuiltSignScene {
  const rootGroup = new THREE.Group();
  rootGroup.name = `RoadSignAssembly_LOD${lod}`;
  const signSelectableMap = new Map<THREE.Object3D, string>();

  const { structure, signs } = assembly;
  const poleMat = getPolePBRMaterial(
    structure.poleMaterial,
    structure.poleProfile,
    structure.weathering,
    wireframe
  );

  const isOverhead =
    structure.structureType === 'cantilever' ||
    structure.structureType === 'portal-gantry' ||
    structure.structureType === 'truss-gantry';

  const baseMountY = isOverhead
    ? structure.poleHeight - 0.65
    : structure.structureType === 'route-tree'
    ? structure.poleHeight * 0.62
    : structure.poleHeight * 0.68;

  // Ensure pole height always reaches the top of the highest mounted sign so no sign floats in mid-air!
  let highestSignCenterY = structure.poleHeight;
  let widestSignSpan = structure.gantrySpan;
  for (const s of signs) {
    const sy = baseMountY + s.yOffset + (s.height * s.scale) * 0.35;
    if (sy > highestSignCenterY) highestSignCenterY = sy;
    const rightEdge = Math.abs(s.xOffset) + (s.width * s.scale) / 2;
    if (rightEdge * 2 + 2.4 > widestSignSpan) {
      widestSignSpan = rightEdge * 2 + 2.4;
    }
  }

  const effectivePoleHeight = isOverhead
    ? structure.poleHeight
    : Math.max(structure.poleHeight, highestSignCenterY);
  const effectiveSpan = isOverhead
    ? Math.max(structure.gantrySpan, widestSignSpan)
    : structure.gantrySpan;

  // Optional 3D Road & Shoulder Diorama Pad
  if (structure.showRoadBase) {
    const padW = isOverhead ? effectiveSpan + 3.2 : 5.4;
    const padD = isOverhead ? 6.5 : 4.2;

    const roadGroup = new THREE.Group();
    roadGroup.name = 'HighwayRoadDiorama';

    const gravelMat = new THREE.MeshStandardMaterial({
      color: '#C7BFB3',
      roughness: 0.92,
      metalness: 0.02,
      wireframe,
    });
    const baseSlab = new THREE.Mesh(new THREE.BoxGeometry(padW, 0.08, padD), gravelMat);
    baseSlab.position.y = -0.04;
    baseSlab.receiveShadow = true;
    roadGroup.add(baseSlab);

    const asphaltW = isOverhead ? effectiveSpan - 1.2 : 2.6;
    const asphaltMat = new THREE.MeshStandardMaterial({
      color: '#343A42',
      roughness: 0.85,
      metalness: 0.05,
      wireframe,
    });
    const asphalt = new THREE.Mesh(new THREE.BoxGeometry(asphaltW, 0.03, padD), asphaltMat);
    asphalt.position.set(isOverhead ? 0 : -1.2, 0.01, 0);
    asphalt.receiveShadow = true;
    roadGroup.add(asphalt);

    if (lod < 2) {
      const lineMat = new THREE.MeshBasicMaterial({ color: '#F4F6F8', wireframe });
      const yellowLineMat = new THREE.MeshBasicMaterial({ color: '#F5C400', wireframe });
      const rightEdge = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.01, padD * 0.96),
        lineMat
      );
      rightEdge.position.set((isOverhead ? 0 : -1.2) + asphaltW * 0.44, 0.028, 0);
      const leftEdge = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.01, padD * 0.96),
        yellowLineMat
      );
      leftEdge.position.set((isOverhead ? 0 : -1.2) - asphaltW * 0.44, 0.028, 0);
      roadGroup.add(rightEdge, leftEdge);
    }

    rootGroup.add(roadGroup);
  }

  const structureGroup = new THREE.Group();
  structureGroup.name = `SupportStructure_${structure.structureType}`;

  const h = effectivePoleHeight;
  const r = structure.poleRadius;
  const span = effectiveSpan;

  if (structure.structureType === 'single-post') {
    const col = createPoleColumnMesh(structure.poleProfile, h, r, lod, poleMat);
    structureGroup.add(col);
    structureGroup.add(createBaseHardware(0, 0, structure, lod, poleMat, wireframe));
  } else if (structure.structureType === 'dual-post') {
    const maxSignW = Math.max(...signs.map((s) => s.width * s.scale), 1.6);
    const spacing = Math.min(maxSignW * 0.68, span * 0.62, 2.2);
    for (const px of [-spacing / 2, spacing / 2]) {
      const col = createPoleColumnMesh(structure.poleProfile, h, r, lod, poleMat);
      col.position.x = px;
      structureGroup.add(col);
      structureGroup.add(createBaseHardware(px, 0, structure, lod, poleMat, wireframe));
    }
  } else if (structure.structureType === 'route-tree') {
    const col = createPoleColumnMesh(structure.poleProfile, h, r, lod, poleMat);
    structureGroup.add(col);
    structureGroup.add(createBaseHardware(0, 0, structure, lod, poleMat, wireframe));

    // Build horizontal cross-arms for every sign with non-zero xOffset or left/right slot
    const armMap = new Map<number, number>();
    for (const s of signs) {
      if (s.mountSlot === 'left-arm' || s.mountSlot === 'right-arm' || Math.abs(s.xOffset) > 0.12) {
        const ay = Number((baseMountY + s.yOffset).toFixed(2));
        const neededHalfSpan = Math.max(0.85, Math.abs(s.xOffset) + (s.width * s.scale) * 0.35);
        armMap.set(ay, Math.max(armMap.get(ay) || 0.85, neededHalfSpan));
      }
    }
    if (armMap.size === 0) armMap.set(Number(baseMountY.toFixed(2)), 0.88);

    armMap.forEach((halfSpan, ay) => {
      const armBar = new THREE.Mesh(
        new THREE.BoxGeometry(halfSpan * 2, r * 1.15, r * 1.15),
        poleMat
      );
      armBar.position.set(0, ay, 0);
      armBar.castShadow = true;
      structureGroup.add(armBar);
    });
  } else if (structure.structureType === 'cantilever') {
    const colX = span / 2 - 0.6;
    const col = createPoleColumnMesh(structure.poleProfile, h, r * 1.25, lod, poleMat);
    col.position.x = colX;
    structureGroup.add(col);
    structureGroup.add(createBaseHardware(colX, 0, structure, lod, poleMat, wireframe));

    const armY = baseMountY;
    const armLen = span - 0.6;
    const armBeam = new THREE.Mesh(
      new THREE.BoxGeometry(armLen, r * 1.65, r * 1.65),
      poleMat
    );
    armBeam.position.set(colX - armLen / 2, armY, 0);
    armBeam.castShadow = true;
    structureGroup.add(armBeam);

    if (lod < 2) {
      const elbow = new THREE.Mesh(
        new THREE.BoxGeometry(r * 2.8, r * 2.8, r * 2.1),
        poleMat
      );
      elbow.position.set(colX, armY, 0);
      structureGroup.add(elbow);
    }
  } else if (structure.structureType === 'portal-gantry') {
    const halfSpan = span / 2;
    for (const px of [-halfSpan, halfSpan]) {
      const col = createPoleColumnMesh(structure.poleProfile, h, r * 1.15, lod, poleMat);
      col.position.x = px;
      structureGroup.add(col);
      structureGroup.add(createBaseHardware(px, 0, structure, lod, poleMat, wireframe));
    }
    const beamY = baseMountY;
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(span + r * 2.4, r * 1.6, r * 1.6),
      poleMat
    );
    beam.position.set(0, beamY, 0);
    beam.castShadow = true;
    structureGroup.add(beam);
  } else if (structure.structureType === 'truss-gantry') {
    const halfSpan = span / 2;
    const trussDepth = 0.72;
    const trussHeight = 0.92;
    const bridgeY = baseMountY;

    for (const side of [-1, 1]) {
      const towerX = side * halfSpan;
      for (const tz of [-trussDepth / 2, trussDepth / 2]) {
        const leg = createPoleColumnMesh('round-steel', h, r * 0.75, lod, poleMat);
        leg.position.set(towerX, 0, tz);
        structureGroup.add(leg);
      }
      if (lod < 2) {
        const rungCount = lod === 0 ? 6 : 3;
        for (let k = 1; k <= rungCount; k++) {
          const ry = (h / (rungCount + 1)) * k;
          const rung = new THREE.Mesh(
            new THREE.CylinderGeometry(r * 0.3, r * 0.3, trussDepth, 8),
            poleMat
          );
          rung.rotation.x = Math.PI / 2;
          rung.position.set(towerX, ry, 0);
          structureGroup.add(rung);
        }
      }
      structureGroup.add(createBaseHardware(towerX, 0, structure, lod, poleMat, wireframe));
    }

    const trussBridge = buildBoxTrussBridge(
      span,
      trussHeight,
      trussDepth,
      bridgeY,
      lod,
      poleMat
    );
    structureGroup.add(trussBridge);

    if (structure.hasCatwalk && lod < 2) {
      const catwalkY = bridgeY - trussHeight / 2 - 0.28;
      const walk = new THREE.Mesh(
        new THREE.BoxGeometry(span * 0.84, 0.04, 0.45),
        poleMat
      );
      walk.position.set(0, catwalkY, trussDepth / 2 + 0.48);
      structureGroup.add(walk);
    }

    if (structure.hasLuminaires && lod < 2) {
      const lightMat = new THREE.MeshStandardMaterial({
        color: '#FEF3C7',
        emissive: new THREE.Color('#FDE68A'),
        emissiveIntensity: 0.9,
        wireframe,
      });
      for (const s of signs) {
        const lx = s.xOffset;
        const ly = bridgeY - trussHeight / 2 - 0.35;
        const arm = new THREE.Mesh(
          new THREE.CylinderGeometry(0.018, 0.018, 0.95, 8),
          poleMat
        );
        arm.rotation.x = Math.PI / 2;
        arm.position.set(lx, ly, trussDepth / 2 + 0.55);
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.22), poleMat);
        lamp.position.set(lx, ly + 0.03, trussDepth / 2 + 1.0);
        const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.16), lightMat);
        bulb.position.set(lx, ly + 0.06, trussDepth / 2 + 1.0);
        structureGroup.add(arm, lamp, bulb);
      }
    }
  }

  rootGroup.add(structureGroup);

  const baseMountZ =
    structure.structureType === 'truss-gantry'
      ? 0.36 + 0.08
      : isOverhead
      ? r * 0.85 + 0.06
      : r + 0.045;

  for (const panel of signs) {
    const isSelected = panel.id === selectedSignId;
    const panelGroup = buildSignPanelMesh(panel, lod, poleMat, wireframe, isSelected);

    const px = panel.xOffset;
    const py = baseMountY + panel.yOffset;
    const pz = baseMountZ + panel.zOffset + panel.thickness / 2;

    panelGroup.position.set(px, py, pz);
    panelGroup.rotation.z = THREE.MathUtils.degToRad(panel.rotationZ);
    panelGroup.scale.setScalar(panel.scale);

    // Physical mounting hanger beams & horizontal standoffs for overhead gantry signs
    if (isOverhead && lod < 2) {
      for (const hx of [-panel.width * 0.34, panel.width * 0.34]) {
        const hanger = new THREE.Mesh(
          new THREE.BoxGeometry(0.055, panel.height * 0.9, 0.055),
          poleMat
        );
        hanger.position.set(hx, 0, -panel.thickness / 2 - 0.04);
        panelGroup.add(hanger);

        const standoffDepth = Math.max(0.08, pz - (structure.structureType === 'truss-gantry' ? 0.36 : r * 0.8));
        const topStandoff = new THREE.Mesh(
          new THREE.BoxGeometry(0.045, 0.045, standoffDepth),
          poleMat
        );
        topStandoff.position.set(hx, panel.height * 0.28, -panel.thickness / 2 - standoffDepth / 2);
        const botStandoff = new THREE.Mesh(
          new THREE.BoxGeometry(0.045, 0.045, standoffDepth),
          poleMat
        );
        botStandoff.position.set(hx, -panel.height * 0.28, -panel.thickness / 2 - standoffDepth / 2);
        panelGroup.add(topStandoff, botStandoff);
      }
    }

    panelGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        signSelectableMap.set(child, panel.id);
      }
    });

    rootGroup.add(panelGroup);
  }

  let triangles = 0;
  let vertices = 0;
  rootGroup.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) {
      const geo = mesh.geometry;
      const posAttr = geo.attributes.position;
      if (posAttr) {
        vertices += posAttr.count;
        if (geo.index) {
          triangles += Math.round(geo.index.count / 3);
        } else {
          triangles += Math.round(posAttr.count / 3);
        }
      }
    }
  });

  return {
    rootGroup,
    signSelectableMap,
    triangles,
    vertices,
  };
}
