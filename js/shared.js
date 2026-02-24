/* ═══════════════════════════════════════════════════════════
   FRANKFURTER BERG SCHNITZELJAGD — Shared Logic
   ═══════════════════════════════════════════════════════════ */

// ─── Station Data ───────────────────────────────────────
const SOLUTION_WORD = "PROWOKULTA";

const stations = [
    {
        id: 1,
        title: "Albert-Schweitzer-Schule",
        icon: "🏫",
        question: "Welches Tier ist im Brunnen der Albert-Schweitzer-Schule?",
        answers: ["pelikan"],
        letter: "P",
        hint: null,
        subRiddle: null,
        enabled: true
    },
    {
        id: 2,
        title: "Manús erster Job",
        icon: "🥐",
        question: "Vorname des Chefs beim ersten richtigen Beruf von Manú?",
        answers: ["dimitri"],
        letter: "R",
        hint: "Ich war beim Bäcker im Verkauf.",
        subRiddle: null,
        enabled: true
    },
    {
        id: 3,
        title: "Netto Marken-Discount",
        icon: "🐍",
        question: "Welches Tier als Sitzgelegenheit hat Manú mit seiner Mama und ein paar anderen Nachbarn 2010 direkt gegenüber von dem Netto Marken-Discount gebaut?",
        answers: ["schlange"],
        letter: "O",
        hint: null,
        subRiddle: null,
        enabled: true
    },
    {
        id: 4,
        title: "Julius-Brecht-Straße 8",
        icon: "🏢",
        question: "So viele Stockwerke hat das Hochhaus „Julius-Brecht-Straße 8".",
        answers: ["8", "acht"],
        letter: "W",
        hint: null,
        subRiddle: null,
        enabled: true
    },
    {
        id: 5,
        title: "Spielplatz Heinrich-Plett-Straße",
        icon: "🎠",
        question: "In welchem Untergrund steht die Schleuder/Schaukel beim Spielplatz Heinrich-Plett-Straße?",
        answers: ["holzspäne", "holzspaene", "holzspane", "holzspähne"],
        letter: "O",
        hint: null,
        subRiddle: null,
        enabled: true
    },
    {
        id: 6,
        title: "Klingenfeld 77",
        icon: "🌳",
        question: "Was für ein Obstbaum steht beim Klingenfeld 77?",
        answers: ["apfelbaum", "apfel baum"],
        letter: "K",
        hint: null,
        subRiddle: null,
        enabled: true
    },
    {
        id: 7,
        title: "Restaurant „Zum Lemp"",
        icon: "🍽️",
        question: "Was ist das dritte Gericht auf der aktuellen Speisekarte des Restaurants „Zum Lemp"?",
        // ⚠️ TO-DO: Antwort hier eintragen wenn bekannt!
        answers: ["todo"],
        letter: "U",
        hint: null,
        subRiddle: null,
        enabled: false  // Aktivieren wenn Antwort bekannt
    },
    {
        id: 8,
        title: "Geheimes Grundstück",
        icon: "📍",
        question: 'An den Koordinaten <strong>50°10\'03.5"N 8°41\'47.2"E</strong> liegt ein Grundstück. Wie heißt der Sohn dieser Person mit Vor- und Nachnamen?',
        answers: ["linus burgeff"],
        letter: "L",
        hint: null,
        // ⚠️ TO-DO: Unterrätsel für die Koordinaten hier eintragen
        subRiddle: null,
        enabled: true
    },
    {
        id: 9,
        title: "Kita & Hort am Neuenberg",
        icon: "🏠",
        question: "Hier befindet sich die Kita und der Hort von Manú. Diese ist am Neuenberg. Was steht auf der Klingel?",
        // ⚠️ TO-DO: Antwort hier eintragen wenn bekannt!
        answers: ["todo"],
        letter: "T",
        hint: "Auf dem Weg gibt es einen Durchgang an der Station „Frankfurt (Main) Dachsberg", den Google nicht findet.",
        subRiddle: null,
        enabled: false  // Aktivieren wenn Antwort bekannt
    },
    {
        id: 10,
        title: "Taxischule Zimmermann",
        icon: "🚪",
        question: 'Gegenüber der Taxischule Zimmermann steht eine Unterkunft. Öffnet diese mit dem Code <strong class="revealed-code" id="code10">????</strong>. Was begegnet euch als erstes, wenn ihr die Unterkunft betretet?',
        answers: ["vorhang"],
        letter: "A",
        hint: null,
        subRiddle: {
            question: "Um den Code zu erfahren, löst zuerst dieses Rätsel: Wann war der Sturm auf die Bastille? (Format: DDMM)",
            answers: ["1407"],
            revealText: "1407",
        },
        enabled: true
    }
];

