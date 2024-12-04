

export const hslToHex = (h: number, s: number, l: number) => {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
};

export const hsvToHex = (h: number, s: number, v: number) => {
  const rgb = hsvToRgb(h, s, v);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

export const 	hslToRgb = (h: number, s: number, l: number) => {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  }
  else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    /* g b 对换 */
    g = hueToRgb(p, q, h );
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export const hueToRgb = (p:number, q:number, t:number)  => {
  if (t < 0)
    t += 1;
  if (t > 1)
    t -= 1;
  if (t < 1 / 6)
    return p + (q - p) * 6 * t;
  if (t < 1 / 2)
    return q;
  if (t < 2 / 3)
    return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

export const rgbToHex = (r: number, g: number, b: number) => {
  if (r > 255 || g > 255 || b > 255) {
    throw new Error("Invalid color component");
  }
  const tmp = ((r << 16) | (g << 8) | b).toString(16);
  return "#" + ("000000" + tmp).slice(-6);
};

export const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
};

export const rgbToHsv = (r: number, g: number, b: number) => {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h = 0, s, v = max;
  var d = max - min;
  s = max == 0 ? 0 : d / max;
  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, v };
}

export const hsvToRgb = (h: number, s: number, v: number) => {
  let r = 0,
    g = 0,
    b = 0;

  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
};

export function hexToRgb(hex: string) {
  if (hex[0] === "#") hex = hex.substr(1);
  if (hex.length === 3) {
    const temp = hex; // 使用const，因为temp不会被重新赋值
    hex = "";
    // 使用正则获取匹配结果，temp此时是一个字符串数组
    const matches = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp)?.slice(1);
    if (matches) {
      for (let i = 0; i < 3; i++) {
        // 使用let，因为i会改变
        hex += matches[i] + matches[i];
      }
    }
  }
  const triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/i
    .exec(hex)
    ?.slice(1); // 使用const
  if (!triplets) {
    throw new Error("Invalid hex color");
  }
  return {
    r: parseInt(triplets[0], 16),
    g: parseInt(triplets[1], 16),
    b: parseInt(triplets[2], 16),
    a: 255,
  };
}


export const 	hsvToHsl = (h: number, s: number, v: number) => {
  return {
    h,
    s: s * v / Math.max(0.00000001, ((h = (2 - s) * v) < 1 ? h : 2 - h)), 
    l: h / 2
  };
}
