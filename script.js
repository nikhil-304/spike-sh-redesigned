// --- Hamburger Menu Logic (Fix: Navbar reverts to full width when menu open) ---
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const navbar = document.getElementById("navbar");
let isMenuOpen = false;
let isFloating = false; // Track floating state to restore after closing menu

// Explicit initial state
gsap.set(navbar, {
  width: "100%",
  maxWidth: "100%",
  top: "0px",
  borderRadius: "0px",
  backgroundColor: "#FFFFFF",
  boxShadow: "none",
  borderBottom: "1px solid #f3f4f6",
  paddingTop: "1rem",
  paddingBottom: "1rem",
  backdropFilter: "blur(0px)",
});

menuBtn.addEventListener("click", () => {
  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    mobileMenu.classList.add("open");
    // Force Navbar to Look Normal (Full Width) so menu attaches correctly
    gsap.to(navbar, {
      width: "100%",
      maxWidth: "100%",
      top: "0px",
      borderRadius: "0px",
      backgroundColor: "#FFFFFF",
      duration: 0.3,
      overwrite: true,
    });
  } else {
    mobileMenu.classList.remove("open");
    // Check scroll position to revert to correct state
    if (window.scrollY > 50) {
      isFloating = true;
      animateToPill();
    } else {
      isFloating = false;
      animateToNormal();
    }
  }
});

// --- Navbar Animations ---
function animateToPill() {
  gsap.to(navbar, {
    width: "90%",
    maxWidth: "1024px",
    top: "20px",
    borderRadius: "9999px",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    borderBottom: "1px solid rgba(255,255,255,0.5)",
    paddingTop: "0.75rem",
    paddingBottom: "0.75rem",
    duration: 0.4,
    ease: "power2.out",
    overwrite: true,
  });
}

function animateToNormal() {
  gsap.to(navbar, {
    width: "100%",
    maxWidth: "100%",
    top: "0px",
    borderRadius: "0px",
    backgroundColor: "#FFFFFF",
    backdropFilter: "blur(0px)",
    boxShadow: "none",
    borderBottom: "1px solid #f3f4f6",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    duration: 0.4,
    ease: "power2.out",
    overwrite: true,
  });
}

// --- Scroll Logic ---
window.addEventListener("scroll", () => {
  if (isMenuOpen) return; // Don't animate navbar if menu is open

  if (window.scrollY > 50 && !isFloating) {
    isFloating = true;
    animateToPill();
  } else if (window.scrollY <= 50 && isFloating) {
    isFloating = false;
    animateToNormal();
  }
});

// --- 1. Populate Bar Graphs ---
function createBars(elementId) {
  const container = document.getElementById(elementId);
  for (let i = 0; i < 25; i++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    container.appendChild(bar);
  }
}
createBars("graph-company");
createBars("graph-gcp");
createBars("graph-azure");

// --- 2. Orbit Animation ---
const orbitRadius = 200;
const nodeMap = [
  { id: "node-company", offset: 0.1 },
  { id: "node-gcp", offset: 3.8 },
  { id: "node-azure", offset: 2.5 },
];

let incidentActive = false;
let rotation = 0;

function animateOrbit() {
  if (!incidentActive) {
    rotation += 0.001;
  }

  nodeMap.forEach((item) => {
    const node = document.getElementById(item.id);
    const angle = item.offset + rotation;
    const x = Math.cos(angle) * orbitRadius;
    const y = Math.sin(angle) * orbitRadius;

    gsap.set(node, { x: x, y: y });
  });

  requestAnimationFrame(animateOrbit);
}
animateOrbit();

// --- 3. Enhanced Wave Animation ---
gsap.to(".wave", {
  scale: 1.5,
  opacity: 0,
  duration: 3,
  stagger: 0.8,
  repeat: -1,
  ease: "power1.out",
  startAt: { opacity: 0.5, scale: 0.8 },
});

// --- 4. Simulation Logic ---
function startSimulation() {
  if (incidentActive) return;
  triggerIncident();
}

function triggerIncident() {
  if (incidentActive) return;
  incidentActive = true;

  // A. Trigger Visual Downtime
  const companyGraph = document.getElementById("graph-company");
  const bars = companyGraph.getElementsByClassName("bar");

  for (let i = bars.length - 1; i >= bars.length - 6; i--) {
    bars[i].classList.add("down");
  }
  bars[bars.length - 7].classList.add("warn");
  bars[bars.length - 8].classList.add("warn");

  const targetNode = document.getElementById("node-company");
  targetNode.style.border = "2px solid #ef4444";

  // B. Hub Reaction
  gsap.to(".spike-hub", {
    scale: 1.1,
    boxShadow: "0 0 50px rgba(239,68,68, 0.5)",
    duration: 0.2,
    yoyo: true,
    repeat: 3,
  });
  gsap.to(".hub-tooltip", { opacity: 1, y: -10, duration: 0.3 });

  // C. Spawn Team Cards
  spawnTeamCards();

  // D. Trigger Phone Call
  showCallNotification();
}

let activeCards = [];