// ─── State Management ───────────────────────────────────
const STATE_KEY = "schnitzeljagd_state";

let gameState = {
    started: false,
    solvedStations: [],
    solvedSubRiddles: [],
    completed: false
};

function loadState() {
    try {
        const saved = localStorage.getItem(STATE_KEY);
        if (saved) gameState = JSON.parse(saved);
    } catch (e) {
        gameState = { started: false, solvedStations: [], solvedSubRiddles: [], completed: false };
    }
}

function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(gameState));
}

function resetGame() {
    if (confirm("Wirklich den gesamten Fortschritt zurücksetzen?")) {
        localStorage.removeItem(STATE_KEY);
        window.location.href = getBasePath() + "index.html";
    }
}

// ─── Path Helpers ───────────────────────────────────────
function getBasePath() {
    // Detect if we're inside /stations/ folder
    const path = window.location.pathname;
    if (path.includes("/stations/")) return "../";
    return "./";
}

function getStationPath(id) {
    const base = getBasePath();
    return base + "stations/station-" + id + ".html";
}

// ─── Answer Validation ──────────────────────────────────
function normalizeAnswer(str) {
    return str.toLowerCase().trim()
        .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
        .replace(/\s+/g, " ");
}

function checkAnswer(stationId) {
    const station = stations.find(s => s.id === stationId);
    if (!station) return;

    const input = document.getElementById("answer-" + stationId);
    const feedback = document.getElementById("feedback-" + stationId);
    const value = input ? input.value.trim() : "";

    if (!value) {
        showFeedback(feedback, "error", "❌ Bitte gebt eine Antwort ein.");
        if (input) { input.classList.add("shake"); setTimeout(() => input.classList.remove("shake"), 500); }
        return;
    }

    const normalized = normalizeAnswer(value);
    const isCorrect = station.answers.some(a => normalizeAnswer(a) === normalized);

    if (isCorrect) {
        if (!gameState.solvedStations.includes(stationId)) {
            gameState.solvedStations.push(stationId);
            saveState();
        }
        showFeedback(feedback, "success", '✅ Richtig! Der Buchstabe ist: <strong>' + station.letter + '</strong>');
        // Hide input, show solved state
        const inputGroup = document.getElementById("input-group-" + stationId);
        if (inputGroup) inputGroup.style.display = "none";
        const solvedEl = document.getElementById("solved-" + stationId);
        if (solvedEl) solvedEl.style.display = "flex";
        updateAllLetterBoxes();
    } else {
        showFeedback(feedback, "error", "❌ Das ist leider nicht richtig. Versucht es nochmal!");
        if (input) { input.classList.add("shake"); setTimeout(() => input.classList.remove("shake"), 500); }
    }
}

function checkSubAnswer(stationId) {
    const station = stations.find(s => s.id === stationId);
    if (!station || !station.subRiddle) return;

    const input = document.getElementById("sub-answer-" + stationId);
    const feedback = document.getElementById("sub-feedback-" + stationId);
    const value = input ? input.value.trim() : "";

    if (!value) {
        showFeedback(feedback, "error", "❌ Bitte gebt eine Antwort ein.");
        return;
    }

    const normalized = normalizeAnswer(value);
    const isCorrect = station.subRiddle.answers.some(a => normalizeAnswer(a) === normalized);

    if (isCorrect) {
        if (!gameState.solvedSubRiddles.includes(stationId)) {
            gameState.solvedSubRiddles.push(stationId);
            saveState();
        }
        // Reload page to update UI
        window.location.reload();
    } else {
        showFeedback(feedback, "error", "❌ Das ist nicht richtig. Versucht es nochmal!");
        if (input) { input.classList.add("shake"); setTimeout(() => input.classList.remove("shake"), 500); }
    }
}

