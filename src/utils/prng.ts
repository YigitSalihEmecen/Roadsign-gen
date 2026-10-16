import {
  ArrowType,
  BaseType,
  EnvironmentPreset,
  PictogramType,
  PoleMaterialType,
  PoleProfile,
  RoadSignAssembly,
  RoadSignFont,
  SheetingType,
  SignPanelConfig,
  StructureType,
} from '../types/sign';
import { COLOR_PRESETS, createDefaultSignPanel } from '../data/presets';

// Deterministic string hash -> 32-bit integer seed
export function hashSeedString(str: string): number {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}

// Mulberry32 deterministic PRNG
export class SeededRNG {
  private state: number;

  constructor(seedInput: string) {
    const clean = seedInput.trim() || 'ROADSIGN-2026';
    this.state = hashSeedString(clean);
    if (this.state === 0) this.state = 123456789;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }

  bool(probability = 0.5): boolean {
    return this.next() < probability;
  }
}

const SEED_PREFIXES = ['HWY', 'MUTCD', 'GANTRY', 'ROUTE', 'APEX', 'SIGN', 'METRO', 'EXPRESS', 'VISTA'];

export function createRandomSeedCode(): string {
  const prefix = SEED_PREFIXES[Math.floor(Math.random() * SEED_PREFIXES.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${num}-${suffix}`;
}

const US_CITIES = [
  ['Savannah', 'Macon'],
  ['Yakima', 'Richland'],
  ['Sacramento', 'San Francisco'],
  ['Portland', 'Seattle'],
  ['Phoenix', 'Tucson'],
  ['Denver', 'Boulder'],
  ['Austin', 'San Antonio'],
  ['Chicago', 'Milwaukee'],
  ['Salt Lake City', 'Ogden'],
  ['Reno', 'Tahoe'],
  ['Tremont Ave', 'Lynes Pkwy'],
  ['Downtown', 'Harding Ave'],
];

const GERMAN_CITIES = [
  ['Berlin  Dresden | Waltershausen', 'Erfurt | Friedrichroda', 'Gotha-Boxberg | Bad Tabarz'],
  ['München  Stuttgart | Augsburg-Ost', 'Augsburg | Friedberg', 'Ulm-West | Dasing'],
  ['Hamburg  Bremen | Bad Fallingbostel', 'Hannover | Walsrode', 'Lübeck | Soltau-Süd'],
  ['Frankfurt  Köln', 'Wiesbaden', 'Mainz-Süd'],
];

const JAPAN_DESTINATIONS = [
  { badge: 'C3', badgeSub: '外環 GAIKAN EXP', jp: '三郷  高谷', en: 'Misato   Koya', jct: '1-1 京葉JCT' },
  { badge: 'E14', badgeSub: '京葉道路 KEIYO EXP', jp: '千葉  成田', en: 'Chiba   Narita', jct: '2-3 宮野木JCT' },
  { badge: 'E1', badgeSub: '東名 TOMEI EXP', jp: '横浜  静岡', en: 'Yokohama Shizuoka', jct: '3-1 海老名JCT' },
  { badge: 'C1', badgeSub: '都心環状 SHUTO EXP', jp: '渋谷  新宿', en: 'Shibuya  Shinjuku', jct: '4-2 谷町JCT' },
];

export function generateSignAssemblyFromSeed(seed: string): RoadSignAssembly {
  const rng = new SeededRNG(seed);

  const structures: StructureType[] = [
    'single-post',
    'single-post',
    'dual-post',
    'route-tree',
    'cantilever',
    'portal-gantry',
    'truss-gantry',
  ];
  const structureType = rng.pick(structures);

  const profiles: PoleProfile[] = [
    'round-steel',
    'square-perforated',
    'i-beam',
    'u-channel',
    'wood-post',
    'octagonal-mast',
  ];
  const materials: PoleMaterialType[] = [
    'galvanized',
    'aluminum',
    'weathered-steel',
    'charcoal-coat',
    'dot-green',
    'wood-cedar',
    'concrete-grey',
    'corten-rust',
  ];
  const bases: BaseType[] = [
    'bolted-flange',
    'breakaway-slip',
    'crash-barrels',
    'guardrail',
    'direct-embed',
  ];
  const environments: EnvironmentPreset[] = [
    'pastel-studio',
    'desert-highway',
    'sunset-expressway',
    'misty-autumn',
    'countryside-day',
  ];
  const sheetings: SheetingType[] = [
    'diamond-cubed',
    'high-intensity',
    'engineer-grade',
    'matte-enamel',
  ];

  const isOverhead =
    structureType === 'cantilever' ||
    structureType === 'portal-gantry' ||
    structureType === 'truss-gantry';

  const poleProfile = isOverhead
    ? rng.pick(['round-steel', 'square-perforated', 'octagonal-mast'] as PoleProfile[])
    : rng.pick(profiles);

  const poleMaterial =
    poleProfile === 'wood-post' ? 'wood-cedar' : rng.pick(materials.filter((m) => m !== 'wood-cedar'));

  const baseType = isOverhead
    ? rng.pick(['bolted-flange', 'crash-barrels', 'guardrail'] as BaseType[])
    : rng.pick(bases);

  const poleHeight = isOverhead
    ? Number(rng.range(5.6, 6.6).toFixed(2))
    : structureType === 'route-tree'
    ? Number(rng.range(4.8, 5.6).toFixed(2))
    : Number(rng.range(3.3, 4.6).toFixed(2));

  const poleRadius = isOverhead
    ? Number(rng.range(0.12, 0.18).toFixed(3))
    : Number(rng.range(0.05, 0.08).toFixed(3));

  const gantrySpan = isOverhead
    ? Number(rng.range(8.5, 11.8).toFixed(1))
    : structureType === 'dual-post'
    ? Number(rng.range(2.6, 3.4).toFixed(1))
    : 2.2;

  const weathering = Number(rng.range(0.03, 0.35).toFixed(2));
  const environment = rng.pick(environments);

  const signs: SignPanelConfig[] = [];

  if (isOverhead) {
    // Pick regional overhead theme: US Freeway, Japanese Expressway, or German Autobahn
    const overheadTheme = rng.pick(['us-guide', 'us-guide', 'jp-express', 'de-autobahn']);

    if (overheadTheme === 'de-autobahn') {
      const cityGroup = rng.pick(GERMAN_CITIES);
      const routeNum = String(rng.int(1, 99));
      const dist = rng.pick(['500 m', '800 m', '1000 m', '2 km']);
      signs.push(
        createDefaultSignPanel({
          id: `sign-${rng.int(100, 999)}`,
          name: `Autobahn A${routeNum} Portal`,
          mountSlot: 'gantry-center',
          xOffset: 0,
          yOffset: 0,
          shape: 'rounded-rect',
          width: Number(rng.range(4.4, 5.4).toFixed(2)),
          height: Number(rng.range(1.85, 2.2).toFixed(2)),
          cornerRadius: 0.07,
          colorPreset: 'autobahn-blue',
          bgColor: '#00519E',
          borderColor: '#F8FAFC',
          textColor: '#F8FAFC',
          fontFamily: rng.pick(['DIN1451', 'DIN1451Cond'] as RoadSignFont[]),
          sheetingType: rng.pick(sheetings),
          showFaceBolts: false,
          wearAmount: weathering,
          dividerLine: 'vertical-split',
          badges: [
            { id: 'b1', type: 'autobahn-hex', number: routeNum },
            { id: 'b2', type: 'autobahn-hex', number: routeNum, direction: dist },
          ],
          lines: cityGroup.map((t, idx) => ({
            id: `l-${idx}`,
            text: t,
            fontSize: 56,
            letterSpacing: 1,
            align: 'center',
          })),
          arrowType: 'autobahn-fork',
          arrowPosition: 'left',
          arrowScale: 1.05,
        })
      );
    } else if (overheadTheme === 'jp-express') {
      const panelCount = rng.int(2, 3);
      const slots: ('gantry-left' | 'gantry-center' | 'gantry-right')[] =
        panelCount === 2 ? ['gantry-left', 'gantry-right'] : ['gantry-left', 'gantry-center', 'gantry-right'];
      const xPositions = panelCount === 2 ? [-1.55, 1.55] : [-2.05, 0, 2.05];

      slots.forEach((slot, idx) => {
        const jpData = rng.pick(JAPAN_DESTINATIONS);
        const isNarrowMid = panelCount === 3 && idx === 1;
        signs.push(
          createDefaultSignPanel({
            id: `jp-${idx}-${rng.int(10, 99)}`,
            name: isNarrowMid ? 'Exit Info Panel' : `${jpData.badge} Expressway Panel`,
            mountSlot: slot,
            xOffset: xPositions[idx],
            yOffset: 0,
            shape: 'rounded-rect',
            width: isNarrowMid ? 0.95 : 2.55,
            height: isNarrowMid ? 1.15 : 1.5,
            cornerRadius: 0.08,
            colorPreset: 'freeway-green',
            bgColor: '#1E613B',
            borderColor: '#F0F4F1',
            textColor: '#F0F4F1',
            fontFamily: 'NotoSansJP',
            sheetingType: rng.pick(sheetings),
            showFaceBolts: false,
            wearAmount: weathering,
            badges: isNarrowMid
              ? []
              : [{ id: `jb-${idx}`, type: 'jp-expressway', number: jpData.badge, header: jpData.badgeSub }],
            lines: isNarrowMid
              ? [
                  { id: '1', text: '出口・PA', fontSize: 56, letterSpacing: 2, align: 'center', color: '#8CE99A' },
                  { id: '2', text: 'EXIT', fontSize: 42, letterSpacing: 2, align: 'center' },
                ]
              : [
                  { id: '1', text: jpData.jp, fontSize: 72, letterSpacing: 4, align: 'center' },
                  { id: '2', text: jpData.en, fontSize: 44, letterSpacing: 2, align: 'center' },
                ],
            arrowType: rng.pick(['up', 'up-left', 'up-right'] as ArrowType[]),
            arrowPosition: idx === 0 ? 'left' : 'right',
            arrowScale: 1.0,
            exitTab: {
              enabled: idx === 0 && rng.bool(0.75),
              text: jpData.jct,
              subText: 'JCT',
              align: 'right',
              widthRatio: 0.48,
            },
          })
        );
      });
    } else {
      // US Overhead Guide Signs (2 or 3 panels)
      const panelCount = rng.int(2, 3);
      const slots: ('gantry-left' | 'gantry-center' | 'gantry-right')[] =
        panelCount === 2 ? ['gantry-left', 'gantry-right'] : ['gantry-left', 'gantry-center', 'gantry-right'];

      const tempPanels: SignPanelConfig[] = [];
      slots.forEach((slot, idx) => {
        const cities = rng.pick(US_CITIES);
        const route1 = String(rng.int(5, 295));
        const route2 = String(rng.int(1, 99));
        const exitNum = rng.int(1, 88);
        const cardinal = rng.pick(['NORTH', 'SOUTH', 'EAST', 'WEST']);
        tempPanels.push(
          createDefaultSignPanel({
            id: `us-gantry-${idx}-${rng.int(10, 99)}`,
            name: `${cities[0]} Guide Panel`,
            mountSlot: slot,
            xOffset: 0,
            yOffset: 0,
            shape: 'rounded-rect',
            width: Number(rng.range(2.25, 2.75).toFixed(2)),
            height: Number(rng.range(1.6, 1.95).toFixed(2)),
            cornerRadius: 0.1,
            colorPreset: 'freeway-green',
            bgColor: '#006B54',
            borderColor: '#F4F6F8',
            textColor: '#F4F6F8',
            fontFamily: rng.pick(['HighwayGothicExp', 'Overpass'] as RoadSignFont[]),
            sheetingType: rng.pick(sheetings),
            showFaceBolts: false,
            wearAmount: weathering,
            badges: [
              { id: `b1-${idx}`, type: 'interstate', number: route1, header: 'INTERSTATE' },
              ...(rng.bool(0.6)
                ? [{ id: `b2-${idx}`, type: 'us-route' as const, number: route2, direction: cardinal }]
                : []),
            ],
            lines: cities.map((c, lIdx) => ({
              id: `l-${lIdx}`,
              text: c,
              fontSize: 68,
              letterSpacing: 2,
              align: 'center',
            })),
            arrowType: rng.pick(['down', 'up-right', 'up', 'right'] as ArrowType[]),
            arrowPosition: rng.pick(['bottom', 'right']),
            arrowScale: 0.95,
            exitTab: {
              enabled: rng.bool(0.65),
              text: `EXIT ${exitNum}`,
              align: rng.pick(['center', 'right']),
              widthRatio: Number(rng.range(0.38, 0.48).toFixed(2)),
            },
          })
        );
      });

      const gap = 0.38;
      const totalWidth = tempPanels.reduce((sum, p) => sum + p.width, 0) + (tempPanels.length - 1) * gap;
      let cursorX = -totalWidth / 2;
      tempPanels.forEach((p) => {
        p.xOffset = Number((cursorX + p.width / 2).toFixed(2));
        cursorX += p.width + gap;
        signs.push(p);
      });
    }
  } else if (structureType === 'route-tree') {
    // Multi-branch Route Marker Assembly (like Michigan reference)
    const topRoute = String(rng.int(10, 99));
    signs.push(
      createDefaultSignPanel({
        id: 'tree-top',
        name: `State Route ${topRoute} Diamond`,
        mountSlot: 'center',
        yOffset: 1.75,
        shape: 'diamond',
        width: 0.74,
        height: 0.74,
        cornerRadius: 0.05,
        colorPreset: 'regulatory-white',
        bgColor: '#F2F0E8',
        borderColor: '#16181D',
        textColor: '#16181D',
        fontFamily: 'HighwayGothicWide',
        headerText: rng.pick(['M', 'SR', 'RT']),
        lines: [{ id: '1', text: topRoute, fontSize: 120, letterSpacing: 2, align: 'center' }],
      }),
      createDefaultSignPanel({
        id: 'tree-left-1',
        name: 'Left Interstate Shield',
        mountSlot: 'left-arm',
        xOffset: -0.52,
        yOffset: 0.55,
        shape: 'interstate-shield',
        width: 0.8,
        height: 0.8,
        colorPreset: 'interstate-classic',
        bgColor: '#003F87',
        borderColor: '#F8FAFC',
        textColor: '#F8FAFC',
        accentColor: '#C8102E',
        fontFamily: 'HighwayGothicWide',
        headerText: 'INTERSTATE',
        lines: [{ id: '1', text: String(rng.int(10, 95)), fontSize: 150, letterSpacing: 2, align: 'center' }],
      }),
      createDefaultSignPanel({
        id: 'tree-right-1',
        name: 'Right US Shield',
        mountSlot: 'right-arm',
        xOffset: 0.52,
        yOffset: 0.55,
        shape: 'us-route-shield',
        width: 0.8,
        height: 0.78,
        colorPreset: 'regulatory-white',
        bgColor: '#F2F0E8',
        borderColor: '#16181D',
        textColor: '#16181D',
        fontFamily: 'HighwayGothicWide',
        headerText: 'HIGHWAY',
        subHeaderText: 'U S',
        lines: [{ id: '1', text: String(rng.int(1, 99)), fontSize: 145, letterSpacing: 2, align: 'center' }],
      }),
      createDefaultSignPanel({
        id: 'tree-left-2',
        name: 'Left Turn Plaque',
        mountSlot: 'left-arm',
        xOffset: -0.52,
        yOffset: -0.25,
        shape: 'rounded-rect',
        width: 0.68,
        height: 0.58,
        cornerRadius: 0.04,
        colorPreset: 'regulatory-white',
        bgColor: '#F2F0E8',
        borderColor: '#16181D',
        textColor: '#16181D',
        lines: [],
        arrowType: rng.pick(['advance-left', 'left', 'up-left'] as ArrowType[]),
        arrowPosition: 'center',
        arrowScale: 1.1,
      }),
      createDefaultSignPanel({
        id: 'tree-right-2',
        name: 'Right Turn Plaque',
        mountSlot: 'right-arm',
        xOffset: 0.52,
        yOffset: -0.25,
        shape: 'rounded-rect',
        width: 0.68,
        height: 0.58,
        cornerRadius: 0.04,
        colorPreset: 'regulatory-white',
        bgColor: '#F2F0E8',
        borderColor: '#16181D',
        textColor: '#16181D',
        lines: [{ id: '1', text: rng.pick(['ENDS', 'NORTH', 'EAST', 'TOLL']), fontSize: 105, letterSpacing: 2, align: 'center' }],
      })
    );
  } else if (structureType === 'dual-post') {
    const cities = rng.pick(US_CITIES);
    const r1 = String(rng.int(10, 195));
    const r2 = String(rng.int(5, 90));
    signs.push(
      createDefaultSignPanel({
        id: 'dual-top',
        name: `${cities[0]} Upper Panel`,
        mountSlot: 'center',
        yOffset: 0.9,
        shape: 'rounded-rect',
        width: 2.8,
        height: 1.4,
        cornerRadius: 0.1,
        colorPreset: 'freeway-green',
        bgColor: '#006B54',
        borderColor: '#F4F6F8',
        textColor: '#F4F6F8',
        fontFamily: 'HighwayGothicExp',
        badges: [{ id: 'db1', type: 'interstate', number: r1, header: 'INTERSTATE', direction: 'WEST TO' }],
        lines: [{ id: '1', text: cities[0], fontSize: 78, letterSpacing: 3, align: 'center' }],
        arrowType: 'up',
        arrowPosition: 'left',
        arrowScale: 1.0,
      }),
      createDefaultSignPanel({
        id: 'dual-bot',
        name: `${cities[1]} Lower Panel`,
        mountSlot: 'center',
        yOffset: -0.52,
        shape: 'rounded-rect',
        width: 2.8,
        height: 1.4,
        cornerRadius: 0.1,
        colorPreset: 'freeway-green',
        bgColor: '#006B54',
        borderColor: '#F4F6F8',
        textColor: '#F4F6F8',
        fontFamily: 'HighwayGothicExp',
        badges: [{ id: 'db2', type: 'us-route', number: r2, direction: 'EAST' }],
        lines: [{ id: '1', text: cities[1], fontSize: 78, letterSpacing: 3, align: 'center' }],
        arrowType: 'right',
        arrowPosition: 'right',
        arrowScale: 0.95,
      })
    );
  } else {
    // Single Post — choose between 5 rich single-post archetypes!
    const archetype = rng.pick(['interstate-stack', 'warning-advisory', 'motorist-service', 'euro-triangle', 'one-way-stack']);

    if (archetype === 'interstate-stack') {
      const routeNum = String(rng.int(5, 95));
      const dir = rng.pick(['WEST', 'EAST', 'NORTH', 'SOUTH']);
      signs.push(
        createDefaultSignPanel({
          id: 's-top',
          name: 'Freeway Entrance',
          mountSlot: 'center',
          yOffset: 1.1,
          shape: 'rounded-rect',
          width: 1.75,
          height: 0.9,
          colorPreset: 'freeway-green',
          bgColor: '#006B54',
          borderColor: '#F4F6F8',
          textColor: '#F4F6F8',
          fontFamily: 'HighwayGothic',
          lines: [
            { id: '1', text: 'FREEWAY', fontSize: 90, letterSpacing: 5, align: 'center' },
            { id: '2', text: 'ENTRANCE', fontSize: 90, letterSpacing: 5, align: 'center' },
          ],
        }),
        createDefaultSignPanel({
          id: 's-dir',
          name: `${dir} Cardinal Plaque`,
          mountSlot: 'center',
          yOffset: 0.34,
          shape: 'rounded-rect',
          width: 0.98,
          height: 0.46,
          colorPreset: 'motorist-blue',
          bgColor: '#003F87',
          borderColor: '#F4F6F8',
          textColor: '#F4F6F8',
          fontFamily: 'HighwayGothicCond',
          lines: [{ id: '1', text: dir, fontSize: 125, letterSpacing: 4, align: 'center' }],
        }),
        createDefaultSignPanel({
          id: 's-shield',
          name: `Interstate ${routeNum} Shield`,
          mountSlot: 'center',
          yOffset: -0.42,
          shape: 'interstate-shield',
          width: 1.0,
          height: 1.0,
          colorPreset: 'interstate-classic',
          bgColor: '#003F87',
          borderColor: '#F4F6F8',
          textColor: '#F4F6F8',
          accentColor: '#C8102E',
          fontFamily: 'HighwayGothicWide',
          headerText: 'INTERSTATE',
          lines: [{ id: '1', text: routeNum, fontSize: 165, letterSpacing: 2, align: 'center' }],
        }),
        createDefaultSignPanel({
          id: 's-arrow',
          name: 'Arrow Plaque',
          mountSlot: 'center',
          yOffset: -1.28,
          shape: 'rounded-rect',
          width: 0.88,
          height: 0.62,
          colorPreset: 'motorist-blue',
          bgColor: '#003F87',
          borderColor: '#F4F6F8',
          textColor: '#F4F6F8',
          lines: [],
          arrowType: rng.pick(['down-left', 'up-right', 'left', 'right'] as ArrowType[]),
          arrowPosition: 'center',
          arrowScale: 1.15,
        })
      );
    } else if (archetype === 'warning-advisory') {
      const speed = rng.pick(['15', '25', '30', '35', '45', '50']);
      const useArrow = rng.bool(0.6);
      const picto = rng.pick(['deer', 'slippery', 't-junction-right', 'crossroads', 'merge', 'pedestrian', 'steep-grade'] as PictogramType[]);
      signs.push(
        createDefaultSignPanel({
          id: 'w-main',
          name: 'Warning Diamond',
          mountSlot: 'center',
          yOffset: 0.82,
          shape: 'diamond',
          width: 1.05,
          height: 1.05,
          cornerRadius: 0.07,
          colorPreset: 'warning-yellow',
          bgColor: '#F5C400',
          borderColor: '#141619',
          textColor: '#141619',
          lines: [],
          arrowType: useArrow ? rng.pick(['turn-left-90', 'turn-right-90', 's-curve-left'] as ArrowType[]) : 'none',
          arrowPosition: 'center',
          arrowScale: 1.15,
          pictogramType: useArrow ? 'none' : picto,
          pictogramPosition: 'center',
          pictogramScale: 1.1,
        }),
        createDefaultSignPanel({
          id: 'w-sub',
          name: `${speed} MPH Plaque`,
          mountSlot: 'center',
          yOffset: -0.18,
          shape: 'rounded-rect',
          width: 0.76,
          height: 0.76,
          cornerRadius: 0.05,
          colorPreset: 'warning-yellow',
          bgColor: '#F5C400',
          borderColor: '#141619',
          textColor: '#141619',
          fontFamily: 'HighwayGothicWide',
          lines: [
            { id: '1', text: speed, fontSize: 145, letterSpacing: 2, align: 'center' },
            { id: '2', text: 'MPH', fontSize: 64, letterSpacing: 5, align: 'center' },
          ],
        })
      );
    } else if (archetype === 'motorist-service') {
      const dist = rng.int(12, 165);
      const service = rng.pick(['NEXT GAS', 'REST AREA', 'SCENIC VIEW', 'FOOD & LODGING']);
      const preset = rng.pick([COLOR_PRESETS[1], COLOR_PRESETS[11]]); // Blue or National Park Brown
      signs.push(
        createDefaultSignPanel({
          id: 'srv-main',
          name: `${service} Sign`,
          mountSlot: 'center',
          yOffset: 0.65,
          shape: 'rounded-rect',
          width: 1.85,
          height: 1.42,
          cornerRadius: 0.09,
          colorPreset: preset.id,
          bgColor: preset.bgColor,
          borderColor: preset.borderColor,
          textColor: preset.textColor,
          fontFamily: 'HighwayGothicWide',
          lines: [
            { id: '1', text: service, fontSize: 72, letterSpacing: 4, align: 'center' },
            { id: '2', text: String(dist), fontSize: 90, letterSpacing: 4, align: 'center' },
            { id: '3', text: 'MILES', fontSize: 74, letterSpacing: 5, align: 'center' },
          ],
        })
      );
    } else if (archetype === 'euro-triangle') {
      const picto = rng.pick([
        't-junction-right',
        't-junction-left',
        'crossroads',
        'deer',
        'slippery',
        'roadwork',
        'roundabout',
        'pedestrian',
      ] as PictogramType[]);
      signs.push(
        createDefaultSignPanel({
          id: 'eu-tri',
          name: 'Euro Warning Triangle',
          mountSlot: 'center',
          yOffset: 0.7,
          shape: 'triangle-up',
          width: 1.22,
          height: 1.12,
          cornerRadius: 0.08,
          colorPreset: 'euro-warning',
          bgColor: '#F6F7F9',
          borderColor: '#D61F26',
          textColor: '#141619',
          borderWidth: 0.095,
          borderInset: 0,
          showFaceBolts: false,
          lines: [],
          pictogramType: picto,
          pictogramPosition: 'center',
          pictogramScale: 1.1,
        })
      );
    } else {
      // One Way + Regulatory Stop / Speed Limit stack
      signs.push(
        createDefaultSignPanel({
          id: 'ow-top',
          name: 'One Way Sign',
          mountSlot: 'center',
          yOffset: 1.05,
          shape: 'rounded-rect',
          width: 1.75,
          height: 0.6,
          cornerRadius: 0.05,
          colorPreset: 'oneway-dark',
          bgColor: '#1D2228',
          borderColor: '#F2F0E8',
          textColor: '#1D2228',
          accentColor: '#F2F0E8',
          fontFamily: 'HighwayGothic',
          lines: [{ id: '1', text: 'ONE WAY', fontSize: 95, letterSpacing: 6, align: 'center' }],
          arrowType: rng.pick(['one-way-right', 'one-way-left'] as ArrowType[]),
          arrowPosition: 'background-box',
          arrowScale: 1.0,
        }),
        createDefaultSignPanel({
          id: 'ow-stop',
          name: 'Regulatory Stop Octagon',
          mountSlot: 'center',
          yOffset: 0.1,
          shape: 'octagon',
          width: 0.95,
          height: 0.95,
          cornerRadius: 0.04,
          colorPreset: 'stop-red',
          bgColor: '#C41E24',
          borderColor: '#F8FAFC',
          textColor: '#F8FAFC',
          fontFamily: 'HighwayGothicCond',
          lines: [{ id: '1', text: 'STOP', fontSize: 135, letterSpacing: 6, align: 'center' }],
        })
      );
    }
  }

  let finalGantrySpan = gantrySpan;
  if (isOverhead && signs.length > 0) {
    let minX = Infinity;
    let maxX = -Infinity;
    for (const s of signs) {
      minX = Math.min(minX, s.xOffset - (s.width * s.scale) / 2);
      maxX = Math.max(maxX, s.xOffset + (s.width * s.scale) / 2);
    }
    const requiredSpan = maxX - minX + 2.2;
    finalGantrySpan = Number(Math.max(gantrySpan, requiredSpan).toFixed(1));
  }

  return {
    seed,
    environment,
    structure: {
      structureType,
      poleProfile,
      poleMaterial,
      baseType,
      poleHeight,
      poleRadius,
      gantrySpan: finalGantrySpan,
      hasLuminaires: isOverhead ? rng.bool(0.55) : false,
      hasCatwalk: isOverhead ? rng.bool(0.5) : false,
      showRoadBase: true,
      weathering,
    },
    signs,
  };
}
