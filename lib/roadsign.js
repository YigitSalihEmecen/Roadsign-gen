var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/data/presets.ts
var COLOR_PRESETS = [
  {
    id: "freeway-green",
    name: "Freeway Guide Green",
    bgColor: "#006B54",
    borderColor: "#F4F6F8",
    textColor: "#F4F6F8",
    accentColor: "#004B87"
  },
  {
    id: "motorist-blue",
    name: "Motorist Service Blue",
    bgColor: "#003F87",
    borderColor: "#F4F6F8",
    textColor: "#F4F6F8",
    accentColor: "#C8102E"
  },
  {
    id: "autobahn-blue",
    name: "Autobahn / Euro Blue",
    bgColor: "#00519E",
    borderColor: "#F8FAFC",
    textColor: "#F8FAFC",
    accentColor: "#00519E"
  },
  {
    id: "warning-yellow",
    name: "Warning Diamond Yellow",
    bgColor: "#F5C400",
    borderColor: "#141619",
    textColor: "#141619",
    accentColor: "#141619"
  },
  {
    id: "regulatory-white",
    name: "Regulatory Crisp White",
    bgColor: "#F4F5F7",
    borderColor: "#16181D",
    textColor: "#16181D",
    accentColor: "#C81E1E"
  },
  {
    id: "stop-red",
    name: "Regulatory Stop Red",
    bgColor: "#C41E24",
    borderColor: "#F8FAFC",
    textColor: "#F8FAFC",
    accentColor: "#F8FAFC"
  },
  {
    id: "euro-warning",
    name: "Euro / UK Red-Border",
    bgColor: "#F6F7F9",
    borderColor: "#D61F26",
    textColor: "#141619",
    accentColor: "#D61F26"
  },
  {
    id: "oneway-dark",
    name: "One-Way Charcoal Black",
    bgColor: "#1D2228",
    borderColor: "#F2F0E8",
    textColor: "#1D2228",
    accentColor: "#F2F0E8"
  },
  {
    id: "interstate-classic",
    name: "Interstate Red/Blue",
    bgColor: "#003F87",
    borderColor: "#F8FAFC",
    textColor: "#F8FAFC",
    accentColor: "#C8102E"
  },
  {
    id: "business-green",
    name: "Business Loop Green",
    bgColor: "#005A40",
    borderColor: "#F4F5F0",
    textColor: "#F4F5F0",
    accentColor: "#005A40"
  },
  {
    id: "work-orange",
    name: "Construction Zone Orange",
    bgColor: "#F26B1D",
    borderColor: "#141619",
    textColor: "#141619",
    accentColor: "#141619"
  },
  {
    id: "recreation-brown",
    name: "National Park Brown",
    bgColor: "#5C3D2E",
    borderColor: "#F8FAFC",
    textColor: "#F8FAFC",
    accentColor: "#F5C400"
  },
  {
    id: "fluor-lime",
    name: "School Zone Fluor-Lime",
    bgColor: "#BCE000",
    borderColor: "#141619",
    textColor: "#141619",
    accentColor: "#141619"
  }
];
function createDefaultSignPanel(overrides = {}) {
  return {
    id: overrides.id || `sign-${Math.random().toString(36).slice(2, 8)}`,
    name: overrides.name || "Sign Panel",
    mountSlot: "center",
    xOffset: 0,
    yOffset: 0,
    zOffset: 0,
    rotationZ: 0,
    scale: 1,
    shape: "rounded-rect",
    width: 1.8,
    height: 1.2,
    cornerRadius: 0.1,
    thickness: 0.016,
    colorPreset: "freeway-green",
    bgColor: "#006B54",
    borderColor: "#F4F6F8",
    textColor: "#F4F6F8",
    accentColor: "#C8102E",
    borderWidth: 0.035,
    borderInset: 0.025,
    sheetingType: "diamond-cubed",
    showFaceBolts: true,
    wearAmount: 0.08,
    fontFamily: "HighwayGothicExp",
    headerText: "",
    subHeaderText: "",
    lines: [
      { id: "l1", text: "FREEWAY", fontSize: 82, letterSpacing: 4, align: "center" },
      { id: "l2", text: "ENTRANCE", fontSize: 82, letterSpacing: 4, align: "center" }
    ],
    dividerLine: "none",
    badges: [],
    badgeLayout: "top-row",
    arrowType: "none",
    arrowPosition: "bottom",
    arrowScale: 1,
    pictogramType: "none",
    pictogramPosition: "center",
    pictogramScale: 1,
    exitTab: {
      enabled: false,
      text: "EXIT 4",
      align: "right",
      widthRatio: 0.42
    },
    ...overrides
  };
}
var STARTER_TEMPLATES = [
  {
    id: "tpl-freeway-truss",
    title: "Overhead Truss Guide Gantry",
    subtitle: "3-Panel Highway Guide Truss Bridge + Exit Plaques",
    region: "USA \u2022 MUTCD Overhead",
    assembly: {
      seed: "GANTRY-SAVANNAH-EXIT-5",
      presetId: "tpl-freeway-truss",
      environment: "countryside-day",
      structure: {
        structureType: "truss-gantry",
        poleProfile: "round-steel",
        poleMaterial: "weathered-steel",
        baseType: "guardrail",
        poleHeight: 6.2,
        poleRadius: 0.14,
        gantrySpan: 11.2,
        hasLuminaires: true,
        hasCatwalk: true,
        showRoadBase: true,
        weathering: 0.15
      },
      signs: [
        createDefaultSignPanel({
          id: "ga-left",
          name: "Lynes Parkway Panel",
          mountSlot: "gantry-left",
          xOffset: -3.15,
          yOffset: 0,
          shape: "rounded-rect",
          width: 2.35,
          height: 1.9,
          cornerRadius: 0.1,
          colorPreset: "freeway-green",
          bgColor: "#00593F",
          borderColor: "#E8ECE9",
          textColor: "#E8ECE9",
          fontFamily: "HighwayGothicExp",
          showFaceBolts: false,
          badges: [
            { id: "b1", type: "interstate", number: "516", header: "INTERSTATE" },
            { id: "b2", type: "us-route", number: "17" }
          ],
          lines: [
            { id: "1", text: "Lynes", fontSize: 68, letterSpacing: 2, align: "center" },
            { id: "2", text: "Parkway", fontSize: 68, letterSpacing: 2, align: "center" }
          ],
          arrowType: "down",
          arrowPosition: "bottom",
          arrowScale: 0.9
        }),
        createDefaultSignPanel({
          id: "ga-center",
          name: "Tremont Ave Exit 4 Panel",
          mountSlot: "gantry-center",
          xOffset: -0.35,
          yOffset: 0,
          shape: "rounded-rect",
          width: 2.05,
          height: 1.75,
          cornerRadius: 0.1,
          colorPreset: "freeway-green",
          bgColor: "#00593F",
          borderColor: "#E8ECE9",
          textColor: "#E8ECE9",
          fontFamily: "HighwayGothicExp",
          showFaceBolts: false,
          lines: [
            { id: "1", text: "Tremont", fontSize: 72, letterSpacing: 2, align: "center" },
            { id: "2", text: "Avenue", fontSize: 72, letterSpacing: 2, align: "center" },
            { id: "3", text: "EXIT 1/4 MILE", fontSize: 46, letterSpacing: 2, align: "center" }
          ],
          exitTab: {
            enabled: true,
            text: "EXIT 4",
            align: "right",
            widthRatio: 0.44
          }
        }),
        createDefaultSignPanel({
          id: "ga-right",
          name: "Macon / Savannah Exit 5",
          mountSlot: "gantry-right",
          xOffset: 2.65,
          yOffset: 0,
          shape: "rounded-rect",
          width: 2.85,
          height: 1.85,
          cornerRadius: 0.1,
          colorPreset: "freeway-green",
          bgColor: "#00593F",
          borderColor: "#E8ECE9",
          textColor: "#E8ECE9",
          fontFamily: "HighwayGothicExp",
          showFaceBolts: false,
          badges: [
            { id: "b1", type: "interstate", number: "16", header: "INTERSTATE" },
            { id: "b2", type: "us-route", number: "17", direction: "NORTH" }
          ],
          lines: [
            { id: "1", text: "Macon", fontSize: 68, letterSpacing: 2, align: "center" },
            { id: "2", text: "Savannah", fontSize: 68, letterSpacing: 2, align: "center" }
          ],
          arrowType: "up-right",
          arrowPosition: "right",
          arrowScale: 0.95,
          exitTab: {
            enabled: true,
            text: "EXIT 5",
            align: "right",
            widthRatio: 0.42
          }
        })
      ]
    }
  },
  {
    id: "tpl-interstate-stack",
    title: "Interstate Entrance Stack",
    subtitle: "4-Sign Vertical Assembly on Perforated Post",
    region: "USA \u2022 Interstate",
    assembly: {
      seed: "HWY-I80-WEST-ENTRANCE",
      presetId: "tpl-interstate-stack",
      environment: "desert-highway",
      structure: {
        structureType: "single-post",
        poleProfile: "square-perforated",
        poleMaterial: "galvanized",
        baseType: "direct-embed",
        poleHeight: 4.3,
        poleRadius: 0.055,
        gantrySpan: 6,
        hasLuminaires: false,
        hasCatwalk: false,
        showRoadBase: true,
        weathering: 0.15
      },
      signs: [
        createDefaultSignPanel({
          id: "i80-top",
          name: "Freeway Entrance Panel",
          mountSlot: "center",
          yOffset: 1.15,
          shape: "rounded-rect",
          width: 1.75,
          height: 0.92,
          cornerRadius: 0.09,
          colorPreset: "freeway-green",
          bgColor: "#007A53",
          borderColor: "#F3F4F0",
          textColor: "#F3F4F0",
          fontFamily: "HighwayGothic",
          showFaceBolts: true,
          lines: [
            { id: "1", text: "FREEWAY", fontSize: 92, letterSpacing: 6, align: "center" },
            { id: "2", text: "ENTRANCE", fontSize: 92, letterSpacing: 6, align: "center" }
          ]
        }),
        createDefaultSignPanel({
          id: "i80-west",
          name: "West Cardinal Plaque",
          mountSlot: "center",
          yOffset: 0.36,
          shape: "rounded-rect",
          width: 1,
          height: 0.48,
          cornerRadius: 0.06,
          colorPreset: "motorist-blue",
          bgColor: "#0046AD",
          borderColor: "#F3F4F0",
          textColor: "#F3F4F0",
          fontFamily: "HighwayGothicCond",
          showFaceBolts: true,
          lines: [{ id: "1", text: "WEST", fontSize: 130, letterSpacing: 4, align: "center" }]
        }),
        createDefaultSignPanel({
          id: "i80-shield",
          name: "Interstate 80 Shield",
          mountSlot: "center",
          yOffset: -0.42,
          shape: "interstate-shield",
          width: 1.02,
          height: 1.02,
          colorPreset: "interstate-classic",
          bgColor: "#0046AD",
          borderColor: "#F3F4F0",
          textColor: "#F3F4F0",
          accentColor: "#C8102E",
          fontFamily: "HighwayGothicWide",
          headerText: "INTERSTATE",
          showFaceBolts: true,
          lines: [{ id: "1", text: "80", fontSize: 165, letterSpacing: 2, align: "center" }]
        }),
        createDefaultSignPanel({
          id: "i80-arrow",
          name: "Directional Arrow Plaque",
          mountSlot: "center",
          yOffset: -1.32,
          shape: "rounded-rect",
          width: 0.9,
          height: 0.65,
          cornerRadius: 0.06,
          colorPreset: "motorist-blue",
          bgColor: "#0046AD",
          borderColor: "#F3F4F0",
          textColor: "#F3F4F0",
          showFaceBolts: true,
          lines: [],
          arrowType: "down-left",
          arrowPosition: "center",
          arrowScale: 1.15
        })
      ]
    }
  },
  {
    id: "tpl-route-tree",
    title: "Multi-Route Junction Tree",
    subtitle: "10-Sign Cross-Arm Highway Assembly",
    region: "USA \u2022 Route Assembly",
    assembly: {
      seed: "ROUTE-M84-I75-TREE",
      presetId: "tpl-route-tree",
      environment: "countryside-day",
      structure: {
        structureType: "route-tree",
        poleProfile: "square-perforated",
        poleMaterial: "charcoal-coat",
        baseType: "direct-embed",
        poleHeight: 5.4,
        poleRadius: 0.065,
        gantrySpan: 2.2,
        hasLuminaires: false,
        hasCatwalk: false,
        showRoadBase: true,
        weathering: 0.22
      },
      signs: [
        createDefaultSignPanel({
          id: "m84-top",
          name: "M-84 Diamond Shield",
          mountSlot: "center",
          yOffset: 1.95,
          shape: "diamond",
          width: 0.72,
          height: 0.72,
          cornerRadius: 0.05,
          colorPreset: "regulatory-white",
          bgColor: "#ECEAE2",
          borderColor: "#181818",
          textColor: "#181818",
          fontFamily: "HighwayGothicWide",
          headerText: "M",
          lines: [{ id: "1", text: "84", fontSize: 120, letterSpacing: 2, align: "center" }]
        }),
        createDefaultSignPanel({
          id: "m84-up",
          name: "Straight Ahead Arrow",
          mountSlot: "center",
          yOffset: 1.18,
          shape: "rounded-rect",
          width: 0.65,
          height: 0.56,
          cornerRadius: 0.04,
          colorPreset: "regulatory-white",
          bgColor: "#ECEAE2",
          borderColor: "#181818",
          textColor: "#181818",
          lines: [],
          arrowType: "up",
          arrowPosition: "center",
          arrowScale: 1.1
        }),
        createDefaultSignPanel({
          id: "i75-left",
          name: "Interstate 75 Shield",
          mountSlot: "left-arm",
          xOffset: -0.52,
          yOffset: 0.45,
          shape: "interstate-shield",
          width: 0.78,
          height: 0.78,
          colorPreset: "interstate-classic",
          bgColor: "#003876",
          borderColor: "#ECEAE2",
          textColor: "#ECEAE2",
          accentColor: "#B81D13",
          fontFamily: "HighwayGothicWide",
          headerText: "INTERSTATE",
          subHeaderText: "MICHIGAN",
          lines: [{ id: "1", text: "75", fontSize: 145, letterSpacing: 2, align: "center" }]
        }),
        createDefaultSignPanel({
          id: "us10-right",
          name: "US-10 Shield",
          mountSlot: "right-arm",
          xOffset: 0.52,
          yOffset: 0.45,
          shape: "us-route-shield",
          width: 0.78,
          height: 0.76,
          colorPreset: "regulatory-white",
          bgColor: "#ECEAE2",
          borderColor: "#181818",
          textColor: "#181818",
          fontFamily: "HighwayGothicWide",
          headerText: "MICHIGAN",
          subHeaderText: "U S",
          lines: [{ id: "1", text: "10", fontSize: 145, letterSpacing: 2, align: "center" }]
        }),
        createDefaultSignPanel({
          id: "turn-l1",
          name: "Left Advance Turn (I-75)",
          mountSlot: "left-arm",
          xOffset: -0.52,
          yOffset: -0.28,
          shape: "rounded-rect",
          width: 0.68,
          height: 0.6,
          cornerRadius: 0.04,
          colorPreset: "regulatory-white",
          bgColor: "#ECEAE2",
          borderColor: "#181818",
          textColor: "#181818",
          lines: [],
          arrowType: "advance-left",
          arrowPosition: "center",
          arrowScale: 1.1
        }),
        createDefaultSignPanel({
          id: "turn-r1",
          name: "Left Advance Turn (US-10)",
          mountSlot: "right-arm",
          xOffset: 0.52,
          yOffset: -0.28,
          shape: "rounded-rect",
          width: 0.68,
          height: 0.6,
          cornerRadius: 0.04,
          colorPreset: "regulatory-white",
          bgColor: "#ECEAE2",
          borderColor: "#181818",
          textColor: "#181818",
          lines: [],
          arrowType: "advance-left",
          arrowPosition: "center",
          arrowScale: 1.1
        }),
        createDefaultSignPanel({
          id: "us23-left",
          name: "US-23 Shield",
          mountSlot: "left-arm",
          xOffset: -0.52,
          yOffset: -1.04,
          shape: "us-route-shield",
          width: 0.78,
          height: 0.76,
          colorPreset: "regulatory-white",
          bgColor: "#ECEAE2",
          borderColor: "#181818",
          textColor: "#181818",
          fontFamily: "HighwayGothicWide",
          headerText: "MICHIGAN",
          subHeaderText: "U S",
          lines: [{ id: "1", text: "23", fontSize: 145, letterSpacing: 2, align: "center" }]
        }),
        createDefaultSignPanel({
          id: "bus75-right",
          name: "Business Loop 75 Shield",
          mountSlot: "right-arm",
          xOffset: 0.52,
          yOffset: -1.04,
          shape: "interstate-shield",
          width: 0.78,
          height: 0.78,
          colorPreset: "business-green",
          bgColor: "#133829",
          borderColor: "#ECEAE2",
          textColor: "#ECEAE2",
          accentColor: "#133829",
          fontFamily: "HighwayGothicWide",
          headerText: "BUSINESS",
          subHeaderText: "LOOP",
          lines: [{ id: "1", text: "75", fontSize: 145, letterSpacing: 2, align: "center" }]
        }),
        createDefaultSignPanel({
          id: "turn-l2",
          name: "Left Advance Turn (US-23)",
          mountSlot: "left-arm",
          xOffset: -0.52,
          yOffset: -1.78,
          shape: "rounded-rect",
          width: 0.68,
          height: 0.6,
          cornerRadius: 0.04,
          colorPreset: "regulatory-white",
          bgColor: "#ECEAE2",
          borderColor: "#181818",
          textColor: "#181818",
          lines: [],
          arrowType: "advance-left",
          arrowPosition: "center",
          arrowScale: 1.1
        }),
        createDefaultSignPanel({
          id: "ends-r2",
          name: "ENDS Plaque",
          mountSlot: "right-arm",
          xOffset: 0.52,
          yOffset: -1.78,
          shape: "rounded-rect",
          width: 0.68,
          height: 0.6,
          cornerRadius: 0.04,
          colorPreset: "regulatory-white",
          bgColor: "#ECEAE2",
          borderColor: "#181818",
          textColor: "#181818",
          fontFamily: "HighwayGothicCond",
          lines: [{ id: "1", text: "ENDS", fontSize: 118, letterSpacing: 2, align: "center" }]
        })
      ]
    }
  },
  {
    id: "tpl-tokyo-expressway",
    title: "Japanese Expressway Cantilever",
    subtitle: "Bilingual NEXCO Expressway Gantry + Junction Tab",
    region: "Japan \u2022 NEXCO",
    assembly: {
      seed: "EXPRESS-TOKYO-C3-E14",
      presetId: "tpl-tokyo-expressway",
      environment: "sunset-expressway",
      structure: {
        structureType: "cantilever",
        poleProfile: "square-perforated",
        poleMaterial: "concrete-grey",
        baseType: "guardrail",
        poleHeight: 6,
        poleRadius: 0.18,
        gantrySpan: 8.8,
        hasLuminaires: false,
        hasCatwalk: false,
        showRoadBase: true,
        weathering: 0.1
      },
      signs: [
        createDefaultSignPanel({
          id: "jp-left",
          name: "C3 Gaikan Exp (Misato / Koya)",
          mountSlot: "gantry-left",
          xOffset: -2.02,
          yOffset: 0,
          shape: "rounded-rect",
          width: 2.65,
          height: 1.5,
          cornerRadius: 0.08,
          colorPreset: "freeway-green",
          bgColor: "#1E613B",
          borderColor: "#F0F4F1",
          textColor: "#F0F4F1",
          fontFamily: "NotoSansJP",
          showFaceBolts: false,
          badges: [{ id: "jp1", type: "jp-expressway", number: "C3", header: "\u5916\u74B0 GAIKAN EXP" }],
          lines: [
            { id: "1", text: "\u4E09\u90F7  \u9AD8\u8C37", fontSize: 74, letterSpacing: 4, align: "center" },
            { id: "2", text: "Misato   Koya", fontSize: 44, letterSpacing: 2, align: "center" }
          ],
          arrowType: "up-left",
          arrowPosition: "left",
          arrowScale: 1.05,
          exitTab: {
            enabled: true,
            text: "1-1 \u4EAC\u8449JCT",
            subText: "Keiyo",
            align: "right",
            widthRatio: 0.48
          }
        }),
        createDefaultSignPanel({
          id: "jp-mid",
          name: "Keiyo-Ichikawa Exit",
          mountSlot: "gantry-center",
          xOffset: 0,
          yOffset: -0.05,
          shape: "rounded-rect",
          width: 0.88,
          height: 1.05,
          cornerRadius: 0.05,
          colorPreset: "freeway-green",
          bgColor: "#1E613B",
          borderColor: "#F0F4F1",
          textColor: "#F0F4F1",
          fontFamily: "NotoSansJP",
          showFaceBolts: false,
          lines: [
            { id: "1", text: "\u4EAC\u8449\u5E02\u5DDD", fontSize: 54, letterSpacing: 1, align: "center" },
            { id: "2", text: "Keiyo-Ichikawa", fontSize: 32, letterSpacing: 0, align: "center" },
            { id: "3", text: "\u51FA\u53E3\u30FBPA", fontSize: 48, letterSpacing: 1, align: "center", color: "#8CE99A" },
            { id: "4", text: "EXIT", fontSize: 36, letterSpacing: 2, align: "center" }
          ],
          arrowType: "up",
          arrowPosition: "top",
          arrowScale: 0.65
        }),
        createDefaultSignPanel({
          id: "jp-right",
          name: "E14 Keiyo Exp (Chiba / Narita)",
          mountSlot: "gantry-right",
          xOffset: 2.02,
          yOffset: 0,
          shape: "rounded-rect",
          width: 2.65,
          height: 1.5,
          cornerRadius: 0.08,
          colorPreset: "freeway-green",
          bgColor: "#1E613B",
          borderColor: "#F0F4F1",
          textColor: "#F0F4F1",
          fontFamily: "NotoSansJP",
          showFaceBolts: false,
          badges: [{ id: "jp2", type: "jp-expressway", number: "E14", header: "\u4EAC\u8449\u9053\u8DEF KEIYO EXP" }],
          lines: [
            { id: "1", text: "\u5343\u8449  \u6210\u7530", fontSize: 74, letterSpacing: 4, align: "center" },
            { id: "2", text: "Chiba   Narita", fontSize: 44, letterSpacing: 2, align: "center" }
          ],
          arrowType: "up",
          arrowPosition: "right",
          arrowScale: 1.05
        })
      ]
    }
  },
  {
    id: "tpl-autobahn-portal",
    title: "German Autobahn A4 Portal",
    subtitle: "Blue Overhead Portal Gantry in DIN 1451",
    region: "Germany \u2022 StVO",
    assembly: {
      seed: "AUTOBAHN-A4-BERLIN-ERFURT",
      presetId: "tpl-autobahn-portal",
      environment: "countryside-day",
      structure: {
        structureType: "portal-gantry",
        poleProfile: "square-perforated",
        poleMaterial: "concrete-grey",
        baseType: "guardrail",
        poleHeight: 5.9,
        poleRadius: 0.16,
        gantrySpan: 9.6,
        hasLuminaires: false,
        hasCatwalk: false,
        showRoadBase: true,
        weathering: 0.08
      },
      signs: [
        createDefaultSignPanel({
          id: "de-main",
          name: "Autobahn A4 Main Board",
          mountSlot: "gantry-center",
          xOffset: 0,
          yOffset: 0.1,
          shape: "rounded-rect",
          width: 5.2,
          height: 2.1,
          cornerRadius: 0.06,
          colorPreset: "autobahn-blue",
          bgColor: "#00519E",
          borderColor: "#F8FAFC",
          textColor: "#F8FAFC",
          fontFamily: "DIN1451",
          showFaceBolts: false,
          dividerLine: "vertical-split",
          badges: [
            { id: "a4-1", type: "autobahn-hex", number: "4" },
            { id: "a4-2", type: "autobahn-hex", number: "4", direction: "500 m" }
          ],
          lines: [
            { id: "1", text: "Berlin  Dresden | Waltershausen", fontSize: 54, letterSpacing: 1, align: "center" },
            { id: "2", text: "Erfurt | Friedrichroda", fontSize: 54, letterSpacing: 1, align: "center" },
            { id: "3", text: "Gotha-Boxberg | Bad Tabarz", fontSize: 50, letterSpacing: 1, align: "center" },
            { id: "4", text: " | Mechterst\xE4dt", fontSize: 50, letterSpacing: 1, align: "center" }
          ],
          arrowType: "autobahn-fork",
          arrowPosition: "left",
          arrowScale: 1.1
        })
      ]
    }
  },
  {
    id: "tpl-dual-ibeam",
    title: "Dual I-Beam Guide Stack",
    subtitle: "Twin I-Beam Breakaway Posts + Split Guide Sign",
    region: "USA \u2022 Highway Guide",
    assembly: {
      seed: "HWY-I182-YAKIMA-RICHLAND",
      presetId: "tpl-dual-ibeam",
      environment: "desert-highway",
      structure: {
        structureType: "dual-post",
        poleProfile: "i-beam",
        poleMaterial: "galvanized",
        baseType: "breakaway-slip",
        poleHeight: 5,
        poleRadius: 0.08,
        gantrySpan: 3.2,
        hasLuminaires: false,
        hasCatwalk: false,
        showRoadBase: true,
        weathering: 0.1
      },
      signs: [
        createDefaultSignPanel({
          id: "wa-upper",
          name: "I-182 West to I-82 Yakima",
          mountSlot: "center",
          yOffset: 0.98,
          shape: "rounded-rect",
          width: 2.9,
          height: 1.45,
          cornerRadius: 0.1,
          colorPreset: "freeway-green",
          bgColor: "#007A53",
          borderColor: "#F5F7F6",
          textColor: "#F5F7F6",
          fontFamily: "HighwayGothicExp",
          showFaceBolts: false,
          badges: [
            { id: "w1", type: "interstate", number: "182", header: "INTERSTATE", direction: "WEST TO" },
            { id: "w2", type: "interstate", number: "82", header: "INTERSTATE" }
          ],
          lines: [{ id: "1", text: "Yakima", fontSize: 80, letterSpacing: 3, align: "center" }],
          arrowType: "up",
          arrowPosition: "left",
          arrowScale: 1
        }),
        createDefaultSignPanel({
          id: "wa-lower",
          name: "I-182 / US-12 East Richland",
          mountSlot: "center",
          yOffset: -0.58,
          shape: "rounded-rect",
          width: 2.9,
          height: 1.55,
          cornerRadius: 0.1,
          colorPreset: "freeway-green",
          bgColor: "#007A53",
          borderColor: "#F5F7F6",
          textColor: "#F5F7F6",
          fontFamily: "HighwayGothicExp",
          showFaceBolts: false,
          badges: [
            { id: "w3", type: "interstate", number: "182", header: "INTERSTATE" },
            { id: "w4", type: "us-route", number: "12", direction: "EAST" }
          ],
          lines: [
            { id: "1", text: "Richland", fontSize: 74, letterSpacing: 2, align: "center" },
            { id: "2", text: "Walla Walla", fontSize: 74, letterSpacing: 2, align: "center" }
          ],
          arrowType: "right",
          arrowPosition: "right",
          arrowScale: 0.9
        })
      ]
    }
  },
  {
    id: "tpl-curve-advisory",
    title: "Curve Warning + 30 MPH Plaque",
    subtitle: "Warning Diamond + Advisory Speed Plaque on U-Channel",
    region: "USA \u2022 MUTCD W1-1",
    assembly: {
      seed: "MUTCD-TURN-30MPH",
      presetId: "tpl-curve-advisory",
      environment: "misty-autumn",
      structure: {
        structureType: "single-post",
        poleProfile: "u-channel",
        poleMaterial: "weathered-steel",
        baseType: "direct-embed",
        poleHeight: 3.6,
        poleRadius: 0.05,
        gantrySpan: 5,
        hasLuminaires: false,
        hasCatwalk: false,
        showRoadBase: true,
        weathering: 0.18
      },
      signs: [
        createDefaultSignPanel({
          id: "curve-diamond",
          name: "90\xB0 Left Turn Warning",
          mountSlot: "center",
          yOffset: 0.85,
          shape: "diamond",
          width: 1.05,
          height: 1.05,
          cornerRadius: 0.07,
          colorPreset: "warning-yellow",
          bgColor: "#FDB813",
          borderColor: "#141414",
          textColor: "#141414",
          showFaceBolts: true,
          lines: [],
          arrowType: "turn-left-90",
          arrowPosition: "center",
          arrowScale: 1.15
        }),
        createDefaultSignPanel({
          id: "advisory-30",
          name: "30 MPH Advisory Plaque",
          mountSlot: "center",
          yOffset: -0.25,
          shape: "rounded-rect",
          width: 0.76,
          height: 0.76,
          cornerRadius: 0.05,
          colorPreset: "warning-yellow",
          bgColor: "#FDB813",
          borderColor: "#141414",
          textColor: "#141414",
          fontFamily: "HighwayGothicWide",
          showFaceBolts: true,
          lines: [
            { id: "1", text: "30", fontSize: 145, letterSpacing: 2, align: "center" },
            { id: "2", text: "MPH", fontSize: 64, letterSpacing: 5, align: "center" }
          ]
        })
      ]
    }
  },
  {
    id: "tpl-euro-triangle",
    title: "European Warning Triangle",
    subtitle: "Vienna Convention Red-Border Warning Sign",
    region: "Europe / UK \u2022 TSRGD",
    assembly: {
      seed: "VISTA-EURO-SIDE-ROAD",
      presetId: "tpl-euro-triangle",
      environment: "countryside-day",
      structure: {
        structureType: "single-post",
        poleProfile: "round-steel",
        poleMaterial: "galvanized",
        baseType: "direct-embed",
        poleHeight: 3.4,
        poleRadius: 0.055,
        gantrySpan: 5,
        hasLuminaires: false,
        hasCatwalk: false,
        showRoadBase: true,
        weathering: 0.06
      },
      signs: [
        createDefaultSignPanel({
          id: "uk-tri",
          name: "Side Road Right Triangle",
          mountSlot: "center",
          yOffset: 0.65,
          shape: "triangle-up",
          width: 1.25,
          height: 1.15,
          cornerRadius: 0.08,
          colorPreset: "euro-warning",
          bgColor: "#F4F6F8",
          borderColor: "#D61F26",
          textColor: "#111315",
          borderWidth: 0.1,
          borderInset: 0,
          showFaceBolts: false,
          lines: [],
          pictogramType: "t-junction-right",
          pictogramPosition: "center",
          pictogramScale: 1.1
        })
      ]
    }
  }
];

