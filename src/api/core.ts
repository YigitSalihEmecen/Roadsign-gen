/**
 * The generator without the exporters or any DOM beyond a 2D canvas: what a
 * host (a game, a simulator) imports. `npm run build:lib` bundles it to
 * `lib/roadsign.js`, plain ESM with `three` left as a bare import.
 */
import { RoadSignAssembly, SignPanelConfig, StructureConfig } from '../types/sign';
import { createDefaultSignPanel, COLOR_PRESETS } from '../data/presets';
import { generateSignAssemblyFromSeed, createRandomSeedCode, SeededRNG } from '../utils/prng';
import { buildRoadSignAssemblyScene } from '../utils/geometryBuilder';
import { renderSignPanelTexture } from '../utils/textureRenderer';

const DEFAULT_STRUCTURE: StructureConfig = {
  structureType: 'single-post',
  poleProfile: 'u-channel',
  poleMaterial: 'galvanized',
  baseType: 'breakaway-slip',
  poleHeight: 3.6,
  poleRadius: 0.055,
  gantrySpan: 2.8,
  hasLuminaires: false,
  hasCatwalk: false,
  showRoadBase: false,
  weathering: 0.08,
};

/**
 * Normalize a partial RoadSignAssembly config into a complete RoadSignAssembly.
 */
export function normalizeSignConfig(
  partial: Partial<RoadSignAssembly> & {
    structure?: Partial<StructureConfig>;
    signs?: Partial<SignPanelConfig>[];
  } = {}
): RoadSignAssembly {
  const structure: StructureConfig = {
    ...DEFAULT_STRUCTURE,
    ...(partial.structure || {}),
  };

  const rawSigns =
    partial.signs && partial.signs.length > 0
      ? partial.signs
      : [createDefaultSignPanel()];

  const signs: SignPanelConfig[] = rawSigns.map((s, idx) =>
    createDefaultSignPanel({
      ...s,
      id: s.id || `sign-${idx + 1}`,
    })
  );

  return {
    seed: partial.seed || 'CUSTOM-API-SIGN',
    presetId: partial.presetId,
    environment: partial.environment || 'pastel-studio',
    structure,
    signs,
  };
}

/** The faces `src/index.css` declares, as [family, file, weight range]. */
const FONT_FILES: [string, string, string][] = [
  ['HighwayGothic', 'HWYGOTH.woff2', '400 700'],
  ['HighwayGothicCond', 'HWYGCOND.woff2', '400 700'],
  ['HighwayGothicExp', 'HWYGEXPD.woff2', '400 700'],
  ['HighwayGothicNarrow', 'HWYGNRRW.woff2', '400 700'],
  ['HighwayGothicWide', 'HWYGWDE.woff2', '400 700'],
  ['DIN1451', 'D-DIN-Bold.woff2', '400 800'],
  ['DIN1451Cond', 'D-DINCondensed-Bold.woff2', '400 800'],
];

/**
 * Registers the sign typefaces with `document.fonts` from `baseUrl` (the
 * `public/fonts/` folder, wherever the host serves it). Panel textures are
 * painted once, so a face that loads after the build is never seen: await
 * this first. A face that fails falls back to the stack's sans-serif.
 */
export async function loadSignFonts(baseUrl: string): Promise<void> {
  const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  await Promise.all(
    FONT_FILES.map(async ([family, file, weight]) => {
      try {
        const face = new FontFace(family, `url(${new URL(file, base).href})`, { weight });
        document.fonts.add(await face.load());
      } catch {
        /* fallback face */
      }
    })
  );
}

export {
  buildRoadSignAssemblyScene,
  renderSignPanelTexture,
  generateSignAssemblyFromSeed,
  createRandomSeedCode,
  createDefaultSignPanel,
  SeededRNG,
  COLOR_PRESETS,
};
export type { RoadSignAssembly, SignPanelConfig, StructureConfig };
