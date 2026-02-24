/* ═══════════════════════════════════════════════════════════
   FRANKFURTER BERG SCHNITZELJAGD — Shared Logic
   ═══════════════════════════════════════════════════════════ */

// ─── Station Data ───────────────────────────────────────
var SOLUTION_WORD = "PROWOKULTA";

var stations = [
    {
        id: 1,
        title: "Albert-Schweitzer-Schule",
        icon: "\u{1F3EB}",
        question: "Welches Tier ist im Brunnen der Albert-Schweitzer-Schule?",
        answers: ["pelikan"],
        letter: "P",
        hint: null,
        subRiddle: null,
        enabled: true
    },
    {
        id: 2,
        title: "Man\u00FAs erster Job",
        icon: "\u{1F950}",
        question: "Vorname des Chefs beim ersten richtigen Beruf von Man\u00FA?",
        answers: ["dimitri"],
        letter: "R",
        hint: "Ich war beim B\u00E4cker im Verkauf.",
        subRiddle: null,
        enabled: true
    },
    {
        id: 3,
        title: "Netto Marken-Discount",
        icon: "\u{1F40D}",
        question: "Welches Tier als Sitzgelegenheit hat Man\u00FA mit seiner Mama und ein paar anderen Nachbarn 2010 direkt gegen\u00FCber von dem Netto Marken-Discount gebaut?",
        answers: ["schlange"],
        letter: "O",
        hint: null,
        subRiddle: null,
        enabled: true
    },
    {
        id: 4,
        title: "Julius-Brecht-Stra\u00DFe 8",
        icon: "\u{1F3E2}",
        question: "So viele Stockwerke hat das Hochhaus \u201EJulius-Brecht-Stra\u00DFe 8\u201C.",
        answers: ["8", "acht"],
        letter: "W",
        hint: null,
        subRiddle: null,
        enabled: true
    },
    {
        id: 5,
        title: "Spielplatz Heinrich-Plett-Stra\u00DFe",
        icon: "\u{1F3A0}",
        question: "Auf welchem Untergrund steht die Schleuder/Schaukel beim Spielplatz Heinrich-Plett-Stra\u00DFe?",
        answers: ["holzsp\u00E4ne", "holzspaene", "holzspane", "holzsp\u00E4hne"],
        letter: "O",
        hint: null,
        subRiddle: null,
        enabled: true
    },
    {
        id: 6,
        title: "Klingenfeld 77",
        icon: "\u{1F333}",
        question: "Was f\u00FCr ein Obstbaum steht beim Klingenfeld 77?",
        answers: ["apfelbaum", "apfel baum"],
        letter: "K",
        hint: null,
        subRiddle: null,
        enabled: true
    },
    {
        id: 7,
        title: "Restaurant \u201EZum Lemp\u201C",
        icon: "\u{1F37D}\uFE0F",
        question: "Was ist das dritte Gericht auf der aktuellen Speisekarte des Restaurants \u201EZum Lemp\u201C?",
        // ⚠️ TO-DO: Antwort hier eintragen wenn bekannt!
        answers: ["manu"],
        letter: "U",
        hint: null,
        subRiddle: null,
        enabled: true
    },
    {
        id: 8,
        title: "Geheimes Grundst\u00FCck",
        icon: "\u{1F4CD}",
        question: "An den Koordinaten <strong class=\"revealed-code\" id=\"code8\">????</strong> liegt ein Grundst\u00FCck. Wie hei\u00DFt der Sohn dieser Person mit Vor- und Nachnamen?",
        answers: ["linus burgeff"],
        letter: "L",
        hint: null,
        subRiddle: {
            question: "\u{1F9EE} Knackt den Koordinaten-Code! L\u00F6st die 6 Aufgaben:<br><br>" +
                "<strong>a)</strong> 5\u00B2 \u00D7 2 = ?<br>" +
                "<strong>b)</strong> \u221A100 = ?<br>" +
                "<strong>c)</strong> 7 \u00F7 2 = ?<br>" +
                "<strong>d)</strong> 2\u00B3 = ?<br>" +
                "<strong>e)</strong> 6 \u00D7 7 \u2212 1 = ?<br>" +
                "<strong>f)</strong> 8\u00B2 \u2212 16,8 = ?<br><br>" +
                "Die Koordinaten sind: <em>a\u00B0b\u2019c\u201DN d\u00B0e\u2019f\u201DE</em><br><br>" +
                "<strong>Gebt die Summe aller Ergebnisse ein (a+b+c+d+e+f):</strong>",
            answers: ["159.7", "159,7"],
            revealText: "50\u00B010\u201903.5\u201DN 8\u00B041\u201947.2\u201DE"
        },
        enabled: true
    },
    {
        id: 9,
        title: "Kita & Hort am Neuenberg",
        icon: "\u{1F3E0}",
        question: "Hier befindet sich die Kita und der Hort von Man\u00FA. Diese ist am Neuenberg. Was steht auf der Klingel?",
        // ⚠️ TO-DO: Antwort hier eintragen wenn bekannt!
        answers: ["manu"],
        letter: "T",
        hint: "Auf dem Weg gibt es einen Durchgang an der Station \u201EFrankfurt (Main) Dachsberg\u201C, den Google nicht findet.",
        subRiddle: null,
        enabled: true
    },
    {
        id: 10,
        title: "Taxischule Zimmermann",
        icon: "\u{1F6AA}",
        question: "Gegen\u00FCber der Taxischule Zimmermann steht eine Unterkunft. \u00D6ffnet diese mit dem Code <strong class=\"revealed-code\" id=\"code10\">????</strong>. Was begegnet euch als erstes, wenn ihr die Unterkunft betretet?",
        answers: ["vorhang"],
        letter: "A",
        hint: null,
        subRiddle: {
            question: "Um den Code zu erfahren, l\u00F6st zuerst dieses R\u00E4tsel: Wann war der Sturm auf die Bastille? (Format: DDMM)",
            answers: ["1407"],
            revealText: "1407"
        },
        enabled: true
    }
];

