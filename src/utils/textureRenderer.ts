import * as THREE from 'three';
import {
  ArrowType,
  ExitTabConfig,
  LODLevel,
  PictogramType,
  RouteBadgeItem,
  SignPanelConfig,
} from '../types/sign';

const customImageCache = new Map<string, HTMLImageElement>();

export function preloadCustomImage(url: string, onLoad?: () => void) {
  if (!url || customImageCache.has(url)) {
    if (onLoad) onLoad();
    return;
  }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    customImageCache.set(url, img);
    if (onLoad) onLoad();
  };
  img.src = url;
}

export function getCSSFontStack(fontFamily: SignPanelConfig['fontFamily']): string {
  switch (fontFamily) {
    case 'HighwayGothicExp':
      return '"HighwayGothicExp", "Overpass", sans-serif';
    case 'HighwayGothic':
      return '"HighwayGothic", "Overpass", sans-serif';
    case 'HighwayGothicWide':
      return '"HighwayGothicWide", "Overpass", sans-serif';
    case 'HighwayGothicCond':
      return '"HighwayGothicCond", "Overpass", sans-serif';
    case 'HighwayGothicNarrow':
      return '"HighwayGothicNarrow", "Overpass", sans-serif';
    case 'DIN1451':
      return '"DIN1451", "Public Sans", sans-serif';
    case 'DIN1451Cond':
      return '"DIN1451Cond", "Public Sans", sans-serif';
    case 'Overpass':
      return '"Overpass", sans-serif';
    case 'NotoSansJP':
      return '"Noto Sans JP", "HighwayGothic", sans-serif';
    default:
      return '"HighwayGothicExp", "Overpass", sans-serif';
  }
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
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

function drawInterstateShieldPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number
) {
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

function drawUSShieldPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number
) {
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

function drawPolygonPath(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  cornerRadius: number
) {
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
    const p1x = curr[0] + (v1x / l1) * r;
    const p1y = curr[1] + (v1y / l1) * r;
    const p2x = curr[0] + (v2x / l2) * r;
    const p2y = curr[1] + (v2y / l2) * r;

    if (i === 0) {
      ctx.moveTo(p1x, p1y);
    } else {
      ctx.lineTo(p1x, p1y);
    }
    ctx.quadraticCurveTo(curr[0], curr[1], p2x, p2y);
  }
  ctx.closePath();
}

function drawShapeContour(
  ctx: CanvasRenderingContext2D,
  shape: SignPanelConfig['shape'],
  w: number,
  h: number,
  inset: number,
  cornerRadiusPx: number
) {
  const x = inset;
  const y = inset;
  const sw = Math.max(4, w - inset * 2);
  const sh = Math.max(4, h - inset * 2);
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.max(2, cornerRadiusPx - inset * 0.65);

  switch (shape) {
    case 'rounded-rect':
    case 'chevron-rect':
    case 'diamond':
      if (shape === 'diamond') {
        drawPolygonPath(
          ctx,
          [
            [cx, y],
            [x + sw, cy],
            [cx, y + sh],
            [x, cy],
          ],
          r
        );
      } else {
        drawRoundedRectPath(ctx, x, y, sw, sh, r);
      }
      break;
    case 'circle':
      ctx.beginPath();
      ctx.ellipse(cx, cy, sw / 2, sh / 2, 0, 0, Math.PI * 2);
      ctx.closePath();
      break;
    case 'octagon': {
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
          [x, y + sh * k],
        ],
        r * 0.35
      );
      break;
    }
    case 'triangle-up':
      drawPolygonPath(
        ctx,
        [
          [cx, y + sh * 0.03],
          [x + sw * 0.97, y + sh * 0.95],
          [x + sw * 0.03, y + sh * 0.95],
        ],
        r * 1.05
      );
      break;
    case 'triangle-down':
      drawPolygonPath(
        ctx,
        [
          [x + sw * 0.03, y + sh * 0.05],
          [x + sw * 0.97, y + sh * 0.05],
          [cx, y + sh * 0.97],
        ],
        r * 1.05
      );
      break;
    case 'pentagon':
      drawPolygonPath(
        ctx,
        [
          [cx, y + sh * 0.03],
          [x + sw * 0.97, y + sh * 0.42],
          [x + sw * 0.82, y + sh * 0.96],
          [x + sw * 0.18, y + sh * 0.96],
          [x + sw * 0.03, y + sh * 0.42],
        ],
        r * 0.65
      );
      break;
    case 'pennant':
      drawPolygonPath(
        ctx,
        [
          [x + sw * 0.04, y + sh * 0.06],
          [x + sw * 0.96, cy],
          [x + sw * 0.04, y + sh * 0.94],
        ],
        r * 0.75
      );
      break;
    case 'interstate-shield':
      drawInterstateShieldPath(ctx, cx, cy, sw, sh);
      break;
    case 'us-route-shield':
      drawUSShieldPath(ctx, cx, cy, sw, sh);
      break;
  }
}

