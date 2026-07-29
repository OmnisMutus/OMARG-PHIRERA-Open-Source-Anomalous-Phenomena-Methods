import codex from './glyphCodex.json' with { type: "json" };

export const hsvLerp = (h1, s1, v1, h2, s2, v2, t) => {
  const dh = ((h2 - h1 + 180) % 360) - 180;
  const h = (h1 + dh * t + 360) % 360;
  const s = s1 + (s2 - s1) * t;
  const v = v1 + (v2 - v1) * t;
  return [h, s, v];
};

export const colorTween = (startHSV, endHSV, durationSec) => {
  if (typeof window === 'undefined') return;
  const start = performance.now();
  const step = () => {
    const now = performance.now();
    const prog = Math.min((now - start) / (durationSec * 1000), 1);
    const [h, s, v] = hsvLerp(...startHSV, ...endHSV, prog);
    document.documentElement.style.setProperty('--sephira-h', h);
    document.documentElement.style.setProperty('--sephira-s', `${s}%`);
    document.documentElement.style.setProperty('--sephira-v', `${v}%`);
    if (prog < 1) requestAnimationFrame(step);
  };
  step();
};

export const flash = (colorHex, ms) => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty('--flash-bg', colorHex);
  document.documentElement.classList.add('flash-active');
  setTimeout(() => {
    document.documentElement.classList.remove('flash-active');
  }, ms);
};

export const stutter = (palette, cycles, intervalMs) => {
  if (typeof window === 'undefined') return;
  let i = 0;
  const flip = () => {
    const p = palette[i % palette.length];
    document.documentElement.style.setProperty('--sephira-h', p[0]);
    document.documentElement.style.setProperty('--sephira-s', `${p[1]}%`);
    document.documentElement.style.setProperty('--sephira-v', `${p[2]}%`);
    i++;
    if (i < cycles * 2) setTimeout(flip, intervalMs);
  };
  flip();
};

export const applyJitter = (gamma) => {
  if (typeof window === 'undefined') return;
  const maxJitter = 2.0; // px
  const boundedGamma = Math.min(Math.max(gamma, 0.2), 0.85);
  const jitter = ((0.85 - boundedGamma) / 0.65) * maxJitter; // lower gamma = higher wobble
  document.documentElement.style.setProperty('--jitter', `${jitter}px`);
};

export const UIFlow = {
  palettes: {
    intro:  [[codex.Atziluth.h, codex.Atziluth.s, codex.Atziluth.v], [codex.Atziluth.h + 10, codex.Atziluth.s + 5, codex.Atziluth.v + 2]],
    verse1: [[codex.Briah.h, codex.Briah.s, codex.Briah.v], [codex.Briah.h + 20, codex.Briah.s + 5, codex.Briah.v + 5]],
    bridge: [[codex.Yetzirah.h, codex.Yetzirah.s, codex.Yetzirah.v], [codex.Yetzirah.h + 15, codex.Yetzirah.s + 10, codex.Yetzirah.v + 5]],
    chorus: [[codex.Assiah.h, codex.Assiah.s, codex.Assiah.v], [codex.Assiah.h + 10, codex.Assiah.s + 5, codex.Assiah.v + 10]],
    outro:  [[codex.Daath.h, codex.Daath.s, codex.Daath.v], [codex.Daath.h - 10, codex.Daath.s - 5, codex.Daath.v - 5]]
  },

  transitionTo(section, gamma = 0.5) {
    const p = this.palettes[section.label] || this.palettes.intro;
    applyJitter(gamma);
    
    switch (section.label) {
      case 'intro':
        colorTween(p[0], p[1], 2.0); // gentle inhale
        break;
      case 'verse1':
        colorTween(p[0], p[1], 1.3);
        break;
      case 'bridge':
        flash('#ffffff', 120); // sudden exhale
        setTimeout(() => colorTween(p[0], p[1], 0.8), 150);
        break;
      case 'chorus':
        stutter(p, 4, 70); // polyrhythmic pause
        break;
      case 'outro':
        colorTween(p[0], [codex.Daath.h, codex.Daath.s, codex.Daath.v], 4.0); // coda fade
        break;
      default:
        colorTween(p[0], p[1], 1.0);
    }
  }
};
