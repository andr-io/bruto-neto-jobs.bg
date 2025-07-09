const toggle = document.getElementById('toggle');
const showDecimals = document.getElementById('showDecimals');

chrome.storage.sync.get(['enabled', 'rounding'], (data) => {
  toggle.checked = data.enabled !== false;              // default: enabled
  showDecimals.checked = data.rounding === false;       // default: unchecked (rounding = true)
});

toggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});

showDecimals.addEventListener('change', () => {
  // Save the inverse: rounding = !showDecimals
  chrome.storage.sync.set({ rounding: !showDecimals.checked });
});