function drawRetroreflectiveSheeting(
  ctx: CanvasRenderingContext2D,
  sheeting: SignPanelConfig['sheetingType'],
  w: number,
  h: number
) {
  ctx.save();
  if (sheeting === 'diamond-cubed') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = Math.max(1, h / 420);
    const step = Math.max(6, Math.round(h / 95));
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    for (let x = -h; x < w + h; x += step * 3) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h * 0.5, h);
      ctx.stroke();
    }
  } else if (sheeting === 'high-intensity') {
    const step = Math.max(12, Math.round(h / 55));
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.055)';
    ctx.lineWidth = 1;
    for (let x = -h; x < w + h; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h * 0.58, h);
      ctx.moveTo(x + h * 0.58, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
  } else if (sheeting === 'engineer-grade') {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255,255,255,0.06)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.06)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

function drawWeatheringOverlay(
  ctx: CanvasRenderingContext2D,
  wear: number,
  w: number,
  h: number
) {
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
  rad.addColorStop(0, 'rgba(0,0,0,0)');
  rad.addColorStop(1, `rgba(38, 30, 22, ${Math.min(0.4, wear * 0.52)})`);
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, w, h);

  const streakCount = Math.floor(wear * 30);
  ctx.fillStyle = `rgba(25, 20, 15, ${wear * 0.1})`;
  for (let i = 0; i < streakCount; i++) {
    const sx = ((i * 97 + 31) % 100) * 0.01 * w;
    const sw = 2 + (i % 4) * 2;
    ctx.fillRect(sx, 0, sw, h);
  }
  ctx.restore();
}

function measureTrackedTextWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  trackingPx: number
): number {
  if (!text) return 0;
  const chars = Array.from(text);
  let total = 0;
  for (const ch of chars) {
    total += ctx.measureText(ch).width;
  }
  total += trackingPx * Math.max(0, chars.length - 1);
  return total;
}

function drawTextWithTracking(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  trackingPx: number,
  align: 'left' | 'center' | 'right' = 'center',
  maxWidth?: number
) {
  if (!text) return;
  ctx.save();

  let effectiveTracking = trackingPx;
  const initialWidth = measureTrackedTextWidth(ctx, text, effectiveTracking);

  // Auto-scale font size and tracking down if text exceeds maxWidth
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
  if (align === 'center') cursorX = x - totalWidth / 2;
  else if (align === 'right') cursorX = x - totalWidth;

  ctx.textAlign = 'left';
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], cursorX, y);
    cursorX += widths[i] + effectiveTracking;
  }
  ctx.restore();
}

function getInlineBadgeBaseWidth(badge: RouteBadgeItem, size: number): number {
  if (badge.type === 'jp-expressway') {
    const numW = size * 1.05;
    const labelW = badge.header ? size * 2.15 : 0;
    return numW + labelW;
  }
  if (badge.type === 'autobahn-hex') {
    return size * 1.25;
  }
  if (badge.type === 'arkansas-shield' || badge.type === 'state-rect') {
    return size * 1.15;
  }
  return size * 1.05;
}