function spawnTeamCards() {
  const container = document.getElementById("company-team-container");
  const templateIds = ["template-michelle", "template-rahul", "template-team"];

  const positions = [
    { top: "-45px", left: "-90px" },
    { top: "-55px", left: "80px" },
    { top: "65px", left: "10px" },
  ];

  templateIds.forEach((id, index) => {
    const template = document.getElementById(id);
    const clone = template.cloneNode(true);
    clone.id = "";
    clone.style.top = positions[index].top;
    clone.style.left = positions[index].left;

    container.appendChild(clone);
    activeCards.push(clone);

    gsap.to(clone, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      delay: index * 0.15,
      ease: "back.out(1.7)",
    });

    gsap.to(clone, {
      y: "-=5",
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 0.5 + index * 0.2,
    });

    setTimeout(() => {
      shootParticleToCard(clone);
    }, 300 + index * 200);
  });
}

function shootParticleToCard(card) {
  const container = document.getElementById("particles-container");
  const p = document.createElement("div");
  p.className = "particle";
  container.appendChild(p);

  const sysRect = document
    .querySelector(".orbit-system")
    .getBoundingClientRect();
  const hubRect = document.querySelector(".spike-hub").getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();

  const startX = hubRect.left + hubRect.width / 2 - sysRect.left;
  const startY = hubRect.top + hubRect.height / 2 - sysRect.top;
  const endX = cardRect.left + cardRect.width / 2 - sysRect.left;
  const endY = cardRect.top + cardRect.height / 2 - sysRect.top;

  gsap.fromTo(
    p,
    { x: startX, y: startY, opacity: 1 },
    {
      x: endX,
      y: endY,
      duration: 0.5,
      ease: "power1.inOut",
      onComplete: () => {
        p.remove();
        gsap.to(card, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 });
      },
    }
  );
}

// --- Call Interaction ---
const callUI = document.getElementById("call-ui");
const callBadge = document.getElementById("call-badge");
const callContent = document.getElementById("call-content");
const resolvedContent = document.getElementById("resolved-content");

function showCallNotification() {
  callContent.style.display = "flex";
  resolvedContent.classList.add("hidden");
  resolvedContent.classList.remove("flex");
  callUI.classList.remove("hidden");
  callUI.classList.add("flex");
  callUI.classList.add("ringing");

  callBadge.textContent = "Incident Triggered!";
  callBadge.style.backgroundColor = "#ef4444";
  gsap.to(callBadge, { opacity: 1, y: 0, duration: 0.3, delay: 0.2 });
  gsap.fromTo(
    callUI,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.3 }
  );
}

window.rejectCall = function () {
  callUI.classList.remove("ringing");
  callUI.style.borderColor = "#ef4444";
  callContent.querySelector("span:nth-child(2)").textContent = "Call Ended";
  gsap.to(callBadge, { opacity: 0, duration: 0.2 });

  setTimeout(() => {
    callContent.querySelector("span:nth-child(2)").textContent =
      "Incoming Call...";
    callUI.style.borderColor = "rgba(255,255,255,0.1)";
    callUI.classList.add("ringing");
    gsap.to(callBadge, { opacity: 1, duration: 0.2 });
  }, 800);
};

window.acceptCall = function () {
  callUI.classList.remove("ringing");
  callContent.style.display = "none";
  resolvedContent.classList.remove("hidden");
  resolvedContent.classList.add("flex");

  const statusTitle = resolvedContent.querySelector("span:first-child");
  const statusText = resolvedContent.querySelector("span:last-child");
  const iconContainer = resolvedContent.querySelector("div:first-child");
  const icon = iconContainer.querySelector("i");

  statusTitle.textContent = "Processing";
  statusTitle.className =
    "text-[10px] text-yellow-400 font-bold uppercase tracking-wider";
  statusText.textContent = "Informing Dev Team...";
  iconContainer.className =
    "w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse";
  icon.className = "fa-solid fa-tower-broadcast text-white text-sm";
  callBadge.textContent = "Team Notified";
  callBadge.style.backgroundColor = "#eab308";

  setTimeout(() => {
    statusTitle.textContent = "Success";
    statusTitle.className =
      "text-[10px] text-green-400 font-bold uppercase tracking-wider";
    statusText.textContent = "Incident Resolved";
    iconContainer.className =
      "w-8 h-8 rounded-full bg-green-500 flex items-center justify-center";
    iconContainer.classList.remove("animate-pulse");
    icon.className = "fa-solid fa-check text-white text-sm";
    callBadge.textContent = "Resolved";
    callBadge.style.backgroundColor = "#22c55e";

    stopSimulationWithSuccess();
  }, 2000);
};

function stopSimulationWithSuccess() {
  const graph = document.getElementById("graph-company");
  const bars = graph.getElementsByClassName("bar");
  for (let bar of bars) {
    bar.classList.remove("down");
    bar.classList.remove("warn");
  }
  document.getElementById("node-company").style.border = "none";

  activeCards.forEach((card) => {
    gsap.killTweensOf(card);
    gsap.to(card, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "back.in(1.7)",
      onComplete: () => card.remove(),
    });
  });
  activeCards = [];

  gsap.to(".hub-tooltip", { opacity: 0, duration: 0.5 });
  gsap.to(".spike-hub", {
    scale: 1,
    boxShadow: "0 0 40px rgba(0,0,0,0.2)",
    duration: 0.5,
  });
  gsap.to(callBadge, { opacity: 0, duration: 0.5, delay: 1 });
}

startSimulation();
