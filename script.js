const datasets = [
  {
    name: "aBeacon: Courier Arrival Detection",
    description: "BLE sensing, location traces, and manual reports from 31,131 couriers at 2,466 merchant locations.",
    type: "trajectory",
    label: "Mobility trace",
    scale: "31,131 couriers",
    source: "Rutgers / Alibaba",
    link: "https://tianchi.aliyun.com/dataset/dataDetail?dataId=76359"
  },
  {
    name: "ETC Transaction Dataset V0",
    description: "Anonymized highway transactions with origins, destinations, and timestamps for mobility-flow research.",
    type: "flow",
    label: "Origin–destination",
    scale: "2.5M records",
    source: "Rutgers",
    link: "https://www.cs.rutgers.edu/~dz220/Data/ETCData.rar"
  },
  {
    name: "Electric Vehicle GPS Dataset V0",
    description: "One day of longitude, latitude, time, and speed observations from electric taxis in Shenzhen, China.",
    type: "trajectory",
    label: "GPS trajectory",
    scale: "1.15M records",
    source: "Rutgers",
    link: "https://www.cs.rutgers.edu/~dz220/Data/ETData.rar"
  },
  {
    name: "Urban Multi-Modal Dataset V2",
    description: "A cross-domain Shenzhen corpus spanning cellphone CDR, smartcard, taxi, bus, and truck GPS data.",
    type: "multimodal",
    label: "Multi-modal",
    scale: "7 GB · 5 modes",
    source: "Rutgers / UMN",
    link: "http://www-users.cs.umn.edu/~tianhe/BIGDATA/UrbanCPS/"
  },
  {
    name: "AutoSTDiff Synthetic Trajectories",
    description: "Privacy-safe trajectory datasets and generation scripts released with the SDM 2025 model.",
    type: "trajectory",
    label: "Synthetic trajectory",
    scale: "SDM 2025",
    source: "MobilityNet / FSU",
    link: "https://github.com/Rongchao98/AutoSTDiff"
  },
  {
    name: "GeoGen Synthetic LBSN Trajectories",
    description: "Fine-grained synthetic location-based social-network trajectories from a coarse-to-fine generator.",
    type: "trajectory",
    label: "Synthetic trajectory",
    scale: "AAAI 2026",
    source: "MobilityNet / FSU",
    link: "https://github.com/Rongchao98/GeoGen"
  }
];

const list = document.querySelector("#dataset-list");
const search = document.querySelector("#dataset-search");
const filters = [...document.querySelectorAll(".filter")];
let activeFilter = "all";

function renderDatasets() {
  const query = search.value.trim().toLowerCase();
  const visible = datasets.filter((dataset) => {
    const matchesType = activeFilter === "all" || dataset.type === activeFilter;
    const haystack = `${dataset.name} ${dataset.description} ${dataset.label} ${dataset.source}`.toLowerCase();
    return matchesType && haystack.includes(query);
  });

  if (!visible.length) {
    list.innerHTML = '<p class="catalog-empty">No datasets match this search. Try another term or filter.</p>';
    return;
  }

  list.innerHTML = visible.map((dataset) => {
    const index = String(datasets.indexOf(dataset) + 1).padStart(2, "0");
    return `
      <a class="dataset-item" href="${dataset.link}" target="_blank" rel="noopener">
        <span class="number">${index}</span>
        <div><h3>${dataset.name}</h3><p>${dataset.description}</p></div>
        <div class="dataset-meta"><strong>${dataset.label}</strong>${dataset.scale}</div>
        <div class="dataset-meta"><strong>Source</strong>${dataset.source}</div>
        <span class="dataset-arrow" aria-hidden="true">↗</span>
      </a>`;
  }).join("");
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    renderDatasets();
  });
});

search.addEventListener("input", renderDatasets);
renderDatasets();

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector("#nav-links");

menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("open", !expanded);
  document.body.classList.toggle("menu-open", !expanded);
});

navLinks.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  menuButton.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.querySelector("#year").textContent = new Date().getFullYear();
