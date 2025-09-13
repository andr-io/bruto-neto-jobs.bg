# 💼 Jobs.bg Bruto → Neto Converter

Chrome extension that auto-converts gross (Бруто) salaries on [jobs.bg](https://www.jobs.bg) into net (Нето) estimates — directly on the site.

---

## ✅ Features

- Detects listings like `от 3000 до 5000 BGN (Бруто)`
- Adds net equivalents: `от 3000 (2327) до 5000 (3880)`
- Skips `(Нето)`-marked entries
- Popup options:
  - Enable/disable conversion
  - Show/hide decimals
  - **Bruto → Neto calculator**: input any gross salary and get the net estimate instantly
- Tax logic:
  - 13.78% social security (up to 4130 BGN)
  - 10% income tax

---

## 🧩 Install (Load Unpacked)

1. Clone or download this repo  
2. Go to `chrome://extensions/` in Chrome  
3. Enable **Developer mode**  
4. Click **Load unpacked** → select the folder  
5. J icon appears — click to configure

---

## 🛠️ Files

- `manifest.json` – Config  
- `content.js` – Salary logic  
- `popup.html/.js` – UI, toggles & calculator  
- `background.js` – Default settings  
- `icon128.png` – Icon

---

## 📌 Notes

- Runs only on `https://www.jobs.bg/*`  
- No data sent — all processing is local  
- Estimates based on 2025 Bulgarian tax rules
