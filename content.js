function calculateNetBGN(grossBGN, round = false) {
  const C = 100;
  const gross = Math.round(grossBGN * C);

  const SSC_RATE = 13.78 / 100;
  const TAX_RATE = 10 / 100;
  const SSC_CAP = 4130 * C;

  const base = Math.min(gross, SSC_CAP);
  const ssc = Math.round(base * SSC_RATE);
  const taxable = gross - ssc;
  const tax = Math.round(taxable * TAX_RATE);
  const net = gross - ssc - tax;

  const format = (val) => round ? Math.round(val / C).toString() : (val / C).toFixed(2);

  return {
    gross: format(gross),
    ssc: format(ssc),
    tax: format(tax),
    net: format(net),
  };
}

function createProcessor(round) {
  function processSalaryText(text) {
    const rangeRegex = /от (\d{3,5}) до (\d{3,5}) BGN/;
    const singleRegex = /(\d{3,5}) BGN/;

    if (rangeRegex.test(text)) {
      const match = text.match(rangeRegex);
      const from = parseInt(match[1]);
      const to = parseInt(match[2]);
      const netFrom = calculateNetBGN(from, round).net;
      const netTo = calculateNetBGN(to, round).net;
      return `от ${from} (${netFrom}) до ${to} (${netTo}) BGN`;
    } else if (singleRegex.test(text)) {
      const match = text.match(singleRegex);
      const amount = parseInt(match[1]);
      const net = calculateNetBGN(amount, round).net;
      return `${amount} (${net}) BGN`;
    }

    return null;
  }

  function processElement(el) {
    if (!el) return;

    const text = el.textContent;

    // Only process if it contains (Бруто) and NOT (Нето)
    if (!text.includes('(Бруто)') || text.includes('(Нето)')) return;

    const bolds = el.querySelectorAll('b, strong');
    bolds.forEach(b => {
      const original = b.textContent;
      const updated = processSalaryText(original);
      if (updated && !original.includes('(')) {
        b.textContent = updated;
      }
    });
  }

  function scanPage() {
    const candidates = document.querySelectorAll('div, span, p, li');
    candidates.forEach(el => processElement(el));
  }

  function observeAndConvert() {
    const observer = new MutationObserver(() => {
      scanPage();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    scanPage(); // Initial run
  }

  return observeAndConvert;
}

// 🔁 Load settings and run if enabled
chrome.storage.sync.get(['enabled', 'rounding'], (data) => {
  if (data.enabled === false) {
    console.log('[Bruto→Neto] Extension is disabled.');
    return;
  }

  const round = data.rounding !== false; // default to true
  const observeAndConvert = createProcessor(round);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeAndConvert);
  } else {
    observeAndConvert();
  }
});