// ─── State Management ───────────────────────────────────
var STATE_KEY = "schnitzeljagd_state";

var gameState = {
    started: false,
    solvedStations: [],
    solvedSubRiddles: [],
    completed: false
};

function loadState() {
    try {
        var saved = localStorage.getItem(STATE_KEY);
        if (saved) {
            var parsed = JSON.parse(saved);
            gameState = {
                started: !!parsed.started,
                solvedStations: Array.isArray(parsed.solvedStations) ? parsed.solvedStations : [],
                solvedSubRiddles: Array.isArray(parsed.solvedSubRiddles) ? parsed.solvedSubRiddles : [],
                completed: !!parsed.completed
            };
        }
    } catch (e) {
        console.warn("State load error:", e);
        gameState = { started: false, solvedStations: [], solvedSubRiddles: [], completed: false };
    }
}

function saveState() {
    try {
        localStorage.setItem(STATE_KEY, JSON.stringify(gameState));
    } catch (e) {
        console.warn("State save error:", e);
    }
}

function resetGame() {
    if (confirm("Wirklich den gesamten Fortschritt zur\u00FCcksetzen?")) {
        localStorage.removeItem(STATE_KEY);
        window.location.href = getBasePath() + "index.html";
    }
}

// ─── Path Helpers ───────────────────────────────────────
function getBasePath() {
    var path = window.location.pathname;
    if (path.indexOf("/stations/") !== -1) return "../";
    if (path.indexOf("\\stations\\") !== -1) return "../";
    return "./";
}

function getStationPath(id) {
    return getBasePath() + "stations/station-" + id + ".html";
}

// ─── Helpers ────────────────────────────────────────────
function allEnabledStationsSolved() {
    var enabledStations = stations.filter(function(s) { return s.enabled; });
    return enabledStations.every(function(s) {
        return gameState.solvedStations.indexOf(s.id) !== -1;
    });
}

function getEnabledCount() {
    return stations.filter(function(s) { return s.enabled; }).length;
}

// ─── Answer Validation ──────────────────────────────────
function normalizeAnswer(str) {
    return str.toLowerCase().trim()
        .replace(/\u00E4/g, "ae").replace(/\u00F6/g, "oe").replace(/\u00FC/g, "ue").replace(/\u00DF/g, "ss")
        .replace(/\s+/g, " ");
}

