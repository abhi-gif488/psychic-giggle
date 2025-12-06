export function initClock() {
    const clockDisplay = document.getElementById('clock-display');
    if (!clockDisplay) return;

    const updateClock = () => {
        const now = new Date();
        const hours24 = now.getHours();
        const hours = hours24 % 12 || 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ampm = hours24 >= 12 ? 'PM' : 'AM';

        const digitalTime = `${hours.toString().padStart(2, '0')}:` +
                            `${minutes.toString().padStart(2, '0')}:` +
                            `${seconds.toString().padStart(2, '0')} ${ampm}`;

        clockDisplay.innerHTML = `
            <div class="digital">${digitalTime}</div>

            <div class="analog">
                <div class="hand hour" style="transform: rotate(${(hours % 12) * 30 + minutes * 0.5}deg);"></div>
                <div class="hand minute" style="transform: rotate(${minutes * 6}deg);"></div>
                <div class="hand second" style="transform: rotate(${seconds * 6}deg);"></div>
            </div>
        `;
    };

    updateClock();
    setInterval(updateClock, 1000);
}
