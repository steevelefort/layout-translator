const baseUrl = 'https://raw.githubusercontent.com/Nuclear-Squid/ergol/master/layouts/';

const availableLayouts = {
  ISRT: 'ISRT.json',
  MTGAP: 'MTGAP.json',
  azerty: 'azerty.json',
  bepo: 'bepo.json',
  colemak_dh: 'colemak-dh.json',
  colemak: 'colemak.json',
  dvorak: 'dvorak.json',
  ergol: 'ergol.json',
  ergolv01: 'ergolv01.json',
  ergolv02: 'ergolv02.json',
  ergolv03: 'ergolv03_4.json',
  ergolv05: 'ergolv05.json',
  lafayette: 'lafayette.json',
  optimol: 'optimol.json',
  optimot: 'optimot.json',
  qwerty: 'qwerty.json',
  workman: 'workman.json'
  // 'bepo42.json',
  // 'dvorak42.json',
  // 'lafayette42.json',
  // 'optimot42.json',
}

const outputTag = document.querySelector('.output');
const inputSelect = document.getElementById('inputLayout');
const outputSelect = document.getElementById('outputLayout');

function populateSelect(id, defaultValue) {

  const select = document.getElementById(id);
  for (const layout in availableLayouts) {

    const option = document.createElement("option");
    option.innerText = layout;
    option.value = availableLayouts[layout]
    if (availableLayouts[layout] == defaultValue) {
      option.setAttribute("selected",true)
    }

    select.appendChild(option)
  }
  select.addEventListener("change", () => {
    localStorage.setItem('defaultInput', inputSelect.value)
    localStorage.setItem('defaultOutput', outputSelect.value)
    window.location.reload();
  })

}

async function loadLayout(layout) {
  try {
    const response = await fetch(baseUrl + layout);
    const map = await response.json();
    return map;
  } catch (err) {
    alert(err.message);
  }
}

(async () => {

  // Load configuration
  const defaultInput = localStorage.getItem('defaultInput') || availableLayouts.bepo;
  const defaultOutput = localStorage.getItem('defaultOutput') || availableLayouts.qwerty;

  populateSelect("inputLayout", defaultInput)
  populateSelect("outputLayout", defaultOutput)

  let inputMap = await loadLayout(defaultInput);
  let outputMap = await loadLayout(defaultOutput);

  console.log(inputMap)

  document.body.addEventListener('keydown', (event) => {
    console.log(event.key)

    let keyDef = null;
    let keyIndex = null;

    for (const key in inputMap.keymap) {
      console.log(inputMap.keymap[key])
      const index = inputMap.keymap[key].findIndex((item) => item === event.key)
      console.log(index)
      if (index > -1) {
        keyDef = key;
        keyIndex = index;
        break;
      }
    }
    // inputMap.keymap.find( (key) => key.contains(event.key))
    console.log(keyDef)

    source = inputMap.keymap[keyDef][keyIndex]
    target = outputMap.keymap[keyDef][keyIndex]
    // console.log(target)

    const symbolFrame = document.createElement("div")
    const inputSymbol = document.createElement("div")
    const outputSymbol = document.createElement("div")
    symbolFrame.className = "key"
    inputSymbol.className = "char in"
    outputSymbol.className = "char out"
    inputSymbol.innerText = source;
    outputSymbol.innerText = target;
    symbolFrame.appendChild(inputSymbol)
    symbolFrame.appendChild(outputSymbol)

    // inputTag.children[1].innerHTML += source;
    outputTag.appendChild(symbolFrame);
    outputTag.scrollTop = outputTag.scrollHeight;


  })

})();