function checkAnswer(stationId) {
    var station = null;
    for (var i = 0; i < stations.length; i++) {
        if (stations[i].id === stationId) { station = stations[i]; break; }
    }
    if (!station) return;

    var input = document.getElementById("answer-" + stationId);
    var feedback = document.getElementById("feedback-" + stationId);
    var value = input ? input.value.trim() : "";

    if (!value) {
        showFeedback(feedback, "error", "\u274C Bitte gebt eine Antwort ein.");
        if (input) { input.classList.add("shake"); setTimeout(function() { input.classList.remove("shake"); }, 500); }
        return;
    }

    var normalized = normalizeAnswer(value);
    var isCorrect = false;
    for (var j = 0; j < station.answers.length; j++) {
        if (normalizeAnswer(station.answers[j]) === normalized) { isCorrect = true; break; }
    }

    if (isCorrect) {
        if (gameState.solvedStations.indexOf(stationId) === -1) {
            gameState.solvedStations.push(stationId);
            saveState();
        }
        showFeedback(feedback, "success", "\u2705 Richtig! Der Buchstabe ist: <strong>" + station.letter + "</strong>");
        var inputGroup = document.getElementById("input-group-" + stationId);
        if (inputGroup) inputGroup.style.display = "none";
        var solvedEl = document.getElementById("solved-" + stationId);
        if (solvedEl) solvedEl.style.display = "flex";
        updateAllLetterBoxes();
        // Check if all are solved now and show final section
        showFinalSectionIfReady();
    } else {
        showFeedback(feedback, "error", "\u274C Das ist leider nicht richtig. Versucht es nochmal!");
        if (input) { input.classList.add("shake"); setTimeout(function() { input.classList.remove("shake"); }, 500); }
    }
}

function checkSubAnswer(stationId) {
    var station = null;
    for (var i = 0; i < stations.length; i++) {
        if (stations[i].id === stationId) { station = stations[i]; break; }
    }
    if (!station || !station.subRiddle) return;

    var input = document.getElementById("sub-answer-" + stationId);
    var feedback = document.getElementById("sub-feedback-" + stationId);
    var value = input ? input.value.trim() : "";

    if (!value) {
        showFeedback(feedback, "error", "\u274C Bitte gebt eine Antwort ein.");
        return;
    }

    var normalized = normalizeAnswer(value);
    var isCorrect = false;
    for (var j = 0; j < station.subRiddle.answers.length; j++) {
        if (normalizeAnswer(station.subRiddle.answers[j]) === normalized) { isCorrect = true; break; }
    }

    if (isCorrect) {
        if (gameState.solvedSubRiddles.indexOf(stationId) === -1) {
            gameState.solvedSubRiddles.push(stationId);
            saveState();
        }
        window.location.reload();
    } else {
        showFeedback(feedback, "error", "\u274C Das ist nicht richtig. Versucht es nochmal!");
        if (input) { input.classList.add("shake"); setTimeout(function() { input.classList.remove("shake"); }, 500); }
    }
}

function showFeedback(el, type, message) {
    if (!el) return;
    el.className = "feedback show " + type;
    el.innerHTML = message;
}

// ─── Final Solution ─────────────────────────────────────
function showFinalSectionIfReady() {
    var el = document.getElementById("finalSection");
    if (!el) return;
    if (allEnabledStationsSolved()) {
        el.style.display = "block";
    }
}

function checkFinalSolution() {
    var input = document.getElementById("finalInput");
    var feedback = document.getElementById("finalFeedback");
    var value = (input ? input.value.trim() : "").toUpperCase();

    if (!value) {
        feedback.className = "final-feedback error";
        feedback.textContent = "\u274C Bitte gebt das L\u00F6sungswort ein.";
        return;
    }

    if (value === SOLUTION_WORD) {
        gameState.completed = true;
        saveState();
        feedback.className = "final-feedback success";
        feedback.textContent = "\u{1F389} Perfekt! Das ist das richtige L\u00F6sungswort!";
        launchConfetti();
        setTimeout(function() {
            window.location.href = getBasePath() + "completion.html";
        }, 2200);
    } else {
        feedback.className = "final-feedback error";
        feedback.textContent = "\u274C Das ist leider nicht das richtige L\u00F6sungswort.";
        if (input) { input.classList.add("shake"); setTimeout(function() { input.classList.remove("shake"); }, 500); }
    }
}

