

// Exported initializer function
export function initScriptNotes() {

    // TEXT NOTES (Auto Load + Save on Button Click)
    const notesText = document.getElementById("notes-text");
    const saveNotesBtn = document.getElementById("save-notes-btn");

    // Load saved notes from localStorage
    function loadNotes() {
        notesText.value = localStorage.getItem("privateNotes") || "";
    }

    // Save notes to localStorage
    function saveNotes() {
        localStorage.setItem("privateNotes", notesText.value);
        alert("Private Notes Saved Successfully!!");
    }

    // Event listeners
    saveNotesBtn.addEventListener("click", saveNotes);

    // Auto-load notes on page load
    loadNotes();
}
