const url = new URL(window.location.href);
if (url.pathname.startsWith("/mod/")) {
  const load = async (id) => {
    const modsR = await fetch(
      "https://raw.githubusercontent.com/SkyblockClient/SkyblockClient-REPO/main/files/mods.json",
    );
    const mods = await modsR.json();

    const mod = mods.find((m) => m.id === id);
    window.location.href = mod.url;
  };
  load(url.pathname.slice(5));
}

const words = [
  "page absent",
  "data missing",
  "404 induced",
  "url unfound",
  "web dead-end",
  "virtual vacancy",
  "online void",
  "disconnected",
  "route broken",
  "pathless",
  "lost link",
  "nowhere to be seen",
  "content vanish",
  "cyberspace ghost",
  "web wanderlust",
  "url unknown",
  "page emptiness",
  "link limbo",
  "site silenced",
  "disappeared",
  "net neglected",
  "web wilderness",
  "page oblivion",
  "elusive url",
  "link lost",
  "abandoned site",
  "unreachable",
  "uncanny void",
  "page vacuum",
  "url anomaly",
  "link unraveled",
  "vanished page",
  "site void",
  "web bewilderment",
  "disappeared content",
  "errant url",
  "mystery link",
  "elusive webpage",
  "disappearing act",
  "site absence",
  "perplexing void",
  "web anomaly",
  "missing page",
  "link abyss",
  "digital disappearance",
  "web black hole",
  "puzzling void",
  "fractured route",
  "url unearthed",
  "lost site",
  "unfindable",
  "vanished destination",
  "dislocated link",
  "web nowhere",
  "untraced page",
  "disappeared realm",
  "web nowhere to be found",
  "online black hole",
  "unseen site",
  "gone page",
  "web nowhere to be seen",
  "disappeared location",
  "url vacuum",
  "link chasm",
  "siteblack hole",
  "missing in cyberspace",
  "web vanished",
  "disappeared direction",
  "unreachable page",
  "evasive site",
  "link void",
  "web extinction",
  "gone url",
  "internet obscurity",
  "disappeared path",
  "page blank",
  "vanished link",
  "site vacancy",
  "unfindable page",
  "web emptiness",
  "mystery page",
  "web disappearance",
  "vanished site",
  "url void",
  "disappearance",
  "site vanished",
  "absent page",
  "missing webpage",
  "url black hole",
  "page chasm",
];

const rows = Math.floor(window.innerHeight / 64);
const rowHeight = window.innerHeight / rows;

const wrapper = document.createElement("div");
wrapper.style.fontSize = `${rowHeight}px`;
wrapper.classList.add("wrapper");
for (let i = 0; i < rows; i++) {
  const row = document.createElement("div");
  row.style.setProperty("--offset", `-${Math.random() * 5}em`);
  row.classList.add("row");

  for (let i = 0; i < 1000; i++) {
    const word = words[Math.floor(Math.random() * words.length)];
    const span = document.createElement("span");
    span.innerText = word;
    row.appendChild(span);
  }

  wrapper.appendChild(row);
}
document.body.appendChild(wrapper);