// src/utils/prng.ts
function hashSeedString(str) {
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
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}
var SeededRNG = class {
  constructor(seedInput) {
    __publicField(this, "state");
    const clean = seedInput.trim() || "ROADSIGN-2026";
    this.state = hashSeedString(clean);
    if (this.state === 0) this.state = 123456789;
  }
  next() {
    let t = this.state += 1831565813;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  range(min, max) {
    return min + this.next() * (max - min);
  }
  int(min, max) {
    return Math.floor(this.range(min, max + 1));
  }
  pick(items) {
    return items[Math.floor(this.next() * items.length)];
  }
  bool(probability = 0.5) {
    return this.next() < probability;
  }
};
var SEED_PREFIXES = ["HWY", "MUTCD", "GANTRY", "ROUTE", "APEX", "SIGN", "METRO", "EXPRESS", "VISTA"];
function createRandomSeedCode() {
  const prefix = SEED_PREFIXES[Math.floor(Math.random() * SEED_PREFIXES.length)];
  const num = Math.floor(1e3 + Math.random() * 9e3);
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${num}-${suffix}`;
}
var US_CITIES = [
  ["Savannah", "Macon"],
  ["Yakima", "Richland"],
  ["Sacramento", "San Francisco"],
  ["Portland", "Seattle"],
  ["Phoenix", "Tucson"],
  ["Denver", "Boulder"],
  ["Austin", "San Antonio"],
  ["Chicago", "Milwaukee"],
  ["Salt Lake City", "Ogden"],
  ["Reno", "Tahoe"],
  ["Tremont Ave", "Lynes Pkwy"],
  ["Downtown", "Harding Ave"]
];
var GERMAN_CITIES = [
  ["Berlin  Dresden | Waltershausen", "Erfurt | Friedrichroda", "Gotha-Boxberg | Bad Tabarz"],
  ["M\xFCnchen  Stuttgart | Augsburg-Ost", "Augsburg | Friedberg", "Ulm-West | Dasing"],
  ["Hamburg  Bremen | Bad Fallingbostel", "Hannover | Walsrode", "L\xFCbeck | Soltau-S\xFCd"],
  ["Frankfurt  K\xF6ln", "Wiesbaden", "Mainz-S\xFCd"]
];
var JAPAN_DESTINATIONS = [
  { badge: "C3", badgeSub: "\u5916\u74B0 GAIKAN EXP", jp: "\u4E09\u90F7  \u9AD8\u8C37", en: "Misato   Koya", jct: "1-1 \u4EAC\u8449JCT" },
  { badge: "E14", badgeSub: "\u4EAC\u8449\u9053\u8DEF KEIYO EXP", jp: "\u5343\u8449  \u6210\u7530", en: "Chiba   Narita", jct: "2-3 \u5BAE\u91CE\u6728JCT" },
  { badge: "E1", badgeSub: "\u6771\u540D TOMEI EXP", jp: "\u6A2A\u6D5C  \u9759\u5CA1", en: "Yokohama Shizuoka", jct: "3-1 \u6D77\u8001\u540DJCT" },
  { badge: "C1", badgeSub: "\u90FD\u5FC3\u74B0\u72B6 SHUTO EXP", jp: "\u6E0B\u8C37  \u65B0\u5BBF", en: "Shibuya  Shinjuku", jct: "4-2 \u8C37\u753AJCT" }
];
function generateSignAssemblyFromSeed(seed) {
  const rng = new SeededRNG(seed);
  const structures = [
    "single-post",
    "single-post",
    "dual-post",
    "route-tree",
    "cantilever",
    "portal-gantry",
    "truss-gantry"
  ];
  const structureType = rng.pick(structures);
  const profiles = [
    "round-steel",
    "square-perforated",
    "i-beam",
    "u-channel",
    "wood-post",
    "octagonal-mast"
  ];
  const materials = [
    "galvanized",
    "aluminum",
    "weathered-steel",
    "charcoal-coat",
    "dot-green",
    "wood-cedar",
    "concrete-grey",
    "corten-rust"
  ];
  const bases = [
    "bolted-flange",
    "breakaway-slip",
    "crash-barrels",
    "guardrail",
    "direct-embed"
  ];
  const environments = [
    "pastel-studio",
    "desert-highway",
    "sunset-expressway",
    "misty-autumn",
    "countryside-day"
  ];
  const sheetings = [
    "diamond-cubed",
    "high-intensity",
    "engineer-grade",
    "matte-enamel"
  ];
  const isOverhead = structureType === "cantilever" || structureType === "portal-gantry" || structureType === "truss-gantry";
  const poleProfile = isOverhead ? rng.pick(["round-steel", "square-perforated", "octagonal-mast"]) : rng.pick(profiles);
  const poleMaterial = poleProfile === "wood-post" ? "wood-cedar" : rng.pick(materials.filter((m) => m !== "wood-cedar"));
  const baseType = isOverhead ? rng.pick(["bolted-flange", "crash-barrels", "guardrail"]) : rng.pick(bases);
  const poleHeight = isOverhead ? Number(rng.range(5.6, 6.6).toFixed(2)) : structureType === "route-tree" ? Number(rng.range(4.8, 5.6).toFixed(2)) : Number(rng.range(3.3, 4.6).toFixed(2));
  const poleRadius = isOverhead ? Number(rng.range(0.12, 0.18).toFixed(3)) : Number(rng.range(0.05, 0.08).toFixed(3));
  const gantrySpan = isOverhead ? Number(rng.range(8.5, 11.8).toFixed(1)) : structureType === "dual-post" ? Number(rng.range(2.6, 3.4).toFixed(1)) : 2.2;
  const weathering = Number(rng.range(0.03, 0.35).toFixed(2));
  const environment = rng.pick(environments);
  const signs = [];
  if (isOverhead) {
    const overheadTheme = rng.pick(["us-guide", "us-guide", "jp-express", "de-autobahn"]);
    if (overheadTheme === "de-autobahn") {
      const cityGroup = rng.pick(GERMAN_CITIES);
      const routeNum = String(rng.int(1, 99));
      const dist = rng.pick(["500 m", "800 m", "1000 m", "2 km"]);
      signs.push(
        createDefaultSignPanel({
          id: `sign-${rng.int(100, 999)}`,
          name: `Autobahn A${routeNum} Portal`,
          mountSlot: "gantry-center",
          xOffset: 0,
          yOffset: 0,
          shape: "rounded-rect",
          width: Number(rng.range(4.4, 5.4).toFixed(2)),
          height: Number(rng.range(1.85, 2.2).toFixed(2)),
          cornerRadius: 0.07,
          colorPreset: "autobahn-blue",
          bgColor: "#00519E",
          borderColor: "#F8FAFC",
          textColor: "#F8FAFC",
          fontFamily: rng.pick(["DIN1451", "DIN1451Cond"]),
          sheetingType: rng.pick(sheetings),
          showFaceBolts: false,
          wearAmount: weathering,
          dividerLine: "vertical-split",
          badges: [
            { id: "b1", type: "autobahn-hex", number: routeNum },
            { id: "b2", type: "autobahn-hex", number: routeNum, direction: dist }
          ],
          lines: cityGroup.map((t, idx) => ({
            id: `l-${idx}`,
            text: t,
            fontSize: 56,
            letterSpacing: 1,
            align: "center"
          })),
          arrowType: "autobahn-fork",
          arrowPosition: "left",
          arrowScale: 1.05
        })
      );
    } else if (overheadTheme === "jp-express") {
      const panelCount = rng.int(2, 3);
      const slots = panelCount === 2 ? ["gantry-left", "gantry-right"] : ["gantry-left", "gantry-center", "gantry-right"];
      const xPositions = panelCount === 2 ? [-1.55, 1.55] : [-2.05, 0, 2.05];
      slots.forEach((slot, idx) => {
        const jpData = rng.pick(JAPAN_DESTINATIONS);
        const isNarrowMid = panelCount === 3 && idx === 1;
        signs.push(
          createDefaultSignPanel({
            id: `jp-${idx}-${rng.int(10, 99)}`,
            name: isNarrowMid ? "Exit Info Panel" : `${jpData.badge} Expressway Panel`,
            mountSlot: slot,
            xOffset: xPositions[idx],
            yOffset: 0,
            shape: "rounded-rect",
            width: isNarrowMid ? 0.95 : 2.55,
            height: isNarrowMid ? 1.15 : 1.5,
            cornerRadius: 0.08,
            colorPreset: "freeway-green",
            bgColor: "#1E613B",
            borderColor: "#F0F4F1",
            textColor: "#F0F4F1",
            fontFamily: "NotoSansJP",
            sheetingType: rng.pick(sheetings),
            showFaceBolts: false,
            wearAmount: weathering,
            badges: isNarrowMid ? [] : [{ id: `jb-${idx}`, type: "jp-expressway", number: jpData.badge, header: jpData.badgeSub }],
            lines: isNarrowMid ? [
              { id: "1", text: "\u51FA\u53E3\u30FBPA", fontSize: 56, letterSpacing: 2, align: "center", color: "#8CE99A" },
              { id: "2", text: "EXIT", fontSize: 42, letterSpacing: 2, align: "center" }
            ] : [
              { id: "1", text: jpData.jp, fontSize: 72, letterSpacing: 4, align: "center" },
              { id: "2", text: jpData.en, fontSize: 44, letterSpacing: 2, align: "center" }
            ],
            arrowType: rng.pick(["up", "up-left", "up-right"]),
            arrowPosition: idx === 0 ? "left" : "right",
            arrowScale: 1,
            exitTab: {
              enabled: idx === 0 && rng.bool(0.75),
              text: jpData.jct,
              subText: "JCT",
              align: "right",
              widthRatio: 0.48
            }
          })
        );
      });
    } else {
      const panelCount = rng.int(2, 3);
      const slots = panelCount === 2 ? ["gantry-left", "gantry-right"] : ["gantry-left", "gantry-center", "gantry-right"];
      const tempPanels = [];
      slots.forEach((slot, idx) => {
        const cities = rng.pick(US_CITIES);
        const route1 = String(rng.int(5, 295));
        const route2 = String(rng.int(1, 99));
        const exitNum = rng.int(1, 88);
        const cardinal = rng.pick(["NORTH", "SOUTH", "EAST", "WEST"]);
        tempPanels.push(
          createDefaultSignPanel({
            id: `us-gantry-${idx}-${rng.int(10, 99)}`,
            name: `${cities[0]} Guide Panel`,
            mountSlot: slot,
            xOffset: 0,
            yOffset: 0,
            shape: "rounded-rect",
            width: Number(rng.range(2.25, 2.75).toFixed(2)),
            height: Number(rng.range(1.6, 1.95).toFixed(2)),
            cornerRadius: 0.1,
            colorPreset: "freeway-green",
            bgColor: "#006B54",
            borderColor: "#F4F6F8",
            textColor: "#F4F6F8",
            fontFamily: rng.pick(["HighwayGothicExp", "Overpass"]),
            sheetingType: rng.pick(sheetings),
            showFaceBolts: false,
            wearAmount: weathering,
            badges: [
              { id: `b1-${idx}`, type: "interstate", number: route1, header: "INTERSTATE" },
              ...rng.bool(0.6) ? [{ id: `b2-${idx}`, type: "us-route", number: route2, direction: cardinal }] : []
            ],
            lines: cities.map((c, lIdx) => ({
              id: `l-${lIdx}`,
              text: c,
              fontSize: 68,
              letterSpacing: 2,
              align: "center"
            })),
            arrowType: rng.pick(["down", "up-right", "up", "right"]),
            arrowPosition: rng.pick(["bottom", "right"]),
            arrowScale: 0.95,
            exitTab: {
              enabled: rng.bool(0.65),
              text: `EXIT ${exitNum}`,
              align: rng.pick(["center", "right"]),
              widthRatio: Number(rng.range(0.38, 0.48).toFixed(2))
            }
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
  } else if (structureType === "route-tree") {
    const topRoute = String(rng.int(10, 99));
    signs.push(
      createDefaultSignPanel({
        id: "tree-top",
        name: `State Route ${topRoute} Diamond`,
        mountSlot: "center",
        yOffset: 1.75,
        shape: "diamond",
        width: 0.74,
        height: 0.74,
        cornerRadius: 0.05,
        colorPreset: "regulatory-white",
        bgColor: "#F2F0E8",
        borderColor: "#16181D",
        textColor: "#16181D",
        fontFamily: "HighwayGothicWide",
        headerText: rng.pick(["M", "SR", "RT"]),
        lines: [{ id: "1", text: topRoute, fontSize: 120, letterSpacing: 2, align: "center" }]
      }),
      createDefaultSignPanel({
        id: "tree-left-1",
        name: "Left Interstate Shield",
        mountSlot: "left-arm",
        xOffset: -0.52,
        yOffset: 0.55,
        shape: "interstate-shield",
        width: 0.8,
        height: 0.8,
        colorPreset: "interstate-classic",
        bgColor: "#003F87",
        borderColor: "#F8FAFC",
        textColor: "#F8FAFC",
        accentColor: "#C8102E",
        fontFamily: "HighwayGothicWide",
        headerText: "INTERSTATE",
        lines: [{ id: "1", text: String(rng.int(10, 95)), fontSize: 150, letterSpacing: 2, align: "center" }]
      }),
      createDefaultSignPanel({
        id: "tree-right-1",
        name: "Right US Shield",
        mountSlot: "right-arm",
        xOffset: 0.52,
        yOffset: 0.55,
        shape: "us-route-shield",
        width: 0.8,
        height: 0.78,
        colorPreset: "regulatory-white",
        bgColor: "#F2F0E8",
        borderColor: "#16181D",
        textColor: "#16181D",
        fontFamily: "HighwayGothicWide",
        headerText: "HIGHWAY",
        subHeaderText: "U S",
        lines: [{ id: "1", text: String(rng.int(1, 99)), fontSize: 145, letterSpacing: 2, align: "center" }]
      }),
      createDefaultSignPanel({
        id: "tree-left-2",
        name: "Left Turn Plaque",
        mountSlot: "left-arm",
        xOffset: -0.52,
        yOffset: -0.25,
        shape: "rounded-rect",
        width: 0.68,
        height: 0.58,
        cornerRadius: 0.04,
        colorPreset: "regulatory-white",
        bgColor: "#F2F0E8",
        borderColor: "#16181D",
        textColor: "#16181D",
        lines: [],
        arrowType: rng.pick(["advance-left", "left", "up-left"]),
        arrowPosition: "center",
        arrowScale: 1.1
      }),
      createDefaultSignPanel({
        id: "tree-right-2",
        name: "Right Turn Plaque",
        mountSlot: "right-arm",
        xOffset: 0.52,
        yOffset: -0.25,
        shape: "rounded-rect",
        width: 0.68,
        height: 0.58,
        cornerRadius: 0.04,
        colorPreset: "regulatory-white",
        bgColor: "#F2F0E8",
        borderColor: "#16181D",
        textColor: "#16181D",
        lines: [{ id: "1", text: rng.pick(["ENDS", "NORTH", "EAST", "TOLL"]), fontSize: 105, letterSpacing: 2, align: "center" }]
      })
    );
  } else if (structureType === "dual-post") {
    const cities = rng.pick(US_CITIES);
    const r1 = String(rng.int(10, 195));
    const r2 = String(rng.int(5, 90));
    signs.push(
      createDefaultSignPanel({
        id: "dual-top",
        name: `${cities[0]} Upper Panel`,
        mountSlot: "center",
        yOffset: 0.9,
        shape: "rounded-rect",
        width: 2.8,
        height: 1.4,
        cornerRadius: 0.1,
        colorPreset: "freeway-green",
        bgColor: "#006B54",
        borderColor: "#F4F6F8",
        textColor: "#F4F6F8",
        fontFamily: "HighwayGothicExp",
        badges: [{ id: "db1", type: "interstate", number: r1, header: "INTERSTATE", direction: "WEST TO" }],
        lines: [{ id: "1", text: cities[0], fontSize: 78, letterSpacing: 3, align: "center" }],
        arrowType: "up",
        arrowPosition: "left",
        arrowScale: 1
      }),
      createDefaultSignPanel({
        id: "dual-bot",
        name: `${cities[1]} Lower Panel`,
        mountSlot: "center",
        yOffset: -0.52,
        shape: "rounded-rect",
        width: 2.8,
        height: 1.4,
        cornerRadius: 0.1,
        colorPreset: "freeway-green",
        bgColor: "#006B54",
        borderColor: "#F4F6F8",
        textColor: "#F4F6F8",
        fontFamily: "HighwayGothicExp",
        badges: [{ id: "db2", type: "us-route", number: r2, direction: "EAST" }],
        lines: [{ id: "1", text: cities[1], fontSize: 78, letterSpacing: 3, align: "center" }],
        arrowType: "right",
        arrowPosition: "right",
        arrowScale: 0.95
      })
    );
  } else {
    const archetype = rng.pick(["interstate-stack", "warning-advisory", "motorist-service", "euro-triangle", "one-way-stack"]);
    if (archetype === "interstate-stack") {
      const routeNum = String(rng.int(5, 95));
      const dir = rng.pick(["WEST", "EAST", "NORTH", "SOUTH"]);
      signs.push(
        createDefaultSignPanel({
          id: "s-top",
          name: "Freeway Entrance",
          mountSlot: "center",
          yOffset: 1.1,
          shape: "rounded-rect",
          width: 1.75,
          height: 0.9,
          colorPreset: "freeway-green",
          bgColor: "#006B54",
          borderColor: "#F4F6F8",
          textColor: "#F4F6F8",
          fontFamily: "HighwayGothic",
          lines: [
            { id: "1", text: "FREEWAY", fontSize: 90, letterSpacing: 5, align: "center" },
            { id: "2", text: "ENTRANCE", fontSize: 90, letterSpacing: 5, align: "center" }
          ]
        }),
        createDefaultSignPanel({
          id: "s-dir",
          name: `${dir} Cardinal Plaque`,
          mountSlot: "center",
          yOffset: 0.34,
          shape: "rounded-rect",
          width: 0.98,
          height: 0.46,
          colorPreset: "motorist-blue",
          bgColor: "#003F87",
          borderColor: "#F4F6F8",
          textColor: "#F4F6F8",
          fontFamily: "HighwayGothicCond",
          lines: [{ id: "1", text: dir, fontSize: 125, letterSpacing: 4, align: "center" }]
        }),
        createDefaultSignPanel({
          id: "s-shield",
          name: `Interstate ${routeNum} Shield`,
          mountSlot: "center",
          yOffset: -0.42,
          shape: "interstate-shield",
          width: 1,
          height: 1,
          colorPreset: "interstate-classic",
          bgColor: "#003F87",
          borderColor: "#F4F6F8",
          textColor: "#F4F6F8",
          accentColor: "#C8102E",
          fontFamily: "HighwayGothicWide",
          headerText: "INTERSTATE",
          lines: [{ id: "1", text: routeNum, fontSize: 165, letterSpacing: 2, align: "center" }]
        }),
        createDefaultSignPanel({
          id: "s-arrow",
          name: "Arrow Plaque",
          mountSlot: "center",
          yOffset: -1.28,
          shape: "rounded-rect",
          width: 0.88,
          height: 0.62,
          colorPreset: "motorist-blue",
          bgColor: "#003F87",
          borderColor: "#F4F6F8",
          textColor: "#F4F6F8",
          lines: [],
          arrowType: rng.pick(["down-left", "up-right", "left", "right"]),
          arrowPosition: "center",
          arrowScale: 1.15
        })
      );
    } else if (archetype === "warning-advisory") {
      const speed = rng.pick(["15", "25", "30", "35", "45", "50"]);
      const useArrow = rng.bool(0.6);
      const picto = rng.pick(["deer", "slippery", "t-junction-right", "crossroads", "merge", "pedestrian", "steep-grade"]);
      signs.push(
        createDefaultSignPanel({
          id: "w-main",
          name: "Warning Diamond",
          mountSlot: "center",
          yOffset: 0.82,
          shape: "diamond",
          width: 1.05,
          height: 1.05,
          cornerRadius: 0.07,
          colorPreset: "warning-yellow",
          bgColor: "#F5C400",
          borderColor: "#141619",
          textColor: "#141619",
          lines: [],
          arrowType: useArrow ? rng.pick(["turn-left-90", "turn-right-90", "s-curve-left"]) : "none",
          arrowPosition: "center",
          arrowScale: 1.15,
          pictogramType: useArrow ? "none" : picto,
          pictogramPosition: "center",
          pictogramScale: 1.1
        }),
        createDefaultSignPanel({
          id: "w-sub",
          name: `${speed} MPH Plaque`,
          mountSlot: "center",
          yOffset: -0.18,
          shape: "rounded-rect",
          width: 0.76,
          height: 0.76,
          cornerRadius: 0.05,
          colorPreset: "warning-yellow",
          bgColor: "#F5C400",
          borderColor: "#141619",
          textColor: "#141619",
          fontFamily: "HighwayGothicWide",
          lines: [
            { id: "1", text: speed, fontSize: 145, letterSpacing: 2, align: "center" },
            { id: "2", text: "MPH", fontSize: 64, letterSpacing: 5, align: "center" }
          ]
        })
      );
    } else if (archetype === "motorist-service") {
      const dist = rng.int(12, 165);
      const service = rng.pick(["NEXT GAS", "REST AREA", "SCENIC VIEW", "FOOD & LODGING"]);
      const preset = rng.pick([COLOR_PRESETS[1], COLOR_PRESETS[11]]);
      signs.push(
        createDefaultSignPanel({
          id: "srv-main",
          name: `${service} Sign`,
          mountSlot: "center",
          yOffset: 0.65,
          shape: "rounded-rect",
          width: 1.85,
          height: 1.42,
          cornerRadius: 0.09,
          colorPreset: preset.id,
          bgColor: preset.bgColor,
          borderColor: preset.borderColor,
          textColor: preset.textColor,
          fontFamily: "HighwayGothicWide",
          lines: [
            { id: "1", text: service, fontSize: 72, letterSpacing: 4, align: "center" },
            { id: "2", text: String(dist), fontSize: 90, letterSpacing: 4, align: "center" },
            { id: "3", text: "MILES", fontSize: 74, letterSpacing: 5, align: "center" }
          ]
        })
      );
    } else if (archetype === "euro-triangle") {
      const picto = rng.pick([
        "t-junction-right",
        "t-junction-left",
        "crossroads",
        "deer",
        "slippery",
        "roadwork",
        "roundabout",
        "pedestrian"
      ]);
      signs.push(
        createDefaultSignPanel({
          id: "eu-tri",
          name: "Euro Warning Triangle",
          mountSlot: "center",
          yOffset: 0.7,
          shape: "triangle-up",
          width: 1.22,
          height: 1.12,
          cornerRadius: 0.08,
          colorPreset: "euro-warning",
          bgColor: "#F6F7F9",
          borderColor: "#D61F26",
          textColor: "#141619",
          borderWidth: 0.095,
          borderInset: 0,
          showFaceBolts: false,
          lines: [],
          pictogramType: picto,
          pictogramPosition: "center",
          pictogramScale: 1.1
        })
      );
    } else {
      signs.push(
        createDefaultSignPanel({
          id: "ow-top",
          name: "One Way Sign",
          mountSlot: "center",
          yOffset: 1.05,
          shape: "rounded-rect",
          width: 1.75,
          height: 0.6,
          cornerRadius: 0.05,
          colorPreset: "oneway-dark",
          bgColor: "#1D2228",
          borderColor: "#F2F0E8",
          textColor: "#1D2228",
          accentColor: "#F2F0E8",
          fontFamily: "HighwayGothic",
          lines: [{ id: "1", text: "ONE WAY", fontSize: 95, letterSpacing: 6, align: "center" }],
          arrowType: rng.pick(["one-way-right", "one-way-left"]),
          arrowPosition: "background-box",
          arrowScale: 1
        }),
        createDefaultSignPanel({
          id: "ow-stop",
          name: "Regulatory Stop Octagon",
          mountSlot: "center",
          yOffset: 0.1,
          shape: "octagon",
          width: 0.95,
          height: 0.95,
          cornerRadius: 0.04,
          colorPreset: "stop-red",
          bgColor: "#C41E24",
          borderColor: "#F8FAFC",
          textColor: "#F8FAFC",
          fontFamily: "HighwayGothicCond",
          lines: [{ id: "1", text: "STOP", fontSize: 135, letterSpacing: 6, align: "center" }]
        })
      );
    }
  }
  let finalGantrySpan = gantrySpan;
  if (isOverhead && signs.length > 0) {
    let minX = Infinity;
    let maxX = -Infinity;
    for (const s of signs) {
      minX = Math.min(minX, s.xOffset - s.width * s.scale / 2);
      maxX = Math.max(maxX, s.xOffset + s.width * s.scale / 2);
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
      weathering
    },
    signs
  };
}

// src/utils/geometryBuilder.ts
import * as THREE2 from "three";

// src/utils/textureRenderer.ts
import * as THREE from "three";
var customImageCache = /* @__PURE__ */ new Map();
function getCSSFontStack(fontFamily) {
  switch (fontFamily) {
    case "HighwayGothicExp":
      return '"HighwayGothicExp", "Overpass", sans-serif';
    case "HighwayGothic":
      return '"HighwayGothic", "Overpass", sans-serif';
    case "HighwayGothicWide":
      return '"HighwayGothicWide", "Overpass", sans-serif';
    case "HighwayGothicCond":
      return '"HighwayGothicCond", "Overpass", sans-serif';
    case "HighwayGothicNarrow":
      return '"HighwayGothicNarrow", "Overpass", sans-serif';
    case "DIN1451":
      return '"DIN1451", "Public Sans", sans-serif';
    case "DIN1451Cond":
      return '"DIN1451Cond", "Public Sans", sans-serif';
    case "Overpass":
      return '"Overpass", sans-serif';
    case "NotoSansJP":
      return '"Noto Sans JP", "HighwayGothic", sans-serif';
    default:
      return '"HighwayGothicExp", "Overpass", sans-serif';
  }
}
function drawRoundedRectPath(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
function drawInterstateShieldPath(ctx, cx, cy, w, h) {
  const left = cx - w / 2;
  const right = cx + w / 2;
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  ctx.beginPath();
  ctx.moveTo(left + w * 0.1, top + h * 0.04);
  ctx.quadraticCurveTo(cx - w * 0.2, top + h * 0.11, cx, top + h * 0.04);
  ctx.quadraticCurveTo(cx + w * 0.2, top + h * 0.11, right - w * 0.1, top + h * 0.04);
  ctx.bezierCurveTo(
    right + w * 0.04,
    top + h * 0.35,
    right - w * 0.02,
    top + h * 0.78,
    cx,
    bottom - h * 0.02
  );
  ctx.bezierCurveTo(
    left + w * 0.02,
    top + h * 0.78,
    left - w * 0.04,
    top + h * 0.35,
    left + w * 0.1,
    top + h * 0.04
  );
  ctx.closePath();
}
function drawUSShieldPath(ctx, cx, cy, w, h) {
  const left = cx - w / 2;
  const right = cx + w / 2;
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  ctx.beginPath();
  ctx.moveTo(left + w * 0.14, top + h * 0.04);
  ctx.quadraticCurveTo(cx - w * 0.18, top + h * 0.11, cx, top + h * 0.04);
  ctx.quadraticCurveTo(cx + w * 0.18, top + h * 0.11, right - w * 0.14, top + h * 0.04);
  ctx.lineTo(right - w * 0.02, top + h * 0.2);
  ctx.quadraticCurveTo(right - w * 0.1, top + h * 0.36, right - w * 0.03, top + h * 0.56);
  ctx.quadraticCurveTo(right - w * 0.04, bottom - h * 0.1, cx + w * 0.18, bottom - h * 0.08);
  ctx.quadraticCurveTo(cx + w * 0.05, bottom - h * 0.08, cx, bottom - h * 0.02);
  ctx.quadraticCurveTo(cx - w * 0.05, bottom - h * 0.08, cx - w * 0.18, bottom - h * 0.08);
  ctx.quadraticCurveTo(left + w * 0.04, bottom - h * 0.1, left + w * 0.03, top + h * 0.56);
  ctx.quadraticCurveTo(left + w * 0.1, top + h * 0.36, left + w * 0.02, top + h * 0.2);
  ctx.closePath();
}
function drawPolygonPath(ctx, pts, cornerRadius) {
  if (pts.length < 3) return;
  ctx.beginPath();
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
    const r = Math.min(cornerRadius, l1 * 0.35, l2 * 0.35);
    const p1x = curr[0] + v1x / l1 * r;
    const p1y = curr[1] + v1y / l1 * r;
    const p2x = curr[0] + v2x / l2 * r;
    const p2y = curr[1] + v2y / l2 * r;
    if (i === 0) {
      ctx.moveTo(p1x, p1y);
    } else {
      ctx.lineTo(p1x, p1y);
    }
    ctx.quadraticCurveTo(curr[0], curr[1], p2x, p2y);
  }
  ctx.closePath();
}
function drawShapeContour(ctx, shape, w, h, inset, cornerRadiusPx) {
  const x = inset;
  const y = inset;
  const sw = Math.max(4, w - inset * 2);
  const sh = Math.max(4, h - inset * 2);
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.max(2, cornerRadiusPx - inset * 0.65);
  switch (shape) {
    case "rounded-rect":
    case "chevron-rect":
    case "diamond":
      if (shape === "diamond") {
        drawPolygonPath(
          ctx,
          [
            [cx, y],
            [x + sw, cy],
            [cx, y + sh],
            [x, cy]
          ],
          r
        );
      } else {
        drawRoundedRectPath(ctx, x, y, sw, sh, r);
      }
      break;
    case "circle":
      ctx.beginPath();
      ctx.ellipse(cx, cy, sw / 2, sh / 2, 0, 0, Math.PI * 2);
      ctx.closePath();
      break;
    case "octagon": {
      const k = 0.29289;
      drawPolygonPath(
        ctx,
        [
          [x + sw * k, y],
          [x + sw * (1 - k), y],
          [x + sw, y + sh * k],
          [x + sw, y + sh * (1 - k)],
          [x + sw * (1 - k), y + sh],
          [x + sw * k, y + sh],
          [x, y + sh * (1 - k)],
          [x, y + sh * k]
        ],
        r * 0.35
      );
      break;
    }
    case "triangle-up":
      drawPolygonPath(
        ctx,
        [
          [cx, y + sh * 0.03],
          [x + sw * 0.97, y + sh * 0.95],
          [x + sw * 0.03, y + sh * 0.95]
        ],
        r * 1.05
      );
      break;
    case "triangle-down":
      drawPolygonPath(
        ctx,
        [
          [x + sw * 0.03, y + sh * 0.05],
          [x + sw * 0.97, y + sh * 0.05],
          [cx, y + sh * 0.97]
        ],
        r * 1.05
      );
      break;
    case "pentagon":
      drawPolygonPath(
        ctx,
        [
          [cx, y + sh * 0.03],
          [x + sw * 0.97, y + sh * 0.42],
          [x + sw * 0.82, y + sh * 0.96],
          [x + sw * 0.18, y + sh * 0.96],
          [x + sw * 0.03, y + sh * 0.42]
        ],
        r * 0.65
      );
      break;
    case "pennant":
      drawPolygonPath(
        ctx,
        [
          [x + sw * 0.04, y + sh * 0.06],
          [x + sw * 0.96, cy],
          [x + sw * 0.04, y + sh * 0.94]
        ],
        r * 0.75
      );
      break;
    case "interstate-shield":
      drawInterstateShieldPath(ctx, cx, cy, sw, sh);
      break;
    case "us-route-shield":
      drawUSShieldPath(ctx, cx, cy, sw, sh);
      break;
  }
}
function drawRetroreflectiveSheeting(ctx, sheeting, w, h) {
  ctx.save();
  if (sheeting === "diamond-cubed") {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = Math.max(1, h / 420);
    const step = Math.max(6, Math.round(h / 95));
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(0, 0, 0, 0.04)";
    for (let x = -h; x < w + h; x += step * 3) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h * 0.5, h);
      ctx.stroke();
    }
  } else if (sheeting === "high-intensity") {
    const step = Math.max(12, Math.round(h / 55));
    ctx.strokeStyle = "rgba(255, 255, 255, 0.055)";
    ctx.lineWidth = 1;
    for (let x = -h; x < w + h; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h * 0.58, h);
      ctx.moveTo(x + h * 0.58, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
  } else if (sheeting === "engineer-grade") {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "rgba(255,255,255,0.06)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.0)");
    grad.addColorStop(1, "rgba(0,0,0,0.06)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}
function drawWeatheringOverlay(ctx, wear, w, h) {
  if (wear <= 0.01) return;
  ctx.save();
  const rad = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.25,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.72
  );
  rad.addColorStop(0, "rgba(0,0,0,0)");
  rad.addColorStop(1, `rgba(38, 30, 22, ${Math.min(0.4, wear * 0.52)})`);
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, w, h);
  const streakCount = Math.floor(wear * 30);
  ctx.fillStyle = `rgba(25, 20, 15, ${wear * 0.1})`;
  for (let i = 0; i < streakCount; i++) {
    const sx = (i * 97 + 31) % 100 * 0.01 * w;
    const sw = 2 + i % 4 * 2;
    ctx.fillRect(sx, 0, sw, h);
  }
  ctx.restore();
}
function measureTrackedTextWidth(ctx, text, trackingPx) {
  if (!text) return 0;
  const chars = Array.from(text);
  let total = 0;
  for (const ch of chars) {
    total += ctx.measureText(ch).width;
  }
  total += trackingPx * Math.max(0, chars.length - 1);
  return total;
}
function drawTextWithTracking(ctx, text, x, y, trackingPx, align = "center", maxWidth) {
  if (!text) return;
  ctx.save();
  let effectiveTracking = trackingPx;
  const initialWidth = measureTrackedTextWidth(ctx, text, effectiveTracking);
  if (maxWidth && maxWidth > 10 && initialWidth > maxWidth) {
    const scaleFactor = maxWidth / initialWidth;
    const fontMatch = ctx.font.match(/(\d+(?:\.\d+)?)px/);
    if (fontMatch) {
      const origPx = parseFloat(fontMatch[1]);
      const nextPx = Math.max(10, Math.floor(origPx * scaleFactor));
      ctx.font = ctx.font.replace(/(\d+(?:\.\d+)?)px/, `${nextPx}px`);
      effectiveTracking = effectiveTracking * scaleFactor;
    }
  }
  const chars = Array.from(text);
  let totalWidth = 0;
  const widths = chars.map((ch) => {
    const w = ctx.measureText(ch).width;
    totalWidth += w;
    return w;
  });
  totalWidth += effectiveTracking * Math.max(0, chars.length - 1);
  let cursorX = x;
  if (align === "center") cursorX = x - totalWidth / 2;
  else if (align === "right") cursorX = x - totalWidth;
  ctx.textAlign = "left";
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], cursorX, y);
    cursorX += widths[i] + effectiveTracking;
  }
  ctx.restore();
}
function getInlineBadgeBaseWidth(badge, size) {
  if (badge.type === "jp-expressway") {
    const numW = size * 1.05;
    const labelW = badge.header ? size * 2.15 : 0;
    return numW + labelW;
  }
  if (badge.type === "autobahn-hex") {
    return size * 1.25;
  }
  if (badge.type === "arkansas-shield" || badge.type === "state-rect") {
    return size * 1.15;
  }
  return size * 1.05;
}
function drawInlineBadge(ctx, badge, cx, cy, size, fontStack) {
  ctx.save();
  if (badge.type === "interstate" || badge.type === "business-loop") {
    const isBus = badge.type === "business-loop";
    const sw = size * 1.05;
    const sh = size * 1.05;
    drawInterstateShieldPath(ctx, cx, cy, sw, sh);
    ctx.fillStyle = "#F8FAFC";
    ctx.fill();
    ctx.save();
    drawInterstateShieldPath(ctx, cx, cy, sw * 0.9, sh * 0.9);
    ctx.clip();
    ctx.fillStyle = isBus ? "#005A40" : "#C8102E";
    ctx.fillRect(cx - sw, cy - sh / 2, sw * 2, sh * 0.3);
    ctx.fillStyle = isBus ? "#005A40" : "#003F87";
    ctx.fillRect(cx - sw, cy - sh * 0.2, sw * 2, sh);
    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(cx - sw, cy - sh * 0.21, sw * 2, sh * 0.035);
    ctx.fillStyle = "#F8FAFC";
    ctx.font = `700 ${Math.round(sh * 0.125)}px "HighwayGothicCond", sans-serif`;
    ctx.textBaseline = "middle";
    drawTextWithTracking(
      ctx,
      badge.header || (isBus ? "BUSINESS" : "INTERSTATE"),
      cx,
      cy - sh * 0.31,
      1,
      "center",
      sw * 0.72
    );
    const numFontSize = badge.number.length >= 3 ? sh * 0.42 : sh * 0.52;
    ctx.font = `700 ${Math.round(numFontSize)}px "HighwayGothicWide", sans-serif`;
    drawTextWithTracking(ctx, badge.number, cx, cy + sh * 0.12, 1, "center", sw * 0.78);
    ctx.restore();
  } else if (badge.type === "us-route") {
    const sw = size * 1.05;
    const sh = size * 1.02;
    drawUSShieldPath(ctx, cx, cy, sw, sh);
    ctx.fillStyle = "#F8FAFC";
    ctx.fill();
    ctx.lineWidth = Math.max(2, size * 0.04);
    ctx.strokeStyle = "#141619";
    ctx.stroke();
    ctx.fillStyle = "#141619";
    const numFontSize = badge.number.length >= 3 ? sh * 0.44 : sh * 0.54;
    ctx.font = `700 ${Math.round(numFontSize)}px "HighwayGothicWide", sans-serif`;
    ctx.textBaseline = "middle";
    drawTextWithTracking(ctx, badge.number, cx, cy + sh * 0.04, 1, "center", sw * 0.78);
  } else if (badge.type === "arkansas-shield" || badge.type === "state-rect") {
    const sw = size * 1.15;
    const sh = size * 0.92;
    drawRoundedRectPath(ctx, cx - sw / 2, cy - sh / 2, sw, sh, size * 0.12);
    ctx.fillStyle = "#F8FAFC";
    ctx.fill();
    ctx.fillStyle = "#141619";
    ctx.font = `700 ${Math.round(sh * 0.55)}px "HighwayGothicWide", sans-serif`;
    ctx.textBaseline = "middle";
    drawTextWithTracking(ctx, badge.number, cx, cy + sh * 0.03, 1, "center", sw * 0.84);
  } else if (badge.type === "jp-expressway") {
    const boxH = size * 0.88;
    const numW = size * 1.05;
    const labelW = badge.header ? size * 2.15 : 0;
    const totalW = numW + labelW;
    const startX = cx - totalW / 2;
    drawRoundedRectPath(ctx, startX, cy - boxH / 2, totalW, boxH, size * 0.08);
    ctx.fillStyle = "#F4F6F8";
    ctx.fill();
    const pad = size * 0.055;
    drawRoundedRectPath(
      ctx,
      startX + pad,
      cy - boxH / 2 + pad,
      numW - pad * 2,
      boxH - pad * 2,
      size * 0.05
    );
    ctx.fillStyle = "#1B5E3A";
    ctx.fill();
    ctx.fillStyle = "#F4F6F8";
    ctx.font = `700 ${Math.round(boxH * 0.54)}px "HighwayGothicWide", sans-serif`;
    ctx.textBaseline = "middle";
    drawTextWithTracking(
      ctx,
      badge.number,
      startX + numW / 2,
      cy + boxH * 0.03,
      1,
      "center",
      numW * 0.82
    );
    if (badge.header) {
      const parts = badge.header.split(" ");
      const kanji = parts[0] || "";
      const romaji = parts.slice(1).join(" ");
      ctx.fillStyle = "#1B5E3A";
      ctx.font = `700 ${Math.round(boxH * 0.4)}px ${fontStack}`;
      drawTextWithTracking(
        ctx,
        kanji,
        startX + numW + labelW / 2,
        romaji ? cy - boxH * 0.14 : cy,
        2,
        "center",
        labelW * 0.88
      );
      if (romaji) {
        ctx.font = `700 ${Math.round(boxH * 0.23)}px "HighwayGothic", sans-serif`;
        drawTextWithTracking(
          ctx,
          romaji,
          startX + numW + labelW / 2,
          cy + boxH * 0.24,
          1,
          "center",
          labelW * 0.88
        );
      }
    }
  } else if (badge.type === "autobahn-hex") {
    const sw = size * 1.25;
    const sh = size * 0.72;
    const pts = [
      [cx - sw * 0.38, cy - sh / 2],
      [cx + sw * 0.38, cy - sh / 2],
      [cx + sw / 2, cy],
      [cx + sw * 0.38, cy + sh / 2],
      [cx - sw * 0.38, cy + sh / 2],
      [cx - sw / 2, cy]
    ];
    drawPolygonPath(ctx, pts, size * 0.04);
    ctx.fillStyle = "#F8FAFC";
    ctx.fill();
    const inW = sw * 0.88;
    const inH = sh * 0.82;
    drawPolygonPath(
      ctx,
      [
        [cx - inW * 0.38, cy - inH / 2],
        [cx + inW * 0.38, cy - inH / 2],
        [cx + inW / 2, cy],
        [cx + inW * 0.38, cy + inH / 2],
        [cx - inW * 0.38, cy + inH / 2],
        [cx - inW / 2, cy]
      ],
      size * 0.03
    );
    ctx.fillStyle = "#00519E";
    ctx.fill();
    ctx.fillStyle = "#F8FAFC";
    ctx.font = `700 ${Math.round(sh * 0.6)}px "DIN1451", sans-serif`;
    ctx.textBaseline = "middle";
    drawTextWithTracking(ctx, badge.number, cx, cy + sh * 0.03, 1, "center", inW * 0.75);
  }
  ctx.restore();
}
function drawArrowGraphic(ctx, type, cx, cy, size, color, panelW, panelH) {
  if (type === "none") return;
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (type === "one-way-right" || type === "one-way-left") {
    const dir = type === "one-way-right" ? 1 : -1;
    const aw = panelW * 0.84;
    const ah = panelH * 0.72;
    const barH = ah * 0.56;
    const headLen = aw * 0.26;
    ctx.translate(cx, cy);
    ctx.scale(dir, 1);
    ctx.beginPath();
    ctx.moveTo(-aw / 2, -barH / 2);
    ctx.lineTo(aw / 2 - headLen, -barH / 2);
    ctx.lineTo(aw / 2 - headLen, -ah / 2);
    ctx.lineTo(aw / 2, 0);
    ctx.lineTo(aw / 2 - headLen, ah / 2);
    ctx.lineTo(aw / 2 - headLen, barH / 2);
    ctx.lineTo(-aw / 2, barH / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }
  if (type === "autobahn-fork") {
    const h = Math.min(panelH * 0.68, size * 1.85);
    const stemW = Math.max(6, size * 0.12);
    const leftStemX = -size * 0.34;
    const rightStemX = size * 0.02;
    ctx.translate(cx, cy);
    ctx.fillRect(leftStemX - stemW / 2, -h * 0.3, stemW, h * 0.74);
    ctx.beginPath();
    ctx.moveTo(leftStemX, -h * 0.46);
    ctx.lineTo(leftStemX - stemW * 1.75, -h * 0.25);
    ctx.lineTo(leftStemX + stemW * 1.75, -h * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(rightStemX - stemW / 2, -h * 0.3, stemW, h * 0.74);
    ctx.beginPath();
    ctx.moveTo(rightStemX, -h * 0.46);
    ctx.lineTo(rightStemX - stemW * 1.75, -h * 0.25);
    ctx.lineTo(rightStemX + stemW * 1.75, -h * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = stemW;
    ctx.beginPath();
    ctx.moveTo(rightStemX, h * 0.34);
    ctx.quadraticCurveTo(rightStemX + size * 0.08, h * 0.12, rightStemX + size * 0.34, h * 0.02);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rightStemX + size * 0.46, -h * 0.04);
    ctx.lineTo(rightStemX + size * 0.24, -h * 0.06);
    ctx.lineTo(rightStemX + size * 0.33, h * 0.14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }
  ctx.translate(cx, cy);
  if (type === "turn-left-90" || type === "turn-right-90") {
    const dir = type === "turn-left-90" ? 1 : -1;
    ctx.scale(dir, 1);
    const sw = size * 0.24;
    ctx.lineWidth = sw;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(size * 0.22, size * 0.42);
    ctx.lineTo(size * 0.22, -size * 0.05);
    ctx.quadraticCurveTo(size * 0.22, -size * 0.22, size * 0.05, -size * 0.22);
    ctx.lineTo(-size * 0.18, -size * 0.22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-size * 0.46, -size * 0.22);
    ctx.lineTo(-size * 0.1, -size * 0.48);
    ctx.lineTo(-size * 0.15, -size * 0.22);
    ctx.lineTo(-size * 0.1, size * 0.04);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }
  if (type === "advance-left" || type === "advance-right") {
    const dir = type === "advance-left" ? 1 : -1;
    ctx.scale(dir, 1);
    const sw = size * 0.22;
    ctx.lineWidth = sw;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(size * 0.22, -size * 0.18);
    ctx.lineTo(size * 0.22, size * 0.26);
    ctx.lineTo(-size * 0.18, size * 0.26);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.22, -size * 0.46);
    ctx.lineTo(-size * 0.02, -size * 0.12);
    ctx.lineTo(size * 0.46, -size * 0.12);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-size * 0.46, size * 0.26);
    ctx.lineTo(-size * 0.12, size * 0.04);
    ctx.lineTo(-size * 0.12, size * 0.48);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }
  if (type === "s-curve-left") {
    const sw = size * 0.2;
    ctx.lineWidth = sw;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(size * 0.18, size * 0.44);
    ctx.bezierCurveTo(
      size * 0.18,
      size * 0.05,
      -size * 0.2,
      size * 0.05,
      -size * 0.2,
      -size * 0.22
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, -size * 0.48);
    ctx.lineTo(-size * 0.44, -size * 0.14);
    ctx.lineTo(size * 0.04, -size * 0.14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }
  if (type === "u-turn") {
    const sw = size * 0.2;
    ctx.lineWidth = sw;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(size * 0.24, size * 0.42);
    ctx.lineTo(size * 0.24, -size * 0.12);
    ctx.arc(0, -size * 0.12, size * 0.24, 0, Math.PI, true);
    ctx.lineTo(-size * 0.24, size * 0.16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-size * 0.24, size * 0.44);
    ctx.lineTo(-size * 0.48, size * 0.12);
    ctx.lineTo(0, size * 0.12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }
  const angleMap = {
    up: 0,
    "up-right": Math.PI * 0.25,
    right: Math.PI * 0.5,
    "down-right": Math.PI * 0.75,
    down: Math.PI,
    "down-left": -Math.PI * 0.75,
    left: -Math.PI * 0.5,
    "up-left": -Math.PI * 0.25
  };
  ctx.rotate(angleMap[type] ?? 0);
  const shaftW = size * 0.24;
  const shaftH = size * 0.52;
  const headW = size * 0.68;
  const headH = size * 0.44;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.46);
  ctx.lineTo(headW / 2, -size * 0.46 + headH);
  ctx.lineTo(shaftW / 2, -size * 0.46 + headH * 0.85);
  ctx.lineTo(shaftW / 2, -size * 0.46 + headH * 0.8 + shaftH);
  ctx.lineTo(-shaftW / 2, -size * 0.46 + headH * 0.8 + shaftH);
  ctx.lineTo(-shaftW / 2, -size * 0.46 + headH * 0.85);
  ctx.lineTo(-headW / 2, -size * 0.46 + headH);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function drawPictogramGraphic(ctx, type, cx, cy, size, color, customUrl) {
  if (type === "none") return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  if (type === "custom-upload" && customUrl) {
    const img = customImageCache.get(customUrl);
    if (img) {
      const aspect = img.width / (img.height || 1);
      const dw = aspect >= 1 ? size : size * aspect;
      const dh = aspect >= 1 ? size / aspect : size;
      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    }
    ctx.restore();
    return;
  }
  switch (type) {
    case "t-junction-right":
    case "t-junction-left": {
      const dir = type === "t-junction-right" ? 1 : -1;
      ctx.scale(dir, 1);
      const mainW = size * 0.26;
      const mainH = size * 0.86;
      ctx.beginPath();
      ctx.moveTo(-mainW * 0.65, -mainH * 0.34);
      ctx.lineTo(-mainW * 0.15, -mainH * 0.5);
      ctx.lineTo(mainW * 0.35, -mainH * 0.34);
      ctx.lineTo(mainW * 0.35, mainH * 0.48);
      ctx.lineTo(-mainW * 0.65, mainH * 0.48);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(mainW * 0.25, -size * 0.04, size * 0.34, size * 0.16);
      break;
    }
    case "crossroads": {
      const w = size * 0.22;
      const l = size * 0.82;
      ctx.fillRect(-w / 2, -l / 2, w, l);
      ctx.fillRect(-l / 2, -w / 2, l, w);
      break;
    }
    case "y-junction": {
      ctx.lineWidth = size * 0.2;
      ctx.lineCap = "butt";
      ctx.beginPath();
      ctx.moveTo(0, size * 0.45);
      ctx.lineTo(0, 0);
      ctx.lineTo(-size * 0.32, -size * 0.38);
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.32, -size * 0.38);
      ctx.stroke();
      break;
    }
    case "merge": {
      ctx.lineWidth = size * 0.16;
      ctx.lineCap = "butt";
      ctx.beginPath();
      ctx.moveTo(-size * 0.12, size * 0.44);
      ctx.lineTo(-size * 0.12, -size * 0.24);
      ctx.moveTo(size * 0.26, size * 0.42);
      ctx.quadraticCurveTo(size * 0.22, size * 0.1, -size * 0.12, -size * 0.02);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-size * 0.12, -size * 0.46);
      ctx.lineTo(-size * 0.34, -size * 0.18);
      ctx.lineTo(size * 0.1, -size * 0.18);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "roundabout": {
      const r = size * 0.28;
      ctx.lineWidth = size * 0.13;
      ctx.lineCap = "round";
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate(i * Math.PI * 2 / 3);
        ctx.beginPath();
        ctx.arc(0, 0, r, -0.3, Math.PI * 0.42);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(r * 1.3, r * 0.15);
        ctx.lineTo(r * 0.95, -r * 0.2);
        ctx.lineTo(r * 0.72, r * 0.22);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      break;
    }
    case "pedestrian": {
      ctx.beginPath();
      ctx.arc(0, -size * 0.32, size * 0.09, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = size * 0.1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.2);
      ctx.lineTo(-size * 0.04, size * 0.05);
      ctx.lineTo(-size * 0.2, size * 0.36);
      ctx.moveTo(-size * 0.04, size * 0.05);
      ctx.lineTo(size * 0.16, size * 0.36);
      ctx.moveTo(-size * 0.22, -size * 0.04);
      ctx.lineTo(0, -size * 0.18);
      ctx.lineTo(size * 0.2, -size * 0.02);
      ctx.stroke();
      break;
    }
    case "deer": {
      ctx.lineWidth = size * 0.08;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.24, size * 0.11, -0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-size * 0.16, -size * 0.02);
      ctx.lineTo(-size * 0.26, -size * 0.24);
      ctx.lineTo(-size * 0.36, -size * 0.22);
      ctx.moveTo(-size * 0.24, -size * 0.24);
      ctx.lineTo(-size * 0.18, -size * 0.38);
      ctx.moveTo(-size * 0.16, size * 0.04);
      ctx.lineTo(-size * 0.34, size * 0.28);
      ctx.moveTo(size * 0.18, size * 0.06);
      ctx.lineTo(size * 0.36, size * 0.32);
      ctx.stroke();
      break;
    }
    case "slippery": {
      drawRoundedRectPath(ctx, -size * 0.22, -size * 0.34, size * 0.44, size * 0.24, size * 0.06);
      ctx.fill();
      ctx.lineWidth = size * 0.07;
      ctx.lineCap = "round";
      for (const ox of [-size * 0.14, size * 0.14]) {
        ctx.beginPath();
        ctx.moveTo(ox, -size * 0.04);
        ctx.bezierCurveTo(
          ox - size * 0.2,
          size * 0.12,
          ox + size * 0.2,
          size * 0.24,
          ox - size * 0.08,
          size * 0.42
        );
        ctx.stroke();
      }
      break;
    }
    case "roadwork": {
      ctx.beginPath();
      ctx.arc(-size * 0.08, -size * 0.3, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = size * 0.09;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-size * 0.08, -size * 0.18);
      ctx.lineTo(-size * 0.14, size * 0.1);
      ctx.lineTo(-size * 0.24, size * 0.36);
      ctx.moveTo(-size * 0.14, size * 0.1);
      ctx.lineTo(0, size * 0.36);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(size * 0.08, size * 0.38);
      ctx.lineTo(size * 0.24, size * 0.14);
      ctx.lineTo(size * 0.4, size * 0.38);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "bicycle": {
      const r = size * 0.16;
      ctx.lineWidth = size * 0.06;
      ctx.beginPath();
      ctx.arc(-size * 0.22, size * 0.12, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(size * 0.22, size * 0.12, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-size * 0.22, size * 0.12);
      ctx.lineTo(-size * 0.04, -size * 0.12);
      ctx.lineTo(size * 0.16, -size * 0.12);
      ctx.lineTo(0, size * 0.12);
      ctx.closePath();
      ctx.moveTo(size * 0.22, size * 0.12);
      ctx.lineTo(size * 0.14, -size * 0.22);
      ctx.stroke();
      break;
    }
    case "airport": {
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.44);
      ctx.lineTo(size * 0.07, -size * 0.28);
      ctx.lineTo(size * 0.07, -size * 0.08);
      ctx.lineTo(size * 0.42, size * 0.08);
      ctx.lineTo(size * 0.42, size * 0.18);
      ctx.lineTo(size * 0.07, size * 0.08);
      ctx.lineTo(size * 0.06, size * 0.28);
      ctx.lineTo(size * 0.2, size * 0.38);
      ctx.lineTo(size * 0.2, size * 0.45);
      ctx.lineTo(0, size * 0.38);
      ctx.lineTo(-size * 0.2, size * 0.45);
      ctx.lineTo(-size * 0.2, size * 0.38);
      ctx.lineTo(-size * 0.06, size * 0.28);
      ctx.lineTo(-size * 0.07, size * 0.08);
      ctx.lineTo(-size * 0.42, size * 0.18);
      ctx.lineTo(-size * 0.42, size * 0.08);
      ctx.lineTo(-size * 0.07, -size * 0.08);
      ctx.lineTo(-size * 0.07, -size * 0.28);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "gas": {
      drawRoundedRectPath(ctx, -size * 0.22, -size * 0.34, size * 0.38, size * 0.68, size * 0.05);
      ctx.fill();
      ctx.clearRect(-size * 0.15, -size * 0.26, size * 0.24, size * 0.18);
      ctx.lineWidth = size * 0.065;
      ctx.beginPath();
      ctx.moveTo(size * 0.16, -size * 0.1);
      ctx.quadraticCurveTo(size * 0.34, -size * 0.1, size * 0.3, size * 0.18);
      ctx.stroke();
      break;
    }
    case "food": {
      ctx.lineWidth = size * 0.07;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-size * 0.16, -size * 0.35);
      ctx.lineTo(-size * 0.16, size * 0.35);
      ctx.moveTo(size * 0.16, -size * 0.35);
      ctx.lineTo(size * 0.16, size * 0.35);
      ctx.stroke();
      ctx.fillRect(-size * 0.24, -size * 0.35, size * 0.16, size * 0.22);
      break;
    }
    case "lodging": {
      ctx.lineWidth = size * 0.08;
      ctx.beginPath();
      ctx.moveTo(-size * 0.38, -size * 0.2);
      ctx.lineTo(-size * 0.38, size * 0.28);
      ctx.moveTo(size * 0.38, -size * 0.05);
      ctx.lineTo(size * 0.38, size * 0.28);
      ctx.moveTo(-size * 0.38, size * 0.1);
      ctx.lineTo(size * 0.38, size * 0.1);
      ctx.stroke();
      break;
    }
    case "hospital":
    case "parking": {
      const letter = type === "hospital" ? "H" : "P";
      ctx.font = `700 ${Math.round(size * 0.85)}px "HighwayGothicWide", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(letter, 0, size * 0.04);
      break;
    }
    case "no-entry": {
      ctx.fillRect(-size * 0.38, -size * 0.11, size * 0.76, size * 0.22);
      break;
    }
    case "steep-grade": {
      ctx.beginPath();
      ctx.moveTo(-size * 0.42, size * 0.34);
      ctx.lineTo(size * 0.42, size * 0.34);
      ctx.lineTo(size * 0.42, -size * 0.12);
      ctx.closePath();
      ctx.fill();
      ctx.save();
      ctx.rotate(-0.45);
      ctx.fillRect(-size * 0.22, -size * 0.28, size * 0.38, size * 0.18);
      ctx.restore();
      break;
    }
  }
  ctx.restore();
}
function renderSignPanelTexture(panel, lod) {
  const maxRes = lod === 0 ? 1536 : lod === 1 ? 768 : 384;
  const trueAspect = Math.max(0.2, Math.min(5, panel.width / Math.max(0.15, panel.height)));
  const canvasW = trueAspect >= 1 ? maxRes : Math.max(128, Math.round(maxRes * trueAspect));
  const canvasH = trueAspect >= 1 ? Math.max(128, Math.round(maxRes / trueAspect)) : maxRes;
  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  const minDim = Math.min(canvasW, canvasH);
  const cornerPx = panel.cornerRadius / Math.min(panel.width, panel.height) * minDim;
  const fontStack = getCSSFontStack(panel.fontFamily);
  ctx.clearRect(0, 0, canvasW, canvasH);
  if (panel.shape === "interstate-shield") {
    const isBus = panel.colorPreset === "business-green";
    drawInterstateShieldPath(ctx, canvasW / 2, canvasH / 2, canvasW * 0.96, canvasH * 0.96);
    ctx.fillStyle = panel.borderColor;
    ctx.fill();
    ctx.save();
    drawInterstateShieldPath(ctx, canvasW / 2, canvasH / 2, canvasW * 0.89, canvasH * 0.89);
    ctx.clip();
    ctx.fillStyle = isBus ? panel.bgColor : panel.accentColor || "#C8102E";
    ctx.fillRect(0, 0, canvasW, canvasH * 0.31);
    ctx.fillStyle = panel.bgColor;
    ctx.fillRect(0, canvasH * 0.31, canvasW, canvasH * 0.7);
    ctx.fillStyle = panel.borderColor;
    ctx.fillRect(0, canvasH * 0.295, canvasW, canvasH * 0.028);
    drawRetroreflectiveSheeting(ctx, panel.sheetingType, canvasW, canvasH);
    if (panel.headerText) {
      ctx.fillStyle = panel.textColor;
      ctx.font = `700 ${Math.round(canvasH * 0.115)}px "HighwayGothicCond", sans-serif`;
      ctx.textBaseline = "middle";
      drawTextWithTracking(
        ctx,
        panel.headerText,
        canvasW / 2,
        canvasH * 0.19,
        3,
        "center",
        canvasW * 0.68
      );
    }
    if (panel.subHeaderText) {
      ctx.fillStyle = panel.textColor;
      ctx.font = `700 ${Math.round(canvasH * 0.072)}px "HighwayGothicCond", sans-serif`;
      ctx.textBaseline = "middle";
      drawTextWithTracking(
        ctx,
        panel.subHeaderText,
        canvasW / 2,
        canvasH * 0.375,
        2,
        "center",
        canvasW * 0.72
      );
    }
    const mainLine = panel.lines[0];
    if (mainLine) {
      ctx.fillStyle = mainLine.color || panel.textColor;
      const fSize = mainLine.fontSize / 100 * canvasH * 0.33;
      ctx.font = `700 ${Math.round(fSize)}px ${fontStack}`;
      ctx.textBaseline = "middle";
      drawTextWithTracking(
        ctx,
        mainLine.text,
        canvasW / 2,
        panel.subHeaderText ? canvasH * 0.64 : canvasH * 0.61,
        mainLine.letterSpacing,
        "center",
        canvasW * 0.75
      );
    }
    drawWeatheringOverlay(ctx, panel.wearAmount, canvasW, canvasH);
    ctx.restore();
  } else if (panel.shape === "us-route-shield") {
    drawRoundedRectPath(ctx, canvasW * 0.02, canvasH * 0.02, canvasW * 0.96, canvasH * 0.96, cornerPx);
    ctx.fillStyle = panel.borderColor;
    ctx.fill();
    drawUSShieldPath(ctx, canvasW / 2, canvasH / 2, canvasW * 0.92, canvasH * 0.92);
    ctx.fillStyle = panel.bgColor;
    ctx.fill();
    ctx.lineWidth = canvasW * 0.025;
    ctx.strokeStyle = panel.borderColor;
    ctx.stroke();
    drawRetroreflectiveSheeting(ctx, panel.sheetingType, canvasW, canvasH);
    if (panel.headerText) {
      ctx.fillStyle = panel.textColor;
      ctx.font = `700 ${Math.round(canvasH * 0.11)}px "HighwayGothicCond", sans-serif`;
      ctx.textBaseline = "middle";
      drawTextWithTracking(
        ctx,
        panel.headerText,
        canvasW / 2,
        canvasH * 0.22,
        2,
        "center",
        canvasW * 0.68
      );
      ctx.fillStyle = panel.borderColor;
      ctx.fillRect(canvasW * 0.1, canvasH * 0.31, canvasW * 0.8, canvasH * 0.02);
    }
    if (panel.subHeaderText) {
      ctx.fillStyle = panel.textColor;
      ctx.font = `700 ${Math.round(canvasH * 0.095)}px "HighwayGothicWide", sans-serif`;
      ctx.textBaseline = "middle";
      drawTextWithTracking(
        ctx,
        panel.subHeaderText,
        canvasW / 2,
        canvasH * 0.39,
        4,
        "center",
        canvasW * 0.72
      );
    }
    const mainLine = panel.lines[0];
    if (mainLine) {
      ctx.fillStyle = mainLine.color || panel.textColor;
      const fSize = mainLine.fontSize / 100 * canvasH * 0.32;
      ctx.font = `700 ${Math.round(fSize)}px ${fontStack}`;
      ctx.textBaseline = "middle";
      drawTextWithTracking(
        ctx,
        mainLine.text,
        canvasW / 2,
        panel.subHeaderText ? canvasH * 0.67 : canvasH * 0.58,
        mainLine.letterSpacing,
        "center",
        canvasW * 0.76
      );
    }
    drawWeatheringOverlay(ctx, panel.wearAmount, canvasW, canvasH);
  } else {
    ctx.fillStyle = panel.bgColor;
    ctx.fillRect(0, 0, canvasW, canvasH);
    const borderPx = Math.max(4, panel.borderWidth * minDim);
    const insetPx = panel.borderInset * minDim;
    if (panel.borderWidth > 2e-3) {
      ctx.save();
      const totalInset = insetPx <= 2 ? borderPx * 0.55 : insetPx + borderPx * 0.5;
      drawShapeContour(ctx, panel.shape, canvasW, canvasH, totalInset, cornerPx);
      ctx.strokeStyle = panel.borderColor;
      ctx.lineWidth = borderPx;
      ctx.stroke();
      ctx.restore();
    }
    drawRetroreflectiveSheeting(ctx, panel.sheetingType, canvasW, canvasH);
    if (panel.arrowType !== "none" && panel.arrowPosition === "background-box") {
      drawArrowGraphic(
        ctx,
        panel.arrowType,
        canvasW / 2,
        canvasH / 2,
        minDim * 0.65 * panel.arrowScale,
        panel.accentColor || "#F4F6F8",
        canvasW,
        canvasH
      );
    }
    const safeMargin = insetPx + borderPx + minDim * 0.045;
    let contentTop = safeMargin;
    let contentBottom = canvasH - safeMargin;
    let contentLeft = safeMargin;
    let contentRight = canvasW - safeMargin;
    if (panel.shape === "diamond") {
      contentTop = canvasH * 0.22;
      contentBottom = canvasH * 0.78;
      contentLeft = canvasW * 0.22;
      contentRight = canvasW * 0.78;
    } else if (panel.shape === "triangle-up") {
      contentTop = canvasH * 0.36;
      contentBottom = canvasH * 0.86;
      contentLeft = canvasW * 0.24;
      contentRight = canvasW * 0.76;
    } else if (panel.shape === "triangle-down") {
      contentTop = canvasH * 0.14;
      contentBottom = canvasH * 0.64;
      contentLeft = canvasW * 0.24;
      contentRight = canvasW * 0.76;
    }
    const hasTextOrBadges = panel.lines.length > 0 || panel.badges.length > 0 || Boolean(panel.headerText);
    if (panel.arrowType !== "none" && panel.arrowPosition !== "background-box") {
      const arrowSize = minDim * 0.26 * Math.min(1.35, panel.arrowScale);
      const effectivePos = panel.arrowPosition === "center" && hasTextOrBadges ? "bottom" : panel.arrowPosition;
      if (effectivePos === "center") {
        drawArrowGraphic(
          ctx,
          panel.arrowType,
          canvasW / 2,
          canvasH / 2,
          minDim * 0.52 * panel.arrowScale,
          panel.textColor,
          canvasW,
          canvasH
        );
      } else if (effectivePos === "bottom") {
        const ay = contentBottom - arrowSize * 0.52;
        drawArrowGraphic(
          ctx,
          panel.arrowType,
          (contentLeft + contentRight) / 2,
          ay,
          arrowSize,
          panel.textColor,
          canvasW,
          canvasH
        );
        contentBottom = ay - arrowSize * 0.65;
      } else if (effectivePos === "top") {
        const ay = contentTop + arrowSize * 0.52;
        drawArrowGraphic(
          ctx,
          panel.arrowType,
          (contentLeft + contentRight) / 2,
          ay,
          arrowSize,
          panel.textColor,
          canvasW,
          canvasH
        );
        contentTop = ay + arrowSize * 0.65;
      } else if (effectivePos === "left") {
        const isFork = panel.arrowType === "autobahn-fork";
        const colW = isFork ? Math.max(arrowSize * 1.45, (contentRight - contentLeft) * 0.2) : arrowSize * 1.32;
        const ax = contentLeft + colW * 0.48;
        drawArrowGraphic(
          ctx,
          panel.arrowType,
          ax,
          (contentTop + contentBottom) / 2,
          isFork ? arrowSize * 1.05 : arrowSize,
          panel.textColor,
          colW,
          contentBottom - contentTop
        );
        contentLeft += colW + minDim * 0.03;
      } else if (effectivePos === "right") {
        const isFork = panel.arrowType === "autobahn-fork";
        const colW = isFork ? Math.max(arrowSize * 1.45, (contentRight - contentLeft) * 0.2) : arrowSize * 1.32;
        const ax = contentRight - colW * 0.48;
        drawArrowGraphic(
          ctx,
          panel.arrowType,
          ax,
          (contentTop + contentBottom) / 2,
          isFork ? arrowSize * 1.05 : arrowSize,
          panel.textColor,
          colW,
          contentBottom - contentTop
        );
        contentRight -= colW + minDim * 0.03;
      }
    }
    if (panel.pictogramType !== "none") {
      const pictoSize = (hasTextOrBadges ? minDim * 0.3 : minDim * 0.46) * Math.min(1.3, panel.pictogramScale);
      const effectivePictoPos = panel.pictogramPosition === "center" && hasTextOrBadges ? "top" : panel.pictogramPosition;
      let px = (contentLeft + contentRight) / 2;
      let py = (contentTop + contentBottom) / 2;
      if (panel.shape === "triangle-up" && !hasTextOrBadges) py = canvasH * 0.6;
      else if (panel.shape === "triangle-down" && !hasTextOrBadges) py = canvasH * 0.4;
      else if (effectivePictoPos === "top") {
        py = contentTop + pictoSize * 0.52;
        contentTop = py + pictoSize * 0.62;
      } else if (effectivePictoPos === "left") {
        px = contentLeft + pictoSize * 0.52;
        contentLeft = px + pictoSize * 0.62;
      } else if (effectivePictoPos === "right") {
        px = contentRight - pictoSize * 0.52;
        contentRight = px - pictoSize * 0.62;
      }
      drawPictogramGraphic(
        ctx,
        panel.pictogramType,
        px,
        py,
        pictoSize,
        panel.textColor,
        panel.customImageUrl
      );
    }
    const lineThick = Math.max(4, minDim * 0.016);
    const hasTwoColumnLines = panel.dividerLine === "vertical-split" && panel.lines.some((l) => l.text.includes("|") || /\s{4,}/.test(l.text.trim()));
    if (panel.dividerLine === "vertical-split" && !hasTwoColumnLines) {
      ctx.fillStyle = panel.borderColor;
      const divX = contentLeft > safeMargin + minDim * 0.05 ? contentLeft - minDim * 0.015 : contentRight < canvasW - safeMargin - minDim * 0.05 ? contentRight + minDim * 0.015 : contentLeft + (contentRight - contentLeft) * 0.22;
      ctx.fillRect(divX - lineThick * 0.35, safeMargin, lineThick * 0.7, canvasH - safeMargin * 2);
      if (divX > contentLeft && divX < (contentLeft + contentRight) / 2) {
        contentLeft = divX + minDim * 0.03;
      }
    }
    if (panel.headerText) {
      ctx.fillStyle = panel.textColor;
      ctx.font = `700 ${Math.round(minDim * 0.105)}px ${fontStack}`;
      ctx.textBaseline = "middle";
      drawTextWithTracking(
        ctx,
        panel.headerText,
        (contentLeft + contentRight) / 2,
        contentTop + minDim * 0.055,
        3,
        "center",
        (contentRight - contentLeft) * 0.92
      );
      contentTop += minDim * 0.125;
    }
    if (panel.badges && panel.badges.length > 0) {
      const isAutobahnBottom = panel.badges.some((b) => b.type === "autobahn-hex");
      const zoneW = Math.max(60, contentRight - contentLeft);
      if (isAutobahnBottom) {
        const badgeSize = Math.min(minDim * 0.17, zoneW * 0.22);
        const badgeY = contentBottom - badgeSize * 0.45;
        const itemCount = panel.badges.length;
        const colStep = zoneW / Math.max(1, itemCount);
        panel.badges.forEach((b, idx) => {
          const slotLeft = contentLeft + idx * colStep;
          const slotCenter = slotLeft + colStep * 0.5;
          const bw = getInlineBadgeBaseWidth(b, badgeSize);
          if (b.direction) {
            ctx.fillStyle = panel.textColor;
            ctx.font = `700 ${Math.round(badgeSize * 0.48)}px ${fontStack}`;
            ctx.textBaseline = "middle";
            const dirW = measureTrackedTextWidth(ctx, b.direction, 2);
            const totalItemW = bw + badgeSize * 0.22 + dirW;
            const startX = slotCenter - totalItemW / 2;
            drawInlineBadge(ctx, b, startX + bw / 2, badgeY, badgeSize, fontStack);
            drawTextWithTracking(
              ctx,
              b.direction,
              startX + bw + badgeSize * 0.22,
              badgeY,
              2,
              "left",
              colStep * 0.55
            );
          } else {
            drawInlineBadge(ctx, b, slotCenter, badgeY, badgeSize, fontStack);
          }
        });
        contentBottom = badgeY - badgeSize * 0.65;
      } else {
        let badgeSize = Math.min(minDim * 0.25, zoneW * 0.3);
        const gap = badgeSize * 0.24;
        const measureRow = (sz) => {
          ctx.font = `700 ${Math.round(sz * 0.36)}px ${fontStack}`;
          let sum = 0;
          panel.badges.forEach((b, i) => {
            const bw = getInlineBadgeBaseWidth(b, sz);
            const dw = b.direction ? measureTrackedTextWidth(ctx, b.direction, 2) + sz * 0.22 : 0;
            sum += bw + dw + (i > 0 ? sz * 0.24 : 0);
          });
          return sum;
        };
        const rawRowW = measureRow(badgeSize);
        if (rawRowW > zoneW * 0.94) {
          badgeSize *= zoneW * 0.94 / rawRowW;
        }
        const finalRowW = measureRow(badgeSize);
        const badgeY = contentTop + badgeSize * 0.52;
        let cursorX = (contentLeft + contentRight) / 2 - finalRowW / 2;
        panel.badges.forEach((b) => {
          const bw = getInlineBadgeBaseWidth(b, badgeSize);
          const badgeCx = cursorX + bw / 2;
          drawInlineBadge(ctx, b, badgeCx, badgeY, badgeSize, fontStack);
          cursorX += bw;
          if (b.direction) {
            ctx.fillStyle = panel.textColor;
            ctx.font = `700 ${Math.round(badgeSize * 0.36)}px ${fontStack}`;
            ctx.textBaseline = "middle";
            const dw = measureTrackedTextWidth(ctx, b.direction, 2);
            drawTextWithTracking(
              ctx,
              b.direction,
              cursorX + badgeSize * 0.14,
              badgeY,
              2,
              "left"
            );
            cursorX += dw + badgeSize * 0.22;
          }
          cursorX += gap;
        });
        contentTop += badgeSize * 1.12;
      }
    }
    if (panel.dividerLine === "header-split") {
      ctx.fillStyle = panel.borderColor;
      const splitY = contentTop + lineThick;
      ctx.fillRect(contentLeft, splitY, contentRight - contentLeft, lineThick);
      contentTop = splitY + lineThick * 2.2;
    }
    if (panel.lines.length > 0) {
      const zoneCenterX = (contentLeft + contentRight) / 2;
      const zoneWidth = Math.max(40, contentRight - contentLeft);
      const availableH = Math.max(minDim * 0.18, contentBottom - contentTop);
      const lineCount = panel.lines.length;
      const lineStep = availableH / lineCount;
      if (panel.dividerLine === "horizontal-middle" && lineCount >= 2) {
        const midIdx = Math.ceil(lineCount / 2);
        const divY = contentTop + lineStep * midIdx;
        ctx.fillStyle = panel.borderColor;
        ctx.fillRect(contentLeft, divY - lineThick / 2, zoneWidth, lineThick);
      }
      if (hasTwoColumnLines) {
        const splitX = zoneCenterX;
        ctx.fillStyle = panel.borderColor;
        ctx.fillRect(splitX - lineThick * 0.35, safeMargin, lineThick * 0.7, canvasH - safeMargin * 2);
        const colPad = minDim * 0.03;
        const leftColW = splitX - colPad - contentLeft;
        const rightColW = contentRight - (splitX + colPad);
        const leftColCx = contentLeft + leftColW / 2;
        const rightColCx = splitX + colPad + rightColW / 2;
        panel.lines.forEach((line, idx) => {
          ctx.fillStyle = line.color || panel.textColor;
          const maxLineFontH = lineStep * 0.76;
          const requestedPx = line.fontSize / 100 * minDim * 0.22;
          const pxSize = Math.round(Math.min(requestedPx, maxLineFontH));
          ctx.font = `700 ${pxSize}px ${fontStack}`;
          ctx.textBaseline = "middle";
          const ly = contentTop + lineStep * (idx + 0.5);
          const raw = line.text;
          let leftPart = "";
          let rightPart = "";
          if (raw.includes("|")) {
            const parts = raw.split("|");
            leftPart = parts[0].trim();
            rightPart = parts.slice(1).join(" ").trim();
          } else if (/^\s{4,}/.test(raw)) {
            rightPart = raw.trim();
          } else {
            const parts = raw.trim().split(/\s{4,}/);
            leftPart = parts[0] || "";
            rightPart = parts.slice(1).join("   ") || "";
          }
          if (leftPart) {
            drawTextWithTracking(ctx, leftPart, leftColCx, ly, line.letterSpacing, "center", leftColW * 0.92);
          }
          if (rightPart) {
            drawTextWithTracking(ctx, rightPart, rightColCx, ly, line.letterSpacing, "center", rightColW * 0.92);
          }
        });
      } else {
        panel.lines.forEach((line, idx) => {
          ctx.fillStyle = line.color || panel.textColor;
          const maxLineFontH = lineStep * 0.78;
          const requestedPx = line.fontSize / 100 * minDim * 0.22;
          const pxSize = Math.round(Math.min(requestedPx, maxLineFontH));
          ctx.font = `700 ${pxSize}px ${fontStack}`;
          ctx.textBaseline = "middle";
          const ly = contentTop + lineStep * (idx + 0.5);
          let lx = zoneCenterX;
          if (line.align === "left") lx = contentLeft + zoneWidth * 0.03;
          else if (line.align === "right") lx = contentRight - zoneWidth * 0.03;
          drawTextWithTracking(
            ctx,
            line.text.trim(),
            lx,
            ly,
            line.letterSpacing,
            line.align,
            zoneWidth * 0.92
          );
        });
      }
    }
    drawWeatheringOverlay(ctx, panel.wearAmount, canvasW, canvasH);
  }
  if (panel.showFaceBolts && lod > 0) {
    ctx.save();
    const boltR = Math.max(4, minDim * 0.018);
    const boltPositions = panel.shape === "rounded-rect" && panel.width > 1.3 ? [
      [canvasW * 0.12, canvasH * 0.12],
      [canvasW * 0.5, canvasH * 0.12],
      [canvasW * 0.88, canvasH * 0.12],
      [canvasW * 0.12, canvasH * 0.88],
      [canvasW * 0.5, canvasH * 0.88],
      [canvasW * 0.88, canvasH * 0.88]
    ] : [
      [canvasW * 0.5, canvasH * 0.12],
      [canvasW * 0.5, canvasH * 0.88]
    ];
    for (const [bx, by] of boltPositions) {
      ctx.beginPath();
      ctx.arc(bx, by, boltR, 0, Math.PI * 2);
      ctx.fillStyle = "#C2C8D0";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4A525D";
      ctx.stroke();
    }
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = lod === 0 ? 8 : lod === 1 ? 4 : 1;
  tex.needsUpdate = true;
  return tex;
}
function renderExitTabTexture(exitTab, parentPanel, lod, tabWidthMeters = 1, tabHeightMeters = 0.38) {
  const aspect = Math.max(1.2, Math.min(4.8, tabWidthMeters / Math.max(0.15, tabHeightMeters)));
  const h = lod === 0 ? 256 : lod === 1 ? 144 : 80;
  const w = Math.round(h * aspect);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const bg = exitTab.bgColor || parentPanel.bgColor;
  const fg = exitTab.textColor || parentPanel.textColor;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  const pad = Math.round(h * 0.085);
  const borderThick = Math.max(3, Math.round(h * 0.058));
  drawRoundedRectPath(ctx, pad, pad, w - pad * 2, h - pad * 2, h * 0.18);
  ctx.strokeStyle = parentPanel.borderColor;
  ctx.lineWidth = borderThick;
  ctx.stroke();
  const fontStack = getCSSFontStack(parentPanel.fontFamily);
  ctx.fillStyle = fg;
  ctx.textBaseline = "middle";
  const maxTextW = w - pad * 4.5;
  if (exitTab.subText) {
    ctx.font = `700 ${Math.round(h * 0.4)}px ${fontStack}`;
    drawTextWithTracking(ctx, exitTab.text, w / 2, h * 0.38, 2, "center", maxTextW);
    ctx.font = `700 ${Math.round(h * 0.24)}px ${fontStack}`;
    drawTextWithTracking(ctx, exitTab.subText, w / 2, h * 0.74, 1, "center", maxTextW);
  } else {
    const exitMatch = exitTab.text.trim().match(/^(EXIT)\s+([0-9A-Z]+)$/i);
    if (exitMatch) {
      const word = exitMatch[1].toUpperCase();
      const num = exitMatch[2].toUpperCase();
      const wordFont = `700 ${Math.round(h * 0.38)}px ${fontStack}`;
      const numFont = `700 ${Math.round(h * 0.56)}px ${fontStack}`;
      ctx.font = wordFont;
      const wordW = measureTrackedTextWidth(ctx, word, 2);
      ctx.font = numFont;
      const numW = measureTrackedTextWidth(ctx, num, 2);
      const gap = h * 0.14;
      const totalW = wordW + gap + numW;
      if (totalW <= maxTextW) {
        const startX = w / 2 - totalW / 2;
        ctx.font = wordFont;
        drawTextWithTracking(ctx, word, startX, h * 0.54, 2, "left");
        ctx.font = numFont;
        drawTextWithTracking(ctx, num, startX + wordW + gap, h * 0.51, 2, "left");
      } else {
        ctx.font = `700 ${Math.round(h * 0.48)}px ${fontStack}`;
        drawTextWithTracking(ctx, exitTab.text, w / 2, h * 0.52, 2, "center", maxTextW);
      }
    } else {
      ctx.font = `700 ${Math.round(h * 0.48)}px ${fontStack}`;
      drawTextWithTracking(ctx, exitTab.text, w / 2, h * 0.52, 2, "center", maxTextW);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = lod === 0 ? 8 : lod === 1 ? 4 : 1;
  tex.needsUpdate = true;
  return tex;
}

// src/utils/geometryBuilder.ts
function createShape2D(panel, lod) {
  const w = panel.width;
  const h = panel.height;
  const hw = w / 2;
  const hh = h / 2;
  const shape = new THREE2.Shape();
  const r = Math.min(panel.cornerRadius, hw * 0.45, hh * 0.45);
  if (panel.shape === "rounded-rect" || panel.shape === "chevron-rect" || panel.shape === "us-route-shield") {
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
  if (panel.shape === "diamond") {
    const pts = [
      [0, hh],
      [hw, 0],
      [0, -hh],
      [-hw, 0]
    ];
    return createRoundedPolygonShape(pts, r);
  }
  if (panel.shape === "circle") {
    const segs = lod === 0 ? 48 : lod === 1 ? 24 : 12;
    shape.absellipse(0, 0, hw, hh, 0, Math.PI * 2, false, 0);
    const pts = shape.getPoints(segs);
    return new THREE2.Shape(pts);
  }
  if (panel.shape === "octagon") {
    const k = 0.29289;
    const pts = [
      [-hw + w * k, hh],
      [hw - w * k, hh],
      [hw, hh - h * k],
      [hw, -hh + h * k],
      [hw - w * k, -hh],
      [-hw + w * k, -hh],
      [-hw, -hh + h * k],
      [-hw, hh - h * k]
    ];
    return createRoundedPolygonShape(pts, r * 0.35);
  }
  if (panel.shape === "triangle-up") {
    const pts = [
      [0, hh * 0.94],
      [hw * 0.94, -hh * 0.9],
      [-hw * 0.94, -hh * 0.9]
    ];
    return createRoundedPolygonShape(pts, r * 1.05);
  }
  if (panel.shape === "triangle-down") {
    const pts = [
      [-hw * 0.94, hh * 0.9],
      [hw * 0.94, hh * 0.9],
      [0, -hh * 0.94]
    ];
    return createRoundedPolygonShape(pts, r * 1.05);
  }
  if (panel.shape === "pentagon") {
    const pts = [
      [0, hh * 0.94],
      [hw * 0.94, hh * 0.16],
      [hw * 0.64, -hh * 0.92],
      [-hw * 0.64, -hh * 0.92],
      [-hw * 0.94, hh * 0.16]
    ];
    return createRoundedPolygonShape(pts, r * 0.6);
  }
  if (panel.shape === "pennant") {
    const pts = [
      [-hw * 0.92, hh * 0.88],
      [hw * 0.92, 0],
      [-hw * 0.92, -hh * 0.88]
    ];
    return createRoundedPolygonShape(pts, r * 0.7);
  }
  if (panel.shape === "interstate-shield") {
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
function createRoundedPolygonShape(pts, cornerRadius) {
  const shape = new THREE2.Shape();
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
    const p1x = curr[0] + v1x / l1 * r;
    const p1y = curr[1] + v1y / l1 * r;
    const p2x = curr[0] + v2x / l2 * r;
    const p2y = curr[1] + v2y / l2 * r;
    if (i === 0) shape.moveTo(p1x, p1y);
    else shape.lineTo(p1x, p1y);
    shape.quadraticCurveTo(curr[0], curr[1], p2x, p2y);
  }
  shape.closePath();
  return shape;
}
function normalizeExtrudeUVs(geo, width, height) {
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
function createPerforatedPostTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#B8C0C8";
  ctx.fillRect(0, 0, 128, 512);
  for (let y = 24; y < 512; y += 36) {
    ctx.beginPath();
    ctx.arc(64, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#222831";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#8C96A2";
    ctx.stroke();
  }
  const tex = new THREE2.CanvasTexture(canvas);
  tex.wrapS = THREE2.RepeatWrapping;
  tex.wrapT = THREE2.RepeatWrapping;
  tex.repeat.set(1, 5);
  return tex;
}
function getPolePBRMaterial(matType, profile, weathering, wireframe) {
  const baseMap = {
    galvanized: { color: "#B4BCC4", metalness: 0.78, roughness: 0.34 },
    aluminum: { color: "#D4DBE2", metalness: 0.85, roughness: 0.24 },
    "weathered-steel": { color: "#6E7680", metalness: 0.65, roughness: 0.55 },
    "charcoal-coat": { color: "#2E343B", metalness: 0.45, roughness: 0.48 },
    "dot-green": { color: "#1F4E3B", metalness: 0.35, roughness: 0.5 },
    "wood-cedar": { color: "#8A5A3B", metalness: 0.05, roughness: 0.85 },
    "concrete-grey": { color: "#9CA3AF", metalness: 0.18, roughness: 0.72 },
    "corten-rust": { color: "#7C3F23", metalness: 0.4, roughness: 0.78 }
  };
  const cfg = baseMap[matType] || baseMap.galvanized;
  const mat = new THREE2.MeshStandardMaterial({
    color: new THREE2.Color(cfg.color),
    metalness: Math.max(0.05, cfg.metalness - weathering * 0.25),
    roughness: Math.min(0.95, cfg.roughness + weathering * 0.3),
    wireframe
  });
  if (profile === "square-perforated" && matType !== "wood-cedar") {
    mat.map = createPerforatedPostTexture();
  }
  return mat;
}
function createPoleColumnMesh(profile, height, radius, lod, material) {
  const group = new THREE2.Group();
  const radialSegs = lod === 0 ? 28 : lod === 1 ? 12 : 6;
  if (profile === "round-steel") {
    const geo = new THREE2.CylinderGeometry(radius, radius, height, radialSegs);
    const mesh = new THREE2.Mesh(geo, material);
    mesh.position.y = height / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  } else if (profile === "octagonal-mast") {
    const geo = new THREE2.CylinderGeometry(radius * 0.82, radius * 1.12, height, 8);
    const mesh = new THREE2.Mesh(geo, material);
    mesh.position.y = height / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  } else if (profile === "square-perforated" || profile === "wood-post") {
    const w = radius * 1.85;
    const geo = new THREE2.BoxGeometry(w, height, w, 1, lod === 0 ? 4 : 1, 1);
    const mesh = new THREE2.Mesh(geo, material);
    mesh.position.y = height / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  } else if (profile === "i-beam") {
    const w = radius * 2.1;
    const d = radius * 2.2;
    const flangeT = Math.max(0.012, radius * 0.28);
    const webT = Math.max(0.01, radius * 0.22);
    if (lod === 2) {
      const geo = new THREE2.BoxGeometry(w, height, d);
      const m = new THREE2.Mesh(geo, material);
      m.position.y = height / 2;
      group.add(m);
    } else {
      const fGeo = new THREE2.BoxGeometry(w, height, flangeT);
      const frontFlange = new THREE2.Mesh(fGeo, material);
      frontFlange.position.set(0, height / 2, d / 2 - flangeT / 2);
      const backFlange = new THREE2.Mesh(fGeo, material);
      backFlange.position.set(0, height / 2, -d / 2 + flangeT / 2);
      const webGeo = new THREE2.BoxGeometry(webT, height, d - flangeT * 2);
      const web = new THREE2.Mesh(webGeo, material);
      web.position.set(0, height / 2, 0);
      frontFlange.castShadow = backFlange.castShadow = web.castShadow = true;
      group.add(frontFlange, backFlange, web);
    }
  } else if (profile === "u-channel") {
    const w = radius * 1.8;
    const d = radius * 1.2;
    const t = Math.max(0.01, radius * 0.24);
    if (lod === 2) {
      const m = new THREE2.Mesh(new THREE2.BoxGeometry(w, height, d), material);
      m.position.y = height / 2;
      group.add(m);
    } else {
      const back = new THREE2.Mesh(new THREE2.BoxGeometry(w, height, t), material);
      back.position.set(0, height / 2, 0);
      const left = new THREE2.Mesh(new THREE2.BoxGeometry(t, height, d), material);
      left.position.set(-w / 2 + t / 2, height / 2, -d / 2);
      const right = new THREE2.Mesh(new THREE2.BoxGeometry(t, height, d), material);
      right.position.set(w / 2 - t / 2, height / 2, -d / 2);
      back.castShadow = left.castShadow = right.castShadow = true;
      group.add(back, left, right);
    }
  }
  return group;
}
function createBaseHardware(x, z, structure, lod, poleMat, wireframe) {
  const group = new THREE2.Group();
  group.position.set(x, 0, z);
  const r = structure.poleRadius;
  const concreteMat = new THREE2.MeshStandardMaterial({
    color: "#9BA1A8",
    roughness: 0.9,
    metalness: 0.05,
    wireframe
  });
  if (structure.baseType === "bolted-flange" || structure.baseType === "breakaway-slip") {
    const pierSegs = lod === 0 ? 24 : lod === 1 ? 12 : 6;
    const pier = new THREE2.Mesh(
      new THREE2.CylinderGeometry(r * 2.4, r * 2.7, 0.22, pierSegs),
      concreteMat
    );
    pier.position.y = 0.08;
    pier.receiveShadow = true;
    group.add(pier);
    const plateSize = r * 3.6;
    const plate = new THREE2.Mesh(new THREE2.BoxGeometry(plateSize, 0.035, plateSize), poleMat);
    plate.position.y = 0.2;
    plate.castShadow = true;
    group.add(plate);
    if (lod === 0) {
      const boltOff = plateSize * 0.36;
      const boltGeo = new THREE2.CylinderGeometry(r * 0.22, r * 0.22, 0.08, 6);
      for (const bx of [-boltOff, boltOff]) {
        for (const bz of [-boltOff, boltOff]) {
          const bolt = new THREE2.Mesh(boltGeo, poleMat);
          bolt.position.set(bx, 0.24, bz);
          group.add(bolt);
        }
      }
    }
    if (structure.baseType === "breakaway-slip" && lod < 2) {
      const splice = new THREE2.Mesh(
        new THREE2.BoxGeometry(plateSize * 0.95, 0.06, plateSize * 0.95),
        poleMat
      );
      splice.position.y = 0.85;
      group.add(splice);
    }
  } else if (structure.baseType === "crash-barrels") {
    const barrelMat = new THREE2.MeshStandardMaterial({
      color: "#EAB308",
      roughness: 0.45,
      metalness: 0.1,
      wireframe
    });
    const lidMat = new THREE2.MeshStandardMaterial({
      color: "#1E232A",
      roughness: 0.6,
      metalness: 0.2,
      wireframe
    });
    const barrelSegs = lod === 0 ? 20 : lod === 1 ? 10 : 6;
    const positions = lod === 2 ? [[0, 0.55]] : [
      [-0.28, 0.48],
      [0.28, 0.48],
      [0, 0.95]
    ];
    for (const [bx, bz] of positions) {
      const bGroup = new THREE2.Group();
      bGroup.position.set(bx, 0, bz);
      const drum = new THREE2.Mesh(
        new THREE2.CylinderGeometry(0.28, 0.26, 0.78, barrelSegs),
        barrelMat
      );
      drum.position.y = 0.39;
      drum.castShadow = true;
      bGroup.add(drum);
      if (lod < 2) {
        const lid = new THREE2.Mesh(
          new THREE2.CylinderGeometry(0.29, 0.29, 0.06, barrelSegs),
          lidMat
        );
        lid.position.y = 0.79;
        bGroup.add(lid);
      }
      group.add(bGroup);
    }
  } else if (structure.baseType === "guardrail") {
    const railLen = 2.8;
    const rail = new THREE2.Mesh(new THREE2.BoxGeometry(0.08, 0.28, railLen), poleMat);
    rail.position.set(x >= 0 ? -0.42 : 0.42, 0.58, 0);
    rail.castShadow = true;
    group.add(rail);
    if (lod < 2) {
      for (const rz of [-0.95, 0, 0.95]) {
        const gPost = new THREE2.Mesh(new THREE2.BoxGeometry(0.1, 0.75, 0.1), poleMat);
        gPost.position.set(x >= 0 ? -0.48 : 0.48, 0.375, rz);
        group.add(gPost);
      }
    }
  }
  return group;
}
function buildSignPanelMesh(panel, lod, poleMat, wireframe, isSelected) {
  const group = new THREE2.Group();
  group.name = `SignPanel_${panel.id}`;
  const curveSegs = lod === 0 ? 16 : lod === 1 ? 6 : 2;
  const shape2D = createShape2D(panel, lod);
  const depth = panel.thickness;
  const bevelThick = lod === 0 ? 4e-3 : 0;
  const totalHalfDepth = depth / 2 + bevelThick;
  const extrudeSettings = {
    depth,
    bevelEnabled: lod === 0,
    bevelSegments: lod === 0 ? 3 : 1,
    steps: 1,
    bevelSize: bevelThick,
    bevelThickness: bevelThick,
    curveSegments: curveSegs
  };
  const geo = new THREE2.ExtrudeGeometry(shape2D, extrudeSettings);
  normalizeExtrudeUVs(geo, panel.width, panel.height);
  geo.center();
  const frontTex = renderSignPanelTexture(panel, lod);
  const isRetro = panel.sheetingType !== "matte-enamel";
  const frontMat = new THREE2.MeshStandardMaterial({
    map: frontTex,
    roughness: isRetro ? 0.26 : 0.65,
    metalness: isRetro ? 0.18 : 0.05,
    emissive: isSelected ? new THREE2.Color("#7C83FD") : new THREE2.Color("#000000"),
    emissiveIntensity: isSelected ? 0.08 : 0,
    wireframe
  });
  const backAluminumMat = new THREE2.MeshStandardMaterial({
    color: "#B8C1CC",
    metalness: 0.78,
    roughness: 0.34,
    wireframe
  });
  const plateMesh = new THREE2.Mesh(geo, [frontMat, backAluminumMat]);
  plateMesh.castShadow = true;
  plateMesh.receiveShadow = true;
  group.add(plateMesh);
  const backGeo = new THREE2.ShapeGeometry(shape2D, curveSegs);
  const backSkin = new THREE2.Mesh(backGeo, backAluminumMat);
  backSkin.rotation.y = Math.PI;
  backSkin.position.z = -totalHalfDepth - 2e-3;
  group.add(backSkin);
  if (panel.showFaceBolts && lod === 0) {
    const boltMat = new THREE2.MeshStandardMaterial({
      color: "#D8DEE6",
      metalness: 0.88,
      roughness: 0.22,
      wireframe
    });
    const boltPositions = panel.shape === "rounded-rect" && panel.width > 1.3 ? [
      [-panel.width * 0.38, panel.height * 0.38],
      [0, panel.height * 0.38],
      [panel.width * 0.38, panel.height * 0.38],
      [-panel.width * 0.38, -panel.height * 0.38],
      [0, -panel.height * 0.38],
      [panel.width * 0.38, -panel.height * 0.38]
    ] : [
      [0, panel.height * 0.38],
      [0, -panel.height * 0.38]
    ];
    const boltGeo = new THREE2.CylinderGeometry(0.015, 0.015, 0.014, 6);
    boltGeo.rotateX(Math.PI / 2);
    const washerGeo = new THREE2.CylinderGeometry(0.024, 0.024, 4e-3, 12);
    washerGeo.rotateX(Math.PI / 2);
    for (const [bx, by] of boltPositions) {
      const bolt = new THREE2.Mesh(boltGeo, boltMat);
      bolt.position.set(bx, by, totalHalfDepth + 6e-3);
      const washer = new THREE2.Mesh(washerGeo, boltMat);
      washer.position.set(bx, by, totalHalfDepth + 2e-3);
      group.add(bolt, washer);
    }
  }
  if (lod === 0) {
    const barCount = panel.height > 1.1 ? 2 : 1;
    const barYs = barCount === 2 ? [panel.height * 0.26, -panel.height * 0.26] : [0];
    for (const by of barYs) {
      const zBar = new THREE2.Mesh(
        new THREE2.BoxGeometry(panel.width * 0.86, 0.045, 0.035),
        poleMat
      );
      zBar.position.set(0, by, -totalHalfDepth - 0.02);
      zBar.castShadow = true;
      group.add(zBar);
      const clamp = new THREE2.Mesh(
        new THREE2.TorusGeometry(0.055, 9e-3, 8, 16, Math.PI),
        poleMat
      );
      clamp.rotation.x = Math.PI / 2;
      clamp.position.set(0, by, -totalHalfDepth - 0.035);
      group.add(clamp);
    }
  } else if (lod === 1) {
    const simpleBar = new THREE2.Mesh(
      new THREE2.BoxGeometry(panel.width * 0.78, 0.05, 0.03),
      poleMat
    );
    simpleBar.position.set(0, 0, -totalHalfDepth - 0.018);
    group.add(simpleBar);
  }
  if (panel.exitTab && panel.exitTab.enabled) {
    const clampedRatio = Math.max(0.32, Math.min(0.65, panel.exitTab.widthRatio || 0.45));
    const tabW = Math.max(0.75, panel.width * clampedRatio);
    const tabH = Math.max(0.34, Math.min(0.48, panel.height * 0.25));
    const tabShape = new THREE2.Shape();
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
    const tabGeo = new THREE2.ExtrudeGeometry(tabShape, {
      depth: tabDepth,
      bevelEnabled: false,
      curveSegments: curveSegs
    });
    normalizeExtrudeUVs(tabGeo, tabW, tabH);
    tabGeo.center();
    const tabTex = renderExitTabTexture(panel.exitTab, panel, lod, tabW, tabH);
    const tabFrontMat = new THREE2.MeshStandardMaterial({
      map: tabTex,
      roughness: 0.28,
      metalness: 0.16,
      wireframe
    });
    const tabMesh = new THREE2.Mesh(tabGeo, [tabFrontMat, backAluminumMat]);
    let tabX = 0;
    if (panel.exitTab.align === "left") tabX = -panel.width / 2 + tabW / 2 + 0.04;
    else if (panel.exitTab.align === "right") tabX = panel.width / 2 - tabW / 2 - 0.04;
    const tabY = panel.height / 2 + tabH / 2 + 0.02;
    tabMesh.position.set(tabX, tabY, 0);
    tabMesh.castShadow = true;
    group.add(tabMesh);
    const tabBackSkin = new THREE2.Mesh(
      new THREE2.ShapeGeometry(tabShape, curveSegs),
      backAluminumMat
    );
    tabBackSkin.rotation.y = Math.PI;
    tabBackSkin.position.set(tabX, tabY, -tabDepth / 2 - 2e-3);
    group.add(tabBackSkin);
    if (lod < 2) {
      for (const sx of [tabX - tabW * 0.28, tabX + tabW * 0.28]) {
        const strap = new THREE2.Mesh(
          new THREE2.BoxGeometry(0.045, tabH * 0.65 + 0.16, 0.022),
          poleMat
        );
        strap.position.set(sx, panel.height / 2 + 0.04, -totalHalfDepth - 0.014);
        group.add(strap);
      }
    }
  }
  return group;
}
function buildBoxTrussBridge(span, trussHeight, trussDepth, yCenter, lod, material) {
  const group = new THREE2.Group();
  group.position.y = yCenter;
  if (lod === 2) {
    const beamMat = material;
    const topFront = new THREE2.Mesh(new THREE2.BoxGeometry(span, 0.08, 0.08), beamMat);
    topFront.position.set(0, trussHeight / 2, trussDepth / 2);
    const botFront = new THREE2.Mesh(new THREE2.BoxGeometry(span, 0.08, 0.08), beamMat);
    botFront.position.set(0, -trussHeight / 2, trussDepth / 2);
    const topBack = new THREE2.Mesh(new THREE2.BoxGeometry(span, 0.08, 0.08), beamMat);
    topBack.position.set(0, trussHeight / 2, -trussDepth / 2);
    const botBack = new THREE2.Mesh(new THREE2.BoxGeometry(span, 0.08, 0.08), beamMat);
    botBack.position.set(0, -trussHeight / 2, -trussDepth / 2);
    group.add(topFront, botFront, topBack, botBack);
    return group;
  }
  const chordR = 0.042;
  const strutR = 0.024;
  const segs = lod === 0 ? 12 : 6;
  const chordGeo = new THREE2.CylinderGeometry(chordR, chordR, span, segs);
  chordGeo.rotateZ(Math.PI / 2);
  const offsets = [
    [trussHeight / 2, trussDepth / 2],
    [-trussHeight / 2, trussDepth / 2],
    [trussHeight / 2, -trussDepth / 2],
    [-trussHeight / 2, -trussDepth / 2]
  ];
  for (const [cy, cz] of offsets) {
    const chord = new THREE2.Mesh(chordGeo, material);
    chord.position.set(0, cy, cz);
    chord.castShadow = true;
    group.add(chord);
  }
  const bayCount = lod === 0 ? Math.max(8, Math.round(span * 1.2)) : Math.max(5, Math.round(span * 0.7));
  const bayWidth = span / bayCount;
  const vGeo = new THREE2.CylinderGeometry(strutR, strutR, trussHeight, segs);
  const dGeo = new THREE2.CylinderGeometry(strutR, strutR, trussDepth, segs);
  dGeo.rotateX(Math.PI / 2);
  const diagLen = Math.hypot(bayWidth, trussHeight);
  const diagGeo = new THREE2.CylinderGeometry(strutR * 0.9, strutR * 0.9, diagLen, segs);
  const diagAngle = Math.atan2(bayWidth, trussHeight);
  for (let i = 0; i <= bayCount; i++) {
    const x = -span / 2 + i * bayWidth;
    for (const cz of [-trussDepth / 2, trussDepth / 2]) {
      const v = new THREE2.Mesh(vGeo, material);
      v.position.set(x, 0, cz);
      group.add(v);
    }
    for (const cy of [-trussHeight / 2, trussHeight / 2]) {
      const d = new THREE2.Mesh(dGeo, material);
      d.position.set(x, cy, 0);
      group.add(d);
    }
    if (i < bayCount) {
      const midX = x + bayWidth / 2;
      const flip = i % 2 === 0 ? 1 : -1;
      for (const cz of [-trussDepth / 2, trussDepth / 2]) {
        const diag = new THREE2.Mesh(diagGeo, material);
        diag.position.set(midX, 0, cz);
        diag.rotation.z = flip * diagAngle;
        group.add(diag);
      }
    }
  }
  return group;
}
function buildRoadSignAssemblyScene(assembly, lod, wireframe, selectedSignId) {
  const rootGroup = new THREE2.Group();
  rootGroup.name = `RoadSignAssembly_LOD${lod}`;
  const signSelectableMap = /* @__PURE__ */ new Map();
  const { structure, signs } = assembly;
  const poleMat = getPolePBRMaterial(
    structure.poleMaterial,
    structure.poleProfile,
    structure.weathering,
    wireframe
  );
  const isOverhead = structure.structureType === "cantilever" || structure.structureType === "portal-gantry" || structure.structureType === "truss-gantry";
  const baseMountY = isOverhead ? structure.poleHeight - 0.65 : structure.structureType === "route-tree" ? structure.poleHeight * 0.62 : structure.poleHeight * 0.68;
  let highestSignCenterY = structure.poleHeight;
  let widestSignSpan = structure.gantrySpan;
  for (const s of signs) {
    const sy = baseMountY + s.yOffset + s.height * s.scale * 0.35;
    if (sy > highestSignCenterY) highestSignCenterY = sy;
    const rightEdge = Math.abs(s.xOffset) + s.width * s.scale / 2;
    if (rightEdge * 2 + 2.4 > widestSignSpan) {
      widestSignSpan = rightEdge * 2 + 2.4;
    }
  }
  const effectivePoleHeight = isOverhead ? structure.poleHeight : Math.max(structure.poleHeight, highestSignCenterY);
  const effectiveSpan = isOverhead ? Math.max(structure.gantrySpan, widestSignSpan) : structure.gantrySpan;
  if (structure.showRoadBase) {
    const padW = isOverhead ? effectiveSpan + 3.2 : 5.4;
    const padD = isOverhead ? 6.5 : 4.2;
    const roadGroup = new THREE2.Group();
    roadGroup.name = "HighwayRoadDiorama";
    const gravelMat = new THREE2.MeshStandardMaterial({
      color: "#C7BFB3",
      roughness: 0.92,
      metalness: 0.02,
      wireframe
    });
    const baseSlab = new THREE2.Mesh(new THREE2.BoxGeometry(padW, 0.08, padD), gravelMat);
    baseSlab.position.y = -0.04;
    baseSlab.receiveShadow = true;
    roadGroup.add(baseSlab);
    const asphaltW = isOverhead ? effectiveSpan - 1.2 : 2.6;
    const asphaltMat = new THREE2.MeshStandardMaterial({
      color: "#343A42",
      roughness: 0.85,
      metalness: 0.05,
      wireframe
    });
    const asphalt = new THREE2.Mesh(new THREE2.BoxGeometry(asphaltW, 0.03, padD), asphaltMat);
    asphalt.position.set(isOverhead ? 0 : -1.2, 0.01, 0);
    asphalt.receiveShadow = true;
    roadGroup.add(asphalt);
    if (lod < 2) {
      const lineMat = new THREE2.MeshBasicMaterial({ color: "#F4F6F8", wireframe });
      const yellowLineMat = new THREE2.MeshBasicMaterial({ color: "#F5C400", wireframe });
      const rightEdge = new THREE2.Mesh(
        new THREE2.BoxGeometry(0.09, 0.01, padD * 0.96),
        lineMat
      );
      rightEdge.position.set((isOverhead ? 0 : -1.2) + asphaltW * 0.44, 0.028, 0);
      const leftEdge = new THREE2.Mesh(
        new THREE2.BoxGeometry(0.09, 0.01, padD * 0.96),
        yellowLineMat
      );
      leftEdge.position.set((isOverhead ? 0 : -1.2) - asphaltW * 0.44, 0.028, 0);
      roadGroup.add(rightEdge, leftEdge);
    }
    rootGroup.add(roadGroup);
  }
  const structureGroup = new THREE2.Group();
  structureGroup.name = `SupportStructure_${structure.structureType}`;
  const h = effectivePoleHeight;
  const r = structure.poleRadius;
  const span = effectiveSpan;
  if (structure.structureType === "single-post") {
    const col = createPoleColumnMesh(structure.poleProfile, h, r, lod, poleMat);
    structureGroup.add(col);
    structureGroup.add(createBaseHardware(0, 0, structure, lod, poleMat, wireframe));
  } else if (structure.structureType === "dual-post") {
    const maxSignW = Math.max(...signs.map((s) => s.width * s.scale), 1.6);
    const spacing = Math.min(maxSignW * 0.68, span * 0.62, 2.2);
    for (const px of [-spacing / 2, spacing / 2]) {
      const col = createPoleColumnMesh(structure.poleProfile, h, r, lod, poleMat);
      col.position.x = px;
      structureGroup.add(col);
      structureGroup.add(createBaseHardware(px, 0, structure, lod, poleMat, wireframe));
    }
  } else if (structure.structureType === "route-tree") {
    const col = createPoleColumnMesh(structure.poleProfile, h, r, lod, poleMat);
    structureGroup.add(col);
    structureGroup.add(createBaseHardware(0, 0, structure, lod, poleMat, wireframe));
    const armMap = /* @__PURE__ */ new Map();
    for (const s of signs) {
      if (s.mountSlot === "left-arm" || s.mountSlot === "right-arm" || Math.abs(s.xOffset) > 0.12) {
        const ay = Number((baseMountY + s.yOffset).toFixed(2));
        const neededHalfSpan = Math.max(0.85, Math.abs(s.xOffset) + s.width * s.scale * 0.35);
        armMap.set(ay, Math.max(armMap.get(ay) || 0.85, neededHalfSpan));
      }
    }
    if (armMap.size === 0) armMap.set(Number(baseMountY.toFixed(2)), 0.88);
    armMap.forEach((halfSpan, ay) => {
      const armBar = new THREE2.Mesh(
        new THREE2.BoxGeometry(halfSpan * 2, r * 1.15, r * 1.15),
        poleMat
      );
      armBar.position.set(0, ay, 0);
      armBar.castShadow = true;
      structureGroup.add(armBar);
    });
  } else if (structure.structureType === "cantilever") {
    const colX = span / 2 - 0.6;
    const col = createPoleColumnMesh(structure.poleProfile, h, r * 1.25, lod, poleMat);
    col.position.x = colX;
    structureGroup.add(col);
    structureGroup.add(createBaseHardware(colX, 0, structure, lod, poleMat, wireframe));
    const armY = baseMountY;
    const armLen = span - 0.6;
    const armBeam = new THREE2.Mesh(
      new THREE2.BoxGeometry(armLen, r * 1.65, r * 1.65),
      poleMat
    );
    armBeam.position.set(colX - armLen / 2, armY, 0);
    armBeam.castShadow = true;
    structureGroup.add(armBeam);
    if (lod < 2) {
      const elbow = new THREE2.Mesh(
        new THREE2.BoxGeometry(r * 2.8, r * 2.8, r * 2.1),
        poleMat
      );
      elbow.position.set(colX, armY, 0);
      structureGroup.add(elbow);
    }
  } else if (structure.structureType === "portal-gantry") {
    const halfSpan = span / 2;
    for (const px of [-halfSpan, halfSpan]) {
      const col = createPoleColumnMesh(structure.poleProfile, h, r * 1.15, lod, poleMat);
      col.position.x = px;
      structureGroup.add(col);
      structureGroup.add(createBaseHardware(px, 0, structure, lod, poleMat, wireframe));
    }
    const beamY = baseMountY;
    const beam = new THREE2.Mesh(
      new THREE2.BoxGeometry(span + r * 2.4, r * 1.6, r * 1.6),
      poleMat
    );
    beam.position.set(0, beamY, 0);
    beam.castShadow = true;
    structureGroup.add(beam);
  } else if (structure.structureType === "truss-gantry") {
    const halfSpan = span / 2;
    const trussDepth = 0.72;
    const trussHeight = 0.92;
    const bridgeY = baseMountY;
    for (const side of [-1, 1]) {
      const towerX = side * halfSpan;
      for (const tz of [-trussDepth / 2, trussDepth / 2]) {
        const leg = createPoleColumnMesh("round-steel", h, r * 0.75, lod, poleMat);
        leg.position.set(towerX, 0, tz);
        structureGroup.add(leg);
      }
      if (lod < 2) {
        const rungCount = lod === 0 ? 6 : 3;
        for (let k = 1; k <= rungCount; k++) {
          const ry = h / (rungCount + 1) * k;
          const rung = new THREE2.Mesh(
            new THREE2.CylinderGeometry(r * 0.3, r * 0.3, trussDepth, 8),
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
      const walk = new THREE2.Mesh(
        new THREE2.BoxGeometry(span * 0.84, 0.04, 0.45),
        poleMat
      );
      walk.position.set(0, catwalkY, trussDepth / 2 + 0.48);
      structureGroup.add(walk);
    }
    if (structure.hasLuminaires && lod < 2) {
      const lightMat = new THREE2.MeshStandardMaterial({
        color: "#FEF3C7",
        emissive: new THREE2.Color("#FDE68A"),
        emissiveIntensity: 0.9,
        wireframe
      });
      for (const s of signs) {
        const lx = s.xOffset;
        const ly = bridgeY - trussHeight / 2 - 0.35;
        const arm = new THREE2.Mesh(
          new THREE2.CylinderGeometry(0.018, 0.018, 0.95, 8),
          poleMat
        );
        arm.rotation.x = Math.PI / 2;
        arm.position.set(lx, ly, trussDepth / 2 + 0.55);
        const lamp = new THREE2.Mesh(new THREE2.BoxGeometry(0.32, 0.08, 0.22), poleMat);
        lamp.position.set(lx, ly + 0.03, trussDepth / 2 + 1);
        const bulb = new THREE2.Mesh(new THREE2.BoxGeometry(0.26, 0.03, 0.16), lightMat);
        bulb.position.set(lx, ly + 0.06, trussDepth / 2 + 1);
        structureGroup.add(arm, lamp, bulb);
      }
    }
  }
  rootGroup.add(structureGroup);
  const baseMountZ = structure.structureType === "truss-gantry" ? 0.36 + 0.08 : isOverhead ? r * 0.85 + 0.06 : r + 0.045;
  for (const panel of signs) {
    const isSelected = panel.id === selectedSignId;
    const panelGroup = buildSignPanelMesh(panel, lod, poleMat, wireframe, isSelected);
    const px = panel.xOffset;
    const py = baseMountY + panel.yOffset;
    const pz = baseMountZ + panel.zOffset + panel.thickness / 2;
    panelGroup.position.set(px, py, pz);
    panelGroup.rotation.z = THREE2.MathUtils.degToRad(panel.rotationZ);
    panelGroup.scale.setScalar(panel.scale);
    if (isOverhead && lod < 2) {
      for (const hx of [-panel.width * 0.34, panel.width * 0.34]) {
        const hanger = new THREE2.Mesh(
          new THREE2.BoxGeometry(0.055, panel.height * 0.9, 0.055),
          poleMat
        );
        hanger.position.set(hx, 0, -panel.thickness / 2 - 0.04);
        panelGroup.add(hanger);
        const standoffDepth = Math.max(0.08, pz - (structure.structureType === "truss-gantry" ? 0.36 : r * 0.8));
        const topStandoff = new THREE2.Mesh(
          new THREE2.BoxGeometry(0.045, 0.045, standoffDepth),
          poleMat
        );
        topStandoff.position.set(hx, panel.height * 0.28, -panel.thickness / 2 - standoffDepth / 2);
        const botStandoff = new THREE2.Mesh(
          new THREE2.BoxGeometry(0.045, 0.045, standoffDepth),
          poleMat
        );
        botStandoff.position.set(hx, -panel.height * 0.28, -panel.thickness / 2 - standoffDepth / 2);
        panelGroup.add(topStandoff, botStandoff);
      }
    }
    panelGroup.traverse((child) => {
      if (child.isMesh) {
        signSelectableMap.set(child, panel.id);
      }
    });
    rootGroup.add(panelGroup);
  }
  let triangles = 0;
  let vertices = 0;
  rootGroup.traverse((obj) => {
    const mesh = obj;
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
    vertices
  };
}

// src/api/core.ts
var DEFAULT_STRUCTURE = {
  structureType: "single-post",
  poleProfile: "u-channel",
  poleMaterial: "galvanized",
  baseType: "breakaway-slip",
  poleHeight: 3.6,
  poleRadius: 0.055,
  gantrySpan: 2.8,
  hasLuminaires: false,
  hasCatwalk: false,
  showRoadBase: false,
  weathering: 0.08
};
function normalizeSignConfig(partial = {}) {
  const structure = {
    ...DEFAULT_STRUCTURE,
    ...partial.structure || {}
  };
  const rawSigns = partial.signs && partial.signs.length > 0 ? partial.signs : [createDefaultSignPanel()];
  const signs = rawSigns.map(
    (s, idx) => createDefaultSignPanel({
      ...s,
      id: s.id || `sign-${idx + 1}`
    })
  );
  return {
    seed: partial.seed || "CUSTOM-API-SIGN",
    presetId: partial.presetId,
    environment: partial.environment || "pastel-studio",
    structure,
    signs
  };
}
var FONT_FILES = [
  ["HighwayGothic", "HWYGOTH.woff2", "400 700"],
  ["HighwayGothicCond", "HWYGCOND.woff2", "400 700"],
  ["HighwayGothicExp", "HWYGEXPD.woff2", "400 700"],
  ["HighwayGothicNarrow", "HWYGNRRW.woff2", "400 700"],
  ["HighwayGothicWide", "HWYGWDE.woff2", "400 700"],
  ["DIN1451", "D-DIN-Bold.woff2", "400 800"],
  ["DIN1451Cond", "D-DINCondensed-Bold.woff2", "400 800"]
];
async function loadSignFonts(baseUrl) {
  const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  await Promise.all(
    FONT_FILES.map(async ([family, file, weight]) => {
      try {
        const face = new FontFace(family, `url(${new URL(file, base).href})`, { weight });
        document.fonts.add(await face.load());
      } catch {
      }
    })
  );
}
export {
  COLOR_PRESETS,
  SeededRNG,
  buildRoadSignAssemblyScene,
  createDefaultSignPanel,
  createRandomSeedCode,
  generateSignAssemblyFromSeed,
  loadSignFonts,
  normalizeSignConfig,
  renderSignPanelTexture
};
