import { hsla, mix, parseToHsla } from "color2k";

export const getColorFromNormal = (score: number): string => {
  const high = "hsl(188, 96%, 21%)";
  const mid = "hsl(188, 25%, 52%)";
  const low = "hsla(189, 26%, 84%, 1)";

  let mixedColor: string;

  if (score <= 0.5) {
    // Mix between low and mid for scores 0 to 0.5
    mixedColor = mix(low, mid, score * 2);
  } else {
    // Mix between mid and high for scores 0.5 to 1
    mixedColor = mix(mid, high, (score - 0.5) * 2);
  }

  // Parse the mixed color to HSLA
  const [hue, saturation, lightness, alpha] = parseToHsla(mixedColor);

  // Create the final color with opacity
  return hsla(hue, saturation, lightness, alpha);
};