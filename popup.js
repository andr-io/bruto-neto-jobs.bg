/****************************************************
 * POPUP SETTINGS HANDLER (runs ONLY inside popup)
 ****************************************************/
if (document.getElementById("toggle")) {
  const toggle = document.getElementById("toggle");

  chrome.storage.sync.get(["enabled"], (data) => {
    if (data.enabled === undefined) {
      toggle.checked = true;
      chrome.storage.sync.set({ enabled: true });
    } else {
      toggle.checked = data.enabled;
    }
  });

  toggle.addEventListener("change", () => {
    chrome.storage.sync.set({ enabled: toggle.checked });
  });
}

/****************************************************
 * EUR → BGN → EUR NET SALARY CALCULATION
 ****************************************************/
function calculateNetEUR(grossEUR) {
  const EUR_TO_BGN = 1.95583;

  // Convert to BGN
  const grossBGN = grossEUR * EUR_TO_BGN;

  const C = 100;
  const gross = Math.round(grossBGN * C);

  const SSC_RATE = 13.78 / 100;
  const TAX_RATE = 10 / 100;
  const SSC_CAP = 4130 * C; // cap is in BGN

  const base = Math.min(gross, SSC_CAP);
  const ssc = Math.round(base * SSC_RATE);
  const taxable = gross - ssc;
  const tax = Math.round(taxable * TAX_RATE);
  const netBGN = gross - ssc - tax;

  // Convert back to EUR
  const netEUR = netBGN / C / EUR_TO_BGN;
  const sscEUR = ssc / C / EUR_TO_BGN;
  const taxEUR = tax / C / EUR_TO_BGN;

  const format = (v) => v.toFixed(2);

  return {
    net: format(netEUR),
    ssc: format(sscEUR),
    tax: format(taxEUR),
  };
}

/****************************************************
 * POPUP CALCULATION HANDLER
 ****************************************************/
const brutoInput = document.getElementById("brutoInput");
const calculateBtn = document.getElementById("calculateBtn");
const resultDiv = document.getElementById("result");

if (calculateBtn && brutoInput && resultDiv) {
  calculateBtn.addEventListener("click", () => {
    const bruto = parseFloat(brutoInput.value);

    if (isNaN(bruto) || bruto <= 0) {
      resultDiv.textContent = "Please enter a valid bruto amount.";
      return;
    }

    const { net, ssc, tax } = calculateNetEUR(bruto);

    resultDiv.textContent =
      `Net: ${net} EUR`;
  });
}


// Trigger calculation when pressing Enter in the input
brutoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    calculateBtn.click();
  }
});

