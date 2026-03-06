// Inject CSS for colored net values
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .net-salary {
      color: #0a8f08 !important;
      font-weight: bold;
      cursor: help;
    }
  `;
  document.head.appendChild(style);
})();

// Currency conversion
const EUR_TO_BGN = 1.95583;
const BGN_TO_EUR = 1 / EUR_TO_BGN;

// Convert EUR → BGN
function eurToBgn(eur) {
  return eur * EUR_TO_BGN;
}

// Convert BGN → EUR
function bgnToEur(bgn) {
  return bgn * BGN_TO_EUR;
}

// Net salary calculator (BGN only)
function calculateNetBGN(grossBGN) {
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

  return {
    gross: gross / C,
    ssc: ssc / C,
    tax: tax / C,
    net: net / C,
  };
}

// Format whole numbers only
function fmt(num) {
  return Math.round(num).toString();
}

// Main processor
function createProcessor() {
  function convertAndCalculate(amount, currency) {
    let grossBGN;

    if (currency === "EUR") {
      grossBGN = eurToBgn(amount);
    } else {
      grossBGN = amount;
    }

    const netBGN = calculateNetBGN(grossBGN).net;
    const netEUR = bgnToEur(netBGN);

    return {
      bgn: Math.round(netBGN),
      eur: Math.round(netEUR),
    };
  }

  function processSalaryText(text) {
    const rangeRegex = /от\s+(\d{3,5})\s+до\s+(\d{3,5})\s+(EUR|BGN)/;
    const singleRegex = /(\d{3,5})\s+(EUR|BGN)/;

    // RANGE
    if (rangeRegex.test(text)) {
      const [, from, to, currency] = text.match(rangeRegex);

      const fromNum = parseInt(from, 10);
      const toNum = parseInt(to, 10);

      const netFrom = convertAndCalculate(fromNum, currency);
      const netTo = convertAndCalculate(toNum, currency);

      return `
        от ${from}
        <span class="net-salary" title="${netFrom.bgn} BGN">(${netFrom.eur})</span>
        до ${to}
        <span class="net-salary" title="${netTo.bgn} BGN">(${netTo.eur})</span>
        ${currency}
      `;
    }

    // SINGLE
    if (singleRegex.test(text)) {
      const [, amount, currency] = text.match(singleRegex);
      const amountNum = parseInt(amount, 10);

      const net = convertAndCalculate(amountNum, currency);

      return `
        ${amount}
        <span class="net-salary" title="${net.bgn} BGN">(${net.eur})</span>
        ${currency}
      `;
    }

    return null;
  }

  function processElement(el) {
    if (!el) return;

    const text = el.textContent;

    if (!text.includes("(Бруто)") || text.includes("(Нето)")) return;

    const bolds = el.querySelectorAll("b, strong");
    bolds.forEach((b) => {
      const original = b.textContent.trim();
      const updated = processSalaryText(original);
      if (updated && !original.includes("(")) {
        b.innerHTML = updated;
      }
    });
  }

  function scanPage() {
    document.querySelectorAll("div, span, p, li").forEach(processElement);
  }

  function observeAndConvert() {
    const observer = new MutationObserver(scanPage);
    observer.observe(document.body, { childList: true, subtree: true });
    scanPage();
  }

  return observeAndConvert;
}

// Load settings and run
chrome.storage.sync.get(["enabled"], (data) => {
  if (data.enabled === false) return;

  const observeAndConvert = createProcessor();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeAndConvert);
  } else {
    observeAndConvert();
  }
});