function showFeedback(el, type, message) {
    if (!el) return;
    el.className = "feedback show " + type;
    el.innerHTML = message;
}

// ─── Final Solution ─────────────────────────────────────
function checkFinalSolution() {
    const input = document.getElementById("finalInput");
    const feedback = document.getElementById("finalFeedback");
    const value = (input ? input.value.trim() : "").toUpperCase();

    if (!value) {
        feedback.className = "final-feedback error";
        feedback.textContent = "❌ Bitte gebt das Lösungswort ein.";
        return;
    }

    if (value === SOLUTION_WORD) {
        gameState.completed = true;
        saveState();
        feedback.className = "final-feedback success";
        feedback.textContent = "🎉 Perfekt! Das ist das richtige Lösungswort!";
        launchConfetti();
        setTimeout(() => {
            window.location.href = getBasePath() + "completion.html";
        }, 2200);
    } else {
        feedback.className = "final-feedback error";
        feedback.textContent = "❌ Das ist leider nicht das richtige Lösungswort.";
        if (input) { input.classList.add("shake"); setTimeout(() => input.classList.remove("shake"), 500); }
    }
}

// ─── UI Builders ────────────────────────────────────────
function buildLetterBoxes(containerId, cssClass) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < SOLUTION_WORD.length; i++) {
        const box = document.createElement("div");
        box.className = cssClass;
        box.id = containerId + "-" + i;
        box.textContent = "?";
        container.appendChild(box);
    }
    updateLetterBoxes(containerId);
}

function updateLetterBoxes(containerId) {
    stations.forEach((station, index) => {
        const box = document.getElementById(containerId + "-" + index);
        if (!box) return;
        if (gameState.solvedStations.includes(station.id)) {
            box.textContent = station.letter;
            box.classList.add("found");
        } else {
            box.textContent = "?";
            box.classList.remove("found");
        }
    });
}

function updateAllLetterBoxes() {
    updateLetterBoxes("headerLetters");
    updateLetterBoxes("finalLetters");
    // Update progress text
    const progressEl = document.getElementById("progressText");
    if (progressEl) {
        progressEl.textContent = gameState.solvedStations.length + " / " + SOLUTION_WORD.length;
    }
}

function toggleHint(stationId) {
    const hint = document.getElementById("hint-" + stationId);
    if (hint) hint.classList.toggle("visible");
}

// ─── Particles ──────────────────────────────────────────
function initParticles() {
    const container = document.querySelector(".particles");
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.left = Math.random() * 100 + "%";
        p.style.animationDuration = (Math.random() * 12 + 8) + "s";
        p.style.animationDelay = (Math.random() * 10) + "s";
        p.style.width = p.style.height = (Math.random() * 2 + 1.5) + "px";
        p.style.opacity = Math.random() * 0.3 + 0.1;
        container.appendChild(p);
    }
}

// ─── Confetti ───────────────────────────────────────────
function launchConfetti() {
    let container = document.getElementById("confettiContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "confettiContainer";
        container.className = "confetti-container";
        document.body.appendChild(container);
    }
    const colors = ["#e8a824", "#7f5af0", "#2ecc71", "#e74c3c", "#3498db", "#f39c12", "#1abc9c", "#fd79a8"];
    for (let i = 0; i < 100; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = Math.random() * 100 + "%";
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (Math.random() * 8 + 5) + "px";
        piece.style.height = (Math.random() * 8 + 5) + "px";
        piece.style.setProperty("--drift", (Math.random() * 200 - 100) + "px");
        piece.style.animationDuration = (Math.random() * 2 + 2) + "s";
        piece.style.animationDelay = Math.random() * 1.5 + "s";
        container.appendChild(piece);
    }
    setTimeout(() => { container.innerHTML = ""; }, 5000);
}

