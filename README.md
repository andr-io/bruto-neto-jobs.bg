# 🦊 Jobs.bg Bruto → Neto Salary Converter

This Chrome extension automatically converts gross (Бруто) salary listings on [jobs.bg](https://www.jobs.bg) into net (Нето) salary estimates — right on the page. It uses accurate 2025 Bulgarian tax rules and preserves the original formatting.

---

## ✅ Features

- Detects salaries like `от 3000 до 5000 BGN (Бруто)`
- Appends net equivalents: `от 3000 (2327) до 5000 (3880) BGN (Бруто)`
- Skips listings already marked as `(Нето)`
- Popup with two toggles:
  - ✅ Enable/disable conversion
  - ✅ Show/hide decimal values (e.g. `1700.05` vs `1700`)
- Accurate tax calculation based on:
  - 13.78% social security contributions (up to 4130 BGN cap)
  - 10% income tax

---

## 🧩 How to Install (via Load Unpacked)

1. **Download or clone** this repository to your computer.

2. Open **Google Chrome** and go to  
   `chrome://extensions/`

3. In the top-right corner, **enable Developer mode**.

4. Click **“Load unpacked”** and select the folder where this extension is saved.

5. You should now see the 🦊 icon in your toolbar. Click it to open the popup and configure options.

---

## 🛠️ Files Included

- `manifest.json` – Extension configuration
- `content.js` – Main logic for detecting and converting salaries
- `popup.html` – Simple popup UI
- `popup.js` – Toggle logic using Chrome storage
- `background.js` – Sets default settings on first install
- `icon128.png` – Extension icon

---

## 📌 Notes

- This extension only runs on `https://www.jobs.bg/*`
- It does not modify or send any data — all processing is done locally
- Net salary estimates are based on 2025 Bulgarian tax rules and may vary slightly depending on individual circumstances

---

