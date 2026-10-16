import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  CameraViewPreset,
  EnvironmentPreset,
  LODLevel,
  RoadSignAssembly,
} from '../types/sign';
import { buildRoadSignAssemblyScene } from '../utils/geometryBuilder';

interface Viewport3DProps {
  assembly: RoadSignAssembly;
  activeLod: LODLevel;
  compareAllLods: boolean;
  wireframe: boolean;
  autoRotate: boolean;
  cameraPreset: CameraViewPreset;
  cameraTriggerCount: number;
  selectedSignId: string | null;
  onSelectSign: (id: string) => void;
  onMetricsUpdate: (metrics: {
    lod0Tris: number;
    lod1Tris: number;
    lod2Tris: number;
    activeVerts: number;
    activeTris: number;
  }) => void;
}

const ENV_PALETTES: Record<
  EnvironmentPreset,
  {
    topColor: string;
    midColor: string;
    bottomColor: string;
    fogColor: string;
    sunColor: string;
    sunIntensity: number;
    ambientColor: string;
    ambientIntensity: number;
  }
> = {
  'pastel-studio': {
    topColor: '#E9E2FA',
    midColor: '#F8F4FC',
    bottomColor: '#FAF7F2',
    fogColor: '#F6F2FA',
    sunColor: '#FFFDF9',
    sunIntensity: 1.85,
    ambientColor: '#EDE8F8',
    ambientIntensity: 1.15,
  },
  'desert-highway': {
    topColor: '#6EA8E5',
    midColor: '#C5E1FA',
    bottomColor: '#F5E9D6',
    fogColor: '#E8E2D5',
    sunColor: '#FFF7E6',
    sunIntensity: 2.2,
    ambientColor: '#D8E6F5',
    ambientIntensity: 1.05,
  },
  'sunset-expressway': {
    topColor: '#B5A8D5',
    midColor: '#F2C1C6',
    bottomColor: '#BCE0E8',
    fogColor: '#EBD3D8',
    sunColor: '#FFD6A5',
    sunIntensity: 2.1,
    ambientColor: '#E2C6D8',
    ambientIntensity: 1.1,
  },
  'misty-autumn': {
    topColor: '#CBD5E1',
    midColor: '#E2E8F0',
    bottomColor: '#EDE9DD',
    fogColor: '#E2E6EC',
    sunColor: '#FDE68A',
    sunIntensity: 1.5,
    ambientColor: '#E2E8F0',
    ambientIntensity: 1.25,
  },
  'countryside-day': {
    topColor: '#7CB9E8',
    midColor: '#D4EBFC',
    bottomColor: '#E8F2E4',
    fogColor: '#E3EFE8',
    sunColor: '#FFFDF7',
    sunIntensity: 2.0,
    ambientColor: '#DCEBFA',
    ambientIntensity: 1.1,
  },
};

