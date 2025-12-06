let theme = localStorage.getItem("theme") || "light";
document.body.classList.add(theme);
// dark or light theme
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
    themeToggle.textContent = `Theme: ${theme}`;
    themeToggle.setAttribute("aria-pressed", theme === "dark");
    themeToggle.addEventListener("click", () => {
        theme = theme === "light" ? "dark" : "light";
        document.body.classList.remove("light", "dark");
        document.body.classList.add(theme);
        localStorage.setItem("theme", theme);
        themeToggle.textContent = `Theme: ${theme}`;
        themeToggle.setAttribute("aria-pressed", theme === "dark");
        showToast(`Theme changed to ${theme.toUpperCase()}`);
    });
}

// Settings toggle
const settingsToggle = document.getElementById("settings-toggle");
const settingsPanel = document.getElementById("settings-panel");
if (settingsToggle && settingsPanel) {
    settingsToggle.addEventListener("click", () => {
        settingsPanel.classList.toggle("hidden");
        settingsPanel.style.animation =
            settingsPanel.classList.contains("hidden")
                ? "fadeOut 0.25s forwards"
                : "fadeIn 0.25s forwards";
    });
}

// Export data
const exportBtn = document.getElementById("export-data");
if (exportBtn) {
    exportBtn.addEventListener("click", () => {
        const data = {
            todos: JSON.parse(localStorage.getItem("todos") || "[]"),
            goals: JSON.parse(localStorage.getItem("goals") || "[]"),
            initScriptNotes: JSON.parse(localStorage.getItem("privateNotes") || "[]"),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "dashboard-data.json";
        a.click();
        showToast("Data exported successfully");
    });
}

const showQuoteCheckbox = document.getElementById("show-quote");
const showWeatherCheckbox = document.getElementById("show-weather");
const quoteWidget = document.getElementById("quote-widget");
const weatherWidget = document.getElementById("weather-widget");

function applyWidgetToggles() {
    const showQuote = JSON.parse(localStorage.getItem("showQuote") || "true");
    const showWeather = JSON.parse(localStorage.getItem("showWeather") || "true");
    if (showQuoteCheckbox) { showQuoteCheckbox.checked = showQuote; }
    if (showWeatherCheckbox) { showWeatherCheckbox.checked = showWeather; }

    if (quoteWidget) quoteWidget.style.display = showQuote ? "" : "none";
    if (weatherWidget) weatherWidget.style.display = showWeather ? "" : "none";
}

if (showQuoteCheckbox) {
    showQuoteCheckbox.addEventListener("change", (e) => {
        localStorage.setItem("showQuote", JSON.stringify(e.target.checked));
        applyWidgetToggles();
    });
}
if (showWeatherCheckbox) {
    showWeatherCheckbox.addEventListener("change", (e) => {
        localStorage.setItem("showWeather", JSON.stringify(e.target.checked));
        applyWidgetToggles();
    });
}

applyWidgetToggles();

// Safe importer
function safeLoad(path, initName) {
    import(path).then(mod => {
        if (mod && typeof mod[initName] === "function") {
            try { mod[initName](); }
            catch (err) { console.error(`Error running ${initName}:`, err); }
        } else {
            console.warn(`Module ${path} did not export ${initName}`);
        }
    }).catch(err => {
        console.error("Import failed for", path, err);
    });
}

// Load modules
safeLoad('./components/clock.js', 'initClock');

safeLoad('./components/todo.js', 'initTodo');

safeLoad('./components/goals.js', 'initGoals');

safeLoad('./components/quote.js', 'initQuote');

safeLoad('./components/calender.js', 'initCalendar');

safeLoad('./components/script.js', 'initScriptNotes');

// Toast system
function showToast(message, error = false) {
    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.textContent = message;
    if (error) toast.style.background = "#e63946";
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "0"; }, 2000);
    setTimeout(() => { toast.remove(); }, 2600);
}

// Tiny animations injected
const styleTag = document.createElement("style");
styleTag.textContent = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-6px); } }
.toast-message { transition: opacity 0.4s ease; }
`;
document.head.appendChild(styleTag);