// ─── SVG Icons (inline) ────────────────────────────────
const SVG = {
    chevronLeft: '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="16" height="16"><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2"/></svg>',
    compass: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f5d76e"/>
                <stop offset="100%" style="stop-color:#e8a824"/>
            </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="92" stroke="url(#goldGrad)" fill="none" stroke-width="2" opacity="0.4"/>
        <circle cx="100" cy="100" r="80" stroke="url(#goldGrad)" fill="none" stroke-width="1" opacity="0.2"/>
        <circle cx="100" cy="100" r="68" stroke="url(#goldGrad)" fill="none" stroke-width="0.5" opacity="0.15" stroke-dasharray="4 4"/>
        <!-- Tick marks -->
        <line x1="100" y1="12" x2="100" y2="22" stroke="#f5d76e" stroke-width="2" opacity="0.5"/>
        <line x1="100" y1="178" x2="100" y2="188" stroke="#f5d76e" stroke-width="2" opacity="0.3"/>
        <line x1="12" y1="100" x2="22" y2="100" stroke="#f5d76e" stroke-width="2" opacity="0.3"/>
        <line x1="178" y1="100" x2="188" y2="100" stroke="#f5d76e" stroke-width="2" opacity="0.3"/>
        <!-- Diagonal ticks -->
        <line x1="38" y1="38" x2="44" y2="44" stroke="#f5d76e" stroke-width="1" opacity="0.2"/>
        <line x1="156" y1="38" x2="162" y2="44" stroke="#f5d76e" stroke-width="1" opacity="0.2"/>
        <line x1="38" y1="156" x2="44" y2="162" stroke="#f5d76e" stroke-width="1" opacity="0.2"/>
        <line x1="156" y1="156" x2="162" y2="162" stroke="#f5d76e" stroke-width="1" opacity="0.2"/>
        <!-- Needle group -->
        <g class="compass-needle">
            <polygon points="100,25 108,95 92,95" fill="url(#goldGrad)" opacity="0.85"/>
            <polygon points="100,175 108,105 92,105" fill="#a7a9be" opacity="0.3"/>
            <polygon points="25,100 95,108 95,92" fill="#a7a9be" opacity="0.2"/>
            <polygon points="175,100 105,108 105,92" fill="#a7a9be" opacity="0.2"/>
        </g>
        <!-- Center -->
        <circle cx="100" cy="100" r="6" fill="url(#goldGrad)"/>
        <circle cx="100" cy="100" r="3" fill="#0b0b1a"/>
        <!-- Labels -->
        <text x="100" y="10" text-anchor="middle" fill="#f5d76e" font-family="Poppins, sans-serif" font-size="13" font-weight="700">N</text>
        <text x="100" y="198" text-anchor="middle" fill="#a7a9be" font-family="Poppins, sans-serif" font-size="11" opacity="0.4">S</text>
        <text x="197" y="104" text-anchor="end" fill="#a7a9be" font-family="Poppins, sans-serif" font-size="11" opacity="0.4">O</text>
        <text x="4" y="104" text-anchor="start" fill="#a7a9be" font-family="Poppins, sans-serif" font-size="11" opacity="0.4">W</text>
    </svg>`,
};

// ─── Render: Station Page ───────────────────────────────
function renderStationPage(stationId) {
    loadState();
    const station = stations.find(s => s.id === stationId);
    if (!station) return;

    const isSolved = gameState.solvedStations.includes(stationId);
    const isSubSolved = gameState.solvedSubRiddles.includes(stationId);
    const prevStation = stations.find(s => s.id === stationId - 1);
    const nextStation = stations.find(s => s.id === stationId + 1);

    const app = document.getElementById("app");
    if (!app) return;

    // If sub-riddle is solved, update the question text (e.g., reveal code)
    let questionHTML = station.question;
    if (station.subRiddle && isSubSolved) {
        questionHTML = questionHTML.replace("????", station.subRiddle.revealText);
    }

    app.innerHTML = `
        <!-- Background -->
        <div class="bg-decoration bg-orb bg-orb-1"></div>
        <div class="bg-decoration bg-orb bg-orb-2"></div>
        <div class="particles"></div>

        <div class="page-content">
            <!-- Navbar -->
            <nav class="navbar">
                <div class="navbar-inner">
                    <div class="navbar-top">
                        <a href="${getBasePath()}index.html" class="navbar-back">
                            ${SVG.chevronLeft} Übersicht
                        </a>
                        <span class="navbar-progress-text" id="progressText">${gameState.solvedStations.length} / ${SOLUTION_WORD.length}</span>
                    </div>
                    <div class="letter-boxes" id="headerLetters"></div>
                </div>
            </nav>

            <!-- Hero -->
            <div class="station-hero">
                <div class="station-hero-decoration"></div>
                <span class="station-hero-icon">${station.icon}</span>
                <div class="station-hero-number">${stationId}</div>
                <h1 class="station-hero-title">${station.title}</h1>
                <p class="station-hero-subtitle">Station ${stationId} von ${stations.length}</p>
            </div>

            <!-- Body -->
            <div class="station-body">
                ${isSolved ? `
                    <div class="solved-banner fade-in-up">
                        <div class="solved-banner-letter">${station.letter}</div>
                        <div class="solved-banner-info">
                            <strong>Buchstabe ${stationId} gefunden</strong>
                            Station erfolgreich gelöst! 🎉
                        </div>
                    </div>
                ` : ""}

                ${!station.enabled ? `
                    <div class="disabled-notice fade-in-up">
                        🚧 Diese Station wird noch vorbereitet. Kommt bald!
                    </div>
                ` : ""}

                ${station.subRiddle ? `
                    <div class="sub-riddle-card ${isSubSolved ? 'solved' : ''} fade-in-up">
                        <div class="sub-riddle-label">${isSubSolved ? '🔓' : '🔒'} Unterrätsel</div>
                        <div class="sub-riddle-question">${station.subRiddle.question}</div>
                        ${!isSubSolved ? `
                            <div class="input-group" id="sub-input-group-${stationId}">
                                <input type="text" class="answer-input" id="sub-answer-${stationId}"
                                    placeholder="Antwort..." autocomplete="off" autocapitalize="none"
                                    onkeydown="if(event.key==='Enter') checkSubAnswer(${stationId})">
                                <button class="btn-check" onclick="checkSubAnswer(${stationId})">Lösen</button>
                            </div>
                            <div class="feedback" id="sub-feedback-${stationId}"></div>
                        ` : `
                            <div class="sub-riddle-success">✅ Gelöst! Code: <strong>${station.subRiddle.revealText}</strong></div>
                        `}
                    </div>
                ` : ""}

                <div class="riddle-card fade-in-up stagger-2">
                    <div class="riddle-label">
                        ${SVG.search} Rätsel
                    </div>
                    <div class="riddle-question">${questionHTML}</div>

                    ${station.hint ? `
                        <div class="hint-section">
                            <div class="hint-toggle" onclick="toggleHint(${stationId})">💡 Tipp anzeigen</div>
                            <div class="hint-text" id="hint-${stationId}">${station.hint}</div>
                        </div>
                    ` : ""}

                    ${station.enabled && !isSolved && (!station.subRiddle || isSubSolved) ? `
                        <div class="input-group" id="input-group-${stationId}">
                            <input type="text" class="answer-input" id="answer-${stationId}"
                                placeholder="Eure Antwort..." autocomplete="off" autocapitalize="none"
                                onkeydown="if(event.key==='Enter') checkAnswer(${stationId})">
                            <button class="btn-check" onclick="checkAnswer(${stationId})">Prüfen</button>
                        </div>
                        <div class="feedback" id="feedback-${stationId}"></div>
                    ` : ""}

                    <div class="solved-banner" id="solved-${stationId}" style="display: ${isSolved ? 'flex' : 'none'}; margin-top: 0.75rem;">
                        <div class="solved-banner-letter">${station.letter}</div>
                        <div class="solved-banner-info">
                            <strong>Buchstabe erhalten</strong>
                            Richtige Antwort! Weiter zur nächsten Station.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Navigation Footer -->
            <div class="station-nav-footer">
                ${prevStation ? `
                    <a href="${getStationPath(prevStation.id)}" class="nav-btn">
                        ${SVG.chevronLeft} Station ${prevStation.id}
                    </a>
                ` : '<div class="nav-btn invisible">-</div>'}
                ${nextStation ? `
                    <a href="${getStationPath(nextStation.id)}" class="nav-btn">
                        Station ${nextStation.id} ${SVG.chevronRight}
                    </a>
                ` : `
                    <a href="${getBasePath()}index.html" class="nav-btn">
                        Übersicht ${SVG.chevronRight}
                    </a>
                `}
            </div>
        </div>

        <div class="confetti-container" id="confettiContainer"></div>
    `;

    buildLetterBoxes("headerLetters", "letter-box");
    initParticles();
}

// ─── Render: Overview / Index ───────────────────────────
function renderOverview() {
    loadState();

    // If game hasn't started, show start screen
    if (!gameState.started) {
        renderStartScreen();
        return;
    }

    // If game is completed, redirect
    if (gameState.completed) {
        window.location.href = getBasePath() + "completion.html";
        return;
    }

    const app = document.getElementById("app");
    if (!app) return;

    let trailHTML = "";
    stations.forEach((station, i) => {
        const isSolved = gameState.solvedStations.includes(station.id);
        const statusClass = !station.enabled ? "disabled" : (isSolved ? "solved" : "active");
        const statusText = !station.enabled
            ? '<span class="badge-coming-soon">🚧 Bald verfügbar</span>'
            : (isSolved ? "✅ Gelöst" : "Noch nicht gelöst");

        trailHTML += `
            <a href="${station.enabled ? getStationPath(station.id) : '#'}" 
               class="trail-item ${statusClass} fade-in-up stagger-${i + 1}"
               ${!station.enabled ? 'onclick="event.preventDefault()"' : ''}>
                <div class="trail-dot"></div>
                <div class="trail-card">
                    <div class="trail-card-icon">${station.icon}</div>
                    <div class="trail-card-info">
                        <div class="trail-card-title">Station ${station.id}: ${station.title}</div>
                        <div class="trail-card-status">${statusText}</div>
                    </div>
                    <div class="trail-card-letter">${isSolved ? station.letter : "?"}</div>
                    <div class="trail-card-arrow">${SVG.chevronRight}</div>
                </div>
            </a>
        `;
    });

    app.innerHTML = `
        <!-- Background -->
        <div class="bg-decoration bg-orb bg-orb-1"></div>
        <div class="bg-decoration bg-orb bg-orb-2"></div>
        <div class="bg-decoration bg-orb bg-orb-3"></div>
        <div class="particles"></div>

        <div class="page-content">
            <!-- Navbar -->
            <nav class="navbar">
                <div class="navbar-inner">
                    <div class="navbar-top">
                        <span class="navbar-title">🗺️ Schnitzeljagd</span>
                        <span class="navbar-progress-text" id="progressText">${gameState.solvedStations.length} / ${SOLUTION_WORD.length}</span>
                    </div>
                    <div class="letter-boxes" id="headerLetters"></div>
                </div>
            </nav>

            <!-- Trail Section -->
            <div class="overview-section">
                <div class="overview-header fade-in-up">
                    <h2>🗺️ Eure Route</h2>
                    <p>Tippt auf eine Station, um das Rätsel zu öffnen</p>
                </div>
                <div class="trail">${trailHTML}</div>
            </div>

            <!-- Final Solution -->
            <div class="final-section fade-in-up">
                <div class="final-card">
                    <div class="final-card-title">🏆 Lösungswort eingeben</div>
                    <div class="final-letter-boxes" id="finalLetters"></div>
                    <div class="final-input-group">
                        <input type="text" class="final-input" id="finalInput"
                            placeholder="?????????" maxlength="10" autocomplete="off" autocapitalize="characters"
                            onkeydown="if(event.key==='Enter') checkFinalSolution()">
                        <button class="btn-final" onclick="checkFinalSolution()">Prüfen</button>
                    </div>
                    <div class="final-feedback" id="finalFeedback"></div>
                </div>
            </div>

            <!-- Footer -->
            <div class="page-footer">
                <div>Frankfurter Berg Schnitzeljagd</div>
                <button class="btn-reset-small" onclick="resetGame()">🔄 Fortschritt zurücksetzen</button>
            </div>
        </div>

        <div class="confetti-container" id="confettiContainer"></div>
    `;

    buildLetterBoxes("headerLetters", "letter-box");
    buildLetterBoxes("finalLetters", "final-letter-box");
    initParticles();
}

// ─── Render: Start Screen ───────────────────────────────
function renderStartScreen() {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
        <!-- Background -->
        <div class="bg-decoration bg-orb bg-orb-1"></div>
        <div class="bg-decoration bg-orb bg-orb-2"></div>
        <div class="particles"></div>

        <div class="page-content">
            <div class="start-screen">
                <div class="compass-container fade-in-up">
                    ${SVG.compass}
                </div>
                <h1 class="start-title fade-in-up stagger-1">Frankfurter Berg<br>Schnitzeljagd</h1>
                <p class="start-subtitle fade-in-up stagger-2">10 Stationen &bull; 10 Buchstaben &bull; 1 Lösungswort</p>
                <p class="start-description fade-in-up stagger-3">
                    Erkundet Frankfurter Berg, löst die Rätsel an jeder Station und sammelt die Lösungsbuchstaben.
                    Am Ende ergibt sich das geheime Lösungswort!
                </p>
                <div class="start-features fade-in-up stagger-4">
                    <div class="start-feature">
                        <div class="start-feature-icon">🔍</div>
                        <span class="start-feature-label">Rätsel lösen</span>
                    </div>
                    <div class="start-feature">
                        <div class="start-feature-icon">📍</div>
                        <span class="start-feature-label">Orte erkunden</span>
                    </div>
                    <div class="start-feature">
                        <div class="start-feature-icon">🔤</div>
                        <span class="start-feature-label">Buchstaben sammeln</span>
                    </div>
                    <div class="start-feature">
                        <div class="start-feature-icon">🏆</div>
                        <span class="start-feature-label">Lösungswort finden</span>
                    </div>
                </div>
                <button class="btn-start fade-in-up stagger-5" onclick="startGame()">
                    Schnitzeljagd starten
                </button>
            </div>
        </div>
    `;

    initParticles();
}

function startGame() {
    gameState.started = true;
    saveState();
    renderOverview();
}

// ─── Render: Completion Page ────────────────────────────
function renderCompletion() {
    loadState();
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
        <!-- Background -->
        <div class="bg-decoration bg-orb bg-orb-1"></div>
        <div class="bg-decoration bg-orb bg-orb-2"></div>
        <div class="particles"></div>

        <div class="page-content">
            <div class="completion-screen">
                <div class="completion-trophy fade-in-up">🏆</div>
                <h1 class="completion-title fade-in-up stagger-1">Geschafft!</h1>
                <div class="completion-word fade-in-up stagger-2">${SOLUTION_WORD}</div>
                <p class="completion-message fade-in-up stagger-3">
                    Herzlichen Glückwunsch! Ihr habt alle Stationen gemeistert und das Lösungswort gefunden.
                    Das war eine tolle Tour durch Frankfurter Berg! 🎉
                </p>
                <button class="btn-reset fade-in-up stagger-4" onclick="resetGame()">🔄 Nochmal spielen</button>
            </div>
        </div>

        <div class="confetti-container" id="confettiContainer"></div>
    `;

    initParticles();
    setTimeout(launchConfetti, 500);
}
