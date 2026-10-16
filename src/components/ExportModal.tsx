import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  Download,
  Box,
  FileCode2,
  Image as ImageIcon,
  Layers,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { LODLevel, RoadSignAssembly } from '../types/sign';
import {
  ExportFormat,
  ExportLODTarget,
  exportRoadSignModel,
} from '../utils/exporters';

interface ExportModalProps {
  isOpen: boolean;
  assembly: RoadSignAssembly;
  activeLod: LODLevel;
  metrics: {
    lod0Tris: number;
    lod1Tris: number;
    lod2Tris: number;
    activeVerts: number;
    activeTris: number;
  };
  onClose: () => void;
}

const FORMAT_CARDS: {
  id: ExportFormat;
  name: string;
  ext: string;
  badge: string;
  desc: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'glb',
    name: 'Binary glTF 2.0',
    ext: '.GLB',
    badge: 'Recommended 3D',
    desc: 'Self-contained binary 3D model with embedded PBR textures, retroreflective materials, and full hierarchy for Blender, Unity, Unreal & Web.',
    icon: Box,
  },
  {
    id: 'gltf',
    name: 'Standard glTF JSON',
    ext: '.GLTF',
    badge: 'Editable Scene',
    desc: 'Human-readable JSON glTF 2.0 3D asset with embedded Base64 sign textures and node hierarchy.',
    icon: FileCode2,
  },
  {
    id: 'obj',
    name: 'Wavefront 3D Mesh',
    ext: '.OBJ',
    badge: 'Universal CAD',
    desc: 'Universal polygon mesh geometry compatible with Maya, 3ds Max, Cinema 4D, Rhino, and ZBrush.',
    icon: Layers,
  },
  {
    id: 'stl',
    name: 'Stereolithography CAD',
    ext: '.STL',
    badge: '3D Print Ready',
    desc: 'Watertight binary triangle mesh ready for 3D printing slicers (Bambu Studio, PrusaSlicer, Cura) and CAD.',
    icon: Cpu,
  },
  {
    id: 'png',
    name: 'High-Res Sign Texture Sheet',
    ext: '.PNG',
    badge: '2D Graphics',
    desc: 'Crisp high-resolution 2D road sign face graphics with authentic typography, shields, arrows, and borders.',
    icon: ImageIcon,
  },
  {
    id: 'json',
    name: 'SignCraft Blueprint & Seed',
    ext: '.JSON',
    badge: 'Parametric Data',
    desc: 'Save or share the exact seed, support structure, and multi-sign assembly parameters.',
    icon: FileCode2,
  },
];

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  assembly,
  activeLod,
  metrics,
  onClose,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('glb');
  const [selectedLod, setSelectedLod] = useState<ExportLODTarget>(activeLod);
  const [isExporting, setIsExporting] = useState(false);
  const [lastExportedFile, setLastExportedFile] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsExporting(true);
    setLastExportedFile(null);
    try {
      const filename = await exportRoadSignModel(
        assembly,
        selectedFormat,
        selectedLod
      );
      setLastExportedFile(filename);
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#7C83FD', '#FF8B7B', '#4BB38A', '#F6C85F', '#B085F5'],
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2430]/35 backdrop-blur-md p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className="w-full max-w-3xl rounded-3xl bg-[#FAF7F2] border border-[#E5E0F0] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-7 py-5 bg-gradient-to-r from-[#EAF7F1] via-[#FAF7F2] to-[#F3EFFA] border-b border-[#E6E2EE] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#4BB38A]/15 text-[#389B74] flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1E2430] tracking-tight">
                    Export 3D Road Sign Model & LODs
                  </h2>
                  <p className="text-xs text-[#647084]">
                    Seed <span className="font-mono font-semibold text-[#1E2430]">{assembly.seed}</span> •{' '}
                    {assembly.signs.length} Sign{assembly.signs.length === 1 ? '' : 's'} on{' '}
                    <span className="font-medium text-[#1E2430]">{assembly.structure.structureType}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/80 hover:bg-white text-[#647084] hover:text-[#1E2430] border border-[#E6E2EE] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Step 1: Select LOD Level */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#647084]">
                    1. Choose Level of Detail (LOD)
                  </label>
                  <span className="text-[11px] font-mono text-[#7C83FD] bg-[#F3EFFA] px-2.5 py-0.5 rounded-full">
                    Real-time procedural decimation
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      level: 0 as ExportLODTarget,
                      title: 'LOD 0 • High',
                      tris: `${metrics.lod0Tris.toLocaleString()} tris`,
                      res: '2048px Tex',
                      sub: '3D bolts, bevels, full truss & clamps',
                      color: 'bg-[#F3EFFA] border-[#7C83FD]',
                    },
                    {
                      level: 1 as ExportLODTarget,
                      title: 'LOD 1 • Medium',
                      tris: `${metrics.lod1Tris.toLocaleString()} tris`,
                      res: '1024px Tex',
                      sub: 'Baked bolts, 12-seg post, game ready',
                      color: 'bg-[#EAF7F1] border-[#4BB38A]',
                    },
                    {
                      level: 2 as ExportLODTarget,
                      title: 'LOD 2 • Low',
                      tris: `${metrics.lod2Tris.toLocaleString()} tris`,
                      res: '512px Tex',
                      sub: '6-seg post, merged brackets, distant',
                      color: 'bg-[#FDF1EC] border-[#FF8B7B]',
                    },
                    {
                      level: 'all-lods' as ExportLODTarget,
                      title: 'All 3 LODs Pack',
                      tris: `${(metrics.lod0Tris + metrics.lod1Tris + metrics.lod2Tris).toLocaleString()} tris`,
                      res: 'Multi-LOD Scene',
                      sub: 'Exports LOD0 + LOD1 + LOD2 together',
                      color: 'bg-[#FEF9E7] border-[#EAB308]',
                    },
                  ].map((item) => {
                    const active = selectedLod === item.level;
                    return (
                      <button
                        key={String(item.level)}
                        onClick={() => setSelectedLod(item.level)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          active
                            ? `${item.color} ring-2 ring-[#7C83FD]/30 shadow-sm`
                            : 'bg-white border-[#E6E2EE] hover:border-[#7C83FD]/50'
                        }`}
                      >
                        <div className="font-bold text-xs text-[#1E2430] flex items-center justify-between">
                          {item.title}
                          {active && <span className="w-2 h-2 rounded-full bg-[#7C83FD]" />}
                        </div>
                        <div className="mt-1 font-mono text-xs font-semibold text-[#636BFA]">
                          {item.tris}
                        </div>
                        <div className="text-[10px] font-mono text-[#647084]">{item.res}</div>
                        <div className="mt-1.5 text-[11px] text-[#647084] leading-tight">
                          {item.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select File Format */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#647084] mb-2.5">
                  2. Choose Download Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FORMAT_CARDS.map((fmt) => {
                    const Icon = fmt.icon;
                    const active = selectedFormat === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        onClick={() => setSelectedFormat(fmt.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                          active
                            ? 'bg-[#F3EFFA]/90 border-[#7C83FD] ring-2 ring-[#7C83FD]/25 shadow-sm'
                            : 'bg-white border-[#E6E2EE] hover:border-[#7C83FD]/50'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                            active
                              ? 'bg-[#7C83FD] text-white'
                              : 'bg-[#FAF7F2] text-[#636BFA] border border-[#E6E2EE]'
                          }`}
                        >
                          {fmt.ext}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#1E2430]">{fmt.name}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-[#636BFA] border border-[#E6E2EE]">
                              {fmt.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#647084] mt-1 leading-relaxed">
                            {fmt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {lastExportedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-[#EAF7F1] border border-[#4BB38A]/40 flex items-center gap-3 text-xs text-[#1E2430]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#389B74] shrink-0" />
                  <span>
                    Downloaded <strong className="font-mono">{lastExportedFile}</strong>! Ready for import into your 3D engine or slicer.
                  </span>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-7 py-4 bg-white border-t border-[#E6E2EE] flex items-center justify-between">
              <div className="text-xs text-[#647084]">
                Target:{' '}
                <strong className="text-[#1E2430] uppercase">{selectedFormat}</strong> •{' '}
                <strong className="text-[#636BFA]">
                  {selectedLod === 'all-lods' ? 'LOD 0 + LOD 1 + LOD 2 Bundle' : `LOD ${selectedLod}`}
                </strong>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#647084] hover:text-[#1E2430] hover:bg-[#FAF7F2] transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C83FD] to-[#636BFA] hover:from-[#6A72FB] hover:to-[#525AF8] text-white text-xs font-bold shadow-md shadow-[#7C83FD]/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isExporting
                    ? 'Generating 3D Mesh...'
                    : `Download .${selectedFormat.toUpperCase()}`}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
