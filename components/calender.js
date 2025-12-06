export function initCalendar() {
    const container = document.getElementById("calendar-container");
    if (!container) return;

    function renderCalendar() {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        let html = `
        <div class="calendar-header">
            <span>${monthNames[month]} ${year}</span>
        </div>
        <div class="calendar-grid">
            <div class="day-label">Sun</div>
            <div class="day-label">Mon</div>
            <div class="day-label">Tue</div>
            <div class="day-label">Wed</div>
            <div class="day-label">Thu</div>
            <div class="day-label">Fri</div>
            <div class="day-label">Sat</div>
        `;

        // Blank cells before month start
        for (let i = 0; i < firstDay; i++) {
            html += `<div class="empty"></div>`;
        }

        // Fill days
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday =
                day === now.getDate() &&
                month === now.getMonth() &&
                year === now.getFullYear();

            html += `<div class="day ${isToday ? "today" : ""}">${day}</div>`;
        }

        html += "</div>";
        container.innerHTML = html;
    }

    renderCalendar();
}
