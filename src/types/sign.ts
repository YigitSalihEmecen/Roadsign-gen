export type StructureType =
  | 'single-post'
  | 'dual-post'
  | 'route-tree'
  | 'cantilever'
  | 'portal-gantry'
  | 'truss-gantry';

export type PoleProfile =
  | 'round-steel'
  | 'square-perforated'
  | 'i-beam'
  | 'u-channel'
  | 'wood-post'
  | 'octagonal-mast';

export type PoleMaterialType =
  | 'galvanized'
  | 'aluminum'
  | 'weathered-steel'
  | 'charcoal-coat'
  | 'dot-green'
  | 'wood-cedar'
  | 'concrete-grey'
  | 'corten-rust';

export type BaseType =
  | 'bolted-flange'
  | 'breakaway-slip'
  | 'crash-barrels'
  | 'guardrail'
  | 'direct-embed';

export type SignShape =
  | 'rounded-rect'
  | 'diamond'
  | 'octagon'
  | 'triangle-up'
  | 'triangle-down'
  | 'circle'
  | 'pentagon'
  | 'interstate-shield'
  | 'us-route-shield'
  | 'chevron-rect'
  | 'pennant';

export type MountSlot =
  | 'center'
  | 'left-arm'
  | 'right-arm'
  | 'gantry-left'
  | 'gantry-center'
  | 'gantry-right';

export type SheetingType =
  | 'diamond-cubed'
  | 'high-intensity'
  | 'engineer-grade'
  | 'matte-enamel';

export type RoadSignFont =
  | 'HighwayGothicExp'
  | 'HighwayGothic'
  | 'HighwayGothicWide'
  | 'HighwayGothicCond'
  | 'HighwayGothicNarrow'
  | 'DIN1451'
  | 'DIN1451Cond'
  | 'Overpass'
  | 'NotoSansJP';

export type ArrowType =
  | 'none'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-right'
  | 'up-left'
  | 'down-left'
  | 'down-right'
  | 'turn-left-90'
  | 'turn-right-90'
  | 'advance-left'
  | 'advance-right'
  | 's-curve-left'
  | 'autobahn-fork'
  | 'one-way-right'
  | 'one-way-left'
  | 'u-turn';

export type PictogramType =
  | 'none'
  | 't-junction-right'
  | 't-junction-left'
  | 'crossroads'
  | 'y-junction'
  | 'merge'
  | 'pedestrian'
  | 'deer'
  | 'slippery'
  | 'roadwork'
  | 'bicycle'
  | 'airport'
  | 'gas'
  | 'food'
  | 'lodging'
  | 'hospital'
  | 'parking'
  | 'no-entry'
  | 'roundabout'
  | 'steep-grade'
  | 'custom-upload';

export type BadgeType =
  | 'interstate'
  | 'business-loop'
  | 'us-route'
  | 'state-rect'
  | 'state-circle'
  | 'arkansas-shield'
  | 'jp-expressway'
  | 'autobahn-hex';

export interface RouteBadgeItem {
  id: string;
  type: BadgeType;
  number: string;
  header?: string; // e.g. INTERSTATE, MICHIGAN, C3, E14
  direction?: string; // e.g. NORTH, WEST TO, EAST
}

export interface SignTextLine {
  id: string;
  text: string;
  fontSize: number; // relative scale 20 - 240
  letterSpacing: number; // -5 to 30
  align: 'left' | 'center' | 'right';
  color?: string;
}

export interface ExitTabConfig {
  enabled: boolean;
  text: string;
  subText?: string;
  align: 'left' | 'center' | 'right';
  widthRatio: number; // 0.3 to 1.0
  bgColor?: string;
  textColor?: string;
}

export interface SignPanelConfig {
  id: string;
  name: string;
  mountSlot: MountSlot;
  xOffset: number;
  yOffset: number;
  zOffset: number;
  rotationZ: number;
  scale: number;

  shape: SignShape;
  width: number;
  height: number;
  cornerRadius: number;
  thickness: number;

  colorPreset: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  borderWidth: number;
  borderInset: number;
  sheetingType: SheetingType;
  showFaceBolts: boolean;
  wearAmount: number;

  fontFamily: RoadSignFont;
  headerText: string;
  subHeaderText: string;
  lines: SignTextLine[];
  dividerLine: 'none' | 'horizontal-middle' | 'header-split' | 'vertical-split';

  badges: RouteBadgeItem[];
  badgeLayout: 'top-row' | 'left-column' | 'inline-split';

  arrowType: ArrowType;
  arrowPosition: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'background-box';
  arrowScale: number;

  pictogramType: PictogramType;
  pictogramPosition: 'center' | 'top' | 'left' | 'right';
  pictogramScale: number;
  customImageUrl?: string;

  exitTab: ExitTabConfig;
}

export interface StructureConfig {
  structureType: StructureType;
  poleProfile: PoleProfile;
  poleMaterial: PoleMaterialType;
  baseType: BaseType;
  poleHeight: number;
  poleRadius: number;
  gantrySpan: number;
  hasLuminaires: boolean;
  hasCatwalk: boolean;
  showRoadBase: boolean;
  weathering: number;
}

export type LODLevel = 0 | 1 | 2;

export type EnvironmentPreset =
  | 'pastel-studio'
  | 'desert-highway'
  | 'sunset-expressway'
  | 'misty-autumn'
  | 'countryside-day';

export type CameraViewPreset =
  | 'studio-34'
  | 'front-ortho'
  | 'driver-pov'
  | 'low-hero'
  | 'rear-hardware'
  | 'top-plan';

export interface RoadSignAssembly {
  seed: string;
  presetId?: string;
  structure: StructureConfig;
  signs: SignPanelConfig[];
  environment: EnvironmentPreset;
}

export interface LODMetrics {
  level: LODLevel;
  label: string;
  description: string;
  triangles: number;
  vertices: number;
  textureSize: number;
  features: string[];
}