// ─── UI Builders ────────────────────────────────────────
function buildLetterBoxes(containerId, cssClass) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    for (var i = 0; i < SOLUTION_WORD.length; i++) {
        var box = document.createElement("div");
        box.className = cssClass;
        box.id = containerId + "-" + i;
        box.textContent = "?";
        container.appendChild(box);
    }
    updateLetterBoxes(containerId);
}

function updateLetterBoxes(containerId) {
    for (var i = 0; i < stations.length; i++) {
        var station = stations[i];
        var box = document.getElementById(containerId + "-" + i);
        if (!box) continue;
        if (gameState.solvedStations.indexOf(station.id) !== -1) {
            box.textContent = station.letter;
            box.classList.add("found");
        } else {
            box.textContent = "?";
            box.classList.remove("found");
        }
    }
}

function updateAllLetterBoxes() {
    updateLetterBoxes("headerLetters");
    updateLetterBoxes("finalLetters");
    var progressEl = document.getElementById("progressText");
    if (progressEl) {
        progressEl.textContent = gameState.solvedStations.length + " / " + SOLUTION_WORD.length;
    }
}

function toggleHint(stationId) {
    var hint = document.getElementById("hint-" + stationId);
    if (hint) {
        if (hint.classList.contains("visible")) {
            hint.classList.remove("visible");
        } else {
            hint.classList.add("visible");
        }
    }
}

// ─── Particles ──────────────────────────────────────────
function initParticles() {
    var container = document.querySelector(".particles");
    if (!container) return;
    for (var i = 0; i < 15; i++) {
        var p = document.createElement("div");
        p.className = "particle";
        p.style.left = Math.random() * 100 + "%";
        p.style.animationDuration = (Math.random() * 12 + 8) + "s";
        p.style.animationDelay = (Math.random() * 10) + "s";
        var size = (Math.random() * 2 + 1.5) + "px";
        p.style.width = size;
        p.style.height = size;
        container.appendChild(p);
    }
}

