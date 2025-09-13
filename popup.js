const toggle = document.getElementById('toggle');
const showDecimals = document.getElementById('showDecimals');
const brutoInput = document.getElementById('brutoInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');

chrome.storage.sync.get(['enabled', 'rounding'], (data) => {
  toggle.checked = data.enabled !== false;
  showDecimals.checked = data.rounding === false;
});

toggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});

showDecimals.addEventListener('change', () => {
  chrome.storage.sync.set({ rounding: !showDecimals.checked });
});

calculateBtn.addEventListener('click', () => {
  const bruto = parseFloat(brutoInput.value);
  if (isNaN(bruto)) {
    resultDiv.textContent = "Please enter a valid number.";
    return;
  }

  // Example calculation: neto = bruto - 22% tax
  let neto = bruto * 0.78;

  chrome.storage.sync.get(['rounding'], (data) => {
    if (data.rounding !== false) {
      neto = Math.round(neto);
    } else {
      neto = neto.toFixed(2);
    }
    resultDiv.textContent = `Neto: ${neto}`;
  });
});
