import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dices,
  Download,
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  Layers,
  Box,
  Type,
  Shield,
  Sliders,
  Camera,
  RotateCw,
  Grid,
  Sparkles,
  Check,
  ChevronUp,
  ChevronDown,
  Upload,
  Compass,
  Eye,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import {
  ArrowType,
  BadgeType,
  BaseType,
  CameraViewPreset,
  EnvironmentPreset,
  LODLevel,
  MountSlot,
  PictogramType,
  PoleMaterialType,
  PoleProfile,
  RoadSignAssembly,
  RoadSignFont,
  SheetingType,
  SignPanelConfig,
  SignShape,
  StructureType,
} from './types/sign';
import {
  COLOR_PRESETS,
  createDefaultSignPanel,
  FONT_OPTIONS,
  STARTER_TEMPLATES,
  StarterTemplateItem,
} from './data/presets';
import {
  createRandomSeedCode,
  generateSignAssemblyFromSeed,
} from './utils/prng';
import { preloadCustomImage } from './utils/textureRenderer';
import { Viewport3D } from './components/Viewport3D';
import { ExportModal } from './components/ExportModal';

type LeftTab = 'signs' | 'structure';
type RightTab = 'shape' | 'typography' | 'graphics' | 'mount';

export function App() {
  const [assembly, setAssembly] = useState<RoadSignAssembly>(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTpl = params.get('tpl');
    if (urlTpl) {
      const found = STARTER_TEMPLATES.find((t) => t.id === urlTpl);
      if (found) return JSON.parse(JSON.stringify(found.assembly));
    }
    const urlSeed = params.get('seed');
    if (urlSeed) {
      return generateSignAssemblyFromSeed(urlSeed);
    }
    return JSON.parse(JSON.stringify(STARTER_TEMPLATES[0].assembly));
  });
  const [seedInput, setSeedInput] = useState<string>(() => assembly.seed);
  const [seedHistory, setSeedHistory] = useState<string[]>(() => [assembly.seed]);
  const [selectedSignId, setSelectedSignId] = useState<string | null>(
    () => assembly.signs[0]?.id || null
  );

  // Viewport & LOD states
  const [activeLod, setActiveLod] = useState<LODLevel>(() => {
    const params = new URLSearchParams(window.location.search);
    const l = Number(params.get('lod'));
    return l === 1 || l === 2 ? (l as LODLevel) : 0;
  });
  const [compareAllLods, setCompareAllLods] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('compare') === '1';
  });
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<CameraViewPreset>(() => {
    const params = new URLSearchParams(window.location.search);
    const cam = params.get('cam') as CameraViewPreset | null;
    return cam || 'studio-34';
  });
  const [cameraTriggerCount, setCameraTriggerCount] = useState<number>(0);

  // UI Panels & Modals
  const [leftTab, setLeftTab] = useState<LeftTab>('signs');
  const [rightTab, setRightTab] = useState<RightTab>('shape');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [diceSpinning, setDiceSpinning] = useState<boolean>(false);
  const [fontReadyTick, setFontReadyTick] = useState<number>(0);
  const hideUi = new URLSearchParams(window.location.search).get('hideui') === '1';

  // Live 3D Geometry Metrics across all 3 LODs
  const [metrics, setMetrics] = useState({
    lod0Tris: 0,
    lod1Tris: 0,
    lod2Tris: 0,
    activeVerts: 0,
    activeTris: 0,
  });

  // Trigger a texture re-render once web fonts finish loading so Highway Gothic & DIN 1451 are crisp on first paint
  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontReadyTick((t) => t + 1);
        setAssembly((prev) => ({ ...prev, signs: [...prev.signs] }));
      });
    }
  }, []);

  const selectedSign =
    assembly.signs.find((s) => s.id === selectedSignId) ||
    assembly.signs[0] ||
    null;

  const updateSelectedSign = useCallback(
    (updater: (prev: SignPanelConfig) => SignPanelConfig) => {
      if (!selectedSign) return;
      const targetId = selectedSign.id;
      setAssembly((prev) => ({
        ...prev,
        signs: prev.signs.map((s) => (s.id === targetId ? updater(s) : s)),
      }));
    },
    [selectedSign]
  );

  const updateStructure = useCallback(
    (
      updater: (
        prev: RoadSignAssembly['structure']
      ) => RoadSignAssembly['structure']
    ) => {
      setAssembly((prev) => ({
        ...prev,
        structure: updater(prev.structure),
      }));
    },
    []
  );

  // Seeded Random Generation
  const handleApplySeed = (targetSeed: string) => {
    const cleanSeed = targetSeed.trim() || createRandomSeedCode();
    setSeedInput(cleanSeed);
    const nextAssembly = generateSignAssemblyFromSeed(cleanSeed);
    setAssembly(nextAssembly);
    setSelectedSignId(nextAssembly.signs[0]?.id || null);
    setSeedHistory((prev) =>
      [cleanSeed, ...prev.filter((s) => s !== cleanSeed)].slice(0, 8)
    );
  };

  const handleRandomizeNewSeed = () => {
    setDiceSpinning(true);
    setTimeout(() => setDiceSpinning(false), 450);
    const newSeed = createRandomSeedCode();
    handleApplySeed(newSeed);
  };

  const handleSelectStarterTemplate = (template: StarterTemplateItem) => {
    const cloned: RoadSignAssembly = JSON.parse(
      JSON.stringify(template.assembly)
    );
    setAssembly(cloned);
    setSeedInput(cloned.seed);
    setSelectedSignId(cloned.signs[0]?.id || null);
    setCameraTriggerCount((c) => c + 1);
  };

  // Multi-sign operations
  const handleAddSign = (templateType: string = 'guide') => {
    const isOverhead =
      assembly.structure.structureType === 'cantilever' ||
      assembly.structure.structureType === 'portal-gantry' ||
      assembly.structure.structureType === 'truss-gantry';

    const count = assembly.signs.length;
    let newPanel: SignPanelConfig;

    if (templateType === 'interstate') {
      newPanel = createDefaultSignPanel({
        id: `sign-${Date.now()}`,
        name: 'Interstate Shield',
        mountSlot: 'center',
        yOffset: -count * 0.85,
        shape: 'interstate-shield',
        width: 0.98,
        height: 0.98,
        colorPreset: 'interstate-classic',
        bgColor: '#003F87',
        borderColor: '#F8FAFC',
        textColor: '#F8FAFC',
        accentColor: '#C8102E',
        fontFamily: 'HighwayGothicWide',
        headerText: 'INTERSTATE',
        lines: [{ id: '1', text: '80', fontSize: 160, letterSpacing: 2, align: 'center' }],
      });
    } else if (templateType === 'us-shield') {
      newPanel = createDefaultSignPanel({
        id: `sign-${Date.now()}`,
        name: 'US Route Shield',
        mountSlot: 'center',
        yOffset: -count * 0.85,
        shape: 'us-route-shield',
        width: 0.85,
        height: 0.82,
        colorPreset: 'regulatory-white',
        bgColor: '#F4F5F7',
        borderColor: '#16181D',
        textColor: '#16181D',
        fontFamily: 'HighwayGothicWide',
        headerText: 'HIGHWAY',
        subHeaderText: 'U S',
        lines: [{ id: '1', text: '66', fontSize: 145, letterSpacing: 2, align: 'center' }],
      });
    } else if (templateType === 'warning') {
      newPanel = createDefaultSignPanel({
        id: `sign-${Date.now()}`,
        name: 'Warning Diamond',
        mountSlot: 'center',
        yOffset: 0.85,
        shape: 'diamond',
        width: 1.0,
        height: 1.0,
        cornerRadius: 0.07,
        colorPreset: 'warning-yellow',
        bgColor: '#F5C400',
        borderColor: '#141619',
        textColor: '#141619',
        lines: [],
        arrowType: 'turn-left-90',
        arrowPosition: 'center',
        arrowScale: 1.15,
      });
    } else if (templateType === 'arrow-plaque') {
      newPanel = createDefaultSignPanel({
        id: `sign-${Date.now()}`,
        name: 'Arrow Plaque',
        mountSlot: 'center',
        yOffset: -1.1,
        shape: 'rounded-rect',
        width: 0.85,
        height: 0.6,
        cornerRadius: 0.06,
        colorPreset: 'motorist-blue',
        bgColor: '#003F87',
        borderColor: '#F4F6F8',
        textColor: '#F4F6F8',
        lines: [],
        arrowType: 'down-left',
        arrowPosition: 'center',
        arrowScale: 1.15,
      });
    } else {
      newPanel = createDefaultSignPanel({
        id: `sign-${Date.now()}`,
        name: `Sign Panel ${count + 1}`,
        mountSlot: isOverhead ? 'gantry-center' : 'center',
        xOffset: isOverhead ? (count - 1) * 2.2 : 0,
        yOffset: isOverhead ? 0 : 0.8 - count * 0.95,
      });
    }

    setAssembly((prev) => ({
      ...prev,
      signs: [...prev.signs, newPanel],
    }));
    setSelectedSignId(newPanel.id);
  };

  const handleDuplicateSign = (sign: SignPanelConfig) => {
    const copy: SignPanelConfig = JSON.parse(JSON.stringify(sign));
    copy.id = `sign-${Date.now()}`;
    copy.name = `${sign.name} (Copy)`;
    copy.yOffset = Number((sign.yOffset - 0.75).toFixed(2));
    setAssembly((prev) => ({
      ...prev,
      signs: [...prev.signs, copy],
    }));
    setSelectedSignId(copy.id);
  };

  const handleDeleteSign = (id: string) => {
    if (assembly.signs.length <= 1) return;
    setAssembly((prev) => {
      const next = prev.signs.filter((s) => s.id !== id);
      if (selectedSignId === id) {
        setSelectedSignId(next[0]?.id || null);
      }
      return { ...prev, signs: next };
    });
  };

  const handleAutoAlignSigns = () => {
    const isOverhead =
      assembly.structure.structureType === 'cantilever' ||
      assembly.structure.structureType === 'portal-gantry' ||
      assembly.structure.structureType === 'truss-gantry';

    setAssembly((prev) => {
      const count = prev.signs.length;
      if (count <= 1) return prev;
      if (isOverhead) {
        const totalW = prev.signs.reduce((acc, s) => acc + s.width, 0) + (count - 1) * 0.35;
        let cursorX = -totalW / 2;
        const nextSigns = prev.signs.map((s) => {
          const cx = cursorX + s.width / 2;
          cursorX += s.width + 0.35;
          return { ...s, xOffset: Number(cx.toFixed(2)), yOffset: 0 };
        });
        return { ...prev, signs: nextSigns };
      } else {
        const totalH = prev.signs.reduce((acc, s) => acc + s.height, 0) + (count - 1) * 0.14;
        let cursorY = totalH / 2;
        const nextSigns = prev.signs.map((s) => {
          const cy = cursorY - s.height / 2;
          cursorY -= s.height + 0.14;
          return { ...s, xOffset: 0, yOffset: Number(cy.toFixed(2)) };
        });
        return { ...prev, signs: nextSigns };
      }
    });
  };

  const handleCustomGraphicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSign) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      preloadCustomImage(dataUrl, () => {
        updateSelectedSign((prev) => ({
          ...prev,
          pictogramType: 'custom-upload',
          customImageUrl: dataUrl,
        }));
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      key={fontReadyTick}
      className="relative w-screen h-screen overflow-hidden bg-[#FAF7F2] select-none flex flex-col"
    >
      {/* Full-bleed Interactive 3D Viewport */}
      <div className="absolute inset-0 z-0">
        <Viewport3D
          assembly={assembly}
          activeLod={activeLod}
          compareAllLods={compareAllLods}
          wireframe={wireframe}
          autoRotate={autoRotate}
          cameraPreset={cameraPreset}
          cameraTriggerCount={cameraTriggerCount}
          selectedSignId={selectedSign?.id || null}
          onSelectSign={(id) => setSelectedSignId(id)}
          onMetricsUpdate={setMetrics}
        />
      </div>

      {/* TOP FLOATING NAVIGATION & SEED RANDOMIZER BAR */}
      <header className="relative z-20 mx-4 mt-3 px-4 py-2.5 rounded-2xl bg-[#FAF7F2]/88 backdrop-blur-xl border border-[#E5E0F0] shadow-lg shadow-[#1E2430]/5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C83FD] via-[#9688FA] to-[#FF8B7B] text-white flex items-center justify-center shadow-sm font-black text-sm tracking-tighter">
            S3D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-[#1E2430] tracking-tight">
                SignCraft 3D
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F3EFFA] text-[#636BFA] border border-[#E2DCF5]">
                MUTCD • DIN • NEXCO
              </span>
            </div>
            <p className="text-[11px] text-[#647084] hidden sm:block">
              Procedural Road Sign, Multi-Sign Gantry & 3-LOD Studio
            </p>
          </div>
        </div>

        {/* Seed & Random Generation Control Pod */}
        <div className="flex items-center gap-2 bg-white/90 px-2.5 py-1.5 rounded-xl border border-[#E6E2EE] shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#647084] pl-1">
              Seed
            </span>
            <input
              type="text"
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApplySeed(seedInput);
              }}
              placeholder="Enter seed..."
              className="w-36 sm:w-44 px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E6E2EE] font-mono text-xs font-semibold text-[#1E2430] focus:outline-none focus:border-[#7C83FD]"
            />
            <button
              onClick={() => handleApplySeed(seedInput)}
              title="Generate sign deterministically from this seed"
              className="px-2.5 py-1 rounded-lg bg-[#F3EFFA] hover:bg-[#E7E0F8] text-[#636BFA] text-xs font-semibold transition-colors"
            >
              Apply
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#E6E2EE]" />

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleRandomizeNewSeed}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF8B7B] to-[#F97316] hover:from-[#FA7B69] hover:to-[#EA580C] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <motion.span
              animate={{ rotate: diceSpinning ? 360 : 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <Dices className="w-3.5 h-3.5" />
            </motion.span>
            Randomize
          </motion.button>
        </div>

        {/* Right Actions: Starter Templates, 3-LOD Switcher, Export */}
        <div className="flex items-center gap-2.5">
          {/* Starter Templates Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#EAF7F1] px-2.5 py-1.5 rounded-xl border border-[#BDE5D2] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#2F8564]" />
            <select
              value={assembly.presetId || ''}
              onChange={(e) => {
                const found = STARTER_TEMPLATES.find((t) => t.id === e.target.value);
                if (found) handleSelectStarterTemplate(found);
              }}
              aria-label="Starter Assembly Templates"
              className="bg-transparent text-[#2F8564] text-xs font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="" disabled>
                Starter Templates...
              </option>
              {STARTER_TEMPLATES.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.title} ({tpl.region.split('•')[0].trim()})
                </option>
              ))}
            </select>
          </div>

          {/* 3-Level LOD Segmented Control */}
          <div className="flex items-center bg-white/90 p-1 rounded-xl border border-[#E6E2EE] shadow-sm">
            {([0, 1, 2] as LODLevel[]).map((lvl) => {
              const isActive = activeLod === lvl && !compareAllLods;
              const triCount =
                lvl === 0
                  ? metrics.lod0Tris
                  : lvl === 1
                  ? metrics.lod1Tris
                  : metrics.lod2Tris;
              return (
                <button
                  key={lvl}
                  onClick={() => {
                    setCompareAllLods(false);
                    setActiveLod(lvl);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#7C83FD] text-white shadow-sm'
                      : 'text-[#647084] hover:text-[#1E2430]'
                  }`}
                >
                  <span>LOD {lvl}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FAF7F2] text-[#647084]'
                    }`}
                  >
                    {triCount}t
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => setCompareAllLods((v) => !v)}
              title="Compare LOD 0, LOD 1, and LOD 2 side-by-side in 3D"
              className={`ml-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                compareAllLods
                  ? 'bg-[#FF8B7B] text-white shadow-sm'
                  : 'text-[#647084] hover:text-[#1E2430]'
              }`}
            >
              3× Compare
            </button>
          </div>

          {/* Export CTA */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C83FD] to-[#636BFA] hover:from-[#6B73FB] hover:to-[#5159F7] text-white text-xs font-bold shadow-md shadow-[#7C83FD]/25 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 3D</span>
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE OVERLAY: LEFT ASSEMBLY DOCK & RIGHT INSPECTOR DOCK */}
      <div
        className={`relative z-10 flex-1 flex justify-between items-stretch px-4 py-3 pointer-events-none overflow-hidden ${
          hideUi ? 'opacity-0 pointer-events-none' : ''
        }`}
      >
        {/* LEFT DOCK: MULTI-SIGN MANAGER & POLE/GANTRY STRUCTURE */}
        <aside className="w-80 sm:w-[340px] pointer-events-auto flex flex-col rounded-3xl bg-[#FAF7F2]/90 backdrop-blur-xl border border-[#E5E0F0] shadow-xl shadow-[#1E2430]/5 overflow-hidden">
          {/* Left Dock Tabs */}
          <div className="p-2 bg-[#F3EFFA]/70 border-b border-[#E6E2EE] grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setLeftTab('signs')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                leftTab === 'signs'
                  ? 'bg-white text-[#636BFA] shadow-sm border border-[#E6E2EE]'
                  : 'text-[#647084] hover:text-[#1E2430]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Signs ({assembly.signs.length})</span>
            </button>
            <button
              onClick={() => setLeftTab('structure')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                leftTab === 'structure'
                  ? 'bg-white text-[#636BFA] shadow-sm border border-[#E6E2EE]'
                  : 'text-[#647084] hover:text-[#1E2430]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Pole & Gantry</span>
            </button>
          </div>

          {/* Left Dock Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {leftTab === 'signs' ? (
              <>
                {/* Quick Add Sign Templates */}
                <div className="bg-white/90 p-3 rounded-2xl border border-[#E6E2EE] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                      Add Sign to Structure
                    </span>
                    <span className="text-[10px] font-semibold text-[#4BB38A] bg-[#EAF7F1] px-2 py-0.5 rounded-full">
                      Multi-Sign Ready
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleAddSign('guide')}
                      className="px-2.5 py-2 rounded-xl bg-[#F3EFFA] hover:bg-[#E6DFF8] text-[#636BFA] text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Guide Panel
                    </button>
                    <button
                      onClick={() => handleAddSign('interstate')}
                      className="px-2.5 py-2 rounded-xl bg-[#EDF5FC] hover:bg-[#DCEBFA] text-[#2B6CB0] text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Interstate Shield
                    </button>
                    <button
                      onClick={() => handleAddSign('us-shield')}
                      className="px-2.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EFECE4] text-[#1E2430] border border-[#E6E2EE] text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      US Route Shield
                    </button>
                    <button
                      onClick={() => handleAddSign('warning')}
                      className="px-2.5 py-2 rounded-xl bg-[#FEF9E7] hover:bg-[#FDEFC3] text-[#B45309] text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Warning Diamond
                    </button>
                    <button
                      onClick={() => handleAddSign('arrow-plaque')}
                      className="col-span-2 px-2.5 py-1.5 rounded-xl bg-[#FDF1EC] hover:bg-[#FCE3D9] text-[#C2410C] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Directional Arrow / Sub-Plaque
                    </button>
                  </div>
                </div>

                {/* Recent Seed History Chips */}
                {seedHistory.length > 1 && (
                  <div className="bg-white/80 px-3 py-2 rounded-2xl border border-[#E6E2EE] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#647084] block">
                      Recent Rolled Seeds
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {seedHistory.map((sh) => (
                        <button
                          key={sh}
                          onClick={() => handleApplySeed(sh)}
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold transition-colors ${
                            assembly.seed === sh
                              ? 'bg-[#7C83FD] text-white'
                              : 'bg-[#FAF7F2] text-[#647084] hover:text-[#1E2430] border border-[#E6E2EE]'
                          }`}
                        >
                          {sh}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* List of Mounted Signs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                      Mounted Sign Stack
                    </span>
                    {assembly.signs.length > 1 && (
                      <button
                        onClick={handleAutoAlignSigns}
                        className="text-[10px] font-bold text-[#636BFA] bg-[#F3EFFA] hover:bg-[#E5DDF8] px-2 py-0.5 rounded-md transition-colors"
                      >
                        Auto-Space Stack
                      </button>
                    )}
                  </div>

                  {assembly.signs.map((sign, idx) => {
                    const isSelected = selectedSign?.id === sign.id;
                    const primaryText =
                      sign.lines.map((l) => l.text).join(' • ') ||
                      (sign.arrowType !== 'none'
                        ? `Arrow: ${sign.arrowType}`
                        : sign.pictogramType !== 'none'
                        ? `Symbol: ${sign.pictogramType}`
                        : sign.shape);

                    return (
                      <motion.div
                        layout
                        key={sign.id}
                        onClick={() => setSelectedSignId(sign.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white border-[#7C83FD] ring-2 ring-[#7C83FD]/20 shadow-md'
                            : 'bg-white/75 border-[#E6E2EE] hover:border-[#7C83FD]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-5 h-5 rounded-lg shrink-0 border flex items-center justify-center text-[10px] font-bold shadow-inner"
                              style={{
                                backgroundColor: sign.bgColor,
                                borderColor: sign.borderColor,
                                color: sign.textColor,
                              }}
                            >
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-[#1E2430] truncate">
                                {sign.name}
                              </div>
                              <div className="text-[11px] text-[#647084] truncate font-mono">
                                {primaryText}
                              </div>
                            </div>
                          </div>

                          <div
                            className="flex items-center gap-1 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleDuplicateSign(sign)}
                              title="Duplicate Sign"
                              className="p-1.5 rounded-lg hover:bg-[#F3EFFA] text-[#647084] hover:text-[#636BFA] transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            {assembly.signs.length > 1 && (
                              <button
                                onClick={() => handleDeleteSign(sign.id)}
                                title="Remove Sign"
                                className="p-1.5 rounded-lg hover:bg-[#FDF1EC] text-[#647084] hover:text-[#E11D48] transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Quick Position Nudge Bar when Selected */}
                        {isSelected && (
                          <div
                            className="mt-2.5 pt-2.5 border-t border-[#E6E2EE] grid grid-cols-2 gap-2 text-[11px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div>
                              <div className="flex justify-between text-[#647084] mb-1">
                                <span>Vertical Y</span>
                                <span className="font-mono font-semibold text-[#1E2430]">
                                  {sign.yOffset.toFixed(2)}m
                                </span>
                              </div>
                              <input
                                type="range"
                                min={-2.4}
                                max={2.4}
                                step={0.05}
                                value={sign.yOffset}
                                onChange={(e) =>
                                  updateSelectedSign((s) => ({
                                    ...s,
                                    yOffset: parseFloat(e.target.value),
                                  }))
                                }
                                className="w-full pastel-slider"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-[#647084] mb-1">
                                <span>Horizontal X</span>
                                <span className="font-mono font-semibold text-[#1E2430]">
                                  {sign.xOffset.toFixed(2)}m
                                </span>
                              </div>
                              <input
                                type="range"
                                min={-4.2}
                                max={4.2}
                                step={0.05}
                                value={sign.xOffset}
                                onChange={(e) =>
                                  updateSelectedSign((s) => ({
                                    ...s,
                                    xOffset: parseFloat(e.target.value),
                                  }))
                                }
                                className="w-full pastel-slider"
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* STRUCTURE, POLE, GANTRY & ENVIRONMENT SETTINGS */
              <div className="space-y-4">
                {/* Support Structure Type */}
                <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-2.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                    Support Structure Type
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(
                      [
                        { id: 'single-post', label: 'Single Post' },
                        { id: 'dual-post', label: 'Dual I-Beam Post' },
                        { id: 'route-tree', label: 'Route Tree Arms' },
                        { id: 'cantilever', label: 'Cantilever Arm' },
                        { id: 'portal-gantry', label: 'Portal Gantry' },
                        { id: 'truss-gantry', label: 'Box-Truss Bridge' },
                      ] as { id: StructureType; label: string }[]
                    ).map((st) => (
                      <button
                        key={st.id}
                        onClick={() =>
                          updateStructure((prev) => ({
                            ...prev,
                            structureType: st.id,
                          }))
                        }
                        className={`px-2.5 py-2 rounded-xl text-xs font-semibold text-left border transition-all ${
                          assembly.structure.structureType === st.id
                            ? 'bg-[#F3EFFA] border-[#7C83FD] text-[#636BFA] font-bold shadow-sm'
                            : 'bg-[#FAF7F2] border-[#E6E2EE] text-[#1E2430] hover:border-[#7C83FD]/40'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pole Cross-Section Profile */}
                <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-2.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                    Pole Profile Cross-Section
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(
                      [
                        { id: 'round-steel', label: 'Round Steel Pipe' },
                        { id: 'square-perforated', label: 'Perforated Square' },
                        { id: 'i-beam', label: 'Wide-Flange I-Beam' },
                        { id: 'u-channel', label: 'Flanged U-Channel' },
                        { id: 'wood-post', label: '4×4 Timber Post' },
                        { id: 'octagonal-mast', label: 'Octagonal Mast' },
                      ] as { id: PoleProfile; label: string }[]
                    ).map((prof) => (
                      <button
                        key={prof.id}
                        onClick={() =>
                          updateStructure((prev) => ({
                            ...prev,
                            poleProfile: prof.id,
                          }))
                        }
                        className={`px-2.5 py-2 rounded-xl text-xs font-semibold text-left border transition-all ${
                          assembly.structure.poleProfile === prof.id
                            ? 'bg-[#EAF7F1] border-[#4BB38A] text-[#2F8564] font-bold shadow-sm'
                            : 'bg-[#FAF7F2] border-[#E6E2EE] text-[#1E2430] hover:border-[#4BB38A]/40'
                        }`}
                      >
                        {prof.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pole Material & Base Hardware */}
                <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084] mb-1.5">
                      Pole Material Finish
                    </label>
                    <select
                      value={assembly.structure.poleMaterial}
                      onChange={(e) =>
                        updateStructure((prev) => ({
                          ...prev,
                          poleMaterial: e.target.value as PoleMaterialType,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] text-xs font-semibold text-[#1E2430]"
                    >
                      <option value="galvanized">Galvanized Zinc Steel</option>
                      <option value="aluminum">Brushed Anodized Aluminum</option>
                      <option value="weathered-steel">Weathered Dark Steel</option>
                      <option value="charcoal-coat">Charcoal Powdercoat</option>
                      <option value="dot-green">Highway Painted Green</option>
                      <option value="wood-cedar">Treated Cedar Wood</option>
                      <option value="concrete-grey">Precast Concrete / Grey</option>
                      <option value="corten-rust">Aged Corten Rust</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084] mb-1.5">
                      Foundation & Roadside Base
                    </label>
                    <select
                      value={assembly.structure.baseType}
                      onChange={(e) =>
                        updateStructure((prev) => ({
                          ...prev,
                          baseType: e.target.value as BaseType,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] text-xs font-semibold text-[#1E2430]"
                    >
                      <option value="bolted-flange">Concrete Pier + 4-Bolt Flange</option>
                      <option value="breakaway-slip">DOT Breakaway Slip-Base</option>
                      <option value="crash-barrels">Yellow Crash Attenuator Barrels</option>
                      <option value="guardrail">Highway W-Beam Guardrail</option>
                      <option value="direct-embed">Direct Ground Embedment</option>
                    </select>
                  </div>
                </div>

                {/* Structural Dimensions & Gantry Options */}
                <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                    Dimensions & Gantry Accessories
                  </label>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#647084]">Structure Height</span>
                      <span className="font-mono font-semibold text-[#1E2430]">
                        {assembly.structure.poleHeight.toFixed(2)}m
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2.6}
                      max={8.0}
                      step={0.1}
                      value={assembly.structure.poleHeight}
                      onChange={(e) =>
                        updateStructure((prev) => ({
                          ...prev,
                          poleHeight: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full pastel-slider"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#647084]">Pole Radius / Thickness</span>
                      <span className="font-mono font-semibold text-[#1E2430]">
                        {(assembly.structure.poleRadius * 100).toFixed(1)}cm
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.035}
                      max={0.22}
                      step={0.005}
                      value={assembly.structure.poleRadius}
                      onChange={(e) =>
                        updateStructure((prev) => ({
                          ...prev,
                          poleRadius: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full pastel-slider"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#647084]">Gantry / Post Span</span>
                      <span className="font-mono font-semibold text-[#1E2430]">
                        {assembly.structure.gantrySpan.toFixed(1)}m
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2.0}
                      max={14.0}
                      step={0.2}
                      value={assembly.structure.gantrySpan}
                      onChange={(e) =>
                        updateStructure((prev) => ({
                          ...prev,
                          gantrySpan: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full pastel-slider"
                    />
                  </div>

                  <div className="pt-2 border-t border-[#E6E2EE] space-y-2">
                    <label className="flex items-center justify-between text-xs cursor-pointer">
                      <span className="text-[#1E2430] font-medium">
                        3D Highway Road Diorama Pad
                      </span>
                      <input
                        type="checkbox"
                        checked={assembly.structure.showRoadBase}
                        onChange={(e) =>
                          updateStructure((prev) => ({
                            ...prev,
                            showRoadBase: e.target.checked,
                          }))
                        }
                        className="accent-[#7C83FD] w-4 h-4 rounded"
                      />
                    </label>
                    <label className="flex items-center justify-between text-xs cursor-pointer">
                      <span className="text-[#1E2430] font-medium">
                        Overhead Gantry Luminaires
                      </span>
                      <input
                        type="checkbox"
                        checked={assembly.structure.hasLuminaires}
                        onChange={(e) =>
                          updateStructure((prev) => ({
                            ...prev,
                            hasLuminaires: e.target.checked,
                          }))
                        }
                        className="accent-[#7C83FD] w-4 h-4 rounded"
                      />
                    </label>
                    <label className="flex items-center justify-between text-xs cursor-pointer">
                      <span className="text-[#1E2430] font-medium">
                        Gantry Maintenance Catwalk
                      </span>
                      <input
                        type="checkbox"
                        checked={assembly.structure.hasCatwalk}
                        onChange={(e) =>
                          updateStructure((prev) => ({
                            ...prev,
                            hasCatwalk: e.target.checked,
                          }))
                        }
                        className="accent-[#7C83FD] w-4 h-4 rounded"
                      />
                    </label>
                  </div>
                </div>

                {/* Environment Atmosphere Presets */}
                <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                    Environment & Lighting Backdrop
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {(
                      [
                        { id: 'pastel-studio', label: 'Pastel Cyclorama Studio' },
                        { id: 'desert-highway', label: 'Mojave Desert Highway' },
                        { id: 'sunset-expressway', label: 'Sunset Pink/Gold Dusk' },
                        { id: 'misty-autumn', label: 'Misty Autumn Foliage' },
                        { id: 'countryside-day', label: 'Countryside Blue Sky' },
                      ] as { id: EnvironmentPreset; label: string }[]
                    ).map((env) => (
                      <button
                        key={env.id}
                        onClick={() =>
                          setAssembly((prev) => ({
                            ...prev,
                            environment: env.id,
                          }))
                        }
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all flex items-center justify-between ${
                          assembly.environment === env.id
                            ? 'bg-[#F3EFFA] border-[#7C83FD] text-[#636BFA] font-bold'
                            : 'bg-[#FAF7F2] border-[#E6E2EE] text-[#1E2430]'
                        }`}
                      >
                        <span>{env.label}</span>
                        {assembly.environment === env.id && (
                          <Check className="w-3.5 h-3.5 text-[#7C83FD]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT DOCK: ACTIVE SIGN PANEL INSPECTOR */}
        {selectedSign && (
          <aside className="w-80 sm:w-[370px] pointer-events-auto flex flex-col rounded-3xl bg-[#FAF7F2]/90 backdrop-blur-xl border border-[#E5E0F0] shadow-xl shadow-[#1E2430]/5 overflow-hidden">
            {/* Active Sign Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#F3EFFA] via-[#FAF7F2] to-[#FDF1EC] border-b border-[#E6E2EE] flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#636BFA]">
                  Editing Selected Sign
                </span>
                <input
                  type="text"
                  value={selectedSign.name}
                  onChange={(e) =>
                    updateSelectedSign((s) => ({ ...s, name: e.target.value }))
                  }
                  className="block w-full bg-transparent font-bold text-sm text-[#1E2430] focus:outline-none focus:underline truncate"
                />
              </div>
              <span
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border shadow-sm"
                style={{
                  backgroundColor: selectedSign.bgColor,
                  borderColor: selectedSign.borderColor,
                  color: selectedSign.textColor,
                }}
              >
                {selectedSign.width.toFixed(1)}×{selectedSign.height.toFixed(1)}m
              </span>
            </div>

            {/* 4 Inspector Sub-Tabs */}
            <div className="p-1.5 bg-[#F3EFFA]/60 border-b border-[#E6E2EE] grid grid-cols-4 gap-1">
              {(
                [
                  { id: 'shape', label: 'Shape', icon: Box },
                  { id: 'typography', label: 'Fonts', icon: Type },
                  { id: 'graphics', label: 'Graphics', icon: Shield },
                  { id: 'mount', label: 'Mount', icon: Sliders },
                ] as { id: RightTab; label: string; icon: React.FC<{ className?: string }> }[]
              ).map((tab) => {
                const Icon = tab.icon;
                const active = rightTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setRightTab(tab.id)}
                    className={`py-2 px-1.5 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                      active
                        ? 'bg-white text-[#636BFA] shadow-sm border border-[#E6E2EE]'
                        : 'text-[#647084] hover:text-[#1E2430]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Inspector Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {rightTab === 'shape' && (
                <>
                  {/* 11 Authentic Sign Shapes */}
                  <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-2.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                      Sign Geometry & Cutout Shape
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(
                        [
                          { id: 'rounded-rect', label: 'Rounded Rectangle' },
                          { id: 'diamond', label: 'Warning Diamond' },
                          { id: 'interstate-shield', label: 'Interstate Shield' },
                          { id: 'us-route-shield', label: 'US Route Shield' },
                          { id: 'triangle-up', label: 'Euro Warning △' },
                          { id: 'triangle-down', label: 'Yield Inverted ▽' },
                          { id: 'octagon', label: 'Stop Octagon' },
                          { id: 'circle', label: 'Regulatory Circle' },
                          { id: 'pentagon', label: 'School Pentagon' },
                          { id: 'pennant', label: 'No-Pass Pennant' },
                        ] as { id: SignShape; label: string }[]
                      ).map((sh) => (
                        <button
                          key={sh.id}
                          onClick={() =>
                            updateSelectedSign((s) => ({ ...s, shape: sh.id }))
                          }
                          className={`px-2.5 py-2 rounded-xl text-xs font-semibold text-left border transition-all ${
                            selectedSign.shape === sh.id
                              ? 'bg-[#F3EFFA] border-[#7C83FD] text-[#636BFA] font-bold shadow-sm'
                              : 'bg-[#FAF7F2] border-[#E6E2EE] text-[#1E2430] hover:border-[#7C83FD]/40'
                          }`}
                        >
                          {sh.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                      Sign Dimensions & Bevel
                    </label>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#647084]">Panel Width</span>
                        <span className="font-mono font-semibold">
                          {selectedSign.width.toFixed(2)}m
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.45}
                        max={5.6}
                        step={0.05}
                        value={selectedSign.width}
                        onChange={(e) =>
                          updateSelectedSign((s) => ({
                            ...s,
                            width: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full pastel-slider"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#647084]">Panel Height</span>
                        <span className="font-mono font-semibold">
                          {selectedSign.height.toFixed(2)}m
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.35}
                        max={3.2}
                        step={0.05}
                        value={selectedSign.height}
                        onChange={(e) =>
                          updateSelectedSign((s) => ({
                            ...s,
                            height: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full pastel-slider"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#647084]">Corner Radius</span>
                          <span className="font-mono font-semibold">
                            {selectedSign.cornerRadius.toFixed(2)}m
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0.01}
                          max={0.28}
                          step={0.01}
                          value={selectedSign.cornerRadius}
                          onChange={(e) =>
                            updateSelectedSign((s) => ({
                              ...s,
                              cornerRadius: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full pastel-slider"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#647084]">Border Width</span>
                          <span className="font-mono font-semibold">
                            {(selectedSign.borderWidth * 100).toFixed(1)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={0.12}
                          step={0.005}
                          value={selectedSign.borderWidth}
                          onChange={(e) =>
                            updateSelectedSign((s) => ({
                              ...s,
                              borderWidth: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full pastel-slider"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Official Color Palettes & Custom Hex */}
                  <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                      Standard MUTCD / International Colorway
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {COLOR_PRESETS.map((cp) => (
                        <button
                          key={cp.id}
                          onClick={() =>
                            updateSelectedSign((s) => ({
                              ...s,
                              colorPreset: cp.id,
                              bgColor: cp.bgColor,
                              borderColor: cp.borderColor,
                              textColor: cp.textColor,
                              accentColor: cp.accentColor,
                            }))
                          }
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            selectedSign.colorPreset === cp.id
                              ? 'border-[#7C83FD] bg-[#F3EFFA] ring-1 ring-[#7C83FD]/30'
                              : 'border-[#E6E2EE] bg-[#FAF7F2] hover:border-[#7C83FD]/40'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-lg shrink-0 border-2 shadow-sm"
                            style={{
                              backgroundColor: cp.bgColor,
                              borderColor: cp.borderColor,
                            }}
                          />
                          <span className="text-[11px] font-semibold text-[#1E2430] truncate">
                            {cp.name}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Color Pickers */}
                    <div className="pt-2 border-t border-[#E6E2EE] grid grid-cols-4 gap-2 text-center">
                      {[
                        { key: 'bgColor' as const, label: 'Surface' },
                        { key: 'borderColor' as const, label: 'Border' },
                        { key: 'textColor' as const, label: 'Legend' },
                        { key: 'accentColor' as const, label: 'Crown' },
                      ].map((col) => (
                        <label
                          key={col.key}
                          className="flex flex-col items-center gap-1 cursor-pointer p-1.5 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE]"
                        >
                          <input
                            type="color"
                            value={selectedSign[col.key]}
                            onChange={(e) =>
                              updateSelectedSign((s) => ({
                                ...s,
                                colorPreset: 'custom',
                                [col.key]: e.target.value,
                              }))
                            }
                            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                          />
                          <span className="text-[10px] font-semibold text-[#647084]">
                            {col.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Retroreflective Sheeting & Face Bolts */}
                  <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                      Retroreflective Sheeting & Hardware
                    </label>
                    <select
                      value={selectedSign.sheetingType}
                      onChange={(e) =>
                        updateSelectedSign((s) => ({
                          ...s,
                          sheetingType: e.target.value as SheetingType,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] text-xs font-semibold text-[#1E2430]"
                    >
                      <option value="diamond-cubed">
                        Type XI Diamond Grade Cubed (Prismatic Grid)
                      </option>
                      <option value="high-intensity">
                        Type IV High-Intensity Prismatic (Honeycomb)
                      </option>
                      <option value="engineer-grade">
                        Type I Engineer Grade (Glass Bead Sheen)
                      </option>
                      <option value="matte-enamel">
                        Vintage Matte Baked Enamel
                      </option>
                    </select>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#647084]">Weathering & Dirt</span>
                        <span className="font-mono font-semibold">
                          {Math.round(selectedSign.wearAmount * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={0.85}
                        step={0.02}
                        value={selectedSign.wearAmount}
                        onChange={(e) =>
                          updateSelectedSign((s) => ({
                            ...s,
                            wearAmount: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full pastel-slider"
                      />
                    </div>

                    <label className="flex items-center justify-between text-xs cursor-pointer pt-1">
                      <span className="text-[#1E2430] font-medium">
                        3D Front Face Mounting Hex Bolts
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedSign.showFaceBolts}
                        onChange={(e) =>
                          updateSelectedSign((s) => ({
                            ...s,
                            showFaceBolts: e.target.checked,
                          }))
                        }
                        className="accent-[#7C83FD] w-4 h-4 rounded"
                      />
                    </label>
                  </div>
                </>
              )}

              {rightTab === 'typography' && (
                <>
                  {/* Authentic Road Sign Fonts Selector */}
                  <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                        Real-World Highway Font Family
                      </label>
                      <span className="text-[10px] font-semibold text-[#636BFA] bg-[#F3EFFA] px-2 py-0.5 rounded-full">
                        9 Standards
                      </span>
                    </div>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {FONT_OPTIONS.map((f) => {
                        const active = selectedSign.fontFamily === f.id;
                        return (
                          <button
                            key={f.id}
                            onClick={() =>
                              updateSelectedSign((s) => ({
                                ...s,
                                fontFamily: f.id,
                              }))
                            }
                            className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                              active
                                ? 'bg-[#F3EFFA] border-[#7C83FD] ring-1 ring-[#7C83FD]/30'
                                : 'bg-[#FAF7F2] border-[#E6E2EE] hover:border-[#7C83FD]/40'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#1E2430]">
                                {f.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#636BFA] border border-[#E6E2EE]">
                                {f.region}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#647084] mt-0.5 leading-snug">
                              {f.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shield / Crown Header & Sub-Header */}
                  <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-2.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                      Crown / Shield Header Text
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-[#647084] block mb-1">
                          Header (e.g. INTERSTATE / NORTH)
                        </span>
                        <input
                          type="text"
                          value={selectedSign.headerText}
                          onChange={(e) =>
                            updateSelectedSign((s) => ({
                              ...s,
                              headerText: e.target.value,
                            }))
                          }
                          placeholder="None"
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#647084] block mb-1">
                          Sub-Header (e.g. MICHIGAN / U S)
                        </span>
                        <input
                          type="text"
                          value={selectedSign.subHeaderText}
                          onChange={(e) =>
                            updateSelectedSign((s) => ({
                              ...s,
                              subHeaderText: e.target.value,
                            }))
                          }
                          placeholder="None"
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Multi-Line Text Lines Editor */}
                  <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                        Sign Legend Lines ({selectedSign.lines.length})
                      </label>
                      <button
                        onClick={() =>
                          updateSelectedSign((s) => ({
                            ...s,
                            lines: [
                              ...s.lines,
                              {
                                id: `line-${Date.now()}`,
                                text: 'NEXT EXIT',
                                fontSize: 68,
                                letterSpacing: 2,
                                align: 'center',
                              },
                            ],
                          }))
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#EAF7F1] hover:bg-[#D5EFE3] text-[#2F8564] text-[11px] font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Line
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {selectedSign.lines.map((line, idx) => (
                        <div
                          key={line.id}
                          className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] space-y-2"
                        >
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={line.text}
                              onChange={(e) =>
                                updateSelectedSign((s) => ({
                                  ...s,
                                  lines: s.lines.map((l, i) =>
                                    i === idx ? { ...l, text: e.target.value } : l
                                  ),
                                }))
                              }
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#E6E2EE] text-xs font-bold text-[#1E2430]"
                            />
                            <button
                              onClick={() =>
                                updateSelectedSign((s) => ({
                                  ...s,
                                  lines: s.lines.filter((_, i) => i !== idx),
                                }))
                              }
                              className="p-1.5 rounded-lg text-[#647084] hover:text-[#E11D48] hover:bg-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <div className="flex justify-between text-[#647084]">
                                <span>Size</span>
                                <span className="font-mono">{line.fontSize}%</span>
                              </div>
                              <input
                                type="range"
                                min={24}
                                max={200}
                                value={line.fontSize}
                                onChange={(e) =>
                                  updateSelectedSign((s) => ({
                                    ...s,
                                    lines: s.lines.map((l, i) =>
                                      i === idx
                                        ? { ...l, fontSize: parseInt(e.target.value) }
                                        : l
                                    ),
                                  }))
                                }
                                className="w-full pastel-slider"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-[#647084]">
                                <span>Tracking</span>
                                <span className="font-mono">{line.letterSpacing}px</span>
                              </div>
                              <input
                                type="range"
                                min={-2}
                                max={18}
                                value={line.letterSpacing}
                                onChange={(e) =>
                                  updateSelectedSign((s) => ({
                                    ...s,
                                    lines: s.lines.map((l, i) =>
                                      i === idx
                                        ? {
                                            ...l,
                                            letterSpacing: parseInt(e.target.value),
                                          }
                                        : l
                                    ),
                                  }))
                                }
                                className="w-full pastel-slider"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Panel Divider Line */}
                    <div className="pt-2 border-t border-[#E6E2EE]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#647084] block mb-1">
                        Panel Divider Line
                      </span>
                      <select
                        value={selectedSign.dividerLine}
                        onChange={(e) =>
                          updateSelectedSign((s) => ({
                            ...s,
                            dividerLine: e.target.value as SignPanelConfig['dividerLine'],
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] text-xs font-semibold"
                      >
                        <option value="none">No Divider Line</option>
                        <option value="horizontal-middle">Horizontal Center Split</option>
                        <option value="header-split">Top Header Split Line</option>
                        <option value="vertical-split">Vertical Autobahn Split</option>
                      </select>
                    </div>
                  </div>

                  {/* Top Attached Exit Tab Plaque */}
                  <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-2.5">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                        Top Exit Tab Plaque (e.g. EXIT 4)
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedSign.exitTab.enabled}
                        onChange={(e) =>
                          updateSelectedSign((s) => ({
                            ...s,
                            exitTab: { ...s.exitTab, enabled: e.target.checked },
                          }))
                        }
                        className="accent-[#7C83FD] w-4 h-4 rounded"
                      />
                    </label>
                    {selectedSign.exitTab.enabled && (
                      <div className="space-y-2.5 pt-1">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={selectedSign.exitTab.text}
                            onChange={(e) =>
                              updateSelectedSign((s) => ({
                                ...s,
                                exitTab: { ...s.exitTab, text: e.target.value },
                              }))
                            }
                            placeholder="EXIT 5"
                            className="px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] text-xs font-bold"
                          />
                          <select
                            value={selectedSign.exitTab.align}
                            onChange={(e) =>
                              updateSelectedSign((s) => ({
                                ...s,
                                exitTab: {
                                  ...s.exitTab,
                                  align: e.target.value as 'left' | 'center' | 'right',
                                },
                              }))
                            }
                            className="px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] text-xs font-semibold"
                          >
                            <option value="left">Left Aligned</option>
                            <option value="center">Centered</option>
                            <option value="right">Right Aligned</option>
                          </select>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] text-[#647084] mb-1">
                            <span>Plaque Width Ratio</span>
                            <span className="font-mono font-semibold text-[#1E2430]">
                              {Math.round(Math.min(0.65, Math.max(0.32, selectedSign.exitTab.widthRatio || 0.42)) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0.32}
                            max={0.65}
                            step={0.02}
                            value={Math.min(0.65, Math.max(0.32, selectedSign.exitTab.widthRatio || 0.42))}
                            onChange={(e) =>
                              updateSelectedSign((s) => ({
                                ...s,
                                exitTab: {
                                  ...s.exitTab,
                                  widthRatio: parseFloat(e.target.value),
                                },
                              }))
                            }
                            className="w-full pastel-slider"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {rightTab === 'graphics' && (
                <>
                  {/* Embedded Route Shields & Highway Badges */}
                  <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                        Embedded Route Shields ({selectedSign.badges.length})
                      </label>
                      <button
                        onClick={() =>
                          updateSelectedSign((s) => ({
                            ...s,
                            badges: [
                              ...s.badges,
                              {
                                id: `badge-${Date.now()}`,
                                type: 'interstate',
                                number: '16',
                                header: 'INTERSTATE',
                              },
                            ],
                          }))
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#F3EFFA] hover:bg-[#E4DCF9] text-[#636BFA] text-[11px] font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Shield
                      </button>
                    </div>

                    {selectedSign.badges.map((b, idx) => (
                      <div
                        key={b.id}
                        className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] space-y-2"
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <select
                            value={b.type}
                            onChange={(e) =>
                              updateSelectedSign((s) => ({
                                ...s,
                                badges: s.badges.map((item, i) =>
                                  i === idx
                                    ? { ...item, type: e.target.value as BadgeType }
                                    : item
                                ),
                              }))
                            }
                            className="flex-1 px-2 py-1 rounded-lg bg-white border border-[#E6E2EE] text-xs font-semibold"
                          >
                            <option value="interstate">US Interstate Shield</option>
                            <option value="us-route">US Route Shield</option>
                            <option value="business-loop">Business Loop Green</option>
                            <option value="arkansas-shield">State Box Shield</option>
                            <option value="jp-expressway">Japan Expressway [C3]</option>
                            <option value="autobahn-hex">German Autobahn Hex [4]</option>
                          </select>
                          <input
                            type="text"
                            value={b.number}
                            onChange={(e) =>
                              updateSelectedSign((s) => ({
                                ...s,
                                badges: s.badges.map((item, i) =>
                                  i === idx ? { ...item, number: e.target.value } : item
                                ),
                              }))
                            }
                            placeholder="80"
                            className="w-16 px-2 py-1 rounded-lg bg-white border border-[#E6E2EE] text-xs font-bold text-center"
                          />
                          <button
                            onClick={() =>
                              updateSelectedSign((s) => ({
                                ...s,
                                badges: s.badges.filter((_, i) => i !== idx),
                              }))
                            }
                            className="p-1 text-[#647084] hover:text-[#E11D48]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            value={b.header || ''}
                            onChange={(e) =>
                              updateSelectedSign((s) => ({
                                ...s,
                                badges: s.badges.map((item, i) =>
                                  i === idx ? { ...item, header: e.target.value } : item
                                ),
                              }))
                            }
                            placeholder="Crown / JP Name"
                            className="px-2 py-1 rounded-lg bg-white border border-[#E6E2EE] text-[11px]"
                          />
                          <input
                            type="text"
                            value={b.direction || ''}
                            onChange={(e) =>
                              updateSelectedSign((s) => ({
                                ...s,
                                badges: s.badges.map((item, i) =>
                                  i === idx
                                    ? { ...item, direction: e.target.value }
                                    : item
                                ),
                              }))
                            }
                            placeholder="Dir (e.g. NORTH)"
                            className="px-2 py-1 rounded-lg bg-white border border-[#E6E2EE] text-[11px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Directional & Highway Arrows */}
                  <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                      Directional & Warning Arrows
                    </label>
                    <select
                      value={selectedSign.arrowType}
                      onChange={(e) =>
                        updateSelectedSign((s) => ({
                          ...s,
                          arrowType: e.target.value as ArrowType,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] text-xs font-semibold text-[#1E2430]"
                    >
                      <option value="none">No Arrow</option>
                      <option value="up">↑ Straight Up Arrow</option>
                      <option value="down">↓ Lane Drop Down Arrow</option>
                      <option value="left">← Left Arrow</option>
                      <option value="right">→ Right Arrow</option>
                      <option value="up-right">↗ Exit Up-Right Diagonal</option>
                      <option value="up-left">↖ Exit Up-Left Diagonal</option>
                      <option value="down-left">↙ Entrance Down-Left</option>
                      <option value="down-right">↘ Entrance Down-Right</option>
                      <option value="turn-left-90">↰ 90° Sharp Left Curve</option>
                      <option value="turn-right-90">↱ 90° Sharp Right Curve</option>
                      <option value="advance-left">↰ Advance Left Turn Plaque</option>
                      <option value="advance-right">↱ Advance Right Turn Plaque</option>
                      <option value="s-curve-left">⤾ Winding S-Curve Arrow</option>
                      <option value="autobahn-fork">↑↗ German Autobahn Fork</option>
                      <option value="one-way-right">⇒ One-Way Full Box Right</option>
                      <option value="one-way-left">⇐ One-Way Full Box Left</option>
                      <option value="u-turn">↶ U-Turn Arrow</option>
                    </select>

                    {selectedSign.arrowType !== 'none' && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-[10px] text-[#647084] block mb-1">
                            Placement
                          </span>
                          <select
                            value={selectedSign.arrowPosition}
                            onChange={(e) =>
                              updateSelectedSign((s) => ({
                                ...s,
                                arrowPosition:
                                  e.target.value as SignPanelConfig['arrowPosition'],
                              }))
                            }
                            className="w-full px-2 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E6E2EE] text-xs font-semibold"
                          >
                            <option value="bottom">Bottom</option>
                            <option value="top">Top</option>
                            <option value="left">Left Side</option>
                            <option value="right">Right Side</option>
                            <option value="center">Center Full</option>
                            <option value="background-box">One-Way Background</option>
                          </select>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] text-[#647084] mb-1">
                            <span>Arrow Scale</span>
                            <span className="font-mono">
                              {Math.round(selectedSign.arrowScale * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0.5}
                            max={1.6}
                            step={0.05}
                            value={selectedSign.arrowScale}
                            onChange={(e) =>
                              updateSelectedSign((s) => ({
                                ...s,
                                arrowScale: parseFloat(e.target.value),
                              }))
                            }
                            className="w-full pastel-slider mt-1.5"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Real Road Sign Pictograms & Custom Upload */}
                  <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                      Official Road Sign Pictogram / Graphic
                    </label>
                    <select
                      value={selectedSign.pictogramType}
                      onChange={(e) =>
                        updateSelectedSign((s) => ({
                          ...s,
                          pictogramType: e.target.value as PictogramType,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] text-xs font-semibold text-[#1E2430]"
                    >
                      <option value="none">No Pictogram</option>
                      <option value="t-junction-right">├ Side Road Junction Right (UK/EU)</option>
                      <option value="t-junction-left">┤ Side Road Junction Left</option>
                      <option value="crossroads">+ Four-Way Crossroads</option>
                      <option value="y-junction">Y-Intersection Fork</option>
                      <option value="merge">Highway Traffic Merge</option>
                      <option value="roundabout">↻ Roundabout Circle</option>
                      <option value="pedestrian">🚶 Pedestrian Crossing</option>
                      <option value="deer">🦌 Deer / Wildlife Crossing</option>
                      <option value="slippery">🚗 Slippery When Wet</option>
                      <option value="roadwork">🚧 Road Work Ahead</option>
                      <option value="bicycle">🚲 Bicycle Route / Crossing</option>
                      <option value="airport">✈️ Airport / Low Flying Plane</option>
                      <option value="gas">⛽ Motorist Gas Station</option>
                      <option value="food">🍴 Motorist Food & Dining</option>
                      <option value="lodging">🛏️ Motorist Lodging</option>
                      <option value="hospital">🏥 Hospital (H)</option>
                      <option value="parking">🅿️ Public Parking (P)</option>
                      <option value="no-entry">⛔ No Entry Horizontal Bar</option>
                      <option value="steep-grade">🚛 Steep Truck Grade</option>
                      <option value="custom-upload">🖼️ Custom Uploaded Graphic</option>
                    </select>

                    {/* Custom Image Upload Button */}
                    <label className="w-full py-2 px-3 rounded-xl bg-[#FDF1EC] hover:bg-[#FCE3D9] text-[#C2410C] border border-[#F9D0C0] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Custom Graphic (PNG / SVG / JPG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCustomGraphicUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </>
              )}

              {rightTab === 'mount' && (
                <div className="bg-white/90 p-3.5 rounded-2xl border border-[#E6E2EE] space-y-3.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#647084]">
                    3D Placement & Mounting Slot
                  </label>

                  <div>
                    <span className="text-xs text-[#647084] block mb-1">
                      Structural Mount Zone
                    </span>
                    <select
                      value={selectedSign.mountSlot}
                      onChange={(e) =>
                        updateSelectedSign((s) => ({
                          ...s,
                          mountSlot: e.target.value as MountSlot,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6E2EE] text-xs font-semibold"
                    >
                      <option value="center">Center Post / Spine</option>
                      <option value="left-arm">Left Cross-Arm Branch</option>
                      <option value="right-arm">Right Cross-Arm Branch</option>
                      <option value="gantry-left">Overhead Gantry Left Lane</option>
                      <option value="gantry-center">Overhead Gantry Center Lane</option>
                      <option value="gantry-right">Overhead Gantry Right Lane</option>
                    </select>
                  </div>

                  {[
                    {
                      label: 'Horizontal Offset (X)',
                      key: 'xOffset' as const,
                      min: -4.5,
                      max: 4.5,
                      step: 0.05,
                      unit: 'm',
                    },
                    {
                      label: 'Vertical Offset (Y)',
                      key: 'yOffset' as const,
                      min: -2.6,
                      max: 2.6,
                      step: 0.05,
                      unit: 'm',
                    },
                    {
                      label: 'Depth Offset (Z)',
                      key: 'zOffset' as const,
                      min: -0.4,
                      max: 0.6,
                      step: 0.02,
                      unit: 'm',
                    },
                    {
                      label: 'Sign Tilt Angle',
                      key: 'rotationZ' as const,
                      min: -25,
                      max: 25,
                      step: 1,
                      unit: '°',
                    },
                    {
                      label: 'Uniform Scale',
                      key: 'scale' as const,
                      min: 0.5,
                      max: 1.75,
                      step: 0.05,
                      unit: '×',
                    },
                  ].map((ctrl) => (
                    <div key={ctrl.key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#647084]">{ctrl.label}</span>
                        <span className="font-mono font-semibold text-[#1E2430]">
                          {selectedSign[ctrl.key]}
                          {ctrl.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={ctrl.min}
                        max={ctrl.max}
                        step={ctrl.step}
                        value={selectedSign[ctrl.key]}
                        onChange={(e) =>
                          updateSelectedSign((s) => ({
                            ...s,
                            [ctrl.key]: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full pastel-slider"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* BOTTOM FLOATING CAMERA VIEW ANGLES & VIEWPORT HUD */}
      <footer className="relative z-20 mx-4 mb-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Telemetry Badge */}
        <div className="pointer-events-auto px-3.5 py-2 rounded-2xl bg-[#FAF7F2]/88 backdrop-blur-xl border border-[#E5E0F0] shadow-lg flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4BB38A] animate-pulse" />
            <span className="font-bold text-[#1E2430]">
              {compareAllLods ? 'LOD 0 / 1 / 2 Compare' : `LOD ${activeLod} Active`}
            </span>
          </div>
          <span className="text-[#E6E2EE]">|</span>
          <span className="font-mono text-[11px] text-[#647084]">
            <strong className="text-[#1E2430]">{metrics.activeTris.toLocaleString()}</strong> tris •{' '}
            <strong className="text-[#1E2430]">{metrics.activeVerts.toLocaleString()}</strong> verts
          </span>
        </div>

        {/* Center Smooth View Angle Camera Bar */}
        <div className="pointer-events-auto px-2 py-1.5 rounded-2xl bg-[#FAF7F2]/92 backdrop-blur-xl border border-[#E5E0F0] shadow-lg flex items-center gap-1">
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#647084] flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-[#7C83FD]" />
            <span className="hidden md:inline">View Angles</span>
          </span>
          {(
            [
              { id: 'studio-34', label: '3/4 Studio' },
              { id: 'front-ortho', label: 'Front Face' },
              { id: 'driver-pov', label: 'Driver POV' },
              { id: 'low-hero', label: 'Hero Angle' },
              { id: 'rear-hardware', label: 'Rear Hardware' },
              { id: 'top-plan', label: 'Top Plan' },
            ] as { id: CameraViewPreset; label: string }[]
          ).map((cam) => {
            const active = cameraPreset === cam.id;
            return (
              <button
                key={cam.id}
                onClick={() => {
                  setCameraPreset(cam.id);
                  setCameraTriggerCount((c) => c + 1);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#7C83FD] text-white shadow-sm'
                    : 'text-[#647084] hover:text-[#1E2430] hover:bg-white/70'
                }`}
              >
                {cam.label}
              </button>
            );
          })}
        </div>

        {/* Right Viewport Helpers (Turntable & Wireframe) */}
        <div className="pointer-events-auto px-2 py-1.5 rounded-2xl bg-[#FAF7F2]/88 backdrop-blur-xl border border-[#E5E0F0] shadow-lg flex items-center gap-1.5">
          <button
            onClick={() => setAutoRotate((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              autoRotate
                ? 'bg-[#EAF7F1] text-[#2F8564] border border-[#4BB38A]/40'
                : 'text-[#647084] hover:text-[#1E2430]'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>Turntable</span>
          </button>
          <button
            onClick={() => setWireframe((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              wireframe
                ? 'bg-[#F3EFFA] text-[#636BFA] border border-[#7C83FD]/40'
                : 'text-[#647084] hover:text-[#1E2430]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Wireframe</span>
          </button>
        </div>
      </footer>

      {/* MODALS */}
      <ExportModal
        isOpen={isExportOpen}
        assembly={assembly}
        activeLod={activeLod}
        metrics={metrics}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
export default App;