function drawInlineBadge(
  ctx: CanvasRenderingContext2D,
  badge: RouteBadgeItem,
  cx: number,
  cy: number,
  size: number,
  fontStack: string
) {
  ctx.save();
  if (badge.type === 'interstate' || badge.type === 'business-loop') {
    const isBus = badge.type === 'business-loop';
    const sw = size * 1.05;
    const sh = size * 1.05;
    drawInterstateShieldPath(ctx, cx, cy, sw, sh);
    ctx.fillStyle = '#F8FAFC';
    ctx.fill();

    ctx.save();
    drawInterstateShieldPath(ctx, cx, cy, sw * 0.9, sh * 0.9);
    ctx.clip();
    ctx.fillStyle = isBus ? '#005A40' : '#C8102E';
    ctx.fillRect(cx - sw, cy - sh / 2, sw * 2, sh * 0.3);
    ctx.fillStyle = isBus ? '#005A40' : '#003F87';
    ctx.fillRect(cx - sw, cy - sh * 0.2, sw * 2, sh);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(cx - sw, cy - sh * 0.21, sw * 2, sh * 0.035);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = `700 ${Math.round(sh * 0.125)}px "HighwayGothicCond", sans-serif`;
    ctx.textBaseline = 'middle';
    drawTextWithTracking(
      ctx,
      badge.header || (isBus ? 'BUSINESS' : 'INTERSTATE'),
      cx,
      cy - sh * 0.31,
      1,
      'center',
      sw * 0.72
    );

    const numFontSize = badge.number.length >= 3 ? sh * 0.42 : sh * 0.52;
    ctx.font = `700 ${Math.round(numFontSize)}px "HighwayGothicWide", sans-serif`;
    drawTextWithTracking(ctx, badge.number, cx, cy + sh * 0.12, 1, 'center', sw * 0.78);
    ctx.restore();
  } else if (badge.type === 'us-route') {
    const sw = size * 1.05;
    const sh = size * 1.02;
    drawUSShieldPath(ctx, cx, cy, sw, sh);
    ctx.fillStyle = '#F8FAFC';
    ctx.fill();
    ctx.lineWidth = Math.max(2, size * 0.04);
    ctx.strokeStyle = '#141619';
    ctx.stroke();

    ctx.fillStyle = '#141619';
    const numFontSize = badge.number.length >= 3 ? sh * 0.44 : sh * 0.54;
    ctx.font = `700 ${Math.round(numFontSize)}px "HighwayGothicWide", sans-serif`;
    ctx.textBaseline = 'middle';
    drawTextWithTracking(ctx, badge.number, cx, cy + sh * 0.04, 1, 'center', sw * 0.78);
  } else if (badge.type === 'arkansas-shield' || badge.type === 'state-rect') {
    const sw = size * 1.15;
    const sh = size * 0.92;
    drawRoundedRectPath(ctx, cx - sw / 2, cy - sh / 2, sw, sh, size * 0.12);
    ctx.fillStyle = '#F8FAFC';
    ctx.fill();
    ctx.fillStyle = '#141619';
    ctx.font = `700 ${Math.round(sh * 0.55)}px "HighwayGothicWide", sans-serif`;
    ctx.textBaseline = 'middle';
    drawTextWithTracking(ctx, badge.number, cx, cy + sh * 0.03, 1, 'center', sw * 0.84);
  } else if (badge.type === 'jp-expressway') {
    const boxH = size * 0.88;
    const numW = size * 1.05;
    const labelW = badge.header ? size * 2.15 : 0;
    const totalW = numW + labelW;
    const startX = cx - totalW / 2;

    drawRoundedRectPath(ctx, startX, cy - boxH / 2, totalW, boxH, size * 0.08);
    ctx.fillStyle = '#F4F6F8';
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
    ctx.fillStyle = '#1B5E3A';
    ctx.fill();

    ctx.fillStyle = '#F4F6F8';
    ctx.font = `700 ${Math.round(boxH * 0.54)}px "HighwayGothicWide", sans-serif`;
    ctx.textBaseline = 'middle';
    drawTextWithTracking(
      ctx,
      badge.number,
      startX + numW / 2,
      cy + boxH * 0.03,
      1,
      'center',
      numW * 0.82
    );

    if (badge.header) {
      const parts = badge.header.split(' ');
      const kanji = parts[0] || '';
      const romaji = parts.slice(1).join(' ');
      ctx.fillStyle = '#1B5E3A';
      ctx.font = `700 ${Math.round(boxH * 0.4)}px ${fontStack}`;
      drawTextWithTracking(
        ctx,
        kanji,
        startX + numW + labelW / 2,
        romaji ? cy - boxH * 0.14 : cy,
        2,
        'center',
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
          'center',
          labelW * 0.88
        );
      }
    }
  } else if (badge.type === 'autobahn-hex') {
    const sw = size * 1.25;
    const sh = size * 0.72;
    const pts: [number, number][] = [
      [cx - sw * 0.38, cy - sh / 2],
      [cx + sw * 0.38, cy - sh / 2],
      [cx + sw / 2, cy],
      [cx + sw * 0.38, cy + sh / 2],
      [cx - sw * 0.38, cy + sh / 2],
      [cx - sw / 2, cy],
    ];
    drawPolygonPath(ctx, pts, size * 0.04);
    ctx.fillStyle = '#F8FAFC';
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
        [cx - inW / 2, cy],
      ],
      size * 0.03
    );
    ctx.fillStyle = '#00519E';
    ctx.fill();
    ctx.fillStyle = '#F8FAFC';
    ctx.font = `700 ${Math.round(sh * 0.6)}px "DIN1451", sans-serif`;
    ctx.textBaseline = 'middle';
    drawTextWithTracking(ctx, badge.number, cx, cy + sh * 0.03, 1, 'center', inW * 0.75);
  }
  ctx.restore();
}