// ─── Confetti ───────────────────────────────────────────
function launchConfetti() {
    var container = document.getElementById("confettiContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "confettiContainer";
        container.className = "confetti-container";
        document.body.appendChild(container);
    }
    var colors = ["#e8a824", "#7f5af0", "#2ecc71", "#e74c3c", "#3498db", "#f39c12", "#1abc9c", "#fd79a8"];
    for (var i = 0; i < 100; i++) {
        var piece = document.createElement("div");
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
    setTimeout(function() { container.innerHTML = ""; }, 5000);
}

// ─── SVG Icons ──────────────────────────────────────────
var ICON_ARROW_LEFT = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';

var ICON_ARROW_RIGHT = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>';

var ICON_SEARCH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';

var ICON_COMPASS = '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" stop-color="#f5d76e"/><stop offset="100%" stop-color="#e8a824"/>' +
    '</linearGradient></defs>' +
    '<circle cx="100" cy="100" r="92" stroke="url(#goldGrad)" fill="none" stroke-width="2" opacity="0.4"/>' +
    '<circle cx="100" cy="100" r="80" stroke="url(#goldGrad)" fill="none" stroke-width="1" opacity="0.2"/>' +
    '<circle cx="100" cy="100" r="68" stroke="url(#goldGrad)" fill="none" stroke-width="0.5" opacity="0.15" stroke-dasharray="4 4"/>' +
    '<line x1="100" y1="12" x2="100" y2="22" stroke="#f5d76e" stroke-width="2" opacity="0.5"/>' +
    '<line x1="100" y1="178" x2="100" y2="188" stroke="#f5d76e" stroke-width="2" opacity="0.3"/>' +
    '<line x1="12" y1="100" x2="22" y2="100" stroke="#f5d76e" stroke-width="2" opacity="0.3"/>' +
    '<line x1="178" y1="100" x2="188" y2="100" stroke="#f5d76e" stroke-width="2" opacity="0.3"/>' +
    '<g class="compass-needle">' +
    '<polygon points="100,25 108,95 92,95" fill="url(#goldGrad)" opacity="0.85"/>' +
    '<polygon points="100,175 108,105 92,105" fill="#a7a9be" opacity="0.3"/>' +
    '</g>' +
    '<circle cx="100" cy="100" r="6" fill="url(#goldGrad)"/>' +
    '<circle cx="100" cy="100" r="3" fill="#0b0b1a"/>' +
    '<text x="100" y="10" text-anchor="middle" fill="#f5d76e" font-family="Poppins,sans-serif" font-size="13" font-weight="700">N</text>' +
    '<text x="100" y="198" text-anchor="middle" fill="#a7a9be" font-family="Poppins,sans-serif" font-size="11" opacity="0.4">S</text>' +
    '<text x="197" y="104" text-anchor="end" fill="#a7a9be" font-family="Poppins,sans-serif" font-size="11" opacity="0.4">O</text>' +
    '<text x="4" y="104" text-anchor="start" fill="#a7a9be" font-family="Poppins,sans-serif" font-size="11" opacity="0.4">W</text>' +
    '</svg>';

// ═══════════════════════════════════════════════════════════
// RENDER FUNCTIONS
// ═══════════════════════════════════════════════════════════

// ─── Background HTML ────────────────────────────────────
function getBgHTML() {
    return '<div class="bg-decoration bg-orb bg-orb-1"></div>' +
        '<div class="bg-decoration bg-orb bg-orb-2"></div>' +
        '<div class="particles"></div>';
}

// ─── Render: Start Screen ───────────────────────────────
function renderStartScreen() {
    var app = document.getElementById("app");
    if (!app) return;

    app.innerHTML =
        getBgHTML() +
        '<div class="page-content">' +
            '<div class="start-screen">' +
                '<div class="compass-container">' + ICON_COMPASS + '</div>' +
                '<h1 class="start-title">Frankfurter Berg<br>Schnitzeljagd</h1>' +
                '<p class="start-subtitle">10 Stationen &bull; 10 Buchstaben &bull; 1 L\u00F6sungswort</p>' +
                '<p class="start-description">' +
                    'Erkundet Frankfurter Berg, l\u00F6st die R\u00E4tsel an jeder Station und sammelt die L\u00F6sungsbuchstaben. ' +
                    'Am Ende ergibt sich das geheime L\u00F6sungswort!' +
                '</p>' +
                '<div class="start-features">' +
                    '<div class="start-feature"><div class="start-feature-icon">\u{1F50D}</div><span class="start-feature-label">R\u00E4tsel l\u00F6sen</span></div>' +
                    '<div class="start-feature"><div class="start-feature-icon">\u{1F4CD}</div><span class="start-feature-label">Orte erkunden</span></div>' +
                    '<div class="start-feature"><div class="start-feature-icon">\u{1F524}</div><span class="start-feature-label">Buchstaben sammeln</span></div>' +
                    '<div class="start-feature"><div class="start-feature-icon">\u{1F3C6}</div><span class="start-feature-label">L\u00F6sungswort finden</span></div>' +
                '</div>' +
                '<button class="btn-start" onclick="startGame()">Schnitzeljagd starten</button>' +
            '</div>' +
        '</div>';

    initParticles();
}

function startGame() {
    gameState.started = true;
    saveState();
    renderOverview();
}

// ─── Render: Overview / Index ───────────────────────────
function renderOverview() {
    loadState();

    if (!gameState.started) {
        renderStartScreen();
        return;
    }

    if (gameState.completed) {
        window.location.href = getBasePath() + "completion.html";
        return;
    }

    var app = document.getElementById("app");
    if (!app) return;

    var trailHTML = "";
    for (var i = 0; i < stations.length; i++) {
        var station = stations[i];
        var isSolved = gameState.solvedStations.indexOf(station.id) !== -1;
        var statusClass = !station.enabled ? "disabled" : (isSolved ? "solved" : "active");
        var statusText = !station.enabled
            ? '<span class="badge-coming-soon">\u{1F6A7} Bald verf\u00FCgbar</span>'
            : (isSolved ? "\u2705 Gel\u00F6st" : "Noch nicht gel\u00F6st");
        var href = station.enabled ? getStationPath(station.id) : "javascript:void(0)";

        trailHTML +=
            '<a href="' + href + '" class="trail-item ' + statusClass + '">' +
                '<div class="trail-dot"></div>' +
                '<div class="trail-card">' +
                    '<div class="trail-card-icon">' + station.icon + '</div>' +
                    '<div class="trail-card-info">' +
                        '<div class="trail-card-title">Station ' + station.id + ': ' + station.title + '</div>' +
                        '<div class="trail-card-status">' + statusText + '</div>' +
                    '</div>' +
                    '<div class="trail-card-letter">' + (isSolved ? station.letter : "?") + '</div>' +
                    '<div class="trail-card-arrow">' + ICON_ARROW_RIGHT + '</div>' +
                '</div>' +
            '</a>';
    }

    var allSolved = allEnabledStationsSolved();
    var solvedCount = gameState.solvedStations.length;

    var finalSectionHTML = '';
    if (allSolved) {
        finalSectionHTML =
            '<div class="final-section" id="finalSection">' +
                '<div class="final-card">' +
                    '<div class="final-card-title">\u{1F3C6} L\u00F6sungswort eingeben</div>' +
                    '<div class="final-letter-boxes" id="finalLetters"></div>' +
                    '<div class="final-input-group">' +
                        '<input type="text" class="final-input" id="finalInput" placeholder="?????????" maxlength="10" autocomplete="off" autocapitalize="characters" onkeydown="if(event.key===\'Enter\') checkFinalSolution()">' +
                        '<button class="btn-final" onclick="checkFinalSolution()">Pr\u00FCfen</button>' +
                    '</div>' +
                    '<div class="final-feedback" id="finalFeedback"></div>' +
                '</div>' +
            '</div>';
    } else {
        finalSectionHTML =
            '<div class="final-section">' +
                '<div class="final-card" style="opacity:0.5;">' +
                    '<div class="final-card-title">\u{1F512} L\u00F6sungswort</div>' +
                    '<div class="final-letter-boxes" id="finalLetters"></div>' +
                    '<p style="color:var(--text-muted);font-size:0.9rem;margin-top:0.5rem;">' +
                        'L\u00F6st zuerst alle Stationen, um das L\u00F6sungswort einzugeben.<br>' +
                        '<strong>' + solvedCount + ' von ' + getEnabledCount() + '</strong> Stationen gel\u00F6st.' +
                    '</p>' +
                '</div>' +
            '</div>';
    }

    app.innerHTML =
        getBgHTML() +
        '<div class="bg-decoration bg-orb bg-orb-3"></div>' +
        '<div class="page-content">' +
            '<nav class="navbar">' +
                '<div class="navbar-inner">' +
                    '<div class="navbar-top">' +
                        '<span class="navbar-title">\u{1F5FA}\uFE0F Schnitzeljagd</span>' +
                        '<span class="navbar-progress-text" id="progressText">' + solvedCount + ' / ' + SOLUTION_WORD.length + '</span>' +
                    '</div>' +
                    '<div class="letter-boxes" id="headerLetters"></div>' +
                '</div>' +
            '</nav>' +
            '<div class="overview-section">' +
                '<div class="overview-header">' +
                    '<h2>\u{1F5FA}\uFE0F Eure Route</h2>' +
                    '<p>Tippt auf eine Station, um das R\u00E4tsel zu \u00F6ffnen</p>' +
                '</div>' +
                '<div class="trail">' + trailHTML + '</div>' +
            '</div>' +
            finalSectionHTML +
            '<div class="page-footer">' +
                '<div>Frankfurter Berg Schnitzeljagd</div>' +
                '<button class="btn-reset-small" onclick="resetGame()">\u{1F504} Fortschritt zur\u00FCcksetzen</button>' +
            '</div>' +
        '</div>' +
        '<div class="confetti-container" id="confettiContainer"></div>';

    buildLetterBoxes("headerLetters", "letter-box");
    buildLetterBoxes("finalLetters", "final-letter-box");
    initParticles();
}

// ─── Render: Station Page ───────────────────────────────
function renderStationPage(stationId) {
    loadState();
    var station = null;
    var stationIndex = -1;
    for (var i = 0; i < stations.length; i++) {
        if (stations[i].id === stationId) { station = stations[i]; stationIndex = i; break; }
    }
    if (!station) return;

    var isSolved = gameState.solvedStations.indexOf(stationId) !== -1;
    var isSubSolved = gameState.solvedSubRiddles.indexOf(stationId) !== -1;
    var prevId = stationId > 1 ? stationId - 1 : null;
    var nextId = stationId < stations.length ? stationId + 1 : null;

    var app = document.getElementById("app");
    if (!app) return;

    // Build question HTML — reveal code if sub-riddle solved
    var questionHTML = station.question;
    if (station.subRiddle && isSubSolved) {
        questionHTML = questionHTML.replace("????", '<span style="color:var(--success);font-weight:700;">' + station.subRiddle.revealText + '</span>');
    }

    // Sub-riddle HTML
    var subRiddleHTML = "";
    if (station.subRiddle) {
        if (isSubSolved) {
            subRiddleHTML =
                '<div class="sub-riddle-card solved">' +
                    '<div class="sub-riddle-label">\u{1F513} Unterr\u00E4tsel</div>' +
                    '<div class="sub-riddle-question">' + station.subRiddle.question + '</div>' +
                    '<div class="sub-riddle-success">\u2705 Gel\u00F6st! Code: <strong>' + station.subRiddle.revealText + '</strong></div>' +
                '</div>';
        } else {
            subRiddleHTML =
                '<div class="sub-riddle-card">' +
                    '<div class="sub-riddle-label">\u{1F512} Unterr\u00E4tsel</div>' +
                    '<div class="sub-riddle-question">' + station.subRiddle.question + '</div>' +
                    '<div class="input-group">' +
                        '<input type="text" class="answer-input" id="sub-answer-' + stationId + '" placeholder="Antwort..." autocomplete="off" autocapitalize="none" onkeydown="if(event.key===\'Enter\') checkSubAnswer(' + stationId + ')">' +
                        '<button class="btn-check" onclick="checkSubAnswer(' + stationId + ')">L\u00F6sen</button>' +
                    '</div>' +
                    '<div class="feedback" id="sub-feedback-' + stationId + '"></div>' +
                '</div>';
        }
    }

    // Solved banner
    var solvedBannerHTML = "";
    if (isSolved) {
        solvedBannerHTML =
            '<div class="solved-banner">' +
                '<div class="solved-banner-letter">' + station.letter + '</div>' +
                '<div class="solved-banner-info">' +
                    '<strong>Buchstabe ' + stationId + ' gefunden</strong>' +
                    'Station erfolgreich gel\u00F6st! \u{1F389}' +
                '</div>' +
            '</div>';
    }

    // Disabled notice
    var disabledHTML = "";
    if (!station.enabled) {
        disabledHTML = '<div class="disabled-notice">\u{1F6A7} Diese Station wird noch vorbereitet. Kommt bald!</div>';
    }

    // Hint
    var hintHTML = "";
    if (station.hint) {
        hintHTML =
            '<div class="hint-section">' +
                '<div class="hint-toggle" onclick="toggleHint(' + stationId + ')">\u{1F4A1} Tipp anzeigen</div>' +
                '<div class="hint-text" id="hint-' + stationId + '">' + station.hint + '</div>' +
            '</div>';
    }

    // Answer input (only if enabled, not solved, and sub-riddle solved if any)
    var answerInputHTML = "";
    if (station.enabled && !isSolved && (!station.subRiddle || isSubSolved)) {
        answerInputHTML =
            '<div class="input-group" id="input-group-' + stationId + '">' +
                '<input type="text" class="answer-input" id="answer-' + stationId + '" placeholder="Eure Antwort..." autocomplete="off" autocapitalize="none" onkeydown="if(event.key===\'Enter\') checkAnswer(' + stationId + ')">' +
                '<button class="btn-check" onclick="checkAnswer(' + stationId + ')">Pr\u00FCfen</button>' +
            '</div>' +
            '<div class="feedback" id="feedback-' + stationId + '"></div>';
    }

    // Solved state inside riddle card
    var solvedInCardHTML =
        '<div class="solved-banner" id="solved-' + stationId + '" style="display:' + (isSolved ? "flex" : "none") + ';margin-top:0.75rem;">' +
            '<div class="solved-banner-letter">' + station.letter + '</div>' +
            '<div class="solved-banner-info">' +
                '<strong>Buchstabe erhalten</strong>' +
                'Richtige Antwort! Weiter zur n\u00E4chsten Station.' +
            '</div>' +
        '</div>';

    // Navigation
    var navPrev = prevId
        ? '<a href="' + getStationPath(prevId) + '" class="nav-btn">' + ICON_ARROW_LEFT + ' Station ' + prevId + '</a>'
        : '<div class="nav-btn invisible">-</div>';
    var navNext = nextId
        ? '<a href="' + getStationPath(nextId) + '" class="nav-btn">Station ' + nextId + ' ' + ICON_ARROW_RIGHT + '</a>'
        : '<a href="' + getBasePath() + 'index.html" class="nav-btn">\u00DCbersicht ' + ICON_ARROW_RIGHT + '</a>';

    app.innerHTML =
        getBgHTML() +
        '<div class="page-content">' +
            '<nav class="navbar">' +
                '<div class="navbar-inner">' +
                    '<div class="navbar-top">' +
                        '<a href="' + getBasePath() + 'index.html" class="navbar-back">' + ICON_ARROW_LEFT + ' \u00DCbersicht</a>' +
                        '<span class="navbar-progress-text" id="progressText">' + gameState.solvedStations.length + ' / ' + SOLUTION_WORD.length + '</span>' +
                    '</div>' +
                    '<div class="letter-boxes" id="headerLetters"></div>' +
                '</div>' +
            '</nav>' +
            '<div class="station-hero">' +
                '<div class="station-hero-decoration"></div>' +
                '<span class="station-hero-icon">' + station.icon + '</span>' +
                '<div class="station-hero-number">' + stationId + '</div>' +
                '<h1 class="station-hero-title">' + station.title + '</h1>' +
                '<p class="station-hero-subtitle">Station ' + stationId + ' von ' + stations.length + '</p>' +
            '</div>' +
            '<div class="station-body">' +
                solvedBannerHTML +
                disabledHTML +
                subRiddleHTML +
                '<div class="riddle-card">' +
                    '<div class="riddle-label">' + ICON_SEARCH + ' R\u00E4tsel</div>' +
                    '<div class="riddle-question">' + questionHTML + '</div>' +
                    hintHTML +
                    answerInputHTML +
                    solvedInCardHTML +
                '</div>' +
            '</div>' +
            '<div class="station-nav-footer">' + navPrev + navNext + '</div>' +
        '</div>' +
        '<div class="confetti-container" id="confettiContainer"></div>';

    buildLetterBoxes("headerLetters", "letter-box");
    initParticles();
}

// ─── Render: Completion Page ────────────────────────────
function renderCompletion() {
    loadState();
    var app = document.getElementById("app");
    if (!app) return;

    app.innerHTML =
        getBgHTML() +
        '<div class="page-content">' +
            '<div class="completion-screen">' +
                '<div class="completion-trophy">\u{1F3C6}</div>' +
                '<h1 class="completion-title">Geschafft!</h1>' +
                '<div class="completion-word">' + SOLUTION_WORD + '</div>' +
                '<p class="completion-message">' +
                    'Herzlichen Gl\u00FCckwunsch! Ihr habt alle Stationen gemeistert und das L\u00F6sungswort gefunden. ' +
                    'Das war eine tolle Tour durch Frankfurter Berg! \u{1F389}' +
                '</p>' +
                '<button class="btn-reset" onclick="resetGame()">\u{1F504} Nochmal spielen</button>' +
            '</div>' +
        '</div>' +
        '<div class="confetti-container" id="confettiContainer"></div>';

    initParticles();
    setTimeout(launchConfetti, 500);
}
