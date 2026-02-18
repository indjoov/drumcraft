# Contributing to DrumCraft

Thank you for your interest in contributing to DrumCraft! Whether you're fixing a bug, adding drum support, improving accessibility, or suggesting a feature — every contribution helps drummers tune better.

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code.

---

## How Can I Contribute?

### 🐛 Report a Bug
Open an issue with steps to reproduce, expected vs. actual behavior, and browser/OS info.

### 💡 Suggest a Feature
Open an issue describing the problem, your proposed solution, and any alternatives.

### 🥁 Add a New Drum Type
See the "Adding a New Drum" section below.

### ♿ Improve Accessibility
Accessibility is a core value. If you find barriers, please report or fix them.

### 📝 Improve Documentation
Documentation PRs are always welcome.

---

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/drumcraft.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`
5. Start the dev server: `npm run dev`

---

## Commit Messages

```
feat: add floor tom support
fix: correct frequency detection for low drums
a11y: add haptic feedback patterns
docs: update README with new drums
```

Prefixes: `feat`, `fix`, `a11y`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Accessibility Guidelines

All contributions must meet these standards:

1. **Keyboard Navigation** — every interactive element reachable via keyboard
2. **Screen Reader Support** — semantic HTML, ARIA labels, live regions
3. **Color Contrast** — WCAG 2.1 AA (4.5:1 for text)
4. **Motion** — respect the reducedMotion setting
5. **Haptic Feedback** — use Vibration API patterns for tuning accuracy
6. **Text Scaling** — respond to the largeText setting

---

## Adding a New Drum

### 1. Add the drum data

In `drumcraft-tuner.jsx`, add an entry to the `DRUMS` array:

```javascript
{
  id: "your-drum",
  name: "Your Drum",
  lugs: 8,
  topRange: [100, 200],      // Batter head frequency range in Hz
  bottomRange: [120, 220],   // Resonant head frequency range
  color: "#HEX",
  accent: "#HEX",
  description: "Brief description",
  sizes: ['12"', '14"'],
  defaultSize: '14"',
  tips: "Tuning tip for this drum type.",
}
```

### 2. Create an SVG illustration

```javascript
function YourDrumSVG({ color, accent, size = 100 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      {/* Your illustration */}
    </svg>
  );
}
```

### 3. Register the SVG

```javascript
const DrumSVGs = {
  // ...existing
  "your-drum": YourDrumSVG,
};
```

### 4. Test
- Verify frequency ranges are accurate for the drum
- Test the lug diagram at different lug counts
- Check accessibility (keyboard, screen reader, haptic)

---

## Questions?

Open an issue or start a discussion. Thank you for helping make DrumCraft better! 🥁
