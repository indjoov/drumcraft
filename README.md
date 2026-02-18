# 🥁 DrumCraft

**An open-source, accessible drum tuning app for the web.**

DrumCraft is a modern, browser-based drum tuner built with React. It provides lug-by-lug tuning guidance with a visual drum head diagram, frequency analysis, and haptic feedback — all running entirely in your browser with zero backend required.

Part of the **Craft Audio** family alongside [PitchCraft](https://github.com/indjoov/pitchcraft).

---

## ✨ Features

### 🥁 Multi-Drum Support
Each drum includes a custom SVG illustration and tuning range:

| Drum | Lugs | Batter Range | Resonant Range | Sizes |
|------|------|-------------|----------------|-------|
| Snare | 8 | 220–330 Hz | 280–420 Hz | 13", 14" |
| Bass Drum | 8 | 55–90 Hz | 60–100 Hz | 18", 20", 22", 24" |
| Rack Tom | 6 | 140–240 Hz | 160–280 Hz | 10", 12", 13" |
| Floor Tom | 8 | 80–160 Hz | 90–180 Hz | 14", 16", 18" |
| Hi-Hat | 6 | 300–500 Hz | 330–550 Hz | 13", 14", 15" |

### 🎯 Lug-by-Lug Tuning
- Interactive drum head diagram showing all lug positions
- Tap a lug to select it, then strike your drum to measure
- Record readings for each lug and track evenness across the head
- Color-coded feedback: green (on target), yellow (close), red (off)
- Spread analysis showing the Hz difference between highest and lowest lugs

### 🔊 Real-Time Pitch Detection
- Autocorrelation-based frequency detection via the Web Audio API
- Visual deviation meter showing how far you are from target
- Adjustable target frequency with a slider for each drum/head combination
- Live volume indicator

### 📳 Haptic Feedback
- Vibration patterns indicate tuning accuracy on supported devices
- Short pulse = on target, medium pattern = close, long pattern = needs adjustment
- Critical for deaf and hard-of-hearing drummers

### ♿ Accessibility
- **High Contrast Mode** — increased contrast for low-vision users
- **Reduced Motion Mode** — disables all animations
- **Large Text Mode** — scales text up 25%
- **Full keyboard navigation** — every lug and control is tab-accessible
- **Screen reader support** — ARIA roles, labels, and live regions throughout
- **Haptic feedback** — vibration-based tuning cues via the Vibration API

### 💡 Tuning Tips
- Built-in tips for each drum type
- Guidance on batter vs. resonant head relationships
- Size-specific frequency recommendations

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/indjoov/drumcraft.git
cd drumcraft

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

---

## 🏗️ Project Structure

```
drumcraft/
├── public/
├── src/
│   ├── App.jsx
│   ├── drumcraft-tuner.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

---

## 🛠️ Tech Stack

- **React** — UI framework
- **Vite** — Build tool and dev server
- **Web Audio API** — Microphone input and pitch detection
- **Vibration API** — Haptic feedback for accessibility
- **No external audio libraries** — all detection built from scratch

---

## 🎛️ How It Works

1. Select your drum type, size, and head (batter or resonant)
2. Set your target frequency using the slider
3. Tap a lug on the interactive drum head diagram
4. Start the tuner and strike your drum near that lug
5. Record the reading — DrumCraft saves it and shows deviation
6. Work around the head (star pattern recommended) until all lugs are even
7. Haptic feedback tells you how close you are without looking at the screen

---

## 🗺️ Roadmap

- [ ] Star pattern guide (suggested lug order for even tuning)
- [ ] Preset tuning recipes (jazz, rock, funk, etc.)
- [ ] Save/load tuning sessions
- [ ] Frequency spectrum visualization
- [ ] Side-by-side batter/resonant comparison
- [ ] PWA support for offline use
- [ ] MIDI trigger support
- [ ] Localization / i18n

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🔗 Related Projects

- [PitchCraft](https://github.com/indjoov/pitchcraft) — Open-source accessible chromatic tuner

---

<p align="center">
  Made with 🥁 by <a href="https://github.com/indjoov">indjoov</a> and the DrumCraft community
</p>