function createSkyDomeTexture(env: EnvironmentPreset): THREE.CanvasTexture {
  const cfg = ENV_PALETTES[env] || ENV_PALETTES['pastel-studio'];
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, cfg.topColor);
  grad.addColorStop(0.52, cfg.midColor);
  grad.addColorStop(1, cfg.bottomColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 512);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const Viewport3D: React.FC<Viewport3DProps> = ({
  assembly,
  activeLod,
  compareAllLods,
  wireframe,
  autoRotate,
  cameraPreset,
  cameraTriggerCount,
  selectedSignId,
  onSelectSign,
  onMetricsUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelHolderRef = useRef<THREE.Group | null>(null);
  const selectableMapRef = useRef<Map<THREE.Object3D, string>>(new Map());

  // Camera smooth animation state
  const camAnimRef = useRef<{
    active: boolean;
    targetPos: THREE.Vector3;
    targetLookAt: THREE.Vector3;
  }>({
    active: false,
    targetPos: new THREE.Vector3(3.5, 3.2, 5.5),
    targetLookAt: new THREE.Vector3(0, 2.5, 0),
  });

  const onSelectSignRef = useRef(onSelectSign);
  onSelectSignRef.current = onSelectSign;

  // Initialize Three.js WebGLRenderer, Scene, Lights, Sky, and Controls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      200
    );
    camera.position.set(3.4, 3.1, 5.6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.maxPolarAngle = Math.PI * 0.51;
    controls.minDistance = 1.1;
    controls.maxDistance = 42;
    controls.target.set(0, 2.4, 0);
    controlsRef.current = controls;

    // Stop camera preset lerp if user manually grabs the orbit controls
    const stopCamAnim = () => {
      camAnimRef.current.active = false;
    };
    controls.addEventListener('start', stopCamAnim);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight('#EDE8F8', 1.15);
    ambientLight.name = 'AmbientLight';
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#E6DFD3', 0.65);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight('#FFFDF9', 1.85);
    dirLight.name = 'KeySunLight';
    dirLight.position.set(7, 12, 9);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    const d = 9.5;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight('#D8E2FF', 0.75);
    rimLight.position.set(-8, 6, -7);
    scene.add(rimLight);

    // Subtle Studio Ground Grid
    const grid = new THREE.GridHelper(36, 36, '#D3CCE6', '#E5E0F0');
    grid.position.y = -0.045;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.55;
    scene.add(grid);

    // Shadow-catching ground plane
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.ShadowMaterial({ opacity: 0.16 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.042;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const modelHolder = new THREE.Group();
    modelHolder.name = 'ModelHolder';
    scene.add(modelHolder);
    modelHolderRef.current = modelHolder;

    // Raycaster for clicking signs directly in 3D
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // Was a drag, not a click

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(modelHolder.children, true);
      for (const hit of intersects) {
        const signId = selectableMapRef.current.get(hit.object);
        if (signId) {
          onSelectSignRef.current(signId);
          break;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animation Loop
    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      if (camAnimRef.current.active) {
        camera.position.lerp(camAnimRef.current.targetPos, 0.085);
        controls.target.lerp(camAnimRef.current.targetLookAt, 0.085);
        if (
          camera.position.distanceTo(camAnimRef.current.targetPos) < 0.02 &&
          controls.target.distanceTo(camAnimRef.current.targetLookAt) < 0.02
        ) {
          camAnimRef.current.active = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', stopCamAnim);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
    };
  }, []);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 1.6;
    }
  }, [autoRotate]);

  // Update Environment Lighting & Sky Backdrop
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const envCfg = ENV_PALETTES[assembly.environment] || ENV_PALETTES['pastel-studio'];
    scene.background = createSkyDomeTexture(assembly.environment);
    scene.fog = new THREE.FogExp2(envCfg.fogColor, 0.012);

    const amb = scene.getObjectByName('AmbientLight') as THREE.AmbientLight | undefined;
    if (amb) {
      amb.color.set(envCfg.ambientColor);
      amb.intensity = envCfg.ambientIntensity;
    }
    const sun = scene.getObjectByName('KeySunLight') as THREE.DirectionalLight | undefined;
    if (sun) {
      sun.color.set(envCfg.sunColor);
      sun.intensity = envCfg.sunIntensity;
    }
  }, [assembly.environment]);

  // Rebuild 3D Sign Assembly & Compute All 3 LOD Metrics
  useEffect(() => {
    const holder = modelHolderRef.current;
    if (!holder) return;

    // Clear previous meshes
    while (holder.children.length > 0) {
      holder.remove(holder.children[0]);
    }
    selectableMapRef.current.clear();

    const lod0 = buildRoadSignAssemblyScene(assembly, 0, wireframe, selectedSignId);
    const lod1 = buildRoadSignAssemblyScene(assembly, 1, wireframe, selectedSignId);
    const lod2 = buildRoadSignAssemblyScene(assembly, 2, wireframe, selectedSignId);

    const byLod = [lod0, lod1, lod2];

    if (compareAllLods) {
      const isOverhead =
        assembly.structure.structureType === 'cantilever' ||
        assembly.structure.structureType === 'portal-gantry' ||
        assembly.structure.structureType === 'truss-gantry';
      const spacing = isOverhead ? assembly.structure.gantrySpan + 3.2 : 5.2;

      byLod.forEach((built, idx) => {
        built.rootGroup.position.x = (idx - 1) * spacing;
        holder.add(built.rootGroup);
        built.signSelectableMap.forEach((val, key) => {
          selectableMapRef.current.set(key, val);
        });
      });
    } else {
      const activeBuilt = byLod[activeLod];
      holder.add(activeBuilt.rootGroup);
      activeBuilt.signSelectableMap.forEach((val, key) => {
        selectableMapRef.current.set(key, val);
      });
    }

    const currentBuilt = byLod[activeLod];
    onMetricsUpdate({
      lod0Tris: lod0.triangles,
      lod1Tris: lod1.triangles,
      lod2Tris: lod2.triangles,
      activeVerts: currentBuilt.vertices,
      activeTris: currentBuilt.triangles,
    });
  }, [assembly, activeLod, compareAllLods, wireframe, selectedSignId]);

  // Smooth Camera Transitions when CameraViewPreset or Structure Type changes
  useEffect(() => {
    const isOverhead =
      assembly.structure.structureType === 'cantilever' ||
      assembly.structure.structureType === 'portal-gantry' ||
      assembly.structure.structureType === 'truss-gantry';

    const h = assembly.structure.poleHeight;
    const focusY = isOverhead ? h - 0.8 : h * 0.65;
    const distScale = compareAllLods ? 2.15 : isOverhead ? 1.55 : 1.0;

    const targetLookAt = new THREE.Vector3(0, focusY, 0);
    const targetPos = new THREE.Vector3();

    switch (cameraPreset) {
      case 'front-ortho':
        targetPos.set(0, focusY, 5.4 * distScale);
        break;
      case 'driver-pov':
        targetLookAt.set(0, focusY + 0.15, 0);
        targetPos.set(isOverhead ? -0.8 : -1.2, 1.35, 6.8 * distScale);
        break;
      case 'low-hero':
        targetLookAt.set(0, focusY + 0.25, 0);
        targetPos.set(2.2 * distScale, 0.95, 4.2 * distScale);
        break;
      case 'rear-hardware':
        targetPos.set(-2.4 * distScale, focusY + 0.2, -4.8 * distScale);
        break;
      case 'top-plan':
        targetLookAt.set(0, focusY * 0.5, 0);
        targetPos.set(0, h + 5.5 * distScale, 1.8);
        break;
      case 'studio-34':
      default:
        targetPos.set(3.2 * distScale, focusY + 0.35, 5.2 * distScale);
        break;
    }

    camAnimRef.current = {
      active: true,
      targetPos,
      targetLookAt,
    };
  }, [
    cameraPreset,
    cameraTriggerCount,
    assembly.structure.structureType,
    compareAllLods,
  ]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing"
    />
  );
};