function drawArrowGraphic(
  ctx: CanvasRenderingContext2D,
  type: ArrowType,
  cx: number,
  cy: number,
  size: number,
  color: string,
  panelW: number,
  panelH: number
) {
  if (type === 'none') return;
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (type === 'one-way-right' || type === 'one-way-left') {
    const dir = type === 'one-way-right' ? 1 : -1;
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

  if (type === 'autobahn-fork') {
    const h = panelH * 0.72;
    const stemW = Math.max(8, size * 0.13);
    const lx = -panelW * 0.42;
    ctx.translate(cx, cy);
    ctx.fillRect(lx - stemW / 2, -h * 0.34, stemW, h * 0.78);
    ctx.beginPath();
    ctx.moveTo(lx, -h * 0.48);
    ctx.lineTo(lx - stemW * 1.9, -h * 0.28);
    ctx.lineTo(lx + stemW * 1.9, -h * 0.28);
    ctx.closePath();
    ctx.fill();

    const rx = panelW * 0.05;
    ctx.fillRect(rx - stemW / 2, -h * 0.34, stemW, h * 0.78);
    ctx.beginPath();
    ctx.moveTo(rx, -h * 0.48);
    ctx.lineTo(rx - stemW * 1.9, -h * 0.28);
    ctx.lineTo(rx + stemW * 1.9, -h * 0.28);
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = stemW;
    ctx.beginPath();
    ctx.moveTo(rx, h * 0.35);
    ctx.quadraticCurveTo(rx + size * 0.1, h * 0.15, rx + size * 0.38, h * 0.05);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rx + size * 0.5, h * 0.0);
    ctx.lineTo(rx + size * 0.28, -h * 0.03);
    ctx.lineTo(rx + size * 0.36, h * 0.16);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    return;
  }

  ctx.translate(cx, cy);

  if (type === 'turn-left-90' || type === 'turn-right-90') {
    const dir = type === 'turn-left-90' ? 1 : -1;
    ctx.scale(dir, 1);
    const sw = size * 0.24;
    ctx.lineWidth = sw;
    ctx.lineCap = 'butt';
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

  if (type === 'advance-left' || type === 'advance-right') {
    const dir = type === 'advance-left' ? 1 : -1;
    ctx.scale(dir, 1);
    const sw = size * 0.22;
    ctx.lineWidth = sw;
    ctx.lineCap = 'butt';
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

  if (type === 's-curve-left') {
    const sw = size * 0.2;
    ctx.lineWidth = sw;
    ctx.lineCap = 'butt';
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

  if (type === 'u-turn') {
    const sw = size * 0.2;
    ctx.lineWidth = sw;
    ctx.lineCap = 'butt';
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

  const angleMap: Record<string, number> = {
    up: 0,
    'up-right': Math.PI * 0.25,
    right: Math.PI * 0.5,
    'down-right': Math.PI * 0.75,
    down: Math.PI,
    'down-left': -Math.PI * 0.75,
    left: -Math.PI * 0.5,
    'up-left': -Math.PI * 0.25,
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

function drawPictogramGraphic(
  ctx: CanvasRenderingContext2D,
  type: PictogramType,
  cx: number,
  cy: number,
  size: number,
  color: string,
  customUrl?: string
) {
  if (type === 'none') return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  if (type === 'custom-upload' && customUrl) {
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
    case 't-junction-right':
    case 't-junction-left': {
      const dir = type === 't-junction-right' ? 1 : -1;
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
    case 'crossroads': {
      const w = size * 0.22;
      const l = size * 0.82;
      ctx.fillRect(-w / 2, -l / 2, w, l);
      ctx.fillRect(-l / 2, -w / 2, l, w);
      break;
    }
    case 'y-junction': {
      ctx.lineWidth = size * 0.2;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.moveTo(0, size * 0.45);
      ctx.lineTo(0, 0);
      ctx.lineTo(-size * 0.32, -size * 0.38);
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.32, -size * 0.38);
      ctx.stroke();
      break;
    }
    case 'merge': {
      ctx.lineWidth = size * 0.16;
      ctx.lineCap = 'butt';
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
    case 'roundabout': {
      const r = size * 0.28;
      ctx.lineWidth = size * 0.13;
      ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 3);
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
    case 'pedestrian': {
      ctx.beginPath();
      ctx.arc(0, -size * 0.32, size * 0.09, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = size * 0.1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
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
    case 'deer': {
      ctx.lineWidth = size * 0.08;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
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
    case 'slippery': {
      drawRoundedRectPath(ctx, -size * 0.22, -size * 0.34, size * 0.44, size * 0.24, size * 0.06);
      ctx.fill();
      ctx.lineWidth = size * 0.07;
      ctx.lineCap = 'round';
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
    case 'roadwork': {
      ctx.beginPath();
      ctx.arc(-size * 0.08, -size * 0.3, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = size * 0.09;
      ctx.lineCap = 'round';
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
    case 'bicycle': {
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
    case 'airport': {
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
    case 'gas': {
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
    case 'food': {
      ctx.lineWidth = size * 0.07;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-size * 0.16, -size * 0.35);
      ctx.lineTo(-size * 0.16, size * 0.35);
      ctx.moveTo(size * 0.16, -size * 0.35);
      ctx.lineTo(size * 0.16, size * 0.35);
      ctx.stroke();
      ctx.fillRect(-size * 0.24, -size * 0.35, size * 0.16, size * 0.22);
      break;
    }
    case 'lodging': {
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
    case 'hospital':
    case 'parking': {
      const letter = type === 'hospital' ? 'H' : 'P';
      ctx.font = `700 ${Math.round(size * 0.85)}px "HighwayGothicWide", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letter, 0, size * 0.04);
      break;
    }
    case 'no-entry': {
      ctx.fillRect(-size * 0.38, -size * 0.11, size * 0.76, size * 0.22);
      break;
    }
    case 'steep-grade': {
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

export function renderSignPanelTexture(panel: SignPanelConfig, lod: LODLevel): THREE.CanvasTexture {
  // Exact 1:1 world aspect ratio matching so text is NEVER stretched or squished!
  const maxRes = lod === 0 ? 1536 : lod === 1 ? 768 : 384;
  const trueAspect = Math.max(0.2, Math.min(5.0, panel.width / Math.max(0.15, panel.height)));
  const canvasW = trueAspect >= 1 ? maxRes : Math.max(128, Math.round(maxRes * trueAspect));
  const canvasH = trueAspect >= 1 ? Math.max(128, Math.round(maxRes / trueAspect)) : maxRes;

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d')!;

  const minDim = Math.min(canvasW, canvasH);
  const cornerPx = (panel.cornerRadius / Math.min(panel.width, panel.height)) * minDim;
  const fontStack = getCSSFontStack(panel.fontFamily);

  ctx.clearRect(0, 0, canvasW, canvasH);

  if (panel.shape === 'interstate-shield') {
    const isBus = panel.colorPreset === 'business-green';
    drawInterstateShieldPath(ctx, canvasW / 2, canvasH / 2, canvasW * 0.96, canvasH * 0.96);
    ctx.fillStyle = panel.borderColor;
    ctx.fill();

    ctx.save();
    drawInterstateShieldPath(ctx, canvasW / 2, canvasH / 2, canvasW * 0.89, canvasH * 0.89);
    ctx.clip();

    ctx.fillStyle = isBus ? panel.bgColor : panel.accentColor || '#C8102E';
    ctx.fillRect(0, 0, canvasW, canvasH * 0.31);

    ctx.fillStyle = panel.bgColor;
    ctx.fillRect(0, canvasH * 0.31, canvasW, canvasH * 0.7);

    ctx.fillStyle = panel.borderColor;
    ctx.fillRect(0, canvasH * 0.295, canvasW, canvasH * 0.028);

    drawRetroreflectiveSheeting(ctx, panel.sheetingType, canvasW, canvasH);

    if (panel.headerText) {
      ctx.fillStyle = panel.textColor;
      ctx.font = `700 ${Math.round(canvasH * 0.115)}px "HighwayGothicCond", sans-serif`;
      ctx.textBaseline = 'middle';
      drawTextWithTracking(
        ctx,
        panel.headerText,
        canvasW / 2,
        canvasH * 0.19,
        3,
        'center',
        canvasW * 0.68
      );
    }

    if (panel.subHeaderText) {
      ctx.fillStyle = panel.textColor;
      ctx.font = `700 ${Math.round(canvasH * 0.072)}px "HighwayGothicCond", sans-serif`;
      ctx.textBaseline = 'middle';
      drawTextWithTracking(
        ctx,
        panel.subHeaderText,
        canvasW / 2,
        canvasH * 0.375,
        2,
        'center',
        canvasW * 0.72
      );
    }

    const mainLine = panel.lines[0];
    if (mainLine) {
      ctx.fillStyle = mainLine.color || panel.textColor;
      const fSize = (mainLine.fontSize / 100) * canvasH * 0.33;
      ctx.font = `700 ${Math.round(fSize)}px ${fontStack}`;
      ctx.textBaseline = 'middle';
      drawTextWithTracking(
        ctx,
        mainLine.text,
        canvasW / 2,
        panel.subHeaderText ? canvasH * 0.64 : canvasH * 0.61,
        mainLine.letterSpacing,
        'center',
        canvasW * 0.75
      );
    }

    drawWeatheringOverlay(ctx, panel.wearAmount, canvasW, canvasH);
    ctx.restore();
  } else if (panel.shape === 'us-route-shield') {
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
      ctx.textBaseline = 'middle';
      drawTextWithTracking(
        ctx,
        panel.headerText,
        canvasW / 2,
        canvasH * 0.22,
        2,
        'center',
        canvasW * 0.68
      );
      ctx.fillStyle = panel.borderColor;
      ctx.fillRect(canvasW * 0.1, canvasH * 0.31, canvasW * 0.8, canvasH * 0.02);
    }

    if (panel.subHeaderText) {
      ctx.fillStyle = panel.textColor;
      ctx.font = `700 ${Math.round(canvasH * 0.095)}px "HighwayGothicWide", sans-serif`;
      ctx.textBaseline = 'middle';
      drawTextWithTracking(
        ctx,
        panel.subHeaderText,
        canvasW / 2,
        canvasH * 0.39,
        4,
        'center',
        canvasW * 0.72
      );
    }

    const mainLine = panel.lines[0];
    if (mainLine) {
      ctx.fillStyle = mainLine.color || panel.textColor;
      const fSize = (mainLine.fontSize / 100) * canvasH * 0.32;
      ctx.font = `700 ${Math.round(fSize)}px ${fontStack}`;
      ctx.textBaseline = 'middle';
      drawTextWithTracking(
        ctx,
        mainLine.text,
        canvasW / 2,
        panel.subHeaderText ? canvasH * 0.67 : canvasH * 0.58,
        mainLine.letterSpacing,
        'center',
        canvasW * 0.76
      );
    }
    drawWeatheringOverlay(ctx, panel.wearAmount, canvasW, canvasH);
  } else {
    ctx.fillStyle = panel.bgColor;
    ctx.fillRect(0, 0, canvasW, canvasH);

    const borderPx = Math.max(4, panel.borderWidth * minDim);
    const insetPx = panel.borderInset * minDim;

    if (panel.borderWidth > 0.002) {
      ctx.save();
      const totalInset = insetPx <= 2 ? borderPx * 0.55 : insetPx + borderPx * 0.5;
      drawShapeContour(ctx, panel.shape, canvasW, canvasH, totalInset, cornerPx);
      ctx.strokeStyle = panel.borderColor;
      ctx.lineWidth = borderPx;
      ctx.stroke();
      ctx.restore();
    }

    drawRetroreflectiveSheeting(ctx, panel.sheetingType, canvasW, canvasH);

    if (panel.arrowType !== 'none' && panel.arrowPosition === 'background-box') {
      drawArrowGraphic(
        ctx,
        panel.arrowType,
        canvasW / 2,
        canvasH / 2,
        minDim * 0.65 * panel.arrowScale,
        panel.accentColor || '#F4F6F8',
        canvasW,
        canvasH
      );
    }

    if (panel.dividerLine !== 'none') {
      ctx.fillStyle = panel.borderColor;
      const lineThick = Math.max(4, minDim * 0.018);
      if (panel.dividerLine === 'horizontal-middle') {
        ctx.fillRect(canvasW * 0.04, canvasH * 0.5 - lineThick / 2, canvasW * 0.92, lineThick);
      } else if (panel.dividerLine === 'header-split') {
        ctx.fillRect(canvasW * 0.04, canvasH * 0.28, canvasW * 0.92, lineThick);
      } else if (panel.dividerLine === 'vertical-split') {
        ctx.fillRect(canvasW * 0.52, canvasH * 0.08, lineThick * 0.7, canvasH * 0.84);
      }
    }

    const safeMargin = insetPx + borderPx + minDim * 0.045;
    let contentTop = safeMargin;
    let contentBottom = canvasH - safeMargin;
    let contentLeft = safeMargin;
    let contentRight = canvasW - safeMargin;

    // Narrow safe bounds for non-rectangular shapes (diamond, triangle, octagon)
    if (panel.shape === 'diamond') {
      contentTop = canvasH * 0.22;
      contentBottom = canvasH * 0.78;
      contentLeft = canvasW * 0.22;
      contentRight = canvasW * 0.78;
    } else if (panel.shape === 'triangle-up') {
      contentTop = canvasH * 0.36;
      contentBottom = canvasH * 0.86;
      contentLeft = canvasW * 0.24;
      contentRight = canvasW * 0.76;
    } else if (panel.shape === 'triangle-down') {
      contentTop = canvasH * 0.14;
      contentBottom = canvasH * 0.64;
      contentLeft = canvasW * 0.24;
      contentRight = canvasW * 0.76;
    }

    if (panel.arrowType !== 'none' && panel.arrowPosition !== 'background-box') {
      const arrowSize = minDim * 0.27 * panel.arrowScale;
      if (panel.arrowPosition === 'center') {
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
      } else if (panel.arrowPosition === 'bottom') {
        drawArrowGraphic(
          ctx,
          panel.arrowType,
          canvasW / 2,
          canvasH - safeMargin - arrowSize * 0.5,
          arrowSize,
          panel.textColor,
          canvasW,
          canvasH
        );
        contentBottom = canvasH - safeMargin - arrowSize * 1.15;
      } else if (panel.arrowPosition === 'top') {
        drawArrowGraphic(
          ctx,
          panel.arrowType,
          canvasW / 2,
          safeMargin + arrowSize * 0.5,
          arrowSize,
          panel.textColor,
          canvasW,
          canvasH
        );
        contentTop = safeMargin + arrowSize * 1.15;
      } else if (panel.arrowPosition === 'left') {
        if (panel.arrowType === 'autobahn-fork') {
          drawArrowGraphic(
            ctx,
            panel.arrowType,
            canvasW / 2,
            canvasH / 2,
            arrowSize,
            panel.textColor,
            canvasW,
            canvasH
          );
          contentLeft = canvasW * 0.14;
        } else {
          const ax = safeMargin + arrowSize * 0.6;
          drawArrowGraphic(
            ctx,
            panel.arrowType,
            ax,
            canvasH * 0.54,
            arrowSize * 1.1,
            panel.textColor,
            canvasW,
            canvasH
          );
          contentLeft = ax + arrowSize * 0.68;
        }
      } else if (panel.arrowPosition === 'right') {
        const ax = canvasW - safeMargin - arrowSize * 0.6;
        drawArrowGraphic(
          ctx,
          panel.arrowType,
          ax,
          canvasH * 0.56,
          arrowSize * 1.1,
          panel.textColor,
          canvasW,
          canvasH
        );
        contentRight = ax - arrowSize * 0.68;
      }
    }

    if (panel.pictogramType !== 'none') {
      const pictoSize = minDim * 0.46 * panel.pictogramScale;
      let px = canvasW / 2;
      let py = canvasH / 2;
      if (panel.shape === 'triangle-up') py = canvasH * 0.6;
      else if (panel.shape === 'triangle-down') py = canvasH * 0.4;
      else if (panel.pictogramPosition === 'top') {
        py = contentTop + pictoSize * 0.55;
        contentTop += pictoSize * 1.15;
      } else if (panel.pictogramPosition === 'left') {
        px = contentLeft + pictoSize * 0.55;
        contentLeft += pictoSize * 1.15;
      } else if (panel.pictogramPosition === 'right') {
        px = contentRight - pictoSize * 0.55;
        contentRight -= pictoSize * 1.15;
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

    if (panel.headerText) {
      ctx.fillStyle = panel.textColor;
      ctx.font = `700 ${Math.round(minDim * 0.11)}px ${fontStack}`;
      ctx.textBaseline = 'middle';
      drawTextWithTracking(
        ctx,
        panel.headerText,
        (contentLeft + contentRight) / 2,
        contentTop + minDim * 0.055,
        3,
        'center',
        (contentRight - contentLeft) * 0.92
      );
      contentTop += minDim * 0.13;
    }

    // Smart Non-Overlapping Route Badges Layout
    if (panel.badges && panel.badges.length > 0) {
      const isAutobahnBottom = panel.badges.some((b) => b.type === 'autobahn-hex');
      if (isAutobahnBottom) {
        const badgeSize = minDim * 0.18;
        const badgeY = canvasH - safeMargin - badgeSize * 0.42;
        panel.badges.forEach((b, idx) => {
          const bx = idx === 0 ? canvasW * 0.24 : canvasW * 0.44;
          drawInlineBadge(ctx, b, bx, badgeY, badgeSize, fontStack);
          if (b.direction) {
            ctx.fillStyle = panel.textColor;
            ctx.font = `700 ${Math.round(minDim * 0.095)}px ${fontStack}`;
            ctx.textBaseline = 'middle';
            drawTextWithTracking(ctx, b.direction, canvasW * 0.72, badgeY, 2, 'center', canvasW * 0.35);
          }
        });
        contentBottom = badgeY - badgeSize * 0.65;
      } else {
        const zoneW = Math.max(60, contentRight - contentLeft);
        let badgeSize = Math.min(minDim * 0.26, zoneW * 0.32);
        const gap = badgeSize * 0.24;

        // Measure total row width and auto-scale badgeSize if needed so badges never collide
        const measureRow = (sz: number) => {
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
          badgeSize *= (zoneW * 0.94) / rawRowW;
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
            ctx.textBaseline = 'middle';
            const dw = measureTrackedTextWidth(ctx, b.direction, 2);
            drawTextWithTracking(
              ctx,
              b.direction,
              cursorX + badgeSize * 0.14,
              badgeY,
              2,
              'left'
            );
            cursorX += dw + badgeSize * 0.22;
          }
          cursorX += gap;
        });

        contentTop += badgeSize * 1.12;
      }
    }

    // Render Multi-Line Text with automatic width fitting so text NEVER stretches or overflows!
    if (panel.lines.length > 0) {
      const zoneCenterX = (contentLeft + contentRight) / 2;
      const zoneWidth = Math.max(40, contentRight - contentLeft);
      const availableH = Math.max(minDim * 0.18, contentBottom - contentTop);
      const lineCount = panel.lines.length;
      const lineStep = availableH / lineCount;

      panel.lines.forEach((line, idx) => {
        ctx.fillStyle = line.color || panel.textColor;
        const maxLineFontH = lineStep * 0.82;
        const requestedPx = (line.fontSize / 100) * minDim * 0.22;
        const pxSize = Math.round(Math.min(requestedPx, maxLineFontH));
        ctx.font = `700 ${pxSize}px ${fontStack}`;
        ctx.textBaseline = 'middle';

        const ly = contentTop + lineStep * (idx + 0.5);
        let lx = zoneCenterX;
        if (line.align === 'left') lx = contentLeft + zoneWidth * 0.03;
        else if (line.align === 'right') lx = contentRight - zoneWidth * 0.03;

        drawTextWithTracking(
          ctx,
          line.text,
          lx,
          ly,
          line.letterSpacing,
          line.align,
          zoneWidth * 0.94
        );
      });
    }

    drawWeatheringOverlay(ctx, panel.wearAmount, canvasW, canvasH);
  }

  // Bake face bolts on LOD 1 and LOD 2
  if (panel.showFaceBolts && lod > 0) {
    ctx.save();
    const boltR = Math.max(4, minDim * 0.018);
    const boltPositions: [number, number][] =
      panel.shape === 'rounded-rect' && panel.width > 1.3
        ? [
            [canvasW * 0.12, canvasH * 0.12],
            [canvasW * 0.5, canvasH * 0.12],
            [canvasW * 0.88, canvasH * 0.12],
            [canvasW * 0.12, canvasH * 0.88],
            [canvasW * 0.5, canvasH * 0.88],
            [canvasW * 0.88, canvasH * 0.88],
          ]
        : [
            [canvasW * 0.5, canvasH * 0.12],
            [canvasW * 0.5, canvasH * 0.88],
          ];
    for (const [bx, by] of boltPositions) {
      ctx.beginPath();
      ctx.arc(bx, by, boltR, 0, Math.PI * 2);
      ctx.fillStyle = '#C2C8D0';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#4A525D';
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

export function renderExitTabTexture(
  exitTab: ExitTabConfig,
  parentPanel: SignPanelConfig,
  lod: LODLevel,
  tabWidthMeters = 1.0,
  tabHeightMeters = 0.38
): THREE.CanvasTexture {
  // Match exact physical aspect ratio of the 3D exit tab plaque so text is never stretched!
  const aspect = Math.max(1.2, Math.min(4.8, tabWidthMeters / Math.max(0.15, tabHeightMeters)));
  const h = lod === 0 ? 256 : lod === 1 ? 144 : 80;
  const w = Math.round(h * aspect);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const bg = exitTab.bgColor || parentPanel.bgColor;
  const fg = exitTab.textColor || parentPanel.textColor;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Uniform pixel border inset around all 4 sides
  const pad = Math.round(h * 0.085);
  const borderThick = Math.max(3, Math.round(h * 0.058));
  drawRoundedRectPath(ctx, pad, pad, w - pad * 2, h - pad * 2, h * 0.18);
  ctx.strokeStyle = parentPanel.borderColor;
  ctx.lineWidth = borderThick;
  ctx.stroke();

  const fontStack = getCSSFontStack(parentPanel.fontFamily);
  ctx.fillStyle = fg;
  ctx.textBaseline = 'middle';
  const maxTextW = w - pad * 4.5;

  if (exitTab.subText) {
    ctx.font = `700 ${Math.round(h * 0.4)}px ${fontStack}`;
    drawTextWithTracking(ctx, exitTab.text, w / 2, h * 0.38, 2, 'center', maxTextW);
    ctx.font = `700 ${Math.round(h * 0.24)}px ${fontStack}`;
    drawTextWithTracking(ctx, exitTab.subText, w / 2, h * 0.74, 1, 'center', maxTextW);
  } else {
    // Check if text matches standard "EXIT <num>" pattern for authentic MUTCD numeral emphasis
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
        drawTextWithTracking(ctx, word, startX, h * 0.54, 2, 'left');
        ctx.font = numFont;
        drawTextWithTracking(ctx, num, startX + wordW + gap, h * 0.51, 2, 'left');
      } else {
        ctx.font = `700 ${Math.round(h * 0.48)}px ${fontStack}`;
        drawTextWithTracking(ctx, exitTab.text, w / 2, h * 0.52, 2, 'center', maxTextW);
      }
    } else {
      ctx.font = `700 ${Math.round(h * 0.48)}px ${fontStack}`;
      drawTextWithTracking(ctx, exitTab.text, w / 2, h * 0.52, 2, 'center', maxTextW);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = lod === 0 ? 8 : lod === 1 ? 4 : 1;
  tex.needsUpdate = true;
  return tex;
}
